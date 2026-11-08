import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { TEMPLATES } from './constants/templates';
import Toolbar, { RETRO_PHASES } from './components/Toolbar';
import Canvas from './components/Canvas';
import Minimap from './components/Minimap';
import CanvasToolPalette from './components/CanvasToolPalette';
import PreRetroSetupModal from './components/PreRetroSetupModal';
import UserLoginModal, { PRESET_USERS } from './components/UserLoginModal';
import JoinRoomModal from './components/JoinRoomModal';
import ShareBoardModal from './components/ShareBoardModal';
import ActionItemsDrawer from './components/ActionItemsDrawer';
import AiRetroModal from './components/AiRetroModal';
import IntegrationsModal from './components/IntegrationsModal';
import JiraIssueModal from './components/JiraIssueModal';
import RecruiterTourModal from './components/RecruiterTourModal';
import RetroAnalyticsModal from './components/RetroAnalyticsModal';
import RecruiterSandboxModal from './components/RecruiterSandboxModal';
import { RECRUITER_SANDBOX_NOTES, RECRUITER_SANDBOX_ACTIONS } from './constants/sandboxData';
import { useRealtimeSync } from './hooks/useRealtimeSync';
import { playSound } from './utils/sound';

export default function App() {
  // Room ID from URL (?room=sprint-24) or default to 'main'
  const [roomId, setRoomId] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('room') || 'main';
  });

  // Current User / Facilitator State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('balaboard_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return PRESET_USERS[0]; // Bala (Scrum Master)
  });

  // Toolbar Dock Position & Minimize State
  const [dockPosition, setDockPosition] = useState(() => {
    return localStorage.getItem('balaboard_dock_position') || 'top';
  });

  const [isMinimized, setIsMinimized] = useState(() => {
    return localStorage.getItem('balaboard_is_minimized') === 'true';
  });

  // Meeting Settings State
  const [meetingSettings, setMeetingSettings] = useState(() => {
    const saved = localStorage.getItem('balaboard_meeting_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      meetingTitle: 'Sprint 24 Retrospective',
      durationMinutes: 45,
      isPrivateMode: true,
      enableIcebreaker: true,
      voteLimit: 5
    };
  });

  // Active Template
  const [activeTemplate, setActiveTemplate] = useState(() => {
    const saved = localStorage.getItem('balaboard_active_template');
    return saved ? (TEMPLATES[saved] || TEMPLATES.quick) : TEMPLATES.quick;
  });

  // Facilitation Phase (0: Icebreaker, 1: Reflect, 2: Group, 3: Vote, 4: Actions)
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [areNotesRevealed, setAreNotesRevealed] = useState(!meetingSettings.isPrivateMode);

  // Sticky Notes State
  const [stickyNotes, setStickyNotes] = useState(() => {
    const saved = localStorage.getItem('balaboard_sticky_notes');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return TEMPLATES.quick.defaultStickyNotes || [];
  });

  // Action Items State
  const [actionItems, setActionItems] = useState(() => {
    const saved = localStorage.getItem('balaboard_action_items');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'act-1', title: 'Adopt pre-merge smoke tests before staging deploy', assignee: 'Alex', completed: false },
      { id: 'act-2', title: 'Schedule API contract review with partner team', assignee: 'Sarah', completed: false }
    ];
  });

  // Canvas Viewport State (Zoom & Pan)
  const [scale, setScale] = useState(0.85);
  const [pan, setPan] = useState({ x: 80, y: 110 });
  const [showGrid, setShowGrid] = useState(true);

  // Phase 10: Canvas Tools, Drawings & Connectors
  const [activeTool, setActiveTool] = useState('select'); // 'select' | 'pen' | 'highlighter' | 'connector'
  const [penColor, setPenColor] = useState('#2563eb');
  const [drawings, setDrawings] = useState(() => {
    const saved = localStorage.getItem('balaboard_drawings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });
  const [connectors, setConnectors] = useState(() => {
    const saved = localStorage.getItem('balaboard_connectors');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });
  const [connectingFromNoteId, setConnectingFromNoteId] = useState(null);
  const [activeTagFilter, setActiveTagFilter] = useState(null);

  // Modals & Drawers
  const [isPreRetroModalOpen, setIsPreRetroModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isActionDrawerOpen, setIsActionDrawerOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isIntegrationsModalOpen, setIsIntegrationsModalOpen] = useState(false);
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [jiraSourceItem, setJiraSourceItem] = useState(null);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isSpotlightingActive, setIsSpotlightingActive] = useState(false);
  const [activeSpotlight, setActiveSpotlight] = useState(null);

  // Recruiter Sandbox & Room Hub Landing Modal State
  const [isSandboxModalOpen, setIsSandboxModalOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sandbox') === 'true' || params.get('welcome') === 'true') return true;
    if (!params.get('room') && !localStorage.getItem('balaboard_seen_welcome')) return true;
    return false;
  });

  // Option A: 1-Step "Enter Your Name" Join Modal
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sandbox') === 'true' || params.get('demo') === 'true') return false;
    const hasConfigured = localStorage.getItem('balaboard_identity_configured');
    if (hasConfigured) return false;
    if (params.get('room')) return true;
    return false;
  });

  const handleJoinRoom = useCallback((newUser) => {
    setCurrentUser(newUser);
    localStorage.setItem('balaboard_current_user', JSON.stringify(newUser));
    localStorage.setItem('balaboard_identity_configured', 'true');
    setIsJoinModalOpen(false);
  }, []);

  const canvasContainerRef = useRef(null);

  // Real-Time Multiplayer WebSocket Synchronization
  const {
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
  } = useRealtimeSync({
    currentUser,
    roomId,
    onRemoteStateSync: (state) => {
      const isSandboxMode = roomId === 'sandbox' || window.location.search.includes('demo') || window.location.search.includes('sandbox');
      if (state.templateId && TEMPLATES[state.templateId]) {
        setActiveTemplate(TEMPLATES[state.templateId]);
      }
      if (state.stickyNotes && state.stickyNotes.length > 0) {
        setStickyNotes(state.stickyNotes);
      }
      if (state.actionItems) setActionItems(state.actionItems);
      if (state.drawings) setDrawings(state.drawings);
      if (state.connectors) setConnectors(state.connectors);
      if (state.currentPhaseIndex !== undefined) setCurrentPhaseIndex(state.currentPhaseIndex);
      if (isSandboxMode) {
        setAreNotesRevealed(true);
      } else if (state.areNotesRevealed !== undefined) {
        setAreNotesRevealed(state.areNotesRevealed);
      }
      if (state.meetingSettings) {
        setMeetingSettings(prev => ({
          ...state.meetingSettings,
          isPrivateMode: isSandboxMode ? false : state.meetingSettings.isPrivateMode
        }));
      }
    },
    onRemoteNoteCreate: (note) => {
      playSound('pop');
      setStickyNotes(prev => {
        if (prev.some(n => n.id === note.id)) return prev;
        return [...prev, note];
      });
    },
    onRemoteNoteUpdate: (id, updates) => {
      setStickyNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    },
    onRemoteNoteDelete: (id) => {
      setStickyNotes(prev => prev.filter(n => n.id !== id));
    },
    onRemoteNotesBatch: (notes) => {
      setStickyNotes(notes);
    },
    onRemoteDrawingAdd: (stroke) => {
      setDrawings(prev => [...prev, stroke]);
    },
    onRemoteDrawingsClear: () => {
      setDrawings([]);
    },
    onRemoteConnectorAdd: (conn) => {
      setConnectors(prev => [...prev, conn]);
    },
    onRemoteConnectorDelete: (id) => {
      setConnectors(prev => prev.filter(c => c.id !== id));
    },
    onRemotePhaseChange: (phaseIndex) => {
      playSound('reveal');
      setCurrentPhaseIndex(phaseIndex);
    },
    onRemoteRevealToggle: (revealed) => {
      playSound('reveal');
      setAreNotesRevealed(revealed);
    },
    onRemoteTemplateChange: (templateId, defaultNotes) => {
      if (TEMPLATES[templateId]) setActiveTemplate(TEMPLATES[templateId]);
      if (defaultNotes) setStickyNotes(defaultNotes);
    },
    onRemoteActionItemsUpdate: (items) => {
      setActionItems(items);
    },
    onRemoteSpotlight: ({ pan: remotePan, scale: remoteScale, facilitatorName, facilitatorAvatar }) => {
      playSound('pop');
      if (remotePan) setPan(remotePan);
      if (remoteScale) setScale(remoteScale);
      setActiveSpotlight({ facilitatorName, facilitatorAvatar });
    },
    onRemoteSpotlightRelease: () => {
      setActiveSpotlight(null);
    }
  });

  // Spotlight Broadcaster (when current user is spotlighting, sync viewport changes)
  useEffect(() => {
    if (isSpotlightingActive) {
      sendSpotlight(pan, scale);
    }
  }, [pan, scale, isSpotlightingActive, sendSpotlight]);

  // Recruiter 1-Click Sandbox Handlers
  const handleLaunchRecruiterSandbox = useCallback(() => {
    setActiveTemplate(TEMPLATES.quick);
    setStickyNotes(RECRUITER_SANDBOX_NOTES);
    localStorage.setItem('balaboard_sticky_notes', JSON.stringify(RECRUITER_SANDBOX_NOTES));
    setActionItems(RECRUITER_SANDBOX_ACTIONS);
    localStorage.setItem('balaboard_action_items', JSON.stringify(RECRUITER_SANDBOX_ACTIONS));
    setMeetingSettings(prev => ({ ...prev, isPrivateMode: false }));
    setAreNotesRevealed(true);
    sendRevealToggle(true);
    setScale(0.85);
    setPan({ x: 80, y: 110 });
    sendNotesBatch(RECRUITER_SANDBOX_NOTES);
    sendTemplateChange(TEMPLATES.quick.id, RECRUITER_SANDBOX_NOTES);
    sendActionItemsUpdate(RECRUITER_SANDBOX_ACTIONS);
    setIsTourOpen(true);
  }, [sendNotesBatch, sendTemplateChange, sendActionItemsUpdate, sendRevealToggle]);

  const handleCreateCleanRoom = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    window.location.search = `?room=sprint-${randomSuffix}`;
  };

  // Auto-launch sandbox if query param ?sandbox=true or ?demo=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sandbox') === 'true' || params.get('demo') === 'true') {
      handleLaunchRecruiterSandbox();
    }
  }, [handleLaunchRecruiterSandbox]);

  // Local Persistence
  useEffect(() => {
    localStorage.setItem('balaboard_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('balaboard_dock_position', dockPosition);
  }, [dockPosition]);

  useEffect(() => {
    localStorage.setItem('balaboard_is_minimized', isMinimized);
  }, [isMinimized]);

  useEffect(() => {
    localStorage.setItem('balaboard_meeting_settings', JSON.stringify(meetingSettings));
  }, [meetingSettings]);

  useEffect(() => {
    localStorage.setItem('balaboard_active_template', activeTemplate.id);
  }, [activeTemplate]);

  useEffect(() => {
    localStorage.setItem('balaboard_sticky_notes', JSON.stringify(stickyNotes));
  }, [stickyNotes]);

  useEffect(() => {
    localStorage.setItem('balaboard_action_items', JSON.stringify(actionItems));
  }, [actionItems]);

  useEffect(() => {
    localStorage.setItem('balaboard_drawings', JSON.stringify(drawings));
  }, [drawings]);

  useEffect(() => {
    localStorage.setItem('balaboard_connectors', JSON.stringify(connectors));
  }, [connectors]);

  // Note Handlers
  const handleUpdateNote = (id, updates) => {
    setStickyNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
    sendNoteUpdate(id, updates);
  };

  const handleDeleteNote = (id) => {
    setStickyNotes(prev => prev.filter(n => n.id !== id));
    sendNoteDelete(id);
    // Remove any connectors attached to this note
    setConnectors(prev => prev.filter(c => c.fromId !== id && c.toId !== id));
  };

  const handleAddStickyNote = (color = 'yellow') => {
    const rect = canvasContainerRef.current?.getBoundingClientRect() || { width: 1000, height: 700 };
    const centerX = Math.round((rect.width / 2 - pan.x) / scale - 85);
    const centerY = Math.round((rect.height / 2 - pan.y) / scale - 75);

    const newNote = {
      id: crypto.randomUUID(),
      x: centerX + Math.floor(Math.random() * 80 - 40),
      y: centerY + Math.floor(Math.random() * 80 - 40),
      width: 170,
      height: 150,
      color,
      text: '',
      author: currentUser?.name || 'Anonymous',
      votes: 0,
      reactions: {},
      tags: [],
      rotation: +(Math.random() * 4 - 2).toFixed(1)
    };
    setStickyNotes(prev => [...prev, newNote]);
    sendNoteCreate(newNote);
  };

  const handleAddNoteAtPos = (x, y, color = 'yellow') => {
    playSound('pop');
    const newNote = {
      id: crypto.randomUUID(),
      x,
      y,
      width: 170,
      height: 150,
      color: color || 'yellow',
      text: '',
      author: currentUser?.name || 'Anonymous',
      votes: 0,
      reactions: {},
      tags: [],
      rotation: +(Math.random() * 4 - 2).toFixed(1)
    };
    setStickyNotes(prev => [...prev, newNote]);
    sendNoteCreate(newNote);
  };

  // Drawing Handlers
  const handleDrawingAdd = (stroke) => {
    setDrawings(prev => [...prev, stroke]);
    sendDrawingAdd(stroke);
  };

  const handleClearDrawings = () => {
    if (confirm('Clear all freehand drawings and highlights?')) {
      setDrawings([]);
      sendDrawingsClear();
    }
  };

  // Connector Handlers
  const handleNoteClickInConnectorMode = (noteId) => {
    if (!connectingFromNoteId) {
      playSound('pop');
      setConnectingFromNoteId(noteId);
    } else if (connectingFromNoteId !== noteId) {
      playSound('reveal');
      const newConnector = {
        id: crypto.randomUUID(),
        fromId: connectingFromNoteId,
        toId: noteId,
        color: '#6366f1',
        label: ''
      };
      setConnectors(prev => [...prev, newConnector]);
      sendConnectorAdd(newConnector);
      setConnectingFromNoteId(null);
    }
  };

  const handleDeleteConnector = (id) => {
    playSound('pop');
    setConnectors(prev => prev.filter(c => c.id !== id));
    sendConnectorDelete(id);
  };

  // Pre-Retro Launch Callback
  const handleStartRetro = ({ template, meetingSettings: newSettings }) => {
    setActiveTemplate(template);
    setMeetingSettings(newSettings);
    setAreNotesRevealed(!newSettings.isPrivateMode);
    setCurrentPhaseIndex(newSettings.enableIcebreaker ? 0 : 1);

    if (template.defaultStickyNotes && template.defaultStickyNotes.length > 0) {
      setStickyNotes(template.defaultStickyNotes);
      sendTemplateChange(template.id, template.defaultStickyNotes);
    } else {
      sendTemplateChange(template.id, []);
    }

    sendRevealToggle(!newSettings.isPrivateMode);
    sendPhaseChange(newSettings.enableIcebreaker ? 0 : 1);

    handleFitScreen();
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.3 } });
  };

  // Auto-Cluster Sticky Notes into Template Zones
  const handleAutoCluster = () => {
    if (!activeTemplate.zones || activeTemplate.zones.length === 0) return;

    const zones = activeTemplate.zones;
    const updatedNotes = [...stickyNotes];

    const zoneBuckets = zones.map(() => []);

    updatedNotes.forEach(note => {
      let closestZoneIdx = 0;
      let minDistance = Infinity;

      zones.forEach((zone, idx) => {
        const zoneCenterX = zone.x + zone.width / 2;
        const zoneCenterY = zone.y + zone.height / 2;
        const dist = Math.hypot(note.x - zoneCenterX, note.y - zoneCenterY);
        if (dist < minDistance) {
          minDistance = dist;
          closestZoneIdx = idx;
        }
      });

      zoneBuckets[closestZoneIdx].push(note);
    });

    const finalNotes = [];
    zoneBuckets.forEach((bucket, zIdx) => {
      const zone = zones[zIdx];
      const cols = zone.width > 400 ? 2 : 1;
      const colWidth = 180;
      const rowHeight = 160;

      bucket.forEach((note, nIdx) => {
        const col = nIdx % cols;
        const row = Math.floor(nIdx / cols);

        finalNotes.push({
          ...note,
          x: zone.x + 30 + col * colWidth,
          y: zone.y + 110 + row * rowHeight,
          rotation: +((nIdx % 3 - 1) * 1.2).toFixed(1)
        });
      });
    });

    setStickyNotes(finalNotes);
    sendNotesBatch(finalNotes);
  };

  // Phase & Reveal Handlers
  const handlePhaseChange = (idx) => {
    setCurrentPhaseIndex(idx);
    sendPhaseChange(idx);
  };

  const handleToggleRevealNotes = () => {
    const nextVal = !areNotesRevealed;
    setAreNotesRevealed(nextVal);
    sendRevealToggle(nextVal);
  };

  // Zoom Controls
  const handleZoomIn = () => setScale(s => Math.min(s * 1.15, 3.0));
  const handleZoomOut = () => setScale(s => Math.max(s * 0.85, 0.15));
  const handleResetZoom = () => {
    setScale(1.0);
    setPan({ x: 80, y: dockPosition === 'bottom' ? 60 : 110 });
  };

  // Dynamic Responsive Auto-Fit to Window
  const handleFitScreen = useCallback((targetTemplate = activeTemplate, notes = stickyNotes) => {
    if (!targetTemplate?.zones || targetTemplate.zones.length === 0) return;

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    targetTemplate.zones.forEach(z => {
      minX = Math.min(minX, z.x);
      minY = Math.min(minY, z.y);
      maxX = Math.max(maxX, z.x + (z.width || 480));
      maxY = Math.max(maxY, z.y + (z.height || 380));
    });

    if (notes && notes.length > 0) {
      notes.forEach(n => {
        minX = Math.min(minX, n.x);
        minY = Math.min(minY, n.y);
        maxX = Math.max(maxX, n.x + (n.width || 170));
        maxY = Math.max(maxY, n.y + (n.height || 150));
      });
    }

    const contentWidth = Math.max(maxX - minX, 400);
    const contentHeight = Math.max(maxY - minY, 300);

    const winW = window.innerWidth || 1280;
    const winH = window.innerHeight || 800;

    // Allocate safe margins for Top Navbar (~70px) and Left Canvas Palette (~70px)
    const paddingLeft = 70;
    const paddingRight = 40;
    const paddingTop = dockPosition === 'bottom' ? 35 : 75;
    const paddingBottom = dockPosition === 'bottom' ? 75 : 45;

    const availableWidth = Math.max(winW - paddingLeft - paddingRight, 300);
    const availableHeight = Math.max(winH - paddingTop - paddingBottom, 300);

    // Calculate fit scale with breathing room
    const scaleX = availableWidth / (contentWidth + 40);
    const scaleY = availableHeight / (contentHeight + 40);
    const fitScale = Math.min(Math.max(Math.min(scaleX, scaleY), 0.22), 1.05);

    // Calculate centered pan
    const centerPanX = paddingLeft + (availableWidth - contentWidth * fitScale) / 2 - minX * fitScale;
    const centerPanY = paddingTop + (availableHeight - contentHeight * fitScale) / 2 - minY * fitScale;

    setScale(Number(fitScale.toFixed(2)));
    setPan({ x: Math.round(centerPanX), y: Math.round(centerPanY) });
  }, [activeTemplate, stickyNotes, dockPosition]);

  // Auto-fit canvas to window on initial load and window resize
  useEffect(() => {
    handleFitScreen();

    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        handleFitScreen();
      }, 120);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleFitScreen]);

  // Action Items Handlers
  const handleAddActionItem = (item) => {
    const updated = [item, ...actionItems];
    setActionItems(updated);
    sendActionItemsUpdate(updated);
  };

  const handleToggleActionItem = (id) => {
    const updated = actionItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    setActionItems(updated);
    sendActionItemsUpdate(updated);
  };

  const handleDeleteActionItem = (id) => {
    const updated = actionItems.filter(item => item.id !== id);
    setActionItems(updated);
    sendActionItemsUpdate(updated);
  };

  const handleConvertNoteToAction = (note) => {
    handleAddActionItem({
      id: crypto.randomUUID(),
      title: note.text,
      assignee: note.author || currentUser?.name || 'Dev Team',
      completed: false,
      createdAt: Date.now()
    });
    setIsActionDrawerOpen(true);
  };

  // Jira Issue Handlers (Phase 13)
  const handleOpenJiraModal = (source) => {
    setJiraSourceItem(source);
    setIsJiraModalOpen(true);
  };

  const handleCreateJiraIssue = (sourceItem, jiraData) => {
    if (sourceItem.type === 'note') {
      const noteId = sourceItem.item.id;
      setStickyNotes(prev => {
        const next = prev.map(n => n.id === noteId ? { ...n, jiraIssue: jiraData } : n);
        return next;
      });
      sendNoteUpdate(noteId, { jiraIssue: jiraData });
    } else if (sourceItem.type === 'action') {
      const actId = sourceItem.item.id;
      setActionItems(prev => {
        const next = prev.map(a => a.id === actId ? { ...a, jiraIssue: jiraData } : a);
        sendActionItemsUpdate(next);
        return next;
      });
    }
  };

  // AI SMART Actions Importer
  const handleImportSmartActions = (items) => {
    const formatted = items.map(act => ({
      id: crypto.randomUUID(),
      title: act.title,
      description: act.description,
      assignee: act.suggestedAssignee || 'Dev Team',
      completed: false,
      createdAt: Date.now()
    }));
    const updated = [...formatted, ...actionItems];
    setActionItems(updated);
    sendActionItemsUpdate(updated);
  };

  // Export 1: High-Res PNG Image
  const handleExportPNG = async () => {
    const boardEl = document.getElementById('canvas-board');
    if (!boardEl) return;
    try {
      const dataUrl = await toPng(boardEl, {
        cacheBust: true,
        backgroundColor: '#f8fafc',
        width: 1400,
        height: 1100,
        style: {
          transform: 'scale(1)',
          transformOrigin: '0 0'
        }
      });
      const link = document.createElement('a');
      link.download = `balaboard-${activeTemplate.id}-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      alert('Could not export PNG image: ' + err.message);
    }
  };

  // Export 2: Markdown Retrospective Report
  const handleExportMarkdown = () => {
    let md = `# 📋 ${meetingSettings.meetingTitle || activeTemplate.title} — Retrospective Report\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()} | **Facilitator:** ${currentUser?.name || 'Bala'} (${currentUser?.role || 'Scrum Master'})\n`;
    md += `**Framework:** ${activeTemplate.title} (${activeTemplate.category})\n\n`;
    md += `---\n\n`;

    activeTemplate.zones.forEach(zone => {
      md += `### ${zone.title}\n`;
      const notesInZone = stickyNotes.filter(n => {
        return n.x >= zone.x - 60 && n.x <= zone.x + zone.width + 60 &&
               n.y >= zone.y - 60 && n.y <= zone.y + zone.height + 60;
      });

      if (notesInZone.length === 0) {
        md += `*No notes recorded in this category.*\n\n`;
      } else {
        notesInZone.forEach(n => {
          md += `- **${n.text}** *(+${n.votes || 0} votes by @${n.author || 'Anonymous'})*\n`;
        });
        md += `\n`;
      }
    });

    md += `## 🎯 Agreed Action Items:\n`;
    if (actionItems.length === 0) {
      md += `*No action items agreed yet.*\n`;
    } else {
      actionItems.forEach(item => {
        md += `- [${item.completed ? 'x' : ' '}] **${item.title}** (Owner: @${item.assignee})\n`;
      });
    }

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `retro-report-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export 3: JSON Backup
  const handleExportJSON = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      meetingSettings,
      template: activeTemplate.id,
      currentUser,
      stickyNotes,
      actionItems,
      drawings,
      connectors
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `balaboard-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearBoard = () => {
    if (confirm('Are you sure you want to clear all sticky notes? This cannot be undone.')) {
      setStickyNotes([]);
      setConnectors([]);
      sendNotesBatch([]);
    }
  };

  const activePhase = RETRO_PHASES[currentPhaseIndex] || RETRO_PHASES[0];

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-slate-50 relative select-none">
      {/* Unified Facilitator Island Bar (Zero Overlap Guaranteed) */}
      <Toolbar
        activeTemplate={activeTemplate}
        meetingSettings={meetingSettings}
        onOpenPreRetroModal={() => setIsPreRetroModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        currentUser={currentUser}
        onlineUsers={onlineUsers}
        connectionStatus={connectionStatus}
        onAddStickyNote={handleAddStickyNote}
        onOpenActionItems={() => setIsActionDrawerOpen(true)}
        actionItemsCount={actionItems.filter(i => !i.completed).length}
        onExportPNG={handleExportPNG}
        onExportMarkdown={handleExportMarkdown}
        onExportJSON={handleExportJSON}
        onClearBoard={handleClearBoard}
        scale={scale}
        onResetZoom={handleResetZoom}
        dockPosition={dockPosition}
        onToggleDockPosition={() => setDockPosition(p => p === 'top' ? 'bottom' : 'top')}
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
        currentPhaseIndex={currentPhaseIndex}
        onPhaseChange={handlePhaseChange}
        areNotesRevealed={areNotesRevealed}
        onToggleRevealNotes={handleToggleRevealNotes}
        onAutoCluster={handleAutoCluster}
        onSpotlightEveryone={() => {
          setIsSpotlightingActive(true);
          sendSpotlight(pan, scale);
        }}
        isSpotlightingActive={isSpotlightingActive}
        onReleaseSpotlight={() => {
          setIsSpotlightingActive(false);
          sendSpotlightRelease();
        }}
        onStartDemoTour={() => setIsTourOpen(true)}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onOpenSandboxModal={() => setIsSandboxModalOpen(true)}
      />

      {/* Spotlight Audience Banner */}
      {activeSpotlight && (
        <div className={`fixed ${dockPosition === 'bottom' ? 'bottom-20' : 'top-16'} left-1/2 -translate-x-1/2 z-40 bg-purple-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2.5 animate-fadeIn border border-purple-400/40 select-none`}>
          <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
          <span>Following {activeSpotlight.facilitatorAvatar || '👑'} {activeSpotlight.facilitatorName}'s Spotlight</span>
          <button
            onClick={() => setActiveSpotlight(null)}
            className="ml-2 px-2.5 py-0.5 rounded-full bg-white/20 hover:bg-white/30 text-[10px] font-extrabold uppercase tracking-wider transition-colors"
          >
            Stop Following
          </button>
        </div>
      )}

      {/* Floating Canvas Tool Palette (Pen, Highlighter, Connectors, AI & Slack) */}
      <CanvasToolPalette
        activeTool={activeTool}
        onSelectTool={setActiveTool}
        penColor={penColor}
        onSelectPenColor={setPenColor}
        onClearDrawings={handleClearDrawings}
        hasDrawings={drawings.length > 0}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenIntegrationsModal={() => setIsIntegrationsModalOpen(true)}
        connectingFromNoteId={connectingFromNoteId}
        onCancelConnecting={() => setConnectingFromNoteId(null)}
        activeTagFilter={activeTagFilter}
        onSelectTagFilter={setActiveTagFilter}
      />

      {/* Main Canvas Viewport */}
      <main className="flex-1 w-full h-full">
        <Canvas
          template={activeTemplate}
          stickyNotes={stickyNotes}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
          onAddNoteAtPos={handleAddNoteAtPos}
          pan={pan}
          setPan={setPan}
          scale={scale}
          setScale={setScale}
          showGrid={showGrid}
          canvasContainerRef={canvasContainerRef}
          currentUser={currentUser}
          areNotesRevealed={areNotesRevealed}
          isPrivateWriting={meetingSettings.isPrivateMode}
          remoteCursors={remoteCursors}
          onCursorMove={sendCursorMove}
          activeTool={activeTool}
          penColor={penColor}
          drawings={drawings}
          onDrawingAdd={handleDrawingAdd}
          connectors={connectors}
          onDeleteConnector={handleDeleteConnector}
          onNoteClickInConnectorMode={handleNoteClickInConnectorMode}
          connectingFromNoteId={connectingFromNoteId}
          activeTagFilter={activeTagFilter}
          onOpenJiraModal={handleOpenJiraModal}
        />
      </main>

      {/* Bottom Right Minimap & Zoom HUD */}
      <Minimap
        scale={scale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitScreen={handleFitScreen}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        dockPosition={dockPosition}
      />

      {/* Pre-Retro Meeting Hub & Miro Template Library Modal */}
      <PreRetroSetupModal
        isOpen={isPreRetroModalOpen}
        onClose={() => setIsPreRetroModalOpen(false)}
        currentTemplateId={activeTemplate.id}
        onStartRetro={handleStartRetro}
        currentUser={currentUser}
      />

      {/* User Login & Facilitator Profile Modal */}
      <UserLoginModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
      />

      {/* Option A: 1-Step "Enter Your Name" Join Modal */}
      <JoinRoomModal
        isOpen={isJoinModalOpen}
        roomId={roomId}
        currentUser={currentUser}
        onJoin={handleJoinRoom}
        onContinueAsGuest={(guestUser) => handleJoinRoom(guestUser)}
      />

      {/* Share Board & Real-Time Sync Modal */}
      <ShareBoardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        roomId={roomId}
        onlineUsersCount={onlineUsers.length}
      />

      {/* Action Items & Voting Summary Drawer */}
      <ActionItemsDrawer
        isOpen={isActionDrawerOpen}
        onClose={() => setIsActionDrawerOpen(false)}
        stickyNotes={stickyNotes}
        actionItems={actionItems}
        onAddActionItem={handleAddActionItem}
        onToggleActionItem={handleToggleActionItem}
        onDeleteActionItem={handleDeleteActionItem}
        onConvertNoteToAction={handleConvertNoteToAction}
        onOpenJiraModal={handleOpenJiraModal}
      />

      {/* AI Retrospective Intelligence Modal (Phase 9) */}
      <AiRetroModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeTemplate={activeTemplate}
        stickyNotes={stickyNotes}
        meetingSettings={meetingSettings}
        onImportSmartActions={handleImportSmartActions}
        currentPhaseName={activePhase.label}
      />

      {/* Slack & Jira Integrations Modal (Phase 11) */}
      <IntegrationsModal
        isOpen={isIntegrationsModalOpen}
        onClose={() => setIsIntegrationsModalOpen(false)}
        activeTemplate={activeTemplate}
        meetingSettings={meetingSettings}
        stickyNotes={stickyNotes}
        actionItems={actionItems}
        currentUser={currentUser}
      />

      {/* Jira Issue Creation Modal (Phase 13) */}
      <JiraIssueModal
        isOpen={isJiraModalOpen}
        onClose={() => setIsJiraModalOpen(false)}
        sourceItem={jiraSourceItem}
        activeTemplate={activeTemplate}
        meetingSettings={meetingSettings}
        onCreateJiraIssue={handleCreateJiraIssue}
      />

      {/* Recruiter & Team Interactive Guided Demo Tour (Phase 14 - Option 1) */}
      <RecruiterTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onToggleRevealNotes={handleToggleRevealNotes}
        areNotesRevealed={areNotesRevealed}
        onAutoCluster={handleAutoCluster}
        onOpenJiraModal={handleOpenJiraModal}
        onOpenAnalytics={() => setIsAnalyticsOpen(true)}
        onSetPanAndScale={(newScale, newPan) => {
          setScale(newScale);
          setPan(newPan);
        }}
      />

      {/* Retrospective Analytics & Team Health Dashboard (Phase 14 - Option 2) */}
      <RetroAnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
        activeTemplate={activeTemplate}
        meetingSettings={meetingSettings}
        stickyNotes={stickyNotes}
        actionItems={actionItems}
        onlineUsers={onlineUsers}
      />

      {/* Recruiter 1-Click Sandbox & Room Hub Landing Screen */}
      <RecruiterSandboxModal
        isOpen={isSandboxModalOpen}
        onClose={() => setIsSandboxModalOpen(false)}
        onLaunchSandbox={handleLaunchRecruiterSandbox}
        onCreateCleanRoom={handleCreateCleanRoom}
        currentRoomId={roomId}
      />
    </div>
  );
}
