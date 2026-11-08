import React from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Grid } from 'lucide-react';

export default function Minimap({
  scale,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onFitScreen,
  showGrid,
  onToggleGrid
}) {
  const zoomPercent = Math.round(scale * 100);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/80 px-2 py-1.5 rounded-2xl shadow-xl text-xs text-slate-700">
      {/* Zoom Out Button */}
      <button
        onClick={onZoomOut}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        title="Zoom Out (Ctrl + -)"
      >
        <ZoomOut size={15} />
      </button>

      {/* Zoom Percentage (Click to reset 100%) */}
      <button
        onClick={onResetZoom}
        className="font-mono font-semibold px-2 py-0.5 rounded-md hover:bg-slate-100 text-slate-800 w-12 text-center"
        title="Reset Zoom to 100%"
      >
        {zoomPercent}%
      </button>

      {/* Zoom In Button */}
      <button
        onClick={onZoomIn}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        title="Zoom In (Ctrl + +)"
      >
        <ZoomIn size={15} />
      </button>

      <div className="w-[1px] h-4 bg-slate-200 mx-1" />

      {/* Fit to Screen */}
      <button
        onClick={onFitScreen}
        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
        title="Fit All Notes to Screen"
      >
        <Maximize2 size={15} />
      </button>

      {/* Grid Toggle */}
      <button
        onClick={onToggleGrid}
        className={`p-1.5 rounded-lg transition-colors ${
          showGrid ? 'bg-slate-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'
        }`}
        title="Toggle Dot Grid Pattern"
      >
        <Grid size={15} />
      </button>
    </div>
  );
}
