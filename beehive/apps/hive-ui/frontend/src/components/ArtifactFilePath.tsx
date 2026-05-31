import { useEffect, useState } from 'react';

type ArtifactFilePathProps = {
  path: string | null | undefined;
  className?: string;
};

type CopyState = 'idle' | 'copied' | 'error';

export function ArtifactFilePath({ path, className }: ArtifactFilePathProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  useEffect(() => {
    if (copyState === 'idle') {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCopyState('idle'), 1600);
    return () => window.clearTimeout(timeout);
  }, [copyState]);

  if (!path) {
    return null;
  }

  const safePath = path;

  async function handleCopy() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard indisponível');
      }

      await navigator.clipboard.writeText(safePath);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  }

  const statusLabel =
    copyState === 'copied' ? 'copiado' : copyState === 'error' ? 'falha ao copiar' : 'copiar';
  const classes = ['artifact-path', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <span className="artifact-path-label">file_path</span>
      <button
        aria-label={`Copiar file_path ${safePath}`}
        className={`artifact-path-copy ${
          copyState === 'idle' ? '' : `artifact-path-copy--${copyState}`
        }`.trim()}
        onClick={() => void handleCopy()}
        title={safePath}
        type="button"
      >
        <code>{safePath}</code>
        <span>{statusLabel}</span>
      </button>
    </div>
  );
}
