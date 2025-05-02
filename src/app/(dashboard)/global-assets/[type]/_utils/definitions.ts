// /types/screener.ts
export enum ScreenerType {
    MOST_ACTIVES = "most_actives",
    AGGRESSIVE_SMALL_CAPS = "aggressive_small_caps",
    DAY_GAINERS = "day_gainers",
    DAY_LOSERS = "day_losers",
    GROWTH_TECHNOLOGY_STOCKS = "growth_technology_stocks",
    MOST_SHORTED_STOCKS = "most_shorted_stocks",
    SMALL_CAP_GAINERS = "small_cap_gainers",
    UNDERVALUED_GROWTH_STOCKS = "undervalued_growth_stocks",
    UNDERVALUED_LARGE_CAPS = "undervalued_large_caps",
    CONSERVATIVE_FOREIGN_FUNDS = "conservative_foreign_funds",
    HIGH_YIELD_BOND = "high_yield_bond",
    PORTFOLIO_ANCHORS = "portfolio_anchors",
    SOLID_LARGE_GROWTH_FUNDS = "solid_large_growth_funds",
    SOLID_MIDCAP_GROWTH_FUNDS = "solid_midcap_growth_funds",
    TOP_MUTUAL_FUNDS = "top_mutual_funds",
    CUSTOM = "custom",
    TECHNOLOGY = "technology",
    HEALTHCARE = "healthcare",
    FINANCIAL = "financial",
    CONSUMER_CYCLICAL = "consumer_cyclical",
    INDUSTRIALS = "industrials",
    COMMUNICATION_SERVICES = "communication_services",
    UTILITIES = "utilities",
    CONSUMER_DEFENSIVE = "consumer_defensive",
    ENERGY = "energy",
    REAL_ESTATE = "real_estate",
    BASIC_MATERIALS = "basic_materials",
}

export type ScreenRequest = {
    screen_type: ScreenerType;
    offset: number;
    size: number;
    minimal?: boolean;
}