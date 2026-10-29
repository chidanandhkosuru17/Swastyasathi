import React, { useState, useEffect } from 'react';
import {
  Settings,
  Languages,
  RotateCcw,
  Shield,
  CloudUpload,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  ArrowRight,
  Info
} from 'lucide-react';
import { SupportedLanguage, SyncQueueItem } from '../types';
import { localDB } from '../storage/database';

interface SettingsPageProps {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onDataReset: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  language,
  setLanguage,
  onDataReset
}) => {
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([]);
  const [syncConsentGiven, setSyncConsentGiven] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMessage, setSyncSuccessMessage] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);

  useEffect(() => {
    loadSyncQueue();
  }, []);

  const loadSyncQueue = () => {
    setSyncQueue(localDB.getSyncQueue());
  };

  const handleSimulateSync = () => {
    if (!syncConsentGiven) return;
    setIsSyncing(true);
    setSyncSuccessMessage(null);

    setTimeout(() => {
      localDB.clearSyncQueue();
      setSyncQueue([]);
      setIsSyncing(false);
      setSyncSuccessMessage('Local offline queue successfully validated and synchronized to local simulation endpoint.');
    }, 800);
  };

  const handleConfirmReset = () => {
    localDB.resetDatabase();
    onDataReset();
    setShowResetModal(false);
    loadSyncQueue();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
            <Settings className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Settings & Privacy Governance
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Configure application language, review local data governance, and manage consent-based sync.
        </p>
      </div>

      {/* Language Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Languages className="w-4 h-4 text-teal-700" />
          <h3 className="text-sm font-bold text-slate-900">Frontline Language Selection</h3>
        </div>
        <p className="text-xs text-slate-500">
          SwasthyaSaathi supports English, Hindi, and Telugu transliterations for frontline field workers.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: 'en', title: 'English', desc: 'Standard clinical interface' },
            { id: 'hi', title: 'हिंदी (Hindi)', desc: 'राष्ट्रीय स्वास्थ्य मिशन शब्दावली' },
            { id: 'te', title: 'తెలుగు (Telugu)', desc: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ ఫీల్డ్ వర్కర్స్' }
          ].map(lang => (
            <div
              key={lang.id}
              onClick={() => setLanguage(lang.id as SupportedLanguage)}
              className={`p-4 rounded-xl border cursor-pointer transition ${
                language === lang.id
                  ? 'bg-teal-50 border-teal-600 ring-2 ring-teal-600/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{lang.title}</span>
                {language === lang.id && <CheckCircle2 className="w-4 h-4 text-teal-700" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">{lang.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Consent-Based Synchronization Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CloudUpload className="w-4 h-4 text-sky-700" />
            <h3 className="text-sm font-bold text-slate-900">Future-Ready Synchronisation Architecture</h3>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-700">
            {syncQueue.length} queued items
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          In alignment with strict healthcare privacy standards, <strong>zero beneficiary data is transmitted externally without explicit worker consent</strong>. When field workers reach an area with Wi-Fi or cellular network, they can review and trigger sync.
        </p>

        {/* Sync Consent Toggle */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
          <input
            type="checkbox"
            id="syncConsentCheckbox"
            checked={syncConsentGiven}
            onChange={e => setSyncConsentGiven(e.target.checked)}
            className="w-4 h-4 text-teal-600 rounded-sm border-slate-300 focus:ring-teal-500 cursor-pointer mt-0.5"
          />
          <label htmlFor="syncConsentCheckbox" className="text-xs text-slate-700 cursor-pointer">
            <strong className="text-slate-900 block mb-0.5">Explicit Health Worker Consent for Synchronisation</strong>
            I confirm that I have reviewed the pending records and grant consent to synchronize queued field entries with the local simulation endpoint.
          </label>
        </div>

        {syncSuccessMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400">
            Target: Local Simulated Gateway (No external cloud dependence)
          </span>

          <button
            onClick={handleSimulateSync}
            disabled={!syncConsentGiven || syncQueue.length === 0 || isSyncing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-700 hover:bg-sky-800 disabled:bg-slate-200 disabled:text-slate-400 text-white transition active:scale-95"
          >
            <CloudUpload className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
            <span>{isSyncing ? 'Synchronizing...' : `Synchronize Queue (${syncQueue.length})`}</span>
          </button>
        </div>
      </div>

      {/* Privacy & Cybersecurity Protections */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Shield className="w-4 h-4 text-emerald-700" />
          <h3 className="text-sm font-bold text-slate-900">Privacy & Data Governance Principles</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">100% Synthetic Data</strong>
            All 500 household records and beneficiary details are synthetically generated for demonstration. No actual patient or community PII is stored.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Strict On-Device Persistence</strong>
            All protocol indexes, household updates, and danger-sign evaluations remain strictly on the local device's browser sandbox (IndexedDB / Cache API).
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">Sanitized Safety Audit Logs</strong>
            The escalation engine redacts telephone numbers and PII before recording local triage audit logs.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">No Claimed Government Integration</strong>
            This is a transparent hackathon prototype. It does not fabricate or claim unverified certifications with official government portals.
          </div>
        </div>
      </div>

      {/* Technical Architecture Overview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Layers className="w-4 h-4 text-teal-700" />
          <h3 className="text-sm font-bold text-slate-900">SwasthyaSaathi 4-Tier Architecture</h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
            <span className="font-mono font-bold bg-rose-600 text-white px-2 py-0.5 rounded text-[10px]">
              TIER 1
            </span>
            <div>
              <strong className="text-rose-950 block">Deterministic Danger-Sign Escalation Engine (Mandatory Priority 1)</strong>
              <span className="text-rose-800">
                Executes strictly before any AI or generative model. Matches version-controlled clinical emergency rules; triggers immediate red referral screen and stops normal answer generation.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <span className="font-mono font-bold bg-amber-600 text-white px-2 py-0.5 rounded text-[10px]">
              TIER 2
            </span>
            <div>
              <strong className="text-amber-950 block">Evidence Sufficiency Gate (Priority 2)</strong>
              <span className="text-amber-800">
                Searches 10 official public-health protocols in local inverted index. Strictly verifies token overlap and relevance score; triggers safe refusal if unsupported.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3">
            <span className="font-mono font-bold bg-teal-700 text-white px-2 py-0.5 rounded text-[10px]">
              TIER 3
            </span>
            <div>
              <strong className="text-teal-950 block">Offline Grounded Answer Synthesizer (Priority 3)</strong>
              <span className="text-teal-800">
                Generates concise guidance grounded in approved protocol sections. Formats traceable citations with document title, section heading, page number, and clinical disclaimer.
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 flex items-start gap-3">
            <span className="font-mono font-bold bg-sky-700 text-white px-2 py-0.5 rounded text-[10px]">
              TIER 4
            </span>
            <div>
              <strong className="text-sky-950 block">500-Household Daily Visit Planner & Register (Priority 4)</strong>
              <span className="text-sky-800">
                Deterministic register of 500 families calculating due services, overdue follow-ups, and transparent priority reasons entirely on local client storage.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Local Data Reset */}
      <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-rose-100">
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <h3 className="text-sm font-bold text-slate-900">Reset Local Demonstration Data</h3>
        </div>
        <p className="text-xs text-slate-600">
          Re-seeds the local database with a fresh set of exactly 500 deterministic synthetic households and resets the sync queue to initial clean demonstration state.
        </p>

        <button
          onClick={() => setShowResetModal(true)}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold transition active:scale-95"
        >
          Reset 500 Households & Local Cache
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-slate-900">Confirm Local Data Reset</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This will wipe all edited notes, completed visit statuses, and queued items, restoring the initial deterministic 500 households. This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
