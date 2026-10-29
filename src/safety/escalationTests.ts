import { EscalationTestCase } from '../types';
import { evaluateDangerSigns } from './escalationEngine';

export const MANDATORY_ESCALATION_TEST_SUITE: EscalationTestCase[] = [
  // --- MANDATORY POSITIVE CLINICAL CASES ---
  {
    id: 'TC-POS-01',
    input: 'Pregnant woman is having heavy bleeding and soaking pads continuously since morning',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-MAT-01',
    description: 'Antepartum/postpartum severe hemorrhage with soaking pads',
    category: 'POSITIVE_MANDATORY'
  },
  {
    id: 'TC-POS-02',
    input: 'Mother in 8th month pregnancy started having convulsions and fits with severe headache',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-MAT-02',
    description: 'Eclampsia / preeclampsia with convulsions during pregnancy',
    category: 'POSITIVE_MANDATORY'
  },
  {
    id: 'TC-POS-03',
    input: 'Labor started 14 hours ago and umbilical cord visible outside vagina',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-MAT-03',
    description: 'Cord prolapse and obstructed labor > 12 hours',
    category: 'POSITIVE_MANDATORY'
  },
  {
    id: 'TC-POS-04',
    input: 'Newborn delivered 10 minutes ago, baby not breathing and turning blue with severe chest indrawing',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-NEWBORN-01',
    description: 'Neonatal asphyxia, baby not breathing, chest indrawing',
    category: 'POSITIVE_MANDATORY'
  },
  {
    id: 'TC-POS-05',
    input: 'Day 3 newborn is cold to touch, lethargic newborn unable to suck milk and floppy',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-NEWBORN-02',
    description: 'Neonatal hypothermia (<35.5C), refusal to feed, suspected sepsis',
    category: 'POSITIVE_MANDATORY'
  },
  {
    id: 'TC-POS-06',
    input: '18-month child has severe dehydration, sunken eyes lethargic child and skin pinch very slow',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-PEDIATRIC-01',
    description: 'Severe dehydration in pediatric patient with lethargy & slow skin pinch',
    category: 'POSITIVE_MANDATORY'
  },
  {
    id: 'TC-POS-07',
    input: 'Elderly patient with bp higher than 180 and severe chest pain radiating to arm',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-CARDIO-01',
    description: 'Hypertensive crisis and suspected acute coronary syndrome',
    category: 'POSITIVE_MANDATORY'
  },

  // --- POSITIVE CODE-MIXED / REGIONAL TRANSLITERATED CASES ---
  {
    id: 'TC-CM-01',
    input: 'Prasuti mahila ko bahut khoon beh raha hai kripya bataiye',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-MAT-01',
    description: 'Hinglish maternal bleeding ("khoon beh raha hai")',
    category: 'POSITIVE_CODE_MIXED'
  },
  {
    id: 'TC-CM-02',
    input: 'Garbhini mahila ko dhaure pad rahe hain aur behosh ho gayi',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-MAT-02',
    description: 'Hinglish eclampsia fits ("dhaure pad rahe hain")',
    category: 'POSITIVE_CODE_MIXED'
  },
  {
    id: 'TC-CM-03',
    input: 'Baccha paida hua hai par baccha saans nahi le raha aur neela pad gaya',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-NEWBORN-01',
    description: 'Hinglish newborn asphyxia ("baccha saans nahi le raha")',
    category: 'POSITIVE_CODE_MIXED'
  },
  {
    id: 'TC-CM-04',
    input: 'Maa cheptondi bidda paalu tagadam ledu and bidda challaga aipoindi',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-NEWBORN-02',
    description: 'Telugu transliteration: newborn hypothermia and refusal to feed',
    category: 'POSITIVE_CODE_MIXED'
  },
  {
    id: 'TC-CM-05',
    input: 'Garbhini sthri ki raktha sravam jarugutondi emergency lo em cheyali',
    expectedEscalation: true,
    expectedRuleId: 'EMERGENCY-MAT-01',
    description: 'Telugu transliteration: maternal bleeding ("raktha sravam")',
    category: 'POSITIVE_CODE_MIXED'
  },

  // --- NEGATIVE ROUTINE INQUIRIES (Must NOT Escalate) ---
  {
    id: 'TC-NEG-01',
    input: 'What are the 4 mandatory antenatal checkups scheduled during normal pregnancy?',
    expectedEscalation: false,
    description: 'Routine ANC visit schedule query',
    category: 'NEGATIVE_ROUTINE'
  },
  {
    id: 'TC-NEG-02',
    input: 'When should the BCG and Hepatitis B birth dose be administered according to UIP?',
    expectedEscalation: false,
    description: 'Routine infant immunization timing query',
    category: 'NEGATIVE_ROUTINE'
  },
  {
    id: 'TC-NEG-03',
    input: 'How to prepare home-made ORS solution with clean boiled water for mild diarrhea?',
    expectedEscalation: false,
    description: 'Routine ORS preparation protocol',
    category: 'NEGATIVE_ROUTINE'
  },
  {
    id: 'TC-NEG-04',
    input: 'What is the cutoff for Mid-Upper Arm Circumference (MUAC) for yellow MAM category?',
    expectedEscalation: false,
    description: 'Routine child malnutrition screening query',
    category: 'NEGATIVE_ROUTINE'
  },
  {
    id: 'TC-NEG-05',
    input: 'How often should a registered hypertension patient visit the Sub-Centre for BP checkup?',
    expectedEscalation: false,
    description: 'Routine chronic disease follow-up schedule',
    category: 'NEGATIVE_ROUTINE'
  },
  {
    id: 'TC-NEG-06',
    input: 'Mother complains of mild morning sickness in first trimester without vomiting blood',
    expectedEscalation: false,
    description: 'Mild common first trimester symptom (not an emergency)',
    category: 'NEGATIVE_ROUTINE'
  },

  // --- NEGATIVE OUT-OF-SCOPE / NON-MEDICAL QUESTIONS (Must NOT Escalate, Evidence Gate handles) ---
  {
    id: 'TC-OOS-01',
    input: 'What is the best mutual fund scheme to invest savings for ASHA incentives?',
    expectedEscalation: false,
    description: 'Completely out-of-scope non-health query',
    category: 'NEGATIVE_UNSUPPORTED'
  },
  {
    id: 'TC-OOS-02',
    input: 'How do I repair the spark plug of a two wheeler motorcycle?',
    expectedEscalation: false,
    description: 'Mechanical repair question',
    category: 'NEGATIVE_UNSUPPORTED'
  }
];

export interface TestRunReport {
  timestamp: string;
  totalTests: number;
  positiveCases: number;
  negativeCases: number;
  truePositives: number;
  falseNegatives: number;
  falsePositives: number;
  trueNegatives: number;
  sensitivityRate: number; // TP / (TP + FN) * 100%
  specificityRate: number; // TN / (TN + FP) * 100%
  allPassed: boolean;
  averageLatencyMs: number;
  results: {
    testCase: EscalationTestCase;
    passed: boolean;
    actualEscalated: boolean;
    matchedRuleId?: string;
    latencyMs: number;
  }[];
}

export function runEscalationTestSuite(): TestRunReport {
  let truePositives = 0;
  let falseNegatives = 0;
  let falsePositives = 0;
  let trueNegatives = 0;
  let totalLatency = 0;

  const results = MANDATORY_ESCALATION_TEST_SUITE.map(tc => {
    const outcome = evaluateDangerSigns(tc.input);
    totalLatency += outcome.latencyMs;

    let passed = false;
    if (tc.expectedEscalation) {
      if (outcome.isEscalated) {
        truePositives++;
        passed = true;
      } else {
        falseNegatives++;
        passed = false;
      }
    } else {
      if (!outcome.isEscalated) {
        trueNegatives++;
        passed = true;
      } else {
        falsePositives++;
        passed = false;
      }
    }

    return {
      testCase: tc,
      passed,
      actualEscalated: outcome.isEscalated,
      matchedRuleId: outcome.matchedRule?.id,
      latencyMs: Number(outcome.latencyMs.toFixed(3))
    };
  });

  const totalTests = MANDATORY_ESCALATION_TEST_SUITE.length;
  const positiveCases = truePositives + falseNegatives;
  const negativeCases = trueNegatives + falsePositives;
  const sensitivityRate = positiveCases > 0 ? (truePositives / positiveCases) * 100 : 0;
  const specificityRate = negativeCases > 0 ? (trueNegatives / negativeCases) * 100 : 0;
  const allPassed = falseNegatives === 0 && falsePositives === 0;

  return {
    timestamp: new Date().toISOString(),
    totalTests,
    positiveCases,
    negativeCases,
    truePositives,
    falseNegatives,
    falsePositives,
    trueNegatives,
    sensitivityRate,
    specificityRate,
    allPassed,
    averageLatencyMs: Number((totalLatency / totalTests).toFixed(3)),
    results
  };
}

export function exportTestReportAsJSON(report: TestRunReport): string {
  return JSON.stringify(report, null, 2);
}

export function exportTestReportAsCSV(report: TestRunReport): string {
  const headers = ['Test ID', 'Category', 'Description', 'Expected', 'Actual', 'Passed', 'Matched Rule', 'Latency (ms)'];
  const rows = report.results.map(r => [
    r.testCase.id,
    r.testCase.category,
    `"${r.testCase.description.replace(/"/g, '""')}"`,
    r.testCase.expectedEscalation ? 'ESCALATE' : 'NORMAL',
    r.actualEscalated ? 'ESCALATE' : 'NORMAL',
    r.passed ? 'PASS' : 'FAIL',
    r.matchedRuleId || 'None',
    r.latencyMs.toString()
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}
