import type { TemplateCategory } from '../types';
import styles from './CategorySelector.module.css';

interface Props {
  selectedCategory: TemplateCategory;
  onSelect: (category: TemplateCategory) => void;
}

const CATEGORY_OPTIONS: Array<{ id: TemplateCategory; label: string }> = [
  { id: 'business', label: 'Business' },
  { id: 'podcast', label: 'Podcast' },
];

export function CategorySelector({ selectedCategory, onSelect }: Props) {
  return (
    <div className={styles.selector} role="tablist" aria-label="Bereich wählen">
      {CATEGORY_OPTIONS.map((category) => {
        const isActive = category.id === selectedCategory;

        return (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`${styles.button} ${isActive ? styles.buttonActive : ''}`}
            onClick={() => onSelect(category.id)}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
