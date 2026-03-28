import type { GraphicTemplate } from './types';

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
  id: 'podcast-photo-quote-tile',
  name: 'Podcast · Foto-Zitatekachel',
  description: 'Quadratische Instagram-Kachel mit Foto, Overlay und Zitat für Podcast-Episoden.',
  category: 'podcast',
  supportedPresetIds: ['1080x1080'],
  htmlTemplate: `
    <div class="tile">
      <div class="tile-photo" style="{{photoStyle}}"></div>
      <div class="tile-overlay" style="{{overlayStyle}}"></div>

      <div class="tile-content">
        <div class="tile-top">
          <div class="tile-logo">{{showName}}</div>
          <div class="tile-episode-badge">FOLGE #{{episodeNumber}}</div>
        </div>

        <div class="tile-spacer"></div>

        <div class="tile-quote-area">
          <div class="tile-quote-mark">&bdquo;</div>
          <div class="tile-quote">{{quoteHtml}}</div>
        </div>

        <div class="tile-bottom">
          <div class="tile-meta">
            <div class="tile-guest">{{guestDisplay}}</div>
            <div class="tile-episode-title">{{episodeTitle}}</div>
            <div class="tile-tags">{{tagsHtml}}</div>
          </div>
          <div class="tile-handle">{{handle}}</div>
        </div>
      </div>

      <div class="tile-accent-line"></div>
    </div>
  `,
  css: `
    :root {
      --lav: #c4a0d0;
      --lav-l: #e8d5f0;
      --lav-d: #9b6eb5;
      --lav-dp: #6b3f8a;
      --bg: #f5eefa;
      --td: #2a1540;
      --tm: #5a3d75;
      --tl: #8b6aaa;
      --font-heading: 'Fraunces', Georgia, serif;
      --font-body: 'DM Sans', system-ui, sans-serif;
    }

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .tile {
      width: 1080px;
      height: 1080px;
      position: relative;
      overflow: hidden;
      background: #1a1020;
      flex-shrink: 0;
      font-family: var(--font-body);
    }

    .tile-photo {
      position: absolute;
      inset: 0;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center top;
      z-index: 1;
    }

    .tile-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      background:
        linear-gradient(
          to bottom,
          rgba(42, 21, 64, 0.0) 0%,
          rgba(42, 21, 64, 0.05) 25%,
          rgba(42, 21, 64, 0.45) 50%,
          rgba(42, 21, 64, 0.82) 68%,
          rgba(42, 21, 64, 0.94) 80%,
          rgba(42, 21, 64, 0.98) 100%
        );
    }

    .tile-overlay::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 180px;
      background: linear-gradient(to bottom, rgba(107, 63, 138, 0.25) 0%, transparent 100%);
    }

    .tile-content {
      position: relative;
      z-index: 3;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 56px 64px 52px;
    }

    .tile-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tile-logo {
      font-family: var(--font-heading);
      font-style: italic;
      font-weight: 400;
      font-size: 26px;
      color: rgba(255,255,255,0.92);
      text-shadow: 0 2px 12px rgba(0,0,0,0.4);
    }

    .tile-episode-badge {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: white;
      background: rgba(107, 63, 138, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 8px 20px;
      border-radius: 999px;
      border: 1px solid rgba(196, 160, 208, 0.3);
    }

    .tile-spacer {
      flex: 1;
    }

    .tile-quote-area {
      margin-bottom: 28px;
    }

    .tile-quote-mark {
      font-family: var(--font-heading);
      font-size: 96px;
      line-height: 0.5;
      color: var(--lav);
      opacity: 0.6;
      margin-bottom: 12px;
      text-shadow: 0 2px 20px rgba(107,63,138,0.4);
      user-select: none;
    }

    .tile-quote {
      font-family: var(--font-heading);
      font-size: 44px;
      font-weight: 700;
      line-height: 1.22;
      color: #ffffff;
      letter-spacing: -0.02em;
      max-width: 900px;
      text-shadow: 0 2px 16px rgba(0,0,0,0.35);
    }

    .tile-quote em {
      color: var(--lav-l);
      font-style: italic;
      font-weight: 400;
    }

    .tile-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 20px;
    }

    .tile-meta {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .tile-guest {
      font-family: var(--font-body);
      font-size: 20px;
      font-weight: 600;
      color: #ffffff;
    }

    .tile-episode-title {
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 500;
      color: rgba(232, 213, 240, 0.75);
    }

    .tile-tags {
      display: flex;
      gap: 8px;
      margin-top: 6px;
      flex-wrap: wrap;
    }

    .tile-tag {
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 600;
      color: white;
      background: rgba(196, 160, 208, 0.3);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      padding: 5px 14px;
      border-radius: 20px;
      border: 1px solid rgba(196, 160, 208, 0.2);
    }

    .tile-handle {
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 500;
      color: rgba(232, 213, 240, 0.65);
      text-align: right;
      white-space: nowrap;
    }

    .tile-accent-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, var(--lav-dp), var(--lav), var(--lav-l));
      z-index: 4;
    }
  `,
  fields: [
    {
      id: 'photoSrc',
      label: 'Gast-Foto',
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
    { id: 'quote', label: 'Zitat', type: 'textarea', multiline: true },
    { id: 'episodeNumber', label: 'Folgennr.', type: 'number' },
    { id: 'guest', label: 'Gast', type: 'text' },
    { id: 'episodeTitle', label: 'Folgentitel', type: 'text' },
    { id: 'tags', label: 'Tags (kommagetrennt)', type: 'text' },
    { id: 'handle', label: 'Handle', type: 'text' },
    { id: 'showName', label: 'Showname / Logo', type: 'text' },
  ],
  defaults: {
    photoSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    photoPositionXPreset: 'mitte',
    photoPositionYPreset: 'oben',
    overlayPreset: 'mittel',
    quote: 'Essen ist nie nur Essen. Es ist immer auch *eine Erinnerung an Zuhause.*',
    episodeNumber: '4',
    guest: 'Fikri Anıl Altıntaş',
    episodeTitle: 'Büchse der Lyoner – mit Anıl',
    tags: 'Kindheit, Identität, Interview',
    handle: '@yasminpolat',
    showName: 'Link in Bio',
  },
  resolveFieldValues: (values) => {
    const escapeHtml = (value: string) =>
      value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

    const rawQuote = String(values.quote ?? '').trim();
    const quoteHtml = escapeHtml(rawQuote)
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    const tags = String(values.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const tagsHtml = tags.map((tag) => `<span class="tile-tag">${escapeHtml(tag)}</span>`).join('');

    const guest = String(values.guest ?? '').trim();
    const guestDisplay = guest ? `— ${guest}` : '';

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
        to bottom,
        rgba(42, 21, 64, 0.0) 0%,
        rgba(42, 21, 64, ${0.05 * overlay}) 20%,
        rgba(42, 21, 64, ${0.5 * overlay}) 48%,
        rgba(42, 21, 64, ${0.85 * overlay}) 66%,
        rgba(42, 21, 64, ${0.96 * overlay}) 80%,
        rgba(42, 21, 64, ${0.99 * overlay}) 100%
      );`;

    const photoSrc = String(values.photoSrc ?? '').trim();
    const photoStyle = photoSrc
      ? `background-image: url('${photoSrc}'); background-position: ${posX}% ${posY}%;`
      : `background-image: none; background-position: ${posX}% ${posY}%;`;

    return {
      ...values,
      quoteHtml,
      tagsHtml,
      guestDisplay,
      photoStyle,
      overlayStyle,
    };
  },
  rawHtmlPlaceholders: ['quoteHtml', 'tagsHtml', 'photoStyle'],
};
