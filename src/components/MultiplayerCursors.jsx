import React from 'react';

const USER_COLORS = [
  '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#ec4899', '#8b5cf6'
];

export default function MultiplayerCursors({ remoteCursors }) {
  if (!remoteCursors || remoteCursors.size === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40 overflow-visible">
      {Array.from(remoteCursors.entries()).map(([userId, cursor], idx) => {
        const color = cursor.color || USER_COLORS[idx % USER_COLORS.length];

        return (
          <div
            key={userId}
            style={{
              transform: `translate(${cursor.x}px, ${cursor.y}px)`,
              transition: 'transform 80ms linear'
            }}
            className="absolute top-0 left-0 flex items-start gap-1 select-none pointer-events-none"
          >
            {/* SVG Cursor Pointer */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-md"
            >
              <path
                d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                fill={color}
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>

            {/* User Name Badge */}
            <div
              style={{ backgroundColor: color }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[11px] font-bold shadow-md -mt-1 ml-1 whitespace-nowrap"
            >
              <span>{cursor.avatar || '👤'}</span>
              <span>{cursor.name || 'Teammate'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
