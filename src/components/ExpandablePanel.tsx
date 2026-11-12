import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

export default function ExpandablePanel({ title, targets = [], children }: { title: string; targets?: string[]; children: ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  const keys = targets.join('|');
  useEffect(() => {
    const reveal = () => { if (keys && keys.split('|').includes(location.hash.slice(1)) && ref.current) ref.current.open = true; };
    reveal();
    window.addEventListener('hashchange', reveal);
    return () => window.removeEventListener('hashchange', reveal);
  }, [keys]);
  return <details ref={ref} className="page-disclosure"><summary>{title}</summary><div className="page-disclosure-body">{children}</div></details>;
}
