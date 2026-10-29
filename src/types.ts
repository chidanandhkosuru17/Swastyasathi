/**
 * Types and interfaces for SwasthyaSaathi
 */

export type BeneficiaryCategory =
  | 'ANC'
  | 'INFANT'
  | 'CHILD_U5'
  | 'NCD_HTN'
  | 'NCD_DIAB'
  | 'GENERAL';

export type PriorityLevel = 'URGENT' | 'HIGH' | 'NORMAL';

export type FollowUpStatus = 'PENDING' | 'OVERDUE' | 'COMPLETED' | 'REFERRED';

export interface HouseholdRecord {
  householdId: string;
  headOfHousehold: string;
  village: string;
  beneficiaryName: string;
  beneficiaryCategory: BeneficiaryCategory;
  beneficiaryAge: string;
  serviceRequired: string;
  lastServiceDate: string;
  nextDueDate: string;
  followUpStatus: FollowUpStatus;
  priority: PriorityLevel;
  priorityReason: string;
  visitNotes: string[];
  updatedAt: string;
}

export interface DangerSignRule {
  id: string;
  category: 'MATERNAL' | 'NEWBORN' | 'PEDIATRIC' | 'CARDIOVASCULAR' | 'RESPIRATORY';
  title: string;
  triggerKeywords: string[];
  codeMixedKeywords: string[]; // Hinglish / Telugu transliterated phrases
  emergencySeverity: 'CRITICAL_IMMEDIATE' | 'HIGH_EMERGENCY';
  actionInstruction: string;
  stabilizationGuidance: string[];
  targetFacility: string;
  ambulanceContact: string;
  sourceDocument: string;
  sectionReference: string;
  pageNumber: number;
  approvalAuthority: string;
}

export interface EscalationResult {
  isEscalated: boolean;
  matchedRule?: DangerSignRule;
  matchedTrigger?: string;
  normalizedInput: string;
  evaluatedAt: string;
  latencyMs: number;
}

export interface EscalationTestCase {
  id: string;
  input: string;
  expectedEscalation: boolean;
  expectedRuleId?: string;
  description: string;
  category: 'POSITIVE_MANDATORY' | 'POSITIVE_CODE_MIXED' | 'NEGATIVE_ROUTINE' | 'NEGATIVE_UNSUPPORTED';
}

export interface ProtocolSection {
  id: string;
  protocolId: string;
  documentTitle: string;
  version: string;
  approvedBy: string;
  category: string;
  sectionHeading: string;
  pageNumber: number;
  keywords: string[];
  summary: string;
  content: string;
  allowedActions: string[];
  escalationThreshold: string;
}

export interface CitationInfo {
  documentTitle: string;
  sectionHeading: string;
  pageNumber: number;
  version: string;
  approvedBy: string;
  evidenceConfidence: 'HIGH' | 'MODERATE' | 'INSUFFICIENT';
  verificationHash: string;
}

export interface ProtocolAnswer {
  question: string;
  answerText: string;
  isEscalated: boolean;
  escalationDetails?: DangerSignRule;
  citations: CitationInfo[];
  evidenceSufficient: boolean;
  retrievedSections: ProtocolSection[];
  evaluationTimeMs: number;
  isModelRefusal: boolean;
  disclaimer: string;
}

export interface SyncQueueItem {
  id: string;
  action: 'UPDATE_HOUSEHOLD' | 'COMPLETE_VISIT' | 'ADD_NOTE' | 'EMERGENCY_LOG';
  payload: Record<string, unknown>;
  timestamp: string;
  status: 'PENDING' | 'SYNCED' | 'FAILED';
}

export interface BenchmarkResult {
  totalQueries: number;
  medianLatencyMs: number;
  p95LatencyMs: number;
  minLatencyMs: number;
  maxLatencyMs: number;
  queries: { query: string; latencyMs: number; matchFound: boolean }[];
  evaluatedAt: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'te';
