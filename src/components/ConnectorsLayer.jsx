import React from 'react';

export default function ConnectorsLayer({ connectors = [], stickyNotes = [], onDeleteConnector }) {
  if (!connectors || connectors.length === 0) return null;

  const notesMap = new Map(stickyNotes.map(n => [n.id, n]));

  return (
    <svg className="absolute inset-0 pointer-events-none w-[5000px] h-[5000px] z-10 overflow-visible">
      <defs>
        <marker
          id="connector-arrow"
          viewBox="0 0 10 10"
          refX="6"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b" />
        </marker>
      </defs>

      {connectors.map((conn) => {
        const fromNote = notesMap.get(conn.fromId);
        const toNote = notesMap.get(conn.toId);

        if (!fromNote || !toNote) return null;

        const x1 = fromNote.x + (fromNote.width || 170) / 2;
        const y1 = fromNote.y + (fromNote.height || 150) / 2;
        const x2 = toNote.x + (toNote.width || 170) / 2;
        const y2 = toNote.y + (toNote.height || 150) / 2;

        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2 - 30; // slight arc

        const pathD = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;

        return (
          <g key={conn.id} className="pointer-events-auto group cursor-pointer">
            {/* Clickable hit area */}
            <path
              d={pathD}
              stroke="transparent"
              strokeWidth="20"
              fill="none"
              onClick={() => onDeleteConnector && onDeleteConnector(conn.id)}
            />
            {/* Visual Arrow Line */}
            <path
              d={pathD}
              stroke={conn.color || '#64748b'}
              strokeWidth="2.5"
              strokeDasharray={conn.dashed ? "6,4" : "none"}
              fill="none"
              markerEnd="url(#connector-arrow)"
              className="group-hover:stroke-rose-500 transition-colors"
            />
            {/* Optional Label */}
            {conn.label && (
              <text
                x={midX}
                y={midY - 8}
                textAnchor="middle"
                className="text-[10px] font-bold fill-slate-600 bg-white"
              >
                {conn.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
