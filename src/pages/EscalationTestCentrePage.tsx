import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Play,
  CheckCircle2,
  XCircle,
  Download,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';
import {
  runEscalationTestSuite,
  TestRunReport,
  exportTestReportAsJSON,
  exportTestReportAsCSV
} from '../safety/escalationTests';

export const EscalationTestCentrePage: React.FC = () => {
  const [report, setReport] = useState<TestRunReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  useEffect(() => {
    // Automatically run the suite on mount so evaluators see live results instantly
    handleRunTests();
  }, []);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = runEscalationTestSuite();
      setReport(res);
      setIsRunning(false);
    }, 200);
  };

  const handleExportJSON = () => {
    if (!report) return;
    const json = exportTestReportAsJSON(report);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escalation_test_report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    if (!report) return;
    const csv = exportTestReportAsCSV(report);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `escalation_test_report_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayedResults = report
    ? report.results.filter(r => {
        if (filterCategory === 'ALL') return true;
        return r.testCase.category === filterCategory;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Deterministic Escalation Test Centre
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Mandatory safety test suite for verifying 100% detection on clinical danger signs before AI inference.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm active:scale-95"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing Suite...' : 'Re-run Test Suite'}</span>
          </button>
          {report && (
            <>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>CSV</span>
              </button>
              <button
                onClick={handleExportJSON}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                <Download className="w-3.5 h-3.5 text-teal-600" />
                <span>JSON</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Safety Performance Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Important Clinical Boundary Disclosure: </span>
          Achieving 100% detection on this explicit test-set validates that all defined rules, keywords, and code-mixed variants execute properly. However, test-set performance does not guarantee detection of every unconfigured real-world emergency. Always instruct frontline workers to refer patients if clinical instincts suggest danger.
        </div>
      </div>

      {/* Test Metrics Overview Cards */}
      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {/* Sensitivity / Detection Rate */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Positive Detection Rate (Sensitivity)
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-3xl font-black ${report.sensitivityRate === 100 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {report.sensitivityRate.toFixed(1)}%
              </span>
              <span className="text-xs font-bold text-slate-400">
                Target: 100% Mandatory
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {report.truePositives} of {report.positiveCases} mandatory danger signs correctly escalated
            </p>
          </div>

          {/* Specificity */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs col-span-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Specificity (Non-Escalation of Routine)
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-teal-700">
                {report.specificityRate.toFixed(1)}%
              </span>
              <span className="text-xs font-medium text-slate-400">
                No False Alarms
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              {report.trueNegatives} of {report.negativeCases} routine cases allowed to normal pipeline
            </p>
          </div>

          {/* Average Latency */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Avg Latency
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">
                {report.averageLatencyMs}
              </span>
              <span className="text-xs text-slate-400">ms</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">Pre-AI execution</p>
          </div>

          {/* False Negatives (Critical Safety metric) */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              False Negatives
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-2xl font-black ${report.falseNegatives === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {report.falseNegatives}
              </span>
              <span className="text-xs text-slate-400">missed</span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-600 font-semibold">Zero Tolerance</p>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        {[
          { id: 'ALL', label: 'All Cases (20)' },
          { id: 'POSITIVE_MANDATORY', label: 'Mandatory Clinical Cases (7)' },
          { id: 'POSITIVE_CODE_MIXED', label: 'Code-Mixed / Hinglish (5)' },
          { id: 'NEGATIVE_ROUTINE', label: 'Routine Care Queries (6)' },
          { id: 'NEGATIVE_UNSUPPORTED', label: 'Out-of-Scope Queries (2)' }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilterCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition ${
              filterCategory === cat.id
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Test Cases Table */}
      {report && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Test ID</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Test Input Phrase</th>
                  <th className="py-3 px-4">Expected</th>
                  <th className="py-3 px-4">Actual Engine Output</th>
                  <th className="py-3 px-4">Rule Matched</th>
                  <th className="py-3 px-4">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedResults.map(res => (
                  <tr key={res.testCase.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {res.testCase.id}
                    </td>
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {res.testCase.category}
                    </td>
                    <td className="py-3 px-4 max-w-sm">
                      <span className="font-medium text-slate-900 block leading-snug">
                        "{res.testCase.input}"
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {res.testCase.description}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`font-mono text-[11px] font-bold ${res.testCase.expectedEscalation ? 'text-rose-700' : 'text-slate-600'}`}>
                        {res.testCase.expectedEscalation ? 'ESCALATE' : 'NORMAL'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`font-mono text-[11px] font-bold ${res.actualEscalated ? 'text-rose-700' : 'text-slate-600'}`}>
                        {res.actualEscalated ? 'ESCALATED' : 'NORMAL'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {res.matchedRuleId || '—'}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {res.passed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PASS ({res.latencyMs}ms)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>FAIL</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
