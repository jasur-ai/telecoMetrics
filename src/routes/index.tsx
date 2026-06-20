import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { fetchDashboardSummary, fetchDmmUzbtk, fetchGarchRevenueUzbtk, fetchMonteCarloNpvUzbtk, fetchOlsDissertation } from "@/lib/api";
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { AlertTriangle, Target, TrendingUp, Award, Wallet } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Bosh Panel — TelecoMetrics.uz" },
      { name: "description", content: "O'zbektelekom JSC raqamli iqtisodiyot ko'rsatkichlarining yagona boshqaruv paneli." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { t, lang } = useI18n();

  const { data: live } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: fetchDashboardSummary,
    staleTime: 5 * 60 * 1000,
  });
  const { data: ols } = useQuery({
    queryKey: ["ols-dissertation"],
    queryFn: fetchOlsDissertation,
    staleTime: 5 * 60 * 1000,
  });
  const { data: garch } = useQuery({
    queryKey: ["garch-revenue-uzbtk"],
    queryFn: fetchGarchRevenueUzbtk,
    staleTime: 5 * 60 * 1000,
  });
  const { data: dmm } = useQuery({
    queryKey: ["dmm-uzbtk"],
    queryFn: fetchDmmUzbtk,
    staleTime: 5 * 60 * 1000,
  });
  const { data: monteCarlo } = useQuery({
    queryKey: ["monte-carlo-npv-uzbtk"],
    queryFn: fetchMonteCarloNpvUzbtk,
    staleTime: 5 * 60 * 1000,
  });

  const digitalBeta = ols?.result.coefficients.digital_services ?? ols?.result.coefficients.ds_invest_mlrd;
  const traditionalBeta = ols?.result.coefficients.traditional_services ?? ols?.result.coefficients.capex_mlrd;
  const betaTotal = (digitalBeta?.coef ?? 0) + (traditionalBeta?.coef ?? 0);
  const digitalPct = betaTotal ? ((digitalBeta?.coef ?? 0) / betaTotal) * 100 : 0;
  const traditionalPct = betaTotal ? ((traditionalBeta?.coef ?? 0) / betaTotal) * 100 : 0;
  const ratio = traditionalBeta?.coef ? (digitalBeta?.coef ?? 0) / traditionalBeta.coef : 0;

  const revenueTrend = live?.chart_data.revenue_trend ?? [];
  const revenueChartData = revenueTrend.map((d) => ({
    year: d.year,
    actual: d.is_forecast ? null : d.value,
    forecast: d.is_forecast ? d.value : null,
  })) as { year: number; actual: number | null; forecast: number | null }[];
  const firstForecastIdx = revenueChartData.findIndex((d) => d.forecast !== null);
  if (firstForecastIdx > 0) {
    revenueChartData[firstForecastIdx - 1].forecast = revenueChartData[firstForecastIdx - 1].actual;
  }

  const deaComparison = live?.chart_data.dea_comparison ?? [];

  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Bosh Panel — Umumiy Ko'rinish" : "Dashboard — Overview"}
        subtitle={lang === "uz"
          ? "O'zbektelekom AK raqamli iqtisodiyot ko'rsatkichlari · 2015-2028 · jonli API"
          : "O'zbektelekom JSC digital economy indicators · 2015-2028 · live API"}
        badge={lang === "uz" ? "Asosiy Panel" : "Main Panel"}
      />

      {/* Paradox banner */}
      <div className="mb-6 rounded-lg border-l-4 border-gold bg-gold/10 p-5">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 text-gold shrink-0 mt-0.5" />
          <div>
            <div className="text-xs uppercase tracking-wider text-gold font-bold mb-1">
              {t("signed_finding")}
            </div>
            <h2 className="font-display font-bold text-lg text-navy-deep mb-1">
              {lang === "uz" ? "Infratuzilma Paradoksi" : "The Infrastructure Paradox"}
            </h2>
            <p className="text-sm text-foreground/80 max-w-4xl">
              {ols
                ? (lang === "uz"
                    ? `Raqamli xizmatlar investitsiyasi (raqamli xizmatlar) kapital investitsiyasiga (an'anaviy xizmatlar) nisbatan EBITDA ga ${ratio.toFixed(2)}× kuchliroq ta'sir ko'rsatadi (R² = ${ols.result.r_squared.toFixed(3)}, p < 0.001).`
                    : `Digital-services investment (raqamli xizmatlar) drives EBITDA ${ratio.toFixed(2)}× more strongly than traditional services (an'anaviy xizmatlar) (R² = ${ols.result.r_squared.toFixed(3)}, p < 0.001).`)
                : (lang === "uz" ? "Jonli ma'lumotlar yuklanmoqda..." : "Loading live data...")}
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label={t("kpi_dea")} value={live ? live.dea_summary.ccr_score.toFixed(2) : "0.72"} tone="gold"
          hint={live ? `${t("target")}: 0.85 · #${live.dea_summary.rank_in_region} ${lang === "uz" ? "mintaqada" : "in region"}` : `${t("target")}: 0.85`}
          icon={<Target className="size-4" />} />
        <KpiCard label={t("kpi_tfp")} value={live ? live.dea_summary.tfp.toFixed(2) : "1.46"} tone="info"
          hint={lang === "uz" ? "Mintaqada eng yuqori TFP" : "Highest TFP in the region"}
          icon={<TrendingUp className="size-4" />} />
        <KpiCard label={t("kpi_r2")} value={ols ? ols.result.r_squared.toFixed(3) : (live ? live.ols_key_result.r_squared.toFixed(3) : "0.971")} tone="success"
          hint={lang === "uz" ? "Juda yuqori tushuntirish kuchi" : "Very high explanatory power"}
          icon={<Award className="size-4" />} />
        <KpiCard label={t("kpi_npv")} value={monteCarlo ? monteCarlo.summary.mean_npv.toLocaleString() : "..."} unit={t("bln_sum")} tone="navy"
          hint={monteCarlo ? `P = ${monteCarlo.summary.success_probability.toFixed(1)}%` : undefined} icon={<Wallet className="size-4" />} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <SectionCard title={t("revenue_dyn")} subtitle={lang === "uz" ? "mlrd so'm · 2015-2028 · jonli API" : "bln UZS · 2015-2028 · live API"}>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-navy)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-navy)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="actual" name={lang === "uz" ? "Haqiqiy (2015-2023)" : "Actual (2015-2023)"}
                  stroke="var(--color-navy)" fill="url(#actualGrad)" strokeWidth={2.5} connectNulls />
                <Area type="monotone" dataKey="forecast" name={lang === "uz" ? "Prognoz (2024-2028)" : "Forecast (2024-2028)"}
                  stroke="var(--color-gold)" fill="url(#forecastGrad)" strokeWidth={2.5} strokeDasharray="5 5" connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
              {lang === "uz" ? "Yuklanmoqda..." : "Loading..."}
            </div>
          )}
        </SectionCard>

        <SectionCard title={lang === "uz" ? "DEA-CCR — Mintaqaviy Taqqoslama" : "DEA-CCR — Regional Comparison"}
          subtitle={lang === "uz" ? "DEA-CCR ball · 2023 · jonli API" : "DEA-CCR score · 2023 · live API"}>
          {deaComparison.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deaComparison} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 1]} stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis dataKey="operator_name" type="category" width={110} stroke="var(--color-muted-foreground)" fontSize={10} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="ccr_score" name="DEA-CCR" radius={[0, 4, 4, 0]}>
                  {deaComparison.map((d, i) => (
                    <Cell key={i} fill={d.operator_code === "UZBTK" ? "var(--color-gold)" : "var(--color-navy)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-muted-foreground">
              {lang === "uz" ? "Yuklanmoqda..." : "Loading..."}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Bottom panels — β, GARCH, DMM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title={t("beta_compare")} subtitle={lang === "uz" ? "OLS Regressiya · jonli API" : "OLS Regression · live API"}>
          <div className="space-y-4">
            <BetaBar label={lang === "uz" ? "β raqamli xizmatlar (raqamli investitsiya)" : "β raqamli xizmatlar (digital services)"}
              value={digitalBeta?.coef ?? 0.847} pct={digitalPct || 82.6} tone="success" />
            <BetaBar label="β an'anaviy xizmatlar" value={traditionalBeta?.coef ?? 0.178} pct={traditionalPct || 17.4} tone="navy" />
            <div className="pt-3 border-t text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{lang === "uz" ? "Nisbat" : "Ratio"}</div>
              <div className="kpi-value text-gold mt-1">{(ratio || 4.76).toFixed(2)}×</div>
              <div className="text-xs text-muted-foreground mt-1">
                R² = {ols ? ols.result.r_squared.toFixed(3) : "0.971"} · p &lt; 0.001
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("garch_results")} subtitle="ARCH/GARCH volatility model">
          <div className="space-y-3 text-sm">
            <Row label="α₁ (ARCH)" value={garch ? garch.parameters.alpha.toFixed(3) : "..."} tone="gold" />
            <Row label="β₁ (GARCH)" value={garch ? garch.parameters.beta.toFixed(3) : "..."} tone="gold" />
            <Row label="α₁ + β₁" value={garch ? garch.parameters.persistence.toFixed(3) : "..."} tone="destructive" hint={garch?.summary.stationary ? (lang === "uz" ? "< 1 barqarorlik" : "< 1 stationary") : undefined} />
            <Row label={lang === "uz" ? "Yillik volatillik" : "Annual volatility"} value={garch ? `${garch.summary.annual_volatility.toFixed(1)}%` : "..."} tone="info" />
          </div>
        </SectionCard>

        <SectionCard title={t("dmm_results")} subtitle="TM Forum Digital Maturity Model">
          <div className="space-y-3 text-sm">
            <Row label="Previous -> current" value={dmm ? `${dmm.summary.previous_score.toFixed(2)} -> ${dmm.summary.current_score.toFixed(2)}` : "..."} tone="navy" hint={dmm ? `+${dmm.summary.delta.toFixed(2)}` : undefined} />
            <Row label={lang === "uz" ? "Yetuklik darajasi" : "Maturity stage"} value={dmm ? (lang === "uz" ? `Bosqich ${dmm.summary.maturity_stage}` : `Stage ${dmm.summary.maturity_stage}`) : "..."} tone="info" />
            <Row label={lang === "uz" ? "Maqsad 2028" : "Goal 2028"} value={dmm ? `${dmm.summary.target_2025.toFixed(1)} / 5.0` : "..."} tone="success" />
            <Row label={lang === "uz" ? "Mintaqaviy o'rin" : "Regional rank"} value={lang === "uz" ? "Infra: 1 · Xizmat: 3" : "Infra: 1 · Service: 3"} tone="gold" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function BetaBar({ label, value, pct, tone }: { label: string; value: number; pct: number; tone: "success" | "navy" }) {
  const color = tone === "success" ? "bg-success" : "bg-navy";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-foreground/80">{label}</span>
        <span className="font-semibold tabular-nums">+{value.toFixed(3)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Row({ label, value, tone, hint }: { label: string; value: string; tone: string; hint?: string }) {
  const colors: Record<string, string> = {
    gold: "text-gold", navy: "text-navy", success: "text-success",
    info: "text-info", destructive: "text-destructive",
  };
  return (
    <div className="flex justify-between items-center py-1.5 border-b border-border/50 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <div className="text-right">
        <div className={`font-semibold tabular-nums ${colors[tone] ?? ""}`}>{value}</div>
        {hint && <div className="text-[10px] text-muted-foreground">{hint}</div>}
      </div>
    </div>
  );
}
