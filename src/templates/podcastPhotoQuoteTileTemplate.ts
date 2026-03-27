import type { GraphicTemplate } from './types';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function clampPercentage(value: string, fallback: number): string {
  const parsedValue = Number.parseFloat(value);

  if (!Number.isFinite(parsedValue)) {
    return String(fallback);
  }

  return String(Math.min(100, Math.max(0, parsedValue)));
}

const defaultPhotoSrc =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAxMDgwIDEwODAnPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0nYmcnIHgxPScwJyB5MT0nMCcgeDI9JzEnIHkyPScxJz48c3RvcCBvZmZzZXQ9JzAlJyBzdG9wLWNvbG9yPScjMjkzYTU2Jy8+PHN0b3Agb2Zmc2V0PScxMDAlJyBzdG9wLWNvbG9yPScjOGQ0ZjZkJy8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9JzEwODAnIGhlaWdodD0nMTA4MCcgZmlsbD0ndXJsKCNiZyknLz48Y2lyY2xlIGN4PSc3ODUnIGN5PSczMjUnIHI9JzI1NScgZmlsbD0nI2YzZDRjNicgZmlsbC1vcGFjaXR5PScuMzInLz48Y2lyY2xlIGN4PSczNDAnIGN5PSc3ODUnIHI9JzI5NScgZmlsbD0nI2ZmZmZmZicgZmlsbC1vcGFjaXR5PScuMTInLz48L3N2Zz4=';

const overlayTopBaseAlpha = 0.2;
const overlayTopAlphaRange = 0.28;
const overlayBottomBaseAlpha = 0.54;
const overlayBottomAlphaRange = 0.28;

export const podcastPhotoQuoteTileTemplate: GraphicTemplate = {
  id: 'podcast-photo-quote-tile',
  name: 'Podcast · Foto-Zitatekachel',
  description: 'Quadratische Podcast-Zitatekachel mit großem Hintergrundfoto und Text-Overlay.',
  category: 'podcast',
  supportedPresetIds: ['1080x1080'],
  htmlTemplate: `
    <div class="tile">
      <div class="tile-media">
        <img class="tile-photo" src="{{photoSrc}}" alt="" style="object-position: {{photoObjectPosition}};" />
        <div class="tile-overlay" style="background: {{overlayBackground}};"></div>
      </div>

      <div class="tile-content">
        <div class="tile-top">
          <div class="tile-show-name">{{showName}}</div>
          <div class="tile-episode-badge">{{episodeBadgeLabel}}</div>
        </div>

        <div class="tile-quote">{{quoteHtml}}</div>

        <div class="tile-bottom">
          <div class="tile-meta">
            <div class="tile-guest">{{guestDisplay}}</div>
            <div class="tile-episode-title">{{episodeTitle}}</div>
            <div class="tile-tags">{{tagsHtml}}</div>
          </div>

          <div class="tile-handle">{{handle}}</div>
        </div>
      </div>
    </div>
  `,
  css: `
    :root {
      --tile-text: #f7f3ec;
      --tile-text-soft: rgba(247, 243, 236, 0.84);
      --tile-tag-bg: rgba(247, 243, 236, 0.16);
      --tile-tag-border: rgba(247, 243, 236, 0.28);
      --tile-badge-bg: rgba(247, 243, 236, 0.16);
      --tile-badge-border: rgba(247, 243, 236, 0.2);
      --tile-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
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
      background: #111827;
      color: var(--tile-text);
      font-family: var(--font-body);
      flex-shrink: 0;
    }

    .tile-media,
    .tile-photo,
    .tile-overlay,
    .tile-content {
      position: absolute;
      inset: 0;
    }

    .tile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transform: scale(1.02);
    }

    .tile-overlay {
      pointer-events: none;
    }

    .tile-content {
      z-index: 1;
      display: flex;
      flex-direction: column;
      padding: 68px 64px 58px;
      gap: 36px;
    }

    .tile-top,
    .tile-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
    }

    .tile-show-name {
      max-width: 58%;
      font-size: 26px;
      font-weight: 600;
      letter-spacing: 0.01em;
      text-wrap: balance;
      text-shadow: var(--tile-shadow);
    }

    .tile-episode-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 48px;
      padding: 12px 20px;
      border: 1px solid var(--tile-badge-border);
      border-radius: 999px;
      background: var(--tile-badge-bg);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      white-space: nowrap;
    }

    .tile-quote {
      margin-top: auto;
      max-width: 820px;
      font-family: var(--font-heading);
      font-size: 64px;
      font-weight: 600;
      line-height: 1.08;
      letter-spacing: -0.03em;
      text-wrap: balance;
      text-shadow: var(--tile-shadow);
    }

    .tile-quote em {
      font-style: italic;
      font-weight: 400;
    }

    .tile-bottom {
      margin-top: auto;
      align-items: flex-end;
    }

    .tile-meta {
      max-width: 72%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .tile-guest {
      min-height: 28px;
      font-size: 26px;
      font-weight: 500;
      line-height: 1.1;
      color: var(--tile-text);
      text-shadow: var(--tile-shadow);
    }

    .tile-episode-title {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.35;
      color: var(--tile-text-soft);
      text-shadow: var(--tile-shadow);
    }

    .tile-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      min-height: 42px;
      margin-top: 4px;
    }

    .tile-tag {
      display: inline-flex;
      align-items: center;
      min-height: 36px;
      padding: 8px 14px;
      border: 1px solid var(--tile-tag-border);
      border-radius: 999px;
      background: var(--tile-tag-bg);
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--tile-text);
    }

    .tile-handle {
      max-width: 28%;
      font-size: 18px;
      font-weight: 600;
      line-height: 1.3;
      color: var(--tile-text);
      text-align: right;
      text-shadow: var(--tile-shadow);
      word-break: break-word;
    }
  `,
  fields: [
    {
      id: 'photoSrc',
      label: 'Foto-URL / Data-URL',
      type: 'text',
      helpText: 'Akzeptiert zunächst eine Bild-URL oder Data-URL und kann später direkt an einen Upload gebunden werden.',
    },
    { id: 'photoPositionX', label: 'Foto-Position X (%)', type: 'number' },
    { id: 'photoPositionY', label: 'Foto-Position Y (%)', type: 'number' },
    { id: 'overlayStrength', label: 'Overlay-Stärke (%)', type: 'number' },
    { id: 'quote', label: 'Zitat', type: 'textarea', multiline: true },
    { id: 'episodeNumber', label: 'Folgennummer', type: 'number' },
    { id: 'guest', label: 'Gast', type: 'text' },
    { id: 'episodeTitle', label: 'Folgentitel', type: 'text' },
    { id: 'tags', label: 'Tags (kommagetrennt)', type: 'text' },
    { id: 'handle', label: 'Handle', type: 'text' },
    { id: 'showName', label: 'Showname', type: 'text' },
  ],
  defaults: {
    photoSrc: defaultPhotoSrc,
    photoPositionX: '50',
    photoPositionY: '32',
    overlayStrength: '58',
    quote:
      'Manchmal braucht es nur *einen Satz*, damit ein ganzes Gespräch noch lange nachhallt.',
    episodeNumber: '43',
    guest: 'Meryem Özkan',
    episodeTitle: 'Wie wir Geschichten sichtbar machen',
    tags: 'Podcast, Storytelling, Gespräch',
    handle: '@linkinbio.podcast',
    showName: 'Link in Bio',
  },
  resolveFieldValues: (values) => {
    const rawQuote = String(values.quote ?? '').trim();
    const quoteHtml = escapeHtml(rawQuote)
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    const tagsHtml = String(values.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => `<span class="tile-tag">${escapeHtml(tag)}</span>`)
      .join('');

    const guest = String(values.guest ?? '').trim();
    const guestDisplay = guest ? `— ${guest}` : '';
    const photoPositionX = clampPercentage(String(values.photoPositionX ?? ''), 50);
    const photoPositionY = clampPercentage(String(values.photoPositionY ?? ''), 50);
    const overlayStrength = clampPercentage(String(values.overlayStrength ?? ''), 58);
    const overlayFactor = Number.parseFloat(overlayStrength) / 100;
    const topAlpha = (overlayTopBaseAlpha + overlayFactor * overlayTopAlphaRange).toFixed(2);
    const bottomAlpha = (overlayBottomBaseAlpha + overlayFactor * overlayBottomAlphaRange).toFixed(2);
    const overlayBackground = `linear-gradient(180deg, rgba(6, 10, 24, ${topAlpha}) 0%, rgba(6, 10, 24, ${bottomAlpha}) 100%)`;
    const episodeNumber = String(values.episodeNumber ?? '').trim();
    const episodeBadgeLabel = episodeNumber ? `Folge #${episodeNumber}` : 'Podcast';

    return {
      ...values,
      quoteHtml,
      tagsHtml,
      guestDisplay,
      photoPositionX,
      photoPositionY,
      overlayStrength,
      photoObjectPosition: `${photoPositionX}% ${photoPositionY}%`,
      overlayBackground,
      episodeBadgeLabel,
      photoSrc: String(values.photoSrc ?? '').trim() || defaultPhotoSrc,
    };
  },
  rawHtmlPlaceholders: ['quoteHtml', 'tagsHtml'],
};
