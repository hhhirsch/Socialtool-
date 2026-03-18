import styles from './ToastMessage.module.css';

interface Props {
  message: string | null;
}

export function ToastMessage({ message }: Props) {
  if (!message) return null;
  return <div className={styles.toast}>{message}</div>;
}
