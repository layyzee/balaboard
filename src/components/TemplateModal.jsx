import React from 'react';
import { X, Check, Compass, PlayCircle, Smile, Ship, Layout } from 'lucide-react';
import { TEMPLATES } from '../constants/templates';

const ICONS = {
  Ship,
  PlayCircle,
  Smile,
  Compass,
  Layout
};

export default function TemplateModal({ isOpen, onClose, currentTemplateId, onSelectTemplate }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Choose a Retrospective Template</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a template framework to scaffold your team's whiteboard canvas</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.values(TEMPLATES).map((template) => {
            const Icon = ICONS[template.icon] || Layout;
            const isSelected = currentTemplateId === template.id;

            return (
              <div
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                className={`flex flex-col p-4 rounded-2xl border-2 transition-all cursor-pointer group text-left ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                    : 'border-slate-200 hover:border-slate-400 hover:shadow-md bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700 group-hover:scale-105 transition-transform">
                      <Icon size={18} />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-200 text-slate-600">
                      {template.category}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      <Check size={12} />
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-800 mb-1">{template.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-3 flex-1">{template.description}</p>

                {/* Zones preview pills */}
                {template.zones.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-slate-100">
                    {template.zones.map(z => (
                      <span key={z.id} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {z.title.split(' ')[0]} {z.title.split(' ')[1]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
