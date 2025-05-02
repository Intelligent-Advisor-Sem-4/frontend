'use client';

import {useEffect, useState} from 'react';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {AlertCircle} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import {Badge} from '@/components/ui/badge';
import AddStock from '@/app/(dashboard)/assets/[symbol]/_components/AddStock';
import {
    NewsArticle,
    SentimentAnalysisResponse,
    QuantRiskResponse,
    EsgRiskResponse,
    AnomalyDetectionResponse,
    OverallRiskResponse,
    StreamResponse, Asset
} from '../_utils/definitions';

// Sub-components
import NewsSection from './NewsSection';
import QuantEsgSection from './QuantEsgSection';
import AnomalySection from './AnomalySection';
import OverallRiskSection from './OverallRiskSection';
import {BACKEND_BASE_URL} from "@/lib/const";

interface RiskAnalysisSectionProps {
    ticker: string;
    inDb: boolean;
    asset: Asset;
}

const RiskAnalysisSection = ({ticker, inDb, asset}: RiskAnalysisSectionProps) => {
    // State for each section of data
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
    const [newsSentiment, setNewsSentiment] = useState<SentimentAnalysisResponse | null>(null);
    const [quantRisk, setQuantRisk] = useState<QuantRiskResponse | null>(null);
    const [esgRisk, setEsgRisk] = useState<EsgRiskResponse | null>(null);
    const [anomalyRisk, setAnomalyRisk] = useState<AnomalyDetectionResponse | null>(null);
    const [overallRisk, setOverallRisk] = useState<OverallRiskResponse | null>(null);

    // Loading states for each section
    const [loading, setLoading] = useState<boolean>(false);
    const [sectionLoading, setSectionLoading] = useState({
        news: false,
        sentiment: false,
        quant: false,
        esg: false,
        anomaly: false,
        overall: false
    });

    // Error states
    const [error, setError] = useState<string | null>(null);
    const [sectionErrors, setSectionErrors] = useState({
        news: null,
        sentiment: null,
        quant: null,
        esg: null,
        anomaly: null,
        overall: null
    });

    useEffect(() => {
        const fetchRiskAnalysis = async () => {
            if (!inDb) return;

            setLoading(true);
            setSectionLoading({
                news: true,
                sentiment: true,
                quant: true,
                esg: true,
                anomaly: true,
                overall: true
            });
            setError(null);
            setSectionErrors({
                news: null,
                sentiment: null,
                quant: null,
                esg: null,
                anomaly: null,
                overall: null
            });

            try {
                // Create EventSource for SSE
                const eventSource = new EventSource(`${BACKEND_BASE_URL}/risk-analysis/${ticker}/stream`, {
                    withCredentials: false,
                });

                eventSource.onmessage = (event) => {
                    const response = JSON.parse(event.data) as StreamResponse;

                    switch (response.type) {
                        case 'news_articles':
                            setNewsArticles(response.data as NewsArticle[]);
                            setSectionLoading(prev => ({...prev, news: false}));
                            break;
                        case 'news_sentiment':
                            setNewsSentiment(response.data as SentimentAnalysisResponse);
                            setSectionLoading(prev => ({...prev, sentiment: false}));
                            break;
                        case 'quantitative_risk':
                            setQuantRisk(response.data as QuantRiskResponse);
                            setSectionLoading(prev => ({...prev, quant: false}));
                            break;
                        case 'esg_risk':
                            setEsgRisk(response.data as EsgRiskResponse);
                            setSectionLoading(prev => ({...prev, esg: false}));
                            break;
                        case 'anomaly_risk':
                            setAnomalyRisk(response.data as AnomalyDetectionResponse);
                            setSectionLoading(prev => ({...prev, anomaly: false}));
                            break;
                        case 'overall_risk':
                            setOverallRisk(response.data as OverallRiskResponse);
                            setSectionLoading(prev => ({...prev, overall: false}));
                            break;
                        case 'complete':
                            setLoading(false);
                            eventSource.close();
                            break;
                    }
                };

                eventSource.onerror = (e) => {
                    console.error('EventSource error:', e);
                    setError('Connection error. Please try again later.');
                    setLoading(false);
                    eventSource.close();
                };

                return () => {
                    eventSource.close();
                };
            } catch (err) {
                console.error('Error setting up SSE:', err);
                setError('Failed to connect to risk analysis service.');
                setLoading(false);
            }
        };

        if (inDb) {
            fetchRiskAnalysis().then();
        }

        // Cleanup function
        return () => {
            // Any cleanup needed
        };
    }, [ticker, inDb]);

    if (!inDb) {
        return (
            <div className="mb-6 p-6 border ">
                <h2 className="text-2xl font-bold mb-1">Risk Analysis</h2>
                <p className="text-muted-foreground mb-6">
                    Add this stock to the system to view comprehensive risk analysis
                </p>

                <div className="flex flex-col items-center text-center p-6">
                    <div className="mb-4">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-2"/>
                        <p className="text-muted-foreground mb-6">
                            Risk analysis data is only available for stocks that have been added to the system.
                            Add this stock to access detailed risk metrics, news sentiment analysis, and more.
                        </p>
                    </div>
                    <AddStock stock={asset}/>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6">
            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold">Risk Analysis</h2>
                        <p className="text-muted-foreground">
                            Comprehensive risk assessment for {ticker}
                        </p>
                    </div>
                    {overallRisk?.overall_risk_score !== undefined && overallRisk?.overall_risk_score !== null && (
                        <Badge
                            className={`text-lg px-3 py-1 ${
                                overallRisk.risk_level === 'High' ? 'bg-red-500 text-white dark:bg-red-800 dark:text-red-300' :
                                    overallRisk.risk_level === 'Medium' ? 'bg-yellow-500 text-white dark:bg-yellow-800 dark:text-yellow-300' :
                                        'bg-green-500 text-white dark:bg-green-800 dark:text-green-300'
                            }`}
                        >
                            Risk: {overallRisk.overall_risk_score.toFixed(1)}/10
                        </Badge>
                    )}
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <div className="space-y-6">
                    {/* Overall Risk Section */}
                    <section className="p-4 ">
                        <OverallRiskSection
                            loading={sectionLoading.overall}
                            error={sectionErrors.overall}
                            overallRisk={overallRisk}
                        />
                    </section>

                    <Separator className="my-6"/>

                    {/* News and Sentiment Section */}
                    <section className="p-4 ">
                        <NewsSection
                            loadingNews={sectionLoading.news}
                            loadingSentiment={sectionLoading.sentiment}
                            errorNews={sectionErrors.news}
                            errorSentiment={sectionErrors.sentiment}
                            newsArticles={newsArticles}
                            newsSentiment={newsSentiment}
                        />
                    </section>

                    <Separator className="my-6"/>

                    {/* Quantitative and ESG Risk Section */}
                    <section className="p-4 ">
                        <QuantEsgSection
                            loadingQuant={sectionLoading.quant}
                            loadingEsg={sectionLoading.esg}
                            errorQuant={sectionErrors.quant}
                            errorEsg={sectionErrors.esg}
                            quantRisk={quantRisk}
                            esgRisk={esgRisk}
                        />
                    </section>

                    <Separator className="my-6"/>

                    {/* Anomaly Detection Section */}
                    <section className="p-4 ">
                        <AnomalySection
                            loading={sectionLoading.anomaly}
                            error={sectionErrors.anomaly}
                            anomalyRisk={anomalyRisk}
                        />
                    </section>
                </div>

                {loading && (
                    <div className="flex justify-center mt-6">
                        <div className="text-center">
                            <p className="text-muted-foreground mb-2">Loading risk analysis data...</p>
                            <p className="text-xs text-muted-foreground">This may take a moment as we analyze various
                                risk factors</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskAnalysisSection;