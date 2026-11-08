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

  const isLocal = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1' || 
    window.location.hostname.startsWith('192.168.')
  );
  
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://balaboard.onrender.com';
  const cloudShareUrl = `${currentOrigin}/?room=${roomId}`;
  const localShareUrl = isLocal ? `http://${window.location.hostname}:5175/?room=${roomId}` : cloudShareUrl;
  const tunnelCmd = `npx localtunnel --port 5175`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(isLocal ? localShareUrl : cloudShareUrl);
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
                  Live Cloud Sync
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Invite your team to collaborate in real-time across the internet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 transition-colors"
            title="Close Share Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main Share Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                {isLocal ? <Wifi size={14} className="text-indigo-600" /> : <Globe size={14} className="text-indigo-600" />}
                <span>{isLocal ? 'Local Network Link' : 'Public Cloud Collaboration Link'}</span>
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {onlineUsersCount} online in room
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={isLocal ? localShareUrl : cloudShareUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-700 select-all font-semibold"
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
              {isLocal
                ? 'Teammates on your local Wi-Fi network can open this link directly.'
                : 'Anyone worldwide can open this link to collaborate live on this retrospective with live notes and cursors.'}
            </p>
          </div>

          {/* Cloud Status Banner */}
          {!isLocal && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200/60 flex items-start gap-2.5">
              <ShieldCheck size={16} className="text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-indigo-900">
                <span className="font-bold block mb-0.5">Global Real-Time Mesh Active ($0.00 Hosting)</span>
                <p className="text-[11px] text-indigo-700/80 leading-relaxed">
                  Every participant joining this URL is connected to the live Render WebSocket server. Sticky notes, votes, timers, live cursors, and action items update across all screens instantly.
                </p>
              </div>
            </div>
          )}

          {/* Method 2: Remote Tunnel (Only during local development) */}
          {isLocal && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Globe size={15} className="text-sky-600" />
                <span>For Remote Teams (Work from Home)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If your teammates are remote during local testing, run this free 1-click command in your terminal to generate a secure, temporary public URL:
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
            </div>
          )}

          {/* Room Details */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-semibold">
              <Users size={15} className="text-indigo-600" />
              <span>Room ID: <strong className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/60">{roomId}</strong></span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              WebSockets Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
