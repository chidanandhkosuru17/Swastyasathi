import { DangerSignRule, EscalationResult } from '../types';
import { DANGER_SIGN_RULES } from './dangerSignRules';

/**
 * Normalizes input string for deterministic matching:
 * - Lowercases text
 * - Strips punctuation and extraneous symbols
 * - Collapses consecutive whitespace characters into a single space
 * - Trims edges
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\d]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Deterministic Danger-Sign Escalation Engine
 *
 * CRITICAL SAFETY PRINCIPLE:
 * This function executes strictly BEFORE any generative model, embedding model,
 * or conversational agent is invoked. It is 100% deterministic, rules-based,
 * and zero-network dependent.
 */
export function evaluateDangerSigns(query: string): EscalationResult {
  const startTime = performance.now();
  const normalized = normalizeText(query);

  if (!normalized) {
    return {
      isEscalated: false,
      normalizedInput: '',
      evaluatedAt: new Date().toISOString(),
      latencyMs: performance.now() - startTime
    };
  }

  // Iterate over version-controlled rules
  for (const rule of DANGER_SIGN_RULES) {
    // Check primary English keywords & clinical phrases
    for (const trigger of rule.triggerKeywords) {
      const normalizedTrigger = normalizeText(trigger);
      if (normalizedTrigger && normalized.includes(normalizedTrigger)) {
        const latencyMs = performance.now() - startTime;
        return {
          isEscalated: true,
          matchedRule: rule,
          matchedTrigger: trigger,
          normalizedInput: normalized,
          evaluatedAt: new Date().toISOString(),
          latencyMs
        };
      }
    }

    // Check supported bilingual / code-mixed triggers (Hinglish & Telugu transliterations)
    for (const trigger of rule.codeMixedKeywords) {
      const normalizedTrigger = normalizeText(trigger);
      if (normalizedTrigger && normalized.includes(normalizedTrigger)) {
        const latencyMs = performance.now() - startTime;
        return {
          isEscalated: true,
          matchedRule: rule,
          matchedTrigger: trigger,
          normalizedInput: normalized,
          evaluatedAt: new Date().toISOString(),
          latencyMs
        };
      }
    }
  }

  // No emergency triggers detected
  return {
    isEscalated: false,
    normalizedInput: normalized,
    evaluatedAt: new Date().toISOString(),
    latencyMs: performance.now() - startTime
  };
}

/**
 * Local audit log storage for safety investigations
 */
export interface SafetyAuditLog {
  id: string;
  timestamp: string;
  normalizedQueryExcerpt: string;
  isEscalated: boolean;
  matchedRuleId?: string;
  ruleTitle?: string;
  latencyMs: number;
}

const AUDIT_STORAGE_KEY = 'swasthya_safety_audit_logs';

export function recordSafetyAudit(result: EscalationResult, rawQuery: string): void {
  try {
    const existing: SafetyAuditLog[] = JSON.parse(
      localStorage.getItem(AUDIT_STORAGE_KEY) || '[]'
    );
    // Sanitize query excerpt to prevent logging private patient identifying info
    const safeExcerpt = rawQuery.slice(0, 60).replace(/\b\d{10}\b/g, '[PHONE_REDACTED]');
    const newLog: SafetyAuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: result.evaluatedAt,
      normalizedQueryExcerpt: safeExcerpt,
      isEscalated: result.isEscalated,
      matchedRuleId: result.matchedRule?.id,
      ruleTitle: result.matchedRule?.title,
      latencyMs: Number(result.latencyMs.toFixed(3))
    };
    // Keep last 100 logs
    const updated = [newLog, ...existing].slice(0, 100);
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Graceful fallback if localStorage is unavailable
  }
}

export function getSafetyAuditLogs(): SafetyAuditLog[] {
  try {
    return JSON.parse(localStorage.getItem(AUDIT_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
