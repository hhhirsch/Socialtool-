import { useRef, useState, type ChangeEvent } from 'react';
import type { FieldValues, TemplateField } from '../types';
import styles from './FieldRenderer.module.css';

interface Props {
  field: TemplateField;
  value: string;
  values: FieldValues;
  onChange: (fieldId: string, value: string) => void;
}

export function FieldRenderer({ field, value, values, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState('');
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

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return;
      }

      onChange(field.id, reader.result);
      setSelectedFileName(file.name);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const imageStatus = selectedFileName
    ? selectedFileName
    : value
      ? value.startsWith('data:')
        ? 'Bild ausgewählt'
        : 'Bildquelle gesetzt'
      : 'Noch kein Bild ausgewählt';

  if (field.type === 'image') {
    return (
      <div className={styles.field}>
        <div className={styles.labelRow}>
          <span className={styles.label}>{field.label}</span>
        </div>

        <div className={styles.imageField}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={styles.hiddenInput}
          />
          <div className={styles.imageActions}>
            <button
              type="button"
              className={styles.uploadButton}
              onClick={() => fileInputRef.current?.click()}
            >
              {value ? 'Bild ersetzen' : 'Bild hochladen'}
            </button>
            <span className={styles.imageStatus} aria-live="polite">
              {imageStatus}
            </span>
          </div>
        </div>

        {field.helpText && <span className={styles.help}>{field.helpText}</span>}
      </div>
    );
  }

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
