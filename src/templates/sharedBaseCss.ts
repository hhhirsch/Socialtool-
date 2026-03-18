export const sharedBaseCss = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg: #0f172a;
  --bg2: #131f35;
  --gold: #e8b84b;
  --gold-dim: rgba(232,184,75,0.6);
  --gold-faint: rgba(232,184,75,0.08);
  --gold-border: rgba(232,184,75,0.2);
  --grid: rgba(255,255,255,0.025);
  --text: #e2e8f0;
  --text-mid: rgba(203,213,225,0.65);
  --text-soft: rgba(148,163,184,0.7);
  --text-muted: rgba(203,213,225,0.45);
  --border-sub: rgba(255,255,255,0.05);
  --border-gold: rgba(232,184,75,0.12);
}

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: 'DM Sans', sans-serif;
}

body {
  background: transparent;
}

.slide {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--bg);
  overflow: hidden;
  flex-shrink: 0;
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 54px 54px;
}

.topbar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  z-index: 10;
  background: linear-gradient(90deg, var(--gold) 0%, rgba(232,184,75,0.3) 60%, transparent 100%);
}

.tag {
  position: absolute;
  top: 56px;
  left: 72px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 5;
}

.tag-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 10px rgba(232,184,75,0.6);
}

.tag-text {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--gold-dim);
}

.badge {
  position: absolute;
  top: 48px;
  right: 72px;
  z-index: 5;
  border-radius: 30px;
  padding: 7px 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.badge--gold   { background: rgba(232,184,75,0.12); border: 1px solid rgba(232,184,75,0.4); color: var(--gold); }
.badge--blue   { background: rgba(96,165,250,0.1); border: 1px solid rgba(96,165,250,0.35); color: #60a5fa; }
.badge--green  { background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.35); color: #34d399; }
.badge--slate  { background: rgba(148,163,184,0.1); border: 1px solid rgba(148,163,184,0.3); color: rgba(203,213,225,0.8); }

.bottom {
  position: absolute;
  bottom: 64px;
  left: 72px;
  right: 72px;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 22px;
  border-top: 1px solid var(--border-gold);
}

.publisher {
  font-size: 14px;
  font-weight: 400;
  color: var(--text-muted);
}

.brand {
  font-family: 'Instrument Serif', serif;
  font-size: 20px;
  color: rgba(255,255,255,0.2);
  letter-spacing: -0.5px;
  text-align: right;
}

.brand em { font-style: italic; }

.accent-stripe {
  position: absolute;
  left: 0;
  top: 25%;
  width: 3px;
  height: 30%;
  background: linear-gradient(to bottom, transparent, var(--gold), transparent);
  opacity: 0.4;
  z-index: 1;
}

.glow {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232,184,75,0.08) 0%, transparent 60%);
}

.glow--tl { top: -200px; left: -150px; width: 700px; height: 700px; }
.glow--br { bottom: -200px; right: -150px; width: 600px; height: 600px; opacity: 0.6; }

.glow--blue-tr {
  top: -200px;
  right: -150px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 60%);
}

.glow--green-bl {
  bottom: -200px;
  left: -100px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(52,211,153,0.06) 0%, transparent 60%);
}

.watermark {
  position: absolute;
  font-family: 'Instrument Serif', serif;
  font-style: italic;
  color: rgba(232,184,75,0.04);
  line-height: 1;
  user-select: none;
  z-index: 1;
}

.rule {
  width: 64px;
  height: 2px;
  background: var(--gold);
  opacity: 0.7;
}
`;
