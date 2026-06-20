// API client for the TelecoMetrics.uz backend
// Backend repo: https://github.com/jasur-ai/telecoMetric_Backend
// Live deployment: https://telecometric-backend.onrender.com
//
// The backend already allows all origins (CORS allow_origins=["*"]), so no
// backend-side change is required to call it from this frontend.

export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ??
  "https://telecometric-backend.onrender.com";

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API request failed (${res.status}): ${path}`);
  }
  return (await res.json()) as T;
}

// ---------------------------------------------------------------------------
// Types — trimmed to the fields the UI actually consumes
// ---------------------------------------------------------------------------

export interface DeaResult {
  operator_code: string;
  operator_name: string;
  ccr_score: number;
  bcc_score: number;
  scale_efficiency: number;
  malmquist_tfp: number;
  is_efficient: boolean;
  rank: number;
}

export interface DashboardSummary {
  operator: string;
  kpi_2025: {
    revenue_mlrd: number;
    ebitda_margin: number;
    arpu_som: number;
    nps_score: number;
    bs_5g: number;
    subscribers_mln: number;
    digital_rev_pct: number;
    dea_ccr: number;
    malmquist_tfp: number;
    dmm_score?: number;
    npv_mlrd?: number;
    garch_volatility?: number;
  };
  forecast_2030: {
    revenue_mlrd: number;
    ebitda_margin: number;
    arpu_som: number;
    arpu_usd?: number;
    bs_5g: number;
    digital_rev_pct: number;
    dea_ccr?: number;
    dmm_score?: number;
  };
  ols_key_result: {
    r_squared: number;
    main_finding: string;
    interpretation: string;
  };
  granger_summary: {
    result: string;
    chain: string;
    var_order: number;
  };
  dea_summary: {
    ccr_score: number;
    tfp: number;
    rank_in_region: number;
  };
  chart_data: {
    revenue_trend: { year: number; value: number; is_forecast: boolean }[];
    dea_comparison: DeaResult[];
  };
}

export interface MetricsResponse {
  operator_code: string;
  count: number;
  data: {
    year: number;
    is_forecast: boolean;
    revenue_mlrd: number;
    ebitda_mlrd: number;
    ebitda_margin: number;
    capex_mlrd: number;
    opex_mlrd: number;
    ds_invest_mlrd?: number;
    arpu_som: number;
    nps_score: number;
    subscribers_mln: number;
    bs_5g: number;
    digital_rev_pct?: number;
    employees: number;
    cloud_rev_mlrd?: number;
    fiber_km?: number;
    coverage_pct?: number;
    mobile_coverage_pct?: number;
    fixed_capital_mlrd?: number;
    it_invest_mlrd?: number;
    energy_cost_mlrd?: number;
    arpu_usd?: number;
    dea_ccr?: number;
    dmm_score?: number;
  }[];
}

export interface DeaResults2025Response {
  summary: {
    operators_count: number;
    efficient_count: number;
    uzbektelecom_ccr: number;
    uzbektelecom_tfp: number;
    uzbektelecom_rank: number;
  };
  results: DeaResult[];
}

export interface OlsCoefficient {
  coef: number;
  std_err: number;
  t_stat: number;
  p_value: number;
}

export interface OlsDissertationResponse {
  result: {
    r_squared: number;
    adj_r_squared: number;
    f_statistic: number;
    f_pvalue: number;
    durbin_watson: number;
    n: number;
    coefficients: Record<string, OlsCoefficient>;
    diagnostics: {
      jarque_bera: number;
      jarque_bera_pvalue: number;
      normality: string;
      white_test: number;
      white_pvalue: number;
      heteroscedasticity: string;
      durbin_watson: number;
      autocorrelation: string;
    };
  };
  scatter_data: { year: number; actual: number; predicted: number; residual: number }[];
  main_finding: {
    formula: string;
    interpretation: string;
    policy_implication: string;
  };
}

export interface MalmquistTrendPoint {
  period: string;
  tfp: number;
  ec: number;
  tc: number;
}

export interface MalmquistUzbtkResponse {
  result: {
    tfp: number;
    efficiency_change_ec: number;
    technology_change_tc: number;
    interpretation: string;
    benchmark: string;
  };
  trend: MalmquistTrendPoint[];
}

export interface ForecastUzbtkResponse {
  variable: string;
  operator: string;
  method: string;
  base_scenario: { year: number; value: number; is_forecast: boolean }[];
  trend_model: { year: number; forecast: number; lower_95: number; upper_95: number; r_squared: number }[];
  cagr_2025_2030: number;
  scenarios: {
    optimistic: { year: number; value: number }[];
    base: { year: number; value: number; is_forecast: boolean }[];
    pessimistic: { year: number; value: number }[];
  };
}

export interface ForecastAll2030Response {
  operator: string;
  comparison: {
    variable: string;
    label: string;
    actual_2025: number;
    forecast_2030: number;
    growth_pct: number | null;
    cagr_pct: number | null;
  }[];
}

export interface Benchmark2025Response {
  year: number;
  operators_count: number;
  data: {
    code: string;
    name: string;
    country: string;
    revenue_mlrd: number;
    ebitda_margin: number;
    arpu_som: number;
    nps_score: number;
    bs_5g: number;
    digital_rev_pct: number;
    coverage_pct: number;
    dmm_score: number;
    ccr_score: number;
    malmquist_tfp: number;
    is_primary: boolean;
  }[];
  uzbektelecom_position: {
    ccr_rank: number;
    revenue_rank?: number;
    nps_rank?: number;
    digital_rank?: number;
    infrastructure_rank?: number;
    tfp_rank: number;
  };
}

export interface DigitalServicesResponse {
  operator: string;
  method: string;
  trend: { year: number; share: number; digital_revenue_mlrd: number; is_forecast: boolean }[];
  breakdown_2025: { name: string; value: number; revenue_mlrd?: number; beta?: number }[];
  summary: {
    share_2025: number;
    share_2030: number;
    digital_revenue_2025: number;
    digital_revenue_2030: number;
    digital_revenue_cagr_2025_2030: number;
    ds_invest_beta: number;
    traditional_beta?: number;
    internet_subscribers_mln?: number;
    cloud_revenue_2023?: number;
    arpu_2023?: number;
  };
}

export interface GarchRevenueResponse {
  operator: string;
  method: string;
  parameters: { omega: number; alpha: number; beta: number; persistence: number };
  summary: { annual_volatility: number; stationary: boolean; observations: number; covid_peak?: number };
  volatility: { period: string; q: number; year: number; return_pct: number; vol: number; variance: number; is_forecast: boolean }[];
}

export interface MonteCarloNpvResponse {
  operator: string;
  method: string;
  iterations: number;
  discount_rate: number;
  summary: { mean_npv: number; success_probability: number; irr_base: number; payback_years: number; sigma: number; cv?: number; investment?: number };
  scenarios: { name: string; prob: number; npv: number; irr: number; payback: number; color: string }[];
  distribution: { npv: number; freq: number }[];
}

export interface DmmResponse {
  operator: string;
  method: string;
  summary: {
    current_score: number;
    previous_score: number;
    delta: number;
    maturity_stage: number;
    weakest_domain: string;
    weakest_score: number;
    target_2025: number;
  };
  domains: { name: string; score: number; previous: number; target: number }[];
}

export interface RecommendationsResponse {
  count: number;
  source: string;
  recommendations: {
    priority: number;
    title_uz: string;
    description_uz: string;
    expected_impact: string;
    evidence: string;
  }[];
}

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

export const fetchDashboardSummary = () => apiGet<DashboardSummary>("/api/dashboard/summary");

export const fetchMetrics = (operatorCode: string, yearFrom = 2015, yearTo = 2028, includeForecast = true) =>
  apiGet<MetricsResponse>(`/api/metrics/${operatorCode}?year_from=${yearFrom}&year_to=${yearTo}&include_forecast=${includeForecast}`);

export const fetchDeaResults2025 = () => apiGet<DeaResults2025Response>("/api/dea/results/2025");

export const fetchOlsDissertation = () => apiGet<OlsDissertationResponse>("/api/ols/dissertation");

export const fetchMalmquistUzbtk = () => apiGet<MalmquistUzbtkResponse>("/api/dea/malmquist/uzbtk");

export const fetchForecastUzbtk = (variable = "digital_rev_pct") =>
  apiGet<ForecastUzbtkResponse>(`/api/forecast/uzbtk?variable=${encodeURIComponent(variable)}&include_scenarios=true`);

export const fetchForecastAll2030 = () => apiGet<ForecastAll2030Response>("/api/forecast/all-variables/2030");

export const fetchBenchmark2025 = () => apiGet<Benchmark2025Response>("/api/benchmark/2025");

export const fetchDigitalServicesUzbtk = () => apiGet<DigitalServicesResponse>("/api/digital-services/uzbtk");

export const fetchGarchRevenueUzbtk = () => apiGet<GarchRevenueResponse>("/api/garch/revenue/uzbtk");

export const fetchMonteCarloNpvUzbtk = () => apiGet<MonteCarloNpvResponse>("/api/monte-carlo/npv/uzbtk");

export const fetchDmmUzbtk = () => apiGet<DmmResponse>("/api/dmm/uzbtk");

export const fetchRecommendations = () => apiGet<RecommendationsResponse>("/api/recommendations");
