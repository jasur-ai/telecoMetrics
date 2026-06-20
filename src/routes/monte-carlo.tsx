import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { monteCarlo, mcDistribution } from "@/lib/data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export const Route = createFileRoute("/monte-carlo")({
  head: () => ({ meta: [{ title: "Monte-Carlo — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const tones: Record<string, string> = {
    destructive: "border-destructive text-destructive",
    gold: "border-gold text-gold",
    success: "border-success text-success",
  };
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Monte-Carlo Simulatsiyasi" : "Monte-Carlo Simulation"}
        subtitle={lang === "uz" ? "10,000 takrorlash · 3 ssenariy · NPV taqsimoti" : "10,000 iterations · 3 scenarios · NPV distribution"}
        badge="Monte-Carlo"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label={lang === "uz" ? "O'rta NPV" : "Mean NPV"} value="15,200" unit="mlrd" tone="gold" />
        <KpiCard label={lang === "uz" ? "Muvaffaqiyat ehtimoli" : "Success probability"} value="98.2" unit="%" tone="success" />
        <KpiCard label="IRR (base)" value="38" unit="%" tone="info" />
        <KpiCard label={lang === "uz" ? "Qaytarim" : "Payback"} value="3.2" unit={lang === "uz" ? "yil" : "yrs"} tone="navy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {monteCarlo.scenarios.map((s) => (
          <div key={s.name} className={`card-elevated p-5 border-l-4 ${tones[s.color]}`}>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.name}</div>
            <div className="kpi-value mt-2">{s.npv.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">mlrd</span></div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div><div className="text-muted-foreground">Prob</div><div className="font-semibold">{s.prob}%</div></div>
              <div><div className="text-muted-foreground">IRR</div><div className="font-semibold">{s.irr}%</div></div>
              <div><div className="text-muted-foreground">Payback</div><div className="font-semibold">{s.payback}y</div></div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title={lang === "uz" ? "NPV Taqsimoti" : "NPV Distribution"} subtitle="10,000 Monte-Carlo iterations">
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={mcDistribution}>
            <defs>
              <linearGradient id="mcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.55} />
                <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="npv" stroke="var(--color-muted-foreground)" fontSize={11}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            <ReferenceLine x={15200} stroke="var(--color-navy)" strokeDasharray="4 4"
              label={{ value: "Mean 15,200", position: "top", fill: "var(--color-navy)", fontSize: 11 }} />
            <Area type="monotone" dataKey="freq" stroke="var(--color-gold)" fill="url(#mcGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
