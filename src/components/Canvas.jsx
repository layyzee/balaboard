import React, { useRef, useState, useEffect } from 'react';
import TemplateZone from './TemplateZone';
import StickyNote from './StickyNote';
import MultiplayerCursors from './MultiplayerCursors';
import DrawingLayer from './DrawingLayer';
import ConnectorsLayer from './ConnectorsLayer';

export default function Canvas({
  template,
  stickyNotes,
  onUpdateNote,
  onDeleteNote,
  onAddNoteAtPos,
  pan,
  setPan,
  scale,
  setScale,
  showGrid,
  canvasContainerRef,
  currentUser,
  areNotesRevealed,
  isPrivateWriting,
  remoteCursors,
  onCursorMove,
  // Canvas Tools (Phase 10)
  activeTool = 'select',
  penColor = '#2563eb',
  drawings = [],
  onDrawingAdd,
  connectors = [],
  onDeleteConnector,
  onNoteClickInConnectorMode,
  connectingFromNoteId = null,
  activeTagFilter = null,
  onOpenJiraModal
}) {
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Freehand drawing in-progress stroke
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState(null);

  // Spacebar pan toggle
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.target.closest('textarea') && !e.target.closest('input')) {
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Wheel Zoom centered on cursor
  const handleWheel = (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey || !e.shiftKey) {
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const newScale = Math.min(Math.max(scale * zoomFactor, 0.15), 3.0);
      
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newPanX = mouseX - (mouseX - pan.x) * (newScale / scale);
      const newPanY = mouseY - (mouseY - pan.y) * (newScale / scale);

      setScale(newScale);
      setPan({ x: newPanX, y: newPanY });
    } else {
      setPan(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  // Convert mouse event to canvas world coordinates
  const getWorldCoords = (e) => {
    const rect = canvasContainerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    return {
      x: Math.round((mouseX - pan.x) / scale),
      y: Math.round((mouseY - pan.y) / scale)
    };
  };

  // Canvas Mouse Down
  const handleMouseDown = (e) => {
    // 1. Drawing Tool (Pen or Highlighter)
    if (activeTool === 'pen' || activeTool === 'highlighter') {
      const coords = getWorldCoords(e);
      setIsDrawing(true);
      setCurrentStroke({
        id: crypto.randomUUID(),
        points: [coords],
        color: penColor,
        width: activeTool === 'highlighter' ? 14 : 3,
        opacity: activeTool === 'highlighter' ? 0.35 : 0.9
      });
      return;
    }

    // 2. Pan tool
    if (e.button === 1 || isSpacePressed || e.target === canvasContainerRef.current || e.target.id === 'canvas-board') {
      setIsPanning(true);
      setPanStart({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y
      });
    }
  };

  const handleMouseMove = (e) => {
    const coords = getWorldCoords(e);

    // 1. In-progress drawing
    if (isDrawing && currentStroke) {
      setCurrentStroke(prev => ({
        ...prev,
        points: [...prev.points, coords]
      }));
    }

    // 2. Broadcast cursor position
    if (onCursorMove) {
      onCursorMove(coords.x, coords.y);
    }

    // 3. Pan
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentStroke) {
      if (currentStroke.points.length > 1) {
        onDrawingAdd && onDrawingAdd(currentStroke);
      }
      setIsDrawing(false);
      setCurrentStroke(null);
    }
    setIsPanning(false);
  };

  // Double click on canvas creates a note
  const handleDoubleClick = (e) => {
    if (activeTool !== 'select') return;
    if (e.target !== canvasContainerRef.current && e.target.id !== 'canvas-board') return;
    const coords = getWorldCoords(e);
    onAddNoteAtPos(coords.x, coords.y);
  };

  return (
    <div
      ref={canvasContainerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      className={`w-full h-full relative overflow-hidden bg-slate-50 select-none ${
        showGrid ? 'canvas-grid-dots' : ''
      } ${
        activeTool === 'pen'
          ? 'cursor-crosshair'
          : activeTool === 'highlighter'
          ? 'cursor-crosshair'
          : activeTool === 'connector'
          ? 'cursor-pointer'
          : isPanning
          ? 'cursor-grabbing'
          : isSpacePressed
          ? 'cursor-grab'
          : 'cursor-default'
      }`}
    >
      {/* Zoomable & Pannable Viewport */}
      <div
        id="canvas-board"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
        className="canvas-viewport absolute inset-0 w-[5000px] h-[5000px]"
      >
        {/* Sailboat Artwork Backdrop */}
        {template?.id === 'sailboat' && (
          <div 
            style={{ transform: 'translate(440px, 340px)' }} 
            className="absolute pointer-events-none opacity-20 flex flex-col items-center select-none"
          >
            <svg width="320" height="260" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 10 L100 100 L40 100 Z" fill="#0284c7" />
              <path d="M105 30 L105 100 L160 100 Z" fill="#38bdf8" />
              <path d="M20 105 L180 105 L150 140 L50 140 Z" fill="#0369a1" />
              <line x1="100" y1="10" x2="100" y2="105" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Our Team Sprint Journey</span>
          </div>
        )}

        {/* Template Visual Zones */}
        {template?.zones?.map((zone) => (
          <TemplateZone
            key={zone.id}
            zone={zone}
            onAddNote={(z) => {
              onAddNoteAtPos(z.x + 40, z.y + 120, z.stickyColor || 'yellow');
            }}
          />
        ))}

        {/* Connectors & Flow Lines Layer (Phase 10) */}
        <ConnectorsLayer
          connectors={connectors}
          stickyNotes={stickyNotes}
          onDeleteConnector={onDeleteConnector}
        />

        {/* Freehand Drawings & Highlighting Layer (Phase 10) */}
        <DrawingLayer
          drawings={drawings}
          currentStroke={currentStroke}
        />

        {/* Remote Teammates Multiplayer Cursors */}
        <MultiplayerCursors remoteCursors={remoteCursors} />

        {/* Sticky Notes */}
        {stickyNotes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            onUpdate={onUpdateNote}
            onDelete={onDeleteNote}
            scale={scale}
            currentUser={currentUser}
            areNotesRevealed={areNotesRevealed}
            isPrivateWriting={isPrivateWriting}
            activeTool={activeTool}
            onNoteClickInConnectorMode={onNoteClickInConnectorMode}
            isConnectorSource={connectingFromNoteId === note.id}
            activeTagFilter={activeTagFilter}
            onOpenJiraModal={onOpenJiraModal}
          />
        ))}
      </div>
    </div>
  );
}
