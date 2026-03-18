import { useState } from 'react';
import styles from './CssEditor.module.css';

interface Props {
  cssContent: string;
  onChange: (css: string) => void;
  onSaveTemplate: (name: string, css: string) => void;
}

export function CssEditor({ cssContent, onChange, onSaveTemplate }: Props) {
  const [templateName, setTemplateName] = useState('');

  const handleSave = () => {
    onSaveTemplate(templateName, cssContent);
    setTemplateName('');
  };

  return (
    <div className={styles.editor}>
      <div className={styles.header}>
        <h2 className={styles.title}>CSS Editor</h2>
        <button className={styles.btn} onClick={() => onChange('')}>
          Leeren
        </button>
      </div>

      <div className={styles.saveRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Vorlagenname..."
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
        />
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSave}>
          💾 Speichern
        </button>
      </div>

      <textarea
        className={styles.textarea}
        value={cssContent}
        onChange={(e) => onChange(e.target.value)}
        placeholder="CSS-Code hier einfügen..."
        spellCheck={false}
      />
    </div>
  );
}
