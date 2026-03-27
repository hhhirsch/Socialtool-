import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';
import {
  BENEFIT_EXTENT_OPTIONS,
  BENEFIT_MODE_OPTIONS,
  EVIDENCE_LEVEL_OPTIONS,
} from '../utils/benefitWording';
import { INDICATION_AREAS, INDICATION_PRESETS_BY_AREA } from '../utils/indicationPresets';
import {
  buildIndicationFields,
  buildOutcomeGroupsHtml,
  escapeTemplateHtml,
} from '../utils/templateContent';

export const decisionOutTemplate: GraphicTemplate = {
  id: "decision-out",
  name: "Verfahren abgeschlossen",
  description: "Slide für G-BA-Beschlüsse und differenzierte Outcome-Kommunikation.",
  category: "business",
  supportedPresetIds: ["1080x1080", "1080x1350", "1200x627"],
  rawHtmlPlaceholders: ["groupsHtml"],
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

        {{groupsHtml}}
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
      background: none;
      border: none;
      border-radius: 0;
      box-shadow: none;
      padding: 0;
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
      display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px;
    }

    .s2-outcome-row:last-child { margin-bottom: 0; }

    .s2-pill {
      display: inline-block;
      border-radius: 4px;
      padding: 3px 10px;
      white-space: nowrap;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      flex-shrink: 0;
      margin-top: 3px;
      line-height: 1.4;
    }

    .s2-pill--positive { background: rgba(52,211,153,0.18); color: #34d399; }
    .s2-pill--caution { background: rgba(232,184,75,0.18); color: #e8b84b; }
    .s2-pill--negative { background: rgba(239,68,68,0.14); color: #f87171; }
    .s2-pill--orphan { background: rgba(139,92,246,0.15); color: #a78bfa; }
    .s2-pill--neutral { background: rgba(148,163,184,0.15); color: #94a3b8; }

    .s2-outcome-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 20px; font-weight: 400; color: var(--text); line-height: 1.45;
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
    { id: "indicationArea", label: "Therapiegebiet", type: "select", options: INDICATION_AREAS },
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
    {
      id: "groups",
      label: "Gruppen",
      type: "group",
      minItems: 1,
      addButtonLabel: "+ Gruppe hinzufügen",
      removeButtonLabel: "Gruppe entfernen",
      fields: [
        { id: "population", label: "Population / Subgruppe", type: "text" },
        { id: "benefitMode", label: "Nutzenmodus", type: "select", options: BENEFIT_MODE_OPTIONS },
        { id: "evidenceLevel", label: "Evidenzniveau", type: "select", options: EVIDENCE_LEVEL_OPTIONS },
        { id: "benefitExtent", label: "Nutzenausmaß", type: "select", options: BENEFIT_EXTENT_OPTIONS },
        {
          id: "description",
          label: "Zusatzbeschreibung",
          type: "textarea",
          multiline: true,
          helpText: "Optional, z. B. „Quantifizierung aufgrund Datenlage nicht möglich“.",
        },
      ],
    },
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
    "groups.0.population": "Subgruppe A",
    "groups.0.benefitMode": "standard",
    "groups.0.evidenceLevel": "Hinweis",
    "groups.0.benefitExtent": "beträchtlicher Zusatznutzen",
    "groups.0.description": "bei therapienaiven Erwachsenen",
    zvtShortLabel: "zVT",
    zvtText: "Vergleichstherapie A oder Vergleichstherapie B (populationsabhängig)",
    publisher: "Hans Hirsch · co.faktor",
    brand: "G-BA <em>Digest</em>"
  },
  resolveFieldValues: (fieldValues) => ({
    ...fieldValues,
    ...buildIndicationFields(fieldValues),
    groupsHtml: buildOutcomeGroupsHtml(fieldValues, (group) => `
      <div class="s2-outcome-row">
        <span class="s2-pill s2-pill--${group.pillTone}">${escapeTemplateHtml(group.tag)}</span>
        <span class="s2-outcome-text">${escapeTemplateHtml(group.text)}</span>
      </div>
    `),
  }),
};
