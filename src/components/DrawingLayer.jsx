import React from 'react';

export default function DrawingLayer({ drawings = [], currentStroke = null }) {
  const renderPath = (stroke) => {
    if (!stroke || !stroke.points || stroke.points.length === 0) return '';
    const points = stroke.points;
    if (points.length === 1) {
      return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;
    }

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  };

  return (
    <svg className="absolute inset-0 pointer-events-none w-[5000px] h-[5000px] z-20 overflow-visible">
      {/* Existing Saved Drawings */}
      {drawings.map((stroke) => (
        <path
          key={stroke.id}
          d={renderPath(stroke)}
          stroke={stroke.color || '#3b82f6'}
          strokeWidth={stroke.width || 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={stroke.opacity || 0.9}
        />
      ))}

      {/* Active In-Progress Stroke */}
      {currentStroke && currentStroke.points && currentStroke.points.length > 0 && (
        <path
          d={renderPath(currentStroke)}
          stroke={currentStroke.color || '#3b82f6'}
          strokeWidth={currentStroke.width || 3}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={currentStroke.opacity || 0.9}
        />
      )}
    </svg>
  );
}
