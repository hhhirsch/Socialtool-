# Social Tool – LinkedIn Graphic Builder

Eine mobile-first Web-App zum Erstellen wiederverwendbarer LinkedIn-Grafiken. Statt HTML zu bearbeiten, füllen Nutzer Plain-Text-Felder aus. Die App setzt diese Inhalte in feste Design-Vorlagen ein, rendert die Grafik isoliert im `iframe` und exportiert sie als PNG oder über den Browser-Print-Flow als PDF.

## Features

- **Formularbasierte Content-Erstellung** mit dynamisch generierten Feldern aus der aktiven Template-Definition
- **5 LinkedIn-Vorlagen**: Hero Slide, Quote Post, Header Banner, Link Preview Card, Carousel Slide
- **7 Format-Presets**: 1200×644, 600×322, 1200×627, 1080×1080, 1080×1350, 1584×396, 1128×191
- **Live-Vorschau im isolierten iframe** mit Fit/50/75/100 Zoom und Hintergrundumschaltung
- **PNG-Export** in Originalgröße via `html2canvas`
- **PDF-Export** über eine druckoptimierte Einzelansicht der Grafik
- **Debounced localStorage-Persistenz** für Template, Preset, Feldwerte und UI-Zustand
- **Readonly Expertenmodus** mit generiertem HTML/CSS für Debugging ohne die Standard-UX zu stören
- **Mobile-first Navigation** mit Tabs und fixer Bottom Action Bar

## Setup

```bash
npm install
```

## Entwicklung starten

```bash
npm run dev
```

Danach ist die App standardmäßig unter `http://localhost:5173` erreichbar.

## Production Build

```bash
npm run build
```

## Linting

```bash
npm run lint
```

## Verwendete Libraries

| Library | Zweck |
| --- | --- |
| React 19 | UI, State und Komponentenmodell |
| TypeScript | Typisierte Datenmodelle und Utilities |
| Vite 8 | Development-Server und Build-Pipeline |
| html2canvas | PNG-Export aus der isolierten Grafik |
| CSS Modules | Komponentenlokales Styling |

## Projektstruktur

```text
src/
├── components/
│   ├── AppShell.tsx            # Hauptlayout, Tabs und View-Komposition
│   ├── BottomActionBar.tsx     # Fixe mobile Aktionsleiste
│   ├── DynamicFieldForm.tsx    # Dynamisch erzeugte Formularfelder
│   ├── FieldRenderer.tsx       # Eingabe-Komponente pro Feldtyp
│   ├── PreviewPanel.tsx        # Vorschau mit Zoom und Background Toggle
│   ├── PreviewFrame.tsx        # Isolierter iframe-Renderer
│   ├── PresetSelector.tsx      # Auswahl der LinkedIn-Formate
│   ├── TabNavigation.tsx       # Inhalt / Vorschau / Vorlagen / Erweitert
│   ├── TemplateLibrary.tsx     # Bibliothek aller Template-Karten
│   └── TemplateSelector.tsx    # Schnellauswahl im Content-Tab
├── constants/
│   └── index.ts                # Format-Presets und App-Konstanten
├── hooks/
│   ├── useAppState.ts          # Zentrales State-Management + Persistenz
│   └── useDebounce.ts          # Debounced Effects
├── templates/
│   └── index.ts                # Datengetriebene Template-Registry
├── types/
│   └── index.ts                # Preset-, Field-, Template- und App-State-Typen
└── utils/
    ├── exportPdf.ts            # Print-optimierter PDF-Flow
    ├── exportPng.ts            # PNG-Export in Originalauflösung
    ├── generateFilename.ts     # Sinnvolle Export-Dateinamen
    ├── previewDocument.ts      # HTML-Dokument für iframe / Export
    ├── renderTemplate.ts       # Platzhalterersetzung mit Escaping
    ├── sanitizeHtml.ts         # Entfernung potenziell gefährlicher HTML-Elemente
    ├── storage.ts              # localStorage Laden/Speichern mit Fallbacks
    ├── presets.ts              # Preset-Lookup
    └── templateRegistry.ts     # Zugriff auf zentrale Template-Definitionen
```

## Template-Erweiterung

Neue Vorlagen werden zentral in `src/templates/index.ts` ergänzt. Jede Vorlage definiert:

- `id`, `name`, `description`
- `supportedPresetIds`
- `htmlTemplate` mit Platzhaltern wie `{{title}}`
- `css` für die isolierte Grafik
- `fields` für die dynamische Formularerzeugung
- `defaults` für sinnvolle Startwerte

Die Render-Pipeline (`renderTemplate.ts`) escaped alle Plain-Text-Werte und ersetzt bei Textareas Zeilenumbrüche durch `<br />`. Dadurch bleiben Inhalt und Layout sauber getrennt.

## Bekannte technische Grenzen des Exports

- **PNG / html2canvas**: Sehr komplexe CSS-Effekte, externe Webfonts oder Third-Party-Assets können je nach Browser leicht abweichen.
- **PDF-Export**: Nutzt den nativen Browser-Print-Dialog. Die finale PDF-Qualität hängt deshalb auch vom Browser und dessen Print-Engine ab.
- **Externe Bilder**: CORS-Einschränkungen können verhindern, dass nicht eingebettete Bilder im PNG landen.
- **Popup-Blocker**: Für den PDF-Export muss das Öffnen des Print-Fensters erlaubt sein.
- **Safari iOS**: `html2canvas` ist dort prinzipiell unterstützt, kann aber auf älteren Geräten eingeschränkter rendern.

## Sicherheit und Robustheit

- Vorschau und Exporte nutzen ein **isoliertes iframe-Dokument**
- `sanitizeHtml.ts` entfernt `script`, `iframe`, Event-Handler und gefährliche URL-Schemata
- Nutzer bearbeiten standardmäßig **keinen HTML/CSS-Code**, sondern nur Plain Text
- Defekte localStorage-Daten werden mit robusten Defaults abgefangen
