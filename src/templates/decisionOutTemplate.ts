import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';
import { BENEFIT_EXTENT_OPTIONS, EVIDENCE_LEVEL_OPTIONS } from '../utils/benefitWording';
import { INDICATION_AREAS, INDICATION_PRESETS_BY_AREA } from '../utils/indicationPresets';
import { buildIndicationFields, buildOutcomeFields } from '../utils/templateContent';

export const decisionOutTemplate: GraphicTemplate = {
  id: "decision-out",
  name: "Verfahren abgeschlossen",
  description: "Slide für G-BA-Beschlüsse und differenzierte Outcome-Kommunikation.",
  supportedPresetIds: ["1080x1080", "1080x1350", "1200x627"],
  htmlTemplate: `
    <div class="slide">
      <div class="grid"></div>
      <div class="glow glow--tl"></div>
      <div class="glow glow--br"></div>
      <div class="accent-stripe"></div>
      <div class="topbar"></div>

      <div class="tag">
        <div class="tag-dot"></div>
        <span class="tag-text">{{tagText}}</span>
      </div>

      <div class="badge badge--gold">{{badgeText}}</div>

      <div class="s2-drug">{{drugName}}<br>{{indicationTitle}}</div>
      <div class="s2-rule"><div class="rule"></div></div>
      <div class="s2-indication">{{indicationLine}}</div>

      <div class="s2-outcome">
        <div class="s2-outcome-label">{{outcomeLabel}}</div>

        <div class="s2-outcome-row">
          <span class="s2-pill s2-pill--primary">{{outcome1Tag}}</span>
          <span class="s2-outcome-text">{{outcome1Text}}</span>
        </div>

        <div class="s2-outcome-row">
          <span class="s2-pill s2-pill--secondary">{{outcome2Tag}}</span>
          <span class="s2-outcome-text">{{outcome2Text}}</span>
        </div>
      </div>

      <div class="s2-zvt">
        <span class="s2-zvt-label">{{zvtShortLabel}}</span>
        <span class="s2-zvt-text">{{zvtText}}</span>
      </div>

      <div class="bottom">
        <div class="publisher">{{publisher}}</div>
        <div class="brand">{{brand}}</div>
      </div>
    </div>
  `,
  css: `
    ${sharedBaseCss}

    .s2-drug {
      position: absolute;
      top: 128px; left: 72px; right: 72px; z-index: 5;
      font-family: 'Instrument Serif', serif;
      font-size: 96px; line-height: 0.95;
      color: #fff; letter-spacing: -2px;
    }

    .s2-rule { position: absolute; top: 390px; left: 72px; z-index: 5; }

    .s2-indication {
      position: absolute;
      top: 412px; left: 72px; right: 72px; z-index: 5;
      font-family: 'DM Sans', sans-serif;
      font-size: 26px; font-weight: 300; color: var(--text-mid); line-height: 1.4;
    }

    .s2-outcome {
      position: absolute;
      top: 530px; left: 72px; right: 72px; z-index: 5;
      border-left: 3px solid var(--gold);
      border-radius: 0 8px 8px 0;
      background: var(--gold-faint);
      border: 1px solid var(--gold-border);
      border-left: 3px solid var(--gold);
      padding: 28px 32px;
    }

    .s2-outcome-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 2.5px;
      text-transform: uppercase; color: var(--gold-dim); margin-bottom: 14px;
      font-variant-numeric: tabular-nums;
    }

    .s2-outcome-row {
      display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px;
    }

    .s2-outcome-row:last-child { margin-bottom: 0; }

    .s2-pill {
      display: inline-block;
      border-radius: 999px;
      padding: 4px 10px;
      white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .s2-pill--primary  { background: rgba(232,184,75,0.16); color: var(--gold); }
    .s2-pill--secondary  { background: rgba(148,163,184,0.16); color: rgba(226,232,240,0.88); }

    .s2-outcome-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 20px; font-weight: 400; color: var(--text); line-height: 1.4;
    }

    .s2-zvt {
      position: absolute;
      top: 840px; left: 72px; right: 72px; z-index: 5;
      display: flex; align-items: baseline; gap: 12px;
    }

    .s2-zvt-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      color: var(--gold-dim); white-space: nowrap;
      font-variant-numeric: tabular-nums;
    }

    .s2-zvt-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 16px; font-weight: 300; color: var(--text-soft);
      font-variant-numeric: tabular-nums;
    }
  `,
  fields: [
    { id: "tagText", label: "Tag", type: "text" },
    { id: "badgeText", label: "Badge", type: "text" },
    { id: "drugName", label: "Wirkstoff", type: "text" },
    { id: "indicationArea", label: "Indikationsbereich", type: "select", options: INDICATION_AREAS },
    {
      id: "indicationPreset",
      label: "Standardindikation",
      type: "select",
      options: INDICATION_PRESETS_BY_AREA[INDICATION_AREAS[0].value],
      dependsOn: "indicationArea",
      optionGroups: INDICATION_PRESETS_BY_AREA,
    },
    {
      id: "indicationCustom",
      label: "Freie Indikation",
      type: "text",
      placeholder: "Optional, überschreibt die Standardindikation",
      helpText: "Nur nutzen, wenn die gewünschte Indikation nicht als Preset hinterlegt ist.",
    },
    { id: "outcomeLabel", label: "Bewertungslabel", type: "text" },
    { id: "outcome1Population", label: "Outcome 1 Population / Subgruppe", type: "text" },
    { id: "outcome1EvidenceLevel", label: "Outcome 1 Evidenzniveau", type: "select", options: EVIDENCE_LEVEL_OPTIONS },
    { id: "outcome1BenefitExtent", label: "Outcome 1 Nutzenausmaß", type: "select", options: BENEFIT_EXTENT_OPTIONS },
    { id: "outcome1Description", label: "Outcome 1 Zusatzbeschreibung", type: "textarea", multiline: true },
    { id: "outcome2Population", label: "Outcome 2 Population / Subgruppe", type: "text" },
    { id: "outcome2EvidenceLevel", label: "Outcome 2 Evidenzniveau", type: "select", options: EVIDENCE_LEVEL_OPTIONS },
    { id: "outcome2BenefitExtent", label: "Outcome 2 Nutzenausmaß", type: "select", options: BENEFIT_EXTENT_OPTIONS },
    { id: "outcome2Description", label: "Outcome 2 Zusatzbeschreibung", type: "textarea", multiline: true },
    { id: "zvtShortLabel", label: "Kurzlabel ZVT", type: "text" },
    { id: "zvtText", label: "ZVT Text", type: "textarea", multiline: true },
    { id: "publisher", label: "Publisher", type: "text" },
    { id: "brand", label: "Brand", type: "text" }
  ],
  defaults: {
    tagText: "G-BA Beschluss · §35a SGB V",
    badgeText: "Decision out",
    drugName: "Wirkstoff",
    indicationArea: "Onkologie",
    indicationPreset: "NSCLC",
    indicationCustom: "",
    outcomeLabel: "G-BA Bewertung",
    outcome1Population: "Subgruppe A",
    outcome1EvidenceLevel: "Hinweis",
    outcome1BenefitExtent: "beträchtlicher Zusatznutzen",
    outcome1Description: "bei therapienaiven Erwachsenen",
    outcome2Population: "Subgruppe B",
    outcome2EvidenceLevel: "Hinweis",
    outcome2BenefitExtent: "kein Zusatznutzen belegt",
    outcome2Description: "",
    zvtShortLabel: "zVT",
    zvtText: "Vergleichstherapie A oder Vergleichstherapie B (populationsabhängig)",
    publisher: "Hans Hirsch · co.faktor",
    brand: "G-BA <em>Digest</em>"
  },
  resolveFieldValues: (fieldValues) => ({
    ...fieldValues,
    ...buildIndicationFields(fieldValues),
    ...buildOutcomeFields(fieldValues, "outcome1"),
    ...buildOutcomeFields(fieldValues, "outcome2"),
  }),
};
