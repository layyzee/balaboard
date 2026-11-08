import React, { useState } from 'react';
import { X, Copy, Check, Share2, Wifi, Globe, Users, ArrowRight, ShieldCheck, Rocket } from 'lucide-react';

export default function ShareBoardModal({
  isOpen,
  onClose,
  roomId = 'main',
  onlineUsersCount = 1
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedTunnel, setCopiedTunnel] = useState(false);

  if (!isOpen) return null;

  const currentHost = window.location.hostname || '192.168.68.102';
  const localShareUrl = `http://${currentHost}:5175/?room=${roomId}`;
  const tunnelCmd = `npx localtunnel --port 5175`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(localShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyTunnel = () => {
    navigator.clipboard.writeText(tunnelCmd);
    setCopiedTunnel(true);
    setTimeout(() => setCopiedTunnel(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-sky-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Share2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-800">Share Retrospective Board</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Invite your team to collaborate in real-time on this board
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Method 1: Local Network Link (Office / Same Wi-Fi) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                <Wifi size={14} className="text-indigo-600" />
                <span>Office / Same Wi-Fi Link</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {onlineUsersCount} online now
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={localShareUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-700 select-all"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  copiedLink
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
                }`}
              >
                {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Any teammate connected to your Wi-Fi or office network can open this URL directly.
            </p>
          </div>

          {/* Method 2: Remote Teams / Work from Home */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Globe size={15} className="text-sky-600" />
              <span>For Remote Teams (Work from Home)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              If your teammates are remote, run this free 1-click command in your terminal to generate a secure, temporary public URL:
            </p>

            <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-3 py-2 rounded-xl text-xs font-mono">
              <span>{tunnelCmd}</span>
              <button
                onClick={handleCopyTunnel}
                className="text-slate-400 hover:text-white p-1 ml-2 transition-colors"
                title="Copy terminal command"
              >
                {copiedTunnel ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              100% Free ($0.00), no registration required.
            </p>
          </div>

          {/* Method 3: Permanent 24/7 Cloud Host (Render) */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                <Rocket size={15} className="text-purple-600" />
                <span>Permanent 24/7 Cloud Host (Render)</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                $0.00 Free
              </span>
            </div>
            <p className="text-xs text-purple-800/80 leading-relaxed">
              Deploy your board live 24/7 with permanent URL on Render's free tier.
            </p>
            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://render.com/deploy?repo=https://github.com/layyzee/balaboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-transform hover:scale-105"
              >
                <span>1-Click Deploy Blueprint</span>
                <ArrowRight size={13} />
              </a>
              <a
                href="https://github.com/layyzee/balaboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-colors"
              >
                <span>GitHub Repo</span>
              </a>
            </div>
          </div>

          {/* Room Details */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs">
            <div className="flex items-center gap-2 text-indigo-900 font-semibold">
              <Users size={15} className="text-indigo-600" />
              <span>Current Room: <strong className="font-mono text-indigo-700">{roomId}</strong></span>
            </div>
            <span className="text-[11px] text-indigo-600 font-medium">
              Real-time WebSocket Sync Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
