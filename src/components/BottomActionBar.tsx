import { useRef } from 'react';
import styles from './BottomActionBar.module.css';

interface Props {
  onUpload: (content: string) => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onPreset: () => void;
  onError: (msg: string) => void;
}

export function BottomActionBar({ onUpload, onExportPng, onExportPdf, onPreset, onError }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(html?|htm)$/i)) {
      onError('Nur .html und .htm Dateien werden unterstützt.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result;
      if (typeof content === 'string') {
        onUpload(content);
      }
    };
    reader.onerror = () => {
      onError('Datei konnte nicht gelesen werden.');
    };
    reader.readAsText(file);
    // Reset to allow re-upload of same file
    e.target.value = '';
  };

  return (
    <div className={styles.bar}>
      <input
        ref={fileRef}
        type="file"
        accept=".html,.htm"
        style={{ display: 'none' }}
        onChange={handleFile}
      />
      <button className={styles.btn} onClick={() => fileRef.current?.click()}>
        <span className={styles.btnIcon}>📁</span>
        Upload
      </button>
      <button className={styles.btn} onClick={onExportPdf}>
        <span className={styles.btnIcon}>📄</span>
        PDF
      </button>
      <button className={styles.btn} onClick={onExportPng}>
        <span className={styles.btnIcon}>🖼️</span>
        PNG
      </button>
      <button className={styles.btn} onClick={onPreset}>
        <span className={styles.btnIcon}>📐</span>
        Format
      </button>
    </div>
  );
}
