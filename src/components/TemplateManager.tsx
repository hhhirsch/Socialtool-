import { useState } from 'react';
import type { CssTemplate } from '../types';
import styles from './TemplateManager.module.css';

interface Props {
  templates: CssTemplate[];
  activeTemplateId: string | null;
  onLoad: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function TemplateManager({
  templates,
  activeTemplateId,
  onLoad,
  onDelete,
  onRename,
  onDuplicate,
}: Props) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const startRename = (template: CssTemplate) => {
    setRenamingId(template.id);
    setRenameValue(template.name);
  };

  const confirmRename = () => {
    if (renamingId) {
      onRename(renamingId, renameValue);
      setRenamingId(null);
    }
  };

  return (
    <div className={styles.manager}>
      <h2 className={styles.title}>CSS-Vorlagen</h2>

      {templates.length === 0 ? (
        <div className={styles.empty}>
          Keine Vorlagen gespeichert.<br />
          Erstelle eine im CSS-Tab.
        </div>
      ) : (
        <div className={styles.list}>
          {templates.map((t) => (
            <div
              key={t.id}
              className={`${styles.item} ${activeTemplateId === t.id ? styles.itemActive : ''}`}
            >
              <div className={styles.itemHeader}>
                {renamingId === t.id ? (
                  <div className={styles.renameRow}>
                    <input
                      className={styles.renameInput}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') confirmRename(); }}
                      autoFocus
                    />
                    <button className={styles.actionBtn} onClick={confirmRename}>✓</button>
                    <button className={styles.actionBtn} onClick={() => setRenamingId(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <span className={styles.itemName}>{t.name}</span>
                    <span className={styles.itemDate}>{formatDate(t.updatedAt)}</span>
                  </>
                )}
              </div>

              <div className={styles.itemActions}>
                <button className={styles.actionBtn} onClick={() => onLoad(t.id)}>
                  Laden
                </button>
                <button className={styles.actionBtn} onClick={() => startRename(t)}>
                  Umbenennen
                </button>
                <button className={styles.actionBtn} onClick={() => onDuplicate(t.id)}>
                  Duplizieren
                </button>
                <button className={`${styles.actionBtn} ${styles.deleteBtn}`} onClick={() => onDelete(t.id)}>
                  Löschen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
