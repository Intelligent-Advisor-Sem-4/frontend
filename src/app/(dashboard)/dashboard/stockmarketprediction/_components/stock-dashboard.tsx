"use client"

import { useState, useEffect } from "react"
import { Download, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DateRangePicker } from "@/components/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import StockHistoryChart from "@/components/stock-history-chart"
import StockPredictionChart from "@/components/stock-prediction-chart"
import StockDataTable from "@/components/stock-data-table"
import ModelMetadata from "@/components/model-metadata"
import { getStockData, getPredictionData, getModelMetadata } from "@/lib/data"
import { exportToCSV } from "@/lib/export"

export default function StockDashboard() {
  const [selectedCompany, setSelectedCompany] = useState("AAPL")
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)),
    to: new Date(),
  })
  const [stockData, setStockData] = useState(null)
  const [predictionData, setPredictionData] = useState(null)
  const [modelMetadata, setModelMetadata] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  const companies = [
    { value: "AAPL", label: "Apple Inc." },
    { value: "MSFT", label: "Microsoft Corporation" },
    { value: "GOOGL", label: "Alphabet Inc." },
    { value: "AMZN", label: "Amazon.com, Inc." },
    { value: "META", label: "Meta Platforms, Inc." },
    { value: "TSLA", label: "Tesla, Inc." },
    { value: "NVDA", label: "NVIDIA Corporation" },
    { value: "JPM", label: "JPMorgan Chase & Co." },
  ]

  useEffect(() => {
    // Fetch stock data based on selected company and date range
    const data = getStockData(selectedCompany, dateRange.from, dateRange.to)
    setStockData(data)

    // Fetch prediction data
    const predictions = getPredictionData(selectedCompany, dateRange.to)
    setPredictionData(predictions)

    // Fetch model metadata
    const metadata = getModelMetadata(selectedCompany)
    setModelMetadata(metadata)
  }, [selectedCompany, dateRange])

  const handleExport = () => {
    exportToCSV(predictionData, `${selectedCompany}_predictions`)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Prediction Dashboard</h1>
          <p className="text-muted-foreground">View historical data and ML-powered predictions for stock prices</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedCompany} onValueChange={setSelectedCompany}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.value} value={company.value}>
                  {company.label} ({company.value})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DateRangePicker date={dateRange} setDate={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Current Price</CardTitle>
              <CardDescription>Last trading day</CardDescription>
            </div>
            <Badge variant={stockData?.priceChange > 0 ? "success" : "destructive"} className="ml-auto">
              {stockData?.priceChange > 0 ? "+" : ""}
              {stockData?.priceChange.toFixed(2)}%
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stockData?.currentPrice.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Predicted Price (7d)</CardTitle>
              <CardDescription>ML model prediction</CardDescription>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                    <Info className="h-4 w-4" />
                    <span className="sr-only">Model info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Prediction based on {modelMetadata?.modelType} model</p>
                  <p>Accuracy: {modelMetadata?.accuracy}%</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${predictionData?.nextWeek.predicted.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Confidence: {predictionData?.nextWeek.confidenceLow.toFixed(2)} -{" "}
              {predictionData?.nextWeek.confidenceHigh.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="text-sm font-medium">Predicted Price (30d)</CardTitle>
              <CardDescription>ML model prediction</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${predictionData?.nextMonth.predicted.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Confidence: {predictionData?.nextMonth.confidenceLow.toFixed(2)} -{" "}
              {predictionData?.nextMonth.confidenceHigh.toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="model">Model Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Historical Stock Data</CardTitle>
              <CardDescription>{selectedCompany} stock price over the selected time period</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {stockData && <StockHistoryChart data={stockData.history} />}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Trading Volume</CardTitle>
              <CardDescription>Daily trading volume for {selectedCompany}</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {stockData && <StockHistoryChart data={stockData.history} dataKey="volume" chartType="bar" />}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Price Predictions</CardTitle>
              <CardDescription>ML-powered price predictions with confidence intervals</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {predictionData && stockData && (
                <StockPredictionChart
                  historicalData={stockData.history.slice(-30)}
                  predictionData={predictionData.predictions}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Prediction Data</CardTitle>
              <CardDescription>Detailed prediction data for {selectedCompany}</CardDescription>
            </CardHeader>
            <CardContent>{predictionData && <StockDataTable data={predictionData.predictions} />}</CardContent>
            <CardFooter>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="model" className="space-y-6">
          {modelMetadata && <ModelMetadata metadata={modelMetadata} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}
