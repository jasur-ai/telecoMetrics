import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { SectionCard, PageHeader, KpiCard } from "@/components/kpi-card";
import { fetchForecastAll2030, fetchForecastUzbtk } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from "recharts";

export const Route = createFileRoute("/forecast")({
  head: () => ({ meta: [{ title: "Bashorat va Ssenariy — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const { data: forecastResponse } = useQuery({
    queryKey: ["forecast-uzbtk", "revenue_mlrd"],
    queryFn: () => fetchForecastUzbtk("revenue_mlrd"),
    staleTime: 5 * 60 * 1000,
  });
  const { data: all2030 } = useQuery({
    queryKey: ["forecast-all-2030"],
    queryFn: fetchForecastAll2030,
    staleTime: 5 * 60 * 1000,
  });
  const forecast = forecastResponse?.base_scenario.map((base) => ({
    year: base.year,
    base: base.value,
    optimistic: forecastResponse.scenarios.optimistic.find((r) => r.year === base.year)?.value ?? base.value,
    pessimistic: forecastResponse.scenarios.pessimistic.find((r) => r.year === base.year)?.value ?? base.value,
  })) ?? [];
  const finalYear = forecast.at(-1);
  const forecastTargets = all2030?.comparison.map((r) => ({
    metric: r.label,
    current: typeof r.actual_2025 === "number" ? r.actual_2025.toLocaleString() : "-",
    p: "-",
    b: typeof r.forecast_2030 === "number" ? r.forecast_2030.toLocaleString() : "-",
    o: "-",
    goal: r.cagr_pct != null ? `${r.cagr_pct.toFixed(1)}% CAGR` : "-",
  })) ?? [];
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Bashorat va Ssenariy Tahlili" : "Forecast & Scenario Analysis"}
        subtitle={lang === "uz" ? "OLS trend modeli · 2026-2030 · jonli API" : "OLS trend model · 2026-2030 · live API"}
        badge="OLS"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="R² trend" value={forecastResponse?.trend_model[0]?.r_squared.toFixed(3) ?? "..."} tone="success" />
        <KpiCard label={lang === "uz" ? "Bazaviy 2030" : "Base 2030"} value={finalYear ? finalYear.base.toLocaleString() : "..."} unit="mlrd" tone="gold" />
        <KpiCard label={lang === "uz" ? "Eng yaxshi ssenariy" : "Best case"} value={finalYear ? finalYear.optimistic.toLocaleString() : "..."} unit="mlrd" tone="info" />
        <KpiCard label="CAGR 2025-2030" value={forecastResponse ? forecastResponse.cagr_2025_2030.toFixed(1) : "..."} unit="%" tone="navy" />
      </div>

      <SectionCard title={lang === "uz" ? "Daromad Bashorati 2026-2030" : "Revenue Forecast 2026-2030"}
        subtitle="OLS trend model · 3 scenarios">
        <ResponsiveContainer width="100%" height={360}>
          <ComposedChart data={forecast}>
            <defs>
              <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Area type="monotone" dataKey="optimistic" name={lang === "uz" ? "Optimistik" : "Optimistic"} stroke="var(--color-success)" fill="url(#optGrad)" strokeWidth={2} />
            <Line type="monotone" dataKey="base" name={lang === "uz" ? "Bazaviy" : "Base"} stroke="var(--color-gold)" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="pessimistic" name={lang === "uz" ? "Pessimistik" : "Pessimistic"} stroke="var(--color-destructive)" strokeWidth={2} strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title={lang === "uz" ? "Maqsad Ko'rsatkichlari Jadvali" : "Target Metrics Table"}
        subtitle={lang === "uz" ? "2030 yil prognozi" : "2030 forecast"}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-2 pr-3">Metric</th>
                <th className="py-2 px-3 text-right">Current</th>
                <th className="py-2 px-3 text-right text-destructive">Pessimistic</th>
                <th className="py-2 px-3 text-right text-gold">Base</th>
                <th className="py-2 px-3 text-right text-success">Optimistic</th>
                <th className="py-2 pl-3 text-right">Goal</th>
              </tr>
            </thead>
            <tbody>
              {forecastTargets.map((r) => (
                <tr key={r.metric} className="border-b border-border/50">
                  <td className="py-2.5 pr-3">{r.metric}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{r.current}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{r.p}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums font-semibold">{r.b}</td>
                  <td className="py-2.5 px-3 text-right tabular-nums">{r.o}</td>
                  <td className="py-2.5 pl-3 text-right tabular-nums text-muted-foreground">{r.goal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
