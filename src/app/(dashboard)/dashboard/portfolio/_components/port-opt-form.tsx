"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Card, CardContent, CardHeader, CardTitle, CardDescription} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {X, Sparkles, DollarSign, Clock, Briefcase, AlertCircle, Info, Loader2} from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {useActionState} from "react";
import {optimizePortfolio} from "@/actions/profile";
import {BackendResultsWithSuccessAndMessage} from "@/lib/types/profile";
import {motion, AnimatePresence} from "framer-motion";
import {Skeleton} from "@/components/ui/skeleton";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

const SAMPLE_TICKERS = [
    {
        symbol: "AAPL",
        name: "Apple Inc.",
        description: "Technology company that designs and manufactures consumer electronics"
    },
    {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        description: "Technology company specializing in software and cloud services"
    },
    {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        description: "Technology company known for internet services and products"
    },
    {
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        description: "E-commerce and cloud computing company"
    },
    {
        symbol: "META",
        name: "Meta Platforms Inc.",
        description: "Social media and technology company"
    },
    {
        symbol: "TSLA",
        name: "Tesla Inc.",
        description: "Electric vehicle and clean energy company"
    },
    {
        symbol: "NVDA",
        name: "NVIDIA Corporation",
        description: "Technology company specializing in graphics and AI computing"
    },
    {
        symbol: "JPM",
        name: "JPMorgan Chase & Co.",
        description: "Global financial services firm"
    },
    {
        symbol: "V",
        name: "Visa Inc.",
        description: "Global payments technology company"
    },
    {
        symbol: "WMT",
        name: "Walmart Inc.",
        description: "Multinational retail corporation"
    }
];

const initialState: BackendResultsWithSuccessAndMessage = {
    success: false,
    message: "",
    data: undefined,
};

export default function PortfolioOptimizationPage() {
    const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [state, formAction, pending] = useActionState(optimizePortfolio, initialState);
    const router = useRouter();

    // new state fields
    const [years, setYears] = useState("");
    const [investmentAmount, setInvestmentAmount] = useState("");
    const [targetAmount, setTargetAmount] = useState("");

    const handleTickerSelect = (ticker: string) => {
        if (!selectedTickers.includes(ticker)) {
            setSelectedTickers([...selectedTickers, ticker]);
        }
    };

    const handleRemoveTicker = (tickerToRemove: string) => {
        setSelectedTickers(selectedTickers.filter((ticker) => ticker !== tickerToRemove));
    };

    const handleNextStep = () => {
        if (selectedTickers.length >= 2) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('tickers', JSON.stringify(selectedTickers));
        formData.append('years', years);
        formData.append('investmentAmount', investmentAmount);
        formData.append('targetAmount', targetAmount);
        formAction(formData);
    };

    useEffect(() => {
        if (state.success && state.data) {
            const encodedData = encodeURIComponent(JSON.stringify(state.data));
            router.push(`/dashboard/portfolio/results?data=${encodedData}`);
        }
    }, [state.success, state.data, router]);

    return (
        <div className="space-y-6">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/dashboard/portfolio" className="text-foreground font-medium">
                            Portfolio Optimization
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary"/>
                        <CardTitle>Investment Portfolio Optimizer</CardTitle>
                    </div>
                    <CardDescription className="text-base space-y-2">
                        <p>Create your optimal investment portfolio by selecting stocks and defining your investment
                            goals.</p>
                        <div
                            className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                            <AlertCircle className="w-4 h-4"/>
                            <p>Our algorithm will help you find the best portfolio allocation based on historical data
                                and modern portfolio theory.</p>
                        </div>
                        <div className="flex justify-between text-sm mt-4">
                            <span>Step {currentStep} of 3</span>
                            <span>{currentStep === 1 ? 'Select Stocks' : currentStep === 2 ? 'Investment Period' : 'Investment Details'}</span>
                        </div>
                        <div className="w-full bg-muted h-2 rounded-full mt-2">
                            <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{width: `${(currentStep / 3) * 100}%`}}
                            />
                        </div>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {pending ? (
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-full"/>
                            <Skeleton className="h-20 w-full"/>
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-20 w-full"/>
                                <Skeleton className="h-20 w-full"/>
                            </div>
                            <Skeleton className="h-10 w-full"/>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {currentStep === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{opacity: 0, x: 20}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -20}}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="tickers" className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4"/>
                                                Select Stocks
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="w-4 h-4 text-muted-foreground"/>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Select at least 2 stocks for diversification</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Select onValueChange={value => handleTickerSelect(value)}>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue placeholder="Choose stocks to include in your portfolio"/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SAMPLE_TICKERS.filter((ticker) => !selectedTickers.includes(ticker.symbol)).map((ticker) => (
                                                    <SelectItem
                                                        key={ticker.symbol}
                                                        value={ticker.symbol}
                                                        className="flex flex-col items-start py-2"
                                                    >
                                                        <div
                                                            className="font-medium">{ticker.symbol} - {ticker.name}</div>
                                                        <div
                                                            className="text-sm text-muted-foreground">{ticker.description}</div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        <AnimatePresence>
                                            {selectedTickers.length > 0 && (
                                                <motion.div
                                                    initial={{opacity: 0, y: -10}}
                                                    animate={{opacity: 1, y: 0}}
                                                    exit={{opacity: 0, y: -10}}
                                                    className="flex flex-wrap gap-2 mt-2"
                                                >
                                                    {selectedTickers.map((ticker) => {
                                                        const tickerInfo = SAMPLE_TICKERS.find(t => t.symbol === ticker);
                                                        return (
                                                            <motion.div
                                                                key={ticker}
                                                                initial={{opacity: 0, scale: 0.8}}
                                                                animate={{opacity: 1, scale: 1}}
                                                                exit={{opacity: 0, scale: 0.8}}
                                                                className="bg-secondary px-3 py-1.5 rounded-lg text-sm w-full"
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <div
                                                                            className="font-medium">{tickerInfo?.symbol} - {tickerInfo?.name}</div>
                                                                        <div
                                                                            className="text-muted-foreground text-xs">{tickerInfo?.description}</div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveTicker(ticker)}
                                                                        className="hover:text-destructive transition-colors ml-2"
                                                                        aria-label={`Remove ${ticker}`}
                                                                    >
                                                                        <X size={14}/>
                                                                    </button>
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}

                                {currentStep === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{opacity: 0, x: 20}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -20}}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="years" className="flex items-center gap-2">
                                                <Clock className="w-4 h-4"/>
                                                Investment Period
                                            </Label>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Info className="w-4 h-4 text-muted-foreground"/>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Enter your planned investment duration in years</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                        <Input
                                            id="years"
                                            name="years"
                                            type="number"
                                            step="0.1"
                                            min="0.1"
                                            required
                                            className="bg-background"
                                            placeholder="e.g., 5 years"
                                            value={years}
                                            onChange={(e) => setYears(e.target.value)}
                                        />
                                    </motion.div>
                                )}

                                {currentStep === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{opacity: 0, x: 20}}
                                        animate={{opacity: 1, x: 0}}
                                        exit={{opacity: 0, x: -20}}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="investmentAmount" className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4"/>
                                                    Initial Investment
                                                </Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Info className="w-4 h-4 text-muted-foreground"/>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>The amount you plan to invest initially</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                id="investmentAmount"
                                                name="investmentAmount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                required
                                                className="bg-background"
                                                placeholder="e.g., 10000"
                                                value={investmentAmount}
                                                onChange={(e) => setInvestmentAmount(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="targetAmount" className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4"/>
                                                    Target Amount
                                                </Label>
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <Info className="w-4 h-4 text-muted-foreground"/>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Your desired portfolio value at the end of the investment
                                                                period</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </div>
                                            <Input
                                                id="targetAmount"
                                                name="targetAmount"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                required
                                                className="bg-background"
                                                placeholder="e.g., 15000"
                                                value={targetAmount}
                                                onChange={(e) => setTargetAmount(e.target.value)}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {selectedTickers.length === 0 && currentStep === 1 && (
                                <div
                                    className="text-sm text-amber-500 bg-amber-500/10 p-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4"/>
                                    Please select at least two stocks to optimize your portfolio
                                </div>
                            )}

                            <div className="flex justify-between gap-4">
                                {currentStep > 1 && (
                                    <Button type="button" variant="outline" onClick={handlePrevStep}>
                                        Previous
                                    </Button>
                                )}

                                {currentStep < 3 ? (
                                    <Button
                                        type="button"
                                        className="ml-auto"
                                        onClick={handleNextStep}
                                        disabled={currentStep === 1 && selectedTickers.length < 2 || currentStep === 2 && !years}
                                    >
                                        Next
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        className="ml-auto"
                                        disabled={
                                            pending ||
                                            selectedTickers.length < 2 ||
                                            !years ||
                                            !investmentAmount ||
                                            !targetAmount
                                        }
                                    >
                                        {pending ? (
                                            <div className="flex items-center justify-center">
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                                <span>Optimizing Portfolio...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <Sparkles className="mr-2 h-4 w-4"/>
                                                <span>Generate Optimal Portfolio</span>
                                            </div>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </form>
                    )}

                    <AnimatePresence>
                        {!state.success && state.message && (
                            <motion.div
                                initial={{opacity: 0, y: 10}}
                                animate={{opacity: 1, y: 0}}
                                exit={{opacity: 0, y: 10}}
                                className="mt-4 text-destructive text-sm bg-destructive/10 p-3 rounded-lg flex items-center gap-2"
                            >
                                <AlertCircle className="w-4 h-4"/>
                                {state.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </CardContent>
            </Card>
        </div>
    );
}