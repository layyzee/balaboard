import React, { useState } from 'react';
import { X, CheckSquare, Plus, Trash2, Copy, Check, ThumbsUp, Sparkles, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActionItemsDrawer({
  isOpen,
  onClose,
  stickyNotes,
  actionItems,
  onAddActionItem,
  onToggleActionItem,
  onDeleteActionItem,
  onConvertNoteToAction
}) {
  const [newTitle, setNewTitle] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Sort notes by highest votes first
  const topVotedNotes = [...stickyNotes]
    .filter(n => n.text && n.text.trim().length > 0)
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 8);

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddActionItem({
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      assignee: newAssignee.trim() || 'Unassigned',
      completed: false,
      createdAt: Date.now()
    });
    setNewTitle('');
    setNewAssignee('');
  };

  const handleToggle = (id) => {
    onToggleActionItem(id);
    // Check if all are completed
    const updated = actionItems.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    if (updated.length > 0 && updated.every(item => item.completed)) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handleCopyMarkdown = () => {
    let md = `# 🎯 Sprint Retrospective Action Items\n\n`;
    md += `**Date:** ${new Date().toLocaleDateString()}\n\n`;
    md += `## 📋 Action Plan:\n`;
    actionItems.forEach(item => {
      md += `- [${item.completed ? 'x' : ' '}] **${item.title}** (Assignee: @${item.assignee})\n`;
    });

    if (topVotedNotes.length > 0) {
      md += `\n## ⭐️ Top-Voted Themes from Retrospective:\n`;
      topVotedNotes.slice(0, 5).forEach((n, i) => {
        md += `${i+1}. "${n.text}" (${n.votes || 0} votes)\n`;
      });
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-slate-200/80 shadow-2xl flex flex-col animate-slide-left">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
            <CheckSquare size={18} />
          </div>
          <div>
            <h2 className="font-bold text-sm text-slate-800">Action Items & Voting</h2>
            <p className="text-[11px] text-slate-500">Track retro commitments for next sprint</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Top-Voted Notes Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <ThumbsUp size={12} className="text-amber-500" /> Top-Voted Sticky Notes
            </span>
            <span className="text-[10px] text-slate-400">Click to convert to action</span>
          </div>

          {topVotedNotes.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-400 text-center">
              No voted notes yet. Upvote sticky notes on canvas!
            </div>
          ) : (
            <div className="space-y-1.5">
              {topVotedNotes.map(n => (
                <div
                  key={n.id}
                  className="flex items-center justify-between p-2 rounded-xl border border-slate-200/70 hover:border-indigo-300 bg-white hover:bg-indigo-50/30 transition-all text-xs group"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                    <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px] shrink-0">
                      +{n.votes || 0}
                    </span>
                    <span className="truncate text-slate-700 font-medium">{n.text}</span>
                  </div>
                  <button
                    onClick={() => onConvertNoteToAction(n)}
                    className="p-1 rounded bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-500 transition-colors shrink-0"
                    title="Turn note into Action Item"
                  >
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Items List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <CheckSquare size={12} className="text-indigo-500" /> Committed Action Plan
            </span>
            <span className="text-[11px] font-bold text-indigo-600">
              {actionItems.filter(i => i.completed).length} / {actionItems.length} Done
            </span>
          </div>

          {/* Add Action Item Input */}
          <form onSubmit={handleCreateNew} className="space-y-2 mb-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What will the team do next sprint?"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="Assignee (e.g. Bala, Team)"
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                + Add
              </button>
            </div>
          </form>

          {/* Action Items Checklist */}
          {actionItems.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-xs text-slate-400 text-center">
              No action items committed yet. Convert high-voted notes above or type an action item.
            </div>
          ) : (
            <div className="space-y-2">
              {actionItems.map(item => (
                <div
                  key={item.id}
                  className={`flex items-start justify-between p-2.5 rounded-xl border transition-all text-xs ${
                    item.completed
                      ? 'bg-emerald-50/50 border-emerald-200 text-slate-400'
                      : 'bg-white border-slate-200/80 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-2 flex-1 min-w-0 pr-2">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggle(item.id)}
                      className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium break-words leading-snug ${item.completed ? 'line-through text-slate-400' : ''}`}>
                        {item.title}
                      </p>
                      <span className="text-[10px] text-indigo-600 font-semibold mt-0.5 inline-block">
                        @{item.assignee}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteActionItem(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/80">
        <button
          onClick={handleCopyMarkdown}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span>Copied for Jira / Confluence!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Action Items (Markdown)</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
