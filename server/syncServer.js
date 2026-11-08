// BalaBoard Real-Time WebSocket Synchronization Server
// Powers live multi-user retrospectives, real-time stickies, Miro live cursors & collaborative sketches

import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');

const PORT = process.env.PORT || process.env.WS_PORT || 5176;
const HOST = '0.0.0.0';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Health Check
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      service: 'BalaBoard Sync Server', 
      port: PORT,
      activeRooms: rooms.size,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Serve static files from dist/ if available (for production / Render)
  if (fs.existsSync(DIST_DIR)) {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/' || !reqPath) reqPath = '/index.html';

    let filePath = path.join(DIST_DIR, reqPath);

    // If file doesn't exist, fall back to index.html for SPA routing
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
        return;
      } catch (err) {
        console.error('Error serving file:', filePath, err);
      }
    }
  }

  // Fallback API response if dist is not built
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    status: 'ok', 
    service: 'BalaBoard Sync Server', 
    port: PORT,
    rooms: rooms.size 
  }));
});

const wss = new WebSocketServer({ server });

// In-memory room store: roomId -> RoomState
const rooms = new Map();

function getOrCreateRoom(roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, {
      id: roomId,
      templateId: 'quick',
      meetingSettings: {
        meetingTitle: 'Sprint Retrospective',
        durationMinutes: 45,
        isPrivateMode: true,
        enableIcebreaker: true,
        voteLimit: 5
      },
      currentPhaseIndex: 0,
      areNotesRevealed: false,
      stickyNotes: [],
      actionItems: [],
      drawings: [],
      connectors: [],
      clients: new Map() // ws -> { id, name, avatar, role, color }
    });
  }
  return rooms.get(roomId);
}

function broadcastToRoom(roomId, message, senderWs = null) {
  const room = rooms.get(roomId);
  if (!room) return;

  const data = JSON.stringify(message);
  for (const [clientWs] of room.clients.entries()) {
    if (clientWs !== senderWs && clientWs.readyState === WebSocket.OPEN) {
      try {
        clientWs.send(data);
      } catch (err) {
        console.error('Error sending message to client:', err.message);
      }
    }
  }
}

wss.on('connection', (ws) => {
  let currentRoomId = null;
  let currentUser = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      const { type, roomId, payload } = msg;

      if (type === 'JOIN_ROOM') {
        currentRoomId = roomId || 'main';
        currentUser = {
          id: payload.user?.id || 'usr-' + Math.random().toString(36).substring(2, 8),
          name: payload.user?.name || 'Teammate',
          avatar: payload.user?.avatar || '🚀',
          role: payload.user?.role || 'Team Member',
          color: payload.user?.color || '#6366f1'
        };

        const room = getOrCreateRoom(currentRoomId);
        room.clients.set(ws, currentUser);

        if (currentRoomId === 'sandbox') {
          room.areNotesRevealed = true;
          room.meetingSettings.isPrivateMode = false;
        }

        // If client provided initial state and room is empty, adopt it
        if (room.stickyNotes.length === 0 && payload.initialNotes?.length > 0) {
          room.stickyNotes = payload.initialNotes;
          if (payload.templateId) room.templateId = payload.templateId;
          if (payload.meetingSettings) room.meetingSettings = payload.meetingSettings;
        }

        // Send full room state to newly joined client
        ws.send(JSON.stringify({
          type: 'ROOM_STATE_SYNC',
          payload: {
            templateId: room.templateId,
            meetingSettings: room.meetingSettings,
            currentPhaseIndex: room.currentPhaseIndex,
            areNotesRevealed: room.areNotesRevealed,
            stickyNotes: room.stickyNotes,
            actionItems: room.actionItems,
            drawings: room.drawings,
            connectors: room.connectors,
            onlineUsers: Array.from(room.clients.values())
          }
        }));

        // Broadcast updated online presence to other participants
        broadcastToRoom(currentRoomId, {
          type: 'PRESENCE_UPDATED',
          payload: {
            onlineUsers: Array.from(room.clients.values()),
            joinedUser: currentUser
          }
        }, ws);

        console.log(`[BalaBoard] User "${currentUser.name}" joined room "${currentRoomId}" (Total: ${room.clients.size})`);
      }

      if (!currentRoomId) return;
      const room = rooms.get(currentRoomId);
      if (!room) return;

      switch (type) {
        case 'CURSOR_MOVE': {
          broadcastToRoom(currentRoomId, {
            type: 'CURSOR_UPDATED',
            payload: {
              userId: currentUser?.id,
              name: currentUser?.name,
              avatar: currentUser?.avatar,
              color: currentUser?.color,
              x: payload.x,
              y: payload.y
            }
          }, ws);
          break;
        }

        case 'NOTE_CREATED': {
          room.stickyNotes.push(payload.note);
          broadcastToRoom(currentRoomId, {
            type: 'NOTE_CREATED',
            payload: { note: payload.note }
          }, ws);
          break;
        }

        case 'NOTE_UPDATED': {
          const idx = room.stickyNotes.findIndex(n => n.id === payload.id);
          if (idx !== -1) {
            room.stickyNotes[idx] = { ...room.stickyNotes[idx], ...payload.updates };
          }
          broadcastToRoom(currentRoomId, {
            type: 'NOTE_UPDATED',
            payload: { id: payload.id, updates: payload.updates }
          }, ws);
          break;
        }

        case 'NOTE_DELETED': {
          room.stickyNotes = room.stickyNotes.filter(n => n.id !== payload.id);
          broadcastToRoom(currentRoomId, {
            type: 'NOTE_DELETED',
            payload: { id: payload.id }
          }, ws);
          break;
        }

        case 'NOTES_BATCH_UPDATE': {
          room.stickyNotes = payload.notes;
          broadcastToRoom(currentRoomId, {
            type: 'NOTES_BATCH_UPDATE',
            payload: { notes: payload.notes }
          }, ws);
          break;
        }

        case 'DRAWING_ADDED': {
          room.drawings = room.drawings || [];
          room.drawings.push(payload.stroke);
          broadcastToRoom(currentRoomId, {
            type: 'DRAWING_ADDED',
            payload: { stroke: payload.stroke }
          }, ws);
          break;
        }

        case 'DRAWINGS_CLEARED': {
          room.drawings = [];
          broadcastToRoom(currentRoomId, {
            type: 'DRAWINGS_CLEARED'
          }, ws);
          break;
        }

        case 'CONNECTOR_ADDED': {
          room.connectors = room.connectors || [];
          room.connectors.push(payload.connector);
          broadcastToRoom(currentRoomId, {
            type: 'CONNECTOR_ADDED',
            payload: { connector: payload.connector }
          }, ws);
          break;
        }

        case 'CONNECTOR_DELETED': {
          room.connectors = (room.connectors || []).filter(c => c.id !== payload.id);
          broadcastToRoom(currentRoomId, {
            type: 'CONNECTOR_DELETED',
            payload: { id: payload.id }
          }, ws);
          break;
        }

        case 'PHASE_CHANGED': {
          room.currentPhaseIndex = payload.phaseIndex;
          broadcastToRoom(currentRoomId, {
            type: 'PHASE_CHANGED',
            payload: { phaseIndex: payload.phaseIndex }
          }, ws);
          break;
        }

        case 'REVEAL_TOGGLED': {
          room.areNotesRevealed = payload.areNotesRevealed;
          broadcastToRoom(currentRoomId, {
            type: 'REVEAL_TOGGLED',
            payload: { areNotesRevealed: payload.areNotesRevealed }
          }, ws);
          break;
        }

        case 'TEMPLATE_CHANGED': {
          room.templateId = payload.templateId;
          if (payload.defaultNotes) {
            room.stickyNotes = payload.defaultNotes;
          }
          broadcastToRoom(currentRoomId, {
            type: 'TEMPLATE_CHANGED',
            payload: {
              templateId: payload.templateId,
              defaultNotes: payload.defaultNotes
            }
          }, ws);
          break;
        }

        case 'ACTION_ITEMS_UPDATED': {
          room.actionItems = payload.actionItems;
          broadcastToRoom(currentRoomId, {
            type: 'ACTION_ITEMS_UPDATED',
            payload: { actionItems: payload.actionItems }
          }, ws);
          break;
        }

        case 'MEETING_SETTINGS_UPDATED': {
          room.meetingSettings = payload.meetingSettings;
          broadcastToRoom(currentRoomId, {
            type: 'MEETING_SETTINGS_UPDATED',
            payload: { meetingSettings: payload.meetingSettings }
          }, ws);
          break;
        }

        case 'SPOTLIGHT_VIEWPORT': {
          broadcastToRoom(currentRoomId, {
            type: 'SPOTLIGHT_VIEWPORT',
            payload: {
              pan: payload.pan,
              scale: payload.scale,
              facilitatorName: currentUser?.name || 'Facilitator',
              facilitatorAvatar: currentUser?.avatar || '👑'
            }
          }, ws);
          break;
        }

        case 'SPOTLIGHT_RELEASED': {
          broadcastToRoom(currentRoomId, {
            type: 'SPOTLIGHT_RELEASED',
            payload: {
              facilitatorName: currentUser?.name || 'Facilitator'
            }
          }, ws);
          break;
        }
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err.message);
    }
  });

  ws.on('close', () => {
    if (currentRoomId && rooms.has(currentRoomId)) {
      const room = rooms.get(currentRoomId);
      room.clients.delete(ws);

      broadcastToRoom(currentRoomId, {
        type: 'PRESENCE_UPDATED',
        payload: {
          onlineUsers: Array.from(room.clients.values()),
          leftUserId: currentUser?.id
        }
      });

      broadcastToRoom(currentRoomId, {
        type: 'CURSOR_REMOVED',
        payload: { userId: currentUser?.id }
      });

      console.log(`[BalaBoard] User "${currentUser?.name}" disconnected from room "${currentRoomId}" (Remaining: ${room.clients.size})`);
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`==================================================`);
  console.log(`⚡ BalaBoard Real-Time Sync Server is live!`);
  console.log(`   WebSocket URL: ws://${HOST}:${PORT}`);
  console.log(`==================================================`);
});
