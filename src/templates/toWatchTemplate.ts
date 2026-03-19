import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';
import { INDICATION_AREAS, INDICATION_PRESETS_BY_AREA } from '../utils/indicationPresets';
import { buildIndicationFields } from '../utils/templateContent';

export const toWatchTemplate: GraphicTemplate = {
  id: "to-watch",
  name: "To Watch",
  description: "Frühe Verfahrensübersicht für angekündigte oder gestartete Bewertungen.",
  supportedPresetIds: ["1080x1080", "1080x1350", "1200x627"],
  htmlTemplate: `
    <div class="slide">
      <div class="grid"></div>
      <div class="glow glow--tl"></div>
      <div class="glow glow--green-bl"></div>
      <div class="accent-stripe"></div>
      <div class="topbar topbar--green"></div>

      <div class="tag">
        <div class="tag-dot tag-dot--green"></div>
        <span class="tag-text tag-text--green">{{tagText}}</span>
      </div>

      <div class="badge badge--green">{{badgeText}}</div>

      <div class="s1-eyebrow">{{eyebrow}}</div>
      <div class="s1-drug">{{drugName}}<br>{{indicationTitle}}</div>

      <div class="s1-rule"><div class="rule rule--green"></div></div>
      <div class="s1-indication">{{indicationLine}}</div>

      <div class="s1-zvt">
        <div class="s1-zvt-label">{{zvtLabel}}</div>
        <div class="s1-zvt-text">{{zvtText}}</div>
      </div>

      <div class="s1-fristen">
        <div>
          <div class="s1-frist-label">{{date1Label}}</div>
          <div class="s1-frist-value">{{date1Value}}</div>
        </div>
        <div>
          <div class="s1-frist-label">{{date2Label}}</div>
          <div class="s1-frist-value">{{date2Value}}</div>
        </div>
      </div>

      <div class="bottom">
        <div class="publisher">{{publisher}}</div>
        <div class="brand">{{brand}}</div>
      </div>
    </div>
  `,
  css: `
    ${sharedBaseCss}

    .topbar--green {
      background: linear-gradient(90deg, #34d399 0%, rgba(52,211,153,0.2) 60%, transparent 100%);
    }

    .tag-dot--green {
      background: #34d399;
      box-shadow: 0 0 10px rgba(52,211,153,0.6);
    }

    .tag-text--green {
      color: rgba(52,211,153,0.75);
    }

    .rule--green { background: #34d399; }

    .s1-eyebrow {
      position: absolute;
      top: 128px; left: 72px; z-index: 5;
      font-size: 18px; font-weight: 300; letter-spacing: 1px;
      color: rgba(52,211,153,0.65);
    }

    .s1-drug {
      position: absolute;
      top: 164px; left: 72px; right: 72px; z-index: 5;
      font-family: 'Instrument Serif', serif;
      font-size: 96px; line-height: 0.95;
      color: #fff; letter-spacing: -2px;
    }

    .s1-rule { position: absolute; top: 430px; left: 72px; z-index: 5; }

    .s1-indication {
      position: absolute;
      top: 452px; left: 72px; right: 72px; z-index: 5;
      font-family: 'DM Sans', sans-serif;
      font-size: 26px; font-weight: 300;
      color: var(--text-mid); line-height: 1.4;
    }

    .s1-zvt {
      position: absolute;
      top: 570px; left: 72px; right: 72px; z-index: 5;
      border-left: 3px solid rgba(52,211,153,0.5);
      padding: 24px 28px;
      background: rgba(52,211,153,0.04);
      border-radius: 0 8px 8px 0;
    }

    .s1-zvt-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; font-weight: 600;
      letter-spacing: 2.5px; text-transform: uppercase;
      color: rgba(52,211,153,0.5); margin-bottom: 10px;
      font-variant-numeric: tabular-nums;
    }

    .s1-zvt-text {
      font-family: 'DM Sans', sans-serif;
      font-size: 22px; font-weight: 300;
      color: rgba(203,213,225,0.75); line-height: 1.5;
      font-variant-numeric: tabular-nums;
    }

    .s1-fristen {
      position: absolute;
      top: 800px; left: 72px; right: 72px; z-index: 5;
      display: flex; gap: 56px;
    }

    .s1-frist-label {
      font-family: 'DM Sans', sans-serif;
      font-size: 10px; letter-spacing: 2px;
      text-transform: uppercase; color: rgba(52,211,153,0.5);
      margin-bottom: 6px;
      font-variant-numeric: tabular-nums;
    }

    .s1-frist-value {
      font-family: 'DM Sans', sans-serif;
      font-size: 22px; font-weight: 500; color: var(--text);
      font-variant-numeric: tabular-nums;
    }
  `,
  fields: [
    { id: "tagText", label: "Tag", type: "text" },
    { id: "badgeText", label: "Badge", type: "text" },
    { id: "eyebrow", label: "Eyebrow", type: "text" },
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
      helpText: "Nur nutzen, wenn die gewünschte G-BA-Formulierung nicht als Preset vorhanden ist.",
    },
    { id: "zvtLabel", label: "ZVT Label", type: "text" },
    { id: "zvtText", label: "ZVT Text", type: "textarea", multiline: true },
    { id: "date1Label", label: "Datum 1 Label", type: "text" },
    { id: "date1Value", label: "Datum 1", type: "date" },
    { id: "date2Label", label: "Datum 2 Label", type: "text" },
    { id: "date2Value", label: "Datum 2", type: "date" },
    { id: "publisher", label: "Publisher", type: "text" },
    { id: "brand", label: "Brand", type: "text" }
  ],
  defaults: {
    tagText: "Verfahren gestartet · §35a SGB V",
    badgeText: "To watch",
    eyebrow: "To watch:",
    drugName: "Wirkstoff",
    indicationArea: "Onkologie",
    indicationPreset: "NSCLC",
    indicationCustom: "",
    zvtLabel: "Zweckmäßige Vergleichstherapie",
    zvtText: "Option A; Option B; ggf. Option C (populationsabhängig)",
    date1Label: "IQWiG vsl.",
    date1Value: "2026-04-30",
    date2Label: "Stellungnahme bis",
    date2Value: "2026-05-22",
    publisher: "Hans Hirsch · co.faktor",
    brand: "G-BA <em>Digest</em>"
  },
  resolveFieldValues: (fieldValues) => ({
    ...fieldValues,
    ...buildIndicationFields(fieldValues),
  }),
};
