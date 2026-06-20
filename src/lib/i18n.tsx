import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "uz" | "en";

type Dict = Record<string, { uz: string; en: string }>;

export const dict: Dict = {
  brand: { uz: "TelecoMetrics.uz", en: "TelecoMetrics.uz" },
  brand_sub: { uz: "Raqamli Iqtisodiyot Tahlil Platformasi", en: "Digital Economy Analytics Platform" },
  nav_dashboard: { uz: "Bosh Panel", en: "Dashboard" },
  nav_infra: { uz: "Infratuzilma Tahlili", en: "Infrastructure Analysis" },
  nav_digital: { uz: "Raqamli Xizmatlar", en: "Digital Services" },
  nav_malmquist: { uz: "Malmquist TFP", en: "Malmquist TFP" },
  nav_ols: { uz: "OLS Regressiya", en: "OLS Regression" },
  nav_garch: { uz: "GARCH(1,1)", en: "GARCH(1,1)" },
  nav_mc: { uz: "Monte-Carlo", en: "Monte-Carlo" },
  nav_dmm: { uz: "TM Forum DMM", en: "TM Forum DMM" },
  nav_regional: { uz: "Mintaqaviy Taqqoslash", en: "Regional Comparison" },
  nav_forecast: { uz: "Bashorat (LSTM)", en: "Forecast (LSTM)" },
  nav_arch: { uz: "Platforma Arxitekturasi", en: "Platform Architecture" },
  nav_report: { uz: "Yakuniy Hisobot", en: "Final Report" },
  section_analytics: { uz: "Analitik Modullar", en: "Analytical Modules" },
  section_strategic: { uz: "Strategik Tahlil", en: "Strategic Analysis" },
  section_system: { uz: "Tizim", en: "System" },
  paradox_title: { uz: "Infratuzilma Paradoksi", en: "The Infrastructure Paradox" },
  paradox_body: {
    uz: "O'zbektelekom Markaziy Osiyoda infratuzilma bo'yicha yetakchi, ammo raqamli xizmatlar samaradorligi bo'yicha orqada qoladi. Isbot: β(raqamli)/β(an'anaviy) = 4.76×",
    en: "O'zbektelekom leads Central Asia in infrastructure but lags in digital services efficiency. Evidence: β(digital)/β(traditional) = 4.76×",
  },
  kpi_dea: { uz: "DEA-CCR Samaradorlik", en: "DEA-CCR Efficiency" },
  kpi_tfp: { uz: "Malmquist TFP Indeks", en: "Malmquist TFP Index" },
  kpi_r2: { uz: "OLS R² Koeffitsiyenti", en: "OLS R² Coefficient" },
  kpi_npv: { uz: "Monte-Carlo NPV", en: "Monte-Carlo NPV" },
  bln_sum: { uz: "mlrd so'm", en: "bln UZS" },
  target: { uz: "Maqsad", en: "Target" },
  current: { uz: "Joriy", en: "Current" },
  revenue_dyn: { uz: "Daromad Dinamikasi (2015–2023)", en: "Revenue Dynamics (2015–2023)" },
  digital_rev: { uz: "Raqamli xizmatlar", en: "Digital services" },
  traditional_rev: { uz: "An'anaviy xizmatlar", en: "Traditional services" },
  dea_trend: { uz: "DEA Samaradorlik Trendi", en: "DEA Efficiency Trend" },
  beta_compare: { uz: "β Koeffitsiyentlar Taqqoslamasi", en: "β Coefficient Comparison" },
  garch_results: { uz: "GARCH(1,1) Natijalari", en: "GARCH(1,1) Results" },
  dmm_results: { uz: "TM Forum DMM v5.0 Natijalari", en: "TM Forum DMM v5.0 Results" },
  lang_toggle: { uz: "EN", en: "UZ" },
  signed_finding: { uz: "Asosiy ilmiy topilma", en: "Key scientific finding" },
};

const I18nCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof dict) => string }>({
  lang: "uz",
  setLang: () => {},
  t: (k) => dict[k]?.uz ?? String(k),
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("uz");
  const t = (k: keyof typeof dict) => dict[k]?.[lang] ?? String(k);
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  return useContext(I18nCtx);
}

// Helper for inline bilingual strings
export function bi(uz: string, en: string) {
  return { uz, en };
}
