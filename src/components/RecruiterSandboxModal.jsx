import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  ArrowRight, 
  Rocket, 
  Layers, 
  Users, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Globe,
  Radio,
  Clock,
  RotateCcw
} from 'lucide-react';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function RecruiterSandboxModal({
  isOpen,
  onClose,
  onLaunchSandbox,
  onCreateCleanRoom,
  currentRoomId
}) {
  const [customRoomInput, setCustomRoomInput] = useState('');
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const handleLaunchDemo = () => {
    playSound('reveal');
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.5 } });
    if (dontShowAgain) {
      localStorage.setItem('balaboard_seen_welcome', 'true');
    }
    onLaunchSandbox();
    onClose();
  };

  const handleStartClean = () => {
    playSound('pop');
    if (dontShowAgain) {
      localStorage.setItem('balaboard_seen_welcome', 'true');
    }
    onCreateCleanRoom();
    onClose();
  };

  const handleJoinCustom = (e) => {
    e.preventDefault();
    if (!customRoomInput.trim()) return;
    playSound('pop');
    if (dontShowAgain) {
      localStorage.setItem('balaboard_seen_welcome', 'true');
    }
    const cleanRoom = customRoomInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    window.location.search = `?room=${cleanRoom}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh] animate-scaleUp">
        
        {/* Top Header Banner with Gradient */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 text-white overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl shadow-inner border border-white/30">
                B
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold tracking-tight">Welcome to BalaBoard</h1>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-xs border border-white/30">
                    $0.00 Free Tier
                  </span>
                </div>
                <p className="text-xs text-amber-100 font-medium mt-0.5">
                  The Real-Time Agile Retrospective & Facilitation Whiteboard
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors"
              title="Close Welcome Screen"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          
          {/* Tagline */}
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineered to eliminate costly SaaS whiteboard licenses ($16/seat) and meeting friction. Choose how you would like to explore BalaBoard:
          </p>

          {/* Two Primary Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* OPTION 1: RECRUITER DEMO SANDBOX (HERO CARD) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-amber-50/80 via-white to-orange-50/40 border-2 border-amber-300 shadow-md hover:shadow-xl hover:border-amber-400 transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden">
              <div className="absolute top-2 right-2">
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-xs">
                  Recruiter Pick
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Sparkles size={18} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 group-hover:text-amber-800 transition-colors">
                    Recruiter Demo Sandbox
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Pre-populated with 12 real engineering sticky notes, dot votes, connected Jira ticket badges, and launches the 60-second guided tour.
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 font-medium pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>12 realistic sprint topics pre-seeded</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>Jira Cloud issue linking with badges</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span>Auto-starts guided demo tour</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLaunchDemo}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Launch Recruiter Sandbox</span>
                <Rocket size={13} />
              </button>
            </div>

            {/* OPTION 2: CLEAN AGILE TEAM ROOM */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group">
              <div className="space-y-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Layers size={18} className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-700 transition-colors">
                    Start Blank Agile Room
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Create a fresh, empty retrospective board for your engineering team with 12 Miro templates and live cloud sync.
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-600 font-medium pt-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-indigo-500 shrink-0" />
                    <span>100% clean canvas for your sprint</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-indigo-500 shrink-0" />
                    <span>1-click shareable link for teammates</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="text-indigo-500 shrink-0" />
                    <span>Real-time cross-internet WebSockets</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartClean}
                className="w-full py-2.5 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200/80 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Create Clean Team Room</span>
                <ArrowRight size={13} />
              </button>
            </div>

          </div>

          {/* Quick Join Custom Room Form */}
          <div className="pt-2 border-t border-slate-100">
            <form onSubmit={handleJoinCustom} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={customRoomInput}
                  onChange={(e) => setCustomRoomInput(e.target.value)}
                  placeholder="Or join specific room (e.g. sprint-25, payments)..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={!customRoomInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-bold transition-colors whitespace-nowrap"
              >
                Join Room →
              </button>
            </form>
          </div>

          {/* Remember Choice / Footer Controls */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-0"
              />
              <span>Don't show this welcome screen on startup</span>
            </label>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 underline font-medium"
            >
              Continue to {currentRoomId === 'main' ? 'main room' : currentRoomId}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
