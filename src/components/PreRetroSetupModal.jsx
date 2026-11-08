import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Clock, 
  Users, 
  Sparkles, 
  Check, 
  Ship, 
  Zap, 
  PlayCircle, 
  Layers, 
  Smile, 
  Sliders, 
  Compass, 
  Flower2, 
  CloudSun, 
  Mountain, 
  Split, 
  ArrowRight,
  ShieldAlert,
  Flame,
  HelpCircle,
  EyeOff
} from 'lucide-react';
import { TEMPLATES, RETRO_CATEGORIES } from '../constants/templates';

const ICON_MAP = {
  Ship,
  Zap,
  PlayCircle,
  Layers,
  Smile,
  Sliders,
  Compass,
  Flower2,
  CloudSun,
  Mountain,
  Split,
  Sparkles
};

export default function PreRetroSetupModal({
  isOpen,
  onClose,
  currentTemplateId,
  onStartRetro,
  currentUser
}) {
  const [selectedCategory, setSelectedCategory] = useState('All Templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(currentTemplateId || 'quick');

  // Pre-meeting Settings
  const [meetingTitle, setMeetingTitle] = useState('Sprint Retrospective');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  const [enableIcebreaker, setEnableIcebreaker] = useState(true);
  const [voteLimit, setVoteLimit] = useState(5);

  if (!isOpen) return null;

  const templateList = Object.values(TEMPLATES);

  const filteredTemplates = templateList.filter((tpl) => {
    const matchesCategory = selectedCategory === 'All Templates' || tpl.category === selectedCategory;
    const matchesSearch = tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedTemplate = TEMPLATES[selectedTemplateId] || TEMPLATES.quick;

  const handleLaunch = () => {
    onStartRetro({
      template: selectedTemplate,
      meetingSettings: {
        meetingTitle: meetingTitle.trim() || 'Sprint Retrospective',
        durationMinutes,
        isPrivateMode,
        enableIcebreaker,
        voteLimit
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-white to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 font-bold text-base">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-800">Miro Retrospective Hub</h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Pre-Meeting Setup
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Choose an agile retrospective framework inspired by Miro to guide your team's feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Body: Two Columns (Templates Gallery & Meeting Config) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Templates Gallery */}
          <div className="flex-1 flex flex-col border-r border-slate-100 overflow-hidden bg-slate-50/50">
            {/* Search & Category Tabs */}
            <div className="p-4 border-b border-slate-100 bg-white space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Miro retro templates (e.g. Sailboat, Start Stop, 4Ls, DAKI)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {RETRO_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-800 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Cards List */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredTemplates.map((template) => {
                const IconComponent = ICON_MAP[template.icon] || Sparkles;
                const isSelected = selectedTemplateId === template.id;

                return (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    className={`group cursor-pointer p-4 rounded-2xl border transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                        : 'bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    <div>
                      {/* Badge & Meta */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${template.badgeColor}`}>
                          {template.badge || template.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Clock size={12} />
                          <span>{template.recommendedTime}</span>
                        </div>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start gap-2.5 mb-2">
                        <div className={`p-2 rounded-xl transition-colors ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                        }`}>
                          <IconComponent size={18} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800 leading-snug">{template.title}</h3>
                      </div>

                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                        {template.description}
                      </p>
                    </div>

                    {/* Zone Previews */}
                    <div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.zones.map((zone) => (
                          <span
                            key={zone.id}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium truncate max-w-[120px]"
                          >
                            {zone.title.split('(')[0].trim()}
                          </span>
                        ))}
                      </div>

                      {isSelected && (
                        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                          <Check size={14} />
                          <span>Selected Template</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Pre-Meeting Settings & Facilitator Controls */}
          <div className="w-full md:w-80 lg:w-96 p-6 bg-white flex flex-col justify-between overflow-y-auto border-t md:border-t-0 border-slate-100">
            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Meeting Configuration
                </h2>
                <p className="text-xs text-slate-500">
                  Set meeting objectives and rules before inviting the team
                </p>
              </div>

              {/* Sprint / Meeting Title */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  Meeting / Sprint Title
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g. Sprint 24 Retrospective"
                  className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Facilitator Info */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{currentUser?.avatar || '👑'}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {currentUser?.name || 'Bala'}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {currentUser?.role || 'Scrum Master & Facilitator'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Host
                </span>
              </div>

              {/* Timebox Duration */}
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1.5">
                  Retro Duration (Timebox)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setDurationMinutes(mins)}
                      className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                        durationMinutes === mins
                          ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Facilitation Modes (Miro / Metro Retro Features) */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                  Facilitator Modes
                </span>

                {/* Private Writing Toggle */}
                <label className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={isPrivateMode}
                    onChange={(e) => setIsPrivateMode(e.target.checked)}
                    className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <EyeOff size={14} className="text-slate-600" />
                      <span className="text-xs font-bold text-slate-800">Private Writing Mode</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Hides note contents until facilitator reveals them to prevent team anchoring & groupthink.
                    </p>
                  </div>
                </label>

                {/* Icebreaker Warmup */}
                <label className="flex items-start gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={enableIcebreaker}
                    onChange={(e) => setEnableIcebreaker(e.target.checked)}
                    className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      <span className="text-xs font-bold text-slate-800">Icebreaker Warm-Up</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Show an interactive randomized icebreaker question banner to loosen up the team.
                    </p>
                  </div>
                </label>

                {/* Dot Vote Limit */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Vote Limit per Person</span>
                    <span className="font-bold text-slate-800">{voteLimit} votes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={voteLimit}
                    onChange={(e) => setVoteLimit(Number(e.target.value))}
                    className="w-full accent-indigo-600"
                  />
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={handleLaunch}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Launch {selectedTemplate.title.split('(')[0]}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
