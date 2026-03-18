import type { FieldValues, TemplateField } from '../types';
import { FieldRenderer } from './FieldRenderer';
import styles from './DynamicFieldForm.module.css';

interface Props {
  fields: TemplateField[];
  values: FieldValues;
  onChange: (fieldId: string, value: string) => void;
}

export function DynamicFieldForm({ fields, values, onChange }: Props) {
  return (
    <div className={styles.form}>
      {fields.map((field) => (
        <FieldRenderer
          key={field.id}
          field={field}
          value={values[field.id] ?? ''}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
