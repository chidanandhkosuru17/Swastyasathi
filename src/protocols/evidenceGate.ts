import { ProtocolSection } from '../types';
import { SearchMatch } from './protocolIndexer';
import { SAFE_REFUSAL_MESSAGE } from './citationValidator';
import { normalizeText } from '../safety/escalationEngine';

export interface EvidenceGateResult {
  isSufficient: boolean;
  confidence: 'HIGH' | 'MODERATE' | 'INSUFFICIENT';
  reason: string;
  topMatches: ProtocolSection[];
  suggestedAction?: string;
}

const MINIMUM_RELEVANCE_SCORE = 2.5;

/**
 * Common out-of-scope domain keywords that should trigger immediate safe refusal
 */
const OUT_OF_SCOPE_DOMAINS = [
  'stock market', 'mutual fund', 'invest', 'loan', 'credit card', 'crypto', 'bitcoin',
  'car engine', 'motorcycle', 'mechanic', 'repair vehicle', 'software code', 'python',
  'javascript', 'cricket match', 'cinema', 'movie tickets', 'recipe cooking cake',
  'cosmetic surgery', 'quantum physics', 'horoscope', 'astrology'
];

export function evaluateEvidenceSufficiency(
  query: string,
  matches: SearchMatch[]
): EvidenceGateResult {
  const normalizedQuery = normalizeText(query);

  // Check out-of-scope non-clinical domains
  for (const oos of OUT_OF_SCOPE_DOMAINS) {
    if (normalizedQuery.includes(oos)) {
      return {
        isSufficient: false,
        confidence: 'INSUFFICIENT',
        reason: 'Query is entirely outside frontline public-health protocol scope.',
        topMatches: [],
        suggestedAction: SAFE_REFUSAL_MESSAGE
      };
    }
  }

  if (!matches || matches.length === 0) {
    return {
      isSufficient: false,
      confidence: 'INSUFFICIENT',
      reason: 'No matching protocol documents found in local repository.',
      topMatches: [],
      suggestedAction: SAFE_REFUSAL_MESSAGE
    };
  }

  const topMatch = matches[0];

  if (topMatch.score < MINIMUM_RELEVANCE_SCORE) {
    return {
      isSufficient: false,
      confidence: 'INSUFFICIENT',
      reason: `Retrieved relevance score (${topMatch.score}) is below the safety threshold (${MINIMUM_RELEVANCE_SCORE}).`,
      topMatches: [],
      suggestedAction: SAFE_REFUSAL_MESSAGE
    };
  }

  // Calculate confidence based on score and keyword coverage
  const confidence = topMatch.score >= 6.0 ? 'HIGH' : 'MODERATE';
  const qualifyingSections = matches
    .filter(m => m.score >= MINIMUM_RELEVANCE_SCORE)
    .slice(0, 3)
    .map(m => m.section);

  return {
    isSufficient: true,
    confidence,
    reason: `Sufficient clinical evidence retrieved from ${qualifyingSections.length} verified protocol section(s).`,
    topMatches: qualifyingSections
  };
}
