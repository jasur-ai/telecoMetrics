import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { malmquistTable, malmquist } from "@/lib/data";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export const Route = createFileRoute("/malmquist")({
  head: () => ({ meta: [{ title: "Malmquist TFP — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Malmquist TFP Tahlili" : "Malmquist TFP Analysis"}
        subtitle={lang === "uz" ? "Total Factor Productivity · EC × TC dekompozitsiyasi" : "Total Factor Productivity · EC × TC decomposition"}
        badge="Malmquist"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="TFP 2023" value="1.64" tone="gold" hint={lang === "uz" ? "Eng yuqori" : "Highest"} />
        <KpiCard label="EC (Efficiency Change)" value="1.25" tone="info" hint="+25%" />
        <KpiCard label="TC (Technical Change)" value="1.24" tone="success" hint="+24%" />
        <KpiCard label={lang === "uz" ? "Kumulatif TFP" : "Cumulative TFP"} value="8.94×" tone="navy" hint={lang === "uz" ? "8 yil davomida" : "over 8 years"} />
      </div>

      <SectionCard title={lang === "uz" ? "Malmquist TFP Yillik Dinamikasi" : "Malmquist TFP Annual Dynamics"}
        subtitle="EC · TC · TFP">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={malmquist}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={[0.9, 1.8]} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="ec" name="EC (Efficiency)" fill="var(--color-navy)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="tc" name="TC (Technical)" fill="var(--color-info)" radius={[4, 4, 0, 0]} />
            <Line type="monotone" dataKey="tfp" name="TFP Index" stroke="var(--color-gold)" strokeWidth={3} dot={{ r: 5, fill: "var(--color-gold)" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </SectionCard>

      <SectionCard title={lang === "uz" ? "Yillik Dekompozitsiya Jadvali" : "Annual Decomposition Table"} subtitle="EC · TC · TFP · Badge">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-2 pr-3">Year</th>
                <th className="py-2 px-3 text-right">EC</th>
                <th className="py-2 px-3 text-right">TC</th>
                <th className="py-2 px-3 text-right">TFP</th>
                <th className="py-2 pl-3 text-right">Badge</th>
              </tr>
            </thead>
            <tbody>
              {malmquistTable.map((r) => (
                <tr key={r.year} className="border-b border-border/50">
                  <td className="py-2 pr-3 font-medium">{r.year}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{r.ec.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{r.tc.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right tabular-nums font-semibold">{r.tfp.toFixed(2)}</td>
                  <td className="py-2 pl-3 text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      r.tfp >= 1.6 ? "bg-gold/20 text-gold" :
                      r.tfp >= 1.4 ? "bg-success/15 text-success" :
                      r.tfp >= 1.2 ? "bg-info/15 text-info" : "bg-muted text-muted-foreground"
                    }`}>{r.badge}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          {lang === "uz"
            ? "EC o'sishi TC dan sekinroq — texnologik yangilashlar amalga oshirilsa ham, foydalanish samaradorligi orqada qoladi. DEA-CCR=0.72 natijasi bilan uyg'un."
            : "EC growth lags TC — technology is being adopted, but utilization efficiency trails. Consistent with DEA-CCR=0.72."}
        </p>
      </SectionCard>
    </div>
  );
}
