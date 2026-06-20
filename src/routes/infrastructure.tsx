import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { KpiCard, SectionCard, PageHeader } from "@/components/kpi-card";
import { dmus, deaInputs } from "@/lib/data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/infrastructure")({
  head: () => ({ meta: [{ title: "Infratuzilma Tahlili — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Infratuzilma Tahlili" : "Infrastructure Analysis"}
        subtitle={lang === "uz"
          ? "Data Envelopment Analysis (DEA-CCR) · 8 ta Markaziy Osiyo operatori"
          : "Data Envelopment Analysis (DEA-CCR) · 8 Central Asian operators"}
        badge="DEA-CCR"
      />

      <div className="mb-6 rounded-lg border-l-4 border-gold bg-gold/10 p-5 flex gap-3">
        <AlertTriangle className="size-5 text-gold shrink-0 mt-0.5" />
        <div>
          <h2 className="font-display font-bold text-navy-deep">{lang === "uz" ? "Infratuzilma Paradoksi" : "Infrastructure Paradox"}</h2>
          <p className="text-sm text-foreground/80 mt-1">
            {lang === "uz"
              ? "Tarmoq qamrovi 94.2%, tola optik 48,500 km — mintaqada birinchi. Ammo DEA-CCR samaradorligi 0.72. Infratuzilmadan to'liq foydalanilmayapti."
              : "Network coverage 94.2%, fiber 48,500 km — regional #1. Yet DEA-CCR efficiency is only 0.72. The infrastructure is under-utilized."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label="DEA-CCR" value="0.72" tone="gold" hint={lang === "uz" ? "28% zaxira" : "28% slack"} />
        <KpiCard label={lang === "uz" ? "Tarmoq qamrovi" : "Network coverage"} value="94.2" unit="%" tone="success" hint="Regional #1" />
        <KpiCard label={lang === "uz" ? "Tola optik" : "Fiber optic"} value="48,500" unit="km" tone="info" hint="+12% (2023)" />
        <KpiCard label="4G / 5G" value="78.4" unit="%" tone="navy" hint={lang === "uz" ? "5G pilot 2023" : "5G pilot 2023"} />
      </div>

      <SectionCard title={lang === "uz" ? "DMU Samaradorlik Taqqoslamasi" : "DMU Efficiency Comparison"}
        subtitle="DEA-CCR scores by operator">
        <ResponsiveContainer width="100%" height={340}>
          <BarChart data={dmus} layout="vertical" margin={{ left: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" domain={[0, 1]} stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis dataKey="name" type="category" width={130} stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            <Bar dataKey="ccr" name="DEA-CCR" radius={[0, 4, 4, 0]}>
              {dmus.map((d, i) => (
                <Cell key={i} fill={d.highlight ? "var(--color-gold)" : "var(--color-navy)"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
        <SectionCard title={lang === "uz" ? "DEA Kirish Variablelari" : "DEA Input Variables"}
          subtitle={lang === "uz" ? "Og'irlik va samaradorlik hissasi" : "Weights & contribution"}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                  <th className="py-2 pr-3">Input</th>
                  <th className="py-2 px-3 text-right">Value</th>
                  <th className="py-2 px-3 text-right">Weight</th>
                  <th className="py-2 pl-3 text-right">Contrib %</th>
                </tr>
              </thead>
              <tbody>
                {deaInputs.map((r) => (
                  <tr key={r.name} className="border-b border-border/50">
                    <td className="py-2.5 pr-3">{r.name}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{r.value}</td>
                    <td className="py-2.5 px-3 text-right tabular-nums">{r.weight.toFixed(3)}</td>
                    <td className={`py-2.5 pl-3 text-right tabular-nums font-semibold ${
                      r.contrib >= 80 ? "text-success" : r.contrib >= 65 ? "text-gold" : "text-destructive"
                    }`}>{r.contrib}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title={lang === "uz" ? "DMU Texnik & Miqyos Samaradorligi" : "DMU Technical & Scale Efficiency"}
          subtitle="CCR vs BCC vs Scale">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b">
                  <th className="py-2 pr-3">DMU</th>
                  <th className="py-2 px-3 text-right">CCR</th>
                  <th className="py-2 px-3 text-right">BCC</th>
                  <th className="py-2 pl-3 text-right">Scale</th>
                </tr>
              </thead>
              <tbody>
                {dmus.map((d) => (
                  <tr key={d.name} className={`border-b border-border/50 ${d.highlight ? "bg-gold/10" : ""}`}>
                    <td className="py-2 pr-3 font-medium">{d.name}{d.highlight && " ★"}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{d.ccr.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{d.bcc.toFixed(2)}</td>
                    <td className="py-2 pl-3 text-right tabular-nums">{d.scale.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
