import { ReactNode } from 'react';

type LuxuryCardProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export function LuxuryCard({ title, subtitle, children }: LuxuryCardProps) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <p className="text-sm uppercase tracking-[0.2em] text-amber-600">{subtitle}</p>
      <h3 className="mt-2 font-[var(--font-heading)] text-2xl text-gray-900">{title}</h3>
      {children ? <div className="mt-4 text-sm text-gray-600">{children}</div> : null}
    </article>
  );
}
