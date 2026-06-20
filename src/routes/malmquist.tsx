import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { fetchMalmquistUzbtk } from "@/lib/api";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export const Route = createFileRoute("/malmquist")({
  head: () => ({ meta: [{ title: "Malmquist TFP — TelecoMetrics.uz" }] }),
  component: Page,
});

function tfpBadge(tfp: number) {
  if (tfp >= 1.6) return "EN YUQORI";
  if (tfp >= 1.4) return "KUCHLI";
  if (tfp >= 1.2) return "O'RTACHA";
  if (tfp >= 1.1) return "PAST";
  return "SUST";
}

function Page() {
  const { lang } = useI18n();
  const { data: mq } = useQuery({
    queryKey: ["malmquist-uzbtk"],
    queryFn: fetchMalmquistUzbtk,
    staleTime: 5 * 60 * 1000,
  });
  const trend = mq?.trend ?? [];

  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Malmquist TFP Tahlili" : "Malmquist TFP Analysis"}
        subtitle={lang === "uz"
          ? "Total Factor Productivity · EC × TC dekompozitsiyasi · jonli API"
          : "Total Factor Productivity · EC × TC decomposition · live API"}
        badge="Malmquist"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label={lang === "uz" ? "TFP (2020–2025)" : "TFP (2020–2025)"} value={mq ? mq.result.tfp.toFixed(2) : "1.46"} tone="gold"
          hint={lang === "uz" ? "Kumulativ" : "Cumulative"} />
        <KpiCard label="EC (Efficiency Change)" value={mq ? mq.result.efficiency_change_ec.toFixed(2) : "1.18"} tone="info"
          hint={mq ? `+${((mq.result.efficiency_change_ec - 1) * 100).toFixed(0)}%` : "+18%"} />
        <KpiCard label="TC (Technical Change)" value={mq ? mq.result.technology_change_tc.toFixed(2) : "1.18"} tone="success"
          hint={mq ? `+${((mq.result.technology_change_tc - 1) * 100).toFixed(0)}%` : "+24%"} />
        <KpiCard label={lang === "uz" ? "Mintaqaviy o'rin" : "Regional standing"}
          value={mq ? mq.result.benchmark : (lang === "uz" ? "Eng yuqori TFP" : "Highest TFP")} tone="navy" />
      </div>

      <SectionCard title={lang === "uz" ? "Malmquist TFP Yillik Dinamikasi" : "Malmquist TFP Annual Dynamics"}
        subtitle="EC · TC · TFP">
        {trend.length > 0 ? (
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="period" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} domain={[0.9, 1.6]} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="ec" name="EC (Efficiency)" fill="var(--color-navy)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="tc" name="TC (Technical)" fill="var(--color-info)" radius={[4, 4, 0, 0]} />
              <Line type="monotone" dataKey="tfp" name="TFP Index" stroke="var(--color-gold)" strokeWidth={3} dot={{ r: 5, fill: "var(--color-gold)" }} />
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[340px] flex items-center justify-center text-sm text-muted-foreground">
            {lang === "uz" ? "Yuklanmoqda..." : "Loading..."}
          </div>
        )}
      </SectionCard>

      <SectionCard title={lang === "uz" ? "Davr Bo'yicha Dekompozitsiya Jadvali" : "Period Decomposition Table"} subtitle="EC · TC · TFP · Badge">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-2 pr-3">Period</th>
                <th className="py-2 px-3 text-right">EC</th>
                <th className="py-2 px-3 text-right">TC</th>
                <th className="py-2 px-3 text-right">TFP</th>
                <th className="py-2 pl-3 text-right">Badge</th>
              </tr>
            </thead>
            <tbody>
              {trend.map((r) => (
                <tr key={r.period} className="border-b border-border/50">
                  <td className="py-2 pr-3 font-medium">{r.period}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{r.ec.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{r.tc.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right tabular-nums font-semibold">{r.tfp.toFixed(2)}</td>
                  <td className="py-2 pl-3 text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      r.tfp >= 1.6 ? "bg-gold/20 text-gold" :
                      r.tfp >= 1.4 ? "bg-success/15 text-success" :
                      r.tfp >= 1.2 ? "bg-info/15 text-info" : "bg-muted text-muted-foreground"
                    }`}>{tfpBadge(r.tfp)}</span>
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
