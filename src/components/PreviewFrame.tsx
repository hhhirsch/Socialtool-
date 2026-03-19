import type { RefObject } from 'react';
import styles from './PreviewFrame.module.css';

interface Props {
  documentHtml: string;
  width: number;
  height: number;
  scale: number;
  frameRef?: RefObject<HTMLIFrameElement | null>;
  onLoad?: () => void;
}

export function PreviewFrame({ documentHtml, width, height, scale, frameRef, onLoad }: Props) {
  return (
    <iframe
      title="Grafikvorschau"
      sandbox="allow-same-origin"
      className={styles.frame}
      srcDoc={documentHtml}
      ref={frameRef}
      onLoad={onLoad}
      style={{
        width,
        height,
        transform: `scale(${scale})`,
      }}
    />
  );
}
