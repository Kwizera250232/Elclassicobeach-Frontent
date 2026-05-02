import { ReactNode } from 'react';

type LuxuryCardProps = {
  title: string;
  subtitle: string;
  children?: ReactNode;
};

export function LuxuryCard({ title, subtitle, children }: LuxuryCardProps) {
  return (
    <article className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10 hover:shadow-glow">
      <p className="text-sm uppercase tracking-[0.2em] text-sand/90">{subtitle}</p>
      <h3 className="mt-2 font-[var(--font-heading)] text-2xl text-[#fff6e5]">{title}</h3>
      {children ? <div className="mt-4 text-sm text-white/85">{children}</div> : null}
    </article>
  );
}
