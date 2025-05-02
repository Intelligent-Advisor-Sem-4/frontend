'use client';

import {OverallRiskResponse} from '../_utils/definitions';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Skeleton} from '@/components/ui/skeleton';
import {AlertCircle, ShieldAlert} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import {Progress} from '@/components/ui/progress';
import { motion } from 'framer-motion';

// Create motion variants of the components
const MotionCard = motion(Card);

interface OverallRiskSectionProps {
    loading: boolean;
    error: string | null;
    overallRisk: OverallRiskResponse | null;
}

const OverallRiskSection = ({
                                loading,
                                error,
                                overallRisk
                            }: OverallRiskSectionProps) => {

    const getRiskColorBadge = (score: number | null | undefined) => {
        if (score === null || score === undefined) return 'bg-gray-500 text-white dark:bg-gray-900 dark:text-gray-300';
        return score >= 7 ? 'bg-red-500 text-white dark:bg-red-900 dark:text-red-300' : score >= 4 ? 'bg-yellow-500 text-white dark:bg-yellow-900 dark:text-yellow-300' : 'bg-green-500 text-white dark:bg-green-900 dark:text-green-300';
    };

    const getRiskColorProgress = (score: number | null | undefined) => {
        if (score === null || score === undefined) return 'bg-gray-500 dark:bg-gray-600';
        return score >= 7 ? 'bg-red-500 dark:bg-red-600' : score >= 4 ? 'bg-yellow-500 dark:bg-yellow-600' : 'bg-green-500 dark:bg-green-600';
    };

    // Helper function to safely display scores
    const formatScore = (score: number | null | undefined): string => {
        return score !== null && score !== undefined ? score.toFixed(1) : 'N/A';
    };

    // Helper function to determine if component data is available
    const hasComponentData = (component: {
        weight?: number | null,
        score?: number | null
    } | null | undefined): boolean => {
        return component !== null && component !== undefined && component.score !== null && component.score !== undefined;
    };

    // Helper function to calculate progress value safely
    const calculateProgress = (score: number | null | undefined): number => {
        if (score === null || score === undefined) return 0;
        return score * 10; // Convert 0-10 score to 0-100 percentage
    };

    // Helper to safely display weight
    const formatWeight = (weight: number | null | undefined): string => {
        return weight !== null && weight !== undefined ? weight.toString() : '0';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h3
                className="text-lg font-semibold mb-4 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <ShieldAlert size={18}/>
                Overall Risk Assessment
            </motion.h3>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </motion.div>
            )}

            {loading ? (
                <motion.div
                    className="flex items-center justify-center p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="space-y-4 w-full">
                        <Skeleton className="h-6 w-full"/>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-12 w-full"/>
                            <Skeleton className="h-12 w-full"/>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-12 w-full"/>
                            <Skeleton className="h-12 w-full"/>
                        </div>
                    </div>
                </motion.div>
            ) : overallRisk?.overall_risk_score !== undefined && overallRisk?.overall_risk_score !== null && overallRisk?.risk_level ? (
                <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        <CardHeader className={`flex p-2 ${
                            overallRisk.risk_level === 'High' ? 'border-l-4 border-red-500' :
                                overallRisk.risk_level === 'Medium' ? 'border-l-4 border-yellow-500' :
                                    'border-l-4 border-green-500'
                        }`}>
                            <div className="flex justify-between items-center w-full">
                                <CardTitle className="text-lg">Risk Level: {overallRisk.risk_level}</CardTitle>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: 0.3
                                    }}
                                >
                                    <Badge className={getRiskColorBadge(overallRisk.overall_risk_score)}>
                                        {formatScore(overallRisk.overall_risk_score)}/10
                                    </Badge>
                                </motion.div>
                            </div>
                        </CardHeader>
                    </motion.div>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {overallRisk.components && (
                                <motion.div
                                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                >
                                    {/* News Sentiment Component */}
                                    {hasComponentData(overallRisk.components.news_sentiment) && (
                                        <motion.div
                                            className="space-y-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">News & Sentiment</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        Weight: {formatWeight(overallRisk.components.news_sentiment?.weight)}
                                                    </span>
                                                    <span className="text-sm">
                                                        {formatScore(overallRisk.components.news_sentiment?.score)}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: 0.6 }}
                                                style={{ originX: 0 }}
                                            >
                                                <Progress
                                                    value={calculateProgress(overallRisk.components.news_sentiment?.score)}
                                                    className={getRiskColorProgress(overallRisk.components.news_sentiment?.score)}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* Quantitative Risk Component */}
                                    {hasComponentData(overallRisk.components.quant_risk) && (
                                        <motion.div
                                            className="space-y-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Quantitative Metrics</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        Weight: {formatWeight(overallRisk.components.quant_risk?.weight)}
                                                    </span>
                                                    <span className="text-sm">
                                                        {formatScore(overallRisk.components.quant_risk?.score)}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: 0.7 }}
                                                style={{ originX: 0 }}
                                            >
                                                <Progress
                                                    value={calculateProgress(overallRisk.components.quant_risk?.score)}
                                                    className={getRiskColorProgress(overallRisk.components.quant_risk?.score)}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* ESG Risk Component */}
                                    {hasComponentData(overallRisk.components.esg_risk) && (
                                        <motion.div
                                            className="space-y-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">ESG</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        Weight: {formatWeight(overallRisk.components.esg_risk?.weight)}
                                                    </span>
                                                    <span className="text-sm">
                                                        {formatScore(overallRisk.components.esg_risk?.score)}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: 0.8 }}
                                                style={{ originX: 0 }}
                                            >
                                                <Progress
                                                    value={calculateProgress(overallRisk.components.esg_risk?.score)}
                                                    className={getRiskColorProgress(overallRisk.components.esg_risk?.score)}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    )}

                                    {/* Anomaly Detection Component */}
                                    {hasComponentData(overallRisk.components.anomaly_detection) && (
                                        <motion.div
                                            className="space-y-2"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.8 }}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">Anomalies</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-muted-foreground">
                                                        Weight: {formatWeight(overallRisk.components.anomaly_detection?.weight)}
                                                    </span>
                                                    <span className="text-sm">
                                                        {formatScore(overallRisk.components.anomaly_detection?.score)}
                                                    </span>
                                                </div>
                                            </div>
                                            <motion.div
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: 1 }}
                                                transition={{ delay: 0.9 }}
                                                style={{ originX: 0 }}
                                            >
                                                <Progress
                                                    value={calculateProgress(overallRisk.components.anomaly_detection?.score)}
                                                    className={getRiskColorProgress(overallRisk.components.anomaly_detection?.score)}
                                                />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </CardContent>
                </MotionCard>

            ) : (
                <motion.div
                    className="flex items-center justify-center p-6 border rounded-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <p className="text-muted-foreground">Overall risk assessment not available.</p>
                </motion.div>
            )}
        </motion.div>
    );
};

export default OverallRiskSection;