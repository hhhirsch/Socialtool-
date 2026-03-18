import { useRef } from 'react';
import { SAMPLE_HTML } from '../constants';
import styles from './HtmlEditor.module.css';

interface Props {
  htmlContent: string;
  onChange: (html: string) => void;
  onError: (msg: string) => void;
}

export function HtmlEditor({ htmlContent, onChange, onError }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        onChange(content);
      }
    };
    reader.onerror = () => {
      onError('Datei konnte nicht gelesen werden.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <h2 className={styles.title}>HTML Editor</h2>
        <div className={styles.actions}>
          <button className={styles.btn} onClick={() => onChange(SAMPLE_HTML)}>
            Beispiel
          </button>
          <button className={styles.btn} onClick={() => onChange('')}>
            Leeren
          </button>
        </div>
      </div>

      <div className={styles.uploadRow}>
        <input
          ref={fileRef}
          type="file"
          accept=".html,.htm"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => fileRef.current?.click()}>
          📁 HTML-Datei hochladen
        </button>
      </div>

      <textarea
        className={styles.textarea}
        value={htmlContent}
        onChange={(e) => onChange(e.target.value)}
        placeholder="HTML-Code hier einfügen..."
        spellCheck={false}
      />
    </div>
  );
}
