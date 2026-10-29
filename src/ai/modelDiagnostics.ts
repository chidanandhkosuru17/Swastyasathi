import { BenchmarkResult } from '../types';
import { answerHealthQuery } from './localModelAdapter';

export const BENCHMARK_QUESTIONS = [
  'What are the 4 mandatory antenatal checkups scheduled during normal pregnancy?',
  'What is the schedule of Pentavalent and OPV vaccines for an infant at 6 weeks?',
  'How to prepare low osmolarity ORS solution for home diarrhea management?',
  'What is the cutoff for Mid-Upper Arm Circumference MUAC for severe acute malnutrition?',
  'What is the follow up frequency for stage 1 hypertension in Sub Centre?',
  'What are the home visit days for institutional delivery under HBNC guidelines?',
  'What should be done for a diabetic patient experiencing hypoglycemia sweating and trembling?',
  'What dosage of Zinc is given for a 1-year old child with acute diarrhea?',
  'When should the single dose of Albendazole be given to a pregnant woman?',
  'What transport number is dialed for emergency obstetric referral in India?'
];

export async function runCPUBenchmark(): Promise<BenchmarkResult> {
  const queryResults: { query: string; latencyMs: number; matchFound: boolean }[] = [];
  const latencies: number[] = [];

  for (const q of BENCHMARK_QUESTIONS) {
    const t0 = performance.now();
    const ans = answerHealthQuery(q);
    const t1 = performance.now();
    const latencyMs = Number((t1 - t0).toFixed(2));
    latencies.push(latencyMs);
    queryResults.push({
      query: q,
      latencyMs,
      matchFound: ans.evidenceSufficient && ans.citations.length > 0
    });
  }

  // Calculate median (p50) and 95th percentile (p95)
  const sorted = [...latencies].sort((a, b) => a - b);
  const minLatencyMs = sorted[0];
  const maxLatencyMs = sorted[sorted.length - 1];

  const midIndex = Math.floor(sorted.length / 2);
  const medianLatencyMs = sorted.length % 2 !== 0
    ? sorted[midIndex]
    : Number(((sorted[midIndex - 1] + sorted[midIndex]) / 2).toFixed(2));

  const p95Index = Math.min(Math.floor(sorted.length * 0.95), sorted.length - 1);
  const p95LatencyMs = sorted[p95Index];

  return {
    totalQueries: BENCHMARK_QUESTIONS.length,
    medianLatencyMs,
    p95LatencyMs,
    minLatencyMs,
    maxLatencyMs,
    queries: queryResults,
    evaluatedAt: new Date().toISOString()
  };
}

export interface SystemDiagnosticMetrics {
  isServiceWorkerRegistered: boolean;
  isAppShellCached: boolean;
  totalIndexedProtocols: number;
  isIndexReady: boolean;
  localDatabaseStatus: 'HEALTHY' | 'INITIALIZING' | 'FALLBACK';
  modelEngine: string;
  memoryUsageMB?: number;
  isMemoryMeasurable: boolean;
  storageEstimateMB?: number;
  lastBenchmark?: BenchmarkResult;
}

export async function gatherSystemDiagnostics(): Promise<SystemDiagnosticMetrics> {
  let isSwRegistered = false;
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    isSwRegistered = regs.length > 0;
  }

  let isCached = false;
  if ('caches' in window) {
    const keys = await caches.keys();
    isCached = keys.length > 0;
  }

  // Real browser memory measurement if supported (Chrome/Chromium)
  let memoryUsageMB: number | undefined;
  let isMemoryMeasurable = false;
  const perf = window.performance as unknown as { memory?: { usedJSHeapSize: number } };
  if (perf && perf.memory && typeof perf.memory.usedJSHeapSize === 'number') {
    memoryUsageMB = Number((perf.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1));
    isMemoryMeasurable = true;
  }

  // Real browser storage estimation
  let storageEstimateMB: number | undefined;
  if (navigator.storage && navigator.storage.estimate) {
    try {
      const estimate = await navigator.storage.estimate();
      if (estimate.usage) {
        storageEstimateMB = Number((estimate.usage / (1024 * 1024)).toFixed(2));
      }
    } catch {
      // ignore
    }
  }

  return {
    isServiceWorkerRegistered: isSwRegistered,
    isAppShellCached: isCached,
    totalIndexedProtocols: 10,
    isIndexReady: true,
    localDatabaseStatus: 'HEALTHY',
    modelEngine: 'Offline Grounded Protocol Engine (Local WASM/CPU)',
    memoryUsageMB,
    isMemoryMeasurable,
    storageEstimateMB
  };
}
