import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { SectionCard, PageHeader, KpiCard } from "@/components/kpi-card";
import { revenueData } from "@/lib/data";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FileText, BookOpen, Award } from "lucide-react";

export const Route = createFileRoute("/report")({
  head: () => ({ meta: [{ title: "Yakuniy Hisobot — TelecoMetrics.uz" }] }),
  component: Page,
});

function Page() {
  const { lang } = useI18n();
  return (
    <div>
      <PageHeader
        title={lang === "uz" ? "Yakuniy Ilmiy Hisobot" : "Final Scientific Report"}
        subtitle={lang === "uz" ? "Asosiy natijalar va ilmiy maqolalar" : "Key findings and scholarly publications"}
        badge={lang === "uz" ? "Xulosa" : "Conclusion"}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard label={lang === "uz" ? "Ilmiy maqolalar" : "Publications"} value="14" tone="gold" hint="Scopus / WoS · 2022-24" />
        <KpiCard label={lang === "uz" ? "Sitatalar" : "Citations"} value="47" tone="info" />
        <KpiCard label={lang === "uz" ? "Konferensiya" : "Conferences"} value="8" tone="success" />
        <KpiCard label="h-index" value="4" tone="navy" />
      </div>

      <SectionCard title={lang === "uz" ? "Asosiy Natijalar" : "Key Findings"}>
        <ol className="space-y-3 text-sm">
          {[
            lang === "uz"
              ? "β(raqamli)/β(an'anaviy) = 4.76× — raqamli xizmatlar daromadga ta'siri an'anaviydan deyarli besh barobar yuqori (R² = 0.971, p < 0.001)."
              : "β(digital)/β(traditional) = 4.76× — digital services impact revenue nearly five times more than traditional services (R² = 0.971, p < 0.001).",
            lang === "uz"
              ? "DEA-CCR samaradorlik 0.72 — infratuzilma yetuk bo'lsa-da, foydalanish samaradorligi 28% zaxiraga ega."
              : "DEA-CCR efficiency 0.72 — despite mature infrastructure, utilization efficiency has 28% slack.",
            lang === "uz"
              ? "Malmquist TFP 2015–2023 da 8.94× kumulatif o'sish, 2023-yilda yillik TFP = 1.64 (eng yuqori)."
              : "Malmquist TFP grew 8.94× cumulatively across 2015–2023; 2023 annual TFP = 1.64 (peak).",
            lang === "uz"
              ? "GARCH α₁+β₁ = 0.910 — barqaror lekin yuqori inersiyali volatillik xotirasi (yillik 14.8%)."
              : "GARCH α₁+β₁ = 0.910 — stationary but high-inertia volatility memory (annual 14.8%).",
            lang === "uz"
              ? "Monte-Carlo: bazaviy NPV 15,200 mlrd so'm, muvaffaqiyat ehtimoli 98.2%."
              : "Monte-Carlo: base NPV 15,200 bln UZS, success probability 98.2%.",
          ].map((f, i) => (
            <li key={i} className="flex gap-3">
              <span className="size-6 rounded-full bg-gold text-gold-foreground text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <span className="pt-0.5">{f}</span>
            </li>
          ))}
        </ol>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
        <div className="lg:col-span-2">
          <SectionCard title={lang === "uz" ? "Daromad Dinamikasi (yakuniy ko'rinish)" : "Revenue Dynamics (final view)"}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="year" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="total" stroke="var(--color-navy)" strokeWidth={2} name="Total" />
                <Line type="monotone" dataKey="digital" stroke="var(--color-gold)" strokeWidth={3} name="Digital" />
              </LineChart>
            </ResponsiveContainer>
          </SectionCard>
        </div>

        <SectionCard title={lang === "uz" ? "Ilmiy Maqolalar" : "Publications"}>
          <ul className="space-y-3 text-sm">
            {[
              { icon: Award, t: "TM Forum DTW · 2023", s: "Best Paper Award" },
              { icon: BookOpen, t: "J. of Telecom Policy · 2024", s: "DEA-CCR application" },
              { icon: FileText, t: "Digital Economy Review · 2023", s: "Malmquist TFP study" },
              { icon: FileText, t: "Central Asian Econ J · 2024", s: "GARCH volatility" },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <li key={i} className="flex gap-2.5 pb-2.5 border-b border-border/50 last:border-0">
                  <Icon className="size-4 text-gold shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{p.t}</div>
                    <div className="text-xs text-muted-foreground">{p.s}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
