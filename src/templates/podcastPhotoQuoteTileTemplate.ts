import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';
import { escapeTemplateHtml } from '../utils/templateContent';

const photoPositionXPresets: Record<string, number> = {
  links: 30,
  mitte: 50,
  rechts: 70,
};

const photoPositionYPresets: Record<string, number> = {
  oben: 15,
  mitte: 35,
  unten: 60,
};

const overlayPresets: Record<string, number> = {
  leicht: 45,
  mittel: 65,
  stark: 85,
};

export const podcastPhotoQuoteTileTemplate: GraphicTemplate = {
  id: 'business-photo-quote-tile',
  name: 'Business · Foto-Zitatekachel',
  description: 'Quadratische Business-Kachel mit Foto, Overlay und Executive Quote im Gold/Navy-System.',
  category: 'business',
  supportedPresetIds: ['1080x1080'],
  htmlTemplate: `
    <div class="slide">
      <div class="tile-photo" style="{{photoStyle}}"></div>
      <div class="tile-overlay" style="{{overlayStyle}}"></div>
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

      <div class="tile-content">
        <div class="tile-quote-mark">&bdquo;</div>
        <div class="tile-quote">{{quoteHtml}}</div>
      </div>

      <div class="bottom">
        <div class="tile-meta">
          <div class="tile-name">{{personName}}</div>
          <div class="tile-role">{{personRole}}</div>
          <div class="tile-context">{{personContext}}</div>
        </div>
        <div class="brand">{{brand}}</div>
      </div>
    </div>
  `,
  css: `
    ${sharedBaseCss}

    .slide {
      background: var(--bg);
    }

    .tile-photo,
    .tile-overlay,
    .tile-content {
      position: absolute;
      inset: 0;
    }

    .tile-photo {
      z-index: 1;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center top;
      filter: saturate(0.82) contrast(1.04) brightness(0.82);
    }

    .tile-overlay {
      z-index: 2;
      background:
        linear-gradient(
          180deg,
          rgba(15, 23, 42, 0.18) 0%,
          rgba(15, 23, 42, 0.32) 26%,
          rgba(15, 23, 42, 0.6) 52%,
          rgba(15, 23, 42, 0.82) 72%,
          rgba(15, 23, 42, 0.96) 100%
        );
    }

    .tile-overlay::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(232,184,75,0.08) 0%, transparent 22%),
        radial-gradient(circle at top right, rgba(232,184,75,0.08) 0%, transparent 42%);
    }

    .tile-content {
      z-index: 5;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 220px 96px 240px 96px;
    }

    .tile-quote-mark {
      font-family: 'Instrument Serif', serif;
      font-size: 118px;
      line-height: 0.7;
      color: rgba(232,184,75,0.22);
      margin-bottom: 18px;
      user-select: none;
    }

    .tile-quote {
      max-width: 820px;
      font-family: 'Instrument Serif', serif;
      font-size: 68px;
      line-height: 1.06;
      letter-spacing: -1.6px;
      color: #fff;
      text-wrap: balance;
      text-shadow: 0 10px 30px rgba(15,23,42,0.42);
    }

    .tile-quote em {
      color: var(--gold);
      font-style: italic;
    }

    .tile-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
      max-width: 620px;
    }

    .tile-name {
      font-size: 24px;
      font-weight: 600;
      line-height: 1.2;
      color: #fff;
    }

    .tile-role,
    .tile-context {
      font-size: 15px;
      line-height: 1.45;
    }

    .tile-role {
      font-weight: 500;
      color: var(--text);
    }

    .tile-context {
      font-weight: 400;
      color: var(--text-soft);
    }
  `,
  fields: [
    {
      id: 'photoSrc',
      label: 'Foto',
      type: 'image',
      helpText: 'Am besten funktioniert ein Porträt oder Executive-Foto mit klarer Hauptperson.',
    },
    {
      id: 'photoPositionXPreset',
      label: 'Bildausschnitt horizontal',
      type: 'select',
      options: [
        { label: 'Links', value: 'links' },
        { label: 'Mitte', value: 'mitte' },
        { label: 'Rechts', value: 'rechts' },
      ],
    },
    {
      id: 'photoPositionYPreset',
      label: 'Bildausschnitt vertikal',
      type: 'select',
      options: [
        { label: 'Oben', value: 'oben' },
        { label: 'Mitte', value: 'mitte' },
        { label: 'Unten', value: 'unten' },
      ],
    },
    {
      id: 'overlayPreset',
      label: 'Overlay-Intensität',
      type: 'select',
      options: [
        { label: 'Leicht', value: 'leicht' },
        { label: 'Mittel', value: 'mittel' },
        { label: 'Stark', value: 'stark' },
      ],
    },
    { id: 'tagText', label: 'Kicker', type: 'text' },
    { id: 'badgeText', label: 'Badge', type: 'text' },
    { id: 'quote', label: 'Zitat', type: 'textarea', multiline: true },
    { id: 'personName', label: 'Name', type: 'text' },
    { id: 'personRole', label: 'Rolle', type: 'text' },
    { id: 'personContext', label: 'Kontext', type: 'text' },
    { id: 'brand', label: 'Brand', type: 'text' },
  ],
  defaults: {
    photoSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    photoPositionXPreset: 'mitte',
    photoPositionYPreset: 'oben',
    overlayPreset: 'mittel',
    tagText: 'Executive insight · Business',
    badgeText: 'Quote',
    quote: 'Strategie wird dann relevant, wenn sie komplexe Entscheidungen *klar und handlungsfähig* macht.',
    personName: 'Max Mustermann',
    personRole: 'Managing Director · Health & Market Access',
    personContext: 'Interview · Business Insight',
    brand: 'G-BA Digest',
  },
  resolveFieldValues: (values) => {
    const rawQuote = String(values.quote ?? '').trim();
    const quoteHtml = escapeTemplateHtml(rawQuote).replace(/\*([^*]+)\*/g, '<em>$1</em>');

    const posX =
      photoPositionXPresets[values.photoPositionXPreset ?? ''] ??
      Math.min(100, Math.max(0, Number(values.photoPositionX ?? 50)));
    const posY =
      photoPositionYPresets[values.photoPositionYPreset ?? ''] ??
      Math.min(100, Math.max(0, Number(values.photoPositionY ?? 15)));
    const overlayStrength =
      overlayPresets[values.overlayPreset ?? ''] ??
      Math.min(100, Math.max(30, Number(values.overlayStrength ?? 65)));
    const overlay = overlayStrength / 100;

    const overlayStyle = `background:
      linear-gradient(
        180deg,
        rgba(15, 23, 42, ${0.12 + 0.12 * overlay}) 0%,
        rgba(15, 23, 42, ${0.2 + 0.22 * overlay}) 24%,
        rgba(15, 23, 42, ${0.34 + 0.38 * overlay}) 50%,
        rgba(15, 23, 42, ${0.55 + 0.34 * overlay}) 72%,
        rgba(15, 23, 42, ${0.74 + 0.22 * overlay}) 100%
      );`;

    const photoSrc = String(values.photoSrc ?? '').trim();
    const safePhotoSrc = photoSrc
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\r?\n/g, '');
    const photoStyle = safePhotoSrc
      ? `background-image: url('${safePhotoSrc}'); background-position: ${posX}% ${posY}%;`
      : `background-image: none; background-position: ${posX}% ${posY}%;`;

    return {
      ...values,
      quoteHtml,
      photoStyle,
      overlayStyle,
    };
  },
  rawHtmlPlaceholders: ['quoteHtml', 'photoStyle', 'overlayStyle'],
};
