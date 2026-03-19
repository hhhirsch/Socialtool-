import type { TemplateOption } from '../types';

export const INDICATION_AREAS: TemplateOption[] = [
  { label: 'Onkologie', value: 'Onkologie' },
  { label: 'Immunologie / Rheumatologie', value: 'Immunologie / Rheumatologie' },
  { label: 'Neurologie', value: 'Neurologie' },
  { label: 'Infektiologie', value: 'Infektiologie' },
  { label: 'Kardiologie / Stoffwechsel', value: 'Kardiologie / Stoffwechsel' },
  { label: 'Dermatologie', value: 'Dermatologie' },
  { label: 'Pneumologie', value: 'Pneumologie' },
  { label: 'Ophthalmologie', value: 'Ophthalmologie' },
  { label: 'Seltene Erkrankungen', value: 'Seltene Erkrankungen' },
  { label: 'Sonstiges', value: 'Sonstiges' },
];

export const INDICATION_PRESETS_BY_AREA: Record<string, TemplateOption[]> = {
  Onkologie: [
    { label: 'NSCLC', value: 'NSCLC' },
    { label: 'Mammakarzinom', value: 'Mammakarzinom' },
    { label: 'Multiples Myelom', value: 'Multiples Myelom' },
    { label: 'CLL', value: 'CLL' },
  ],
  'Immunologie / Rheumatologie': [
    { label: 'Rheumatoide Arthritis', value: 'Rheumatoide Arthritis' },
    { label: 'Psoriasis-Arthritis', value: 'Psoriasis-Arthritis' },
    { label: 'Morbus Crohn', value: 'Morbus Crohn' },
    { label: 'Colitis ulcerosa', value: 'Colitis ulcerosa' },
  ],
  Neurologie: [
    { label: 'Multiple Sklerose', value: 'Multiple Sklerose' },
    { label: 'Myasthenia gravis', value: 'Myasthenia gravis' },
    { label: 'Migräneprophylaxe', value: 'Migräneprophylaxe' },
    { label: 'Morbus Parkinson', value: 'Morbus Parkinson' },
  ],
  Infektiologie: [
    { label: 'COVID-19', value: 'COVID-19' },
    { label: 'HIV-Infektion', value: 'HIV-Infektion' },
    { label: 'Hepatitis C', value: 'Hepatitis C' },
    { label: 'RSV-Infektion', value: 'RSV-Infektion' },
  ],
  'Kardiologie / Stoffwechsel': [
    { label: 'Herzinsuffizienz', value: 'Herzinsuffizienz' },
    { label: 'Hypercholesterinämie', value: 'Hypercholesterinämie' },
    { label: 'Typ-2-Diabetes', value: 'Typ-2-Diabetes' },
    { label: 'Adipositas', value: 'Adipositas' },
  ],
  Dermatologie: [
    { label: 'Plaque-Psoriasis', value: 'Plaque-Psoriasis' },
    { label: 'Atopische Dermatitis', value: 'Atopische Dermatitis' },
    { label: 'Hidradenitis suppurativa', value: 'Hidradenitis suppurativa' },
  ],
  Pneumologie: [
    { label: 'Asthma bronchiale', value: 'Asthma bronchiale' },
    { label: 'COPD', value: 'COPD' },
    { label: 'Idiopathische Lungenfibrose', value: 'Idiopathische Lungenfibrose' },
  ],
  Ophthalmologie: [
    { label: 'nAMD', value: 'nAMD' },
    { label: 'Diabetisches Makulaödem', value: 'Diabetisches Makulaödem' },
    { label: 'Uveitis', value: 'Uveitis' },
  ],
  'Seltene Erkrankungen': [
    { label: 'SMA', value: 'SMA' },
    { label: 'PNH', value: 'PNH' },
    { label: 'Fabry-Krankheit', value: 'Fabry-Krankheit' },
    { label: 'Hämophilie A', value: 'Hämophilie A' },
  ],
  Sonstiges: [{ label: 'Freie Indikation nutzen', value: 'Freie Indikation nutzen' }],
};

export function resolveIndication(values: {
  indicationArea?: string;
  indicationPreset?: string;
  indicationCustom?: string;
}): string {
  const customValue = values.indicationCustom?.trim();
  if (customValue) {
    return customValue;
  }

  return values.indicationPreset?.trim() || values.indicationArea?.trim() || '';
}
