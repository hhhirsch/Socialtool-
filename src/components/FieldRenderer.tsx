import { useRef, useState, type ChangeEvent } from 'react';
import type { FieldValues, TemplateField } from '../types';
import styles from './FieldRenderer.module.css';

interface Props {
  field: TemplateField;
  value: string;
  values: FieldValues;
  onChange: (fieldId: string, value: string) => void;
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Bild konnte nicht geladen werden.'));
    image.src = source;
  });
}

async function normalizeImageFile(file: File): Promise<string> {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const { naturalWidth, naturalHeight } = image;

    if (!naturalWidth || !naturalHeight) {
      throw new Error('Bildgröße konnte nicht ermittelt werden.');
    }

    const canvas = document.createElement('canvas');
    canvas.width = naturalWidth;
    canvas.height = naturalHeight;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas-Kontext konnte nicht erstellt werden.');
    }

    context.drawImage(image, 0, 0, naturalWidth, naturalHeight);
    return canvas.toDataURL('image/png');
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
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

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    try {
      const normalizedImage = await normalizeImageFile(file);
      onChange(field.id, normalizedImage);
      setSelectedFileName(file.name);
    } catch (error) {
      setSelectedFileName(
        error instanceof Error ? error.message : 'Bild konnte nicht verarbeitet werden'
      );
    }
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
