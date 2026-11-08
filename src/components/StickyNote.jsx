import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Palette, ThumbsUp, Check, EyeOff, Smile, Tag, GitFork } from 'lucide-react';
import { PASTEL_COLORS } from '../constants/templates';
import { playSound } from '../utils/sound';

const QUICK_EMOJIS = ['👍', '❤️', '🚀', '🔥', '💡'];
const QUICK_TAGS = ['#tech-debt', '#blocker', '#team-win', '#process', '#bug'];

export default function StickyNote({
  note,
  onUpdate,
  onDelete,
  scale,
  isVotingMode,
  currentUser,
  areNotesRevealed,
  isPrivateWriting,
  activeTool = 'select',
  onNoteClickInConnectorMode,
  isConnectorSource = false,
  activeTagFilter = null,
  onOpenJiraModal
}) {
  const [isEditing, setIsEditing] = useState(!note.text);
  const [text, setText] = useState(note.text || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [showTagsMenu, setShowTagsMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const textareaRef = useRef(null);
  const noteRef = useRef(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    onUpdate(note.id, { text });
  };

  const handleVote = (e) => {
    e.stopPropagation();
    playSound('vote');
    onUpdate(note.id, { votes: (note.votes || 0) + 1 });
  };

  const handleAddReaction = (emoji, e) => {
    e.stopPropagation();
    playSound('pop');
    const existingReactions = note.reactions || {};
    const count = (existingReactions[emoji] || 0) + 1;
    onUpdate(note.id, {
      reactions: {
        ...existingReactions,
        [emoji]: count
      }
    });
    setShowReactionsMenu(false);
  };

  const handleToggleTag = (tag, e) => {
    e.stopPropagation();
    playSound('pop');
    const existingTags = note.tags || [];
    const updated = existingTags.includes(tag)
      ? existingTags.filter(t => t !== tag)
      : [...existingTags, tag];
    onUpdate(note.id, { tags: updated });
  };

  const handleColorChange = (color, e) => {
    e.stopPropagation();
    onUpdate(note.id, { color });
    setShowColorPicker(false);
  };

  // Dragging logic (disabled when drawing or connecting)
  const handleMouseDown = (e) => {
    if (activeTool === 'connector') {
      e.stopPropagation();
      onNoteClickInConnectorMode && onNoteClickInConnectorMode(note.id);
      return;
    }
    if (activeTool === 'pen' || activeTool === 'highlighter') return;
    if (isEditing || e.target.closest('button') || e.target.closest('textarea')) return;

    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      initialX: note.x,
      initialY: note.y
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      onUpdate(note.id, {
        x: Math.round(dragStart.initialX + dx),
        y: Math.round(dragStart.initialY + dy)
      });
    };

    const handleMouseUp = () => {
      if (isDragging) setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, scale, note.id, onUpdate]);

  const palette = PASTEL_COLORS[note.color] || PASTEL_COLORS.yellow;
  const rotationStyle = note.rotation ? `rotate(${note.rotation}deg)` : 'rotate(0deg)';

  // Private mode check
  const isAuthor = !note.author || note.author === currentUser?.name;
  const isMasked = isPrivateWriting && !areNotesRevealed && !isAuthor;

  // Filter dimming
  const isDimmed = activeTagFilter && (!note.tags || !note.tags.includes(activeTagFilter));

  // Voting Heatmap Glow Logic
  const votes = note.votes || 0;
  let heatmapClass = '';
  if (votes >= 6) {
    heatmapClass = 'ring-3 ring-amber-400 shadow-[0_0_28px_rgba(245,158,11,0.65)]';
  } else if (votes >= 3) {
    heatmapClass = 'ring-2 ring-indigo-400 shadow-[0_0_16px_rgba(99,102,241,0.45)]';
  } else if (votes >= 1) {
    heatmapClass = 'shadow-md';
  }

  return (
    <div
      ref={noteRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate(${note.x}px, ${note.y}px) ${rotationStyle}`,
        width: `${note.width || 170}px`,
        minHeight: `${note.height || 150}px`
      }}
      className={`absolute select-none rounded-2xl p-3 transition-all group flex flex-col justify-between border ${
        palette.bg
      } ${palette.border} ${
        isConnectorSource
          ? 'ring-4 ring-indigo-500 scale-105 z-40'
          : isDragging
          ? 'shadow-sticky-drag z-30 cursor-grabbing scale-105'
          : activeTool === 'connector'
          ? 'cursor-pointer hover:ring-2 hover:ring-indigo-400'
          : heatmapClass ? `${heatmapClass} cursor-grab hover:shadow-xl` : 'shadow-sticky cursor-grab hover:shadow-lg'
      } ${isDimmed ? 'opacity-20' : 'opacity-100'}`}
    >
      {/* Radiant Top Voted Pill Badge for 6+ Votes */}
      {votes >= 6 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 z-20 pointer-events-none animate-bounce">
          <span>🏆</span>
          <span>Top Voted ({votes})</span>
        </div>
      )}
      {/* Top Header Controls (Visible on hover or active) */}
      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity mb-1 relative">
        <div className="flex items-center gap-1">
          {/* Color Swatch Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowColorPicker(!showColorPicker);
              setShowReactionsMenu(false);
              setShowTagsMenu(false);
            }}
            className="p-1 rounded-lg hover:bg-black/10 text-slate-700 transition-colors"
            title="Change sticky note color"
          >
            <Palette size={13} />
          </button>

          {/* Quick Reaction Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowReactionsMenu(!showReactionsMenu);
              setShowColorPicker(false);
              setShowTagsMenu(false);
            }}
            className="p-1 rounded-lg hover:bg-black/10 text-slate-700 transition-colors"
            title="Add emoji reaction"
          >
            <Smile size={13} />
          </button>

          {/* Tag Chips Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTagsMenu(!showTagsMenu);
              setShowColorPicker(false);
              setShowReactionsMenu(false);
            }}
            className="p-1 rounded-lg hover:bg-black/10 text-slate-700 transition-colors"
            title="Add tag label"
          >
            <Tag size={13} />
          </button>

          {/* Push to Jira Issue Trigger */}
          {onOpenJiraModal && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenJiraModal({ type: 'note', item: note });
              }}
              className={`p-1 rounded-lg transition-colors ${
                note.jiraIssue
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-blue-50 text-slate-700 hover:text-blue-700'
              }`}
              title={note.jiraIssue ? `Linked to Jira: ${note.jiraIssue.key}` : "Push note to Jira Issue"}
            >
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V2h-10.48zm-5.76 5.82c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V7.82H5.77zm-5.77 5.82c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35v-10.44H0z"/>
              </svg>
            </button>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(note.id);
          }}
          className="p-1 rounded-lg hover:bg-rose-500/20 text-rose-700 transition-colors"
          title="Delete sticky note"
        >
          <Trash2 size={13} />
        </button>

        {/* Color Picker Dropdown Popover */}
        {showColorPicker && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-7 left-0 z-40 bg-white rounded-xl shadow-xl border border-slate-200 p-2 flex gap-1.5 animate-fadeIn"
          >
            {Object.entries(PASTEL_COLORS).map(([colorKey, clr]) => (
              <button
                key={colorKey}
                onClick={(e) => handleColorChange(colorKey, e)}
                className={`w-5 h-5 rounded-full ${clr.dot} border border-slate-300 hover:scale-125 transition-transform flex items-center justify-center`}
                title={clr.label}
              >
                {note.color === colorKey && <Check size={10} className="text-white" />}
              </button>
            ))}
          </div>
        )}

        {/* Reactions Picker Dropdown */}
        {showReactionsMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-7 left-0 z-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 flex gap-1 animate-fadeIn"
          >
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={(e) => handleAddReaction(emoji, e)}
                className="text-base p-1 hover:bg-slate-100 rounded-lg transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Tags Picker Dropdown */}
        {showTagsMenu && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-7 left-0 z-40 bg-white rounded-xl shadow-xl border border-slate-200 p-2 flex flex-col gap-1 w-32 animate-fadeIn"
          >
            {QUICK_TAGS.map((t) => {
              const isAttached = (note.tags || []).includes(t);
              return (
                <button
                  key={t}
                  onClick={(e) => handleToggleTag(t, e)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-md text-left transition-colors flex items-center justify-between ${
                    isAttached ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{t}</span>
                  {isAttached && <Check size={10} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Note Content (Editable or Masked) */}
      <div
        className="flex-1 flex flex-col justify-center cursor-text my-1"
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (!isMasked && activeTool === 'select') setIsEditing(true);
        }}
      >
        {isMasked ? (
          <div className="flex flex-col items-center justify-center py-4 px-2 text-center text-slate-500 bg-black/5 rounded-xl backdrop-blur-xs select-none">
            <EyeOff size={16} className="text-slate-400 mb-1" />
            <span className="text-[11px] font-bold text-slate-600">Private Reflection</span>
            <span className="text-[9px] text-slate-400">Revealed during group review</span>
          </div>
        ) : isEditing ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleBlur();
              }
            }}
            placeholder="Type your thought..."
            className="w-full h-full bg-transparent resize-none border-none outline-hidden font-handwriting text-base text-slate-900 leading-snug placeholder:text-slate-400"
            rows={4}
          />
        ) : (
          <p className="font-handwriting text-base text-slate-900 leading-snug whitespace-pre-wrap break-words">
            {note.text || <span className="text-slate-400 italic">Double click to write...</span>}
          </p>
        )}
      </div>

      {/* Attached Tags & Jira Badge */}
      <div className="flex flex-wrap items-center gap-1 my-1">
        {note.jiraIssue && (
          <a
            href={note.jiraIssue.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors shrink-0"
            title={`Jira Issue: ${note.jiraIssue.key} - ${note.jiraIssue.summary || ''}`}
          >
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V2h-10.48zm-5.76 5.82c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V7.82H5.77zm-5.77 5.82c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35v-10.44H0z"/>
            </svg>
            <span>{note.jiraIssue.key}</span>
            <span className="text-[7px] opacity-80">↗</span>
          </a>
        )}
        {note.tags && note.tags.map((t) => (
          <span
            key={t}
            className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-white/70 text-slate-700 border border-black/5"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer: Author Badge & Reactions / Dot Voting Counter */}
      <div className="flex items-center justify-between pt-1 border-t border-black/5">
        {/* Author Tag */}
        <div className="flex items-center gap-1">
          {note.author ? (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/60 text-slate-700 border border-black/5 truncate max-w-[80px]">
              {note.author}
            </span>
          ) : (
            <span className="text-[9px] text-slate-500 font-medium">Anonymous</span>
          )}
          {isPrivateWriting && isAuthor && !areNotesRevealed && (
            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100/80 px-1 rounded-sm">
              You
            </span>
          )}
        </div>

        {/* Voting & Reactions Badge */}
        <div className="flex items-center gap-1">
          {/* Reaction counts */}
          {note.reactions && Object.entries(note.reactions).map(([emo, cnt]) => (
            <span
              key={emo}
              className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/70 border border-black/5 flex items-center gap-0.5"
            >
              <span>{emo}</span>
              <span className="font-bold text-slate-700">{cnt}</span>
            </span>
          ))}

          {/* Dot Vote Pill */}
          <button
            onClick={handleVote}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-transform hover:scale-110 active:scale-95 shadow-xs ${
              (note.votes || 0) > 0
                ? 'bg-indigo-600 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 border border-black/5'
            }`}
            title="Vote on this sticky note (+1)"
          >
            <ThumbsUp size={11} />
            <span>{note.votes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
