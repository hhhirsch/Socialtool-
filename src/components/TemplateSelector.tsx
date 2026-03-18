import type { GraphicTemplate } from '../types';
import styles from './TemplateSelector.module.css';

interface Props {
  templates: GraphicTemplate[];
  selectedTemplateId: string;
  onSelect: (templateId: string) => void;
}

export function TemplateSelector({ templates, selectedTemplateId, onSelect }: Props) {
  return (
    <div className={styles.selector}>
      {templates.map((template) => {
        const isActive = template.id === selectedTemplateId;

        return (
          <button
            key={template.id}
            type="button"
            className={`${styles.card} ${isActive ? styles.cardActive : ''}`}
            onClick={() => onSelect(template.id)}
          >
            <span className={styles.name}>{template.name}</span>
            <span className={styles.description}>{template.description}</span>
          </button>
        );
      })}
    </div>
  );
}
