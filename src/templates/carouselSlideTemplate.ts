import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';

export const carouselSlideTemplate: GraphicTemplate = {
  id: "carousel-slide",
  name: "Carousel Slide",
  description: "These-Slide für Serienposts und vertikale LinkedIn-Carousels.",
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

      <div class="s4-counter"><strong>{{slideNumber}}</strong> / {{slideTotal}}</div>

      <div class="s4-these">
        <span class="s4-these-num">{{thesisLabel}}</span>
        <span class="s4-these-of">von {{slideTotal}}</span>
      </div>

      <div class="s4-title">{{titleLine1}}<br><em>{{highlight}}</em> {{titleLine2}}</div>
      <div class="s4-subline">{{subline}}</div>

      <div class="watermark watermark--paragraph">§</div>

      <div class="bottom">
        <div class="publisher">{{publisher}}</div>
        <div class="brand">{{brand}}</div>
      </div>
    </div>
  `,
  css: `
    ${sharedBaseCss}

    .s4-counter {
      position: absolute;
      top: 56px; right: 72px; z-index: 5;
      font-size: 12px; letter-spacing: 2px;
      color: rgba(232,184,75,0.4); text-transform: uppercase;
    }

    .s4-counter strong {
      color: var(--gold-dim);
      font-weight: 600;
      font-size: 15px;
    }

    .s4-these {
      position: absolute;
      top: 128px; left: 72px; z-index: 5;
      display: inline-flex; align-items: center; gap: 10px;
    }

    .s4-these-num {
      background: var(--gold);
      color: var(--bg);
      font-size: 11px; font-weight: 600;
      letter-spacing: 2px; text-transform: uppercase;
      padding: 5px 14px; border-radius: 3px;
    }

    .s4-these-of {
      font-size: 12px; letter-spacing: 1.5px;
      color: var(--text-soft); text-transform: uppercase;
    }

    .s4-title {
      position: absolute;
      top: 210px; left: 72px; right: 72px; z-index: 5;
      font-family: 'Instrument Serif', serif;
      font-size: 80px; line-height: 1.1;
      color: var(--text); letter-spacing: -1px;
    }

    .s4-title em { font-style: italic; color: var(--gold); }

    .s4-subline {
      position: absolute;
      top: 700px; left: 72px; right: 72px; z-index: 5;
      font-size: 24px; font-weight: 300;
      color: rgba(203,213,225,0.6); line-height: 1.6;
      padding-top: 28px;
      border-top: 1px solid rgba(232,184,75,0.2);
    }

    .watermark--paragraph {
      font-size: 380px;
      right: -40px;
      bottom: -60px;
      opacity: 1;
    }
  `,
  fields: [
    { id: "tagText", label: "Tag", type: "text" },
    { id: "slideNumber", label: "Slide Nummer", type: "text" },
    { id: "slideTotal", label: "Gesamtanzahl Slides", type: "text" },
    { id: "thesisLabel", label: "These Label", type: "text" },
    { id: "titleLine1", label: "Titel Teil 1", type: "textarea", multiline: true },
    { id: "highlight", label: "Highlight", type: "text" },
    { id: "titleLine2", label: "Titel Teil 2", type: "text" },
    { id: "subline", label: "Subline", type: "textarea", multiline: true },
    { id: "publisher", label: "Publisher", type: "text" },
    { id: "brand", label: "Brand", type: "text" }
  ],
  defaults: {
    tagText: "§35a · AMNOG · Market Access",
    slideNumber: "01",
    slideTotal: "05",
    thesisLabel: "These 1",
    titleLine1: "Titel der These -",
    highlight: "Keyword",
    titleLine2: "im Fokus",
    subline: "Erläuternder Satz zur These. Was bedeutet das für die Praxis? Was ist der methodische Kern?",
    publisher: "Hans Hirsch · co.faktor",
    brand: "G-BA <em>Digest</em>"
  }
};
