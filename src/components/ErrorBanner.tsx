import styles from './ErrorBanner.module.css';

interface Props {
  message: string | null;
  onDismiss: () => void;
}

export function ErrorBanner({ message, onDismiss }: Props) {
  if (!message) return null;
  return (
    <div className={styles.banner}>
      <span>⚠️ {message}</span>
      <button className={styles.dismiss} onClick={onDismiss}>✕</button>
    </div>
  );
}
