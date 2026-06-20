import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { fetchDigitalServicesUzbtk } from "@/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/digital-services")({
  head: () => ({ meta: [{ title: "Raqamli Xizmatlar — TelecoMetrics.uz" }] }),
  component: Page,
});

const COLORS = ["var(--color-gold)", "var(--color-navy)", "var(--color-info)", "var(--color-success)", "var(--color-warning)", "var(--color-destructive)"];

function Page() {
  const { lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["digital-services-uzbtk"],
    queryFn: fetchDigitalServicesUzbtk,
    staleTime: 5 * 60 * 1000,
  });
  const trend = data?.trend ?? [];
  const breakdown = data?.breakdown_2025 ?? [];
  const summary = data?.summary;
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Raqamli Xizmatlar Tahlili" : "Digital Services Analysis"}
        subtitle={lang === "uz" ? "Raqamli daromad ulushi va segmentlar dinamikasi" : "Digital revenue share & segment dynamics"}
        badge={lang === "uz" ? "Daromad" : "Revenue"}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label={lang === "uz" ? "Raqamli ulush 2025" : "Digital share 2025"} value={summary ? summary.share_2025.toFixed(1) : "..."} unit="%" tone="success" hint={summary ? `2030: ${summary.share_2030.toFixed(1)}%` : undefined} />
        <KpiCard label={lang === "uz" ? "Mutlaq daromad" : "Absolute revenue"} value={summary ? summary.digital_revenue_2025.toLocaleString() : "..."} unit="mlrd" tone="gold" hint={summary ? `2030: ${summary.digital_revenue_2030.toLocaleString()} mlrd` : undefined} />
        <KpiCard label="DS_invest β" value={summary ? summary.ds_invest_beta.toFixed(3) : "..."} tone="info" hint={lang === "uz" ? "OLS koeffitsiyent" : "OLS coefficient"} />
        <KpiCard label="CAGR 2025-2030" value={summary ? summary.digital_revenue_cagr_2025_2030.toFixed(1) : "..."} unit="%" tone="navy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SectionCard title={lang === "uz" ? "Raqamli Xizmatlar O'sish Dinamikasi" : "Digital Services Growth Dynamics"}
            subtitle={lang === "uz" ? "Raqamli ulush, %" : "Digital share, %"}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="share" fill="var(--color-gold)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground mt-3">
              {lang === "uz"
                ? "2020-yilda COVID-19 ta'siridan 27.8% ga tushish, keyin jadal tiklanish."
                : "2020 COVID-19 dip to 27.8%, then rapid recovery."}
            </p>
          </SectionCard>
        </div>

        <SectionCard title={lang === "uz" ? "Segment Tarkibi 2025" : "Segment Composition 2025"}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={100} paddingAngle={2}>
                {breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title={lang === "uz" ? "Segment ulushlari" : "Segment Shares"} subtitle="2025 digital revenue">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {breakdown.map((r) => (
            <div key={r.name} className="flex items-center justify-between py-2 border-b border-border/50">
              <span>{r.name}</span>
              <span className="font-semibold tabular-nums text-success">{r.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
