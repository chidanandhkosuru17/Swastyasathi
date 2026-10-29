import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Search,
  MessageSquareHeart,
  BookOpenCheck,
  Cpu,
  Wifi,
  WifiOff,
  Sparkles
} from 'lucide-react';
import { localDB } from '../storage/database';
import { calculateSummaryMetrics, PlannerSummaryMetrics } from '../planner/dueDateEngine';
import { SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';

interface DashboardPageProps {
  onNavigate: (tab: string, queryPayload?: string) => void;
  language: SupportedLanguage;
  isOnline: boolean;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  language,
  isOnline
}) => {
  const t = UI_TRANSLATIONS[language];
  const [metrics, setMetrics] = useState<PlannerSummaryMetrics>({
    totalHouseholds: 500,
    dueTodayCount: 0,
    overdueCount: 0,
    urgentCount: 0,
    highPriorityCount: 0,
    completedCount: 0,
    pendingSyncCount: 0
  });
  const [lastUpdate, setLastUpdate] = useState<string>('Just now');
  const [quickQuestion, setQuickQuestion] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    loadLiveMetrics();
  }, []);

  const loadLiveMetrics = () => {
    const households = localDB.getAll();
    const syncQueue = localDB.getSyncQueue();
    const calculated = calculateSummaryMetrics(households, todayStr, syncQueue.length);
    setMetrics(calculated);
    setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuestion.trim()) {
      onNavigate('ask', quickQuestion.trim());
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Welcome & Frontline Companion Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white p-6 sm:p-8 shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-500/30 text-teal-200 border border-teal-400/30">
              Zero-Cloud Protocol Engine
            </span>
            <span className="text-xs text-teal-200/80">
              Frontline Companion (ASHA & ANM)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t.brandName}
          </h1>
          <p className="mt-1 text-teal-100/90 text-sm sm:text-base font-medium">
            {t.tagline}
          </p>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            Strictly grounded in National Health Mission (NHM) and MoHFW clinical guidelines. Features hard-coded deterministic danger-sign interception and complete offline operation without internet connectivity.
          </p>

          {/* Quick Search Input */}
          <form onSubmit={handleQuickSearch} className="mt-5 flex items-center gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={quickQuestion}
                onChange={e => setQuickQuestion(e.target.value)}
                placeholder={t.askPlaceholder}
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 pl-10 pr-3 py-2.5 rounded-xl border border-white/20 focus:border-teal-400 text-xs sm:text-sm transition focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-teal-600/10 blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 -translate-y-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      </div>

      {/* Key Field Counters - Calculated Live from the 500 Households */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
            <Database className="w-4 h-4 text-teal-600" />
            <span>Field Register & Daily Triage Overview</span>
          </h2>
          <span className="text-xs text-slate-400">
            Calculated from 500 synthetic records • Updated: {lastUpdate}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Due Today */}
          <div
            onClick={() => onNavigate('planner')}
            className="cursor-pointer bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t.dueToday}</span>
              <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{metrics.dueTodayCount}</span>
              <span className="text-xs font-medium text-slate-400">visits</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">Scheduled for {todayStr}</p>
          </div>

          {/* Overdue Follow-ups */}
          <div
            onClick={() => onNavigate('planner')}
            className="cursor-pointer bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-amber-500 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t.overdue}</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-700">{metrics.overdueCount}</span>
              <span className="text-xs font-medium text-amber-600">action required</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">Missed checkups requiring home contact</p>
          </div>

          {/* Urgent Priority */}
          <div
            onClick={() => onNavigate('planner')}
            className="cursor-pointer bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-rose-500 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{t.urgentPriority}</span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-rose-700">{metrics.urgentCount}</span>
              <span className="text-xs font-medium text-rose-600">high vigilance</span>
            </div>
            <p className="mt-1.5 text-[11px] text-slate-500">SAM / High-Risk ANC / Uncontrolled BP</p>
          </div>

          {/* Total Households */}
          <div
            onClick={() => onNavigate('households')}
            className="cursor-pointer bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-teal-500 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Village Register</span>
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{metrics.totalHouseholds}</span>
              <span className="text-xs font-medium text-slate-500">synthetic families</span>
            </div>
            <p className="mt-1.5 text-[11px] text-emerald-600 font-medium">
              {metrics.completedCount} visits completed
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Quick Action 1: Ask Question */}
        <div
          onClick={() => onNavigate('ask')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-teal-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center mb-3">
              <MessageSquareHeart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Ask Health Protocol</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Retrieve approved clinical steps for ANC, immunization, SAM, and diarrhea with exact section and page citations.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-teal-700">
            <span>Open Protocol Assistant</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Quick Action 2: Check Danger Sign */}
        <div
          onClick={() => onNavigate('ask', 'Heavy bleeding during pregnancy with continuous pad soaking')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-rose-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Check Danger Sign</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Test maternal, newborn, or pediatric red-flag symptoms. Bypasses generative AI and triggers immediate emergency referral protocol.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-700">
            <span>Test Emergency Triage</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Quick Action 3: Daily Visit Planner */}
        <div
          onClick={() => onNavigate('planner')}
          className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:border-sky-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Daily Visit Planner</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              View prioritised household visit list, record visit notes, and mark follow-ups completed without needing internet connectivity.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-700">
            <span>View Today's Priority Visits</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* System & Offline Readiness Status Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Offline Core Health Engine Status
              </h3>
              <p className="text-xs text-slate-500">
                Local device storage, cached protocols, and safety engine audit
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('diagnostics')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Cpu className="w-3.5 h-3.5 text-slate-500" />
            <span>Open System Diagnostics</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Connectivity</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Online (Sync Ready)</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>Zero Network (Offline)</span>
                </>
              )}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Local Protocol Corpus</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <BookOpenCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>10 Protocols (Indexed)</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Deterministic Safety Engine</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active (100% Target)</span>
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Pending Sync Items</span>
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${metrics.pendingSyncCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span>{metrics.pendingSyncCount} offline changes queued</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
