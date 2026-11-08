import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  CheckSquare, 
  ChevronDown, 
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Trash2, 
  Sparkles,
  Palette,
  LayoutGrid,
  User,
  Users,
  Share2,
  Minimize2,
  Maximize2,
  ArrowUpDown,
  Eye,
  EyeOff,
  Layers,
  Shuffle,
  X,
  Radio,
  Headphones,
  Music
} from 'lucide-react';
import { PASTEL_COLORS, ICEBREAKER_QUESTIONS } from '../constants/templates';
import { playSound } from '../utils/sound';
import { startAmbientFocus, stopAmbientFocus, isAmbientPlaying } from '../utils/ambientAudio';
import confetti from 'canvas-confetti';

export const RETRO_PHASES = [
  { id: 'icebreaker', step: 1, label: 'Icebreaker', icon: '🧊', desc: 'Team warmup & mindset' },
  { id: 'reflect', step: 2, label: 'Reflect', icon: '✍️', desc: 'Write sticky notes independently' },
  { id: 'group', step: 3, label: 'Group & Cluster', icon: '👥', desc: 'Reveal & organize themes' },
  { id: 'vote', step: 4, label: 'Vote', icon: '🗳️', desc: 'Prioritize key topics' },
  { id: 'actions', step: 5, label: 'Discuss & Actions', icon: '🎯', desc: 'Assign concrete follow-ups' }
];

export default function Toolbar({
  activeTemplate,
  meetingSettings,
  onOpenPreRetroModal,
  onOpenUserModal,
  onOpenShareModal,
  currentUser,
  onlineUsers = [],
  connectionStatus = 'disconnected',
  onAddStickyNote,
  onOpenActionItems,
  actionItemsCount,
  onExportPNG,
  onExportMarkdown,
  onExportJSON,
  onClearBoard,
  scale,
  onResetZoom,
  dockPosition = 'top',
  onToggleDockPosition,
  isMinimized = false,
  onToggleMinimize,
  // Facilitation Props
  currentPhaseIndex = 0,
  onPhaseChange,
  areNotesRevealed = false,
  onToggleRevealNotes,
  onAutoCluster,
  // Spotlight & Power Tools
  onSpotlightEveryone,
  isSpotlightingActive = false,
  onReleaseSpotlight
}) {
  // Timer State
  const initialSeconds = (meetingSettings?.durationMinutes || 45) * 60;
  const [timerSeconds, setTimerSeconds] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimerMenu, setShowTimerMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [selectedStickyColor, setSelectedStickyColor] = useState('yellow');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      stopAmbientFocus();
      setIsMusicPlaying(false);
    } else {
      startAmbientFocus('lofi', 0.16);
      setIsMusicPlaying(true);
      playSound('pop');
    }
  };

  // Icebreaker & Stepper Compact State
  const [icebreakerIndex, setIcebreakerIndex] = useState(0);
  const [showIcebreakerBanner, setShowIcebreakerBanner] = useState(false);
  const [isCompactStepper, setIsCompactStepper] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 1400 : true));

  const activePhase = RETRO_PHASES[currentPhaseIndex] || RETRO_PHASES[0];

  // Sync timer if meeting duration changes
  useEffect(() => {
    if (meetingSettings?.durationMinutes) {
      setTimerSeconds(meetingSettings.durationMinutes * 60);
      setIsTimerRunning(false);
    }
  }, [meetingSettings?.durationMinutes]);

  // Countdown effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playSound('chime');
      alert('⏰ Time is up! Let\'s review, cluster, and vote on the sticky notes.');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleSetTimer = (secs) => {
    setTimerSeconds(secs);
    setIsTimerRunning(false);
    setShowTimerMenu(false);
  };

  const handleNextPhase = () => {
    if (currentPhaseIndex < RETRO_PHASES.length - 1) {
      playSound('reveal');
      onPhaseChange(currentPhaseIndex + 1);
      if (currentPhaseIndex + 1 === RETRO_PHASES.length - 1) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        onOpenActionItems();
      }
    }
  };

  const handlePrevPhase = () => {
    if (currentPhaseIndex > 0) {
      onPhaseChange(currentPhaseIndex - 1);
    }
  };

  const handleShuffleIcebreaker = () => {
    playSound('pop');
    setIcebreakerIndex(prev => (prev + 1) % ICEBREAKER_QUESTIONS.length);
  };

  const positionClass = dockPosition === 'bottom' ? 'bottom-3' : 'top-3';

  // ==========================================
  // 1. MINIMIZED SLIM FLOATING PILL (ZERO OVERLAP)
  // ==========================================
  if (isMinimized) {
    return (
      <header className={`fixed ${positionClass} left-1/2 -translate-x-1/2 z-40 pointer-events-auto animate-fadeIn`}>
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3.5 py-1.5 rounded-2xl shadow-2xl text-xs font-semibold text-slate-800">
          {/* User Avatar */}
          <div 
            onClick={onOpenUserModal}
            className="flex items-center gap-1.5 pr-2 border-r border-slate-200 cursor-pointer hover:opacity-80"
            title="Switch User Profile"
          >
            <span className="text-base">{currentUser?.avatar || '👑'}</span>
            <span className="font-bold">{currentUser?.name || 'Bala'}</span>
          </div>

          {/* Current Facilitation Step */}
          <div 
            onClick={() => onToggleMinimize()}
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold cursor-pointer hover:bg-indigo-100 transition-colors"
            title="Current Retro Step (Click to Expand)"
          >
            <span>{activePhase.icon}</span>
            <span>Step {currentPhaseIndex + 1}: {activePhase.label}</span>
          </div>

          {/* Quick Add Sticky */}
          <button
            onClick={() => {
              playSound('pop');
              onAddStickyNote(selectedStickyColor);
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold transition-all shadow-xs"
            title="Quick Add Sticky Note"
          >
            <Plus size={14} />
            <span>+ Sticky</span>
          </button>

          {/* Timer Display */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-100 font-mono font-bold text-slate-700">
            <Clock size={13} className={isTimerRunning ? 'text-amber-500 animate-spin' : 'text-slate-400'} />
            <span>{formatTime(timerSeconds)}</span>
          </div>

          {/* Lo-Fi Focus Music Toggle (Slim) */}
          <button
            onClick={handleToggleMusic}
            className={`p-1 rounded-lg transition-colors ${
              isMusicPlaying ? 'bg-rose-100 text-rose-600 animate-pulse' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isMusicPlaying ? 'Stop Lo-Fi Focus Music' : 'Play Lo-Fi Focus Music'}
          >
            <Headphones size={13} />
          </button>

          {/* Online Presence */}
          <div 
            onClick={onOpenShareModal}
            className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg font-bold cursor-pointer hover:bg-emerald-100"
            title="Click to view online teammates and share link"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{onlineUsers.length} Online</span>
          </div>

          {/* Share Button */}
          <button
            onClick={onOpenShareModal}
            className="px-2.5 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 shadow-xs"
            title="Share Board Link"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>

          {/* Expand Button */}
          <button
            onClick={onToggleMinimize}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 ml-1 border border-slate-200"
            title="Maximize All Controls"
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </header>
    );
  }

  // ==========================================
  // 2. UNIFIED FULL EXPANDED HEADER (RESPONSIVE)
  // ==========================================
  return (
    <div className={`fixed ${positionClass} left-1 right-1 sm:left-3 sm:right-3 z-40 flex flex-col items-center pointer-events-none transition-all`}>
      {/* Main Single-Bar Navigation Island */}
      <header className="w-full max-w-full flex items-center justify-between gap-1 sm:gap-2 pointer-events-auto">
        {/* Left Section: Logo & Miro Templates */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 px-2 sm:px-3 py-1 sm:py-1.5 rounded-2xl shadow-xl shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 pr-1.5 sm:pr-2 border-r border-slate-200">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl bg-gradient-to-tr from-amber-400 via-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-xs sm:text-sm">
              B
            </div>
            <span className="font-bold text-slate-800 tracking-tight text-xs sm:text-sm hidden lg:inline">BalaBoard</span>
          </div>

          {/* Miro Retrospective Templates Button */}
          <button
            onClick={onOpenPreRetroModal}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-xs font-bold text-indigo-700 transition-all border border-indigo-200/60"
            title="Browse 12 Miro Retrospective Templates & Pre-Meeting Setup"
          >
            <LayoutGrid size={13} className="text-indigo-600 shrink-0" />
            <span className="truncate max-w-[85px] sm:max-w-[125px]">{activeTemplate?.title?.split('(')[0] || 'Templates'}</span>
            <ChevronDown size={12} className="text-indigo-400 shrink-0" />
          </button>
        </div>

        {/* Center Section: Facilitation Stepper & Retro Controls */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-white/95 backdrop-blur-md border border-slate-200/90 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-2xl shadow-xl shrink min-w-0">
          {/* Step Prev */}
          <button
            onClick={handlePrevPhase}
            disabled={currentPhaseIndex === 0}
            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500 transition-colors shrink-0"
            title="Previous Phase"
          >
            <ChevronLeft size={15} />
          </button>

          {/* Stepper Steps (Full or Compact) */}
          {isCompactStepper ? (
            <button
              onClick={() => setIsCompactStepper(false)}
              className="flex items-center gap-1 px-2 py-0.5 sm:py-1 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs truncate"
              title="Click to view all steps"
            >
              <span>{activePhase.icon}</span>
              <span className="truncate">Step {currentPhaseIndex + 1}: {activePhase.label}</span>
            </button>
          ) : (
            <div className="flex items-center gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none">
              {RETRO_PHASES.map((phase, idx) => {
                const isActive = idx === currentPhaseIndex;
                const isCompleted = idx < currentPhaseIndex;

                return (
                  <button
                    key={phase.id}
                    onClick={() => {
                      playSound('pop');
                      onPhaseChange(idx);
                    }}
                    className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20'
                        : isCompleted
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{phase.icon}</span>
                    <span className="hidden 2xl:inline">{phase.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Step Next */}
          <button
            onClick={handleNextPhase}
            disabled={currentPhaseIndex === RETRO_PHASES.length - 1}
            className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500 transition-colors shrink-0"
            title="Next Phase"
          >
            <ChevronRight size={15} />
          </button>

          {/* Facilitation Action Controls */}
          <div className="ml-0.5 pl-1 border-l border-slate-200 flex items-center gap-0.5 sm:gap-1 shrink-0">
            {/* Icebreaker button if on step 1 */}
            {currentPhaseIndex === 0 && (
              <button
                onClick={() => setShowIcebreakerBanner(!showIcebreakerBanner)}
                className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                  showIcebreakerBanner ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Toggle Icebreaker Question"
              >
                <span>🎲</span>
                <span className="hidden xl:inline">Icebreaker</span>
              </button>
            )}

            {/* Reveal / Mask Notes Button */}
            <button
              onClick={() => {
                playSound('reveal');
                onToggleRevealNotes();
              }}
              className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                areNotesRevealed
                  ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm animate-pulse'
              }`}
              title={areNotesRevealed ? "Notes are visible" : "Notes are private (click to reveal)"}
            >
              {areNotesRevealed ? <Eye size={13} /> : <EyeOff size={13} />}
              <span className="hidden xl:inline">{areNotesRevealed ? 'Revealed' : 'Reveal All'}</span>
            </button>

            {/* Auto-Cluster Button */}
            <button
              onClick={() => {
                playSound('pop');
                onAutoCluster();
                confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
              }}
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Auto-organize stickies into categories"
            >
              <Layers size={13} />
              <span className="hidden xl:inline">Cluster</span>
            </button>

            {/* Miro Spotlight Mode */}
            <button
              onClick={() => {
                if (isSpotlightingActive) {
                  onReleaseSpotlight && onReleaseSpotlight();
                } else {
                  playSound('reveal');
                  onSpotlightEveryone && onSpotlightEveryone();
                }
              }}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                isSpotlightingActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md ring-2 ring-purple-400 animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title={isSpotlightingActive ? "Stop spotlighting" : "Miro Spotlight: Bring everyone's viewport to my view"}
            >
              <Radio size={13} className={isSpotlightingActive ? 'animate-spin' : ''} />
              <span className="hidden xl:inline">{isSpotlightingActive ? 'Spotlight' : 'Spotlight'}</span>
            </button>

            {/* Toggle Compact Stepper Button */}
            <button
              onClick={() => setIsCompactStepper(!isCompactStepper)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              title={isCompactStepper ? "Expand all step labels" : "Compact stepper view"}
            >
              {isCompactStepper ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
            </button>
          </div>
        </div>

        {/* Right Section: Sticky Add, Timer, Presence & Action Icons (COMPACT & ZERO OVERFLOW) */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 p-1 sm:p-1.5 rounded-2xl shadow-xl shrink-0">
          {/* Quick Sticky Note Button */}
          <button
            onClick={() => {
              playSound('pop');
              onAddStickyNote(selectedStickyColor);
            }}
            className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl text-xs font-bold shadow-xs transition-all border ${PASTEL_COLORS[selectedStickyColor].bg} ${PASTEL_COLORS[selectedStickyColor].border} ${PASTEL_COLORS[selectedStickyColor].text} hover:scale-105 active:scale-95`}
            title="Add new Sticky Note to canvas"
          >
            <Plus size={14} />
            <span className="hidden sm:inline">+ Sticky</span>
          </button>

          {/* Compact Color Picker Trigger with Popover */}
          <div className="relative">
            <button
              onClick={() => setShowColorMenu(!showColorMenu)}
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center shadow-xs ${PASTEL_COLORS[selectedStickyColor].dot} ${PASTEL_COLORS[selectedStickyColor].border}`}
              title={`Color: ${PASTEL_COLORS[selectedStickyColor].label} (Click to change)`}
            />
            {showColorMenu && (
              <div className={`absolute ${dockPosition === 'bottom' ? 'bottom-8' : 'top-8'} left-0 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-2xl z-50 flex gap-1 animate-fadeIn`}>
                {Object.keys(PASTEL_COLORS).map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setSelectedStickyColor(c);
                      setShowColorMenu(false);
                    }}
                    className={`w-5 h-5 rounded-full border transition-transform ${PASTEL_COLORS[c].dot} ${
                      selectedStickyColor === c ? 'scale-125 border-slate-700 shadow-sm' : 'border-slate-300 hover:scale-110'
                    }`}
                    title={PASTEL_COLORS[c].label}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-[1px] h-4 bg-slate-200 hidden sm:block" />

          {/* Facilitator Countdown Timer */}
          <div className="relative">
            <div className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200/80 rounded-xl px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs text-slate-700 transition-colors">
              <Clock size={12} className={isTimerRunning ? 'text-amber-500 animate-spin' : 'text-slate-500'} />
              <button 
                onClick={() => setShowTimerMenu(!showTimerMenu)} 
                className="font-mono font-bold w-10 sm:w-11 text-center text-xs"
                title="Change duration"
              >
                {formatTime(timerSeconds)}
              </button>
              <button
                onClick={() => {
                  playSound('pop');
                  setIsTimerRunning(!isTimerRunning);
                }}
                className="p-0.5 rounded hover:bg-slate-300 text-slate-700"
                title={isTimerRunning ? 'Pause' : 'Start'}
              >
                {isTimerRunning ? <Pause size={10} /> : <Play size={10} />}
              </button>
            </div>

            {/* Timer Presets Dropdown */}
            {showTimerMenu && (
              <div className={`absolute ${dockPosition === 'bottom' ? 'bottom-10' : 'top-10'} left-0 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-2xl z-50 text-xs w-36 space-y-0.5 animate-fadeIn`}>
                <button
                  onClick={() => handleSetTimer(180)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                >
                  ⚡ 3 Minutes (Quick)
                </button>
                <button
                  onClick={() => handleSetTimer(300)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                >
                  ⏱️ 5 Minutes (Reflect)
                </button>
                <button
                  onClick={() => handleSetTimer(600)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                >
                  🎯 10 Minutes (Group)
                </button>
                <button
                  onClick={() => handleSetTimer(900)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                >
                  💬 15 Minutes (Vote)
                </button>
                <button
                  onClick={() => handleSetTimer(1800)}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                >
                  🚀 30 Minutes (Full)
                </button>
              </div>
            )}
          </div>

          {/* Ambient Lo-Fi Focus Music */}
          <button
            onClick={handleToggleMusic}
            className={`p-1.5 sm:px-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              isMusicPlaying
                ? 'bg-rose-50 text-rose-700 border border-rose-300 ring-2 ring-rose-400/40 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
            }`}
            title={isMusicPlaying ? 'Stop Lo-Fi Ambient Focus Music' : 'Start Lo-Fi Ambient Music'}
          >
            <Headphones size={13} className={isMusicPlaying ? 'text-rose-600 animate-bounce' : 'text-slate-500'} />
            <span className="hidden 2xl:inline">{isMusicPlaying ? 'Lo-Fi' : 'Lo-Fi'}</span>
            {isMusicPlaying && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />}
          </button>

          {/* Share Board Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
            title="Share live board link with team"
          >
            <Share2 size={13} />
            <span className="hidden xl:inline">Share</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Live Presence Avatars Pill */}
          <div 
            onClick={onOpenShareModal}
            className="cursor-pointer flex items-center gap-1 px-1.5 py-0.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition-colors"
            title={`${onlineUsers.length} online participants: ${onlineUsers.map(u => u.name).join(', ')}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-slate-700">
              {onlineUsers.length}
            </span>
          </div>

          <div className="w-[1px] h-4 bg-slate-200 hidden sm:block" />

          {/* Auxiliary Tools Cluster: User, Actions, Export, Dock, Minimize */}
          <div className="flex items-center gap-0.5 sm:gap-1">
            {/* User Profile Button */}
            <button
              onClick={onOpenUserModal}
              className="p-1 sm:px-1.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs font-semibold text-slate-700 transition-colors"
              title={`Signed in as: ${currentUser?.name || 'Bala'} (Click to change)`}
            >
              <span className="text-sm">{currentUser?.avatar || '👑'}</span>
              <span className="hidden 2xl:inline font-bold ml-1">{currentUser?.name || 'Bala'}</span>
            </button>

            {/* Action Items Drawer Toggle Button */}
            <button
              onClick={onOpenActionItems}
              className="p-1 sm:px-1.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 text-xs font-semibold transition-all relative"
              title="Open Action Items & Voting Summary"
            >
              <CheckSquare size={14} />
              {actionItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {actionItemsCount}
                </span>
              )}
            </button>

            {/* Export Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="p-1 sm:px-1.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                title="Export Board (PNG, Markdown, JSON)"
              >
                <Download size={14} />
              </button>

              {showExportMenu && (
                <div className={`absolute ${dockPosition === 'bottom' ? 'bottom-10' : 'top-10'} right-0 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-2xl z-50 text-xs w-52 space-y-1 animate-fadeIn`}>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportPNG();
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    <ImageIcon size={14} className="text-blue-500" />
                    <span>Export as PNG Image</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportMarkdown();
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    <FileText size={14} className="text-emerald-500" />
                    <span>Export Markdown Minutes</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowExportMenu(false);
                      onExportJSON();
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                  >
                    <Download size={14} className="text-amber-500" />
                    <span>Save Board State (.json)</span>
                  </button>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setShowExportMenu(false);
                        onClearBoard();
                      }}
                      className="flex items-center gap-2 w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-medium"
                    >
                      <Trash2 size={14} />
                      <span>Clear All Notes</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dock Position Switcher */}
            <button
              onClick={onToggleDockPosition}
              className="p-1 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title={dockPosition === 'bottom' ? 'Dock toolbar to Top' : 'Dock toolbar to Bottom'}
            >
              <ArrowUpDown size={13} />
            </button>

            {/* Minimize HUD Button */}
            <button
              onClick={onToggleMinimize}
              className="p-1 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              title="Minimize toolbar into compact pill"
            >
              <Minimize2 size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Icebreaker Card Banner (Positioned directly below center stepper with clear margins) */}
      {currentPhaseIndex === 0 && showIcebreakerBanner && (
        <div className="mt-2 bg-gradient-to-r from-amber-50 via-white to-orange-50 border border-amber-200/90 px-4 py-2 rounded-2xl shadow-xl pointer-events-auto flex items-center justify-between gap-3 max-w-xl w-full animate-slideDown">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎲</span>
            <div>
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Sprint Warm-Up Icebreaker
              </span>
              <p className="text-xs font-semibold text-slate-800">
                {ICEBREAKER_QUESTIONS[icebreakerIndex]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleShuffleIcebreaker}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-800 flex items-center gap-1 shadow-xs transition-colors"
              title="Next Icebreaker Question"
            >
              <Shuffle size={12} />
              <span>Next</span>
            </button>
            <button
              onClick={() => setShowIcebreakerBanner(false)}
              className="p-1 hover:bg-amber-100/60 rounded-lg text-amber-800/60 transition-colors"
              title="Close Icebreaker Banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
