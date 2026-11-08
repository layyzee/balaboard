import React, { useState } from 'react';
import { X, Check, ShieldCheck, User, Users, Sparkles, LogIn } from 'lucide-react';

export const PRESET_USERS = [
  { id: 'u-1', name: 'Bala', role: 'Scrum Master & Facilitator', avatar: '👑', isFacilitator: true, color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'u-2', name: 'Sarah', role: 'Frontend Engineer', avatar: '💻', isFacilitator: false, color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { id: 'u-3', name: 'Alex', role: 'Backend Architect', avatar: '⚡', isFacilitator: false, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'u-4', name: 'Jordan', role: 'Product Designer', avatar: '🎨', isFacilitator: false, color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { id: 'u-5', name: 'Priya', role: 'QA & Test Specialist', avatar: '🔍', isFacilitator: false, color: 'bg-purple-100 text-purple-800 border-purple-300' }
];

export default function UserLoginModal({
  isOpen,
  onClose,
  currentUser,
  onSelectUser
}) {
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('Engineer');
  const [customAvatar, setCustomAvatar] = useState('🚀');

  if (!isOpen) return null;

  const handleCreateCustom = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const newUser = {
      id: 'custom-' + Date.now(),
      name: customName.trim(),
      role: customRole,
      avatar: customAvatar,
      isFacilitator: false,
      color: 'bg-sky-100 text-sky-800 border-sky-300'
    };
    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/80 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <LogIn size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Facilitator & Team Sign-In</h2>
              <p className="text-xs text-slate-500">Pick your participant profile or enter your custom name</p>
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
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Quick Select Presets */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Active Team Members
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {PRESET_USERS.map((user) => {
                const isSelected = currentUser?.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-xs border border-slate-100">
                        {user.avatar}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">{user.name}</span>
                          {user.isFacilitator && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                              Facilitator
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{user.role}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                        <Check size={14} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom User Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Or Create Custom Profile
            </span>
          </div>

          {/* Custom User Form */}
          <form onSubmit={handleCreateCustom} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Maya Chen"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Your Role</label>
                <input
                  type="text"
                  placeholder="e.g. DevOps Lead"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Avatar Emoji</label>
                <div className="flex gap-1.5">
                  {['🚀', '🦄', '🎯', '💡', '🤖', '🦊'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setCustomAvatar(emoji)}
                      className={`text-lg p-1.5 rounded-lg border transition-transform ${
                        customAvatar === emoji ? 'border-indigo-500 bg-indigo-50 scale-110' : 'border-slate-200 bg-white'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!customName.trim()}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Sign In as {customName.trim() || 'Custom User'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
