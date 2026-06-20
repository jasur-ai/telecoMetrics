import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { digitalShare, digitalBreakdown } from "@/lib/data";
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
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Raqamli Xizmatlar Tahlili" : "Digital Services Analysis"}
        subtitle={lang === "uz" ? "Raqamli daromad ulushi va segmentlar dinamikasi" : "Digital revenue share & segment dynamics"}
        badge={lang === "uz" ? "Daromad" : "Revenue"}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label={lang === "uz" ? "Raqamli ulush 2023" : "Digital share 2023"} value="34.2" unit="%" tone="success" hint="2015: 14.8%" />
        <KpiCard label={lang === "uz" ? "Mutlaq daromad" : "Absolute revenue"} value="5,900" unit="mlrd" tone="gold" hint="+602% vs 2015" />
        <KpiCard label="Top segment β" value="0.912" tone="info" hint={lang === "uz" ? "Bulut xizmatlar" : "Cloud services"} />
        <KpiCard label="CAGR 2015-2023" value="27.6" unit="%" tone="navy" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SectionCard title={lang === "uz" ? "Raqamli Xizmatlar O'sish Dinamikasi" : "Digital Services Growth Dynamics"}
            subtitle={lang === "uz" ? "Raqamli ulush, %" : "Digital share, %"}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={digitalShare}>
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

        <SectionCard title={lang === "uz" ? "Segment Tarkibi 2023" : "Segment Composition 2023"}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={digitalBreakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={100} paddingAngle={2}>
                {digitalBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      <SectionCard title={lang === "uz" ? "β Koeffitsiyentlar — Segment Bo'yicha" : "β Coefficients — By Segment"} subtitle="OLS regression">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {[
            { name: "Bulut / Cloud", b: 0.912 },
            { name: "Mobil internet / Mobile internet", b: 0.884 },
            { name: "IPTV / OTT", b: 0.861 },
            { name: "B2B SaaS", b: 0.847 },
            { name: "Raqamli to'lov / Digital payments", b: 0.823 },
            { name: "Ovozli xizmatlar / Voice", b: 0.178 },
            { name: "SMS", b: 0.152 },
            { name: "Roaming", b: 0.165 },
          ].map((r) => (
            <div key={r.name} className="flex items-center justify-between py-2 border-b border-border/50">
              <span>{r.name}</span>
              <span className={`font-semibold tabular-nums ${r.b > 0.5 ? "text-success" : "text-muted-foreground"}`}>β = {r.b}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
