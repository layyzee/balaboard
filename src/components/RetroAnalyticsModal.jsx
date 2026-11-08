import React, { useState } from 'react';
import { 
  X, 
  BarChart2, 
  TrendingUp, 
  Users, 
  CheckSquare, 
  ThumbsUp, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Award,
  ArrowRight
} from 'lucide-react';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function RetroAnalyticsModal({
  isOpen,
  onClose,
  activeTemplate,
  meetingSettings,
  stickyNotes = [],
  actionItems = [],
  onlineUsers = []
}) {
  const [copiedReport, setCopiedReport] = useState(false);

  if (!isOpen) return null;

  // 1. Calculate Real Statistics from Sticky Notes
  const totalNotes = stickyNotes.length;
  const totalVotes = stickyNotes.reduce((acc, n) => acc + (n.votes || 0), 0);
  const totalReactions = stickyNotes.reduce((acc, n) => {
    return acc + Object.values(n.reactions || {}).reduce((sum, v) => sum + v, 0);
  }, 0);

  // Group by category colors: green/blue (positive), yellow/orange (ideas/improve), pink/red (friction/blockers)
  const positiveNotes = stickyNotes.filter(n => n.color === 'green' || n.color === 'blue');
  const ideaNotes = stickyNotes.filter(n => n.color === 'yellow' || n.color === 'orange');
  const frictionNotes = stickyNotes.filter(n => n.color === 'pink' || n.color === 'purple');

  const positivePercent = totalNotes > 0 ? Math.round((positiveNotes.length / totalNotes) * 100) : 50;
  const ideaPercent = totalNotes > 0 ? Math.round((ideaNotes.length / totalNotes) * 100) : 30;
  const frictionPercent = totalNotes > 0 ? 100 - positivePercent - ideaPercent : 20;

  // Sentiment Score (0 to 100)
  const sentimentScore = totalNotes > 0
    ? Math.min(100, Math.round(((positiveNotes.length * 1.2 + ideaNotes.length * 0.9) / totalNotes) * 85))
    : 85;

  // Action items stats
  const completedActions = actionItems.filter(i => i.completed).length;
  const linkedJiraActions = actionItems.filter(i => i.jiraIssue).length;
  const linkedJiraNotes = stickyNotes.filter(n => n.jiraIssue).length;
  const totalJiraIssues = linkedJiraActions + linkedJiraNotes;

  // Unique authors
  const uniqueAuthors = new Set(stickyNotes.map(n => n.author).filter(Boolean));
  const authorCount = Math.max(uniqueAuthors.size, onlineUsers.length, 1);

  // Top 3 Voted Themes
  const topVotedThemes = [...stickyNotes]
    .filter(n => n.text && n.text.trim().length > 0)
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 3);

  // Health diagnosis
  const getHealthBadge = () => {
    if (sentimentScore >= 75) {
      return { label: 'High Sprint Health & Strong Psychological Safety', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
    if (sentimentScore >= 50) {
      return { label: 'Moderate Team Health • Some Friction Observed', color: 'bg-amber-100 text-amber-800 border-amber-300' };
    }
    return { label: 'Action Needed • Team Blockers Identified', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const healthBadge = getHealthBadge();

  // Export Executive Markdown Report
  const handleCopyExecutiveReport = () => {
    playSound('pop');
    let md = `# 📊 Executive Agile Retrospective Health Report\n\n`;
    md += `**Meeting:** ${meetingSettings?.meetingTitle || 'Sprint Retrospective'}\n`;
    md += `**Template:** ${activeTemplate?.title || 'Quick Retrospective'}\n`;
    md += `**Date:** ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n`;
    md += `**Health Assessment:** ${healthBadge.label} (Sentiment Score: ${sentimentScore}/100)\n\n`;
    
    md += `## 📈 Key Retrospective Metrics\n`;
    md += `- **Team Sentiment Index:** ${sentimentScore}% Positive Momentum\n`;
    md += `- **Total Feedback Items:** ${totalNotes} notes shared\n`;
    md += `- **Active Contributors:** ${authorCount} team members\n`;
    md += `- **Total Votes & Reactions Cast:** ${totalVotes} votes, ${totalReactions} emoji reactions\n`;
    md += `- **Action Commitments:** ${actionItems.length} created (${completedActions} completed)\n`;
    md += `- **Jira Issues Linked:** ${totalJiraIssues} Atlassian issues created\n\n`;

    md += `## ⭐️ Top-Voted Team Priorities\n`;
    topVotedThemes.forEach((n, idx) => {
      md += `${idx + 1}. **"${n.text}"** (${n.votes || 0} votes) — *${n.author || 'Team Member'}*`;
      if (n.jiraIssue) md += ` → Linked Jira: [${n.jiraIssue.key}](${n.jiraIssue.url})`;
      md += `\n`;
    });

    md += `\n## 🎯 Committed Action Plan for Next Sprint\n`;
    if (actionItems.length === 0) {
      md += `*No formal action items assigned.*\n`;
    } else {
      actionItems.forEach(item => {
        md += `- [${item.completed ? 'x' : ' '}] **${item.title}** (Owner: @${item.assignee})`;
        if (item.jiraIssue) md += ` [${item.jiraIssue.key}](${item.jiraIssue.url})`;
        md += `\n`;
      });
    }

    md += `\n---\n*Report generated via BalaBoard Agile Retrospective Whiteboard (https://balaboard.onrender.com)*\n`;

    navigator.clipboard.writeText(md);
    setCopiedReport(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopiedReport(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <BarChart2 size={20} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Retrospective Analytics & Team Health</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950">
                  Sprint Pulse
                </span>
              </div>
              <p className="text-xs text-purple-100/80">
                {meetingSettings?.meetingTitle || 'Sprint 24 Retrospective'} • {totalNotes} topics analyzed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-purple-100 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Overall Health Status Banner */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Agile Health Assessment
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthBadge.color}`}>
                  {healthBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                High team engagement with psychological safety during private writing. Critical blockers mapped directly to Jira.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-2xl font-black text-indigo-700 block">
                {sentimentScore}%
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase">
                Team Sentiment
              </span>
            </div>
          </div>

          {/* 4 Pillars Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Card 1: Sentiment */}
            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-indigo-600 mb-2">
                <TrendingUp size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Sentiment</span>
              </div>
              <div className="text-xl font-black text-indigo-950">
                {positivePercent}%
              </div>
              <span className="text-[10px] text-indigo-700/80 font-medium mt-1">
                Positive Momentum
              </span>
            </div>

            {/* Card 2: Contributors */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-600 mb-2">
                <Users size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Engagement</span>
              </div>
              <div className="text-xl font-black text-emerald-950">
                {authorCount} Active
              </div>
              <span className="text-[10px] text-emerald-700/80 font-medium mt-1">
                Contributors
              </span>
            </div>

            {/* Card 3: Consensus */}
            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-amber-600 mb-2">
                <ThumbsUp size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Consensus</span>
              </div>
              <div className="text-xl font-black text-amber-950">
                {totalVotes} Votes
              </div>
              <span className="text-[10px] text-amber-700/80 font-medium mt-1">
                {totalReactions} Emoji Reactions
              </span>
            </div>

            {/* Card 4: Action Conversion */}
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
              <div className="flex items-center justify-between text-blue-600 mb-2">
                <CheckSquare size={16} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Actions</span>
              </div>
              <div className="text-xl font-black text-blue-950">
                {actionItems.length} Tasks
              </div>
              <span className="text-[10px] text-blue-700/80 font-medium mt-1">
                {totalJiraIssues} in Jira Backlog
              </span>
            </div>
          </div>

          {/* Feedback Sentiment Distribution Bars */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="uppercase tracking-wider">Feedback Sentiment Distribution</span>
              <span className="text-slate-400 font-normal">{totalNotes} Total Notes</span>
            </div>

            {/* Combined Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
              <div style={{ width: `${positivePercent}%` }} className="bg-emerald-500 h-full transition-all" title={`Celebrations: ${positivePercent}%`} />
              <div style={{ width: `${ideaPercent}%` }} className="bg-amber-400 h-full transition-all" title={`Ideas: ${ideaPercent}%`} />
              <div style={{ width: `${frictionPercent}%` }} className="bg-rose-400 h-full transition-all" title={`Friction: ${frictionPercent}%`} />
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Wins & Highlights ({positivePercent}%)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Ideas & Process ({ideaPercent}%)</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span>Friction & Blockers ({frictionPercent}%)</span>
              </span>
            </div>
          </div>

          {/* Top Voted Priorities */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              🏆 Top-Voted Team Priorities from Retrospective
            </span>

            {topVotedThemes.length === 0 ? (
              <p className="text-slate-400 italic">No notes have been upvoted yet.</p>
            ) : (
              <div className="space-y-2">
                {topVotedThemes.map((note, idx) => (
                  <div
                    key={note.id || idx}
                    className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center text-xs shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 text-xs truncate">
                          {note.text}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          Shared by {note.author || 'Team Member'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {note.jiraIssue && (
                        <a
                          href={note.jiraIssue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-xs"
                        >
                          <span>{note.jiraIssue.key}</span>
                          <ExternalLink size={9} />
                        </a>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                        {note.votes || 0} votes
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            Ready to share with Engineering Management & VPs
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopyExecutiveReport}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              {copiedReport ? <Check size={14} className="text-emerald-300" /> : <Copy size={14} />}
              <span>{copiedReport ? 'Report Copied to Clipboard!' : 'Copy Executive Report (Markdown)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
