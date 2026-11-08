import React from 'react';
import { Plus } from 'lucide-react';
import { PASTEL_COLORS } from '../constants/templates';

export default function TemplateZone({ zone, onAddNote }) {
  const palette = PASTEL_COLORS[zone.stickyColor] || PASTEL_COLORS.yellow;

  return (
    <div
      style={{
        transform: `translate(${zone.x}px, ${zone.y}px)`,
        width: `${zone.width}px`,
        height: `${zone.height}px`
      }}
      className={`absolute rounded-3xl border-2 border-dashed p-5 flex flex-col justify-between select-none transition-all shadow-xs ${zone.color}`}
    >
      {/* Zone Header */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-bold text-base tracking-tight text-slate-800">{zone.title}</h3>
          <button
            onClick={() => onAddNote?.(zone)}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl bg-white/90 hover:bg-white text-slate-800 shadow-sm border border-slate-200/80 font-bold transition-all hover:scale-105 active:scale-95"
            title={`Add a matching ${palette.label} sticky note to ${zone.title}`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${palette.dot} border border-slate-300`} />
            <Plus size={13} />
            <span>Add Note</span>
          </button>
        </div>
        <p className="text-xs opacity-75 font-medium leading-relaxed">{zone.subtitle}</p>
      </div>

      {/* Subtle guide message at bottom */}
      <div className="text-[11px] opacity-40 text-center font-medium mt-auto flex items-center justify-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${palette.dot}`} />
        <span>Drop {palette.label} sticky notes here</span>
      </div>
    </div>
  );
}
