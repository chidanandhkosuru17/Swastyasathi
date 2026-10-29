import { CitationInfo, ProtocolSection } from '../types';

/**
 * Creates verifiable citation metadata for a protocol section
 */
export function buildCitation(section: ProtocolSection, confidence: 'HIGH' | 'MODERATE' | 'INSUFFICIENT'): CitationInfo {
  // Simple deterministic verification hash
  const rawString = `${section.protocolId}-${section.sectionHeading}-${section.pageNumber}-${section.version}`;
  let hash = 0;
  for (let i = 0; i < rawString.length; i++) {
    hash = (hash << 5) - hash + rawString.charCodeAt(i);
    hash |= 0;
  }
  const hexHash = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');

  return {
    documentTitle: section.documentTitle,
    sectionHeading: section.sectionHeading,
    pageNumber: section.pageNumber,
    version: section.version,
    approvedBy: section.approvedBy,
    evidenceConfidence: confidence,
    verificationHash: `VERIFIED-${hexHash}`
  };
}

export const CLINICAL_DISCLAIMER =
  'NOTICE FOR FRONTLINE WORKERS: This response is strictly grounded in official public health guidelines and supports, but DOES NOT replace, clinical judgement or evaluation by a qualified Medical Officer. In any deteriorating situation, initiate immediate emergency transfer.';

export const SAFE_REFUSAL_MESSAGE =
  'I could not find sufficient supporting evidence in the available approved protocols. Please consult your supervisor or an appropriate qualified healthcare professional.';
