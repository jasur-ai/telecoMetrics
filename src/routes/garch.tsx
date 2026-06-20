import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { fetchGarchRevenueUzbtk } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/garch")({
  head: () => ({ meta: [{ title: "GARCH(1,1) — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["garch-revenue-uzbtk"],
    queryFn: fetchGarchRevenueUzbtk,
    staleTime: 5 * 60 * 1000,
  });
  const params = data?.parameters;
  const summary = data?.summary;
  const volatility = data?.volatility ?? [];
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "GARCH(1,1) Volatillik Modeli" : "GARCH(1,1) Volatility Model"}
        subtitle={lang === "uz" ? "Daromad o'zgaruvchanligi xotirasi va shok ta'siri" : "Revenue volatility memory & shock impact"}
        badge="GARCH"
      />

      <div className="card-elevated p-5 mb-6 bg-navy text-primary-foreground">
        <div className="text-xs uppercase tracking-wider text-gold mb-2">Formula</div>
        <code className="font-mono text-base">σ²ₜ = ω + α₁·ε²ₜ₋₁ + β₁·σ²ₜ₋₁</code>
        <div className="text-xs mt-2 text-primary-foreground/70">
          ω = {params ? params.omega.toFixed(3) : "..."} · α₁ = {params ? params.alpha.toFixed(3) : "..."} · β₁ = {params ? params.beta.toFixed(3) : "..."} · α₁+β₁ = {params ? params.persistence.toFixed(3) : "..."}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="α₁ (ARCH effect)" value={params ? params.alpha.toFixed(3) : "..."} tone="gold" hint={lang === "uz" ? "Qisqa muddatli shok" : "Short-term shock"} />
        <KpiCard label="β₁ (GARCH effect)" value={params ? params.beta.toFixed(3) : "..."} tone="info" hint={lang === "uz" ? "Uzoq xotira" : "Long memory"} />
        <KpiCard label="α₁ + β₁" value={params ? params.persistence.toFixed(3) : "..."} tone="destructive" hint={summary?.stationary ? (lang === "uz" ? "< 1 barqaror" : "< 1 stationary") : undefined} />
        <KpiCard label={lang === "uz" ? "Yillik volatillik" : "Annual volatility"} value={summary ? `${summary.annual_volatility.toFixed(1)}%` : "..."} tone="navy" />
      </div>

      <SectionCard title={lang === "uz" ? "Shartli Volatillik Trendi" : "Conditional Volatility Trend"}
        subtitle="σₜ across 72 quarters">
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={volatility}>
            <defs>
              <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.5} />
                <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="q" stroke="var(--color-muted-foreground)" fontSize={11}
              label={{ value: "Quarter", position: "insideBottom", offset: -2, fontSize: 11 }} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            <Area type="monotone" dataKey="vol" stroke="var(--color-gold)" fill="url(#volGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </SectionCard>
    </div>
  );
}
