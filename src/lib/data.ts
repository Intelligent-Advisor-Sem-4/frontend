// Mock data generation for stock market prediction

// Generate random stock price data
function generateStockPrices(ticker: string, startDate: Date, endDate: Date) {
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    const data = []
  
    // Base prices for different stocks
    const basePrices = {
      AAPL: 180,
      MSFT: 350,
      GOOGL: 140,
      AMZN: 130,
      META: 300,
      TSLA: 250,
      NVDA: 400,
      JPM: 150,
    }
  
    const basePrice = basePrices[ticker] || 100
    let currentPrice = basePrice * (0.95 + Math.random() * 0.1) // Start with some randomness
  
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
  
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
  
      // Random daily change (-2% to +2%)
      const change = (Math.random() * 4 - 2) / 100
      currentPrice = currentPrice * (1 + change)
  
      // Add some volatility based on the ticker
      if (ticker === "TSLA" || ticker === "NVDA") {
        currentPrice = currentPrice * (1 + (Math.random() * 0.02 - 0.01))
      }
  
      // Generate random volume
      const volume = Math.floor(1000000 + Math.random() * 9000000)
  
      data.push({
        date: date.toISOString(),
        price: Number.parseFloat(currentPrice.toFixed(2)),
        volume: volume,
      })
    }
  
    return data
  }
  
  // Generate prediction data
  function generatePredictions(ticker: string, lastDate: Date) {
    const predictions = []
    const lastPrice = getStockData(ticker, new Date(lastDate.getTime() - 86400000), lastDate).currentPrice
  
    // Generate predictions for the next 30 days
    for (let i = 1; i <= 30; i++) {
      const date = new Date(lastDate)
      date.setDate(lastDate.getDate() + i)
  
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
  
      // Predicted price with some trend
      const trend = Math.random() > 0.5 ? 1 : -1
      const dayFactor = i / 30 // Increase effect over time
      const predicted = lastPrice * (1 + trend * (Math.random() * 0.05 + 0.01) * dayFactor)
  
      // Confidence interval (wider as we go further in the future)
      const confidenceWidth = 0.02 + (i / 30) * 0.08
      const confidenceLow = predicted * (1 - confidenceWidth)
      const confidenceHigh = predicted * (1 + confidenceWidth)
  
      // Calculate change percentage from last known price
      const change = ((predicted - lastPrice) / lastPrice) * 100
  
      predictions.push({
        date: date.toISOString(),
        predicted: Number.parseFloat(predicted.toFixed(2)),
        confidenceLow: Number.parseFloat(confidenceLow.toFixed(2)),
        confidenceHigh: Number.parseFloat(confidenceHigh.toFixed(2)),
        change: Number.parseFloat(change.toFixed(2)),
      })
    }
  
    return predictions
  }
  
  // Get stock data for a specific company and date range
  export function getStockData(ticker: string, startDate: Date, endDate: Date) {
    const history = generateStockPrices(ticker, startDate, endDate)
    const currentPrice = history[history.length - 1]?.price || 0
    const previousPrice = history[history.length - 2]?.price || 0
    const priceChange = ((currentPrice - previousPrice) / previousPrice) * 100
  
    return {
      ticker,
      currentPrice,
      priceChange,
      history,
    }
  }
  
  // Get prediction data for a specific company
  export function getPredictionData(ticker: string, lastDate: Date) {
    const predictions = generatePredictions(ticker, lastDate)
  
    // Get next week and next month predictions
    const nextWeek =
      predictions.find((p) => {
        const predDate = new Date(p.date)
        const diffDays = Math.ceil((predDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= 7 && diffDays < 8
      }) || predictions[0]
  
    const nextMonth =
      predictions.find((p) => {
        const predDate = new Date(p.date)
        const diffDays = Math.ceil((predDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays >= 30 && diffDays < 31
      }) || predictions[predictions.length - 1]
  
    return {
      ticker,
      predictions,
      nextWeek,
      nextMonth,
    }
  }
  
  // Get model metadata
  export function getModelMetadata(ticker: string) {
    // Different model types for different stocks
    const modelTypes = {
      AAPL: "LSTM Neural Network",
      MSFT: "Random Forest",
      GOOGL: "XGBoost",
      AMZN: "ARIMA",
      META: "Prophet",
      TSLA: "LSTM Neural Network",
      NVDA: "XGBoost",
      JPM: "Random Forest",
    }
  
    // Random accuracy between 75% and 95%
    const accuracy = 75 + Math.floor(Math.random() * 20)
  
    // Random MAE between 0.5 and 2.5
    const maeScore = 0.5 + Math.random() * 2
  
    // Random R² between 0.7 and 0.95
    const r2Score = 0.7 + Math.random() * 0.25
  
    return {
      modelType: modelTypes[ticker] || "Ensemble Model",
      version: "1.2.3",
      trainedOn: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      accuracy,
      maeScore,
      r2Score,
      features: [
        "Open Price",
        "Close Price",
        "Volume",
        "Moving Average (50d)",
        "RSI",
        "MACD",
        "Market Sentiment",
        "Sector Performance",
      ],
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      trainingDataPoints: 1250 + Math.floor(Math.random() * 1000),
    }
  }
  