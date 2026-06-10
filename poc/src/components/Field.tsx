import type { ReactNode } from 'react';

type Props = { label: string; mono?: boolean; children: ReactNode };

export function Field({ label, mono, children }: Props) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <span className={`field-value${mono ? ' mono' : ''}`}>{children}</span>
    </div>
  );
}
