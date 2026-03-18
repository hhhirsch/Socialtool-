import type { GraphicTemplate } from '../types';

export const GRAPHIC_TEMPLATES: GraphicTemplate[] = [
  {
    id: 'hero-slide',
    name: 'Hero Slide',
    description: 'Klare Hero-Grafik für Ankündigungen, Learnings oder Hook-Statements mit starker Headline.',
    supportedPresetIds: ['1200x627', '1080x1080', '1080x1350'],
    htmlTemplate: `
      <section class="hero-template">
        <div class="hero-template__meta">
          <span class="hero-template__eyebrow">{{eyebrow}}</span>
          <span class="hero-template__label">{{label}}</span>
        </div>
        <div class="hero-template__body">
          <h1 class="hero-template__title">
            {{title}}
            <span class="hero-template__highlight">{{highlightedWord}}</span>
          </h1>
          <p class="hero-template__subtitle">{{subtitle}}</p>
        </div>
        <div class="hero-template__footer">
          <span>{{footerLeft}}</span>
          <span>{{footerRight}}</span>
        </div>
        <div class="hero-template__cta">{{callToAction}}</div>
      </section>
    `,
    css: `
      .hero-template {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: clamp(30px, 5vw, 72px);
        background:
          radial-gradient(circle at top right, rgba(125, 211, 252, 0.45), transparent 35%),
          linear-gradient(135deg, #eff6ff 0%, #dbeafe 45%, #bfdbfe 100%);
        color: #0f172a;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      }
      .hero-template__meta,
      .hero-template__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        font-size: clamp(18px, 2vw, 28px);
      }
      .hero-template__eyebrow,
      .hero-template__label,
      .hero-template__cta {
        display: inline-flex;
        align-items: center;
        padding: 0.5em 0.9em;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.08);
        letter-spacing: 0.04em;
        text-transform: uppercase;
        font-weight: 700;
      }
      .hero-template__body {
        display: grid;
        gap: clamp(20px, 3vw, 36px);
      }
      .hero-template__title {
        font-size: clamp(58px, 8vw, 114px);
        line-height: 0.95;
        font-weight: 800;
        display: grid;
        gap: 0.1em;
        max-width: 9ch;
      }
      .hero-template__highlight {
        color: #2563eb;
      }
      .hero-template__subtitle {
        max-width: 34ch;
        font-size: clamp(24px, 3vw, 38px);
        line-height: 1.35;
        color: rgba(15, 23, 42, 0.8);
      }
      .hero-template__cta {
        width: fit-content;
        background: #0f172a;
        color: white;
        text-transform: none;
        letter-spacing: normal;
      }
    `,
    fields: [
      { id: 'eyebrow', label: 'Eyebrow', type: 'text', maxLength: 40, placeholder: 'Neue Serie' },
      { id: 'label', label: 'Label', type: 'text', maxLength: 30, placeholder: 'LinkedIn Hero' },
      { id: 'title', label: 'Titel', type: 'text', maxLength: 80, placeholder: 'So startest du mit' },
      { id: 'highlightedWord', label: 'Highlight-Wort', type: 'text', maxLength: 24, placeholder: 'klaren Hooks' },
      { id: 'subtitle', label: 'Untertitel / Beschreibung', type: 'textarea', multiline: true, maxLength: 180, placeholder: 'Ein kurzer erklärender Absatz.', helpText: 'Maximal 2-3 kurze Zeilen für mobile Lesbarkeit.' },
      { id: 'footerLeft', label: 'Footer links', type: 'text', maxLength: 40, placeholder: 'hhhirsch.de' },
      { id: 'footerRight', label: 'Footer rechts', type: 'text', maxLength: 40, placeholder: '03/10' },
      { id: 'callToAction', label: 'Call to Action', type: 'text', maxLength: 32, placeholder: 'Mehr erfahren' },
    ],
    defaults: {
      eyebrow: 'Content System',
      label: 'Hero Post',
      title: 'Baue LinkedIn-Grafiken mit',
      highlightedWord: 'klaren Formularen',
      subtitle: 'Template wählen, Text eintragen und sofort eine saubere, exportierbare Social-Grafik erhalten.',
      footerLeft: 'hhhirsch · Socialtool',
      footerRight: 'MVP · 2026',
      callToAction: 'Jetzt exportieren',
    },
  },
  {
    id: 'quote-post',
    name: 'Quote Post',
    description: 'Quadratisches oder vertikales Zitat-Layout mit Fokus auf einer Kernaussage und Autorensignatur.',
    supportedPresetIds: ['1080x1080', '1080x1350'],
    htmlTemplate: `
      <section class="quote-template">
        <div class="quote-template__header">
          <span class="quote-template__category">{{category}}</span>
          <span class="quote-template__page">{{pageNumber}}</span>
        </div>
        <div class="quote-template__body">
          <div class="quote-template__mark">“</div>
          <h1 class="quote-template__quote">{{title}}</h1>
          <p class="quote-template__author">{{footerLeft}}</p>
          <p class="quote-template__role">{{footerRight}}</p>
        </div>
        <div class="quote-template__cta">{{callToAction}}</div>
      </section>
    `,
    css: `
      .quote-template {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: clamp(32px, 5vw, 72px);
        background: linear-gradient(160deg, #020617 0%, #0f172a 55%, #1d4ed8 100%);
        color: #f8fafc;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      }
      .quote-template__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        font-size: clamp(18px, 2vw, 28px);
        color: rgba(248, 250, 252, 0.72);
      }
      .quote-template__category,
      .quote-template__page,
      .quote-template__cta {
        padding: 0.45em 0.85em;
        border-radius: 999px;
        background: rgba(248, 250, 252, 0.1);
      }
      .quote-template__body {
        display: grid;
        gap: clamp(20px, 3vw, 32px);
      }
      .quote-template__mark {
        font-size: clamp(120px, 16vw, 220px);
        line-height: 0.7;
        color: rgba(96, 165, 250, 0.6);
      }
      .quote-template__quote {
        font-size: clamp(50px, 7vw, 96px);
        line-height: 1.05;
        max-width: 10ch;
      }
      .quote-template__author {
        font-size: clamp(24px, 3vw, 36px);
        font-weight: 700;
      }
      .quote-template__role {
        font-size: clamp(18px, 2.5vw, 28px);
        color: rgba(248, 250, 252, 0.72);
      }
      .quote-template__cta {
        width: fit-content;
        font-weight: 700;
      }
    `,
    fields: [
      { id: 'category', label: 'Kategorie', type: 'text', maxLength: 30, placeholder: 'Zitat' },
      { id: 'pageNumber', label: 'Seitenzahl', type: 'text', maxLength: 10, placeholder: '01/05' },
      { id: 'title', label: 'Zitat', type: 'textarea', multiline: true, maxLength: 180, placeholder: 'Das Zitat für die Grafik.', helpText: 'Längere Texte werden automatisch mit Zeilenumbrüchen dargestellt.' },
      { id: 'footerLeft', label: 'Autor', type: 'text', maxLength: 40, placeholder: 'Max Mustermann' },
      { id: 'footerRight', label: 'Rolle / Kontext', type: 'text', maxLength: 60, placeholder: 'Founder · Company' },
      { id: 'callToAction', label: 'CTA', type: 'text', maxLength: 32, placeholder: 'Beitrag speichern' },
    ],
    defaults: {
      category: 'Leadership Quote',
      pageNumber: '01/05',
      title: '„Klare Systeme schlagen spontane Hektik – besonders bei wiederholbaren Social-Formaten.“',
      footerLeft: 'H. Hirsch',
      footerRight: 'Senior Frontend Engineer',
      callToAction: 'Beitrag merken',
    },
  },
  {
    id: 'header-banner',
    name: 'Header Banner',
    description: 'Breiter LinkedIn-Banner mit Claim, Unterzeile und CTA für Profil- oder Kampagnenheader.',
    supportedPresetIds: ['1584x396', '1128x191'],
    htmlTemplate: `
      <section class="banner-template">
        <div class="banner-template__content">
          <span class="banner-template__label">{{label}}</span>
          <h1 class="banner-template__title">{{title}}</h1>
          <p class="banner-template__subtitle">{{subtitle}}</p>
        </div>
        <div class="banner-template__side">
          <span class="banner-template__badge">{{category}}</span>
          <div class="banner-template__cta">{{callToAction}}</div>
        </div>
      </section>
    `,
    css: `
      .banner-template {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
        gap: clamp(18px, 3vw, 56px);
        padding: clamp(20px, 3vw, 52px);
        background: linear-gradient(90deg, #111827 0%, #1f2937 48%, #3b82f6 100%);
        color: white;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      }
      .banner-template__content {
        display: grid;
        gap: clamp(8px, 1.6vw, 18px);
      }
      .banner-template__label,
      .banner-template__badge,
      .banner-template__cta {
        width: fit-content;
        padding: 0.45em 0.85em;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.12);
        font-size: clamp(14px, 1.3vw, 22px);
        font-weight: 700;
      }
      .banner-template__title {
        font-size: clamp(34px, 4vw, 68px);
        line-height: 1;
        max-width: 14ch;
      }
      .banner-template__subtitle {
        font-size: clamp(18px, 1.8vw, 30px);
        line-height: 1.35;
        max-width: 42ch;
        color: rgba(255, 255, 255, 0.84);
      }
      .banner-template__side {
        display: grid;
        justify-items: end;
        gap: clamp(10px, 1.5vw, 18px);
      }
      .banner-template__cta {
        background: white;
        color: #111827;
      }
    `,
    fields: [
      { id: 'label', label: 'Label', type: 'text', maxLength: 28, placeholder: 'LinkedIn Banner' },
      { id: 'title', label: 'Titel', type: 'text', maxLength: 70, placeholder: 'Senior Frontend Engineer' },
      { id: 'subtitle', label: 'Untertitel', type: 'textarea', multiline: true, maxLength: 140, placeholder: 'Wofür du stehst und was du anbietest.' },
      { id: 'category', label: 'Badge', type: 'text', maxLength: 28, placeholder: 'Remote · Consulting' },
      { id: 'callToAction', label: 'CTA', type: 'text', maxLength: 28, placeholder: 'Let’s connect' },
    ],
    defaults: {
      label: 'Profile Header',
      title: 'LinkedIn-Grafiken mit wiederholbarem System',
      subtitle: 'Formularbasierte Content-Erstellung für schnelle Hero-Posts, Banner und Carousel-Slides.',
      category: 'React · TypeScript',
      callToAction: 'Mehr ansehen',
    },
  },
  {
    id: 'link-preview',
    name: 'Link Preview Card',
    description: 'Karten-Layout für Teaser zu Artikeln, Newslettern oder Landingpages mit klarer CTA-Zone.',
    supportedPresetIds: ['1200x627', '1080x1080', '1080x1350'],
    htmlTemplate: `
      <section class="link-template">
        <div class="link-template__content">
          <span class="link-template__category">{{category}}</span>
          <h1 class="link-template__title">{{title}}</h1>
          <p class="link-template__description">{{description}}</p>
          <div class="link-template__footer">
            <span>{{footerLeft}}</span>
            <span>{{footerRight}}</span>
          </div>
        </div>
        <aside class="link-template__card">
          <span class="link-template__eyebrow">{{label}}</span>
          <div class="link-template__domain">{{callToAction}}</div>
        </aside>
      </section>
    `,
    css: `
      .link-template {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: minmax(0, 1.4fr) minmax(240px, 0.9fr);
        gap: clamp(18px, 3vw, 40px);
        padding: clamp(28px, 5vw, 64px);
        background: linear-gradient(150deg, #f8fafc 0%, #e2e8f0 100%);
        color: #0f172a;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      }
      .link-template__content {
        display: grid;
        align-content: space-between;
        gap: clamp(14px, 2.5vw, 26px);
      }
      .link-template__category,
      .link-template__eyebrow,
      .link-template__domain {
        width: fit-content;
        padding: 0.45em 0.85em;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.08);
        font-size: clamp(16px, 1.8vw, 24px);
        font-weight: 700;
      }
      .link-template__title {
        font-size: clamp(42px, 6vw, 82px);
        line-height: 1.02;
        max-width: 12ch;
      }
      .link-template__description {
        font-size: clamp(22px, 2.5vw, 34px);
        line-height: 1.35;
        max-width: 32ch;
        color: rgba(15, 23, 42, 0.8);
      }
      .link-template__footer {
        display: flex;
        flex-wrap: wrap;
        gap: 12px 20px;
        font-size: clamp(18px, 2vw, 28px);
        color: rgba(15, 23, 42, 0.68);
      }
      .link-template__card {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 12px;
        padding: clamp(20px, 2.5vw, 28px);
        border-radius: 28px;
        background: linear-gradient(180deg, #1d4ed8 0%, #1e3a8a 100%);
        color: white;
        box-shadow: 0 24px 60px rgba(30, 64, 175, 0.25);
      }
      .link-template__eyebrow {
        background: rgba(255, 255, 255, 0.14);
      }
      .link-template__domain {
        background: white;
        color: #1e3a8a;
      }
    `,
    fields: [
      { id: 'category', label: 'Kategorie', type: 'text', maxLength: 30, placeholder: 'Artikel' },
      { id: 'label', label: 'Label', type: 'text', maxLength: 30, placeholder: 'Neu im Blog' },
      { id: 'title', label: 'Titel', type: 'text', maxLength: 90, placeholder: 'Titel der Ressource' },
      { id: 'description', label: 'Beschreibung', type: 'textarea', multiline: true, maxLength: 180, placeholder: 'Kurzer Teaser zum Inhalt.' },
      { id: 'footerLeft', label: 'Footer links', type: 'text', maxLength: 40, placeholder: '5 Min. Lesezeit' },
      { id: 'footerRight', label: 'Footer rechts', type: 'text', maxLength: 40, placeholder: '25.000 Views' },
      { id: 'callToAction', label: 'CTA / Domain', type: 'text', maxLength: 32, placeholder: 'socialtool.dev' },
    ],
    defaults: {
      category: 'Case Study',
      label: 'Link Preview',
      title: 'Vom Formular zur LinkedIn-Grafik in unter einer Minute',
      description: 'Mit festen Templates, Live-Vorschau und Export in Originalgröße bleibt dein Content-Prozess schnell und konsistent.',
      footerLeft: '3 Minuten Lesedauer',
      footerRight: 'Neue Ausgabe',
      callToAction: 'socialtool.local',
    },
  },
  {
    id: 'carousel-slide',
    name: 'Carousel Slide',
    description: 'Mehrseitiges Slide-Layout mit klarer Kapitelstruktur, CTA und Footerinformationen.',
    supportedPresetIds: ['1080x1080', '1080x1350', '1200x627'],
    htmlTemplate: `
      <section class="carousel-template">
        <div class="carousel-template__header">
          <span class="carousel-template__page">{{pageNumber}}</span>
          <span class="carousel-template__category">{{category}}</span>
        </div>
        <div class="carousel-template__content">
          <span class="carousel-template__eyebrow">{{eyebrow}}</span>
          <h1 class="carousel-template__title">{{title}}</h1>
          <p class="carousel-template__description">{{description}}</p>
        </div>
        <div class="carousel-template__footer">
          <span class="carousel-template__footer-left">{{footerLeft}}</span>
          <span class="carousel-template__cta">{{callToAction}}</span>
        </div>
      </section>
    `,
    css: `
      .carousel-template {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: clamp(28px, 5vw, 64px);
        background:
          linear-gradient(180deg, rgba(59, 130, 246, 0.14) 0%, rgba(59, 130, 246, 0) 30%),
          #ffffff;
        color: #0f172a;
        font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
      }
      .carousel-template__header,
      .carousel-template__footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }
      .carousel-template__page,
      .carousel-template__category,
      .carousel-template__eyebrow,
      .carousel-template__cta {
        width: fit-content;
        padding: 0.48em 0.9em;
        border-radius: 999px;
        background: rgba(37, 99, 235, 0.1);
        color: #1d4ed8;
        font-size: clamp(16px, 1.8vw, 24px);
        font-weight: 700;
      }
      .carousel-template__content {
        display: grid;
        gap: clamp(16px, 2.5vw, 28px);
      }
      .carousel-template__title {
        font-size: clamp(48px, 6vw, 92px);
        line-height: 1.02;
        max-width: 11ch;
      }
      .carousel-template__description {
        max-width: 30ch;
        font-size: clamp(22px, 2.5vw, 34px);
        line-height: 1.35;
        color: rgba(15, 23, 42, 0.8);
      }
      .carousel-template__footer-left {
        font-size: clamp(18px, 2vw, 28px);
        color: rgba(15, 23, 42, 0.68);
      }
      .carousel-template__cta {
        background: #1d4ed8;
        color: white;
      }
    `,
    fields: [
      { id: 'pageNumber', label: 'Seitenzahl', type: 'text', maxLength: 10, placeholder: '03/08' },
      { id: 'category', label: 'Kategorie', type: 'text', maxLength: 30, placeholder: 'Guide' },
      { id: 'eyebrow', label: 'Eyebrow', type: 'text', maxLength: 30, placeholder: 'Kapitel 3' },
      { id: 'title', label: 'Titel', type: 'text', maxLength: 80, placeholder: 'Ein klarer Zwischentitel' },
      { id: 'description', label: 'Beschreibung', type: 'textarea', multiline: true, maxLength: 180, placeholder: 'Knapper erklärender Copy-Block.' },
      { id: 'footerLeft', label: 'Footer links', type: 'text', maxLength: 50, placeholder: 'Swipe für mehr' },
      { id: 'callToAction', label: 'CTA', type: 'text', maxLength: 28, placeholder: 'Weiter →' },
    ],
    defaults: {
      pageNumber: '03/08',
      category: 'Carousel',
      eyebrow: 'Kapitel 3',
      title: 'Strukturiere Inhalt und Layout getrennt voneinander',
      description: 'So bleiben Vorlagen wiederverwendbar, Inhalte schneller austauschbar und Exporte stabil reproduzierbar.',
      footerLeft: 'Swipe für die nächsten Tipps',
      callToAction: 'Weiter lesen',
    },
  },
];

export const DEFAULT_TEMPLATE_ID = GRAPHIC_TEMPLATES[0].id;
