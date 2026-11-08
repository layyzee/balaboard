import React, { useState } from 'react';
import { 
  Sparkles, 
  Eye, 
  EyeOff, 
  Layers, 
  ThumbsUp, 
  CheckCircle, 
  Shuffle, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  X,
  Volume2,
  Award
} from 'lucide-react';
import { ICEBREAKER_QUESTIONS } from '../constants/templates';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export const RETRO_PHASES = [
  { id: 'icebreaker', step: 1, label: 'Icebreaker', icon: '🧊', desc: 'Team warmup & mindset' },
  { id: 'reflect', step: 2, label: 'Reflect', icon: '✍️', desc: 'Write sticky notes independently' },
  { id: 'group', step: 3, label: 'Group & Cluster', icon: '👥', desc: 'Reveal & organize themes' },
  { id: 'vote', step: 4, label: 'Vote', icon: '🗳️', desc: 'Prioritize key topics' },
  { id: 'actions', step: 5, label: 'Discuss & Actions', icon: '🎯', desc: 'Assign concrete follow-ups' }
];

export default function RetroPhaseBar({
  currentPhaseIndex,
  onPhaseChange,
  areNotesRevealed,
  onToggleRevealNotes,
  onAutoCluster,
  meetingTitle,
  onOpenActionDrawer,
  dockPosition = 'top'
}) {
  const [icebreakerIndex, setIcebreakerIndex] = useState(0);
  const [showIcebreakerBanner, setShowIcebreakerBanner] = useState(false);
  const [isPhaseBarCollapsed, setIsPhaseBarCollapsed] = useState(false);

  const activePhase = RETRO_PHASES[currentPhaseIndex] || RETRO_PHASES[0];

  const handleNextPhase = () => {
    if (currentPhaseIndex < RETRO_PHASES.length - 1) {
      playSound('reveal');
      onPhaseChange(currentPhaseIndex + 1);
      if (currentPhaseIndex + 1 === RETRO_PHASES.length - 1) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onOpenActionDrawer();
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

  const topOffset = dockPosition === 'top' ? 'top-15' : 'top-3';

  // Collapsed Minimalist Mode
  if (isPhaseBarCollapsed) {
    return (
      <div className={`fixed ${topOffset} left-1/2 -translate-x-1/2 z-30 pointer-events-auto animate-fadeIn`}>
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3 py-1 rounded-2xl shadow-lg text-xs font-bold text-slate-700">
          <span className="text-sm">{activePhase.icon}</span>
          <span>Step {currentPhaseIndex + 1}: {activePhase.label}</span>

          <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200 ml-1">
            <button
              onClick={() => {
                playSound('reveal');
                onToggleRevealNotes();
              }}
              className={`p-1 rounded-lg ${
                areNotesRevealed ? 'text-slate-500 hover:bg-slate-100' : 'bg-amber-500 text-white shadow-xs'
              }`}
              title={areNotesRevealed ? "Notes are visible" : "Notes are private (click to reveal)"}
            >
              {areNotesRevealed ? <Eye size={13} /> : <EyeOff size={13} />}
            </button>

            <button
              onClick={() => {
                playSound('pop');
                onAutoCluster();
              }}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
              title="Auto-Cluster Notes into Zones"
            >
              <Layers size={13} />
            </button>

            <button
              onClick={() => setIsPhaseBarCollapsed(false)}
              className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 ml-0.5"
              title="Expand Facilitation Steps"
            >
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Expanded Full Stepper Mode
  return (
    <div className={`fixed ${topOffset} left-1/2 -translate-x-1/2 z-30 flex flex-col items-center pointer-events-none w-full max-w-4xl px-3 transition-all animate-fadeIn`}>
      {/* Facilitation Stepper Pill */}
      <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md border border-slate-200/90 px-3 py-1.5 rounded-2xl shadow-xl pointer-events-auto">
        <button
          onClick={handlePrevPhase}
          disabled={currentPhaseIndex === 0}
          className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500 transition-colors"
          title="Previous Phase"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Phase Badges */}
        <div className="flex items-center gap-1 px-1 overflow-x-auto scrollbar-none">
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
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/20 scale-105'
                    : isCompleted
                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{phase.icon}</span>
                <span className="hidden sm:inline">{phase.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNextPhase}
          disabled={currentPhaseIndex === RETRO_PHASES.length - 1}
          className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 text-slate-500 transition-colors"
          title="Next Phase"
        >
          <ChevronRight size={16} />
        </button>

        {/* Phase Action Tools */}
        <div className="ml-1.5 pl-1.5 border-l border-slate-200 flex items-center gap-1">
          {/* Icebreaker toggle button */}
          {currentPhaseIndex === 0 && (
            <button
              onClick={() => setShowIcebreakerBanner(!showIcebreakerBanner)}
              className={`flex items-center gap-1 px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                showIcebreakerBanner ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
              title="Toggle Warm-Up Icebreaker Question Banner"
            >
              <span>🎲</span>
              <span className="hidden md:inline">Icebreaker</span>
            </button>
          )}

          {/* Reveal / Mask Notes Button */}
          <button
            onClick={() => {
              playSound('reveal');
              onToggleRevealNotes();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              areNotesRevealed
                ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm animate-pulse'
            }`}
            title={areNotesRevealed ? "Hide note contents (Incognito mode)" : "Reveal all notes to the team"}
          >
            {areNotesRevealed ? <Eye size={13} /> : <EyeOff size={13} />}
            <span className="hidden sm:inline">{areNotesRevealed ? 'Notes Visible' : 'Reveal All'}</span>
          </button>

          {/* Auto-Cluster Button */}
          <button
            onClick={() => {
              playSound('pop');
              onAutoCluster();
              confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Auto-organize stickies into categories"
          >
            <Layers size={13} />
            <span className="hidden md:inline">Auto-Cluster</span>
          </button>

          {/* Minimize Stepper Button */}
          <button
            onClick={() => setIsPhaseBarCollapsed(true)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            title="Minimize Stepper Bar"
          >
            <ChevronUp size={14} />
          </button>
        </div>
      </div>

      {/* Icebreaker Card Banner (Clean Floating Accordion) */}
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
