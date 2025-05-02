export function calculateOffset(page: number, result_per_page: number) {
    return (page - 1) * result_per_page;
}

// Helper function to format market cap
export const formatMarketCap = (marketCap: number | null): string => {
    if (marketCap === null) return "N/A";

    if (marketCap >= 1_000_000_000_000) {
        return `$${(marketCap / 1_000_000_000_000).toFixed(2)}T`;
    } else if (marketCap >= 1_000_000_000) {
        return `$${(marketCap / 1_000_000_000).toFixed(2)}B`;
    } else if (marketCap >= 1_000_000) {
        return `$${(marketCap / 1_000_000).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
};

// Helper function to format percentages
export const formatPercent = (percent: number | null): string => {
    if (percent === null) return "N/A";
    return `${percent.toFixed(2)}%`;
};