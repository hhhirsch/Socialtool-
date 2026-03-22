import { useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { BackgroundMode, Preset, ZoomLevel } from '../types';
import { BackgroundToggle } from './BackgroundToggle';
import { ZoomControls } from './ZoomControls';
import { PreviewFrame } from './PreviewFrame';
import styles from './PreviewPanel.module.css';

interface Props {
  documentHtml: string;
  preset: Preset;
  backgroundMode: BackgroundMode;
  zoomLevel: ZoomLevel;
  onBackgroundChange: (mode: BackgroundMode) => void;
  onZoomChange: (zoomLevel: ZoomLevel) => void;
  onScaleChange: (scale: number) => void;
  frameRef?: RefObject<HTMLIFrameElement | null>;
  onFrameLoad?: () => void;
}

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export function PreviewPanel({
  documentHtml,
  preset,
  backgroundMode,
  zoomLevel,
  onBackgroundChange,
  onZoomChange,
  onScaleChange,
  frameRef,
  onFrameLoad,
}: Props) {
  const frameAreaRef = useRef<HTMLDivElement>(null);
  const size = useContainerSize(frameAreaRef);

  const scale = useMemo(() => {
    if (zoomLevel === '50') return 0.5;
    if (zoomLevel === '75') return 0.75;
    if (zoomLevel === '100') return 1;

    const availableWidth = Math.max(size.width - 32, 200);
    const availableHeight = Math.max(size.height - 32, 200);
    const scaleFromWidth = availableWidth / preset.width;
    const scaleFromHeight = availableHeight / preset.height;

    return size.width > 0 ? Math.min(scaleFromWidth, scaleFromHeight, 1) : 0.3;
  }, [preset.height, preset.width, size.height, size.width, zoomLevel]);

  useEffect(() => {
    onScaleChange(scale);
  }, [onScaleChange, scale]);

  const backgroundClass =
    backgroundMode === 'gray'
      ? styles.gray
      : backgroundMode === 'transparent'
        ? styles.transparent
        : styles.white;

  const documentHtmlWithPresetClass = useMemo(() => {
    const presetClass = `preset-${preset.width}x${preset.height}`;
    return documentHtml.replace(
      /class="slide\b/,
      `class="slide ${presetClass}`
    );
  }, [documentHtml, preset.height, preset.width]);

  return (
    <section className={styles.panel}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Live-Vorschau</h2>
          <p className={styles.meta}>
            Aktives Format: {preset.label} · {preset.width} × {preset.height} px
          </p>
        </div>
        <span className={styles.scaleBadge}>{Math.round(scale * 100)}%</span>
      </div>

      <div className={styles.controlRow}>
        <div className={styles.controlBlock}>
          <span className={styles.controlLabel}>Hintergrund</span>
          <BackgroundToggle value={backgroundMode} onChange={onBackgroundChange} />
        </div>
        <div className={styles.controlBlock}>
          <span className={styles.controlLabel}>Zoom</span>
          <ZoomControls value={zoomLevel} onChange={onZoomChange} />
        </div>
      </div>

      <div ref={frameAreaRef} className={`${styles.previewArea} ${backgroundClass}`}>
        <div
          className={styles.frameBounds}
          style={{ width: preset.width * scale, height: preset.height * scale }}
        >
          <PreviewFrame
            documentHtml={documentHtmlWithPresetClass}
            width={preset.width}
            height={preset.height}
            scale={scale}
            frameRef={frameRef}
            onLoad={onFrameLoad}
          />
        </div>
      </div>
    </section>
  );
}
