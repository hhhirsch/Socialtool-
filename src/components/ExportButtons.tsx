import styles from './ExportButtons.module.css';

interface Props {
  onExportPng: () => void;
  onExportPdf: () => void;
  onCopyHtml?: () => Promise<void>;
  compact?: boolean;
}

export function ExportButtons({ onExportPng, onExportPdf, onCopyHtml, compact = false }: Props) {
  return (
    <div className={`${styles.group} ${compact ? styles.compact : ''}`}>
      <button type="button" className={styles.primary} onClick={onExportPng}>
        PNG exportieren
      </button>
      <button type="button" className={styles.secondary} onClick={onExportPdf}>
        PDF exportieren
      </button>
      {onCopyHtml && (
        <button type="button" className={styles.outline} onClick={onCopyHtml}>
          HTML kopieren
        </button>
      )}
    </div>
  );
}
