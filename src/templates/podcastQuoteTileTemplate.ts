import type { GraphicTemplate } from './types';
import { sharedBaseCss } from './sharedBaseCss';
import { escapeTemplateHtml } from '../utils/templateContent';

function buildEpisodeBadge(episodeNumber: string): string {
  const normalizedEpisodeNumber = episodeNumber.trim();
  return normalizedEpisodeNumber ? `FOLGE #${normalizedEpisodeNumber}` : 'FOLGE';
}

function buildQuoteHtml(quote: string): string {
  let lastIndex = 0;
  let highlightedQuote = '';

  quote.replace(/\*([^*]+)\*/g, (match, highlightedText: string, offset: number) => {
    highlightedQuote += escapeTemplateHtml(quote.slice(lastIndex, offset));
    highlightedQuote += `<em>${escapeTemplateHtml(highlightedText)}</em>`;
    lastIndex = offset + match.length;
    return match;
  });

  highlightedQuote += escapeTemplateHtml(quote.slice(lastIndex));
  return highlightedQuote;
}

function buildTagsHtml(tags: string): string {
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((tag) => `<span class="podcast-tag-chip">${escapeTemplateHtml(tag)}</span>`)
    .join('');
}

export const podcastQuoteTileTemplate: GraphicTemplate = {
  id: "podcast-quote-tile",
  name: "Zitatekachel",
  description: "Quadratische Instagram-Kachel für Podcast-Zitate mit Episoden- und Gastinformationen.",
  category: "podcast",
  supportedPresetIds: ["1080x1080"],
  rawHtmlPlaceholders: ["quoteHtml", "tagsHtml"],
  htmlTemplate: `
    <div class="slide">
      <div class="grid"></div>
      <div class="glow glow--tl"></div>
      <div class="glow glow--blue-tr"></div>
      <div class="accent-stripe"></div>
      <div class="topbar podcast-topbar"></div>

      <div class="podcast-show-name">{{showName}}</div>
      <div class="badge badge--blue">{{episodeBadge}}</div>

      <div class="podcast-quote-mark">“</div>
      <div class="podcast-quote">{{quoteHtml}}</div>

      <div class="podcast-tags">{{tagsHtml}}</div>

      <div class="podcast-footer">
        <div class="podcast-guest-block">
          <div class="podcast-guest">{{guest}}</div>
          <div class="podcast-episode-title">{{episodeTitle}}</div>
        </div>
        <div class="podcast-handle">{{handle}}</div>
      </div>
    </div>
  `,
  css: `
    ${sharedBaseCss}

    .podcast-topbar {
      background: linear-gradient(90deg, #60a5fa 0%, rgba(96,165,250,0.22) 60%, transparent 100%);
    }

    .podcast-show-name {
      position: absolute;
      top: 58px;
      left: 72px;
      z-index: 5;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.24em;
      text-transform: uppercase;
      color: rgba(191,219,254,0.8);
    }

    .podcast-quote-mark {
      position: absolute;
      top: 152px;
      left: 72px;
      z-index: 4;
      font-family: 'Instrument Serif', serif;
      font-size: 160px;
      line-height: 0.7;
      color: rgba(96,165,250,0.12);
    }

    .podcast-quote {
      position: absolute;
      top: 222px;
      left: 72px;
      right: 72px;
      z-index: 5;
      font-family: 'Instrument Serif', serif;
      font-size: 64px;
      line-height: 1.08;
      letter-spacing: -1.6px;
      color: var(--text);
    }

    .podcast-quote em {
      font-style: italic;
      color: #93c5fd;
    }

    .podcast-tags {
      position: absolute;
      left: 72px;
      right: 72px;
      bottom: 176px;
      z-index: 5;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .podcast-tag-chip {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 9px 16px;
      background: rgba(96,165,250,0.1);
      border: 1px solid rgba(96,165,250,0.26);
      color: rgba(191,219,254,0.9);
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.02em;
    }

    .podcast-footer {
      position: absolute;
      left: 72px;
      right: 72px;
      bottom: 64px;
      z-index: 5;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 24px;
      padding-top: 22px;
      border-top: 1px solid rgba(96,165,250,0.18);
    }

    .podcast-guest-block {
      max-width: 68%;
    }

    .podcast-guest {
      font-size: 22px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.2;
    }

    .podcast-episode-title {
      margin-top: 8px;
      font-size: 17px;
      font-weight: 400;
      color: var(--text-soft);
      line-height: 1.35;
    }

    .podcast-handle {
      font-size: 16px;
      font-weight: 500;
      color: rgba(191,219,254,0.82);
      text-align: right;
    }
  `,
  fields: [
    {
      id: "quote",
      label: "Zitat",
      type: "textarea",
      multiline: true,
      helpText: "Mit *Sternchen* können einzelne Wörter oder Phrasen hervorgehoben werden.",
    },
    { id: "episodeNumber", label: "Folgennummer", type: "number" },
    { id: "guest", label: "Gast", type: "text" },
    { id: "episodeTitle", label: "Episodentitel", type: "text" },
    {
      id: "tags",
      label: "Tags",
      type: "text",
      placeholder: "AMNOG, Market Access, Nutzenbewertung",
      helpText: "Kommagetrennte Schlagwörter werden als Chips dargestellt.",
    },
    { id: "handle", label: "Handle", type: "text" },
    { id: "showName", label: "Podcastname", type: "text" },
  ],
  defaults: {
    quote: "Wir brauchen *klare Evidenz* – aber auch den Mut, Versorgung *praktisch* zu denken.",
    episodeNumber: "42",
    guest: "Dr. Beispiel Gast",
    episodeTitle: "Warum AMNOG-Kommunikation verständlicher werden muss",
    tags: "AMNOG, Market Access, Nutzenbewertung",
    handle: "@socialtool_podcast",
    showName: "Socialtool Podcast",
  },
  resolveFieldValues: (fieldValues) => ({
    ...fieldValues,
    episodeBadge: buildEpisodeBadge(fieldValues.episodeNumber ?? ''),
    quoteHtml: buildQuoteHtml(fieldValues.quote ?? ''),
    tagsHtml: buildTagsHtml(fieldValues.tags ?? ''),
  }),
};
