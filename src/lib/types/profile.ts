export interface BackendResultsWithSuccessAndMessage {
    success: boolean;
    message: string;
    data?: OptimizedPortfolioResult;
}


export interface OptimizedPortfolioResult {
    optimal_weights: {
        [key: string]: number;
    };
    expected_return: number;
    volatility: number;
    sharpe_ratio: number;
    goal: string;
    monte_carlo_projection: {
        expected_final_value: number;
        min_final_value: number;
        max_final_value: number;
        success_rate_percent: number;
    };
}