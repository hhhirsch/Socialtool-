import type { GraphicTemplate } from './types';

export const podcastChatTileTemplate: GraphicTemplate = {
  id: 'podcast-chat-tile',
  name: 'Podcast · Chat-Kachel',
  description: 'Quadratische Instagram-Kachel im iPhone-Chat-Stil für Podcast-Episoden.',
  category: 'podcast',
  supportedPresetIds: ['1080x1080'],
  htmlTemplate: `
    <div class="tile">
      <div class="tile-content">
        <div class="tile-top">
          <div class="tile-logo">{{showName}}</div>
          <div class="tile-episode-badge">FOLGE #{{episodeNumber}}</div>
        </div>

        <div class="iphone">
          <div class="dynamic-island"></div>

          <div class="chat-header">
            <div class="chat-back">‹</div>
            <div class="chat-avatar">{{avatar}}</div>
            <div class="chat-header-info">
              <div class="chat-name">{{chatName}}</div>
              <div class="chat-status">{{chatStatus}}</div>
            </div>
          </div>

          <div class="chat-messages">
            {{messagesHtml}}
          </div>

          <div class="chat-input-bar">
            <div class="chat-input-field">iMessage</div>
            <div class="chat-send-btn">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div class="tile-bottom">
          <div class="tile-meta">
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
      top: -160px;
      right: -140px;
      width: 480px;
      height: 480px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(196,160,208,0.45) 0%, transparent 70%);
      pointer-events: none;
    }

    .tile::after {
      content: '';
      position: absolute;
      bottom: -100px;
      left: -60px;
      width: 340px;
      height: 340px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(155,110,181,0.2) 0%, transparent 70%);
      pointer-events: none;
    }

    .tile-content {
      position: relative;
      z-index: 1;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 56px 64px 48px;
    }

    .tile-top {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .tile-logo {
      font-family: var(--font-heading);
      font-style: italic;
      font-weight: 400;
      font-size: 26px;
      color: var(--lav-dp);
    }

    .tile-episode-badge {
      font-family: var(--font-body);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--lav-dp);
      background: var(--lav-l);
      padding: 8px 20px;
      border-radius: 999px;
    }

    .iphone {
      width: 420px;
      flex: 1;
      min-height: 0;
      background: #ffffff;
      border-radius: 48px;
      border: 6px solid #1a1020;
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow:
        0 4px 20px rgba(42,21,64,0.15),
        0 20px 60px rgba(42,21,64,0.1),
        inset 0 0 0 2px rgba(255,255,255,0.6);
    }

    .dynamic-island {
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 34px;
      background: #1a1020;
      border-radius: 20px;
      z-index: 10;
    }

    .chat-header {
      padding: 60px 24px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid rgba(196,160,208,0.2);
      background: rgba(245,238,250,0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      flex-shrink: 0;
    }

    .chat-back {
      font-size: 22px;
      color: var(--lav-dp);
      font-weight: 500;
      line-height: 1;
    }

    .chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--lav), var(--lav-dp));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 15px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .chat-header-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .chat-name {
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 600;
      color: var(--td);
      line-height: 1.2;
    }

    .chat-status {
      font-size: 11px;
      color: var(--tl);
      font-weight: 500;
    }

    .chat-messages {
      flex: 1;
      overflow: hidden;
      padding: 20px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #faf6fe;
    }

    .msg {
      max-width: 82%;
      padding: 12px 16px;
      font-family: var(--font-body);
      font-size: 15.5px;
      line-height: 1.45;
      position: relative;
      word-wrap: break-word;
    }

    .msg-in {
      align-self: flex-start;
      background: #ffffff;
      color: var(--td);
      border-radius: 20px 20px 20px 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }

    .msg-out {
      align-self: flex-end;
      background: var(--lav-dp);
      color: #ffffff;
      border-radius: 20px 20px 6px 20px;
    }

    .msg-time {
      font-size: 10.5px;
      opacity: 0.5;
      margin-top: 4px;
      display: block;
    }

    .msg-out .msg-time {
      text-align: right;
    }

    .msg-emoji {
      font-size: 32px;
      background: none;
      box-shadow: none;
      padding: 4px 0;
    }

    .msg-typing {
      align-self: flex-start;
      background: #ffffff;
      border-radius: 20px 20px 20px 6px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      padding: 14px 20px;
      display: flex;
      gap: 5px;
      align-items: center;
    }

    .typing-dot {
      width: 8px;
      height: 8px;
      background: var(--lav);
      border-radius: 50%;
      animation: typingBounce 1.4s infinite ease-in-out;
    }

    .typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    .chat-input-bar {
      padding: 10px 16px 28px;
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(245,238,250,0.9);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-top: 1px solid rgba(196,160,208,0.15);
      flex-shrink: 0;
    }

    .chat-input-field {
      flex: 1;
      height: 36px;
      border-radius: 18px;
      border: 1.5px solid rgba(196,160,208,0.35);
      background: white;
      padding: 0 16px;
      font-family: var(--font-body);
      font-size: 14px;
      color: var(--tl);
      display: flex;
      align-items: center;
    }

    .chat-send-btn {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--lav-dp);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .chat-send-btn svg {
      width: 16px;
      height: 16px;
      fill: white;
      transform: rotate(-30deg) translateX(1px);
    }

    .tile-bottom {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 20px;
    }

    .tile-meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .tile-episode-title {
      font-family: var(--font-body);
      font-size: 17px;
      font-weight: 600;
      color: var(--td);
    }

    .tile-tags {
      display: flex;
      gap: 8px;
      margin-top: 4px;
      flex-wrap: wrap;
    }

    .tile-tag {
      font-family: var(--font-body);
      font-size: 12px;
      font-weight: 600;
      color: var(--lav-dp);
      background: var(--lav-l);
      padding: 4px 12px;
      border-radius: 20px;
    }

    .tile-handle {
      font-family: var(--font-body);
      font-size: 16px;
      font-weight: 500;
      color: var(--tl);
      white-space: nowrap;
    }

    .tile-accent-line {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, var(--lav-dp), var(--lav), var(--lav-l));
      z-index: 2;
    }
  `,
  fields: [
    {
      id: 'messages',
      label: 'Chat-Nachrichten',
      type: 'textarea',
      multiline: true,
      helpText:
        'IN: eingehend links · OUT: ausgehend rechts · EMOJI: großes Emoji · TYPING für Tipp-Animation · Zeit mit | 14:22 anhängen',
    },
    { id: 'chatName', label: 'Chat-Name', type: 'text' },
    { id: 'chatStatus', label: 'Status-Zeile', type: 'text' },
    { id: 'avatar', label: 'Avatar-Kürzel', type: 'text' },
    { id: 'episodeNumber', label: 'Folgennummer', type: 'number' },
    { id: 'episodeTitle', label: 'Folgentitel', type: 'text' },
    { id: 'tags', label: 'Tags (kommagetrennt)', type: 'text' },
    { id: 'handle', label: 'Handle', type: 'text' },
    { id: 'showName', label: 'Showname / Logo', type: 'text' },
  ],
  defaults: {
    messages: `IN: Anıl, was hat Lyoner-Wurst für dich mit Identität zu tun? | 14:22
OUT: Alter, alles. Wenn meine Oma die Lyoner aufgeschnitten hat, war das wie ein Ritual. | 14:23
IN: Ein Ritual? 😄 | 14:23
OUT: Ja! Das Essen war immer der Moment, wo alle zusammenkamen. Da war alles gut. | 14:24
TYPING`,
    chatName: 'Family Chat',
    chatStatus: 'Yasmin, Anıl',
    avatar: 'FC',
    episodeNumber: '4',
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

    const rawMessages = String(values.messages ?? '');
    const lines = rawMessages
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const messagesHtml = lines
      .map((line) => {
        if (line.toUpperCase() === 'TYPING') {
          return `
            <div class="msg msg-typing">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          `;
        }

        let direction = 'in';
        let isEmoji = false;
        let text = line;

        if (/^OUT:/i.test(text)) {
          direction = 'out';
          text = text.replace(/^OUT:\s*/i, '');
        } else if (/^IN:/i.test(text)) {
          direction = 'in';
          text = text.replace(/^IN:\s*/i, '');
        } else if (/^EMOJI:/i.test(text)) {
          isEmoji = true;
          direction = 'in';
          text = text.replace(/^EMOJI:\s*/i, '');
        }

        let time = '';
        const timeParts = text.split('|');
        if (timeParts.length > 1) {
          time = timeParts.pop()?.trim() ?? '';
          text = timeParts.join('|').trim();
        }

        const messageClass = isEmoji
          ? \`msg msg-\${direction} msg-emoji\`
          : \`msg msg-\${direction}\`;

        return \`
          <div class="\${messageClass}">
            \${escapeHtml(text)}
            \${time ? \`<span class="msg-time">\${escapeHtml(time)}</span>\` : ''}
          </div>
        \`;
      })
      .join('');

    const tags = String(values.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);

    const tagsHtml = tags
      .map((tag) => \`<span class="tile-tag">\${escapeHtml(tag)}</span>\`)
      .join('');

    return {
      ...values,
      messagesHtml,
      tagsHtml,
    };
  },
  rawHtmlPlaceholders: ['messagesHtml', 'tagsHtml'],
};
