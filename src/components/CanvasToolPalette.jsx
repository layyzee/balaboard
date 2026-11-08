import React, { useState } from 'react';
import { 
  MousePointer, 
  PenTool, 
  Highlighter, 
  Eraser, 
  Sparkles, 
  Plug, 
  GitFork, 
  Tag, 
  X,
  Palette
} from 'lucide-react';
import { playSound } from '../utils/sound';

export const PEN_COLORS = [
  { id: 'black', color: '#1e293b', label: 'Ink Black' },
  { id: 'blue', color: '#2563eb', label: 'Royal Blue' },
  { id: 'emerald', color: '#059669', label: 'Emerald Green' },
  { id: 'rose', color: '#e11d48', label: 'Rose Red' },
  { id: 'amber', color: '#d97706', label: 'Amber Gold' }
];

export default function CanvasToolPalette({
  activeTool = 'select', // 'select' | 'pen' | 'highlighter' | 'connector'
  onSelectTool,
  penColor = '#2563eb',
  onSelectPenColor,
  onClearDrawings,
  hasDrawings = false,
  onOpenAiModal,
  onOpenIntegrationsModal,
  connectingFromNoteId,
  onCancelConnecting,
  activeTagFilter,
  onSelectTagFilter
}) {
  const [showColorPicker, setShowColorPicker] = useState(false);

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 p-1.5 rounded-2xl shadow-xl select-none animate-fadeIn pointer-events-auto">
      {/* 1. Select / Pan Tool */}
      <button
        onClick={() => {
          playSound('pop');
          onSelectTool('select');
          onCancelConnecting && onCancelConnecting();
        }}
        className={`p-2 rounded-xl text-xs font-bold transition-all ${
          activeTool === 'select'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Select & Pan Tool (V)"
      >
        <MousePointer size={18} />
      </button>

      {/* 2. Freehand Pen Tool */}
      <div className="relative">
        <button
          onClick={() => {
            playSound('pop');
            onSelectTool('pen');
            onCancelConnecting && onCancelConnecting();
          }}
          className={`p-2 rounded-xl text-xs font-bold transition-all relative ${
            activeTool === 'pen'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
          title="Freehand Pen Sketch Tool (P)"
        >
          <PenTool size={18} />
          <span
            style={{ backgroundColor: penColor }}
            className="absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white"
          />
        </button>
      </div>

      {/* 3. Highlighter Tool */}
      <button
        onClick={() => {
          playSound('pop');
          onSelectTool('highlighter');
          onCancelConnecting && onCancelConnecting();
        }}
        className={`p-2 rounded-xl text-xs font-bold transition-all ${
          activeTool === 'highlighter'
            ? 'bg-indigo-600 text-white shadow-sm'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Highlighter Tool (H)"
      >
        <Highlighter size={18} />
      </button>

      {/* 4. Color Palette Toggle for Pen */}
      {(activeTool === 'pen' || activeTool === 'highlighter') && (
        <div className="flex flex-col gap-1 py-1 border-y border-slate-100 items-center animate-fadeIn">
          {PEN_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => onSelectPenColor(c.color)}
              style={{ backgroundColor: c.color }}
              className={`w-4 h-4 rounded-full border transition-transform ${
                penColor === c.color ? 'scale-125 border-white ring-2 ring-indigo-500' : 'border-slate-300 hover:scale-110'
              }`}
              title={c.label}
            />
          ))}
        </div>
      )}

      {/* 5. Smart Arrow Connector Tool */}
      <button
        onClick={() => {
          playSound('pop');
          onSelectTool(activeTool === 'connector' ? 'select' : 'connector');
        }}
        className={`p-2 rounded-xl text-xs font-bold transition-all relative ${
          activeTool === 'connector'
            ? 'bg-indigo-600 text-white shadow-sm animate-pulse'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        title="Connector Arrow: Click first note, then second note to link them"
      >
        <GitFork size={18} />
      </button>

      {/* Clear Sketches if any */}
      {hasDrawings && (
        <button
          onClick={() => {
            playSound('pop');
            onClearDrawings();
          }}
          className="p-2 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          title="Clear all canvas sketches"
        >
          <Eraser size={18} />
        </button>
      )}

      <div className="w-full h-[1px] bg-slate-200 my-0.5" />

      {/* 6. AI Intelligence Modal Trigger */}
      <button
        onClick={() => {
          playSound('pop');
          onOpenAiModal();
        }}
        className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-md shadow-indigo-500/25 transition-transform hover:scale-110 active:scale-95"
        title="BalaBoard AI: Sprint theme synthesis & SMART Action Items"
      >
        <Sparkles size={18} />
      </button>

      {/* 7. Integrations Hub Trigger (Slack & Jira) */}
      <button
        onClick={() => {
          playSound('pop');
          onOpenIntegrationsModal();
        }}
        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        title="Integrations: Slack Webhook, Jira, GitHub Sync"
      >
        <Plug size={18} />
      </button>

      {/* Connector Instruction Pill */}
      {connectingFromNoteId && (
        <div className="absolute left-14 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2 whitespace-nowrap animate-slideRight">
          <span>Click target note to connect</span>
          <button onClick={onCancelConnecting} className="p-0.5 hover:text-slate-300">
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
}
