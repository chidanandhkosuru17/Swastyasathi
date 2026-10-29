import { ProtocolSection } from '../types';
import { APPROVED_PROTOCOLS } from './protocolData';
import { normalizeText } from '../safety/escalationEngine';

export interface SearchMatch {
  section: ProtocolSection;
  score: number;
  matchingKeywords: string[];
  excerpt: string;
}

/**
 * Local Offline Protocol Inverted Index & Search Engine
 * Zero remote dependencies, instant sub-millisecond execution on client device.
 */
class ProtocolSearchEngine {
  private protocols: ProtocolSection[] = [];
  private tokenIndex: Map<string, Set<string>> = new Map();

  constructor(protocols: ProtocolSection[]) {
    this.protocols = protocols;
    this.buildIndex();
  }

  public setProtocols(protocols: ProtocolSection[]): void {
    this.protocols = protocols;
    this.buildIndex();
  }

  public getProtocols(): ProtocolSection[] {
    return this.protocols;
  }

  public buildIndex(): void {
    this.tokenIndex.clear();
    for (const sec of this.protocols) {
      const combinedText = `${sec.documentTitle} ${sec.category} ${sec.sectionHeading} ${sec.summary} ${sec.content} ${sec.keywords.join(' ')}`;
      const tokens = this.tokenize(combinedText);

      for (const token of tokens) {
        if (!this.tokenIndex.has(token)) {
          this.tokenIndex.set(token, new Set());
        }
        this.tokenIndex.get(token)!.add(sec.id);
      }
    }
  }

  public tokenize(text: string): string[] {
    const normalized = normalizeText(text);
    if (!normalized) return [];
    return normalized
      .split(' ')
      .filter(w => w.length >= 2 && !STOP_WORDS.has(w));
  }

  /**
   * Search protocols with category filter and ranking
   */
  public search(query: string, categoryFilter?: string): SearchMatch[] {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const sectionScores = new Map<string, { score: number; matches: Set<string> }>();

    for (const token of queryTokens) {
      const matchingSectionIds = this.tokenIndex.get(token);
      if (matchingSectionIds) {
        for (const secId of matchingSectionIds) {
          if (!sectionScores.has(secId)) {
            sectionScores.set(secId, { score: 0, matches: new Set() });
          }
          const item = sectionScores.get(secId)!;
          item.score += 2.0; // Base token match
          item.matches.add(token);
        }
      }

      // Check substring matches for root words
      for (const [indexedToken, secIds] of this.tokenIndex.entries()) {
        if (indexedToken !== token && (indexedToken.includes(token) || token.includes(indexedToken))) {
          for (const secId of secIds) {
            if (!sectionScores.has(secId)) {
              sectionScores.set(secId, { score: 0, matches: new Set() });
            }
            const item = sectionScores.get(secId)!;
            item.score += 0.8;
            item.matches.add(indexedToken);
          }
        }
      }
    }

    const results: SearchMatch[] = [];
    const normalizedQuery = normalizeText(query);

    for (const [secId, { score, matches }] of sectionScores.entries()) {
      const sec = this.protocols.find(p => p.id === secId);
      if (!sec) continue;

      if (categoryFilter && categoryFilter !== 'ALL' && sec.category !== categoryFilter) {
        continue;
      }

      let finalScore = score;

      // Boost for matching keywords directly
      for (const kw of sec.keywords) {
        if (normalizedQuery.includes(normalizeText(kw))) {
          finalScore += 5.0;
        }
      }

      // Boost for matching section heading
      if (normalizeText(sec.sectionHeading).includes(normalizedQuery)) {
        finalScore += 8.0;
      }

      // Boost if multiple query tokens matched
      const matchRatio = matches.size / queryTokens.length;
      finalScore *= (1 + matchRatio);

      // Create contextual excerpt
      const excerpt = this.generateExcerpt(sec.content, Array.from(matches));

      results.push({
        section: sec,
        score: Number(finalScore.toFixed(2)),
        matchingKeywords: Array.from(matches),
        excerpt
      });
    }

    // Sort descending by score
    return results.sort((a, b) => b.score - a.score);
  }

  private generateExcerpt(content: string, matchingTokens: string[]): string {
    const sentences = content.split(/[.\n]+/);
    for (const s of sentences) {
      const lowerS = s.toLowerCase();
      for (const t of matchingTokens) {
        if (lowerS.includes(t)) {
          return s.trim() + '.';
        }
      }
    }
    return content.slice(0, 160) + '...';
  }
}

const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for',
  'of', 'with', 'or', 'by', 'as', 'what', 'how', 'when', 'where', 'why',
  'who', 'are', 'can', 'should', 'be', 'do', 'does', 'did', 'have', 'has',
  'had', 'having', 'about', 'from', 'into', 'during', 'before', 'after',
  'above', 'below', 'under', 'again', 'further', 'then', 'once', 'here'
]);

export const protocolIndexer = new ProtocolSearchEngine(APPROVED_PROTOCOLS);
