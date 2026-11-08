import React, { useState } from 'react';
import { LogIn, ArrowRight, Sparkles, User, Shield } from 'lucide-react';
import { PRESET_USERS } from './UserLoginModal';
import { playSound } from '../utils/sound';

export default function JoinRoomModal({
  isOpen,
  roomId = 'main',
  currentUser,
  onJoin,
  onContinueAsGuest
}) {
  const [name, setName] = useState(currentUser?.name && currentUser.name !== 'Anonymous' ? currentUser.name : '');
  const [selectedPreset, setSelectedPreset] = useState(null);

  if (!isOpen) return null;

  const handleSelectPreset = (user) => {
    setSelectedPreset(user.id);
    setName(user.name);
    playSound('pop');
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    playSound('pop');

    // If matches a preset user, keep full metadata
    const preset = PRESET_USERS.find(p => p.name.toLowerCase() === name.trim().toLowerCase());
    if (preset) {
      onJoin(preset);
      return;
    }

    const newUser = {
      id: 'usr-' + Math.random().toString(36).substring(2, 8),
      name: name.trim(),
      role: 'Team Member',
      avatar: '🚀',
      isFacilitator: false,
      color: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    };
    onJoin(newUser);
  };

  const handleGuest = () => {
    playSound('pop');
    const guestUser = {
      id: 'guest-' + Math.random().toString(36).substring(2, 7),
      name: 'Anonymous',
      role: 'Guest Participant',
      avatar: '🎭',
      isFacilitator: false,
      color: 'bg-slate-100 text-slate-700 border-slate-300'
    };
    onContinueAsGuest ? onContinueAsGuest(guestUser) : onJoin(guestUser);
  };

  const displayRoomTitle = roomId === 'main'
    ? 'Sprint Retrospective'
    : roomId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-md overflow-hidden flex flex-col animate-scaleUp">
        {/* Header Banner */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 text-white relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white/90 text-[10px] font-bold tracking-wide uppercase border border-white/20">
              Live Retrospective
            </span>
            <span className="text-white/60 text-xs font-mono">• {roomId}</span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Joining {displayRoomTitle}</span>
          </h2>
          <p className="text-indigo-100/90 text-xs mt-1">
            What should your teammates call you during this session?
          </p>

          <div className="absolute top-4 right-4 text-3xl opacity-20 pointer-events-none select-none">
            🚀
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 bg-white">
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
                <span>Your Name or Handle</span>
                <span className="text-[10px] font-semibold text-slate-400">Displayed on stickies & cursor</span>
              </label>

              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Maya Chen, Alex, or Sarah"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setSelectedPreset(null);
                  }}
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-800 placeholder:text-slate-400"
                />
                <User size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Quick Teammate Chips */}
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Or Pick a Teammate Persona
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_USERS.map((user) => {
                  const isChosen = selectedPreset === user.id || name.toLowerCase() === user.name.toLowerCase();
                  return (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectPreset(user)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                        isChosen
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm scale-105'
                          : 'bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{user.avatar}</span>
                      <span>{user.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={!name.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs font-extrabold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Join Retrospective</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              or
            </span>
          </div>

          {/* Anonymous Option */}
          <button
            type="button"
            onClick={handleGuest}
            className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-800 border border-slate-200/80 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 hover:border-slate-300"
          >
            <span>Continue as Anonymous Guest 🎭</span>
          </button>
        </div>
      </div>
    </div>
  );
}
