import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { olsScatter } from "@/lib/data";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

export const Route = createFileRoute("/ols")({
  head: () => ({ meta: [{ title: "OLS Regressiya — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "OLS Regressiya Tahlili" : "OLS Regression Analysis"}
        subtitle={lang === "uz" ? "Eng kichik kvadratlar usuli · 72 kvartal" : "Ordinary Least Squares · 72 quarters"}
        badge="OLS"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="R²" value="0.971" tone="success" hint="97.1% explained" />
        <KpiCard label="β₁ Digital" value="+0.847" tone="gold" />
        <KpiCard label="β₂ Traditional" value="+0.178" tone="navy" />
        <KpiCard label="F-statistic" value="2,431" tone="info" hint="p < 0.001" />
      </div>

      <SectionCard title={lang === "uz" ? "Haqiqiy vs Bashorat qilingan" : "Actual vs Predicted"}
        subtitle="OLS scatter · 72 observations">
        <ResponsiveContainer width="100%" height={380}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" dataKey="actual" name="Actual" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis type="number" dataKey="predicted" name="Predicted" stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} cursor={{ strokeDasharray: "3 3" }} />
            <ReferenceLine segment={[{ x: 1000, y: 1000 }, { x: 7000, y: 7000 }]} stroke="var(--color-navy)" strokeDasharray="5 5" />
            <Scatter data={olsScatter} fill="var(--color-gold)" fillOpacity={0.65} />
          </ScatterChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <SectionCard title={lang === "uz" ? "Normallik (Shapiro-Wilk)" : "Normality (Shapiro-Wilk)"}>
          <div className="text-center py-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">W-statistic</div>
            <div className="kpi-value text-success my-2">0.984</div>
            <div className="text-xs">p = 0.412 · Normal ✓</div>
          </div>
        </SectionCard>
        <SectionCard title={lang === "uz" ? "Geteroskedastislik (White)" : "Heteroscedasticity (White)"}>
          <div className="text-center py-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">White-test</div>
            <div className="kpi-value text-success my-2">8.42</div>
            <div className="text-xs">p = 0.078 · Homoscedastic ✓</div>
          </div>
        </SectionCard>
        <SectionCard title={lang === "uz" ? "Avtokorrelyatsiya (Durbin-Watson)" : "Autocorrelation (Durbin-Watson)"}>
          <div className="text-center py-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">DW-statistic</div>
            <div className="kpi-value text-success my-2">1.94</div>
            <div className="text-xs">Range 1.5–2.5 · No autocorr ✓</div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
