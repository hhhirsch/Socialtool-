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

export const iqwigOutTemplate: GraphicTemplate = {
  id: "iqwig-out",
  name: "IQWiG Bewertung",
  description: "Timeline-orientierte Slide für veröffentlichte IQWiG-Bewertungen.",
  category: "business",
  supportedPresetIds: ["1080x1080", "1080x1350", "1200x627"],
  rawHtmlPlaceholders: ["groupsHtml"],
  htmlTemplate: `
    <div class="slide">
      <div class="grid"></div>
      <div class="glow glow--blue-tr"></div>
      <div class="accent-stripe accent-stripe--blue"></div>
      <div class="topbar topbar--blue"></div>

      <div class="tag">
        <div class="tag-dot tag-dot--blue"></div>
        <span class="tag-text tag-text--blue">{{tagText}}</span>
      </div>

      <div class="badge badge--blue">{{badgeText}}</div>

      <div class="s3-drug">{{drugName}}<br>{{indicationTitle}}</div>
      <div class="s3-rule"><div class="rule rule--blue"></div></div>
      <div class="s3-indication">{{indicationLine}}</div>

      <div class="s3-timeline">
        <div class="s3-tl-item">
          <div class="s3-tl-dot s3-tl-dot--filled"></div>
          <div>
            <div class="s3-tl-label">{{timeline1Label}}</div>
            <div class="s3-tl-value">{{timeline1Value}}</div>
          </div>
        </div>

        <div class="s3-tl-item">
          <div class="s3-tl-dot s3-tl-dot--open"></div>
          <div>
            <div class="s3-tl-label">{{timeline2Label}}</div>
            <div class="s3-tl-value">{{timeline2Value}}</div>
          </div>
        </div>

        <div class="s3-tl-item">
          <div class="s3-tl-dot s3-tl-dot--open"></div>
          <div>
            <div class="s3-tl-label">{{timeline3Label}}</div>
            <div class="s3-assessment">
              {{groupsHtml}}
            </div>
          </div>
        </div>
      </div>

      <div class="bottom bottom--blue">
        <div class="publisher">{{publisher}}</div>
        <div class="brand">{{brand}}</div>
      </div>
    </div>
  `,
  css: `
    ${sharedBaseCss}

    .topbar--blue {
      background: linear-gradient(90deg, #60a5fa 0%, rgba(96,165,250,0.2) 60%, transparent 100%);
    }

    .accent-stripe--blue {
      background: linear-gradient(to bottom, transparent, #60a5fa, transparent);
    }

    .tag-dot--blue {
      background: #60a5fa;
      box-shadow: 0 0 10px rgba(96,165,250,0.6);
    }

    .tag-text--blue {
      color: rgba(96,165,250,0.75);
    }

    .rule--blue { background: #60a5fa; }

    .bottom--blue { border-top-color: rgba(96,165,250,0.12); }

    .s3-drug {
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

    .s3-rule { position: absolute; top: 390px; left: 72px; z-index: 5; }

    .s3-indication {
      position: absolute;
      top: 412px; left: 72px; right: 72px; z-index: 5;
      font-family: 'DM Sans', sans-serif;
      font-size: 26px; font-weight: 300; color: var(--text-mid); line-height: 1.4;
    }

    .s3-timeline {
      position: absolute;
      top: 530px; left: 72px; right: 72px; z-index: 5;
      display: flex; flex-direction: column; gap: 0;
    }

    .s3-tl-item {
      display: flex; align-items: flex-start; gap: 22px;
      padding: 22px 0; border-bottom: 1px solid var(--border-sub);
    }

    .s3-tl-item:last-child { border-bottom: none; }

    .s3-tl-dot {
      width: 12px; height: 12px; border-radius: 50%;
      flex-shrink: 0; margin-top: 5px;
    }

    .s3-tl-dot--filled { background: #60a5fa; box-shadow: 0 0 8px rgba(96,165,250,0.5); }
    .s3-tl-dot--open   { background: transparent; border: 2px solid rgba(96,165,250,0.3); }

    .s3-tl-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
      color: rgba(96,165,250,0.5); margin-bottom: 5px;
      font-variant-numeric: tabular-nums;
    }

    .s3-tl-value {
      font-family: 'DM Sans', sans-serif;
      font-size: 22px; font-weight: 500; color: var(--text); line-height: 1.35;
      font-variant-numeric: tabular-nums;
    }

    .s3-assessment {
      display: grid;
      gap: 16px;
    }

    .s3-assessment-row {
      display: flex;
      align-items: flex-start;
      gap: 14px;
    }

    .s3-pill {
      display: inline-block;
      border-radius: 4px;
      padding: 3px 10px;
      font-family: 'DM Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
      margin-top: 3px;
      line-height: 1.4;
    }

    .s3-pill--positive { background: rgba(52,211,153,0.18); color: #34d399; }
    .s3-pill--caution { background: rgba(232,184,75,0.18); color: #e8b84b; }
    .s3-pill--negative { background: rgba(239,68,68,0.14); color: #f87171; }
    .s3-pill--orphan { background: rgba(139,92,246,0.15); color: #a78bfa; }
    .s3-pill--neutral { background: rgba(148,163,184,0.15); color: #94a3b8; }

    .s3-tl-value--muted {
      font-size: 20px; color: rgba(203,213,225,0.7); line-height: 1.45;
    }

    .s3-tl-value--assessment {
      font-size: 20px; font-weight: 400; color: var(--text); line-height: 1.45;
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
      helpText: "Nur nutzen, wenn die gewünschte Formulierung nicht als Preset verfügbar ist.",
    },
    { id: "timeline1Label", label: "Timeline 1 Label", type: "text" },
    { id: "timeline1Value", label: "Timeline 1 Datum", type: "date" },
    { id: "timeline2Label", label: "Timeline 2 Label", type: "text" },
    { id: "timeline2Value", label: "Timeline 2 Datum", type: "date" },
    { id: "timeline3Label", label: "Timeline 3 Label", type: "text" },
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
    { id: "publisher", label: "Publisher", type: "text" },
    { id: "brand", label: "Brand", type: "text" }
  ],
  defaults: {
    tagText: "IQWiG-Bewertung veröffentlicht · §35a SGB V",
    badgeText: "IQWiG out",
    drugName: "Wirkstoff",
    indicationArea: "Onkologie",
    indicationPreset: "NSCLC",
    indicationCustom: "",
    timeline1Label: "IQWiG veröffentlicht",
    timeline1Value: "2026-05-18",
    timeline2Label: "Stellungnahme bis",
    timeline2Value: "2026-06-10",
    timeline3Label: "IQWiG Einschätzung",
    "groups.0.population": "Gruppe 1",
    "groups.0.benefitMode": "standard",
    "groups.0.evidenceLevel": "Anhaltspunkt",
    "groups.0.benefitExtent": "geringer Zusatznutzen",
    "groups.0.description": "",
    publisher: "Hans Hirsch · co.faktor",
    brand: "G-BA <em>Digest</em>"
  },
  resolveFieldValues: (fieldValues) => ({
    ...fieldValues,
    ...buildIndicationFields(fieldValues),
    groupsHtml: buildOutcomeGroupsHtml(fieldValues, (group) => `
      <div class="s3-assessment-row">
        <span class="s3-pill s3-pill--${group.pillTone}">${escapeTemplateHtml(group.tag)}</span>
        <div class="s3-tl-value s3-tl-value--assessment">${escapeTemplateHtml(group.text)}</div>
      </div>
    `),
  }),
};
