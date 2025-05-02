'use client';

import {NewsArticle, SentimentAnalysisResponse} from '../_utils/definitions';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {Skeleton} from '@/components/ui/skeleton';
import {AlertCircle, ExternalLink, Clock, Newspaper, Rss, ScanText} from 'lucide-react';
import {Badge} from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import GeminiLogo from './GeminiLogo';
import {formatDistanceToNow, parseISO} from 'date-fns';
import { motion } from 'framer-motion';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
};

const fadeInVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            duration: 0.5
        }
    }
};

const slideInVariants = {
    hidden: { x: -20, opacity: 0 },
    show: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
};

// Enhanced Card component with framer-motion
const MotionCard = motion(Card);

interface NewsSectionProps {
    loadingNews: boolean;
    loadingSentiment: boolean;
    errorNews: string | null;
    errorSentiment: string | null;
    newsArticles: NewsArticle[];
    newsSentiment: SentimentAnalysisResponse | null;
}

const NewsSection = ({
                         loadingNews,
                         loadingSentiment,
                         errorNews,
                         errorSentiment,
                         newsArticles,
                         newsSentiment
                     }: NewsSectionProps) => {
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return 'Unknown date';
        try {
            const date = parseISO(dateString);
            return formatDistanceToNow(date, {addSuffix: true});
        } catch (error) {
            console.error('Error parsing date:', error);
            return 'Invalid date';
        }
    };

    // Sort news articles by publish date in descending order
    const sortedNewsArticles = newsArticles?.sort((a, b) => {
        const dateA = new Date(a.publish_date || 0);
        const dateB = new Date(b.publish_date || 0);
        return dateB.getTime() - dateA.getTime();
    });

    return (
        <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            initial="hidden"
            animate="show"
            variants={containerVariants}
        >
            {/* News Articles Section */}
            <motion.div variants={fadeInVariants}>
                <motion.h3
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    variants={slideInVariants}
                >
                    <Rss size={18}/> News Articles
                </motion.h3>

                {errorNews && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errorNews}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {loadingNews ? (
                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                    >
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                custom={i}
                            >
                                <Card className="overflow-hidden">
                                    <CardHeader className="p-4 pb-2">
                                        <Skeleton className="h-4 w-5/6 mb-2"/>
                                        <Skeleton className="h-3 w-1/3"/>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <Skeleton className="h-16 w-full"/>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : sortedNewsArticles && sortedNewsArticles.length > 0 ? (
                    <motion.div
                        className="space-y-4 max-h-[800px] overflow-y-auto pr-2"
                        variants={containerVariants}
                    >
                        {sortedNewsArticles.map((article, idx) => (
                            <MotionCard
                                key={idx}
                                className="overflow-hidden hover:shadow-md transition-shadow"
                                variants={itemVariants}
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                                <div className="flex">
                                    <div className="flex-1">
                                        <CardHeader className="p-4 pb-2 class flex items-start gap-3">
                                            {article.thumbnail_url && (
                                                <motion.div
                                                    className="w-24 h-24 p-3 flex-shrink-0"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={article.thumbnail_url}
                                                            alt={article.title}
                                                            fill
                                                            className="object-cover rounded-md"
                                                            sizes="(max-width: 768px) 96px, 96px"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <CardTitle className="text-base">
                                                        <Link href={article.canonical_url || '#'} target="_blank"
                                                              rel="noopener noreferrer"
                                                              className="hover:text-blue-600 flex items-start gap-1">
                                                            {article.title}
                                                            <ExternalLink size={16}
                                                                          className="shrink-0 text-blue-600 hover:text-blue-800"/>
                                                        </Link>
                                                    </CardTitle>
                                                </div>
                                                <div
                                                    className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                                    {article.provider_name && (
                                                        <motion.span
                                                            className="flex items-center gap-1"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                        >
                                                            <Newspaper size={12}/>
                                                            {article.provider_name}
                                                        </motion.span>
                                                    )}
                                                    {article.publish_date && (
                                                        <motion.span
                                                            className="flex items-center gap-1"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.4 }}
                                                        >
                                                            <Clock size={12}/>
                                                            {formatDate(article.publish_date)}
                                                        </motion.span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2">
                                            {article.summary && (
                                                <motion.p
                                                    className="text-sm text-muted-foreground line-clamp-3"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {article.summary}
                                                </motion.p>
                                            )}
                                        </CardContent>
                                    </div>
                                </div>
                            </MotionCard>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="flex items-center justify-center p-6 border rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-muted-foreground">No news articles found.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* News Sentiment Analysis Section */}
            <motion.div variants={fadeInVariants}>
                <motion.h3
                    className="text-lg font-semibold mb-4 flex items-center gap-2"
                    variants={slideInVariants}
                >
                    <ScanText size={18}/>
                    Sentiment Analysis
                    <GeminiLogo width="1.4rem" height="1.4rem" model={"Gemini 1.5 Flash"}/>
                </motion.h3>

                {errorSentiment && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{errorSentiment}</AlertDescription>
                        </Alert>
                    </motion.div>
                )}

                {loadingSentiment ? (
                    <motion.div
                        className="space-y-4"
                        variants={containerVariants}
                    >
                        <motion.div variants={itemVariants}>
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-4 w-2/3"/>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <Skeleton className="h-4 w-full"/>
                                        <Skeleton className="h-4 w-full"/>
                                        <Skeleton className="h-4 w-full"/>
                                        <Skeleton className="h-4 w-5/6"/>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                ) : newsSentiment ? (
                    <motion.div
                        className="flex space-y-4 h-[800px] pr-2"
                        variants={containerVariants}
                    >
                        <MotionCard
                            className={'overflow-y-auto max-h-full w-full'}
                            variants={itemVariants}
                            initial="hidden"
                            animate="show"
                        >
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-base">Security Assessment</CardTitle>
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: 0.3
                                        }}
                                    >
                                        <Badge className={`
                                            ${newsSentiment.stability_label === 'High Risk' ? 'bg-red-500 text-white dark:bg-red-900 dark:text-red-300' :
                                            newsSentiment.stability_label === 'Moderate Risk' ? 'bg-orange-500 text-white dark:bg-orange-900 dark:text-orange-300' :
                                                newsSentiment.stability_label === 'Slight Risk' ? 'bg-yellow-500 text-white dark:bg-yellow-900 dark:text-yellow-300' :
                                                    newsSentiment.stability_label === 'Stable' ? 'bg-green-500 text-white dark:bg-green-900 dark:text-green-300' : 'bg-gray-500 text-white dark:bg-gray-900 dark:text-gray-300'}
                                        `}>
                                            {newsSentiment.stability_label}
                                        </Badge>
                                    </motion.div>
                                </div>
                                <CardDescription className={'flex items-center gap-1'}>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Stability Score: {newsSentiment.stability_score !== undefined ?
                                        newsSentiment.stability_score.toFixed(1) : 'N/A'}/10
                                    </motion.span>
                                    {newsSentiment.updated_at && (
                                        <motion.span
                                            className="text-xs text-muted-foreground ml-2 flex items-center gap-1"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <Clock size={12}/>
                                            Updated {formatDate(newsSentiment.updated_at)}
                                        </motion.span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <motion.p
                                    className="text-sm mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {newsSentiment.security_assessment}
                                </motion.p>
                                <motion.div
                                    className="mb-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h4 className="text-sm font-medium mb-2">Key Risk Factors:</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        {newsSentiment.key_risks?.legal_risks && newsSentiment.key_risks.legal_risks.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <p className="text-xs font-medium text-red-600">Legal Risks:</p>
                                                <ul className="text-xs list-disc pl-4">
                                                    {newsSentiment.key_risks.legal_risks.map((risk, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.3 + idx * 0.1 }}
                                                        >
                                                            {risk}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}

                                        {newsSentiment.key_risks?.governance_risks && newsSentiment.key_risks.governance_risks.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <p className="text-xs font-medium text-orange-600">Governance Risks:</p>
                                                <ul className="text-xs list-disc pl-4">
                                                    {newsSentiment.key_risks.governance_risks.map((risk, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.4 + idx * 0.1 }}
                                                        >
                                                            {risk}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}

                                        {newsSentiment.key_risks?.operational_risks && newsSentiment.key_risks.operational_risks.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <p className="text-xs font-medium text-yellow-600">Operational
                                                    Risks:</p>
                                                <ul className="text-xs list-disc pl-4">
                                                    {newsSentiment.key_risks.operational_risks.map((risk, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.5 + idx * 0.1 }}
                                                        >
                                                            {risk}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}

                                        {newsSentiment.key_risks?.financial_stability_issues && newsSentiment.key_risks.financial_stability_issues.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <p className="text-xs font-medium text-blue-600">Financial
                                                    Stability:</p>
                                                <ul className="text-xs list-disc pl-4">
                                                    {newsSentiment.key_risks.financial_stability_issues.map((risk, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.6 + idx * 0.1 }}
                                                        >
                                                            {risk}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}

                                        {newsSentiment.key_risks?.fraud_indicators && newsSentiment.key_risks.fraud_indicators.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 }}
                                            >
                                                <p className="text-xs font-medium text-purple-600">Fraud Indicators:</p>
                                                <ul className="text-xs list-disc pl-4">
                                                    {newsSentiment.key_risks.fraud_indicators.map((risk, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.7 + idx * 0.1 }}
                                                        >
                                                            {risk}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}

                                        {newsSentiment.key_risks?.political_exposure && newsSentiment.key_risks.political_exposure.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.8 }}
                                            >
                                                <p className="text-xs font-medium text-amber-600">Political
                                                    Exposure:</p>
                                                <ul className="text-xs list-disc pl-4">
                                                    {newsSentiment.key_risks.political_exposure.map((risk, idx) => (
                                                        <motion.li
                                                            key={idx}
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.8 + idx * 0.1 }}
                                                        >
                                                            {risk}
                                                        </motion.li>
                                                    ))}
                                                </ul>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="text-xs grid grid-cols-2 gap-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <div className={'flex flex-row gap-2 items-center'}>
                                        <p className="font-medium">Customer Suitability:</p>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                delay: 1.0
                                            }}
                                        >
                                            <Badge variant={
                                                newsSentiment.customer_suitability === 'Unsuitable' ? 'destructive' :
                                                    newsSentiment.customer_suitability === 'Cautious Inclusion' ? 'outline' : 'default'
                                            }>
                                                {newsSentiment.customer_suitability}
                                            </Badge>
                                        </motion.div>
                                    </div>

                                    <div className={'flex flex-row gap-2 items-center'}>
                                        <p className="font-medium">Suggested Action:</p>
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 260,
                                                damping: 20,
                                                delay: 1.1
                                            }}
                                        >
                                            <Badge variant={
                                                newsSentiment.suggested_action === 'Immediate Action Required' ? 'destructive' :
                                                    newsSentiment.suggested_action === 'Flag for Removal' ? 'destructive' :
                                                        newsSentiment.suggested_action === 'Flag for Review' ? 'outline' :
                                                            newsSentiment.suggested_action === 'Review' ? 'outline' : 'default'
                                            }>
                                                {newsSentiment.suggested_action}
                                            </Badge>
                                        </motion.div>
                                    </div>
                                </motion.div>

                                {newsSentiment.news_highlights && newsSentiment.news_highlights.length > 0 && (
                                    <motion.div
                                        className="mt-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.2 }}
                                    >
                                        <h4 className="text-sm font-medium mb-2">Key News Highlights:</h4>
                                        <ul className="text-xs list-disc pl-4">
                                            {newsSentiment.news_highlights.map((highlight, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -5 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.2 + idx * 0.1 }}
                                                >
                                                    {highlight}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {newsSentiment.risk_rationale && newsSentiment.risk_rationale.length > 0 && (
                                    <motion.div
                                        className="mt-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.3 }}
                                    >
                                        <h4 className="text-sm font-medium mb-2">Risk Rationale:</h4>
                                        <ul className="text-xs list-disc pl-4">
                                            {newsSentiment.risk_rationale.map((rationale, idx) => (
                                                <motion.li
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -5 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 1.3 + idx * 0.1 }}
                                                >
                                                    {rationale}
                                                </motion.li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {newsSentiment.risk_score !== undefined && (
                                    <motion.div
                                        className="mt-4"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 1.4 }}
                                    >
                                        <p className="text-xs font-medium">
                                            Risk Score: {newsSentiment.risk_score.toFixed(1)}/10
                                        </p>
                                    </motion.div>
                                )}
                            </CardContent>
                        </MotionCard>
                    </motion.div>
                ) : (
                    <motion.div
                        className="flex items-center justify-center p-6 border rounded-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <p className="text-muted-foreground">No sentiment analysis available.</p>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default NewsSection;