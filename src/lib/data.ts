// Mock data extracted from the TelecoMetrics platform document

export const years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];

export const revenueData = years.map((y, i) => {
  const digital = [840, 1180, 1620, 2200, 2950, 2780, 3850, 4820, 5900][i];
  const traditional = [4200, 4380, 4520, 4680, 4820, 4750, 4880, 5020, 5180][i];
  return { year: y, digital, traditional, total: digital + traditional };
});

export const deaTrend = years.map((y, i) => ({
  year: y,
  dea: [0.58, 0.6, 0.62, 0.64, 0.66, 0.65, 0.68, 0.7, 0.72][i],
  target: 0.85,
}));

export const malmquist = years.slice(1).map((y, i) => ({
  year: y,
  ec: [1.04, 1.08, 1.1, 1.12, 1.05, 1.15, 1.2, 1.25][i],
  tc: [1.08, 1.12, 1.15, 1.18, 1.01, 1.22, 1.28, 1.31][i],
  tfp: [1.12, 1.21, 1.27, 1.32, 1.06, 1.4, 1.56, 1.64][i],
}));

export const dmus = [
  { name: "Kazakhtelecom", ccr: 0.91, bcc: 0.95, scale: 0.958 },
  { name: "Azertelecom", ccr: 0.88, bcc: 0.92, scale: 0.957 },
  { name: "Georgiatelecom", ccr: 0.85, bcc: 0.9, scale: 0.944 },
  { name: "Kyrgyztelekom", ccr: 0.74, bcc: 0.86, scale: 0.86 },
  { name: "Armentelekom", ccr: 0.76, bcc: 0.87, scale: 0.874 },
  { name: "O'zbektelekom", ccr: 0.72, bcc: 0.84, scale: 0.857, highlight: true },
  { name: "Turkmentelecom", ccr: 0.68, bcc: 0.8, scale: 0.85 },
  { name: "Tajiktelecom", ccr: 0.65, bcc: 0.78, scale: 0.833 },
];

export const deaInputs = [
  { name: "Asosiy kapital / Fixed capital", value: "8,450 mlrd", weight: 0.312, contrib: 72 },
  { name: "Xodimlar soni / Headcount", value: "12,840", weight: 0.187, contrib: 65 },
  { name: "Tarmoq infratuzilmasi / Network infra", value: "48,500 km", weight: 0.264, contrib: 88 },
  { name: "IT xarajatlari / IT spend", value: "1,240 mlrd", weight: 0.143, contrib: 54 },
  { name: "Energiya / Energy", value: "380 mlrd", weight: 0.094, contrib: 78 },
];

export const digitalShare = years.map((y, i) => ({
  year: y,
  share: [14.8, 17.2, 19.8, 22.4, 25.1, 27.8, 30.4, 32.3, 34.2][i],
}));

export const digitalBreakdown = [
  { name: "Mobil internet / Mobile internet", value: 38.2 },
  { name: "IPTV / OTT", value: 21.5 },
  { name: "Bulut xizmatlar / Cloud", value: 14.8 },
  { name: "B2B SaaS", value: 11.7 },
  { name: "Raqamli to'lov / Digital payments", value: 6.5 },
  { name: "Boshqalar / Other", value: 7.3 },
];

export const olsScatter = Array.from({ length: 72 }, (_, i) => {
  const actual = 1500 + i * 65 + (Math.sin(i * 0.7) * 200);
  const predicted = actual + (Math.cos(i * 0.5) * 180);
  return { actual: Math.round(actual), predicted: Math.round(predicted) };
});

export const garchVolatility = Array.from({ length: 72 }, (_, i) => {
  const base = 8 + Math.sin(i * 0.3) * 3 + (i > 40 ? 4 : 0);
  return { q: i + 1, vol: Number((base + Math.random() * 2).toFixed(2)) };
});

export const monteCarlo = {
  scenarios: [
    { name: "Pessimistik / Pessimistic", prob: 25, npv: 8400, irr: 22, payback: 4.8, color: "destructive" },
    { name: "Bazaviy / Base", prob: 65, npv: 15200, irr: 38, payback: 3.2, color: "gold" },
    { name: "Optimistik / Optimistic", prob: 10, npv: 24800, irr: 58, payback: 2.2, color: "success" },
  ],
  successProb: 98.2,
};

export const mcDistribution = Array.from({ length: 30 }, (_, i) => {
  const x = 5000 + i * 800;
  const mean = 15200;
  const sigma = 4500;
  const y = Math.exp(-((x - mean) ** 2) / (2 * sigma * sigma)) * 100;
  return { npv: x, freq: Number(y.toFixed(2)) };
});

export const dmmDomains = [
  { name: "Strategy & Governance", score: 3.62, target: 4.2 },
  { name: "Customer Experience", score: 2.84, target: 4.0 },
  { name: "Operations & Technology", score: 3.51, target: 4.1 },
  { name: "Data & Analytics", score: 3.28, target: 4.0 },
  { name: "Workforce & Culture", score: 3.85, target: 4.3 },
];

export const regional = [
  { country: "Kazakhstan", infra: 92, digital: 45, revenue: 38, efficiency: 91, maturity: 4.1 },
  { country: "Azerbaijan", infra: 88, digital: 41, revenue: 36, efficiency: 88, maturity: 3.9 },
  { country: "Uzbekistan", infra: 94, digital: 34, revenue: 28, efficiency: 72, maturity: 3.42, highlight: true },
  { country: "Kyrgyzstan", infra: 71, digital: 26, revenue: 21, efficiency: 74, maturity: 2.9 },
  { country: "Tajikistan", infra: 62, digital: 18, revenue: 14, efficiency: 65, maturity: 2.6 },
];

export const forecast = [
  { year: 2024, pessimistic: 12200, base: 13400, optimistic: 14800 },
  { year: 2025, pessimistic: 13800, base: 15800, optimistic: 17900 },
  { year: 2026, pessimistic: 15100, base: 18400, optimistic: 21800 },
  { year: 2027, pessimistic: 16400, base: 21200, optimistic: 26500 },
  { year: 2028, pessimistic: 17600, base: 24100, optimistic: 32400 },
];

export const forecastTargets = [
  { metric: "Raqamli daromad ulushi / Digital revenue share", current: "34.2%", p: "38%", b: "48%", o: "58%", goal: "≥ 45%" },
  { metric: "DEA-CCR samaradorlik", current: "0.72", p: "0.76", b: "0.85", o: "0.92", goal: "≥ 0.85" },
  { metric: "Malmquist TFP", current: "1.46", p: "1.32", b: "1.58", o: "1.82", goal: "≥ 1.50" },
  { metric: "DMM yetuklik / DMM maturity", current: "3.42", p: "3.6", b: "4.0", o: "4.4", goal: "≥ 4.0" },
  { metric: "GARCH yillik volatillik", current: "14.8%", p: "16%", b: "11%", o: "8%", goal: "≤ 12%" },
  { metric: "Monte-Carlo NPV (mlrd)", current: "—", p: "8,400", b: "15,200", o: "24,800", goal: "≥ 10,000" },
];

export const malmquistTable = malmquist.map((m) => ({
  ...m,
  badge:
    m.tfp >= 1.6 ? "EN YUQORI" : m.tfp >= 1.4 ? "KUCHLI" : m.tfp >= 1.2 ? "O'RTACHA" : m.tfp >= 1.1 ? "PAST" : "SUST",
}));
