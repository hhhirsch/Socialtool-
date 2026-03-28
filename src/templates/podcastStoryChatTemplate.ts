import type { FieldValues, GraphicTemplate, TemplateSlideRenderDefinition } from './types';

type StoryMessageDirection = 'in' | 'out' | 'typing';

interface StoryMessage {
  direction: StoryMessageDirection;
  text: string;
  time: string;
  isEmojiOnly: boolean;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isEmojiOnlyMessage(value: string): boolean {
  const normalizedValue = value.replace(/\s+/g, '');
  return normalizedValue.length > 0
    && /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}|\u200D|\uFE0F)+$/u.test(normalizedValue);
}

function extractMessageTime(line: string): { content: string; time: string } {
  const timeMatch = line.match(/\|\s*([0-2]?\d:\d{2})\s*$/);
  if (!timeMatch) {
    return { content: line.trim(), time: '' };
  }

  return {
    content: line.slice(0, timeMatch.index).trim(),
    time: timeMatch[1],
  };
}

function parseMessageLine(line: string): StoryMessage | null {
  const trimmedLine = line.trim();
  if (!trimmedLine) {
    return null;
  }

  const { content, time } = extractMessageTime(trimmedLine);

  if (/^TYPING$/i.test(content)) {
    return {
      direction: 'typing',
      text: '',
      time,
      isEmojiOnly: false,
    };
  }

  const match = content.match(/^(IN|OUT):\s*(.+)$/i);
  if (!match) {
    return null;
  }

  const text = match[2].trim();
  if (!text) {
    return null;
  }

  return {
    direction: match[1].toUpperCase() === 'OUT' ? 'out' : 'in',
    text,
    time,
    isEmojiOnly: isEmojiOnlyMessage(text),
  };
}

function parseSlides(messages: string): StoryMessage[][] {
  return messages
    .split(/\n\s*---\s*\n/g)
    .map((block) =>
      block
        .split('\n')
        .map(parseMessageLine)
        .filter((message): message is StoryMessage => message !== null)
    )
    .filter((block) => block.length > 0);
}

function renderProgressBars(totalSlides: number, activeIndex: number): string {
  return Array.from({ length: totalSlides }, (_, index) => {
    const stateClass =
      index < activeIndex ? 'is-complete' : index === activeIndex ? 'is-current' : 'is-pending';

    return `<span class="story-progress-bar ${stateClass}"><span class="story-progress-fill"></span></span>`;
  }).join('');
}

function renderMessage(message: StoryMessage): string {
  if (message.direction === 'typing') {
    return `
      <div class="story-message is-in is-typing">
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        ${message.time ? `<span class="story-message-time">${escapeHtml(message.time)}</span>` : ''}
      </div>
    `;
  }

  const bubbleClass = [
    'story-message',
    message.direction === 'out' ? 'is-out' : 'is-in',
    message.isEmojiOnly ? 'is-emoji' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return `
    <div class="${bubbleClass}">
      <span class="story-message-text">${escapeHtml(message.text)}</span>
      ${message.time ? `<span class="story-message-time">${escapeHtml(message.time)}</span>` : ''}
    </div>
  `;
}

function renderChatBody(values: FieldValues, messages: StoryMessage[]): string {
  return `
    <div class="chat-stage">
      <div class="episode-chip">Folge #${escapeHtml(values.episodeNumber ?? '')}</div>
      <div class="chat-messages">
        ${messages.map(renderMessage).join('')}
      </div>
      <div class="chat-input-shell">
        <div class="chat-input-field">Nachricht schreiben…</div>
        <div class="chat-send-button" aria-hidden="true">
          <span class="chat-send-icon"></span>
        </div>
      </div>
      <div class="story-episode-card">
        <div class="story-episode-kicker">${escapeHtml(values.showName ?? '')}</div>
        <div class="story-episode-title">${escapeHtml(values.episodeTitle ?? '')}</div>
      </div>
    </div>
  `;
}

function renderCtaBody(values: FieldValues): string {
  return `
    <div class="cta-stage">
      <div class="cta-badge">Neue Podcast-Folge</div>
      <div class="cta-card">
        <div class="cta-play-button" aria-hidden="true">
          <span class="cta-play-triangle"></span>
        </div>
        <div class="cta-copy">
          <h2>${escapeHtml(values.ctaHeading ?? '')}</h2>
          <p class="cta-episode-info">
            Folge #${escapeHtml(values.episodeNumber ?? '')} · ${escapeHtml(values.episodeTitle ?? '')}
          </p>
          <p class="cta-show-name">${escapeHtml(values.showName ?? '')}</p>
        </div>
      </div>
      <div class="cta-button">${escapeHtml(values.ctaButtonLabel ?? '')}</div>
      <div class="cta-handle">${escapeHtml(values.ctaHandleText ?? '')} ${escapeHtml(values.handle ?? '')}</div>
    </div>
  `;
}

function buildSlideDefinition(
  values: FieldValues,
  totalSlides: number,
  activeIndex: number,
  storyBodyHtml: string,
  slideVariant: string,
  filename: string,
  helpers: { render: (fieldValues: FieldValues) => string }
): TemplateSlideRenderDefinition {
  return {
    id: filename,
    filename,
    label: `${activeIndex + 1} / ${totalSlides}`,
    html: helpers.render({
      ...values,
      slideVariant,
      progressBarsHtml: renderProgressBars(totalSlides, activeIndex),
      storyBodyHtml,
    }),
  };
}

export const podcastStoryChatTemplate: GraphicTemplate = {
  id: 'podcast-story-chat',
  name: 'Podcast · Story Chat',
  description:
    'Mehrere Story-Slides aus einem Chatverlauf. Slides werden per "---" getrennt und kumulativ aufgebaut.',
  category: 'podcast',
  supportedPresetIds: ['1080x1920'],
  htmlTemplate: `
    <div class="story-slide {{slideVariant}}">
      <div class="story-shell">
        <div class="story-glow story-glow-top"></div>
        <div class="story-glow story-glow-bottom"></div>

        <div class="story-statusbar">
          <span>9:41</span>
          <div class="story-status-icons" aria-hidden="true">
            <span class="status-signal"></span>
            <span class="status-wifi"></span>
            <span class="status-battery"></span>
          </div>
        </div>

        <div class="dynamic-island"></div>

        <div class="story-progress-track">
          {{progressBarsHtml}}
        </div>

        <div class="chat-header">
          <div class="chat-header-avatar">{{chatName}}</div>
          <div class="chat-header-copy">
            <div class="chat-header-name">{{chatName}}</div>
            <div class="chat-header-status">{{chatStatus}}</div>
          </div>
          <div class="chat-header-meta">⋯</div>
        </div>

        <div class="story-body">
          {{storyBodyHtml}}
        </div>

        <div class="story-footer">
          <div class="story-footer-show">{{showName}}</div>
          <div class="story-footer-handle">{{handle}}</div>
        </div>
      </div>
    </div>
  `,
  css: `
    :root {
      --story-bg: #110c1c;
      --story-bg-soft: #231537;
      --story-surface: rgba(20, 14, 31, 0.72);
      --story-surface-strong: rgba(16, 10, 25, 0.88);
      --story-border: rgba(255, 255, 255, 0.08);
      --story-text: #ffffff;
      --story-text-soft: rgba(255, 255, 255, 0.72);
      --story-lavender: #d1b1ff;
      --story-lavender-strong: #a85dff;
      --story-lavender-soft: rgba(209, 177, 255, 0.22);
      --story-green: #53d3a5;
      --story-shadow: 0 28px 80px rgba(0, 0, 0, 0.34);
      --font-body: 'DM Sans', system-ui, sans-serif;
      --font-heading: 'Fraunces', Georgia, serif;
    }

    *, *::before, *::after {
      box-sizing: border-box;
    }

    .story-slide {
      position: relative;
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background:
        radial-gradient(circle at top right, rgba(168, 93, 255, 0.42), transparent 34%),
        radial-gradient(circle at bottom left, rgba(83, 211, 165, 0.22), transparent 28%),
        linear-gradient(180deg, #1c1230 0%, #120d1f 48%, #0c0a15 100%);
      color: var(--story-text);
      font-family: var(--font-body);
    }

    .story-shell {
      position: relative;
      width: 100%;
      height: 100%;
      padding: 54px 42px 40px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .story-glow {
      position: absolute;
      border-radius: 999px;
      pointer-events: none;
      filter: blur(16px);
      opacity: 0.6;
    }

    .story-glow-top {
      top: 110px;
      right: 40px;
      width: 300px;
      height: 300px;
      background: rgba(168, 93, 255, 0.28);
    }

    .story-glow-bottom {
      left: 10px;
      bottom: 180px;
      width: 340px;
      height: 340px;
      background: rgba(83, 211, 165, 0.16);
    }

    .story-statusbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 8px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: 0.01em;
      position: relative;
      z-index: 2;
    }

    .story-status-icons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-signal,
    .status-wifi,
    .status-battery {
      display: inline-flex;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.9);
    }

    .status-signal {
      width: 22px;
      height: 12px;
    }

    .status-wifi {
      width: 18px;
      height: 12px;
      opacity: 0.8;
    }

    .status-battery {
      width: 30px;
      height: 14px;
    }

    .dynamic-island {
      width: 220px;
      height: 52px;
      border-radius: 999px;
      background: #050507;
      align-self: center;
      margin-top: -10px;
      box-shadow: 0 14px 24px rgba(0, 0, 0, 0.32);
      position: relative;
      z-index: 2;
    }

    .story-progress-track {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
      gap: 10px;
      position: relative;
      z-index: 2;
      margin-top: -4px;
    }

    .story-progress-bar {
      height: 8px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.16);
      overflow: hidden;
    }

    .story-progress-fill {
      display: block;
      height: 100%;
      width: 0;
      border-radius: inherit;
      background: linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.88) 100%);
    }

    .story-progress-bar.is-complete .story-progress-fill,
    .story-progress-bar.is-current .story-progress-fill {
      width: 100%;
    }

    .story-progress-bar.is-pending .story-progress-fill {
      width: 0;
    }

    .chat-header {
      display: flex;
      align-items: center;
      gap: 18px;
      padding: 26px 28px;
      border-radius: 34px;
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(22px);
      -webkit-backdrop-filter: blur(22px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: var(--story-shadow);
      position: relative;
      z-index: 2;
    }

    .chat-header-avatar {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--story-lavender) 0%, var(--story-lavender-strong) 100%);
      color: #1b1129;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 21px;
      font-weight: 700;
      text-transform: uppercase;
      flex-shrink: 0;
      overflow: hidden;
      padding: 0 12px;
      text-align: center;
      line-height: 1.1;
    }

    .chat-header-copy {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
    }

    .chat-header-name {
      font-size: 30px;
      font-weight: 700;
      line-height: 1.15;
    }

    .chat-header-status {
      font-size: 20px;
      color: var(--story-text-soft);
    }

    .chat-header-meta {
      font-size: 44px;
      line-height: 1;
      color: rgba(255, 255, 255, 0.7);
    }

    .story-body {
      flex: 1;
      min-height: 0;
      position: relative;
      z-index: 1;
    }

    .chat-stage,
    .cta-stage {
      width: 100%;
      height: 100%;
      border-radius: 40px;
      background: var(--story-surface);
      border: 1px solid var(--story-border);
      box-shadow: var(--story-shadow);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      overflow: hidden;
    }

    .chat-stage {
      display: flex;
      flex-direction: column;
      padding: 32px 28px 26px;
      gap: 22px;
    }

    .episode-chip {
      align-self: flex-start;
      padding: 12px 18px;
      border-radius: 999px;
      background: var(--story-lavender-soft);
      color: var(--story-lavender);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .chat-messages {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 16px;
      overflow: hidden;
      padding-bottom: 6px;
    }

    .story-message {
      max-width: 78%;
      display: inline-flex;
      flex-direction: column;
      gap: 6px;
      padding: 18px 22px;
      border-radius: 28px;
      font-size: 30px;
      line-height: 1.35;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
      word-break: break-word;
    }

    .story-message.is-in {
      align-self: flex-start;
      background: rgba(255, 255, 255, 0.96);
      color: #20142e;
      border-bottom-left-radius: 12px;
    }

    .story-message.is-out {
      align-self: flex-end;
      background: linear-gradient(135deg, #9f54ff 0%, #7d3feb 100%);
      color: #ffffff;
      border-bottom-right-radius: 12px;
    }

    .story-message.is-emoji {
      background: transparent;
      box-shadow: none;
      padding: 0;
      font-size: 68px;
      line-height: 1;
    }

    .story-message.is-typing {
      flex-direction: row;
      align-items: center;
      gap: 10px;
    }

    .typing-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: rgba(32, 20, 46, 0.36);
      animation: storyTyping 1.2s infinite ease-in-out;
    }

    .typing-dot:nth-child(2) {
      animation-delay: 0.18s;
    }

    .typing-dot:nth-child(3) {
      animation-delay: 0.36s;
    }

    .story-message-text {
      display: block;
    }

    .story-message-time {
      display: block;
      font-size: 16px;
      font-weight: 600;
      opacity: 0.56;
      align-self: flex-end;
    }

    .story-message.is-in .story-message-time {
      align-self: flex-start;
    }

    .chat-input-shell {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-top: 8px;
    }

    .chat-input-field {
      flex: 1;
      min-height: 64px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(8, 5, 14, 0.44);
      color: rgba(255, 255, 255, 0.42);
      display: flex;
      align-items: center;
      padding: 0 24px;
      font-size: 24px;
    }

    .chat-send-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--story-green) 0%, #3db989 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 10px 24px rgba(83, 211, 165, 0.24);
    }

    .chat-send-icon {
      width: 0;
      height: 0;
      border-top: 12px solid transparent;
      border-bottom: 12px solid transparent;
      border-left: 20px solid #082215;
      margin-left: 4px;
    }

    .story-episode-card {
      padding: 24px;
      border-radius: 30px;
      background: var(--story-surface-strong);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: grid;
      gap: 10px;
    }

    .story-episode-kicker {
      color: var(--story-lavender);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .story-episode-title {
      font-size: 34px;
      line-height: 1.18;
      font-weight: 700;
    }

    .cta-stage {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 52px;
      gap: 28px;
    }

    .cta-badge {
      align-self: flex-start;
      padding: 14px 20px;
      border-radius: 999px;
      background: rgba(83, 211, 165, 0.14);
      color: var(--story-green);
      font-size: 18px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .cta-card {
      display: grid;
      gap: 26px;
      padding: 34px;
      border-radius: 34px;
      background: rgba(7, 5, 12, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .cta-play-button {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--story-lavender) 0%, var(--story-lavender-strong) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 18px 38px rgba(168, 93, 255, 0.28);
    }

    .cta-play-triangle {
      width: 0;
      height: 0;
      border-top: 22px solid transparent;
      border-bottom: 22px solid transparent;
      border-left: 34px solid #180f27;
      margin-left: 8px;
    }

    .cta-copy {
      display: grid;
      gap: 14px;
    }

    .cta-copy h2 {
      margin: 0;
      font-family: var(--font-heading);
      font-size: 68px;
      line-height: 0.98;
      letter-spacing: -0.03em;
    }

    .cta-episode-info,
    .cta-show-name,
    .cta-handle {
      margin: 0;
      font-size: 26px;
      line-height: 1.35;
      color: var(--story-text-soft);
    }

    .cta-button {
      width: 100%;
      min-height: 88px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--story-green) 0%, #30b97b 100%);
      color: #082215;
      font-size: 30px;
      font-weight: 800;
      letter-spacing: 0.01em;
      text-align: center;
      box-shadow: 0 18px 42px rgba(48, 185, 123, 0.24);
    }

    .cta-handle {
      text-align: center;
    }

    .story-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      color: var(--story-text-soft);
      font-size: 22px;
      position: relative;
      z-index: 2;
    }

    .story-footer-show {
      font-family: var(--font-heading);
      font-style: italic;
      font-size: 30px;
      color: var(--story-lavender);
    }

    .story-footer-handle {
      font-weight: 700;
    }

    @keyframes storyTyping {
      0%, 60%, 100% {
        transform: translateY(0);
        opacity: 0.45;
      }

      30% {
        transform: translateY(-5px);
        opacity: 1;
      }
    }
  `,
  fields: [
    {
      id: 'messages',
      label: 'Chat-Nachrichten',
      type: 'textarea',
      multiline: true,
      helpText: 'Jede Zeile mit IN:, OUT: oder TYPING. "---" trennt Story-Slides. Zeit optional mit "| 14:22".',
    },
    { id: 'chatName', label: 'Chat-Name', type: 'text' },
    { id: 'chatStatus', label: 'Chat-Status', type: 'text' },
    { id: 'episodeNumber', label: 'Folgennummer', type: 'text' },
    { id: 'episodeTitle', label: 'Folgentitel', type: 'text' },
    { id: 'handle', label: 'Handle', type: 'text' },
    { id: 'showName', label: 'Showname', type: 'text' },
    { id: 'ctaHeading', label: 'CTA-Headline', type: 'text' },
    { id: 'ctaButtonLabel', label: 'CTA-Button', type: 'text' },
    { id: 'ctaHandleText', label: 'CTA-Handle-Text', type: 'text' },
  ],
  defaults: {
    messages: `IN: Neue Folge schon gehört? | 14:22
OUT: Noch nicht — worum geht's diesmal? | 14:23
---
IN: Um Familienrituale, Identität und die Sache mit Lyoner-Wurst. | 14:24
OUT: Klingt wild 😄 | 14:24
---
OUT: Schick mir den Link! | 14:25
TYPING | 14:25`,
    chatName: 'Link in Bio',
    chatStatus: 'Podcast-Chat · online',
    episodeNumber: '4',
    episodeTitle: 'Büchse der Lyoner – mit Anıl',
    handle: '@yasminpolat',
    showName: 'Link in Bio',
    ctaHeading: 'Jetzt neue Folge hören',
    ctaButtonLabel: 'Play drücken',
    ctaHandleText: 'Mehr Updates bei',
    slideVariant: 'is-chat',
    progressBarsHtml: '',
    storyBodyHtml: '',
  },
  resolveSlides: (values, helpers) => {
    const parsedSlides = parseSlides(String(values.messages ?? ''));
    const fallbackSlides = parsedSlides.length > 0 ? parsedSlides : parseSlides(String(podcastStoryChatTemplate.defaults.messages));
    const totalSlides = fallbackSlides.length + 1;

    const slides = fallbackSlides.map((_, index) =>
      buildSlideDefinition(
        values,
        totalSlides,
        index,
        renderChatBody(values, fallbackSlides.slice(0, index + 1).flat()),
        'is-chat',
        `slide-${String(index + 1).padStart(2, '0')}`,
        helpers
      )
    );

    slides.push(
      buildSlideDefinition(
        values,
        totalSlides,
        totalSlides - 1,
        renderCtaBody(values),
        'is-cta',
        'slide-cta',
        helpers
      )
    );

    return slides;
  },
  rawHtmlPlaceholders: ['progressBarsHtml', 'storyBodyHtml'],
};
