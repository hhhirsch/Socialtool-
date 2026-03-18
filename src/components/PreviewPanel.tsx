import { useRef, useEffect, useState } from 'react';
import type { BackgroundMode, ZoomLevel } from '../types';
import { getPresetById } from '../utils/presets';
import { buildPreviewDocument } from '../utils/previewDocument';
import styles from './PreviewPanel.module.css';

interface Props {
  htmlContent: string;
  cssContent: string;
  selectedPresetId: string;
  backgroundMode: BackgroundMode;
  zoomLevel: ZoomLevel;
  onBackgroundChange: (mode: BackgroundMode) => void;
  onZoomChange: (zoom: ZoomLevel) => void;
  onScaleChange: (scale: number) => void;
}

const bgModes: { mode: BackgroundMode; label: string }[] = [
  { mode: 'white', label: 'Weiß' },
  { mode: 'gray', label: 'Grau' },
  { mode: 'transparent', label: 'Transparent' },
];

const zoomOptions: { value: ZoomLevel; label: string }[] = [
  { value: 'fit', label: 'Fit' },
  { value: '50', label: '50%' },
  { value: '75', label: '75%' },
  { value: '100', label: '100%' },
];

/**
 * Hook that tracks container dimensions via ResizeObserver,
 * so we can compute "fit" scale without refs during render.
 */
function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

export function PreviewPanel({
  htmlContent,
  cssContent,
  selectedPresetId,
  backgroundMode,
  zoomLevel,
  onBackgroundChange,
  onZoomChange,
  onScaleChange,
}: Props) {
  const preset = getPresetById(selectedPresetId);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerSize = useContainerSize(containerRef);

  // Calculate scale purely from state/props (no ref access during render)
  let scale: number;
  if (zoomLevel === '100') {
    scale = 1;
  } else if (zoomLevel === '75') {
    scale = 0.75;
  } else if (zoomLevel === '50') {
    scale = 0.5;
  } else {
    // Fit mode - based on tracked container size
    const maxW = containerSize.width - 32;
    const maxH = Math.max(containerSize.height - 120, 200);
    const scaleW = maxW / preset.width;
    const scaleH = maxH / preset.height;
    scale = containerSize.width > 0 ? Math.min(scaleW, scaleH, 1) : 0.3;
  }

  // Notify parent of scale changes
  const prevScaleRef = useRef(scale);
  useEffect(() => {
    if (prevScaleRef.current !== scale) {
      prevScaleRef.current = scale;
      onScaleChange(scale);
    }
  });

  // Update preview iframe content
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    const doc = buildPreviewDocument(htmlContent, cssContent, preset.width, preset.height);
    const iframeDoc = iframe.contentDocument;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(doc);
      iframeDoc.close();
    }
  }, [htmlContent, cssContent, preset.width, preset.height]);

  const bgClass =
    backgroundMode === 'gray'
      ? styles.bgGray
      : backgroundMode === 'transparent'
        ? styles.bgTransparent
        : styles.bgWhite;

  return (
    <div className={styles.panel} ref={containerRef}>
      <div className={styles.info}>
        <span className={styles.badge}>
          {preset.label}
        </span>
        <span>Skalierung: {Math.round(scale * 100)}%</span>
      </div>

      <div className={styles.controls}>
        {bgModes.map((bg) => (
          <button
            key={bg.mode}
            className={`${styles.controlBtn} ${backgroundMode === bg.mode ? styles.controlBtnActive : ''}`}
            onClick={() => onBackgroundChange(bg.mode)}
          >
            {bg.label}
          </button>
        ))}
        <span style={{ width: 1, height: 20, background: '#ddd' }} />
        {zoomOptions.map((z) => (
          <button
            key={z.value}
            className={`${styles.controlBtn} ${zoomLevel === z.value ? styles.controlBtnActive : ''}`}
            onClick={() => onZoomChange(z.value)}
          >
            {z.label}
          </button>
        ))}
      </div>

      <div
        className={`${styles.previewContainer} ${bgClass}`}
        style={{
          width: preset.width * scale,
          height: preset.height * scale,
        }}
      >
        <iframe
          ref={iframeRef}
          className={styles.iframe}
          title="Preview"
          sandbox="allow-same-origin"
          style={{
            width: preset.width,
            height: preset.height,
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </div>
  );
}
