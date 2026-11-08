import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle, 
  Copy, 
  Check, 
  Send, 
  Settings, 
  TrendingUp, 
  Target, 
  HelpCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { 
  generateRetroSummary, 
  generateSmartActionItems, 
  askFacilitatorCoach,
  getAiConfig,
  saveAiConfig
} from '../services/aiService';
import { playSound } from '../utils/sound';
import confetti from 'canvas-confetti';

export default function AiRetroModal({
  isOpen,
  onClose,
  activeTemplate,
  stickyNotes,
  meetingSettings,
  onImportSmartActions,
  currentPhaseName
}) {
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'smart-actions' | 'coach' | 'settings'

  // Summary State
  const [summaryText, setSummaryText] = useState('');
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // SMART Actions State
  const [smartActions, setSmartActions] = useState([]);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [hasImportedActions, setHasImportedActions] = useState(false);

  // Coach State
  const [coachQuestion, setCoachQuestion] = useState('');
  const [coachAnswer, setCoachAnswer] = useState('');
  const [isLoadingCoach, setIsLoadingCoach] = useState(false);

  // Config State
  const [config, setConfig] = useState(getAiConfig);
  const [savedConfigNotice, setSavedConfigNotice] = useState(false);

  if (!isOpen) return null;

  // Generate Summary
  const handleGenerateSummary = async () => {
    setIsLoadingSummary(true);
    playSound('pop');
    try {
      const result = await generateRetroSummary({
        template: activeTemplate,
        stickyNotes,
        meetingSettings
      });
      setSummaryText(result);
      playSound('reveal');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.4 } });
    } catch (err) {
      alert('AI Generation Error: ' + err.message);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Generate SMART Action Items
  const handleGenerateSmartActions = async () => {
    setIsLoadingActions(true);
    playSound('pop');
    try {
      const items = await generateSmartActionItems({
        template: activeTemplate,
        stickyNotes
      });
      setSmartActions(items);
      playSound('reveal');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.4 } });
    } catch (err) {
      alert('AI Action Item Error: ' + err.message);
    } finally {
      setIsLoadingActions(false);
    }
  };

  // Import to Drawer
  const handleImportToBoard = () => {
    if (!smartActions || smartActions.length === 0) return;
    playSound('vote');
    onImportSmartActions(smartActions);
    setHasImportedActions(true);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
    setTimeout(() => setHasImportedActions(false), 3000);
  };

  // Ask Coach
  const handleAskCoach = async (queryToAsk) => {
    const q = queryToAsk || coachQuestion;
    if (!q.trim()) return;
    setIsLoadingCoach(true);
    playSound('pop');
    try {
      const ans = await askFacilitatorCoach({
        question: q,
        template: activeTemplate,
        stickyNotes,
        currentPhase: currentPhaseName || 'Reflection'
      });
      setCoachAnswer(ans);
      playSound('reveal');
    } catch (err) {
      alert('AI Coach Error: ' + err.message);
    } finally {
      setIsLoadingCoach(false);
    }
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    saveAiConfig(config);
    setSavedConfigNotice(true);
    setTimeout(() => setSavedConfigNotice(false), 2000);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl h-[88vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800">BalaBoard AI Intelligence</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  ⚡ Groq AI (Ultra Fast)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Automated sprint theme synthesis, sentiment intelligence, and SMART action items
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'summary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp size={15} />
            <span>Theme Summary & Sentiment</span>
          </button>

          <button
            onClick={() => setActiveTab('smart-actions')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'smart-actions'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Target size={15} />
            <span>SMART Action Items</span>
            {smartActions.length > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {smartActions.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'coach'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle size={15} />
            <span>AI Facilitator Coach</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`ml-auto flex items-center gap-1.5 pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Settings size={14} />
            <span>Config</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: EXECUTIVE SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Sprint Theme Synthesis</h3>
                  <p className="text-xs text-slate-500">
                    Extracts high-level wins, blockers, and team sentiment from {stickyNotes.length} sticky notes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {summaryText && (
                    <button
                      onClick={handleCopySummary}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      {copiedSummary ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
                    </button>
                  )}
                  <button
                    onClick={handleGenerateSummary}
                    disabled={isLoadingSummary}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all hover:scale-105"
                  >
                    {isLoadingSummary ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                    <span>{summaryText ? 'Re-Analyze Notes' : 'Generate AI Summary'}</span>
                  </button>
                </div>
              </div>

              {isLoadingSummary ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-pulse">
                    <BrainCircuit size={28} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Synthesizing Retrospective Themes...</h4>
                    <p className="text-xs text-slate-500">Evaluating cards, sentiment, and voting distribution</p>
                  </div>
                </div>
              ) : summaryText ? (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-wrap">
                  {summaryText}
                </div>
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                  <Sparkles size={28} className="text-indigo-400" />
                  <p className="text-xs font-semibold text-slate-600">
                    No summary generated yet. Click "Generate AI Summary" to analyze your board.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SMART ACTION ITEMS */}
          {activeTab === 'smart-actions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">SMART Action Item Synthesizer</h3>
                  <p className="text-xs text-slate-500">
                    Converts top-voted sticky notes into actionable, measurable Jira-ready tasks.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {smartActions.length > 0 && (
                    <button
                      onClick={handleImportToBoard}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                        hasImportedActions ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                      }`}
                    >
                      {hasImportedActions ? <Check size={14} /> : <Plus size={14} />}
                      <span>{hasImportedActions ? 'Imported to Board!' : 'Import All to Action Items'}</span>
                    </button>
                  )}
                  <button
                    onClick={handleGenerateSmartActions}
                    disabled={isLoadingActions}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all hover:scale-105"
                  >
                    {isLoadingActions ? <Loader2 size={15} className="animate-spin" /> : <Target size={15} />}
                    <span>{smartActions.length > 0 ? 'Re-Synthesize' : 'Generate SMART Actions'}</span>
                  </button>
                </div>
              </div>

              {isLoadingActions ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-pulse">
                    <Loader2 size={28} className="animate-spin" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">Converting Top Cards to SMART Goals...</h4>
                    <p className="text-xs text-slate-500">Structuring measurable outcomes and assignee recommendations</p>
                  </div>
                </div>
              ) : smartActions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {smartActions.map((action, i) => (
                    <div key={i} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2 hover:border-indigo-400 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          action.priority === 'High' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {action.priority || 'Medium'} Priority
                        </span>
                        <span className="text-[11px] font-bold text-slate-500">
                          Owner: @{action.suggestedAssignee || 'Dev Team'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug">{action.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{action.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2">
                  <Target size={28} className="text-indigo-400" />
                  <p className="text-xs font-semibold text-slate-600">
                    Click "Generate SMART Actions" to convert high-voted retro notes into concrete commitments.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FACILITATOR COACH */}
          {activeTab === 'coach' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800">AI Retrospective Facilitator Coach</h3>
                <p className="text-xs text-slate-500">
                  Ask for facilitation guidance, conflict resolution tactics, or engaging follow-up questions.
                </p>
              </div>

              {/* Preset Query Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  "How to handle negative sentiment this sprint?",
                  "Suggest 3 deep-dive questions for our top-voted card",
                  "Fun closing energizer for remote team"
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCoachQuestion(prompt);
                      handleAskCoach(prompt);
                    }}
                    className="text-[11px] font-medium px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-left"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>

              {/* Question Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask the coach (e.g. How to address PR review delays without pointing fingers?)..."
                  value={coachQuestion}
                  onChange={(e) => setCoachQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskCoach()}
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={() => handleAskCoach()}
                  disabled={isLoadingCoach || !coachQuestion.trim()}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 transition-colors"
                >
                  {isLoadingCoach ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>Ask Coach</span>
                </button>
              </div>

              {/* Coach Answer */}
              {isLoadingCoach ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-slate-500 text-xs">
                  <Loader2 size={24} className="animate-spin text-indigo-600" />
                  <span>Consulting Agile Coaching Playbook...</span>
                </div>
              ) : coachAnswer ? (
                <div className="p-5 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border border-indigo-100 rounded-2xl text-xs text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {coachAnswer}
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 4: AI SETTINGS & LOCAL OLLAMA */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4 max-w-lg">
              <div>
                <h3 className="text-sm font-bold text-slate-800">AI Model Provider Configuration</h3>
                <p className="text-xs text-slate-500">
                  Choose between high-speed cloud inference (Groq) or 100% offline local models (Ollama).
                </p>
              </div>

              {/* Provider Selector */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">AI Provider</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConfig(c => ({ ...c, provider: 'groq' }))}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      config.provider === 'groq' ? 'border-indigo-600 bg-indigo-50/80 text-indigo-800' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    ⚡ Groq Cloud (Ultra Fast)
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">Qwen 27B / GPT-OSS ($0 cost)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfig(c => ({ ...c, provider: 'ollama' }))}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      config.provider === 'ollama' ? 'border-indigo-600 bg-indigo-50/80 text-indigo-800' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    🏠 Local Ollama
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">100% offline on your Mac</span>
                  </button>
                </div>
              </div>

              {/* Groq Key Input */}
              {config.provider === 'groq' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Groq API Key</label>
                  <input
                    type="password"
                    value={config.apiKey}
                    onChange={(e) => setConfig(c => ({ ...c, apiKey: e.target.value }))}
                    placeholder="gsk_..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Pre-configured with working key. Free tier supported.</p>
                </div>
              )}

              {/* Ollama URL */}
              {config.provider === 'ollama' && (
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Ollama Local URL</label>
                  <input
                    type="text"
                    value={config.ollamaUrl}
                    onChange={(e) => setConfig(c => ({ ...c, ollamaUrl: e.target.value }))}
                    placeholder="http://localhost:11434"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Save Settings
              </button>

              {savedConfigNotice && (
                <span className="text-xs text-emerald-600 font-bold ml-2">✓ Settings saved successfully!</span>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
