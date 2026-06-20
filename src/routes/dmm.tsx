import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { fetchDmmUzbtk } from "@/lib/api";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, Legend } from "recharts";

export const Route = createFileRoute("/dmm")({
  head: () => ({ meta: [{ title: "TM Forum DMM — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const { data } = useQuery({
    queryKey: ["dmm-uzbtk"],
    queryFn: fetchDmmUzbtk,
    staleTime: 5 * 60 * 1000,
  });
  const domains = data?.domains ?? [];
  const summary = data?.summary;
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "TM Forum Digital Maturity Model v5.0" : "TM Forum Digital Maturity Model v5.0"}
        subtitle={lang === "uz" ? "5 ta domen bo'yicha yetuklik darajasi" : "Maturity scoring across 5 domains"}
        badge="DMM v5.0"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label={lang === "uz" ? "Joriy ball" : "Current score"} value={summary ? summary.current_score.toFixed(2) : "..."} unit="/ 5.0" tone="gold" />
        <KpiCard label={lang === "uz" ? "O'tgan yil" : "Previous"} value={summary ? summary.previous_score.toFixed(2) : "..."} tone="navy" hint={summary ? `+${summary.delta.toFixed(2)}` : undefined} />
        <KpiCard label={lang === "uz" ? "Yetuklik bosqichi" : "Maturity stage"} value={summary ? summary.maturity_stage : "..."} unit={lang === "uz" ? "Belgilangan" : "Defined"} tone="info" />
        <KpiCard label={lang === "uz" ? "Eng zaif" : "Weakest"} value={summary ? summary.weakest_score.toFixed(2) : "..."} tone="destructive" hint={summary?.weakest_domain} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SectionCard title={lang === "uz" ? "Domenlar bo'yicha Radar" : "Radar by Domain"}>
          <ResponsiveContainer width="100%" height={360}>
            <RadarChart data={domains}>
              <PolarGrid stroke="var(--color-border)" />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Radar name="Current" dataKey="score" stroke="var(--color-gold)" fill="var(--color-gold)" fillOpacity={0.45} />
              <Radar name="Target 2025" dataKey="target" stroke="var(--color-navy)" fill="var(--color-navy)" fillOpacity={0.15} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            </RadarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title={lang === "uz" ? "Domen Ko'rsatkichlari" : "Domain Scores"}>
          <div className="space-y-4">
            {domains.map((d) => (
              <div key={d.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-foreground/80">{d.name}</span>
                  <span className="font-semibold tabular-nums">{d.score.toFixed(2)} <span className="text-muted-foreground text-xs">/ {d.target}</span></span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${(d.score / 5) * 100}%` }} />
                  <div className="absolute inset-y-0 w-px bg-navy" style={{ left: `${(d.target / 5) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t text-xs text-muted-foreground">
            {lang === "uz"
              ? "Mintaqaviy o'rin: infratuzilma — 1, raqamli xizmatlar — 3"
              : "Regional rank: infrastructure — 1, digital services — 3"}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
