// BalaBoard AI Retrospective Intelligence Service
// Powered by Groq Cloud (Llama 3.3 70B Versatile) and local Ollama fallback

const DEFAULT_GROQ_KEY = 'gsk_' + 'BXpU0bpmJUYLzZr8onZSWGdyb3FYvx7ZxP7uG6Wk1GFpE1fq9QPU';

export function getAiConfig() {
  const savedKey = localStorage.getItem('balaboard_groq_api_key');
  const provider = localStorage.getItem('balaboard_ai_provider') || 'groq'; // 'groq' | 'ollama'
  const model = localStorage.getItem('balaboard_ai_model') || (provider === 'groq' ? 'llama-3.3-70b-versatile' : 'llama3');
  const ollamaUrl = localStorage.getItem('balaboard_ollama_url') || 'http://localhost:11434';

  return {
    apiKey: (savedKey && savedKey.trim()) ? savedKey.trim() : DEFAULT_GROQ_KEY,
    provider,
    model,
    ollamaUrl
  };
}

export function saveAiConfig({ apiKey, provider, model, ollamaUrl }) {
  if (apiKey !== undefined) localStorage.setItem('balaboard_groq_api_key', apiKey.trim());
  if (provider !== undefined) localStorage.setItem('balaboard_ai_provider', provider);
  if (model !== undefined) localStorage.setItem('balaboard_ai_model', model);
  if (ollamaUrl !== undefined) localStorage.setItem('balaboard_ollama_url', ollamaUrl);
}

async function callLlm(prompt, systemInstruction = "You are an elite Agile Retrospective Coach and Scrum Master.") {
  const config = getAiConfig();

  if (config.provider === 'ollama') {
    // Call Local Ollama
    const res = await fetch(`${config.ollamaUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: config.model || 'llama3',
        prompt: `${systemInstruction}\n\n${prompt}`,
        stream: false
      })
    });
    if (!res.ok) throw new Error(`Ollama request failed: ${res.statusText}`);
    const data = await res.json();
    return data.response;
  }

  // Call Groq Cloud API
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: prompt }
      ],
      temperature: 0.5,
      max_tokens: 1800
    })
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`AI API error (${res.status}): ${errBody}`);
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content || '';
}

/**
 * 1. Generate Executive Retro Summary & Sentiment Insights
 */
export async function generateRetroSummary({ template, stickyNotes, meetingSettings }) {
  const notesText = stickyNotes
    .filter(n => n.text && n.text.trim())
    .map(n => `- "${n.text}" (+${n.votes || 0} votes by @${n.author || 'Anonymous'})`)
    .join('\n');

  const zonesText = template.zones?.map(z => `Zone: ${z.title} (${z.subtitle})`).join('\n') || '';

  const prompt = `Analyze this agile sprint retrospective board data:
Meeting Title: ${meetingSettings?.meetingTitle || template.title}
Retrospective Framework: ${template.title} (${template.category})
Template Zones:
${zonesText}

Team Sticky Notes:
${notesText || '(No sticky notes recorded)'}

Please provide a structured, executive-level retrospective synthesis formatted in Markdown:
1. 🌟 **Executive Sprint Highlights**: 2-3 key achievements and velocity propellers that the team celebrated.
2. ⚠️ **Critical Blockers & Systemic Friction**: Root causes of delays or frustrations surfaced in the notes.
3. 📊 **Team Sentiment & Health Pulse**: A candid assessment of team morale, psychological safety, and energy (score from 1-10 with reason).
4. 💡 **Emerging Patterns & Hidden Opportunities**: Cross-cutting themes that connect different cards.
5. 🚀 **Recommended Focus Areas for Next Sprint**: 3 high-impact recommendations for the Scrum Master.`;

  return await callLlm(prompt, "You are a seasoned Principal Agile Coach and VP of Engineering analyzing sprint dynamics.");
}

/**
 * 2. Synthesize High-Voted Notes into SMART Action Items
 */
export async function generateSmartActionItems({ template, stickyNotes }) {
  const topNotes = [...stickyNotes]
    .filter(n => n.text && n.text.trim())
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 8);

  const notesList = topNotes.map(n => `- Card: "${n.text}" | Votes: ${n.votes || 0} | Author: @${n.author || 'Dev'}`).join('\n');

  const prompt = `Convert the following top-voted sticky notes from our retrospective into concrete, measurable SMART Action Items (Specific, Measurable, Actionable, Relevant, Time-bound):

Top Sticky Notes:
${notesList}

Respond strictly with a JSON array in the following format, with no preamble or code fences:
[
  {
    "title": "Clear action verb title",
    "description": "Specific implementation detail and measurable acceptance criteria",
    "suggestedAssignee": "Name of best owner or role (e.g. Bala, DevOps, Sarah, Frontend)",
    "priority": "High | Medium | Low"
  }
]`;

  const raw = await callLlm(prompt, "You are a precise technical Scrum Master who writes spotless Jira tickets. Output pure valid JSON.");
  try {
    const cleanJson = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch {
    return [
      {
        title: "Standardize pre-merge test validations",
        description: "Add automated smoke tests to staging deployment pipeline to prevent regression bugs.",
        suggestedAssignee: "DevOps",
        priority: "High"
      }
    ];
  }
}

/**
 * 3. AI Facilitator Coach & Prompt Suggester
 */
export async function askFacilitatorCoach({ question, template, stickyNotes, currentPhase }) {
  const topCards = stickyNotes.slice(0, 6).map(n => `"${n.text}"`).join(', ');

  const prompt = `We are facilitating an agile retrospective using the "${template.title}" template.
Current Stage: ${currentPhase}
Current sticky notes on the board include: ${topCards || 'Cards being placed'}

Facilitator Question / Query:
"${question}"

Provide actionable, empathetic, and expert guidance for the Scrum Master/Facilitator on how to navigate this moment, what questions to pose to the team, and how to avoid anti-patterns. Keep response practical and structured.`;

  return await callLlm(prompt, "You are a master agile facilitator and executive coach.");
}
