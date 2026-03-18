import type { TabId } from '../types';
import styles from './TabNavigation.module.css';

interface Props {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: 'content', label: 'Inhalt' },
  { id: 'preview', label: 'Vorschau' },
  { id: 'templates', label: 'Vorlagen' },
  { id: 'advanced', label: 'Erweitert' },
];

export function TabNavigation({ activeTab, onTabChange }: Props) {
  return (
    <nav className={styles.tabs} aria-label="Hauptnavigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
