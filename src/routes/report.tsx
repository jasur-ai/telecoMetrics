import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { SectionCard, PageHeader, KpiCard } from "@/components/kpi-card";
import { fetchDashboardSummary, fetchDigitalServicesUzbtk, fetchGarchRevenueUzbtk, fetchMonteCarloNpvUzbtk, fetchOlsDissertation, fetchRecommendations } from "@/lib/api";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Target } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "Yakuniy Hisobot — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const { data: dashboard } = useQuery({ queryKey: ["dashboard-summary"], queryFn: fetchDashboardSummary, staleTime: 5 * 60 * 1000 });
  const { data: ols } = useQuery({ queryKey: ["ols-dissertation"], queryFn: fetchOlsDissertation, staleTime: 5 * 60 * 1000 });
  const { data: garch } = useQuery({ queryKey: ["garch-revenue-uzbtk"], queryFn: fetchGarchRevenueUzbtk, staleTime: 5 * 60 * 1000 });
  const { data: monteCarlo } = useQuery({ queryKey: ["monte-carlo-npv-uzbtk"], queryFn: fetchMonteCarloNpvUzbtk, staleTime: 5 * 60 * 1000 });
  const { data: digital } = useQuery({ queryKey: ["digital-services-uzbtk"], queryFn: fetchDigitalServicesUzbtk, staleTime: 5 * 60 * 1000 });
  const { data: recommendations } = useQuery({ queryKey: ["recommendations"], queryFn: fetchRecommendations, staleTime: 5 * 60 * 1000 });
  const traditional = (ols?.result.coefficients.traditional_services ?? ols?.result.coefficients.capex_mlrd)?.coef;
  const digitalCoef = (ols?.result.coefficients.digital_services ?? ols?.result.coefficients.ds_invest_mlrd)?.coef;
  const betaRatio = traditional ? (digitalCoef ?? 0) / traditional : 0;
  const revenueData = dashboard?.chart_data.revenue_trend.map((r) => ({
    year: r.year,
    total: r.value,
    digital: digital?.trend.find((d) => d.year === r.year)?.digital_revenue_mlrd ?? null,
  })) ?? [];
  const findings = [
    lang === "uz"
      ? `Raqamli/an'anaviy xizmatlar ta'sir nisbati ${betaRatio ? betaRatio.toFixed(2) : "..."}x, R? = ${ols?.result.r_squared.toFixed(3) ?? "..."}; raqamli xizmatlar daromadning kuchliroq drayveri.`
      : `Digital/traditional services effect ratio is ${betaRatio ? betaRatio.toFixed(2) : "..."}x, R? = ${ols?.result.r_squared.toFixed(3) ?? "..."}; digital services drive revenue more strongly.`,
    lang === "uz"
      ? `DEA-CCR samaradorlik ${dashboard?.dea_summary.ccr_score.toFixed(2) ?? "..."}; mintaqaviy rank #${dashboard?.dea_summary.rank_in_region ?? "..."} va maqsad 0.85+.`
      : `DEA-CCR efficiency is ${dashboard?.dea_summary.ccr_score.toFixed(2) ?? "..."}; regional rank #${dashboard?.dea_summary.rank_in_region ?? "..."} with a 0.85+ target.`,
    lang === "uz"
      ? `Malmquist TFP ${dashboard?.dea_summary.tfp.toFixed(2) ?? "..."}; umumiy unumdorlik o'sishi dashboard APIdan olinadi.`
      : `Malmquist TFP is ${dashboard?.dea_summary.tfp.toFixed(2) ?? "..."} from the dashboard API.`,
    lang === "uz"
      ? `GARCH persistence ${garch?.parameters.persistence.toFixed(3) ?? "..."} va yillik volatillik ${garch?.summary.annual_volatility.toFixed(1) ?? "..."}%.`
      : `GARCH persistence is ${garch?.parameters.persistence.toFixed(3) ?? "..."} and annual volatility is ${garch?.summary.annual_volatility.toFixed(1) ?? "..."}%.`,
    lang === "uz"
      ? `Monte-Carlo NPV ${monteCarlo?.summary.mean_npv.toLocaleString() ?? "..."} mlrd so'm, muvaffaqiyat ehtimoli ${monteCarlo?.summary.success_probability.toFixed(1) ?? "..."}%.`
      : `Monte-Carlo NPV is ${monteCarlo?.summary.mean_npv.toLocaleString() ?? "..."} bln UZS with ${monteCarlo?.summary.success_probability.toFixed(1) ?? "..."}% success probability.`,
  ];
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Yakuniy Ilmiy Hisobot" : "Final Scientific Report"}
        subtitle={lang === "uz" ? "Asosiy natijalar va ilmiy maqolalar" : "Key findings and scholarly publications"}
        badge={lang === "uz" ? "Xulosa" : "Conclusion"}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="OLS R²" value={ols?.result.r_squared.toFixed(3) ?? "..."} tone="gold" hint={ols ? `n=${ols.result.n}` : undefined} />
        <KpiCard label="DEA-CCR" value={dashboard?.dea_summary.ccr_score.toFixed(2) ?? "..."} tone="info" />
        <KpiCard label="GARCH σ" value={garch ? garch.summary.annual_volatility.toFixed(1) : "..."} unit="%" tone="success" />
        <KpiCard label="NPV" value={monteCarlo ? monteCarlo.summary.mean_npv.toLocaleString() : "..."} unit="mlrd" tone="navy" />
      </div>

      <SectionCard title={lang === "uz" ? "Asosiy Natijalar" : "Key Findings"}>
        <ol className="space-y-3 text-sm">
          {findings.map((f, i) => (
            <li key={i} className="flex gap-3">
              <span className="size-6 rounded-full bg-gold text-gold-foreground text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="pt-0.5">{f}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2">
          <SectionCard title={lang === "uz" ? "Daromad Dinamikasi (yakuniy ko'rinish)" : "Revenue Dynamics (final view)"}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="total" stroke="var(--color-navy)" strokeWidth={2} name="Total" />
                <Line type="monotone" dataKey="digital" stroke="var(--color-gold)" strokeWidth={3} name="Digital" />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard title={lang === "uz" ? "Strategik Tavsiyalar" : "Strategic Recommendations"}>
          <ul className="space-y-3 text-sm">
            {(recommendations?.recommendations ?? []).slice(0, 4).map((p) => {
              return (
                <li key={p.priority} className="flex gap-2.5 pb-2.5 border-b border-border/50 last:border-0">
                  <Target className="size-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{p.title_uz}</div>
                    <div className="text-xs text-muted-foreground">{p.expected_impact}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
