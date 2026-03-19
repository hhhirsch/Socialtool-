import type { FieldValues } from '../types';
import { buildOutcomeStatement, getBenefitBadgeLabel } from './benefitWording';
import { resolveIndication } from './indicationPresets';

export function buildIndicationFields(fieldValues: FieldValues): FieldValues {
  const indicationValue = resolveIndication(fieldValues);
  const area = fieldValues.indicationArea?.trim() ?? '';

  return {
    indicationTitle: indicationValue ? `- ${indicationValue}` : '- Indikation',
    indicationLine: area ? `Fachbereich: ${area}` : indicationValue,
  };
}

export function buildOutcomeFields(fieldValues: FieldValues, outcomeKey: 'outcome1' | 'outcome2'): FieldValues {
  const population = fieldValues[`${outcomeKey}Population`] ?? '';
  const evidenceLevel = fieldValues[`${outcomeKey}EvidenceLevel`] ?? '';
  const benefitExtent = fieldValues[`${outcomeKey}BenefitExtent`] ?? '';
  const description = fieldValues[`${outcomeKey}Description`] ?? '';

  return {
    [`${outcomeKey}Tag`]: getBenefitBadgeLabel(benefitExtent),
    [`${outcomeKey}Text`]: buildOutcomeStatement(population, evidenceLevel, benefitExtent, description),
  };
}
