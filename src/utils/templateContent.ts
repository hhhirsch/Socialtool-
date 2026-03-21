import type { FieldValues } from '../types';
import {
  type BenefitBadgeTone,
  buildOutcomeStatement,
  getBenefitBadgeLabel,
  getBenefitBadgeTone,
  STANDARD_BENEFIT_MODE,
} from './benefitWording';
import { resolveIndication } from './indicationPresets';

export interface OutcomeGroupContent {
  benefitExtent: string;
  benefitMode: string;
  description: string;
  evidenceLevel: string;
  population: string;
  pillTone: BenefitBadgeTone;
  tag: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildIndicationFields(fieldValues: FieldValues): FieldValues {
  const indicationValue = resolveIndication(fieldValues);
  const area = fieldValues.indicationArea?.trim() ?? '';

  return {
    indicationTitle: indicationValue ? `- ${indicationValue}` : '- Indikation',
    indicationLine: area ? `Therapiegebiet: ${area}` : indicationValue,
  };
}

export function getOutcomeGroups(fieldValues: FieldValues, groupId = 'groups'): OutcomeGroupContent[] {
  const indexPattern = new RegExp(`^${groupId}\\.(\\d+)\\.([^.]+)$`);
  const indices = Array.from(
    new Set(
      Object.keys(fieldValues)
        .map((key) => {
          const match = key.match(indexPattern);
          return match ? Number(match[1]) : null;
        })
        .filter((value): value is number => value !== null)
    )
  ).sort((left, right) => left - right);

  return indices.map((index) => {
    const population = fieldValues[`${groupId}.${index}.population`] ?? '';
    const evidenceLevel = fieldValues[`${groupId}.${index}.evidenceLevel`] ?? '';
    const benefitExtent = fieldValues[`${groupId}.${index}.benefitExtent`] ?? '';
    const benefitMode = fieldValues[`${groupId}.${index}.benefitMode`] ?? STANDARD_BENEFIT_MODE;
    const description = fieldValues[`${groupId}.${index}.description`] ?? '';

    return {
      population,
      evidenceLevel,
      benefitExtent,
      benefitMode,
      description,
      pillTone: getBenefitBadgeTone(benefitExtent, benefitMode),
      tag: getBenefitBadgeLabel(benefitExtent, benefitMode),
      text: buildOutcomeStatement(
        population,
        evidenceLevel,
        benefitExtent,
        description,
        benefitMode
      ),
    };
  });
}

export function buildOutcomeGroupsHtml(
  fieldValues: FieldValues,
  renderGroup: (group: OutcomeGroupContent, index: number) => string,
  groupId = 'groups'
): string {
  return getOutcomeGroups(fieldValues, groupId)
    .map((group, index) => renderGroup(group, index))
    .join('');
}

export function escapeTemplateHtml(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br />');
}
