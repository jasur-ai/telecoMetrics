import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { SectionCard, PageHeader } from "@/components/kpi-card";
import { fetchBenchmark2025 } from "@/lib/api";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";
import { Info } from "lucide-react";

export const Route = createFileRoute("/regional")({
  head: () => ({ meta: [{ title: "Mintaqaviy Taqqoslash — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["benchmark-2025"],
    queryFn: fetchBenchmark2025,
    staleTime: 5 * 60 * 1000,
  });
  const rawRegional = data?.data ?? [];
  const totalRevenue = rawRegional.reduce((sum, r) => sum + r.revenue_mlrd, 0) || 1;
  const regional = rawRegional.map((r) => ({
    country: r.country,
    infra: r.coverage_pct,
    digital: r.digital_rev_pct,
    revenue: r.revenue_mlrd,
    revenueShare: (r.revenue_mlrd / totalRevenue) * 100,
    efficiency: r.ccr_score * 100,
    maturity: r.dmm_score,
    highlight: r.code === "UZBTK",
  }));
  const maxRevenue = Math.max(...regional.map((r) => r.revenue), 1);
  const radarData = ["infra", "digital", "revenue", "efficiency", "maturity"].map((key) => {
    const row: any = { metric: key };
    regional.forEach((r) => {
      row[r.country] = key === "maturity"
        ? r.maturity * 20
        : key === "revenue"
          ? (r.revenue / maxRevenue) * 100
          : r[key as keyof typeof r];
    });
    return row;
  });

  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Mintaqaviy Taqqoslash" : "Regional Comparison"}
        subtitle={lang === "uz" ? "Markaziy Osiyo telecom operatorlari" : "Central Asian telecom operators"}
        badge={lang === "uz" ? "5 mamlakat" : "5 countries"}
      />

      <div className="mb-6 rounded-lg border-l-4 border-info bg-info/10 p-5 flex gap-3">
        <Info className="size-5 text-info shrink-0 mt-0.5" />
        <div>
          <h2 className="font-display font-bold text-navy-deep">{lang === "uz" ? "Strategik topilma" : "Strategic finding"}</h2>
          <p className="text-sm text-foreground/80 mt-1">
            {lang === "uz"
              ? "O'zbektelekom infratuzilma bo'yicha mintaqada 1-o'rinda, ammo raqamli xizmatlar daromadi ulushi bo'yicha Qozog'iston va Ozarbayjondan orqada — 'infratuzilma paradoksi' ning asosiy ko'rsatkichi."
              : "O'zbektelekom ranks #1 regionally in infrastructure, but trails Kazakhstan and Azerbaijan on digital revenue share — the core indicator of the 'infrastructure paradox'."}
          </p>
        </div>
      </div>

      <SectionCard title={lang === "uz" ? "Solishtirma Jadval" : "Comparative Table"}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                <th className="py-2 pr-3">Country</th>
                <th className="py-2 px-3 text-right">Infra %</th>
                <th className="py-2 px-3 text-right">Digital share %</th>
                <th className="py-2 px-3 text-right">Revenue share %</th>
                <th className="py-2 px-3 text-right">DEA</th>
                <th className="py-2 pl-3 text-right">DMM</th>
              </tr>
            </thead>
            <tbody>
              {regional.map((r) => (
                <tr key={r.country} className={`border-b border-border/50 ${r.highlight ? "bg-gold/10 font-medium" : ""}`}>
                  <td className="py-2 pr-3">{r.country}{r.highlight && " ★"}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{r.infra}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{r.digital}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{r.revenueShare.toFixed(1)}</td>
                  <td className="py-2 px-3 text-right tabular-nums">{(r.efficiency / 100).toFixed(2)}</td>
                  <td className="py-2 pl-3 text-right tabular-nums">{r.maturity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <SectionCard title={lang === "uz" ? "Radar — 5 ko'rsatkich" : "Radar — 5 metrics"}>
          <ResponsiveContainer width="100%" height={340}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
              <Radar name="Uzbekistan" dataKey="Uzbekistan" stroke="var(--color-gold)" fill="var(--color-gold)" fillOpacity={0.4} />
              <Radar name="Kazakhstan" dataKey="Kazakhstan" stroke="var(--color-navy)" fill="var(--color-navy)" fillOpacity={0.15} />
              <Radar name="Azerbaijan" dataKey="Azerbaijan" stroke="var(--color-info)" fill="var(--color-info)" fillOpacity={0.15} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title={lang === "uz" ? "Raqamli daromad ulushi" : "Digital revenue share"} subtitle="%">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={regional}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="country" stroke="var(--color-muted-foreground)" fontSize={10} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Bar dataKey="digital" radius={[6, 6, 0, 0]}>
                {regional.map((r, i) => (
                  <Cell key={i} fill={r.highlight ? "var(--color-gold)" : "var(--color-navy)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}
