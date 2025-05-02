// TypeScript interfaces based on the Pydantic models
interface DBStock {
    in_db: boolean | null;
    status: string | null;
    asset_id: number | null;
    risk_score: number | null;
    risk_score_updated: string | null;
}

export interface Asset {
    name: string;
    company_url: string;
    exchange: string;
    ticker: string;
    type: string;
    sector: string;
    industry: string;
    currency: string;
    prev_close: number | null;
    open_price: number | null;
    last_price: number | null;
    day_high: number | null;
    day_low: number | null;
    volume: number | null;
    avg_volume: number | null;
    beta: number | null;
    market_cap: number | null;
    fifty_two_week_high: number | null;
    fifty_two_week_low: number | null;
    bid: number | null;
    ask: number | null;
    trailing_eps: number | null;
    trailing_pe: number | null;
    db: DBStock | null;
}

export interface AssetErrorResponse {
    detail: string;
    statusCode: number;
}

export type UpdateStockStatusResponse = {
    success: boolean;
    message: string;
    data?: {
        stock_id: number;
        status: string;
    };
};
export type AssetStatus = 'Active' | 'Pending' | 'Warning' | 'BlackList';


export interface RelatedArticle {
    title: string;
    url: string;
    content_type?: string | null;
    thumbnail_url?: string | null;  // Adding this based on conversation history
    provider_name?: string | null;
}

export interface NewsArticle {
    title: string;
    news_id: string;
    summary?: string | null;
    description?: string | null;
    content_type?: string | null;
    publish_date?: string | null;  // datetime becomes string in JSON/TS
    thumbnail_url?: string | null;
    canonical_url?: string | null;
    provider_name?: string | null;
    related_articles: RelatedArticle[];
}

interface KeyRisks {
    legal_risks: string[];
    governance_risks: string[];
    fraud_indicators: string[];
    political_exposure: string[];
    operational_risks: string[];
    financial_stability_issues: string[];
}

type StabilityLabel = "High Risk" | "Moderate Risk" | "Slight Risk" | "Stable" | "Very Stable";
type CustomerSuitability = "Unsuitable" | "Cautious Inclusion" | "Suitable";
type SuggestedAction = "Monitor" | "Flag for Review" | "Review" | "Flag for Removal" | "Immediate Action Required";

export interface SentimentAnalysisResponse {
    stability_score: number;  // Range: -10 to 10
    stability_label: StabilityLabel
    key_risks: KeyRisks;
    security_assessment: string;
    customer_suitability: CustomerSuitability;
    suggested_action: SuggestedAction;
    risk_rationale: string[];
    news_highlights?: string[];
    risk_score?: number;  // Range: 0 to 10
    error_details?: string | null;
    updated_at?: string | null;
}


export interface quantRiskMetrics {
    volatility_score?: number | null;
    beta_score?: number | null;
    rsi_risk?: number | null;
    volume_risk?: number | null;
    debt_risk?: number | null;
    eps_risk?: number | null;
    quant_risk_score?: number | null;
}

export interface QuantRiskResponse {
    volatility?: number | null;
    beta?: number | null;
    rsi?: number | null;
    volume_change_percent?: number | null;
    debt_to_equity?: number | null;
    risk_metrics: quantRiskMetrics;
    risk_label?: StabilityLabel;
    risk_explanation?: string | null;
    error_details?: string | null;
    error?: string | null;
}

export interface EsgRiskResponse {
    total_esg?: number | null;
    environmental_score?: number | null;
    social_score?: number | null;
    governance_score?: number | null;
    esg_risk_score?: number | null;
}

export interface anomalyFlag {
    type?: string | null;
    date?: string | null;
    description?: string | null;
    severity?: number | null;
}

export interface AnomalyDetectionResponse {
    flags?: anomalyFlag[] | null;
    anomaly_score?: number | null;  // Range: 0 to 10
}

export type OverallRiskResponse = {
    overall_risk_score?: number | null;  // Range: 0 to 10
    risk_level?: "Low" | "Medium" | "High";
    components?: {
        news_sentiment?: {
            weight?: number | null;
            score?: number | null;  // Range: 0 to 10
        } | null;
        quant_risk?: {
            weight?: number | null;
            score?: number | null;  // Range: 0 to 10
        } | null;
        esg_risk?: {
            weight?: number | null;
            score?: number | null;  // Range: 0 to 10
        } | null;
        anomaly_detection?: {
            weight?: number | null;
            score?: number | null;  // Range: 0 to 10
        } | null;
    } | null;
}

export type StreamResponse = {
    type: "news_articles" | "news_sentiment" | "quantitative_risk" | "esg_risk" | "anomaly_risk" | "overall_risk" | "complete";
    data?: OverallRiskResponse | NewsArticle | SentimentAnalysisResponse | QuantRiskResponse | EsgRiskResponse | AnomalyDetectionResponse;
}

