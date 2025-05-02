import React, {Suspense} from 'react';
import {ScreenerType} from './_utils/definitions';
import {ScreenerSelector} from "@/app/(dashboard)/global-assets/[type]/_components/SelectorTabs";
import {ScreenTable} from "@/app/(dashboard)/global-assets/[type]/_components/ScreenTable";
import SkeletonTable from "@/app/(dashboard)/global-assets/[type]/_components/SkeletonTable";
import Pagination from "@/app/(dashboard)/global-assets/[type]/_components/Pagination";

// Make sure the searchParams has the correct type
const Page = async ({
                        params, searchParams,
                    }: {
    params: Promise<{ type: string }>;
    searchParams: Promise<{
        filter?: string;
        page?: string;
    }>;
}) => {
    // Example of excluding certain screener types if needed
    const top = [ScreenerType.MOST_ACTIVES, ScreenerType.DAY_GAINERS, ScreenerType.DAY_LOSERS, ScreenerType.PORTFOLIO_ANCHORS, ScreenerType.AGGRESSIVE_SMALL_CAPS, ScreenerType.GROWTH_TECHNOLOGY_STOCKS];
    const sectors = [ScreenerType.TECHNOLOGY, ScreenerType.REAL_ESTATE, ScreenerType.HEALTHCARE, ScreenerType.CONSUMER_CYCLICAL, ScreenerType.ENERGY, ScreenerType.FINANCIAL, ScreenerType.CONSUMER_CYCLICAL, ScreenerType.UTILITIES]
    const page = parseInt((await searchParams).page as string) || 1;
    const type = (await params).type;


    let include;
    let header;
    switch (type) {
        case "top-screens":
            include = top;
            header = "Top screens";
            break;
        case "sectors":
            include = sectors;
            header = "Sectors";
            break;
        default:
            include = sectors;
            header = "Sectors";
            break;
    }

    const filter = (await searchParams).filter as ScreenerType || include[0];


    return (
        <div className="flex flex-col flex-grow px-5 py-4">
            <div className="w-full flex items-center justify-between mb-5">
                <h1 className="text-2xl font-semibold">{header}</h1>
            </div>
            <div className="flex flex-col gap-4 w-full">
                <ScreenerSelector
                    filter={filter}
                    include={include}
                />
                <Suspense key={`${filter}-${page}`} fallback={<SkeletonTable/>}>
                    <ScreenTable filter={filter} page={page}/>
                </Suspense>
                <Pagination page={page}/>
            </div>
        </div>
    );
};

export default Page;