import styles from './PreviewFrame.module.css';

interface Props {
  documentHtml: string;
  width: number;
  height: number;
  scale: number;
}

export function PreviewFrame({ documentHtml, width, height, scale }: Props) {
  return (
    <iframe
      title="Grafikvorschau"
      sandbox="allow-same-origin"
      className={styles.frame}
      srcDoc={documentHtml}
      style={{
        width,
        height,
        transform: `scale(${scale})`,
      }}
    />
  );
}
