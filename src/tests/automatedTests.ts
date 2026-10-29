import { normalizeText, evaluateDangerSigns } from '../safety/escalationEngine';
import { DANGER_SIGN_RULES } from '../safety/dangerSignRules';
import { answerHealthQuery } from '../ai/localModelAdapter';
import { protocolIndexer } from '../protocols/protocolIndexer';
import { localDB } from '../storage/database';
import { calculateSummaryMetrics } from '../planner/dueDateEngine';

export interface AutomatedTestResult {
  id: string;
  name: string;
  category: 'SAFETY' | 'EVIDENCE' | 'OFFLINE_INDEX' | 'PLANNER' | 'STORAGE';
  passed: boolean;
  error?: string;
  executionTimeMs: number;
}

export interface AutomatedSuiteReport {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  tests: AutomatedTestResult[];
  timestamp: string;
}

export function runAllAutomatedUnitTests(): AutomatedSuiteReport {
  const tests: AutomatedTestResult[] = [];

  function recordTest(
    id: string,
    name: string,
    category: AutomatedTestResult['category'],
    assertion: () => void
  ) {
    const t0 = performance.now();
    try {
      assertion();
      tests.push({
        id,
        name,
        category,
        passed: true,
        executionTimeMs: Number((performance.now() - t0).toFixed(2))
      });
    } catch (err: unknown) {
      tests.push({
        id,
        name,
        category,
        passed: false,
        error: err instanceof Error ? err.message : String(err),
        executionTimeMs: Number((performance.now() - t0).toFixed(2))
      });
    }
  }

  // 1. Text Normalization
  recordTest('TEST-01', 'Text Normalisation (case, whitespace, punctuation)', 'SAFETY', () => {
    const raw = '  HEAVY   Bleeding, during!! pregnancy??  ';
    const normalized = normalizeText(raw);
    if (normalized !== 'heavy bleeding during pregnancy') {
      throw new Error(`Expected 'heavy bleeding during pregnancy', got '${normalized}'`);
    }
  });

  // 2. Every Mandatory Danger Sign Rule
  recordTest('TEST-02', 'Every Mandatory Danger Sign Rule Triggers Escalation', 'SAFETY', () => {
    for (const rule of DANGER_SIGN_RULES) {
      const primaryTrigger = rule.triggerKeywords[0];
      const result = evaluateDangerSigns(primaryTrigger);
      if (!result.isEscalated) {
        throw new Error(`Rule ${rule.id} failed to escalate on trigger: ${primaryTrigger}`);
      }
      if (result.matchedRule?.id !== rule.id) {
        throw new Error(`Expected rule ${rule.id}, matched ${result.matchedRule?.id}`);
      }
    }
  });

  // 3. Danger-sign engine execution before model inference
  recordTest('TEST-03', 'Emergency Escalation Executes and Returns Pre-AI Flag', 'SAFETY', () => {
    const res = answerHealthQuery('Severe bleeding during pregnancy with continuous pad soaking');
    if (!res.isEscalated) {
      throw new Error('Expected isEscalated to be true for emergency query');
    }
    if (!res.escalationDetails) {
      throw new Error('Expected escalationDetails to be populated');
    }
  });

  // 4. No model call after emergency escalation (stops normal pipeline)
  recordTest('TEST-04', 'No Generative Model Response Generated After Emergency Interception', 'SAFETY', () => {
    const res = answerHealthQuery('Newborn delivered 10 mins ago baby not breathing and turning blue');
    if (!res.isEscalated) {
      throw new Error('Expected emergency escalation');
    }
    // Normal retrieved sections must be empty or bypassed
    if (res.retrievedSections.length > 0) {
      throw new Error('Normal protocol retrieval must not proceed after emergency escalation');
    }
  });

  // 5. Correct source citation generation
  recordTest('TEST-05', 'Correct Source & Section Citations with Verification Hash', 'EVIDENCE', () => {
    const res = answerHealthQuery('What are the 4 mandatory antenatal checkups scheduled during pregnancy?');
    if (!res.evidenceSufficient) {
      throw new Error('Expected evidence to be sufficient for routine ANC checkups');
    }
    if (res.citations.length === 0) {
      throw new Error('Missing citations for grounded ANC answer');
    }
    const cite = res.citations[0];
    if (!cite.documentTitle || !cite.sectionHeading || typeof cite.pageNumber !== 'number') {
      throw new Error('Citation missing required documentTitle, sectionHeading, or pageNumber');
    }
    if (!cite.verificationHash.startsWith('VERIFIED-')) {
      throw new Error(`Invalid verification hash: ${cite.verificationHash}`);
    }
  });

  // 6. Safe Refusal of Unsupported Questions
  recordTest('TEST-06', 'Rejection of Out-of-Scope Non-Clinical Question', 'EVIDENCE', () => {
    const res = answerHealthQuery('What is the best mutual fund scheme to invest savings for ASHA incentives?');
    if (!res.isModelRefusal) {
      throw new Error('Expected isModelRefusal to be true for out-of-scope question');
    }
    if (res.evidenceSufficient) {
      throw new Error('evidenceSufficient must be false for out-of-scope query');
    }
    if (!res.answerText.includes('could not find sufficient supporting evidence')) {
      throw new Error(`Answer text does not contain mandated refusal: ${res.answerText}`);
    }
  });

  // 7. Local Protocol Search (Zero Network)
  recordTest('TEST-07', 'Local Protocol Inverted Index Matches Keywords Offline', 'OFFLINE_INDEX', () => {
    const matches = protocolIndexer.search('low osmolarity ors zinc diarrhoea');
    if (matches.length === 0) {
      throw new Error('Expected matching sections for ORS & Zinc query');
    }
    const top = matches[0];
    if (!top.section.category.includes('Diarrhoea')) {
      throw new Error(`Expected Diarrhoea category, got ${top.section.category}`);
    }
  });

  // 8. Synthetic register count equals exactly 500
  recordTest('TEST-08', 'Synthetic Household Register Contains Exactly 500 Families', 'STORAGE', () => {
    const households = localDB.getAll();
    if (households.length !== 500) {
      throw new Error(`Expected exactly 500 households, got ${households.length}`);
    }
  });

  // 9. Due-date calculations and priority rules
  recordTest('TEST-09', 'Visit Due Date & Priority Calculations Derive from Records', 'PLANNER', () => {
    const households = localDB.getAll();
    const todayStr = new Date().toISOString().split('T')[0];
    const metrics = calculateSummaryMetrics(households, todayStr);
    if (typeof metrics.dueTodayCount !== 'number' || typeof metrics.overdueCount !== 'number') {
      throw new Error('Metrics calculation failed');
    }
    if (metrics.totalHouseholds !== 500) {
      throw new Error(`Expected 500 total, got ${metrics.totalHouseholds}`);
    }
  });

  // 10. Local persistence of visit completion and notes
  recordTest('TEST-10', 'Local Storage Persistence of Completed Visits and Field Notes', 'STORAGE', () => {
    const testHH = localDB.getAll()[0];
    const originalStatus = testHH.followUpStatus;

    localDB.markVisitCompleted(testHH.householdId, 'Unit test visit completion');
    const updated = localDB.getById(testHH.householdId);

    if (updated?.followUpStatus !== 'COMPLETED') {
      throw new Error(`Expected COMPLETED, got ${updated?.followUpStatus}`);
    }
    if (!updated.visitNotes.some(n => n.includes('Unit test visit completion'))) {
      throw new Error('Note was not persisted in visitNotes');
    }

    // Reset status back
    localDB.updateHousehold({ ...testHH, followUpStatus: originalStatus });
  });

  const passed = tests.filter(t => t.passed).length;
  const failed = tests.filter(t => !t.passed).length;

  return {
    total: tests.length,
    passed,
    failed,
    skipped: 0,
    tests,
    timestamp: new Date().toISOString()
  };
}
