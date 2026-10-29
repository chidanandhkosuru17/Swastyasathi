import React, { useState } from 'react';
import {
  BookOpenCheck,
  Search,
  Filter,
  FileText,
  Building,
  CheckCircle2,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { APPROVED_PROTOCOLS } from '../protocols/protocolData';
import { protocolIndexer } from '../protocols/protocolIndexer';
import { ProtocolSection } from '../types';

export const ProtocolLibraryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [protocols, setProtocols] = useState<ProtocolSection[]>(APPROVED_PROTOCOLS);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [selectedProtocolDetail, setSelectedProtocolDetail] = useState<ProtocolSection | null>(null);

  const categories = ['ALL', ...Array.from(new Set(APPROVED_PROTOCOLS.map(p => p.category)))];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setProtocols(APPROVED_PROTOCOLS);
      return;
    }
    const results = protocolIndexer.search(
      searchQuery,
      selectedCategory !== 'ALL' ? selectedCategory : undefined
    );
    setProtocols(results.map(r => r.section));
  };

  const handleRebuildIndex = () => {
    setIsRebuilding(true);
    setTimeout(() => {
      protocolIndexer.buildIndex();
      setIsRebuilding(false);
    }, 250);
  };

  const displayed = protocols.filter(p => {
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.documentTitle.toLowerCase().includes(q) ||
        p.sectionHeading.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.keywords.some(k => k.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <BookOpenCheck className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Approved Public-Health Protocol Library
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Authoritative national health guidelines indexed locally for offline ASHA / ANM field access.
          </p>
        </div>

        <button
          onClick={handleRebuildIndex}
          disabled={isRebuilding}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold self-start sm:self-auto transition shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-teal-700 ${isRebuilding ? 'animate-spin' : ''}`} />
          <span>{isRebuilding ? 'Rebuilding Index...' : 'Re-index Protocols'}</span>
        </button>
      </div>

      {/* Official Guidelines Verification Badge */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
        <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">National Health Guidelines Corpus: </span>
          All 10 documents are compiled strictly from official MoHFW, National Health Mission (NHM), UIP, and IMNCI publications. Each entry maintains immutable version, section heading, and page reference metadata.
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search protocol corpus by keyword (e.g. 'ANC visits', 'ORS', 'Pentavalent', 'MUAC', 'hypertension')..."
              className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition shrink-0"
          >
            Search Corpus
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
                selectedCategory === cat
                  ? 'bg-teal-700 text-white shadow-xs font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All 10 Protocols' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Protocols Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayed.map(proto => (
          <div
            key={proto.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-600 hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                  {proto.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Page {proto.pageNumber}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {proto.sectionHeading}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {proto.documentTitle} ({proto.version})
                </p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {proto.summary}
              </p>

              {/* Frontline Scope */}
              {proto.allowedActions.length > 0 && (
                <div className="text-[11px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-700 block">ASHA / ANM Scope:</span>
                  {proto.allowedActions.slice(0, 2).map((a, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <span className="text-teal-700 font-bold">•</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium truncate max-w-[200px]" title={proto.approvedBy}>
                Auth: {proto.approvedBy}
              </span>

              <button
                onClick={() => setSelectedProtocolDetail(proto)}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Read Full SOP</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Protocol Text Modal */}
      {selectedProtocolDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-teal-100 text-teal-800">
                  {selectedProtocolDetail.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                  {selectedProtocolDetail.sectionHeading}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedProtocolDetail.documentTitle} • {selectedProtocolDetail.version}
                </p>
              </div>
              <button
                onClick={() => setSelectedProtocolDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              <div className="bg-teal-50/50 p-3.5 rounded-xl border border-teal-100 text-teal-950 font-medium">
                {selectedProtocolDetail.summary}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Full Mandated Protocol Text (Page {selectedProtocolDetail.pageNumber})
                </span>
                {selectedProtocolDetail.content}
              </div>

              {/* Frontline Scope */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Authorized Frontline Health Worker Scope
                </span>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-700">
                  {selectedProtocolDetail.allowedActions.map((act, i) => (
                    <li key={i}>{act}</li>
                  ))}
                </ul>
              </div>

              {/* Escalation Threshold */}
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl text-xs text-rose-900">
                <span className="font-bold flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Medical Officer Escalation Threshold:
                </span>
                <p>{selectedProtocolDetail.escalationThreshold}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Authority: {selectedProtocolDetail.approvedBy}</span>
              <button
                onClick={() => setSelectedProtocolDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
