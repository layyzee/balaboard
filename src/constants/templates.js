// Miro-Inspired Agile Retrospective Templates Library
// Modeled after official Miro Retrospective Templates (https://miro.com/templates/retrospective/)

export const RETRO_CATEGORIES = [
  'All Templates',
  'Classic Agile',
  'Visual & Metaphor',
  'Team Sentiment',
  'Continuous Improvement'
];

export const PASTEL_COLORS = {
  yellow: {
    bg: 'bg-amber-100/90',
    border: 'border-amber-300',
    text: 'text-amber-950',
    dot: 'bg-amber-400',
    label: 'Lemon Yellow'
  },
  pink: {
    bg: 'bg-rose-100/90',
    border: 'border-rose-300',
    text: 'text-rose-950',
    dot: 'bg-rose-400',
    label: 'Bubblegum Pink'
  },
  green: {
    bg: 'bg-emerald-100/90',
    border: 'border-emerald-300',
    text: 'text-emerald-950',
    dot: 'bg-emerald-400',
    label: 'Mint Green'
  },
  blue: {
    bg: 'bg-sky-100/90',
    border: 'border-sky-300',
    text: 'text-sky-950',
    dot: 'bg-sky-400',
    label: 'Sky Blue'
  },
  orange: {
    bg: 'bg-orange-100/90',
    border: 'border-orange-300',
    text: 'text-orange-950',
    dot: 'bg-orange-400',
    label: 'Sunset Orange'
  },
  purple: {
    bg: 'bg-purple-100/90',
    border: 'border-purple-300',
    text: 'text-purple-950',
    dot: 'bg-purple-400',
    label: 'Lavender Purple'
  }
};

export const ICEBREAKER_QUESTIONS = [
  "🎬 If this sprint was a movie title or genre, what would it be?",
  "☕ If our team had a custom coffee or tea blend, what would be in it?",
  "⚡ What was one small personal or team win that made your week?",
  "🦸 If you could borrow any superhero ability for the next sprint, what would you pick?",
  "🚀 If our product had a theme song right now, what would it sound like?",
  "🏖️ Where would you tele-transport our next sprint planning meeting if budget was unlimited?",
  "💡 What was the most surprising thing you learned or discovered this sprint?",
  "🍕 What topping represents the energy of our last sprint release?"
];

export const TEMPLATES = {
  quick: {
    id: 'quick',
    title: 'Quick Retrospective (Miro Classic)',
    category: 'Classic Agile',
    badge: 'Miro Most Popular',
    recommendedTime: '30 mins',
    teamSize: '3-10 people',
    description: 'The standard 4-quadrant agile retrospective. Fast, direct, and focused on quick improvements.',
    icon: 'Zap',
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    zones: [
      {
        id: 'went-well',
        title: '🌟 What Went Well?',
        subtitle: 'Celebrations, smooth deliveries, and great teamwork',
        x: 100,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      },
      {
        id: 'didnt-go-well',
        title: '⚠️ What Didn’t Go Well?',
        subtitle: 'Friction, delays, scope creep, and unexpected hurdles',
        x: 620,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-rose-300 bg-rose-50/70 text-rose-900',
        headerBg: 'bg-rose-100/90 text-rose-800',
        stickyColor: 'pink'
      },
      {
        id: 'can-improve',
        title: '💡 What Can We Improve?',
        subtitle: 'Specific ideas to streamline process or architecture',
        x: 100,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-amber-300 bg-amber-50/70 text-amber-900',
        headerBg: 'bg-amber-100/90 text-amber-800',
        stickyColor: 'yellow'
      },
      {
        id: 'action-items',
        title: '🎯 Action Items & Commitments',
        subtitle: 'Concrete next steps with assigned owners',
        x: 620,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-sky-300 bg-sky-50/70 text-sky-900',
        headerBg: 'bg-sky-100/90 text-sky-800',
        stickyColor: 'blue'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'q-1',
        x: 140,
        y: 200,
        width: 170,
        height: 150,
        color: 'green',
        text: 'Zero downtime during our major release!',
        author: 'Bala',
        votes: 5,
        rotation: -1
      },
      {
        id: 'q-2',
        x: 660,
        y: 200,
        width: 170,
        height: 150,
        color: 'pink',
        text: 'Unclear API documentation from partner team caused delay.',
        author: 'Sarah',
        votes: 4,
        rotation: 1.5
      },
      {
        id: 'q-3',
        x: 140,
        y: 620,
        width: 170,
        height: 150,
        color: 'yellow',
        text: 'Adopt pre-merge smoke tests before staging deploy.',
        author: 'Alex',
        votes: 6,
        rotation: -0.5
      }
    ]
  },

  sailboat: {
    id: 'sailboat',
    title: 'The Sailboat Retrospective',
    category: 'Visual & Metaphor',
    badge: 'Miro Essential',
    recommendedTime: '45 mins',
    teamSize: '4-12 people',
    description: 'Map out your sprint journey: propellers (wind), blockers (anchors), hidden risks (rocks), and goals (the island).',
    icon: 'Ship',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    zones: [
      {
        id: 'wind',
        title: '🌬️ Wind (What propelled us forward?)',
        subtitle: 'Things that helped us move fast and succeed this sprint',
        x: 100,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-sky-300 bg-sky-50/70 text-sky-900',
        headerBg: 'bg-sky-100/90 text-sky-800',
        stickyColor: 'blue'
      },
      {
        id: 'island',
        title: '🏝️ The Island (Our Goals & Vision)',
        subtitle: 'Where we are aiming to land by next sprint',
        x: 620,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      },
      {
        id: 'anchors',
        title: '⚓ Anchors (What held us back?)',
        subtitle: 'Blockers, dependencies, and drag that slowed down delivery',
        x: 100,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-rose-300 bg-rose-50/70 text-rose-900',
        headerBg: 'bg-rose-100/90 text-rose-800',
        stickyColor: 'pink'
      },
      {
        id: 'rocks',
        title: '🪨 Rocks & Reefs (Risks Ahead)',
        subtitle: 'Hidden obstacles or risks we must navigate around soon',
        x: 620,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-amber-300 bg-amber-50/70 text-amber-900',
        headerBg: 'bg-amber-100/90 text-amber-800',
        stickyColor: 'orange'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'sb-1',
        x: 140,
        y: 200,
        width: 170,
        height: 150,
        color: 'blue',
        text: 'Fast CI/CD pipelines & automated tests saved us hours!',
        author: 'Bala',
        votes: 4,
        rotation: -1
      },
      {
        id: 'sb-2',
        x: 660,
        y: 200,
        width: 170,
        height: 150,
        color: 'green',
        text: 'Zero critical bugs for the v2.0 client release.',
        author: 'Jordan',
        votes: 3,
        rotation: 1.5
      },
      {
        id: 'sb-3',
        x: 140,
        y: 620,
        width: 170,
        height: 150,
        color: 'pink',
        text: 'Third-party API staging server was down for 2 days.',
        author: 'Sarah',
        votes: 6,
        rotation: 0.5
      },
      {
        id: 'sb-4',
        x: 660,
        y: 620,
        width: 170,
        height: 150,
        color: 'orange',
        text: 'Upcoming database schema migration could cause downtime if unindexed.',
        author: 'Alex',
        votes: 5,
        rotation: -2
      }
    ]
  },

  startStopContinue: {
    id: 'startStopContinue',
    title: 'Start, Stop, Continue',
    category: 'Continuous Improvement',
    badge: 'Scrum Favorite',
    recommendedTime: '45 mins',
    teamSize: '3-12 people',
    description: 'Direct process tuning: What should we start doing, what should we stop doing, and what should we keep doing?',
    icon: 'PlayCircle',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    zones: [
      {
        id: 'start',
        title: '🟢 START (New Practices to Adopt)',
        subtitle: 'Ideas and habits that will boost speed or morale',
        x: 100,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      },
      {
        id: 'stop',
        title: '🛑 STOP (Time Wasters & Bad Habits)',
        subtitle: 'Inefficiencies, anti-patterns, and noisy blockers',
        x: 500,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-rose-300 bg-rose-50/60 text-rose-900',
        headerBg: 'bg-rose-100/90 text-rose-800',
        stickyColor: 'pink'
      },
      {
        id: 'continue',
        title: '🔵 CONTINUE (High-Performing Habits)',
        subtitle: 'Proven routines that are working like clockwork',
        x: 900,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-sky-300 bg-sky-50/60 text-sky-900',
        headerBg: 'bg-sky-100/90 text-sky-800',
        stickyColor: 'blue'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'ssc-1',
        x: 130,
        y: 220,
        width: 160,
        height: 140,
        color: 'green',
        text: '15-min daily async standup on Slack instead of long meetings',
        author: 'Bala',
        votes: 7,
        rotation: -1
      },
      {
        id: 'ssc-2',
        x: 530,
        y: 220,
        width: 160,
        height: 140,
        color: 'pink',
        text: 'Deploying hotfixes directly on Friday afternoons without QA signoff',
        author: 'Priya',
        votes: 8,
        rotation: 1
      },
      {
        id: 'ssc-3',
        x: 930,
        y: 220,
        width: 160,
        height: 140,
        color: 'blue',
        text: 'Pair programming on complex PRs saved us massive review churn',
        author: 'Alex',
        votes: 5,
        rotation: -0.5
      }
    ]
  },

  fourLs: {
    id: 'fourLs',
    title: 'The 4 Ls (Liked, Learned, Lacked, Longed For)',
    category: 'Classic Agile',
    badge: 'Insightful',
    recommendedTime: '45 mins',
    teamSize: '4-15 people',
    description: 'A deep psychological retrospective exploring what the team loved, learned, missed, and wished they had.',
    icon: 'Layers',
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    zones: [
      {
        id: 'liked',
        title: '❤️ LIKED (What made us happy?)',
        subtitle: 'Things that brought joy, pride, or celebration',
        x: 100,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-pink-300 bg-pink-50/70 text-pink-900',
        headerBg: 'bg-pink-100/90 text-pink-800',
        stickyColor: 'pink'
      },
      {
        id: 'learned',
        title: '🧠 LEARNED (New skills & wisdom)',
        subtitle: 'Discoveries, technical knowledge, or customer insights',
        x: 620,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-indigo-300 bg-indigo-50/70 text-indigo-900',
        headerBg: 'bg-indigo-100/90 text-indigo-800',
        stickyColor: 'purple'
      },
      {
        id: 'lacked',
        title: '🔍 LACKED (What was missing?)',
        subtitle: 'Tools, documentation, clarity, or team bandwidth',
        x: 100,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-amber-300 bg-amber-50/70 text-amber-900',
        headerBg: 'bg-amber-100/90 text-amber-800',
        stickyColor: 'orange'
      },
      {
        id: 'longed-for',
        title: '✨ LONGED FOR (Our wishes)',
        subtitle: 'What we truly desire for our team and future sprints',
        x: 620,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-purple-300 bg-purple-50/70 text-purple-900',
        headerBg: 'bg-purple-100/90 text-purple-800',
        stickyColor: 'blue'
      }
    ],
    defaultStickyNotes: [
      {
        id: '4l-1',
        x: 140,
        y: 200,
        width: 170,
        height: 150,
        color: 'pink',
        text: 'Cross-functional collaboration between frontend and UX design was stellar!',
        author: 'Jordan',
        votes: 4,
        rotation: 1
      },
      {
        id: '4l-2',
        x: 660,
        y: 200,
        width: 170,
        height: 150,
        color: 'purple',
        text: 'Learned the new React 18 concurrent rendering tricks.',
        author: 'Bala',
        votes: 3,
        rotation: -1
      }
    ]
  },

  madSadGlad: {
    id: 'madSadGlad',
    title: 'Mad, Sad, Glad',
    category: 'Team Sentiment',
    badge: 'Team Health',
    recommendedTime: '30 mins',
    teamSize: '3-10 people',
    description: 'Surface team emotional health, psychological safety, and candid feelings from the previous sprint cycle.',
    icon: 'Smile',
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    zones: [
      {
        id: 'mad',
        title: '😡 MAD (Frustrations)',
        subtitle: 'Things that blocked, annoyed, or disrupted focus',
        x: 100,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-red-300 bg-red-50/60 text-red-900',
        headerBg: 'bg-red-100/90 text-red-800',
        stickyColor: 'pink'
      },
      {
        id: 'sad',
        title: '😢 SAD (Disappointments)',
        subtitle: 'Things that could have gone better or missed expectations',
        x: 500,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-indigo-300 bg-indigo-50/60 text-indigo-900',
        headerBg: 'bg-indigo-100/90 text-indigo-800',
        stickyColor: 'purple'
      },
      {
        id: 'glad',
        title: '😊 GLAD (Successes)',
        subtitle: 'Wins, shout-outs, and highlights we are proud of',
        x: 900,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'msg-1',
        x: 130,
        y: 220,
        width: 160,
        height: 140,
        color: 'pink',
        text: 'Flaky end-to-end test suite failing randomly',
        author: 'Sarah',
        votes: 4,
        rotation: 1
      },
      {
        id: 'msg-2',
        x: 930,
        y: 220,
        width: 160,
        height: 140,
        color: 'yellow',
        text: 'Crushed our sprint commitment 2 days early!',
        author: 'Bala',
        votes: 8,
        rotation: -1
      }
    ]
  },

  daki: {
    id: 'daki',
    title: 'DAKI (Drop, Add, Keep, Improve)',
    category: 'Continuous Improvement',
    badge: 'Miro Favorite',
    recommendedTime: '40 mins',
    teamSize: '4-12 people',
    description: 'Cleanse outdated workflows and elevate your team operating cadence with Drop, Add, Keep, and Improve.',
    icon: 'Sliders',
    badgeColor: 'bg-teal-500/10 text-teal-600 border-teal-500/20',
    zones: [
      {
        id: 'drop',
        title: '🗑️ DROP (Remove)',
        subtitle: 'Unnecessary meetings, redundant reports, dead features',
        x: 100,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-rose-300 bg-rose-50/70 text-rose-900',
        headerBg: 'bg-rose-100/90 text-rose-800',
        stickyColor: 'pink'
      },
      {
        id: 'add',
        title: '➕ ADD (Introduce)',
        subtitle: 'New tools, pair coding sessions, automated metrics',
        x: 620,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      },
      {
        id: 'keep',
        title: '🔒 KEEP (Retain)',
        subtitle: 'Practices that are delivering stellar outcomes',
        x: 100,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-sky-300 bg-sky-50/70 text-sky-900',
        headerBg: 'bg-sky-100/90 text-sky-800',
        stickyColor: 'blue'
      },
      {
        id: 'improve',
        title: '📈 IMPROVE (Upgrade)',
        subtitle: 'Things that work well but have higher potential',
        x: 620,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-amber-300 bg-amber-50/70 text-amber-900',
        headerBg: 'bg-amber-100/90 text-amber-800',
        stickyColor: 'yellow'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'daki-1',
        x: 140,
        y: 200,
        width: 170,
        height: 150,
        color: 'pink',
        text: 'Drop the 30-min Monday status check when Jira already has it',
        author: 'Alex',
        votes: 6,
        rotation: 0.5
      },
      {
        id: 'daki-2',
        x: 660,
        y: 200,
        width: 170,
        height: 150,
        color: 'green',
        text: 'Add automated Lighthouse performance checks on preview PRs',
        author: 'Bala',
        votes: 5,
        rotation: -1
      }
    ]
  },

  starfish: {
    id: 'starfish',
    title: 'The Starfish Retrospective',
    category: 'Continuous Improvement',
    badge: 'Nuanced Tuning',
    recommendedTime: '45 mins',
    teamSize: '4-10 people',
    description: 'A 5-spectrum retrospective providing fine-grained feedback: Keep Doing, Less Of, More Of, Stop Doing, and Start Doing.',
    icon: 'Compass',
    badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    zones: [
      {
        id: 'keep-doing',
        title: '🛡️ Keep Doing',
        subtitle: 'Things delivering continuous value',
        x: 100,
        y: 100,
        width: 360,
        height: 360,
        color: 'border-sky-300 bg-sky-50/70 text-sky-900',
        headerBg: 'bg-sky-100/90 text-sky-800',
        stickyColor: 'blue'
      },
      {
        id: 'less-of',
        title: '📉 Less Of',
        subtitle: 'Helpful in small doses, but currently overdone',
        x: 500,
        y: 100,
        width: 360,
        height: 360,
        color: 'border-amber-300 bg-amber-50/70 text-amber-900',
        headerBg: 'bg-amber-100/90 text-amber-800',
        stickyColor: 'orange'
      },
      {
        id: 'more-of',
        title: '📈 More Of',
        subtitle: 'Valuable efforts that need higher investment',
        x: 900,
        y: 100,
        width: 360,
        height: 360,
        color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      },
      {
        id: 'stop-doing',
        title: '⛔ Stop Doing',
        subtitle: 'Clear detractors to velocity and quality',
        x: 300,
        y: 500,
        width: 360,
        height: 360,
        color: 'border-rose-300 bg-rose-50/70 text-rose-900',
        headerBg: 'bg-rose-100/90 text-rose-800',
        stickyColor: 'pink'
      },
      {
        id: 'start-doing',
        title: '🚀 Start Doing',
        subtitle: 'Fresh experiments to try next sprint',
        x: 700,
        y: 500,
        width: 360,
        height: 360,
        color: 'border-purple-300 bg-purple-50/70 text-purple-900',
        headerBg: 'bg-purple-100/90 text-purple-800',
        stickyColor: 'purple'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'sf-1',
        x: 130,
        y: 200,
        width: 160,
        height: 140,
        color: 'blue',
        text: 'Morning code reviews before context switching to new tasks',
        author: 'Jordan',
        votes: 4,
        rotation: -1
      },
      {
        id: 'sf-2',
        x: 530,
        y: 200,
        width: 160,
        height: 140,
        color: 'orange',
        text: 'Too many Slack threads debating architecture instead of quick huddles',
        author: 'Alex',
        votes: 7,
        rotation: 1
      }
    ]
  },

  roseThornBud: {
    id: 'roseThornBud',
    title: 'Rose, Thorn, Bud (Design Thinking)',
    category: 'Team Sentiment',
    badge: 'Design Thinking',
    recommendedTime: '30 mins',
    teamSize: '3-10 people',
    description: 'A poetic design-thinking retro format: Rose (positive success), Thorn (pain point), and Bud (potential opportunity).',
    icon: 'Flower2',
    badgeColor: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    zones: [
      {
        id: 'rose',
        title: '🌹 Rose (Positive / Success)',
        subtitle: 'What bloomed and worked beautifully this sprint',
        x: 100,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-rose-300 bg-rose-50/60 text-rose-900',
        headerBg: 'bg-rose-100/90 text-rose-800',
        stickyColor: 'pink'
      },
      {
        id: 'thorn',
        title: '🌵 Thorn (Pain Point / Hurdle)',
        subtitle: 'What pricked us, hurt velocity, or caused stress',
        x: 500,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-slate-300 bg-slate-50/60 text-slate-900',
        headerBg: 'bg-slate-200/90 text-slate-800',
        stickyColor: 'orange'
      },
      {
        id: 'bud',
        title: '🌱 Bud (Potential / Opportunity)',
        subtitle: 'Fresh ideas ready to blossom and grow',
        x: 900,
        y: 100,
        width: 360,
        height: 700,
        color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'rtb-1',
        x: 130,
        y: 220,
        width: 160,
        height: 140,
        color: 'pink',
        text: 'User onboarding flow feedback scored 4.9 / 5.0!',
        author: 'Jordan',
        votes: 8,
        rotation: -1
      },
      {
        id: 'rtb-2',
        x: 930,
        y: 220,
        width: 160,
        height: 140,
        color: 'green',
        text: 'AI-assisted test generation could double our coverage next week',
        author: 'Bala',
        votes: 6,
        rotation: 1
      }
    ]
  },

  hotAirBalloon: {
    id: 'hotAirBalloon',
    title: 'Hot Air Balloon Retrospective',
    category: 'Visual & Metaphor',
    badge: 'Visual Workshop',
    recommendedTime: '45 mins',
    teamSize: '4-12 people',
    description: 'Take your team to new heights: Lift (hot air), Sandbags (weights), Storm Clouds (hazards), and Sunny Skies (goals).',
    icon: 'CloudSun',
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    zones: [
      {
        id: 'lift',
        title: '🔥 Hot Air & Lift (What lifts us up?)',
        subtitle: 'Strengths, teamwork, and high-energy boosters',
        x: 100,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-amber-300 bg-amber-50/70 text-amber-900',
        headerBg: 'bg-amber-100/90 text-amber-800',
        stickyColor: 'orange'
      },
      {
        id: 'sunny-skies',
        title: '☀️ Sunny Skies (Our Destination)',
        subtitle: 'Where we want to soar next quarter',
        x: 620,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-sky-300 bg-sky-50/70 text-sky-900',
        headerBg: 'bg-sky-100/90 text-sky-800',
        stickyColor: 'blue'
      },
      {
        id: 'sandbags',
        title: '⚖️ Sandbags (What weighs us down?)',
        subtitle: 'Technical debt, slow reviews, unnecessary friction',
        x: 100,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-slate-300 bg-slate-50/70 text-slate-900',
        headerBg: 'bg-slate-200/90 text-slate-800',
        stickyColor: 'pink'
      },
      {
        id: 'storm-clouds',
        title: '⛈️ Storm Clouds (Approaching Hazards)',
        subtitle: 'Turbulence, tight deadlines, or third-party shifts',
        x: 620,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-purple-300 bg-purple-50/70 text-purple-900',
        headerBg: 'bg-purple-100/90 text-purple-800',
        stickyColor: 'purple'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'hab-1',
        x: 140,
        y: 200,
        width: 170,
        height: 150,
        color: 'orange',
        text: 'Incredible cross-team synergy during bug triage!',
        author: 'Sarah',
        votes: 4,
        rotation: -1
      },
      {
        id: 'hab-2',
        x: 140,
        y: 620,
        width: 170,
        height: 150,
        color: 'purple',
        text: 'Legacy backend codebase with 0 unit tests slowing PR reviews',
        author: 'Alex',
        votes: 9,
        rotation: 1
      }
    ]
  },

  mountainClimber: {
    id: 'mountainClimber',
    title: 'Mountain Climber Retrospective',
    category: 'Visual & Metaphor',
    badge: 'Goal-Oriented',
    recommendedTime: '45 mins',
    teamSize: '4-12 people',
    description: 'Scale the peak: The Summit (target), Climbing Ropes (team support), Steep Cliffs (hurdles), and Survival Gear (tools needed).',
    icon: 'Mountain',
    badgeColor: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    zones: [
      {
        id: 'summit',
        title: '🏔️ The Summit (The Milestone)',
        subtitle: 'The peak product goal we are conquering',
        x: 100,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-sky-300 bg-sky-50/70 text-sky-900',
        headerBg: 'bg-sky-100/90 text-sky-800',
        stickyColor: 'blue'
      },
      {
        id: 'climbing-ropes',
        title: '🪢 Climbing Ropes (Our Support)',
        subtitle: 'Team safety nets, mutual trust, and strong habits',
        x: 620,
        y: 100,
        width: 480,
        height: 380,
        color: 'border-emerald-300 bg-emerald-50/70 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      },
      {
        id: 'steep-cliffs',
        title: '🧗 Steep Cliffs (Difficult Pitches)',
        subtitle: 'The hardest problems we wrestled with',
        x: 100,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-rose-300 bg-rose-50/70 text-rose-900',
        headerBg: 'bg-rose-100/90 text-rose-800',
        stickyColor: 'pink'
      },
      {
        id: 'gear-needed',
        title: '🎒 Gear Needed (Upgrades for the Next Pitch)',
        subtitle: 'Tools, training, or extra resources required',
        x: 620,
        y: 520,
        width: 480,
        height: 380,
        color: 'border-amber-300 bg-amber-50/70 text-amber-900',
        headerBg: 'bg-amber-100/90 text-amber-800',
        stickyColor: 'yellow'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'mc-1',
        x: 140,
        y: 200,
        width: 170,
        height: 150,
        color: 'blue',
        text: 'Successful migration of 50k active users to the new payment gateway',
        author: 'Bala',
        votes: 7,
        rotation: 1
      }
    ]
  },

  plusDelta: {
    id: 'plusDelta',
    title: 'Plus / Delta (+ / Δ)',
    category: 'Classic Agile',
    badge: 'Rapid Review',
    recommendedTime: '20 mins',
    teamSize: '2-8 people',
    description: 'The ultra-streamlined two-column review: Plus (+) for positives, and Delta (Δ) for things that should transform.',
    icon: 'Split',
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    zones: [
      {
        id: 'plus',
        title: '➕ PLUS (+) (What worked well)',
        subtitle: 'Deliverables, behaviors, and decisions that paid off',
        x: 100,
        y: 100,
        width: 530,
        height: 700,
        color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900',
        headerBg: 'bg-emerald-100/90 text-emerald-800',
        stickyColor: 'green'
      },
      {
        id: 'delta',
        title: '🔺 DELTA (Δ) (What needs to change)',
        subtitle: 'Constructive modifications for next sprint',
        x: 670,
        y: 100,
        width: 530,
        height: 700,
        color: 'border-sky-300 bg-sky-50/60 text-sky-900',
        headerBg: 'bg-sky-100/90 text-sky-800',
        stickyColor: 'blue'
      }
    ],
    defaultStickyNotes: [
      {
        id: 'pd-1',
        x: 140,
        y: 220,
        width: 180,
        height: 140,
        color: 'green',
        text: 'Awesome sprint velocity! Finished 3 story points ahead of target.',
        author: 'Sarah',
        votes: 5,
        rotation: -1
      },
      {
        id: 'pd-2',
        x: 710,
        y: 220,
        width: 180,
        height: 140,
        color: 'yellow',
        text: 'Refine sprint backlog acceptance criteria before sprint starts.',
        author: 'Alex',
        votes: 6,
        rotation: 1.5
      }
    ]
  },

  blank: {
    id: 'blank',
    title: 'Freeform Miro Canvas',
    category: 'Classic Agile',
    badge: 'Custom Board',
    recommendedTime: 'Flexible',
    teamSize: 'Any',
    description: 'A clean, open infinite canvas with dot grid. Design your own custom retrospective columns or sprint frameworks.',
    icon: 'Sparkles',
    badgeColor: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
    zones: [],
    defaultStickyNotes: [
      {
        id: 'blank-1',
        x: 300,
        y: 250,
        width: 200,
        height: 160,
        color: 'yellow',
        text: '👋 Welcome to BalaBoard! Double click anywhere to drop your own sticky notes.',
        author: 'Bala',
        votes: 3,
        rotation: 0
      }
    ]
  }
};
