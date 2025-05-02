import React, {Suspense} from 'react';
import SearchBar from "./_components/Searchbar";
import {ResultsSection, ResultsSkeleton} from "./_components/ResultsSection";
import {ScreenerSelector} from "@/app/(dashboard)/global-assets/[type]/_components/SelectorTabs";
import SkeletonTable from "@/app/(dashboard)/global-assets/[type]/_components/SkeletonTable";
import {ScreenTable} from "@/app/(dashboard)/global-assets/[type]/_components/ScreenTable";
import {ScreenerType} from "@/app/(dashboard)/global-assets/[type]/_utils/definitions";
import Link from "next/link";
import {Separator} from "@/components/ui/separator";

interface PageProps {
    searchParams: Promise<{
        query?: string;
        screener?: string;
        sector?: string;
        sectorPage?: string;
        screenPage?: string;
    }>;
}

const Page = async ({searchParams}: PageProps) => {
    const awaitedParams = await searchParams;
    const query = awaitedParams.query || '';
    const top = [ScreenerType.MOST_ACTIVES, ScreenerType.DAY_GAINERS, ScreenerType.DAY_LOSERS, ScreenerType.PORTFOLIO_ANCHORS, ScreenerType.AGGRESSIVE_SMALL_CAPS, ScreenerType.GROWTH_TECHNOLOGY_STOCKS];
    const sectors = [ScreenerType.TECHNOLOGY, ScreenerType.REAL_ESTATE, ScreenerType.HEALTHCARE, ScreenerType.CONSUMER_CYCLICAL, ScreenerType.ENERGY, ScreenerType.FINANCIAL, ScreenerType.CONSUMER_CYCLICAL, ScreenerType.UTILITIES]

    const screenPage = parseInt(awaitedParams.screenPage as string) || 1;
    const sectorPage = parseInt(awaitedParams.sectorPage as string) || 1;

    const screener = awaitedParams.screener as ScreenerType || top[0];
    const sector = awaitedParams.sector as ScreenerType || sectors[0];

    return (
        <div className="container mx-auto pb-6">
            <SearchBar initialQuery={query}/>

            <div className={'px-5 mt-4 flex flex-col gap-4'}>
                {query && (
                    <Suspense fallback={<ResultsSkeleton/>} key={query}>
                        <ResultsSection query={query}/>
                        <Separator/>
                    </Suspense>
                )}

                <div className="flex flex-col gap-4 w-full">
                    <h1 className="text-2xl font-semibold mb-2">Top Screens</h1>
                    <ScreenerSelector
                        filter={screener}
                        include={top}
                        pageName={'screenPage'}
                        filterName={'screener'}
                    />
                    <Suspense key={`screener-${screener}-page-${screenPage}`} fallback={<SkeletonTable/>}>
                        <ScreenTable filter={screener} page={screenPage} result_per_page={7}/>
                    </Suspense>
                    {/*<ScreenerPagination page={screenPage} parameterName={'screenPage'}/>*/}
                    <div className={'flex justify-end'}>
                        <Link href={'/global-assets/top-screens'}
                              className={'text-primary hover:underline transition-colors'}>
                            See more
                        </Link>
                    </div>
                </div>
                <Separator/>
                <div className="flex flex-col gap-4 w-full">
                    <h1 className="text-2xl font-semibold mb-2">Top sectors</h1>
                    <ScreenerSelector
                        filter={sector}
                        include={sectors}
                        pageName={'sectorPage'}
                        filterName={'sector'}
                    />
                    <Suspense key={`${sector}-${sectorPage}`} fallback={<SkeletonTable/>}>
                        <ScreenTable filter={sector} page={sectorPage} result_per_page={7}/>
                    </Suspense>
                    {/*<ScreenerPagination page={sectorPage} parameterName={'sectorPage'}/>*/}
                    <div className={'flex justify-end'}>
                        <Link href={'/global-assets/sectors'}
                              className={'text-primary hover:underline transition-colors'}>
                            See more
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;