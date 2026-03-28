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
      --lav: #c4a0d0;
      --lav-l: #e8d5f0;
      --lav-d: #9b6eb5;
      --lav-dp: #6b3f8a;
      --bg: #f5eefa;
      --bg-chat: #0f0820;
      --bg-chat-2: #1d1035;
      --td: #ffffff;
      --tm: #d8cbe7;
      --tl: #b89ccf;
      --green: #47d3a1;
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
      background:
        radial-gradient(circle at 85% 12%, rgba(140, 87, 197, 0.42) 0%, transparent 18%),
        radial-gradient(circle at 8% 82%, rgba(71, 211, 161, 0.14) 0%, transparent 16%),
        linear-gradient(180deg, #2a163d 0%, #12091f 28%, #090510 100%);
      font-family: var(--font-body);
      color: var(--td);
    }

    .story::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 14% 88%, rgba(71,211,161,0.08) 0%, transparent 24%),
        radial-gradient(ellipse at 84% 12%, rgba(196,160,208,0.12) 0%, transparent 24%);
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
      color: #ffffff;
      flex-shrink: 0;
    }

    .story-status-icons {
      display: flex;
      gap: 10px;
      align-items: center;
      color: #ffffff;
    }

    .status-pill {
      width: 24px;
      height: 12px;
      border-radius: 999px;
      background: rgba(255,255,255,0.92);
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
      height: 6px;
      border-radius: 999px;
      background: rgba(255,255,255,0.18);
      overflow: hidden;
    }

    .progress-fill {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border-radius: 999px;
      display: none;
    }

    .progress-bar.done .progress-fill,
    .progress-bar.active .progress-fill {
      display: block;
    }

    .story-chat-header {
      margin: 24px 42px 0;
      padding: 26px 30px;
      display: flex;
      align-items: center;
      gap: 18px;
      border-radius: 40px;
      background: rgba(255,255,255,0.10);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.06);
      flex-shrink: 0;
    }

    .story-avatar {
      width: 62px;
      height: 62px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d6a4ff, #8d54d9);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #111111;
      font-size: 18px;
      font-weight: 800;
      line-height: 1.05;
      text-align: center;
      flex-shrink: 0;
    }

    .story-header-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .story-chat-name {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
    }

    .story-chat-status {
      font-size: 14px;
      color: rgba(255,255,255,0.76);
      font-weight: 500;
    }

    .story-header-right {
      margin-left: auto;
      font-size: 34px;
      color: rgba(255,255,255,0.72);
      line-height: 1;
    }

    .story-panel {
      flex: 1;
      margin: 24px 42px 0;
      border-radius: 42px;
      background: linear-gradient(180deg, rgba(7,2,18,0.88) 0%, rgba(12,4,24,0.96) 100%);
      border: 1px solid rgba(255,255,255,0.04);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }

    .story-badge {
      align-self: flex-start;
      margin: 32px 32px 0;
      padding: 12px 20px;
      border-radius: 999px;
      background: rgba(196,160,208,0.24);
      color: #d8cbe7;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .story-messages {
      flex: 1;
      padding: 22px 30px 16px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      gap: 16px;
      overflow: hidden;
    }

    .s-msg {
      max-width: 78%;
      padding: 20px 24px 14px;
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
      background: #f3f1f4;
      color: #23192f;
      border-radius: 26px 26px 26px 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }

    .s-msg-out {
      align-self: flex-end;
      background: linear-gradient(135deg, #a952ff 0%, #7f45f0 100%);
      color: #ffffff;
      border-radius: 26px 26px 10px 26px;
      box-shadow: 0 6px 20px rgba(127,69,240,0.24);
    }

    .s-msg-time {
      font-size: 14px;
      opacity: 0.58;
      margin-top: 8px;
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
      background: #f3f1f4;
      border-radius: 26px 26px 26px 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      padding: 20px 24px;
      display: flex;
      gap: 8px;
      align-items: center;
      opacity: 0;
      animation: msgAppear 0.35s ease-out forwards;
      max-width: 160px;
    }

    .s-typing-dot {
      width: 12px;
      height: 12px;
      background: rgba(42,21,64,0.28);
      border-radius: 50%;
    }

    .story-input-wrap {
      padding: 0 30px 24px;
    }

    .story-input-bar {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 22px;
    }

    .story-input-field {
      flex: 1;
      height: 68px;
      border-radius: 999px;
      border: 1.5px solid rgba(255,255,255,0.10);
      background: rgba(4,2,12,0.72);
      padding: 0 28px;
      font-size: 18px;
      color: rgba(255,255,255,0.38);
      display: flex;
      align-items: center;
    }

    .story-send-btn {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: #47d3a1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .story-send-btn svg {
      width: 24px;
      height: 24px;
      fill: #08120f;
      transform: translateX(2px);
    }

    .story-footer-card {
      border-radius: 28px;
      background: rgba(4,2,12,0.72);
      border: 1px solid rgba(255,255,255,0.06);
      padding: 22px 26px 24px;
    }

    .story-footer-kicker {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: #d8cbe7;
      text-transform: uppercase;
      margin-bottom: 10px;
    }

    .story-footer-title {
      font-size: 28px;
      line-height: 1.22;
      font-weight: 700;
      color: #ffffff;
    }

    .story-brand-row {
      padding: 22px 42px 36px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      flex-shrink: 0;
    }

    .story-brand {
      font-family: var(--font-heading);
      font-style: italic;
      font-weight: 400;
      font-size: 28px;
      color: #d5b2ff;
    }

    .story-handle {
      font-size: 18px;
      font-weight: 700;
      color: rgba(255,255,255,0.82);
    }

    .cta-slide {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0;
      position: relative;
      background:
        radial-gradient(circle at 85% 12%, rgba(140, 87, 197, 0.42) 0%, transparent 18%),
        radial-gradient(circle at 8% 82%, rgba(71, 211, 161, 0.14) 0%, transparent 16%),
        linear-gradient(180deg, #2a163d 0%, #12091f 28%, #090510 100%);
    }

    .cta-inner {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 42px 36px;
    }

    .cta-section {
      flex: 1;
      margin: 24px 0 0;
      border-radius: 42px;
      background: linear-gradient(180deg, rgba(7,2,18,0.88) 0%, rgba(12,4,24,0.96) 100%);
      border: 1px solid rgba(255,255,255,0.04);
      padding: 0 36px 40px;
      display: flex;
      flex-direction: column;
    }

    .cta-badge {
      align-self: flex-start;
      margin-top: 44px;
      padding: 12px 20px;
      border-radius: 999px;
      background: rgba(71,211,161,0.14);
      color: #47d3a1;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .cta-card {
      margin-top: 30px;
      border-radius: 34px;
      background: rgba(4,2,12,0.72);
      border: 1px solid rgba(255,255,255,0.06);
      padding: 36px 38px;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    .cta-card-top {
      display: flex;
      align-items: center;
      gap: 22px;
    }

    .cta-play-circle {
      width: 124px;
      height: 124px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d6a4ff, #8d54d9);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .cta-play-circle svg {
      width: 42px;
      height: 42px;
      fill: #1a1020;
      transform: translateX(2px);
    }

    .cta-card-copy {
      flex: 1;
    }

    .cta-heading {
      font-family: var(--font-heading);
      font-size: 74px;
      font-weight: 700;
      line-height: 1.06;
      letter-spacing: -0.03em;
      color: #ffffff;
      margin-bottom: 14px;
    }

    .cta-episode {
      font-size: 24px;
      color: rgba(255,255,255,0.72);
      line-height: 1.45;
      margin-bottom: 12px;
    }

    .cta-sub {
      font-size: 22px;
      color: rgba(255,255,255,0.82);
    }

    .cta-button {
      margin-top: 34px;
      width: 100%;
      min-height: 92px;
      border-radius: 999px;
      background: #47d3a1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 800;
      color: #08120f;
    }

    .cta-handle {
      text-align: center;
      font-size: 22px;
      color: rgba(255,255,255,0.76);
      margin-top: 40px;
    }

    .story-accent-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #2f8d72, #8d54d9, #d6a4ff);
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
                <div class="story-avatar">${escapeHtml(avatar)}</div>
                <div class="story-header-info">
                  <div class="story-chat-name">${chatName}</div>
                  <div class="story-chat-status">${chatStatus}</div>
                </div>
                <div class="story-header-right">…</div>
              </div>

              <div class="story-panel">
                <div class="story-badge">Folge #${episodeNumber}</div>

                <div class="story-messages">
                  ${messagesHtml}
                </div>

                <div class="story-input-wrap">
                  <div class="story-input-bar">
                    <div class="story-input-field">${inputPlaceholder}</div>
                    <div class="story-send-btn">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                      </svg>
                    </div>
                  </div>

                  <div class="story-footer-card">
                    <div class="story-footer-kicker">${showName}</div>
                    <div class="story-footer-title">${episodeTitle}</div>
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
              <div class="story-avatar">${escapeHtml(avatar)}</div>
              <div class="story-header-info">
                <div class="story-chat-name">${chatName}</div>
                <div class="story-chat-status">${chatStatus}</div>
              </div>
              <div class="story-header-right">…</div>
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
