import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { SectionCard, PageHeader } from "@/components/kpi-card";
import { Database, Cpu, BarChart3, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/architecture")({
  head: () => ({ meta: [{ title: "Platforma Arxitekturasi — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  const layers = [
    {
      icon: Database, name: lang === "uz" ? "Ma'lumotlar qatlami" : "Data layer",
      desc: lang === "uz"
        ? "O'zbektelekom JSC ning 2015–2023 yillar uchun 72 kvartallik statistik ma'lumotlari · PostgreSQL · ETL pipeline"
        : "72 quarters of O'zbektelekom JSC statistics (2015–2023) · PostgreSQL · ETL pipeline",
      stack: ["PostgreSQL 15", "Apache Airflow", "Python pandas"],
    },
    {
      icon: Cpu, name: lang === "uz" ? "Analitik qatlam" : "Analytics layer",
      desc: lang === "uz"
        ? "DEA-CCR · Malmquist TFP · OLS · GARCH(1,1) · Monte-Carlo (10k iter.) · LSTM neyron tarmoqlari"
        : "DEA-CCR · Malmquist TFP · OLS · GARCH(1,1) · Monte-Carlo (10k iter.) · LSTM neural networks",
      stack: ["Python · scikit-learn", "statsmodels", "PyTorch (LSTM)", "DEAP"],
    },
    {
      icon: BarChart3, name: lang === "uz" ? "Qaror qatlami" : "Decision layer",
      desc: lang === "uz"
        ? "Plotly Dash + FastAPI · interaktiv boshqaruv paneli · tavsiyalar moduli"
        : "Plotly Dash + FastAPI · interactive dashboard · recommendations module",
      stack: ["FastAPI", "React + Recharts", "TanStack Start", "Dash"],
    },
  ];

  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Platforma Arxitekturasi" : "Platform Architecture"}
        subtitle={lang === "uz" ? "3 qatlamli ilmiy-analitik tizim" : "3-layer scientific-analytical system"}
        badge="DGU 2024"
      />

      <div className="space-y-4 mb-8">
        {layers.map((l, i) => {
          const Icon = l.icon;
          return (
            <div key={l.name} className="card-elevated p-5 flex gap-4 items-start">
              <div className="size-12 rounded-lg bg-navy text-primary-foreground flex items-center justify-center shrink-0">
                <Icon className="size-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-gold/20 text-gold">L{i + 1}</span>
                  <h3 className="font-semibold text-foreground">{l.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{l.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {l.stack.map((s) => (
                    <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SectionCard title={lang === "uz" ? "Ilmiy Yangilik Ko'rsatkichlari" : "Scientific Novelty Indicators"}>
          <div className="space-y-3 text-sm">
            {[
              { l: lang === "uz" ? "Birinchi marta qo'llanilgan" : "First-time applied", v: "DEA-CCR + Malmquist + GARCH ensemble" },
              { l: lang === "uz" ? "Kuzatuvlar soni" : "Observations", v: "72 quarters · 8 DMUs" },
              { l: lang === "uz" ? "Aniqlangan paradoks" : "Identified paradox", v: "β = 4.76× (digital/traditional)" },
              { l: lang === "uz" ? "Model aniqligi" : "Model accuracy", v: "R² = 0.971 · MAPE = 3.8%" },
            ].map((r) => (
              <div key={r.l} className="flex justify-between gap-3 py-2 border-b border-border/50">
                <span className="text-muted-foreground">{r.l}</span>
                <span className="font-semibold text-right">{r.v}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title={lang === "uz" ? "Sertifikatsiya va Ro'yxat" : "Certification & Registration"}>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-5 text-success shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">DGU State Registration</div>
                <div className="text-muted-foreground text-xs">O'zbekiston Respublikasi Davlat Reyestri · 2024</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="size-5 text-gold shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold">ORCID: 0000-0003-1409-0716</div>
                <div className="text-muted-foreground text-xs">Salimova H.R. · Mustaqil izlanuvchi</div>
              </div>
            </div>
            <div className="pt-3 border-t text-xs text-muted-foreground">
              {lang === "uz"
                ? "Ixtisoslik 08.00.16 — Raqamli Iqtisodiyot va Xalqaro Raqamli Integratsiya. Ilmiy rahbar: dots. Sh.A. Tursunov. TDIU."
                : "Specialty 08.00.16 — Digital Economy & International Digital Integration. Supervisor: Dr. Sh.A. Tursunov. TSUE."}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
