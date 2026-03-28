import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';

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

export const businessPhotoQuoteTileTemplate: GraphicTemplate = {
  id: 'business-photo-quote-tile',
  name: 'Business · Foto-Zitatekachel',
  description: 'Quadratische Business-Kachel mit Foto, Zitat und Gold/Navy-System.',
  category: 'business',
  supportedPresetIds: ['1080x1080'],
  htmlTemplate: `
    <div class="slide">
      <div class="grid"></div>
      <div class="glow glow--tl"></div>
      <div class="glow glow--br"></div>
      <div class="accent-stripe"></div>
      <div class="topbar"></div>

      <div class="tag">
        <div class="tag-dot"></div>
        <span class="tag-text">{{tagTextHtml}}</span>
      </div>

      <div class="badge badge--gold">{{badgeTextHtml}}</div>

      <div class="bpqt-photo-shell">
        <div class="bpqt-photo" style="{{photoStyle}}"></div>
        <div class="bpqt-photo-overlay" style="{{overlayStyle}}"></div>
        <div class="bpqt-photo-label">{{personRoleHtml}}</div>
      </div>

      <div class="bpqt-quote-mark">&bdquo;</div>
      <div class="bpqt-quote">{{quoteHtml}}</div>

      <div class="bpqt-person-card">
        <div class="bpqt-person-name">{{personNameHtml}}</div>
        <div class="bpqt-person-context">{{personContextHtml}}</div>
      </div>

      <div class="bottom bpqt-bottom">
        <div class="brand">{{brand}}</div>
      </div>
    </div>
  `,
  css: `
    ${sharedBaseCss}

    .bpqt-photo-shell {
      position: absolute;
      top: 132px;
      right: 72px;
      width: 392px;
      height: 640px;
      z-index: 4;
      overflow: hidden;
      border-radius: 28px;
      border: 1px solid var(--gold-border);
      background: linear-gradient(180deg, rgba(19,31,53,0.9), rgba(15,23,42,0.95));
      box-shadow:
        0 30px 80px rgba(2,6,23,0.45),
        inset 0 0 0 1px rgba(255,255,255,0.03);
    }

    .bpqt-photo-shell::before {
      content: '';
      position: absolute;
      inset: 18px;
      border-radius: 20px;
      border: 1px solid rgba(232,184,75,0.2);
      z-index: 3;
      pointer-events: none;
    }

    .bpqt-photo {
      position: absolute;
      inset: 0;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center top;
      z-index: 1;
    }

    .bpqt-photo-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      background:
        linear-gradient(
          180deg,
          rgba(15,23,42,0.12) 0%,
          rgba(15,23,42,0.35) 30%,
          rgba(15,23,42,0.82) 68%,
          rgba(15,23,42,0.96) 100%
        );
    }

    .bpqt-photo-overlay::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        linear-gradient(135deg, rgba(232,184,75,0.2) 0%, rgba(232,184,75,0.04) 26%, transparent 56%),
        linear-gradient(180deg, transparent 48%, rgba(15,23,42,0.18) 100%);
    }

    .bpqt-photo-label {
      position: absolute;
      left: 32px;
      right: 32px;
      bottom: 34px;
      z-index: 4;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 40px;
      padding: 10px 18px;
      border-radius: 999px;
      border: 1px solid rgba(232,184,75,0.35);
      background: rgba(15,23,42,0.72);
      color: var(--gold);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-align: center;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .bpqt-quote-mark {
      position: absolute;
      top: 232px;
      left: 72px;
      z-index: 5;
      font-family: 'Instrument Serif', serif;
      font-size: 128px;
      line-height: 0.6;
      color: rgba(232,184,75,0.18);
      user-select: none;
    }

    .bpqt-quote {
      position: absolute;
      top: 292px;
      left: 72px;
      width: 500px;
      z-index: 5;
      font-family: 'Instrument Serif', serif;
      font-size: 56px;
      font-weight: 400;
      line-height: 1.08;
      letter-spacing: -1.4px;
      color: var(--text);
      text-wrap: balance;
    }

    .bpqt-quote em {
      color: var(--gold);
      font-style: italic;
      font-weight: 400;
    }

    .bpqt-person-card {
      position: absolute;
      left: 72px;
      right: 468px;
      bottom: 170px;
      z-index: 5;
      padding: 26px 28px;
      border-radius: 24px;
      border: 1px solid var(--gold-border);
      background: linear-gradient(180deg, rgba(19,31,53,0.92), rgba(15,23,42,0.98));
      box-shadow: 0 20px 50px rgba(2,6,23,0.28);
    }

    .bpqt-person-name {
      font-family: 'Instrument Serif', serif;
      font-size: 34px;
      line-height: 1.05;
      letter-spacing: -0.7px;
      color: #ffffff;
    }

    .bpqt-person-context {
      margin-top: 10px;
      font-size: 16px;
      line-height: 1.45;
      color: var(--text-soft);
    }

    .bpqt-bottom {
      justify-content: flex-end;
    }
  `,
  fields: [
    {
      id: 'photoSrc',
      label: 'Foto',
      type: 'image',
      helpText: 'Am besten funktioniert ein Porträtfoto mit klarem Fokus auf der Person.',
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
    { id: 'tagText', label: 'Tag', type: 'text' },
    { id: 'badgeText', label: 'Badge', type: 'text' },
    { id: 'quote', label: 'Zitat', type: 'textarea', multiline: true },
    { id: 'personName', label: 'Name', type: 'text' },
    { id: 'personRole', label: 'Rolle', type: 'text' },
    { id: 'personContext', label: 'Kontext', type: 'textarea', multiline: true },
    { id: 'brand', label: 'Brand', type: 'text' },
  ],
  defaults: {
    photoSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
    photoPositionXPreset: 'mitte',
    photoPositionYPreset: 'oben',
    overlayPreset: 'mittel',
    tagText: 'Leadership · Strategie · Kommunikation',
    badgeText: 'Business Insight',
    quote: 'Klare Positionierung ist kein *Marketing-Finish*, sondern ein strategisches Führungsinstrument.',
    personName: 'Dr. Lena Hoffmann',
    personRole: 'Managing Director',
    personContext: 'Impulse aus Beratung, Market Access und Transformation.',
    brand: 'co.faktor',
  },
  resolveFieldValues: (values) => {
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const escapeText = (value: string) => escapeHtml(String(value ?? '').trim());

    const rawQuote = String(values.quote ?? '').trim();
    const quoteHtml = escapeHtml(rawQuote)
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

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
        rgba(15, 23, 42, ${0.18 * overlay}) 0%,
        rgba(15, 23, 42, ${0.32 * overlay}) 26%,
        rgba(15, 23, 42, ${0.62 * overlay}) 52%,
        rgba(15, 23, 42, ${0.9 * overlay}) 78%,
        rgba(15, 23, 42, ${0.98 * overlay}) 100%
      );`;

    const photoSrc = String(values.photoSrc ?? '').trim();
    const photoStyle = photoSrc
      ? `background-image: url('${photoSrc}'); background-position: ${posX}% ${posY}%;`
      : `background-image: none; background-position: ${posX}% ${posY}%;`;

    return {
      ...values,
      tagTextHtml: escapeText(values.tagText ?? ''),
      badgeTextHtml: escapeText(values.badgeText ?? ''),
      quoteHtml,
      personNameHtml: escapeText(values.personName ?? ''),
      personRoleHtml: escapeText(values.personRole ?? ''),
      personContextHtml: escapeText(values.personContext ?? '').replace(/\n/g, '<br>'),
      photoStyle,
      overlayStyle,
    };
  },
  rawHtmlPlaceholders: [
    'tagTextHtml',
    'badgeTextHtml',
    'quoteHtml',
    'personNameHtml',
    'personRoleHtml',
    'personContextHtml',
    'photoStyle',
  ],
};
