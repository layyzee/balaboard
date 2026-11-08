import { useEffect, useRef, useState, useCallback } from 'react';

export function useRealtimeSync({
  currentUser,
  roomId = 'main',
  onRemoteStateSync,
  onRemoteNoteCreate,
  onRemoteNoteUpdate,
  onRemoteNoteDelete,
  onRemoteNotesBatch,
  onRemotePhaseChange,
  onRemoteRevealToggle,
  onRemoteTemplateChange,
  onRemoteActionItemsUpdate,
  onRemoteDrawingAdd,
  onRemoteDrawingsClear,
  onRemoteConnectorAdd,
  onRemoteConnectorDelete,
  onRemoteSpotlight,
  onRemoteSpotlightRelease
}) {
  const wsRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState(new Map());

  const lastCursorSentRef = useRef(0);

  // Connect to WebSocket
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    const wsUrl = (window.location.port === '5175')
      ? `${protocol}//${host}:5176`
      : `${protocol}//${window.location.host}`;

    setConnectionStatus('connecting');

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus('connected');
      ws.send(JSON.stringify({
        type: 'JOIN_ROOM',
        roomId,
        payload: {
          user: currentUser
        }
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const { type, payload } = msg;

        switch (type) {
          case 'ROOM_STATE_SYNC': {
            setOnlineUsers(payload.onlineUsers || []);
            if (onRemoteStateSync) onRemoteStateSync(payload);
            break;
          }

          case 'PRESENCE_UPDATED': {
            setOnlineUsers(payload.onlineUsers || []);
            if (payload.leftUserId) {
              setRemoteCursors(prev => {
                const next = new Map(prev);
                next.delete(payload.leftUserId);
                return next;
              });
            }
            break;
          }

          case 'CURSOR_UPDATED': {
            setRemoteCursors(prev => {
              const next = new Map(prev);
              next.set(payload.userId, {
                x: payload.x,
                y: payload.y,
                name: payload.name,
                avatar: payload.avatar,
                color: payload.color || '#6366f1',
                updatedAt: Date.now()
              });
              return next;
            });
            break;
          }

          case 'CURSOR_REMOVED': {
            setRemoteCursors(prev => {
              const next = new Map(prev);
              next.delete(payload.userId);
              return next;
            });
            break;
          }

          case 'NOTE_CREATED': {
            if (onRemoteNoteCreate) onRemoteNoteCreate(payload.note);
            break;
          }

          case 'NOTE_UPDATED': {
            if (onRemoteNoteUpdate) onRemoteNoteUpdate(payload.id, payload.updates);
            break;
          }

          case 'NOTE_DELETED': {
            if (onRemoteNoteDelete) onRemoteNoteDelete(payload.id);
            break;
          }

          case 'NOTES_BATCH_UPDATE': {
            if (onRemoteNotesBatch) onRemoteNotesBatch(payload.notes);
            break;
          }

          case 'DRAWING_ADDED': {
            if (onRemoteDrawingAdd) onRemoteDrawingAdd(payload.stroke);
            break;
          }

          case 'DRAWINGS_CLEARED': {
            if (onRemoteDrawingsClear) onRemoteDrawingsClear();
            break;
          }

          case 'CONNECTOR_ADDED': {
            if (onRemoteConnectorAdd) onRemoteConnectorAdd(payload.connector);
            break;
          }

          case 'CONNECTOR_DELETED': {
            if (onRemoteConnectorDelete) onRemoteConnectorDelete(payload.id);
            break;
          }

          case 'PHASE_CHANGED': {
            if (onRemotePhaseChange) onRemotePhaseChange(payload.phaseIndex);
            break;
          }

          case 'REVEAL_TOGGLED': {
            if (onRemoteRevealToggle) onRemoteRevealToggle(payload.areNotesRevealed);
            break;
          }

          case 'TEMPLATE_CHANGED': {
            if (onRemoteTemplateChange) onRemoteTemplateChange(payload.templateId, payload.defaultNotes);
            break;
          }

          case 'ACTION_ITEMS_UPDATED': {
            if (onRemoteActionItemsUpdate) onRemoteActionItemsUpdate(payload.actionItems);
            break;
          }

          case 'SPOTLIGHT_VIEWPORT': {
            if (onRemoteSpotlight) onRemoteSpotlight(payload);
            break;
          }

          case 'SPOTLIGHT_RELEASED': {
            if (onRemoteSpotlightRelease) onRemoteSpotlightRelease(payload);
            break;
          }
        }
      } catch (err) {
        console.error('Error parsing sync message:', err);
      }
    };

    ws.onclose = () => {
      setConnectionStatus('disconnected');
    };

    ws.onerror = () => {
      setConnectionStatus('disconnected');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [roomId, currentUser?.id]);

  // Periodic cleanup of stale cursors
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setRemoteCursors(prev => {
        let changed = false;
        const next = new Map(prev);
        for (const [id, data] of next.entries()) {
          if (now - data.updatedAt > 10000) {
            next.delete(id);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = useCallback((type, payload) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, roomId, payload }));
    }
  }, [roomId]);

  const sendCursorMove = useCallback((worldX, worldY) => {
    const now = Date.now();
    if (now - lastCursorSentRef.current > 33) {
      lastCursorSentRef.current = now;
      sendMessage('CURSOR_MOVE', { x: worldX, y: worldY });
    }
  }, [sendMessage]);

  const sendNoteCreate = useCallback((note) => {
    sendMessage('NOTE_CREATED', { note });
  }, [sendMessage]);

  const sendNoteUpdate = useCallback((id, updates) => {
    sendMessage('NOTE_UPDATED', { id, updates });
  }, [sendMessage]);

  const sendNoteDelete = useCallback((id) => {
    sendMessage('NOTE_DELETED', { id });
  }, [sendMessage]);

  const sendNotesBatch = useCallback((notes) => {
    sendMessage('NOTES_BATCH_UPDATE', { notes });
  }, [sendMessage]);

  const sendDrawingAdd = useCallback((stroke) => {
    sendMessage('DRAWING_ADDED', { stroke });
  }, [sendMessage]);

  const sendDrawingsClear = useCallback(() => {
    sendMessage('DRAWINGS_CLEARED', {});
  }, [sendMessage]);

  const sendConnectorAdd = useCallback((connector) => {
    sendMessage('CONNECTOR_ADDED', { connector });
  }, [sendMessage]);

  const sendConnectorDelete = useCallback((id) => {
    sendMessage('CONNECTOR_DELETED', { id });
  }, [sendMessage]);

  const sendPhaseChange = useCallback((phaseIndex) => {
    sendMessage('PHASE_CHANGED', { phaseIndex });
  }, [sendMessage]);

  const sendRevealToggle = useCallback((areNotesRevealed) => {
    sendMessage('REVEAL_TOGGLED', { areNotesRevealed });
  }, [sendMessage]);

  const sendTemplateChange = useCallback((templateId, defaultNotes) => {
    sendMessage('TEMPLATE_CHANGED', { templateId, defaultNotes });
  }, [sendMessage]);

  const sendActionItemsUpdate = useCallback((actionItems) => {
    sendMessage('ACTION_ITEMS_UPDATED', { actionItems });
  }, [sendMessage]);

  const sendSpotlight = useCallback((pan, scale) => {
    sendMessage('SPOTLIGHT_VIEWPORT', { pan, scale });
  }, [sendMessage]);

  const sendSpotlightRelease = useCallback(() => {
    sendMessage('SPOTLIGHT_RELEASED', {});
  }, [sendMessage]);

  return {
    connectionStatus,
    onlineUsers,
    remoteCursors,
    sendCursorMove,
    sendNoteCreate,
    sendNoteUpdate,
    sendNoteDelete,
    sendNotesBatch,
    sendDrawingAdd,
    sendDrawingsClear,
    sendConnectorAdd,
    sendConnectorDelete,
    sendPhaseChange,
    sendRevealToggle,
    sendTemplateChange,
    sendActionItemsUpdate,
    sendSpotlight,
    sendSpotlightRelease
  };
}
