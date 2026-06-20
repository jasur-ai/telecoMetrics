import type { ReactNode } from "react";

type Tone = "navy" | "gold" | "success" | "info" | "warning" | "destructive";

const toneClasses: Record<Tone, string> = {
  navy: "text-navy border-l-navy",
  gold: "text-gold border-l-gold",
  success: "text-success border-l-success",
  info: "text-info border-l-info",
  warning: "text-warning border-l-warning",
  destructive: "text-destructive border-l-destructive",
};

export function KpiCard({
  label,
  value,
  unit,
  hint,
  tone = "navy",
  icon,
}: {
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <div className={`card-elevated p-5 border-l-4 ${toneClasses[tone]}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        {icon && <div className="text-muted-foreground/60">{icon}</div>}
      </div>
      <div className="mt-3 flex items-baseline gap-1.5">
        <div className={`kpi-value ${toneClasses[tone].split(" ")[0]}`}>{value}</div>
        {unit && <div className="text-sm text-muted-foreground">{unit}</div>}
      </div>
      {hint && <div className="mt-2 text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="card-elevated p-5">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{subtitle}</p>}
      </div>
      {badge && (
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-navy text-primary-foreground uppercase tracking-wider font-semibold">
          {badge}
        </span>
      )}
    </div>
  );
}
