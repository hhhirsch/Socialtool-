import type { GraphicTemplate } from './types';

export const podcastQuoteTileTemplate: GraphicTemplate = {
  id: 'podcast-quote-tile',
  name: 'Podcast · Zitatekachel',
  description: 'Quadratische Instagram-Zitatekachel für Podcast-Episoden.',
  category: 'podcast',
  supportedPresetIds: ['1080x1080'],
  htmlTemplate: `
    <div class="tile">
      <div class="tile-inner">
        <div class="tile-top">
          <div class="tile-logo">{{showName}}</div>
          <div class="tile-episode-badge">FOLGE #{{episodeNumber}}</div>
        </div>

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
      background: var(--bg);
      flex-shrink: 0;
      font-family: var(--font-body);
    }

    .tile::before {
      content: '';
      position: absolute;
      top: -180px;
      right: -180px;
      width: 520px;
      height: 520px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(196,160,208,0.5) 0%, transparent 70%);
      pointer-events: none;
    }

    .tile::after {
      content: '';
      position: absolute;
      bottom: -120px;
      left: -80px;
      width: 380px;
      height: 380px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(155,110,181,0.25) 0%, transparent 70%);
      pointer-events: none;
    }

    .tile-inner {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 80px 72px 64px;
    }

    .tile-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: auto;
    }

    .tile-logo {
      font-family: var(--font-heading);
      font-style: italic;
      font-weight: 400;
      font-size: 28px;
      color: var(--lav-dp);
      letter-spacing: -0.01em;
    }

    .tile-episode-badge {
      font-family: var(--font-body);
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--lav-dp);
      background: var(--lav-l);
      padding: 8px 20px;
      border-radius: 999px;
    }

    .tile-quote-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 20px 0;
    }

    .tile-quote-mark {
      font-family: var(--font-heading);
      font-size: 120px;
      line-height: 0.6;
      color: var(--lav);
      opacity: 0.5;
      margin-bottom: 16px;
      user-select: none;
    }

    .tile-quote {
      font-family: var(--font-heading);
      font-size: 52px;
      font-weight: 700;
      line-height: 1.2;
      color: var(--td);
      letter-spacing: -0.02em;
      max-width: 880px;
    }

    .tile-quote em {
      color: var(--lav-dp);
      font-style: italic;
      font-weight: 400;
    }

    .tile-bottom {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: auto;
      gap: 20px;
    }

    .tile-meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .tile-guest {
      font-family: var(--font-body);
      font-size: 22px;
      font-weight: 600;
      color: var(--td);
    }

    .tile-episode-title {
      font-family: var(--font-body);
      font-size: 17px;
      font-weight: 500;
      color: var(--tl);
    }

    .tile-tags {
      display: flex;
      gap: 8px;
      margin-top: 8px;
      flex-wrap: wrap;
    }

    .tile-tag {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 600;
      color: var(--lav-dp);
      background: var(--lav-l);
      padding: 5px 14px;
      border-radius: 20px;
    }

    .tile-handle {
      font-family: var(--font-body);
      font-size: 17px;
      font-weight: 500;
      color: var(--tl);
      text-align: right;
      white-space: nowrap;
    }

    .tile-accent-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 8px;
      background: linear-gradient(90deg, var(--lav-dp), var(--lav), var(--lav-l));
      z-index: 2;
    }
  `,
  fields: [
    { id: 'quote', label: 'Zitat', type: 'textarea', multiline: true },
    { id: 'episodeNumber', label: 'Folgennummer', type: 'number' },
    { id: 'guest', label: 'Gast', type: 'text' },
    { id: 'episodeTitle', label: 'Folgentitel', type: 'text' },
    { id: 'tags', label: 'Tags (kommagetrennt)', type: 'text' },
    { id: 'handle', label: 'Handle', type: 'text' },
    { id: 'showName', label: 'Showname / Logo', type: 'text' },
  ],
  defaults: {
    quote: 'Wenn wir ehrlich auf unsere Herkunft schauen, verstehen wir uns und andere *viel besser.*',
    episodeNumber: '3',
    guest: 'Poliana Baumgarten',
    episodeTitle: 'Auf engstem Raum – mit Polly',
    tags: 'Kindheit, Migration, Interview',
    handle: '@yasminpolat',
    showName: 'Link in Bio',
  },
  resolveFieldValues: (values) => {
    const rawQuote = String(values.quote ?? '').trim();
    const quoteHtml = rawQuote
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');

    const tags = String(values.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const tagsHtml = tags.map((tag) => `<span class="tile-tag">${tag}</span>`).join('');

    const guest = String(values.guest ?? '').trim();
    const guestDisplay = guest ? `— ${guest}` : '';

    return {
      ...values,
      quoteHtml,
      tagsHtml,
      guestDisplay,
    };
  },
  rawHtmlPlaceholders: ['quoteHtml', 'tagsHtml'],
};
