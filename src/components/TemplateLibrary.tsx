import { PRESETS } from '../constants';
import type { GraphicTemplate } from '../types';
import styles from './TemplateLibrary.module.css';

interface Props {
  templates: GraphicTemplate[];
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export function TemplateLibrary({ templates, selectedTemplateId, onSelect }: Props) {
  return (
    <div className={styles.library}>
      {templates.map((template) => {
        const isActive = template.id === selectedTemplateId;
        const presetLabels = PRESETS.filter((preset) => template.supportedPresetIds.includes(preset.id)).map(
          (preset) => preset.label
        );

        return (
          <article key={template.id} className={`${styles.card} ${isActive ? styles.cardActive : ''}`}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.name}>{template.name}</h3>
                <p className={styles.description}>{template.description}</p>
              </div>
              {isActive && <span className={styles.badge}>Aktiv</span>}
            </div>

            <dl className={styles.metaList}>
              <div>
                <dt>Formate</dt>
                <dd>{presetLabels.join(' · ')}</dd>
              </div>
              <div>
                <dt>Felder</dt>
                <dd>{template.fields.length} dynamische Eingaben</dd>
              </div>
            </dl>

            <button type="button" className={styles.button} onClick={() => onSelect(template.id)}>
              Vorlage verwenden
            </button>
          </article>
        );
      })}
    </div>
  );
}
