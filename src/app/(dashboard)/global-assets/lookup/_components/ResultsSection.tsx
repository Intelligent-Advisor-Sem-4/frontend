import React from 'react';
import {searchYahooFinance} from "@/app/(dashboard)/global-assets/lookup/_utils/actions";
import QuotesSection from "@/app/(dashboard)/global-assets/lookup/_components/QuotesSection";
import {Separator} from "@/components/ui/separator";
import NewsSection from "@/app/(dashboard)/global-assets/lookup/_components/NewsSection";
import {Skeleton} from "@/components/ui/skeleton";

const ResultsSection = async ({query}: { query: string }) => {
    const searchResults = await searchYahooFinance({
        query: query,
        newsCount: 8,
        quoteCount: 10
    });

    return (
        <div className="space-y-8">
            <QuotesSection quotes={searchResults.success ? searchResults.data.quotes : []}
                           error={searchResults.success ? null : searchResults.error}/>
            <Separator className="my-8"/>
            <NewsSection news={searchResults.success ? searchResults.data.news : []}
                         error={searchResults.success ? null : searchResults.error}/>
        </div>
    );
};

const ResultsSkeleton = () => {
    return (
        <div className="space-y-8">
            <div className="animate-pulse space-y-4">
                <Skeleton className={'h-6 w-1/3'} />
                <Skeleton className={'h-64 w-full'} />
            </div>
            <Separator className="my-8"/>
            <div className="animate-pulse space-y-4">
                <Skeleton className={'h-6 w-1/3'} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Skeleton key={index} className={'h-32 w-full'} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export {ResultsSection, ResultsSkeleton};