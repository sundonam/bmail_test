import type { ReactNode } from 'react';

type Props = { title?: string; children: ReactNode };

export function Card({ title, children }: Props) {
  return (
    <div className="card">
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  );
}
