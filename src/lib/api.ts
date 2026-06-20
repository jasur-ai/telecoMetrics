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
  };
  forecast_2030: {
    revenue_mlrd: number;
    ebitda_margin: number;
    arpu_som: number;
    bs_5g: number;
    digital_rev_pct: number;
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

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

export const fetchDashboardSummary = () => apiGet<DashboardSummary>("/api/dashboard/summary");

export const fetchDeaResults2025 = () => apiGet<DeaResults2025Response>("/api/dea/results/2025");

export const fetchOlsDissertation = () => apiGet<OlsDissertationResponse>("/api/ols/dissertation");

export const fetchMalmquistUzbtk = () => apiGet<MalmquistUzbtkResponse>("/api/dea/malmquist/uzbtk");
