import type { FieldValues, TemplateFieldDefinition, TemplateFieldGroup } from '../types';
import { getGroupFieldIndices, getGroupFieldKey, isTemplateFieldGroup } from '../utils/templateRegistry';
import { FieldRenderer } from './FieldRenderer';
import styles from './DynamicFieldForm.module.css';

interface Props {
  fields: TemplateFieldDefinition[];
  values: FieldValues;
  onChange: (fieldId: string, value: string) => void;
  onAddGroup: (groupId: string) => void;
  onRemoveGroup: (groupId: string, index: number) => void;
}

function renderGroup(
  group: TemplateFieldGroup,
  values: FieldValues,
  onChange: (fieldId: string, value: string) => void,
  onAddGroup: (groupId: string) => void,
  onRemoveGroup: (groupId: string, index: number) => void
) {
  const indices = getGroupFieldIndices(group, values);
  const minimumItems = group.minItems ?? 1;
  const canAddItem = !group.maxItems || indices.length < group.maxItems;
  const itemLabel = group.itemLabel ?? 'Gruppe';

  return (
    <section key={group.id} className={styles.groupSection}>
      <div className={styles.groupHeader}>
        <div>
          <h3 className={styles.groupTitle}>{group.label}</h3>
          <p className={styles.groupMeta}>{indices.length} Gruppe{indices.length === 1 ? '' : 'n'}</p>
        </div>
        <button
          type="button"
          className={styles.groupAddButton}
          onClick={() => onAddGroup(group.id)}
          disabled={!canAddItem}
        >
          {group.addButtonLabel ?? '+ Gruppe hinzufügen'}
        </button>
      </div>

      <div className={styles.groupList}>
        {indices.map((index) => {
          const canRemove = indices.length > minimumItems;

          return (
            <div key={`${group.id}-${index}`} className={styles.groupCard}>
              <div className={styles.groupCardHeader}>
                <span className={styles.groupCardTitle}>
                  {itemLabel} {index + 1}
                </span>
                <button
                  type="button"
                  className={styles.groupRemoveButton}
                  onClick={() => onRemoveGroup(group.id, index)}
                  disabled={!canRemove}
                >
                  {group.removeButtonLabel ?? 'Gruppe entfernen'}
                </button>
              </div>

              <div className={styles.groupFields}>
                {group.fields.map((field) => {
                  const fieldKey = getGroupFieldKey(group.id, index, field.id);

                  return (
                    <FieldRenderer
                      key={fieldKey}
                      field={{ ...field, id: fieldKey }}
                      value={values[fieldKey] ?? ''}
                      values={values}
                      onChange={onChange}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function DynamicFieldForm({ fields, values, onChange, onAddGroup, onRemoveGroup }: Props) {
  return (
    <div className={styles.form}>
      {fields.map((field) =>
        isTemplateFieldGroup(field) ? (
          renderGroup(field, values, onChange, onAddGroup, onRemoveGroup)
        ) : (
          <FieldRenderer
            key={field.id}
            field={field}
            value={values[field.id] ?? ''}
            values={values}
            onChange={onChange}
          />
        )
      )}
    </div>
  );
}
