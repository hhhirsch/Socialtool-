import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';

export const generalPostTemplate: GraphicTemplate = {
  id: "general-post",
  name: "Allgemeiner Beitrag",
  description: "Meinungs- oder Einordnungsformat mit Titel, Body und Pull-Quote.",
  supportedPresetIds: ["1080x1080", "1080x1350", "1200x627"],
  htmlTemplate: `
    <div class="slide preset-{{presetId}}">
      <div class="grid"></div>
      <div class="glow glow--tl"></div>
      <div class="accent-stripe"></div>
      <div class="topbar"></div>
      <div class="s5-panel"></div>

      <div class="tag">
        <div class="tag-dot"></div>
        <span class="tag-text">{{tagText}}</span>
      </div>

      <div class="badge badge--slate">{{badgeText}}</div>

      <div class="s5-topic">
        <span class="s5-topic-pill">{{topic}}</span>
      </div>

      <div class="s5-title">{{titleLine1}}<br>{{titleLine2}} <em>{{highlight}}</em></div>
      <div class="s5-rule"><div class="rule"></div></div>
      <div class="s5-body">{{bodyText}}</div>

      <div class="s5-quote">
        <span class="s5-quote-mark">"</span>
        <div class="s5-quote-text">{{quoteText}}</div>
      </div>

      <div class="bottom">
        <div class="publisher">{{publisher}}</div>
        <div class="brand">{{brand}}</div>
      </div>
    </div>
  `,
  css: `
    ${sharedBaseCss}

    .s5-topic {
      position: absolute;
      top: 128px; left: 72px; z-index: 5;
      display: inline-flex; align-items: center; gap: 10px;
    }

    .s5-topic-pill {
      background: rgba(148,163,184,0.1);
      border: 1px solid rgba(148,163,184,0.25);
      border-radius: 30px;
      padding: 5px 16px;
      font-size: 11px; font-weight: 500;
      letter-spacing: 2px; text-transform: uppercase;
      color: rgba(203,213,225,0.6);
    }

    .s5-title {
      position: absolute;
      top: 200px; left: 72px; right: 72px; z-index: 5;
      background: none;
      border: none;
      border-radius: 0;
      box-shadow: none;
      padding: 0;
      font-family: 'Instrument Serif', serif;
      font-size: 88px; line-height: 1.05;
      color: var(--text); letter-spacing: -2px;
    }

    .s5-title em { font-style: italic; color: var(--gold); }

    .s5-rule { position: absolute; top: 550px; left: 72px; z-index: 5; }

    .s5-body {
      position: absolute;
      top: 576px; left: 72px; right: 72px; z-index: 5;
      font-size: 26px; font-weight: 300;
      color: rgba(203,213,225,0.65); line-height: 1.65;
    }

    .s5-panel {
      position: absolute;
      top: 0; right: 0; bottom: 0;
      width: 420px; z-index: 2;
      background: #131f35;
      clip-path: polygon(15% 0, 100% 0, 100% 100%, 0% 100%);
    }

    .s5-quote {
      position: absolute;
      right: 48px; top: 50%;
      transform: translateY(-50%);
      width: 320px; z-index: 5; text-align: center;
    }

    .s5-quote-mark {
      font-family: 'Instrument Serif', serif;
      font-size: 120px; line-height: 0.7;
      color: rgba(232,184,75,0.12);
      margin-bottom: 16px; display: block;
    }

    .s5-quote-text {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      font-size: 32px; line-height: 1.45;
      color: rgba(232,184,75,0.75);
      letter-spacing: -0.5px;
    }

    .preset-1200x627 .s5-topic {
      top: 76px;
      left: 48px;
    }

    .preset-1200x627 .s5-title {
      top: 130px;
      left: 48px;
      right: 320px;
      font-size: 58px;
      line-height: 1.02;
      letter-spacing: -1.2px;
    }

    .preset-1200x627 .s5-rule {
      top: 360px;
      left: 48px;
    }

    .preset-1200x627 .s5-body {
      top: 385px;
      left: 48px;
      right: 320px;
      font-size: 18px;
      line-height: 1.45;
      max-width: 540px;
    }

    .preset-1200x627 .s5-body:empty {
      display: none;
    }

    .preset-1200x627 .s5-panel {
      width: 290px;
    }

    .preset-1200x627 .s5-quote {
      right: 28px;
      width: 210px;
      top: 52%;
    }

    .preset-1200x627 .s5-quote-mark {
      font-size: 70px;
      margin-bottom: 8px;
    }

    .preset-1200x627 .s5-quote-text {
      font-size: 16px;
      line-height: 1.4;
      letter-spacing: -0.2px;
    }

    .preset-1200x627 .bottom {
      left: 48px;
      right: 48px;
      bottom: 36px;
    }

    .preset-1200x627 .publisher {
      font-size: 11px;
    }

    .preset-1200x627 .brand {
      font-size: 16px;
    }
  `,
  fields: [
    { id: "tagText", label: "Tag", type: "text" },
    { id: "badgeText", label: "Badge", type: "text" },
    { id: "topic", label: "Themenbereich", type: "text" },
    { id: "titleLine1", label: "Titel Zeile 1", type: "text" },
    { id: "titleLine2", label: "Titel Zeile 2", type: "text" },
    { id: "highlight", label: "Highlight", type: "text" },
    { id: "bodyText", label: "Body", type: "textarea", multiline: true },
    { id: "quoteText", label: "Pull Quote", type: "textarea", multiline: true },
    { id: "publisher", label: "Publisher", type: "text" },
    { id: "brand", label: "Brand", type: "text" }
  ],
  defaults: {
    tagText: "§35a · AMNOG · Market Access",
    badgeText: "Meinung",
    topic: "Themenbereich",
    titleLine1: "Hauptaussage",
    titleLine2: "des",
    highlight: "Beitrags",
    bodyText: "Kurze Einleitung oder erste These des Beitrags. Was ist der Standpunkt?",
    quoteText: "Pull-Quote aus dem Post - der eine Satz, der hängen bleibt.",
    publisher: "Hans Hirsch · co.faktor",
    brand: "G-BA <em>Digest</em>"
  }
};