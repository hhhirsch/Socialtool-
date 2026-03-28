import type { FieldValues, GraphicTemplate, TemplateSlideRenderDefinition } from './types';

type StoryMessage = {
  kind: 'message' | 'typing';
  direction?: 'in' | 'out';
  text?: string;
  time?: string;
  emojiOnly?: boolean;
};

type StorySlide = {
  id: string;
  kind: 'chat' | 'cta';
  index: number;
  total: number;
  html: string;
};

function isEmojiOnlyText(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || Array.from(trimmed).length > 6) {
    return false;
  }

  return /^(?:\p{Extended_Pictographic}|\u200D|\uFE0F|\s){1,12}$/u.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseStoryLine(line: string): StoryMessage {
  if (line.toUpperCase() === 'TYPING') {
    return { kind: 'typing' };
  }

  let direction: 'in' | 'out' = 'in';
  let text = line;

  if (/^OUT:/i.test(text)) {
    direction = 'out';
    text = text.replace(/^OUT:\s*/i, '');
  } else if (/^IN:/i.test(text)) {
    direction = 'in';
    text = text.replace(/^IN:\s*/i, '');
  }

  let time = '';
  const parts = text.split('|');
  if (parts.length > 1) {
    time = parts.pop()?.trim() ?? '';
    text = parts.join('|').trim();
  }

  const emojiOnly = isEmojiOnlyText(text);

  return {
    kind: 'message',
    direction,
    text,
    time,
    emojiOnly,
  };
}

function buildProgressBars(total: number, activeIndex: number, light = false): string {
  return Array.from({ length: total }, (_, index) => {
    const classes = [
      'progress-bar',
      index < activeIndex ? 'done' : '',
      index === activeIndex ? 'active' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return `
      <div class="${classes}">
        <div class="progress-fill${light ? ' progress-fill-light' : ''}"></div>
      </div>
    `;
  }).join('');
}

function buildMessagesHtml(messages: StoryMessage[], newCount: number): string {
  const total = messages.length;

  return messages
    .map((message, index) => {
      const isNew = index >= total - newCount;
      const delay = isNew ? (index - (total - newCount)) * 0.12 : 0;
      const style = isNew
        ? `animation-delay:${delay}s;`
        : `opacity:1;transform:none;`;

      if (message.kind === 'typing') {
        return `
          <div class="s-msg-typing" style="${style}">
            <div class="s-typing-dot"></div>
            <div class="s-typing-dot"></div>
            <div class="s-typing-dot"></div>
          </div>
        `;
      }

      const dirClass = message.direction === 'out' ? 's-msg-out' : 's-msg-in';
      const emojiClass = message.emojiOnly ? ' s-msg-emoji' : '';

      return `
        <div class="s-msg ${dirClass}${emojiClass}" style="${style}">
          ${escapeHtml(message.text ?? '')}
          ${message.time ? `<span class="s-msg-time">${escapeHtml(message.time)}</span>` : ''}
        </div>
      `;
    })
    .join('');
}

function buildAvatar(chatName: string): string {
  const initials = chatName
    .split(' ')
    .map((part) => part.trim()[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return initials || 'FC';
}

export const podcastStoryChatTemplate: GraphicTemplate = {
  id: 'podcast-story-chat',
  name: 'Podcast · Story Chat',
  description: '9:16 Story-Chat-Slides mit kumulativem Nachrichtenverlauf und CTA-Slide.',
  category: 'podcast',
  supportedPresetIds: ['1080x1920'],
  htmlTemplate: '',
  css: `
    :root {
      --lav: #9b72cb;
      --lav-l: #ede5f5;
      --lav-d: #7b4fb5;
      --lav-dp: #5c3a8a;
      --bg-chat: #ece5f4;
      --font-heading: 'Fraunces', Georgia, serif;
      --font-body: 'DM Sans', system-ui, sans-serif;
    }

    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .story {
      width: 1080px;
      height: 1920px;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
      background: var(--bg-chat);
      font-family: var(--font-body);
      color: #1a0d2e;
    }

    .story::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 18% 28%, rgba(190,160,230,0.28) 0%, transparent 42%),
        radial-gradient(ellipse at 82% 72%, rgba(210,180,240,0.22) 0%, transparent 38%);
      pointer-events: none;
      z-index: 0;
    }

    .story-inner {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .story-status-bar {
      padding: 52px 52px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 17px;
      font-weight: 700;
      color: #1a0d2e;
      flex-shrink: 0;
    }

    .story-status-icons {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .status-pill {
      width: 24px;
      height: 12px;
      border-radius: 999px;
      background: rgba(42,21,64,0.55);
    }

    .dynamic-island {
      position: absolute;
      top: 72px;
      left: 50%;
      transform: translateX(-50%);
      width: 230px;
      height: 54px;
      background: #000000;
      border-radius: 999px;
      z-index: 5;
    }

    .story-progress {
      display: flex;
      gap: 10px;
      padding: 62px 44px 0;
      flex-shrink: 0;
    }

    .progress-bar {
      flex: 1;
      height: 4px;
      border-radius: 999px;
      background: rgba(100,60,150,0.18);
      overflow: hidden;
    }

    .progress-fill,
    .progress-fill-light {
      width: 100%;
      height: 100%;
      background: #7b4fb5;
      border-radius: 999px;
      display: none;
    }

    .progress-bar.done .progress-fill,
    .progress-bar.active .progress-fill,
    .progress-bar.done .progress-fill-light,
    .progress-bar.active .progress-fill-light {
      display: block;
    }

    .story-chat-header {
      margin: 28px 42px 0;
      padding: 0 8px;
      display: flex;
      align-items: center;
      gap: 16px;
      flex-shrink: 0;
    }

    .story-header-back {
      font-size: 36px;
      color: #7b4fb5;
      line-height: 1;
      flex-shrink: 0;
    }

    .story-avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c4a0d0, #8254b8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 16px;
      font-weight: 800;
      line-height: 1.05;
      text-align: center;
      flex-shrink: 0;
    }

    .story-header-info {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }

    .story-chat-name {
      font-size: 22px;
      font-weight: 700;
      color: #1a0d2e;
    }

    .story-chat-status {
      font-size: 13px;
      color: #7b5aaa;
      font-weight: 500;
    }

    .story-header-right {
      margin-left: auto;
      font-size: 30px;
      color: #7b5aaa;
      line-height: 1;
    }

    .story-panel {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .story-badge {
      align-self: flex-start;
      margin: 22px 42px 0;
      padding: 10px 18px;
      border-radius: 999px;
      background: rgba(123,79,181,0.12);
      color: #6b3fa0;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .story-messages {
      flex: 1;
      padding: 22px 42px 16px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 14px;
      overflow: hidden;
    }

    .s-msg {
      max-width: 78%;
      padding: 18px 22px 12px;
      font-size: 24px;
      line-height: 1.42;
      position: relative;
      opacity: 0;
      transform: translateY(20px);
      animation: msgAppear 0.35s ease-out forwards;
    }

    @keyframes msgAppear {
      to { opacity: 1; transform: translateY(0); }
    }

    .s-msg-in {
      align-self: flex-start;
      background: #ffffff;
      color: #1a0d2e;
      border-radius: 22px 22px 22px 8px;
      box-shadow: 0 2px 12px rgba(80,40,120,0.08);
    }

    .s-msg-out {
      align-self: flex-end;
      background: #5c3a8a;
      color: #ffffff;
      border-radius: 22px 22px 8px 22px;
      box-shadow: 0 4px 16px rgba(80,40,120,0.18);
    }

    .s-msg-time {
      font-size: 13px;
      opacity: 0.55;
      margin-top: 6px;
      display: block;
      font-weight: 600;
    }

    .s-msg-out .s-msg-time {
      text-align: right;
    }

    .s-msg-emoji {
      font-size: 54px;
      background: none !important;
      box-shadow: none !important;
      padding: 0 !important;
      border-radius: 0 !important;
    }

    .s-msg-typing {
      align-self: flex-start;
      background: #ffffff;
      border-radius: 22px 22px 22px 8px;
      box-shadow: 0 2px 12px rgba(80,40,120,0.08);
      padding: 18px 24px;
      display: flex;
      gap: 8px;
      align-items: center;
      opacity: 0;
      animation: msgAppear 0.35s ease-out forwards;
      max-width: 140px;
    }

    .s-typing-dot {
      width: 12px;
      height: 12px;
      background: rgba(80,40,120,0.22);
      border-radius: 50%;
    }

    .story-input-wrap {
      padding: 0 42px 32px;
    }

    .story-input-bar {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .story-input-field {
      flex: 1;
      height: 64px;
      border-radius: 999px;
      border: 1.5px solid rgba(123,79,181,0.2);
      background: #ffffff;
      padding: 0 28px;
      font-size: 17px;
      color: rgba(60,30,90,0.45);
      display: flex;
      align-items: center;
      gap: 0;
    }

    .s-input-label {
      font-size: 17px;
      color: rgba(60,30,90,0.4);
      font-weight: 500;
      flex-shrink: 0;
      padding-right: 14px;
      border-right: 1.5px solid rgba(123,79,181,0.15);
      margin-right: 14px;
    }

    .s-input-hint {
      font-size: 17px;
      color: rgba(60,30,90,0.38);
      flex: 1;
    }

    .story-send-btn {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #7b4fb5;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .story-send-btn svg {
      width: 22px;
      height: 22px;
      fill: #ffffff;
      transform: translateX(2px);
    }

    .story-footer-card {
      display: none;
    }

    .story-brand-row {
      padding: 14px 42px 40px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-shrink: 0;
    }

    .story-brand {
      font-family: var(--font-heading);
      font-style: italic;
      font-weight: 400;
      font-size: 26px;
      color: #7b5aaa;
    }

    .story-handle {
      font-size: 18px;
      font-weight: 700;
      color: rgba(42,21,64,0.65);
    }

    .cta-slide {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: relative;
      background: var(--bg-chat);
    }

    .cta-slide::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 18% 28%, rgba(190,160,230,0.28) 0%, transparent 42%),
        radial-gradient(ellipse at 82% 72%, rgba(210,180,240,0.22) 0%, transparent 38%);
      pointer-events: none;
    }

    .cta-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 42px 36px;
      position: relative;
      z-index: 1;
    }

    .cta-section {
      flex: 1;
      margin: 24px 0 0;
      padding: 0 0 40px;
      display: flex;
      flex-direction: column;
    }

    .cta-badge {
      align-self: flex-start;
      margin-top: 44px;
      padding: 10px 20px;
      border-radius: 999px;
      background: rgba(123,79,181,0.12);
      color: #6b3fa0;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .cta-card {
      margin-top: 30px;
      border-radius: 28px;
      background: rgba(255,255,255,0.82);
      border: 1px solid rgba(123,79,181,0.14);
      padding: 32px 34px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .cta-card-top {
      display: flex;
      align-items: center;
      gap: 22px;
    }

    .cta-play-circle {
      width: 110px;
      height: 110px;
      border-radius: 50%;
      background: linear-gradient(135deg, #c4a0d0, #7b4fb5);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .cta-play-circle svg {
      width: 38px;
      height: 38px;
      fill: #ffffff;
      transform: translateX(2px);
    }

    .cta-card-copy {
      flex: 1;
    }

    .cta-heading {
      font-family: var(--font-heading);
      font-size: 64px;
      font-weight: 700;
      line-height: 1.06;
      letter-spacing: -0.03em;
      color: #1a0d2e;
      margin-bottom: 14px;
    }

    .cta-episode {
      font-size: 22px;
      color: rgba(42,21,64,0.62);
      line-height: 1.45;
      margin-bottom: 10px;
    }

    .cta-sub {
      font-size: 20px;
      color: rgba(42,21,64,0.72);
    }

    .cta-button {
      margin-top: 34px;
      width: 100%;
      min-height: 88px;
      border-radius: 999px;
      background: #6b3fa0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 800;
      color: #ffffff;
    }

    .cta-handle {
      text-align: center;
      font-size: 20px;
      color: rgba(42,21,64,0.55);
      margin-top: 36px;
    }

    .story-accent-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #9b72cb, #c4a0d0, #7b4fb5);
      z-index: 20;
    }
  `,
  fields: [
    {
      id: 'messages',
      label: 'Chat-Nachrichten (--- = neue Slide)',
      type: 'textarea',
      multiline: true,
      helpText:
        'IN: weiß links · OUT: lila rechts · TYPING = Animation · --- = nächste Slide · Zeit mit | 14:22 anhängen',
    },
    { id: 'chatName', label: 'Chat-Name', type: 'text' },
    { id: 'chatStatus', label: 'Status', type: 'text' },
    { id: 'episodeNumber', label: 'Folgennummer', type: 'number' },
    { id: 'episodeTitle', label: 'Folgentitel', type: 'text' },
    { id: 'showName', label: 'Showname / Logo', type: 'text' },
    { id: 'handle', label: 'Handle', type: 'text' },
    { id: 'ctaHeading', label: 'CTA-Titel', type: 'text' },
    { id: 'ctaButtonLabel', label: 'CTA-Button', type: 'text' },
    { id: 'ctaHandleText', label: 'CTA-Unterzeile', type: 'text' },
    { id: 'inputPlaceholder', label: 'Input-Text', type: 'text' },
  ],
  defaults: {
    messages: `IN: Neue Folge schon gehört? | 14:22
OUT: Noch nicht – worum geht's diesmal? | 14:23
---
IN: Um Familienrituale, Identität und die Sache mit Lyoner-Wurst. | 14:24
OUT: Klingt wild 😄 | 14:24
---
OUT: Schick mir den Link! | 14:25
TYPING`,
    chatName: 'Link in Bio',
    chatStatus: 'Podcast-Chat · online',
    episodeNumber: '4',
    episodeTitle: 'Büchse der Lyoner – mit Anıl',
    showName: 'Link in Bio',
    handle: '@yasminpolat',
    ctaHeading: 'Jetzt neue Folge hören',
    ctaButtonLabel: 'Play drücken',
    ctaHandleText: 'Mehr Updates bei @yasminpolat',
    inputPlaceholder: 'Nachricht schreiben...',
  },

  resolveSlides: (values: FieldValues): TemplateSlideRenderDefinition[] => {
    const raw = String(values.messages ?? '');
    const blocks = raw
      .split('---')
      .map((block) => block.trim())
      .filter(Boolean);

    const parsedSlides = blocks.map((block) =>
      block
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map(parseStoryLine)
    );

    const totalSlides = parsedSlides.length + 1;
    const avatar = buildAvatar(String(values.chatName ?? 'FC'));
    const episodeNumber = escapeHtml(String(values.episodeNumber ?? ''));
    const episodeTitle = escapeHtml(String(values.episodeTitle ?? ''));
    const chatName = escapeHtml(String(values.chatName ?? ''));
    const chatStatus = escapeHtml(String(values.chatStatus ?? ''));
    const showName = escapeHtml(String(values.showName ?? ''));
    const handle = escapeHtml(String(values.handle ?? ''));
    const ctaHeading = escapeHtml(String(values.ctaHeading ?? ''));
    const ctaButtonLabel = escapeHtml(String(values.ctaButtonLabel ?? ''));
    const ctaHandleText = escapeHtml(String(values.ctaHandleText ?? ''));
    const inputPlaceholder = escapeHtml(String(values.inputPlaceholder ?? ''));

    const slides: StorySlide[] = [];
    let cumulative: StoryMessage[] = [];

    parsedSlides.forEach((slideMessages, index) => {
      cumulative = cumulative.concat(slideMessages);

      const progressHtml = buildProgressBars(totalSlides, index);
      const messagesHtml = buildMessagesHtml(cumulative, slideMessages.length);

      slides.push({
        id: `chat-${index + 1}`,
        kind: 'chat',
        index,
        total: totalSlides,
        html: `
          <div class="story">
            <div class="dynamic-island"></div>

            <div class="story-inner">
              <div class="story-status-bar">
                <span>9:41</span>
                <div class="story-status-icons">
                  <span class="status-pill"></span>
                  <span class="status-pill" style="width:18px;"></span>
                  <span class="status-pill" style="width:34px;"></span>
                </div>
              </div>

              <div class="story-progress">
                ${progressHtml}
              </div>

              <div class="story-chat-header">
                <div class="story-header-back" aria-hidden="true">‹</div>
                <div class="story-avatar">${escapeHtml(avatar)}</div>
                <div class="story-header-info">
                  <div class="story-chat-name">${chatName}</div>
                  <div class="story-chat-status">${chatStatus}</div>
                </div>
                <div class="story-header-right" aria-hidden="true">📞</div>
              </div>

              <div class="story-panel">
                <div class="story-badge">Folge #${episodeNumber}</div>

                <div class="story-messages">
                  ${messagesHtml}
                </div>

                <div class="story-input-wrap">
                  <div class="story-input-bar">
                    <div class="story-input-field">
                      <span class="s-input-label">iMessage</span>
                      <span class="s-input-hint">${inputPlaceholder}</span>
                    </div>
                    <div class="story-send-btn">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="story-brand-row">
                <div class="story-brand">${showName}</div>
                <div class="story-handle">${handle}</div>
              </div>
            </div>

            <div class="story-accent-line"></div>
          </div>
        `,
      });
    });

    slides.push({
      id: 'cta',
      kind: 'cta',
      index: totalSlides - 1,
      total: totalSlides,
      html: `
        <div class="story">
          <div class="dynamic-island"></div>

          <div class="cta-slide" style="display:flex;">
            <div class="story-status-bar">
              <span>9:41</span>
              <div class="story-status-icons">
                <span class="status-pill"></span>
                <span class="status-pill" style="width:18px;"></span>
                <span class="status-pill" style="width:34px;"></span>
              </div>
            </div>

            <div class="story-progress" style="padding-top:62px;">
              ${buildProgressBars(totalSlides, totalSlides - 1, true)}
            </div>

            <div class="story-chat-header">
              <div class="story-header-back" aria-hidden="true">‹</div>
              <div class="story-avatar">${escapeHtml(avatar)}</div>
              <div class="story-header-info">
                <div class="story-chat-name">${chatName}</div>
                <div class="story-chat-status">${chatStatus}</div>
              </div>
              <div class="story-header-right" aria-hidden="true">📞</div>
            </div>

            <div class="cta-inner">
              <div class="cta-section">
                <div class="cta-badge">Neue Podcast-Folge</div>

                <div class="cta-card">
                  <div class="cta-card-top">
                    <div class="cta-play-circle">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                    <div class="cta-card-copy">
                      <div class="cta-heading">${ctaHeading}</div>
                      <div class="cta-episode">Folge #${episodeNumber} · ${episodeTitle}</div>
                      <div class="cta-sub">${showName}</div>
                    </div>
                  </div>
                </div>

                <div class="cta-button">${ctaButtonLabel}</div>
                <div class="cta-handle">${ctaHandleText}</div>
              </div>
            </div>

            <div class="story-brand-row">
              <div class="story-brand">${showName}</div>
              <div class="story-handle">${handle}</div>
            </div>
          </div>

          <div class="story-accent-line"></div>
        </div>
      `,
    });

    return slides;
  },
};
