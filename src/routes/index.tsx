import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { revenueData, deaTrend } from "@/lib/data";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, Legend,
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

  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Bosh Panel — Umumiy Ko'rinish" : "Dashboard — Overview"}
        subtitle={lang === "uz"
          ? "O'zbektelekom JSC raqamli iqtisodiyot ko'rsatkichlari · 2015–2023 · 72 kvartal"
          : "O'zbektelekom JSC digital economy indicators · 2015–2023 · 72 quarters"}
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
            <h2 className="font-display font-bold text-lg text-navy-deep mb-1">{t("paradox_title")}</h2>
            <p className="text-sm text-foreground/80 max-w-4xl">{t("paradox_body")}</p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label={t("kpi_dea")} value="0.72" tone="gold"
          hint={`${t("target")}: 0.85 · −15%`} icon={<Target className="size-4" />} />
        <KpiCard label={t("kpi_tfp")} value="1.46" tone="info"
          hint={lang === "uz" ? "+46% unumdorlik o'sishi" : "+46% productivity gain"}
          icon={<TrendingUp className="size-4" />} />
        <KpiCard label={t("kpi_r2")} value="0.971" tone="success"
          hint={lang === "uz" ? "Juda yuqori tushuntirish kuchi" : "Very high explanatory power"}
          icon={<Award className="size-4" />} />
        <KpiCard label={t("kpi_npv")} value="15,200" unit={t("bln_sum")} tone="navy"
          hint="P ≥ 98.2%" icon={<Wallet className="size-4" />} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
        <SectionCard title={t("revenue_dyn")} subtitle={lang === "uz" ? "mlrd so'm" : "bln UZS"}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="digGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-gold)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-gold)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tradGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-navy)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-navy)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="traditional" name={t("traditional_rev")}
                stroke="var(--color-navy)" fill="url(#tradGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="digital" name={t("digital_rev")}
                stroke="var(--color-gold)" fill="url(#digGrad)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title={t("dea_trend")} subtitle="DEA-CCR Score · 2015–2023">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={deaTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis domain={[0.5, 1]} stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <ReferenceLine y={0.85} stroke="var(--color-success)" strokeDasharray="5 5"
                label={{ value: `${t("target")} 0.85`, position: "right", fill: "var(--color-success)", fontSize: 11 }} />
              <Line type="monotone" dataKey="dea" name="DEA-CCR"
                stroke="var(--color-gold)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-gold)" }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Bottom panels — β, GARCH, DMM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title={t("beta_compare")} subtitle="OLS Regression · 72 quarters">
          <div className="space-y-4">
            <BetaBar label="β₁ Raqamli / Digital" value={0.847} pct={84.7} tone="success" />
            <BetaBar label="β₂ An'anaviy / Traditional" value={0.178} pct={17.8} tone="navy" />
            <div className="pt-3 border-t text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">{lang === "uz" ? "Nisbat" : "Ratio"}</div>
              <div className="kpi-value text-gold mt-1">4.76×</div>
              <div className="text-xs text-muted-foreground mt-1">α = −2.341 · R² = 0.971 · p &lt; 0.001</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={t("garch_results")} subtitle="ARCH/GARCH volatility model">
          <div className="space-y-3 text-sm">
            <Row label="α₁ (ARCH)" value="0.412" tone="gold" />
            <Row label="β₁ (GARCH)" value="0.498" tone="gold" />
            <Row label="α₁ + β₁" value="0.910" tone="destructive" hint={lang === "uz" ? "< 1 barqarorlik ✓" : "< 1 stationary ✓"} />
            <Row label={lang === "uz" ? "Yillik volatillik" : "Annual volatility"} value="14.8%" tone="info" />
          </div>
        </SectionCard>

        <SectionCard title={t("dmm_results")} subtitle="TM Forum Digital Maturity Model">
          <div className="space-y-3 text-sm">
            <Row label="2022 → 2023" value="3.18 → 3.42" tone="navy" hint="+0.24" />
            <Row label={lang === "uz" ? "Yetuklik darajasi" : "Maturity stage"} value={lang === "uz" ? "Bosqich 3" : "Stage 3"} tone="info" />
            <Row label={lang === "uz" ? "Maqsad 2025" : "Goal 2025"} value="4.0 / 5.0" tone="success" />
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
