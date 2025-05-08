"use client"

import {useState, useEffect} from "react"
import {Download, Info} from "lucide-react"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Button} from "@/components/ui/button"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {DateRangePicker} from "./date-range-picker"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import StockHistoryChart from "./stock-history-chart"
import StockPredictionChart from "./stock-prediction-chart"
import StockDataTable from "./stock-data-table"
import ModelMetadata from "./model-metadata"
import {getStockData, getPredictionData, getModelMetadata} from "@/lib/data"
import {exportToCSV} from "@/lib/export"
import {PredictionData, StockData, ModelMetadataType} from "@/lib/types/stock_prediction";
import {DateRange} from "react-day-picker";
import { number } from "zod"

type companyType = {
    value: string
    label: string
}

const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-CA"); // "YYYY-MM-DD" format
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";

export default function StockDashboard() {
    const [selectedCompany, setSelectedCompany] = useState<string>("")
    const [dateRange, setDateRange] = useState<DateRange>({
        from: new Date(new Date().setDate(new Date().getDate() - 30)),
        to: new Date(),
    })
    const [stockData, setStockData] = useState<StockData | null>(null)
    const [predictionData, setPredictionData] = useState<PredictionData | null>(null)
    const [modelMetadata, setModelMetadata] = useState<ModelMetadataType | null>(null)
    const [activeTab, setActiveTab] = useState("overview")
    const [sevchange,setSevchange] = useState<number|null>(null)
    const [isLoading, setIsLoading] = useState(false);
    

    const [companies, setCompanies] = useState<companyType[]>([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${BASE_URL}/get-active-symbols`);
                const data = await response.json();
                setCompanies(data.symbols);
                setSelectedCompany(data.symbols[0].value);
            } catch (error) {
                console.error("Error fetching company symbols:", error);
            }
        };

        fetchCompanies();
    }, []);

    useEffect(() => {
        if (!dateRange.from || !dateRange.to || selectedCompany==="") return;

        // Fetch stock data based on selected company and date range
        const fetchStockData = async () => {
            setIsLoading(true); // Show loading popup
            try {
            const response = await fetch(`${BASE_URL}/V2/get-predicted-prices`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    starting_date: formatDate(dateRange.from ?? new Date()),
                    ending_date: formatDate(dateRange.to ?? new Date()),
                ticker_symbol: selectedCompany,
                }),
            });
            const data = await response.json();
            setStockData(data.stockData);
            setModelMetadata(data.modelMetadata);
            setPredictionData(data.predictionData)
            if (data.predictionData && data.stockData && data.stockData.history.length > 0 && data.predictionData.predictions.length > 0) {
                const lastPrediction = data.predictionData.predictions[data.predictionData.predictions.length - 1].predicted;
                const lastPrice = data.stockData.history[data.stockData.history.length - 1].price;
                const percentageChange = ((lastPrediction - lastPrice) / lastPrice) * 100;
                setSevchange(percentageChange);
            }
            } catch (error) {
            console.error("Error fetching stock data:", error);
            } finally {
                setIsLoading(false); // Hide loading popup
            }
        };

        fetchStockData();

        // Fetch prediction data
        // const predictions = getPredictionData(selectedCompany, dateRange.to);
        // setPredictionData(predictions);

        // Fetch model metadata
        // const metadata = getModelMetadata(selectedCompany);
        // setModelMetadata(metadata);
    }, [selectedCompany, dateRange]);

    const handleExport = () => {
        exportToCSV(predictionData, `${selectedCompany}_predictions`)
    }

    return (
        <div className="container mx-auto py-6 px-4 md:px-6">
            {isLoading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-background/70">
                <div className="bg-card text-card-foreground rounded-xl shadow-xl p-6 flex flex-col items-center space-y-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-lg font-medium">Loading...</p>
                </div>
            </div>
            )}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stock Prediction Dashboard</h1>
                    <p className="text-muted-foreground">View historical data and ML-powered predictions for stock
                        prices</p>
                </div>
                <div className="flex items-center gap-4">
                    {selectedCompany && (
                        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select company"/>
                            </SelectTrigger>
                            <SelectContent>
                                {companies.map((company) => (
                                    <SelectItem key={company.value} value={company.value}>
                                        {company.label} ({company.value})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <DateRangePicker
                        date={dateRange}
                        setDate={(newRange: DateRange) => setDateRange(newRange)}
                    />
                    <Button variant="outline" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4"/>
                        Export
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
                            <CardDescription>Last trading day</CardDescription>
                        </div>
                        <Badge variant={(stockData?.priceChange ?? 0) > 0 ? "success" : "destructive"}
                               className="ml-auto">
                            {(stockData?.priceChange ?? 0) > 0 ? "+" : ""}
                            {(stockData?.priceChange ?? 0).toFixed(2)}%
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
                        <Badge variant={(sevchange ?? 0) > 0 ? "success" : "destructive"}
                               className="ml-auto">
                            {(sevchange ?? 0) > 0 ? "+" : ""}
                            {(sevchange ?? 0).toFixed(2)}%
                        </Badge>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                                        <Info className="h-4 w-4"/>
                                        <span className="sr-only">Model info</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Prediction based on {modelMetadata?.modelType} model</p>
                                    {/* <p>Accuracy: {modelMetadata?.accuracy}%</p> */}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${predictionData?.nextWeek.predicted.toFixed(2)}</div>
                        {/* <p className="text-xs text-muted-foreground mt-1">
                            Confidence: {predictionData?.nextWeek.confidenceLow.toFixed(2)} -{" "}
                            {predictionData?.nextWeek.confidenceHigh.toFixed(2)}
                        </p> */}
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
                            <CardDescription>{selectedCompany} stock price over the selected time
                                period</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[400px]">
                            {stockData && <StockHistoryChart data={stockData.history}/>}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Trading Volume</CardTitle>
                            <CardDescription>Daily trading volume for {selectedCompany}</CardDescription>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            {stockData &&
                                <StockHistoryChart data={stockData.history} dataKey="volume" chartType="bar"/>}
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
                        <CardContent>{predictionData &&
                            <StockDataTable data={predictionData.predictions}/>}</CardContent>
                        <CardFooter>
                            <Button variant="outline" onClick={handleExport}>
                                <Download className="mr-2 h-4 w-4"/>
                                Export as CSV
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="model" className="space-y-6">
                    {modelMetadata && <ModelMetadata metadata={modelMetadata}/>}
                </TabsContent>
            </Tabs>
        </div>
    )
}
