import type { FieldValues, TemplateField } from '../types';
import styles from './FieldRenderer.module.css';

interface Props {
  field: TemplateField;
  value: string;
  values: FieldValues;
  onChange: (fieldId: string, value: string) => void;
}

export function FieldRenderer({ field, value, values, onChange }: Props) {
  const remainingCharacters = field.maxLength ? `${value.length}/${field.maxLength}` : null;
  const resolvedOptions =
    field.dependsOn && field.optionGroups
      ? field.optionGroups[values[field.dependsOn]] ?? field.options ?? []
      : field.options ?? [];
  const commonProps = {
    id: field.id,
    name: field.id,
    value,
    placeholder: field.placeholder,
    maxLength: field.maxLength,
    onChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => onChange(field.id, event.target.value),
  };

  return (
    <label className={styles.field} htmlFor={field.id}>
      <div className={styles.labelRow}>
        <span className={styles.label}>{field.label}</span>
        {remainingCharacters && <span className={styles.counter}>{remainingCharacters}</span>}
      </div>

      {field.type === 'textarea' ? (
        <textarea {...commonProps} rows={field.multiline ? 5 : 3} className={styles.textarea} />
      ) : field.type === 'select' ? (
        <select {...commonProps} className={styles.input}>
          {resolvedOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...commonProps}
          type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
          inputMode={field.type === 'number' ? 'numeric' : field.type === 'date' ? 'numeric' : 'text'}
          className={styles.input}
        />
      )}

      {field.helpText && <span className={styles.help}>{field.helpText}</span>}
    </label>
  );
}
