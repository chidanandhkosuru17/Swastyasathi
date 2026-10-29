import React from 'react';
import {
  Sparkles,
  ShieldAlert,
  HelpCircle,
  Calendar,
  CheckCircle2,
  Cpu,
  ChevronRight
} from 'lucide-react';

interface HackathonDemoBarProps {
  onTriggerNormalQuestion: () => void;
  onTriggerEmergencyEscalation: () => void;
  onTriggerUnsupportedQuestion: () => void;
  onOpenPrioritisedVisits: () => void;
  onRunEscalationTests: () => void;
  onRunDiagnostics: () => void;
}

export const HackathonDemoBar: React.FC<HackathonDemoBarProps> = ({
  onTriggerNormalQuestion,
  onTriggerEmergencyEscalation,
  onTriggerUnsupportedQuestion,
  onOpenPrioritisedVisits,
  onRunEscalationTests,
  onRunDiagnostics
}) => {
  return (
    <aside aria-label="Hackathon quick evaluation demo panel" className="bg-slate-900 text-slate-100 border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Header Tag */}
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                Hackathon Evaluator Quick-Demo Bar
              </span>
            </div>
            <span className="hidden sm:inline text-[11px] text-slate-400">
              (Live execution of 5 core outcomes)
            </span>
          </div>

          {/* 6 Core Functional Trigger Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none text-xs">
            {/* 1. Normal Protocol Question */}
            <button
              onClick={onTriggerNormalQuestion}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium whitespace-nowrap active:scale-95 transition"
              title="Queries ANC 4-visit schedule with source & section citations"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Normal Question</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            {/* 2. Emergency Danger-Sign */}
            <button
              onClick={onTriggerEmergencyEscalation}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/60 font-semibold whitespace-nowrap active:scale-95 transition"
              title="Triggers immediate deterministic referral before AI reasoning"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>2. Emergency Escalation</span>
              <ChevronRight className="w-3 h-3 text-rose-500" />
            </button>

            {/* 3. Unsupported Safe Refusal */}
            <button
              onClick={onTriggerUnsupportedQuestion}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium whitespace-nowrap active:scale-95 transition"
              title="Demonstrates Evidence Gate safe refusal on out-of-scope query"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>3. Safe Refusal</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            {/* 4. Prioritised Visit List */}
            <button
              onClick={onOpenPrioritisedVisits}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium whitespace-nowrap active:scale-95 transition"
              title="Opens today's urgent visits calculated from 500 households"
            >
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>4. Today's Urgent Visits</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            {/* 5. Run Escalation Test Suite */}
            <button
              onClick={onRunEscalationTests}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-teal-950/90 hover:bg-teal-900 text-teal-200 border border-teal-800/70 font-semibold whitespace-nowrap active:scale-95 transition"
              title="Runs mandatory positive & negative test cases with 100% target verification"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
              <span>5. Escalation Suite (100%)</span>
              <ChevronRight className="w-3 h-3 text-teal-500" />
            </button>

            {/* 6. Offline Diagnostics */}
            <button
              onClick={onRunDiagnostics}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium whitespace-nowrap active:scale-95 transition"
              title="Runs CPU benchmark and inspects offline PWA cache"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              <span>6. Offline Diagnostics</span>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
