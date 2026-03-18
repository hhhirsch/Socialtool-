# Social Tool – LinkedIn Grafik-Editor

Ein mobile-first Web-Tool zum Erstellen und Exportieren von LinkedIn-Grafiken im Browser. HTML + CSS eingeben, live Vorschau sehen, als PNG oder PDF exportieren.

## Features

- **HTML-Eingabe**: Code direkt eingeben oder `.html`/`.htm` Dateien hochladen
- **CSS-Eingabe**: Separates CSS-Eingabefeld, wirkt auf die Vorschau
- **CSS-Vorlagen**: Lokal speichern, laden, umbenennen, löschen, duplizieren
- **Live-Vorschau**: Isoliertes Rendering im iframe, skaliert für kleine Bildschirme
- **LinkedIn-Formate**: 1200×627, 1080×1080, 1080×1350, 1584×396, 1128×191
- **PNG-Export**: Pixel-genaue Ausgabe in Zielauflösung
- **PDF-Export**: Druckoptimierte Ansicht über Browser-Print-Dialog
- **Autosave**: Letzter Zustand wird automatisch in localStorage gespeichert
- **Mobile First**: Optimiert für Smartphone-Nutzung mit Touch-freundlicher Bedienung

## Setup

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffnet die App unter `http://localhost:5173`.

## Build

```bash
npm run build
```

Erstellt einen optimierten Production-Build im `dist/` Ordner.

## Preview (Production Build)

```bash
npm run preview
```

## Verwendete Libraries

| Library | Zweck |
|---|---|
| React 19 | UI-Framework |
| TypeScript | Typsicherheit |
| Vite 8 | Build-Tool und Dev-Server |
| html2canvas | PNG-Export (Client-seitig) |
| CSS Modules | Komponentenlokales Styling |

## Architektur

```
src/
├── components/       # React-Komponenten
│   ├── AppShell      # Hauptlayout mit Tabs und Action Bar
│   ├── TabNavigation # Tab-Leiste (Vorschau/HTML/CSS/Vorlagen)
│   ├── BottomActionBar # Fixe Aktionsleiste unten
│   ├── PresetSelector  # Format-Auswahl (Bottom Sheet)
│   ├── PreviewPanel    # Live-Vorschau mit Zoom/Background Controls
│   ├── HtmlEditor      # HTML Code-Editor mit Upload
│   ├── CssEditor       # CSS Code-Editor mit Vorlagen-Speichern
│   ├── TemplateManager # Vorlagen-Verwaltung
│   ├── ErrorBanner     # Fehlermeldungen
│   └── ToastMessage    # Erfolgsbenachrichtigungen
├── hooks/            # Custom React Hooks
│   ├── useAppState   # Zentrales State-Management
│   └── useDebounce   # Debounced Effects
├── utils/            # Hilfsfunktionen
│   ├── sanitizeHtml  # Script/Event-Handler Entfernung
│   ├── storage       # localStorage Persistenz
│   ├── presets       # Preset-Lookup
│   ├── previewDocument # iframe-Dokument-Builder
│   ├── exportPng     # PNG-Export via html2canvas
│   └── exportPdf     # PDF-Export via Print-Dialog
├── types/            # TypeScript Typdefinitionen
└── constants/        # Presets, Defaults, Konfiguration
```

## Bekannte Einschränkungen

- **PNG-Export**: `html2canvas` rendert nicht alle CSS-Features perfekt (z.B. komplexe Gradients, einige Pseudo-Elemente, externe Fonts). Einfache Layouts werden zuverlässig exportiert.
- **PDF-Export**: Nutzt den Browser-Print-Dialog. Die Ausgabequalität hängt vom Browser und dessen PDF-Engine ab.
- **Externe Assets**: Bilder von externen URLs können im Export fehlen (CORS-Einschränkungen).
- **Fonts**: Externe Fonts müssen geladen sein, bevor der Export gestartet wird. Ein kurzer Delay ist eingebaut, kann aber in seltenen Fällen nicht ausreichen.
- **localStorage**: Begrenzter Speicherplatz (~5-10 MB je nach Browser). Sehr große HTML/CSS-Inhalte könnten Probleme verursachen.
- **Safari iOS**: `html2canvas` kann auf älteren iOS-Versionen eingeschränkt funktionieren.
