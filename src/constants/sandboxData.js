// Realistic Engineering Retrospective Dataset for Recruiter Evaluation & Sandbox Mode
export const RECRUITER_SANDBOX_NOTES = [
  // Column 1: What Went Well (Green / Emerald)
  {
    id: 'sb-1',
    x: 120,
    y: 200,
    width: 175,
    height: 155,
    color: 'green',
    text: 'Zero downtime during our major BFSI payments cloud migration! 🚀',
    author: 'Bala (Scrum Master)',
    votes: 8,
    rotation: -1,
    jiraIssue: {
      key: 'SCRUM-173',
      url: 'https://layyzee.atlassian.net/browse/SCRUM-173',
      summary: 'Execute zero-downtime payments migration',
      status: 'Done'
    }
  },
  {
    id: 'sb-2',
    x: 320,
    y: 200,
    width: 175,
    height: 155,
    color: 'green',
    text: 'Automated CI/CD staging deploy time dropped from 45m to 8m.',
    author: 'Sarah (DevOps)',
    votes: 6,
    rotation: 1
  },
  {
    id: 'sb-3',
    x: 120,
    y: 380,
    width: 175,
    height: 155,
    color: 'green',
    text: 'Great cross-team collaboration during the latency incident triage.',
    author: 'Alex (Backend)',
    votes: 4,
    rotation: -0.5
  },
  {
    id: 'sb-4',
    x: 320,
    y: 380,
    width: 175,
    height: 155,
    color: 'green',
    text: 'Sprint commitment hit 98% predictability for the 3rd sprint in a row.',
    author: 'Bala (Scrum Master)',
    votes: 5,
    rotation: 1.5
  },

  // Column 2: What Could Be Improved (Pink / Rose)
  {
    id: 'sb-5',
    x: 640,
    y: 200,
    width: 175,
    height: 155,
    color: 'pink',
    text: 'Unclear API contract with partner team caused 2 days of frontend integration churn.',
    author: 'Maya (Frontend)',
    votes: 7,
    rotation: 1,
    jiraIssue: {
      key: 'PERF-88',
      url: 'https://layyzee.atlassian.net/browse/PERF-88',
      summary: 'Standardize partner API schema contract testing',
      status: 'In Progress'
    }
  },
  {
    id: 'sb-6',
    x: 840,
    y: 200,
    width: 175,
    height: 155,
    color: 'pink',
    text: 'Staging database schemas drifted from production, masking query regression.',
    author: 'David (DBA)',
    votes: 5,
    rotation: -1.2
  },
  {
    id: 'sb-7',
    x: 640,
    y: 380,
    width: 175,
    height: 155,
    color: 'pink',
    text: 'Too many ad-hoc sync meetings disrupted developer deep flow state.',
    author: 'Alex (Backend)',
    votes: 6,
    rotation: -0.8
  },
  {
    id: 'sb-8',
    x: 840,
    y: 380,
    width: 175,
    height: 155,
    color: 'pink',
    text: 'Flaky end-to-end Cypress tests delayed Monday pre-merge QA signoff.',
    author: 'Elena (QA)',
    votes: 4,
    rotation: 1.2
  },

  // Column 3: Action Ideas (Yellow / Amber)
  {
    id: 'sb-9',
    x: 120,
    y: 620,
    width: 175,
    height: 155,
    color: 'yellow',
    text: 'Adopt pre-merge smoke tests before staging deploy on every PR.',
    author: 'Bala (Scrum Master)',
    votes: 9,
    rotation: -1,
    jiraIssue: {
      key: 'SCRUM-195',
      url: 'https://layyzee.atlassian.net/browse/SCRUM-195',
      summary: 'Implement automated pre-merge staging smoke tests',
      status: 'To Do'
    }
  },
  {
    id: 'sb-10',
    x: 320,
    y: 620,
    width: 175,
    height: 155,
    color: 'yellow',
    text: 'Institute 2-hour daily meeting-free focus windows for dev flow.',
    author: 'Sarah (DevOps)',
    votes: 7,
    rotation: 0.8
  },
  {
    id: 'sb-11',
    x: 120,
    y: 800,
    width: 175,
    height: 155,
    color: 'yellow',
    text: 'Adopt schema contract tests using OpenAPI / Swagger specs.',
    author: 'Maya (Frontend)',
    votes: 5,
    rotation: 1.2
  },
  {
    id: 'sb-12',
    x: 320,
    y: 800,
    width: 175,
    height: 155,
    color: 'yellow',
    text: 'Celebrate sprint win with team lo-fi coffee hour on Friday! ☕',
    author: 'Elena (QA)',
    votes: 5,
    rotation: -1.5
  }
];

export const RECRUITER_SANDBOX_ACTIONS = [
  {
    id: 'sb-act-1',
    title: 'Implement automated pre-merge staging smoke tests (SCRUM-195)',
    assignee: 'Sarah',
    completed: false,
    jiraIssue: {
      key: 'SCRUM-195',
      url: 'https://layyzee.atlassian.net/browse/SCRUM-195'
    }
  },
  {
    id: 'sb-act-2',
    title: 'Standardize partner API schema contract testing (PERF-88)',
    assignee: 'Maya',
    completed: false,
    jiraIssue: {
      key: 'PERF-88',
      url: 'https://layyzee.atlassian.net/browse/PERF-88'
    }
  },
  {
    id: 'sb-act-3',
    title: 'Institute team meeting-free focus blocks from 2PM - 4PM daily',
    assignee: 'Bala',
    completed: true
  }
];
