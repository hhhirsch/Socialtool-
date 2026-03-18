import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';

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
          <span class="s2-pill s2-pill--pos">{{outcome1Tag}}</span>
          <span class="s2-outcome-text">{{outcome1Text}}</span>
        </div>

        <div class="s2-outcome-row">
          <span class="s2-pill s2-pill--neg">{{outcome2Tag}}</span>
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
      font-size: 10px; font-weight: 600; letter-spacing: 2.5px;
      text-transform: uppercase; color: var(--gold-dim); margin-bottom: 14px;
    }

    .s2-outcome-row {
      display: flex; align-items: flex-start; gap: 14px; margin-bottom: 12px;
    }

    .s2-outcome-row:last-child { margin-bottom: 0; }

    .s2-pill {
      display: inline-block;
      border-radius: 4px;
      padding: 3px 10px;
      white-space: nowrap;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 1px;
      text-transform: uppercase;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .s2-pill--pos  { background: rgba(52,211,153,0.15); color: #34d399; }
    .s2-pill--neg  { background: rgba(239,68,68,0.12); color: #f87171; }

    .s2-outcome-text {
      font-size: 20px; font-weight: 400; color: var(--text); line-height: 1.4;
    }

    .s2-zvt {
      position: absolute;
      top: 840px; left: 72px; right: 72px; z-index: 5;
      display: flex; align-items: baseline; gap: 12px;
    }

    .s2-zvt-label {
      font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase;
      color: var(--gold-dim); white-space: nowrap;
    }

    .s2-zvt-text {
      font-size: 16px; font-weight: 300; color: var(--text-soft);
    }
  `,
  fields: [
    { id: "tagText", label: "Tag", type: "text" },
    { id: "badgeText", label: "Badge", type: "text" },
    { id: "drugName", label: "Wirkstoff", type: "text" },
    { id: "indicationTitle", label: "Indikation Titel", type: "text" },
    { id: "indicationLine", label: "Indikationszeile", type: "textarea", multiline: true },
    { id: "outcomeLabel", label: "Outcome Label", type: "text" },
    { id: "outcome1Tag", label: "Outcome 1 Tag", type: "text" },
    { id: "outcome1Text", label: "Outcome 1 Text", type: "textarea", multiline: true },
    { id: "outcome2Tag", label: "Outcome 2 Tag", type: "text" },
    { id: "outcome2Text", label: "Outcome 2 Text", type: "textarea", multiline: true },
    { id: "zvtShortLabel", label: "Kurzlabel ZVT", type: "text" },
    { id: "zvtText", label: "ZVT Text", type: "textarea", multiline: true },
    { id: "publisher", label: "Publisher", type: "text" },
    { id: "brand", label: "Brand", type: "text" }
  ],
  defaults: {
    tagText: "G-BA Beschluss · §35a SGB V",
    badgeText: "Decision out",
    drugName: "Wirkstoff",
    indicationTitle: "- Indikation",
    indicationLine: "Therapiegebiet · Setting · Population",
    outcomeLabel: "G-BA Bewertung",
    outcome1Tag: "Beträchtlich",
    outcome1Text: "Subgruppe A: Anhaltspunkt für beträchtlichen Zusatznutzen",
    outcome2Tag: "Nicht belegt",
    outcome2Text: "Subgruppe B: Zusatznutzen nicht belegt",
    zvtShortLabel: "zVT",
    zvtText: "Vergleichstherapie A oder Vergleichstherapie B (populationsabhängig)",
    publisher: "Hans Hirsch · co.faktor",
    brand: "G-BA <em>Digest</em>"
  }
};
