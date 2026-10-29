import React, { useState, useEffect } from 'react';
import {
  Search,
  MessageSquareHeart,
  ShieldAlert,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ProtocolAnswer, SupportedLanguage } from '../types';
import { answerHealthQuery } from '../ai/localModelAdapter';
import { recordSafetyAudit } from '../safety/escalationEngine';
import { EmergencyReferralModal } from '../components/EmergencyReferralModal';

interface AskProtocolPageProps {
  initialQuery?: string;
  language: SupportedLanguage;
}

const PROTOCOL_CATEGORIES = [
  'ALL',
  'Antenatal Care',
  'Maternal Danger Signs',
  'Newborn Care',
  'Immunisation',
  'Child Growth & Malnutrition',
  'Hypertension',
  'Diabetes',
  'Diarrhoea & ORS',
  'Fever Management',
  'Referral & Follow-up'
];

const SUGGESTED_QUESTIONS = [
  {
    label: '4 Mandatory ANC Checkups',
    query: 'What are the 4 mandatory antenatal checkups scheduled during normal pregnancy?',
    category: 'Antenatal Care'
  },
  {
    label: 'UIP Immunization at 6 Weeks',
    query: 'What is the schedule of Pentavalent and OPV vaccines for an infant at 6 weeks?',
    category: 'Immunisation'
  },
  {
    label: 'Low-Osmolarity ORS Preparation',
    query: 'How to prepare low osmolarity ORS solution and Zinc dosage for child diarrhea?',
    category: 'Diarrhoea & ORS'
  },
  {
    label: 'Severe Acute Malnutrition (MUAC)',
    query: 'What is the cutoff for Mid-Upper Arm Circumference MUAC for severe acute malnutrition?',
    category: 'Child Growth & Malnutrition'
  },
  {
    label: 'Community Hypertension Follow-up',
    query: 'What is the follow up frequency and lifestyle advice for hypertension in Sub Centre?',
    category: 'Hypertension'
  },
  {
    label: 'Home Based Newborn Care Visits',
    query: 'What are the home visit days for institutional delivery under HBNC guidelines?',
    category: 'Newborn Care'
  }
];

const CODE_MIXED_EXAMPLES = [
  {
    label: 'Hinglish: Bacche ko dast (Diarrhea)',
    query: 'Bacche ko dast ho gaya hai to ORS kaise banaye aur kitna dena chahiye?'
  },
  {
    label: 'Hinglish Emergency: Khoon beh raha hai (Danger Sign)',
    query: 'Garbh me bahut khoon beh raha hai aur soaking pads emergency me kya karein?'
  },
  {
    label: 'Telugu Emergency: Raktha sravam (Danger Sign)',
    query: 'Garbhini sthri ki raktha sravam jarugutondi emergency lo em cheyali'
  },
  {
    label: 'Unsupported: Stock Market Advice (Safe Refusal)',
    query: 'What is the best mutual fund scheme to invest savings for ASHA incentives?'
  }
];

export const AskProtocolPage: React.FC<AskProtocolPageProps> = ({
  initialQuery
}) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [currentAnswer, setCurrentAnswer] = useState<ProtocolAnswer | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      handleAsk(initialQuery);
    }
  }, [initialQuery]);

  const handleAsk = (queryToExecute?: string) => {
    const text = queryToExecute || query;
    if (!text || !text.trim()) return;

    setIsProcessing(true);
    // Execute local deterministic answer pipeline
    const answer = answerHealthQuery(
      text,
      selectedCategory !== 'ALL' ? selectedCategory : undefined
    );

    setCurrentAnswer(answer);
    setIsProcessing(false);

    if (answer.isEscalated && answer.escalationDetails) {
      setEmergencyModalOpen(true);
      recordSafetyAudit(
        {
          isEscalated: true,
          matchedRule: answer.escalationDetails,
          normalizedInput: text,
          evaluatedAt: new Date().toISOString(),
          latencyMs: answer.evaluationTimeMs
        },
        text
      );
    }
  };

  const handleClear = () => {
    setQuery('');
    setCurrentAnswer(null);
    setExpandedSectionId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <MessageSquareHeart className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Protocol-Grounded Health Assistant
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Answers are strictly retrieved from official MoHFW / NHM / WHO-AIIMS protocol documents with verifiable citations.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 text-xs font-semibold self-start sm:self-auto transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Clear Conversation</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div>
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
          Filter by Protocol Category (Optional)
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {PROTOCOL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'ALL' ? 'All Protocols' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative">
          <textarea
            rows={3}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Type your clinical protocol inquiry in English or Hinglish / regional phrase (e.g. 'What services are due in ANC 3rd visit?' or 'Bacche ko neela pad gaya')..."
            className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 p-3 rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 focus:outline-hidden transition resize-none"
          />
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Deterministic danger-sign check runs automatically before retrieval</span>
          </div>

          <button
            onClick={() => handleAsk()}
            disabled={isProcessing || !query.trim()}
            className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-sm active:scale-98 shrink-0 min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            <span>{isProcessing ? 'Evaluating Protocol...' : 'Retrieve Guidance'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Questions & Code-Mixed Examples */}
      <div className="space-y-3">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Suggested Demonstration Inquiries
          </span>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((sq, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(sq.query);
                  handleAsk(sq.query);
                }}
                className="text-xs bg-slate-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition text-left"
              >
                {sq.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Bilingual & Code-Mixed Field Queries (Hinglish / Telugu / Out-of-Scope)
          </span>
          <div className="flex flex-wrap gap-2">
            {CODE_MIXED_EXAMPLES.map((cm, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(cm.query);
                  handleAsk(cm.query);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition text-left ${
                  cm.label.includes('Emergency')
                    ? 'bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 font-semibold'
                    : cm.label.includes('Unsupported')
                    ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-teal-50'
                }`}
              >
                {cm.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Output View */}
      {currentAnswer && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* CRITICAL EMERGENCY REFERRAL BANNER (IF DANGER SIGN TRIGGERED) */}
          {currentAnswer.isEscalated && currentAnswer.escalationDetails && (
            <div className="rounded-2xl border-3 border-rose-600 bg-rose-50 p-5 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <ShieldAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-sm">
                        PRIORITY 1: EMERGENCY ESCALATION
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-700">
                        {currentAnswer.escalationDetails.id}
                      </span>
                    </div>
                    <h2 className="text-lg font-black text-rose-900 mt-1">
                      IMMEDIATE REFERRAL — DO NOT DELAY
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-rose-800 mt-1">
                      {currentAnswer.escalationDetails.title}
                    </p>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      {currentAnswer.escalationDetails.actionInstruction}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setEmergencyModalOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shrink-0 shadow-sm"
                >
                  View Full Triage SOP
                </button>
              </div>

              {/* Stabilization highlights */}
              <div className="mt-4 pt-4 border-t border-rose-200 space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-900 block">
                  Mandated Immediate Actions
                </span>
                {currentAnswer.escalationDetails.stabilizationGuidance.slice(0, 3).map((g, idx) => (
                  <p key={idx} className="text-xs text-rose-800 flex items-start gap-2">
                    <span className="font-bold">•</span>
                    <span>{g}</span>
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* SAFE REFUSAL DISPLAY (OUT-OF-SCOPE / INSUFFICIENT EVIDENCE) */}
          {currentAnswer.isModelRefusal && (
            <div className="rounded-2xl border-2 border-amber-300 bg-amber-50/80 p-5 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 text-amber-900 px-2 py-0.5 rounded-sm">
                    Evidence Sufficiency Gate: Refusal
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    Safe Protocol Refusal Triggered
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-800 mt-2 font-medium leading-relaxed bg-white/70 p-3.5 rounded-xl border border-amber-200">
                    "{currentAnswer.answerText}"
                  </p>
                  <p className="text-xs text-slate-600 mt-2">
                    Safety Reason: The query is outside the approved public-health protocol corpus or lacks sufficient validated citations. To prevent clinical hallucinations, SwasthyaSaathi refuses to generate speculative medical advice.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NORMAL GROUNDED PROTOCOL ANSWER */}
          {!currentAnswer.isEscalated && !currentAnswer.isModelRefusal && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              {/* Evidence Confidence Badge & Evaluation Timing */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Evidence Status: High Confidence Grounding</span>
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    ({currentAnswer.evaluationTimeMs.toFixed(1)}ms CPU)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Zero-Cloud Inference
                </span>
              </div>

              {/* Formatted Grounded Content */}
              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed space-y-3 whitespace-pre-line">
                {currentAnswer.answerText}
              </div>

              {/* Mandatory Verifiable Citations */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-teal-700" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Traceable Protocol Citations ({currentAnswer.citations.length})
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {currentAnswer.citations.map((cite, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {cite.documentTitle}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 self-start sm:self-auto">
                          {cite.verificationHash}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
                        <span><strong>Section:</strong> {cite.sectionHeading}</span>
                        <span><strong>Page:</strong> {cite.pageNumber}</span>
                        <span><strong>Edition:</strong> {cite.version}</span>
                      </div>
                      <p className="mt-1.5 text-[11px] text-slate-500">
                        <strong>Approved Authority:</strong> {cite.approvedBy}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expandable Full Protocol Section Drawer */}
              {currentAnswer.retrievedSections.length > 0 && (
                <div className="pt-2">
                  <button
                    onClick={() =>
                      setExpandedSectionId(
                        expandedSectionId === currentAnswer.retrievedSections[0].id
                          ? null
                          : currentAnswer.retrievedSections[0].id
                      )
                    }
                    className="flex items-center gap-1.5 text-xs font-semibold text-teal-700 hover:text-teal-900"
                  >
                    <span>{expandedSectionId ? 'Hide' : 'Inspect'} Full Source Document Text</span>
                    {expandedSectionId ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {expandedSectionId && (
                    <div className="mt-3 bg-slate-900 text-slate-200 rounded-xl p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                      <div className="text-teal-400 font-bold mb-2 pb-1 border-b border-slate-700 flex items-center justify-between">
                        <span>RAW SOURCE: {currentAnswer.retrievedSections[0].documentTitle}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </div>
                      {currentAnswer.retrievedSections[0].content}
                    </div>
                  )}
                </div>
              )}

              {/* Clinical Disclaimer */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] text-slate-500 italic leading-relaxed">
                  {currentAnswer.disclaimer}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Emergency Modal Pop-up */}
      {emergencyModalOpen && currentAnswer?.escalationDetails && (
        <EmergencyReferralModal
          rule={currentAnswer.escalationDetails}
          rawTrigger={currentAnswer.question}
          onClose={() => setEmergencyModalOpen(false)}
        />
      )}
    </div>
  );
};
