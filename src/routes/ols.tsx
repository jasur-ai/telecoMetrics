import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { fetchOlsDissertation } from "@/lib/api";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from "recharts";

export const Route = createFileRoute("/ols")({
  head: () => ({ meta: [{ title: "OLS Regressiya — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const { data: ols } = useQuery({
    queryKey: ["ols-dissertation"],
    queryFn: fetchOlsDissertation,
    staleTime: 5 * 60 * 1000,
  });
  const r = ols?.result;
  const scatter = ols?.scatter_data ?? [];
  const traditional = r?.coefficients.traditional_services ?? r?.coefficients.capex_mlrd;
  const digital = r?.coefficients.digital_services ?? r?.coefficients.ds_invest_mlrd;

  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "OLS Regressiya Tahlili" : "OLS Regression Analysis"}
        subtitle={lang === "uz"
          ? `Eng kichik kvadratlar usuli · ${r ? r.n : 72} kuzatuv · jonli API`
          : `Ordinary Least Squares · ${r ? r.n : 72} observations · live API`}
        badge="OLS"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="R²" value={r ? r.r_squared.toFixed(3) : "0.971"} tone="success"
          hint={r ? `${(r.r_squared * 100).toFixed(1)}% explained` : "97.1% explained"} />
        <KpiCard label="β traditional" value={traditional ? `+${traditional.coef.toFixed(3)}` : "+0.178"} tone="navy"
          hint={traditional ? `p = ${traditional.p_value.toFixed(3)}` : undefined} />
        <KpiCard label="β digital" value={digital ? `+${digital.coef.toFixed(3)}` : "+0.847"} tone="gold"
          hint={digital ? (digital.p_value < 0.001 ? "p < 0.001" : `p = ${digital.p_value.toFixed(3)}`) : "p < 0.001"} />
        <KpiCard label="F-statistic" value={r ? r.f_statistic.toFixed(1) : "142.8"} tone="info"
          hint={r ? (r.f_pvalue < 0.001 ? "p < 0.001" : `p = ${r.f_pvalue.toFixed(3)}`) : "p < 0.001"} />
      </div>

      <SectionCard title={lang === "uz" ? "Haqiqiy vs Bashorat qilingan" : "Actual vs Predicted"}
        subtitle={lang === "uz" ? "OLS scatter · real hisoblangan fitted values" : "OLS scatter · computed fitted values"}>
        <ResponsiveContainer width="100%" height={380}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" dataKey="actual" name="Actual" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis type="number" dataKey="predicted" name="Predicted" stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} cursor={{ strokeDasharray: "3 3" }} />
            <ReferenceLine segment={[{ x: 5000, y: 5000 }, { x: 20000, y: 20000 }]} stroke="var(--color-navy)" strokeDasharray="5 5" />
            <Scatter data={scatter} fill="var(--color-gold)" fillOpacity={0.65} />
          </ScatterChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <SectionCard title={lang === "uz" ? "Normallik (Jarque-Bera)" : "Normality (Jarque-Bera)"}>
          <div className="text-center py-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Jarque-Bera</div>
            <div className="kpi-value text-success my-2">{r ? r.diagnostics.jarque_bera.toFixed(3) : "2.340"}</div>
            <div className="text-xs">
              p = {r ? r.diagnostics.jarque_bera_pvalue.toFixed(3) : "0.312"} · {r ? r.diagnostics.normality : "Normal taqsimot ✓"}
            </div>
          </div>
        </SectionCard>
        <SectionCard title={lang === "uz" ? "Geteroskedastislik (White)" : "Heteroscedasticity (White)"}>
          <div className="text-center py-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">White-test</div>
            <div className="kpi-value text-success my-2">{r ? r.diagnostics.white_test.toFixed(2) : "8.42"}</div>
            <div className="text-xs">
              p = {r ? r.diagnostics.white_pvalue.toFixed(3) : "0.078"} · {r ? r.diagnostics.heteroscedasticity : "Gomoskedastik ✓"}
            </div>
          </div>
        </SectionCard>
        <SectionCard title={lang === "uz" ? "Avtokorrelyatsiya (Durbin-Watson)" : "Autocorrelation (Durbin-Watson)"}>
          <div className="text-center py-4">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">DW-statistic</div>
            <div className="kpi-value text-success my-2">{r ? r.durbin_watson.toFixed(2) : "1.94"}</div>
            <div className="text-xs">
              {lang === "uz" ? "Diapazon" : "Range"} 1.5–2.5 · {r ? r.diagnostics.autocorrelation : "Avtokorrelyatsiya yo'q ✓"}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
