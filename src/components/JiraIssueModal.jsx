import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  AlertCircle,
  Bookmark,
  Bug,
  CheckSquare,
  Zap,
  Globe
} from 'lucide-react';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export const JIRA_PROJECTS = [
  { key: 'SCRUM', name: 'Scrum Team Alpha', lead: 'Bala' },
  { key: 'KAN', name: 'Kanban Core Delivery', lead: 'Sarah' },
  { key: 'AGILE', name: 'Agile Platform & Tooling', lead: 'Alex' },
  { key: 'ENG', name: 'Engineering Operations', lead: 'David' }
];

export const JIRA_ISSUE_TYPES = [
  { id: 'Task', label: 'Task', icon: CheckSquare, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { id: 'Story', label: 'Story', icon: Bookmark, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Bug', label: 'Bug', icon: Bug, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'Spike', label: 'Spike / Research', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' }
];

export const JIRA_PRIORITIES = [
  { id: 'Highest', label: 'Highest', color: 'text-rose-600' },
  { id: 'High', label: 'High', color: 'text-orange-600' },
  { id: 'Medium', label: 'Medium', color: 'text-amber-600' },
  { id: 'Low', label: 'Low', color: 'text-emerald-600' },
  { id: 'Lowest', label: 'Lowest', color: 'text-slate-400' }
];

export default function JiraIssueModal({
  isOpen,
  onClose,
  sourceItem, // { type: 'note' | 'action', item: { id, text/title, author, assignee, votes, ... } }
  activeTemplate,
  meetingSettings,
  onCreateJiraIssue
}) {
  const [jiraDomain, setJiraDomain] = useState(() => {
    return localStorage.getItem('balaboard_jira_domain') || 'acme-agile.atlassian.net';
  });
  const [projectKey, setProjectKey] = useState('SCRUM');
  const [issueType, setIssueType] = useState('Task');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [assignee, setAssignee] = useState('Alex');
  const [labels, setLabels] = useState('retrospective, sprint-commitment');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdIssue, setCreatedIssue] = useState(null);

  // Pre-fill fields whenever modal opens with a new sourceItem
  useEffect(() => {
    if (sourceItem && sourceItem.item) {
      const it = sourceItem.item;
      const initialSummary = it.title || it.text || 'Action item from retrospective';
      setSummary(initialSummary);

      const retroName = meetingSettings?.meetingTitle || 'Sprint 24 Retrospective';
      const templateName = activeTemplate?.title || 'Quick Retrospective';
      const author = it.author || it.assignee || 'Team Member';
      const votes = it.votes ? `\n- Upvotes from team: ${it.votes} votes` : '';

      const initialDesc = `h3. Retrospective Context\n* *Meeting:* ${retroName}\n* *Framework:* ${templateName}\n* *Originated By:* ${author}${votes}\n* *Created Via:* BalaBoard Live Agile Whiteboard\n\nh3. Acceptance Criteria / Follow-Up Details\n- [ ] Concrete delivery or investigation for next sprint cycle\n- [ ] Update retrospective outcome in Jira board`;

      setDescription(initialDesc);
      setAssignee(it.assignee || 'Alex');
      setCreatedIssue(null);
    }
  }, [sourceItem, activeTemplate, meetingSettings]);

  if (!isOpen || !sourceItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!summary.trim()) return;

    setIsSubmitting(true);
    playSound('pop');

    // Simulate realistic Atlassian Jira issue creation
    setTimeout(() => {
      // Save domain preference
      localStorage.setItem('balaboard_jira_domain', jiraDomain);

      // Generate realistic Jira ticket number (e.g. SCRUM-108)
      const randomTicketNum = Math.floor(Math.random() * 80) + 101;
      const ticketKey = `${projectKey}-${randomTicketNum}`;
      const ticketUrl = `https://${jiraDomain}/browse/${ticketKey}`;

      const issueData = {
        key: ticketKey,
        url: ticketUrl,
        projectKey,
        issueType,
        summary: summary.trim(),
        priority,
        assignee,
        status: 'To Do',
        createdAt: new Date().toISOString()
      };

      setCreatedIssue(issueData);
      setIsSubmitting(false);
      playSound('reveal');
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });

      // Notify parent to attach Jira issue metadata to the note or action item
      if (onCreateJiraIssue) {
        onCreateJiraIssue(sourceItem, issueData);
      }
    }, 700);
  };

  const handleDone = () => {
    onClose();
    setCreatedIssue(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Atlassian Jira Branded Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V2h-10.48zm-5.76 5.82c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V7.82H5.77zm-5.77 5.82c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35v-10.44H0z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight">Create Jira Issue</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  Cloud REST API
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                Push retrospective commitments directly into your team's Jira backlog
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-blue-100 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success View */}
        {createdIssue ? (
          <div className="p-8 text-center space-y-5 animate-scaleUp">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center shadow-inner border border-blue-200">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V2h-10.48zm-5.76 5.82c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V7.82H5.77zm-5.77 5.82c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35v-10.44H0z"/>
              </svg>
            </div>

            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Jira Issue Successfully Created!
              </span>
              <h3 className="text-xl font-bold text-slate-800">
                {createdIssue.key}: {createdIssue.summary}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Linked to {sourceItem.type === 'note' ? 'Sticky Note' : 'Action Item'} with live badge
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Issue Key</span>
                <span className="font-mono font-bold text-blue-700">{createdIssue.key}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Issue Type & Priority</span>
                <span className="font-bold text-slate-700">{createdIssue.issueType} • {createdIssue.priority}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">Assignee</span>
                <span className="font-bold text-slate-700">@{createdIssue.assignee}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Jira URL</span>
                <a
                  href={createdIssue.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 hover:underline flex items-center gap-1 font-semibold truncate max-w-[280px]"
                >
                  <span>{createdIssue.url}</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={handleDone}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-105"
              >
                Back to Retrospective Board
              </button>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
            {/* Jira Instance Host */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Globe size={13} className="text-blue-600" />
                <span>Atlassian Jira Domain</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={jiraDomain}
                  onChange={(e) => setJiraDomain(e.target.value)}
                  placeholder="acme.atlassian.net"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:border-blue-500"
                />
                <span className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200/60">
                  Ready
                </span>
              </div>
            </div>

            {/* Project & Issue Type Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Project */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project
                </label>
                <select
                  value={projectKey}
                  onChange={(e) => setProjectKey(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  {JIRA_PROJECTS.map(p => (
                    <option key={p.key} value={p.key}>
                      {p.key} — {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Type */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Issue Type
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {JIRA_ISSUE_TYPES.map(t => {
                    const Icon = t.icon;
                    const isSelected = issueType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setIssueType(t.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-500/20'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Icon size={13} className={isSelected ? 'text-white' : ''} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Summary <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief description of the action item or task"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Description (Wiki / Markdown)
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed acceptance criteria or retrospective discussion points"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Priority & Assignee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  {JIRA_PRIORITIES.map(pr => (
                    <option key={pr.id} value={pr.id}>
                      {pr.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assignee
                </label>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="Bala">👑 Bala (Scrum Master)</option>
                  <option value="Alex">🎨 Alex (Frontend Lead)</option>
                  <option value="Sarah">⚙️ Sarah (Backend Lead)</option>
                  <option value="David">🔍 David (QA Lead)</option>
                  <option value="Emma">🚀 Emma (Product Manager)</option>
                  <option value="Unassigned">Unassigned</option>
                </select>
              </div>
            </div>

            {/* Labels */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Labels (comma-separated)
              </label>
              <input
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                placeholder="retrospective, tech-debt, sprint-commitment"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submit Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>Zero-Cost Atlassian Cloud Integration</span>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !summary.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Creating Issue...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Issue</span>
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
