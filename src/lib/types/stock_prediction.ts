// src/lib/types.ts

// Interface for stock price history item
export interface StockHistoryItem {
  date: string;
  price: number;
  volume: number;
}

// Interface for stock data
export interface StockData {
  ticker: string;
  currentPrice: number;
  priceChange: number;
  history: StockHistoryItem[];
}

// Interface for prediction item
export interface PredictionItem {
  date: string;
  predicted: number;
  confidenceLow: number;
  confidenceHigh: number;
  change: number;
}

// Interface for prediction data
export interface PredictionData {
  ticker: string;
  predictions: PredictionItem[];
  nextWeek: PredictionItem;
}

// Interface for model metadata
export interface ModelMetadataType {
  modelType: string;
  version: string;
  trainedOn: string;
  maeScore: number;
  // features: string[];
  lastUpdated: string;
  trainingDataPoints: number;
}