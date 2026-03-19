import type { TemplateOption } from '../types';

export type EvidenceLevel = 'Beleg' | 'Hinweis' | 'Anhaltspunkt';
export type BenefitMode = 'standard' | 'orphan_belegt' | 'orphan_nicht_quantifizierbar';

export const STANDARD_BENEFIT_MODE: BenefitMode = 'standard';
export const ORPHAN_BELEGT_BENEFIT_MODE: BenefitMode = 'orphan_belegt';
export const ORPHAN_NICHT_QUANTIFIZIERBAR_BENEFIT_MODE: BenefitMode =
  'orphan_nicht_quantifizierbar';

export type BenefitExtent =
  | 'erheblicher Zusatznutzen'
  | 'beträchtlicher Zusatznutzen'
  | 'geringer Zusatznutzen'
  | 'nicht quantifizierbarer Zusatznutzen'
  | 'kein Zusatznutzen belegt'
  | 'geringerer Nutzen';

const evidencePrefixes: Record<EvidenceLevel, string> = {
  Beleg: 'Beleg für',
  Hinweis: 'Hinweis auf',
  Anhaltspunkt: 'Anhaltspunkt für',
};

const extentArticles: Record<
  Exclude<BenefitExtent, 'kein Zusatznutzen belegt' | 'geringerer Nutzen'>,
  string
> = {
  'erheblicher Zusatznutzen': 'einen erheblichen Zusatznutzen',
  'beträchtlicher Zusatznutzen': 'einen beträchtlichen Zusatznutzen',
  'geringer Zusatznutzen': 'einen geringen Zusatznutzen',
  'nicht quantifizierbarer Zusatznutzen': 'einen nicht quantifizierbaren Zusatznutzen',
};

export const EVIDENCE_LEVEL_OPTIONS: TemplateOption[] = [
  { label: 'Beleg', value: 'Beleg' },
  { label: 'Hinweis', value: 'Hinweis' },
  { label: 'Anhaltspunkt', value: 'Anhaltspunkt' },
];

export const BENEFIT_EXTENT_OPTIONS: TemplateOption[] = [
  { label: 'Erheblicher Zusatznutzen', value: 'erheblicher Zusatznutzen' },
  { label: 'Beträchtlicher Zusatznutzen', value: 'beträchtlicher Zusatznutzen' },
  { label: 'Geringer Zusatznutzen', value: 'geringer Zusatznutzen' },
  {
    label: 'Nicht quantifizierbarer Zusatznutzen',
    value: 'nicht quantifizierbarer Zusatznutzen',
  },
  { label: 'Kein Zusatznutzen belegt', value: 'kein Zusatznutzen belegt' },
  { label: 'Geringerer Nutzen', value: 'geringerer Nutzen' },
];

export const BENEFIT_MODE_OPTIONS: TemplateOption[] = [
  { label: 'Standard', value: STANDARD_BENEFIT_MODE },
  { label: 'Orphan – belegt', value: ORPHAN_BELEGT_BENEFIT_MODE },
  { label: 'Orphan – nicht quantifizierbar', value: ORPHAN_NICHT_QUANTIFIZIERBAR_BENEFIT_MODE },
];

export function getBenefitWording(
  evidenceLevel: string,
  benefitExtent: string,
  benefitMode: string = STANDARD_BENEFIT_MODE
): string {
  if (benefitMode === ORPHAN_BELEGT_BENEFIT_MODE) {
    return 'Zusatznutzen gilt aufgrund des Orphan-Drug-Status als belegt';
  }

  if (benefitMode === ORPHAN_NICHT_QUANTIFIZIERBAR_BENEFIT_MODE) {
    return 'Anhaltspunkt für nicht quantifizierbaren Zusatznutzen';
  }

  if (benefitExtent === 'kein Zusatznutzen belegt') {
    return 'Zusatznutzen ist nicht belegt';
  }

  if (benefitExtent === 'geringerer Nutzen') {
    return 'geringerer Nutzen';
  }

  const prefix = evidencePrefixes[evidenceLevel as EvidenceLevel];
  const extent = extentArticles[benefitExtent as keyof typeof extentArticles];

  if (!prefix || !extent) {
    return '';
  }

  return `${prefix} ${extent}`;
}

export function getBenefitBadgeLabel(
  benefitExtent: string,
  benefitMode: string = STANDARD_BENEFIT_MODE
): string {
  if (benefitMode === ORPHAN_BELEGT_BENEFIT_MODE) {
    return 'Orphan';
  }

  if (benefitMode === ORPHAN_NICHT_QUANTIFIZIERBAR_BENEFIT_MODE) {
    return 'Nicht quant.';
  }

  switch (benefitExtent) {
    case 'erheblicher Zusatznutzen':
      return 'Erheblich';
    case 'beträchtlicher Zusatznutzen':
      return 'Beträchtlich';
    case 'geringer Zusatznutzen':
      return 'Gering';
    case 'nicht quantifizierbarer Zusatznutzen':
      return 'Nicht quant.';
    case 'kein Zusatznutzen belegt':
      return 'Nicht belegt';
    case 'geringerer Nutzen':
      return 'Geringerer Nutzen';
    default:
      return 'Bewertung';
  }
}

export function buildOutcomeStatement(
  population: string,
  evidenceLevel: string,
  benefitExtent: string,
  additionalDescription: string,
  benefitMode: string = STANDARD_BENEFIT_MODE
): string {
  const wording = getBenefitWording(evidenceLevel, benefitExtent, benefitMode);
  const populationPrefix = population.trim() ? `${population.trim()}: ` : '';
  const detailSuffix = additionalDescription.trim() ? ` – ${additionalDescription.trim()}` : '';

  return `${populationPrefix}${wording}${detailSuffix}`.trim();
}
