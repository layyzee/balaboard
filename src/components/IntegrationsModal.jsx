import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Check, 
  Copy, 
  Send, 
  ExternalLink, 
  Loader2,
  Plug,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function IntegrationsModal({
  isOpen,
  onClose,
  activeTemplate,
  meetingSettings,
  stickyNotes,
  actionItems,
  currentUser
}) {
  const [activeTab, setActiveTab] = useState('slack'); // 'slack' | 'jira' | 'github'

  // Slack state
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(() => {
    return localStorage.getItem('balaboard_slack_webhook') || '';
  });
  const [isSendingSlack, setIsSendingSlack] = useState(false);
  const [slackStatus, setSlackStatus] = useState(null); // 'success' | 'error' | null

  // Copy state
  const [copiedJira, setCopiedJira] = useState(false);
  const [copiedGithub, setCopiedGithub] = useState(false);

  if (!isOpen) return null;

  const topVotedNotes = [...stickyNotes]
    .filter(n => n.text && n.text.trim())
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 5);

  // Send Slack Webhook
  const handleSendSlack = async () => {
    if (!slackWebhookUrl.trim()) {
      alert('Please enter your Slack Incoming Webhook URL.');
      return;
    }

    localStorage.setItem('balaboard_slack_webhook', slackWebhookUrl.trim());
    setIsSendingSlack(true);
    setSlackStatus(null);
    playSound('pop');

    // Build Slack Blocks
    const payload = {
      text: `📋 Retrospective Completed: ${meetingSettings?.meetingTitle || activeTemplate.title}`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `📋 ${meetingSettings?.meetingTitle || activeTemplate.title} — Retrospective Minutes`,
            emoji: true
          }
        },
        {
          type: "section",
          fields: [
            { type: "mrkdwn", text: `*Framework:* ${activeTemplate.title}` },
            { type: "mrkdwn", text: `*Facilitator:* @${currentUser?.name || 'Bala'}` },
            { type: "mrkdwn", text: `*Date:* ${new Date().toLocaleDateString()}` },
            { type: "mrkdwn", text: `*Action Items:* ${actionItems.length} committed` }
          ]
        },
        { type: "divider" },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*⭐️ Top-Voted Themes from Team:*\n` +
              (topVotedNotes.length > 0
                ? topVotedNotes.map((n, i) => `${i + 1}. "${n.text}" *(+${n.votes || 0} votes)*`).join('\n')
                : "_No notes recorded_")
          }
        },
        { type: "divider" },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*🎯 Agreed Action Items for Next Sprint:*\n` +
              (actionItems.length > 0
                ? actionItems.map(item => `• [${item.completed ? 'x' : ' '}] *${item.title}* (Owner: @${item.assignee})`).join('\n')
                : "_No action items logged_")
          }
        }
      ]
    };

    try {
      const res = await fetch(slackWebhookUrl.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors' // Slack incoming webhooks from browser require no-cors or proxy
      });

      setSlackStatus('success');
      playSound('reveal');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
    } catch (err) {
      setSlackStatus('error');
    } finally {
      setIsSendingSlack(false);
    }
  };

  // Generate Jira text
  const getJiraMarkdown = () => {
    let text = `h2. 📋 Sprint Retrospective Action Items (${meetingSettings?.meetingTitle || activeTemplate.title})\n\n`;
    text += `*Facilitator:* ${currentUser?.name || 'Bala'} | *Date:* ${new Date().toLocaleDateString()}\n\n`;
    text += `h3. 🎯 Committed Action Items\n`;
    actionItems.forEach(item => {
      text += `* [${item.completed ? 'x' : ' '}] ${item.title} - Assigned: [~${item.assignee}]\n`;
    });
    text += `\nh3. ⭐️ Top Retro Notes\n`;
    topVotedNotes.forEach(n => {
      text += `* "${n.text}" (${n.votes || 0} votes)\n`;
    });
    return text;
  };

  // Generate GitHub text
  const getGithubMarkdown = () => {
    let text = `## 📋 ${meetingSettings?.meetingTitle || activeTemplate.title} — Retrospective Action Plan\n\n`;
    text += `**Date:** ${new Date().toLocaleDateString()} | **Facilitator:** @${currentUser?.name || 'Bala'}\n\n`;
    text += `### 🎯 Action Items:\n`;
    actionItems.forEach(item => {
      text += `- [${item.completed ? 'x' : ' '}] **${item.title}** (Assignee: @${item.assignee})\n`;
    });
    text += `\n### ⭐️ Key Highlights & Themes:\n`;
    topVotedNotes.forEach(n => {
      text += `- "${n.text}" *(+${n.votes || 0} votes)*\n`;
    });
    return text;
  };

  const handleCopyJira = () => {
    navigator.clipboard.writeText(getJiraMarkdown());
    setCopiedJira(true);
    setTimeout(() => setCopiedJira(false), 2000);
  };

  const handleCopyGithub = () => {
    navigator.clipboard.writeText(getGithubMarkdown());
    setCopiedGithub(true);
    setTimeout(() => setCopiedGithub(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50/50 via-white to-sky-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Plug size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">Team Integrations Hub</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Slack • Jira • GitHub
                </span>
              </div>
              <p className="text-xs text-slate-500">
                1-click push retrospective outcomes directly into your team tools
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('slack')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'slack'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>💬 Slack Webhook</span>
          </button>

          <button
            onClick={() => setActiveTab('jira')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'jira'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🔷 Jira Issues Format</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'github'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🐙 GitHub Issues Format</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* TAB 1: SLACK */}
          {activeTab === 'slack' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Slack Incoming Webhook URL
                </label>
                <input
                  type="text"
                  placeholder="https://hooks.slack.com/services/T.../B.../..."
                  value={slackWebhookUrl}
                  onChange={(e) => setSlackWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Create an Incoming Webhook in your Slack App Directory to post to your retro channel.
                </p>
              </div>

              {/* Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-slate-600">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Message Payload Preview
                </span>
                <p className="font-bold text-slate-800">
                  📋 {meetingSettings?.meetingTitle || activeTemplate.title} — Retrospective Minutes
                </p>
                <p className="text-[11px]">
                  Includes {topVotedNotes.length} top-voted themes and {actionItems.length} assigned action items.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  {slackStatus === 'success' && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle size={15} /> Sent to Slack channel!
                    </span>
                  )}
                  {slackStatus === 'error' && (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle size={15} /> Webhook dispatch failed.
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSendSlack}
                  disabled={isSendingSlack || !slackWebhookUrl.trim()}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-all hover:scale-105"
                >
                  {isSendingSlack ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>Post to Slack Channel</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: JIRA */}
          {activeTab === 'jira' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Jira Wiki Markup Format</span>
                <button
                  onClick={handleCopyJira}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedJira ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedJira ? 'Copied!' : 'Copy for Jira'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={getJiraMarkdown()}
                rows={8}
                className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl resize-none text-slate-700 select-all"
              />
            </div>
          )}

          {/* TAB 3: GITHUB */}
          {activeTab === 'github' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">GitHub Markdown Format</span>
                <button
                  onClick={handleCopyGithub}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {copiedGithub ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedGithub ? 'Copied!' : 'Copy for GitHub'}</span>
                </button>
              </div>
              <textarea
                readOnly
                value={getGithubMarkdown()}
                rows={8}
                className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl resize-none text-slate-700 select-all"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
