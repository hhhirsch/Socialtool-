import type { TabId } from '../types';
import { ExportButtons } from './ExportButtons';
import styles from './BottomActionBar.module.css';

interface Props {
  activeTab: TabId;
  onTabAction: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onReset: () => void;
}

export function BottomActionBar({
  activeTab,
  onTabAction,
  onExportPng,
  onExportPdf,
  onReset,
}: Props) {
  const tabLabel = activeTab === 'preview' ? 'Inhalt' : 'Vorschau';

  return (
    <div className={styles.bar}>
      <button type="button" className={styles.ghost} onClick={onTabAction}>
        {tabLabel}
      </button>
      <ExportButtons compact onExportPng={onExportPng} onExportPdf={onExportPdf} />
      <button type="button" className={styles.ghost} onClick={onReset}>
        Reset
      </button>
    </div>
  );
}
