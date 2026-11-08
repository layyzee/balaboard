import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Eye, 
  Layers, 
  ThumbsUp, 
  Share2, 
  BarChart2, 
  CheckSquare,
  Play,
  RotateCcw
} from 'lucide-react';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export const TOUR_STEPS = [
  {
    step: 1,
    badge: 'Overview',
    title: 'Welcome to BalaBoard 👋',
    subtitle: 'The 100% Free ($0.00) Real-Time Miro Alternative',
    desc: 'BalaBoard was engineered to eliminate costly $16/seat SaaS whiteboard licenses and meeting clutter. It combines real-time WebSockets, 12 Miro retrospective templates, and agile facilitator controls into an ultra-fast whiteboard.',
    icon: '🚀',
    actionText: 'Next: Private Writing Mode',
    autoPan: { x: 80, y: 110, scale: 0.85 }
  },
  {
    step: 2,
    badge: 'Anti-Anchoring',
    title: 'Private Reflection Writing 🤫',
    subtitle: 'Psychological Safety Without Groupthink Bias',
    desc: 'During brainstorming, sticky notes are masked with "Private Reflection" so teammates do not bias each other\'s feedback. The Scrum Master can reveal all notes simultaneously when brainstorming ends.',
    icon: '✍️',
    triggerAction: 'reveal',
    actionText: 'Reveal All Sticky Notes 👁️',
    autoPan: { x: 120, y: 100, scale: 0.95 }
  },
  {
    step: 3,
    badge: 'AI Intelligence',
    title: 'Offline AI Semantic Clustering 🧠',
    subtitle: 'Zero-Cost Theme Affinity Organization',
    desc: 'Instead of manually reorganizing dozens of sticky notes, our offline-first AI NLP clustering groups feedback into template columns automatically without external API keys or cloud charges.',
    icon: '⚡',
    triggerAction: 'cluster',
    actionText: 'Auto-Cluster Stickies! 📦',
    autoPan: { x: 80, y: 110, scale: 0.85 }
  },
  {
    step: 4,
    badge: 'Prioritization',
    title: 'Dot Voting & Golden Trophies 🗳️',
    subtitle: 'Consensus Building & Top-Voted Badging',
    desc: 'Each teammate has a voting budget. Votes tally in real time with celebration effects, and the highest-ranked topic is automatically decorated with an animated 🏆 Top Voted trophy badge.',
    icon: '🏆',
    actionText: 'Next: Jira Issue Creation',
    autoPan: { x: 80, y: 200, scale: 0.95 }
  },
  {
    step: 5,
    badge: 'Atlassian Workflow',
    title: 'Direct Jira Cloud Integration 🎫',
    subtitle: 'From Retro Commitments to Real Jira Tickets',
    desc: 'Turn discussion points into engineering deliverables with 1 click. Push any sticky note or action item directly into your team\'s Jira backlog with pre-filled context, assignees, and live clickable badges (e.g. [Jira] SCRUM-173 ↗).',
    icon: '🎯',
    triggerAction: 'jira',
    actionText: 'Open Jira Ticket Creator 🎫',
    autoPan: { x: 100, y: 120, scale: 0.9 }
  },
  {
    step: 6,
    badge: 'Multiplayer Mesh',
    title: 'Global Real-Time Collaboration 🌐',
    subtitle: 'Cross-Internet WebSockets & Lo-Fi Focus Music',
    desc: 'Every participant is connected via low-latency WebSockets with live cursors and participant counts. Teammates can also toggle ambient procedural Lo-Fi focus audio to stay in the zone.',
    icon: '🎧',
    triggerAction: 'analytics',
    actionText: 'View Team Health Report 📊',
    autoPan: { x: 80, y: 110, scale: 0.85 }
  }
];

export default function RecruiterTourModal({
  isOpen,
  onClose,
  onToggleRevealNotes,
  areNotesRevealed,
  onAutoCluster,
  onOpenJiraModal,
  onOpenAnalytics,
  onSetPanAndScale
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentTourStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    playSound('pop');
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const targetPan = TOUR_STEPS[nextIndex].autoPan;
      if (targetPan && onSetPanAndScale) {
        onSetPanAndScale(targetPan.scale, { x: targetPan.x, y: targetPan.y });
      }
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    playSound('pop');
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const targetPan = TOUR_STEPS[prevIndex].autoPan;
      if (targetPan && onSetPanAndScale) {
        onSetPanAndScale(targetPan.scale, { x: targetPan.x, y: targetPan.y });
      }
    }
  };

  const handleTriggerAction = () => {
    playSound('reveal');
    if (currentTourStep.triggerAction === 'reveal') {
      if (!areNotesRevealed && onToggleRevealNotes) onToggleRevealNotes();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.4 } });
      handleNext();
    } else if (currentTourStep.triggerAction === 'cluster') {
      if (onAutoCluster) onAutoCluster();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.4 } });
      handleNext();
    } else if (currentTourStep.triggerAction === 'jira') {
      if (onOpenJiraModal) {
        onOpenJiraModal({
          type: 'action',
          item: {
            id: 'tour-demo-action',
            title: 'Adopt automated pre-merge staging smoke tests',
            assignee: 'Alex',
            votes: 6
          }
        });
      }
      handleNext();
    } else if (currentTourStep.triggerAction === 'analytics') {
      onClose();
      if (onOpenAnalytics) onOpenAnalytics();
    } else {
      handleNext();
    }
  };

  const handleComplete = () => {
    playSound('chime');
    confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
    onClose();
    setCurrentStepIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center p-4">
      {/* Semi-transparent Backdrop with click to dismiss */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs pointer-events-auto animate-fadeIn" 
      />

      {/* Floating Tour Guide Card */}
      <div className="relative pointer-events-auto bg-white/98 backdrop-blur-md border border-slate-200/90 rounded-3xl shadow-2xl w-full max-w-lg p-6 flex flex-col space-y-4 animate-scaleUp z-10">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-orange-500/20">
              {currentTourStep.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  {currentTourStep.badge}
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  Step {currentTourStep.step} of {TOUR_STEPS.length}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-800 mt-0.5">
                {currentTourStep.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            title="Close Tour"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-2 text-xs">
          <p className="font-semibold text-indigo-700 text-[11px]">
            {currentTourStep.subtitle}
          </p>
          <p className="text-slate-600 leading-relaxed text-xs">
            {currentTourStep.desc}
          </p>
        </div>

        {/* Interactive Action Button for this step */}
        <div className="pt-1">
          <button
            onClick={handleTriggerAction}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles size={14} className="text-amber-300 animate-spin" />
            <span>{currentTourStep.actionText}</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Card Footer: Step Dots & Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:bg-slate-100 disabled:opacity-30 text-slate-600 font-semibold transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Back</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  playSound('pop');
                  setCurrentStepIndex(i);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === currentStepIndex
                    ? 'w-6 bg-indigo-600'
                    : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Go to Step ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition-colors"
          >
            <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish' : 'Skip Step'}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
