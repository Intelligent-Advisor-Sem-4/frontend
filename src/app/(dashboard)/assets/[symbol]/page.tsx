import {getAssetByTicker} from './_utils/actions';
import {Accordion} from '@/components/ui/accordion';
import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {
    AlertCircle,
    ExternalLink,
} from 'lucide-react';
import {Separator} from '@/components/ui/separator';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import Link from 'next/link';
import StatusBadge from "@/app/(dashboard)/_components/StatusBadge";
import RiskBadge from "../../_components/RiskBadge";
import StatusManager from "./_components/StatusManager";
import {MarketDataSection, FinancialDataSection, CompanyInfoSection} from "./_components/AccordionItems";
import PriceSection from './_components/PriceSection';
import AddStock from "@/app/(dashboard)/assets/[symbol]/_components/AddStock";
import {RiskScoreTooltip} from "@/app/(dashboard)/assets/[symbol]/_components/ShallowRiskTooltip";
import RiskAnalysisSection from "@/app/(dashboard)/assets/[symbol]/_components/RiskAnalysisSection";
import {AssetStatus} from "@/app/(dashboard)/assets/[symbol]/_utils/definitions";

// Main page component
const StockDetailPage = async ({params}: { params: Promise<{ symbol: string }> }) => {
    const {symbol} = await params;
    const {data: asset, error} = await getAssetByTicker(symbol);


    // Error state
    if (error) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {error.statusCode === 404
                            ? `Stock with symbol "${symbol}" not found.`
                            : `An error occurred: ${error.detail}`}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    // Loading state or no data
    if (!asset) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48"/>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-12 w-full"/>
                            <Skeleton className="h-20 w-full"/>
                            <Skeleton className="h-32 w-full"/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col mx-auto py-8 px-8 gap-8">
            {/* Header Section */}
            <section>
                <div className="flex flex-col items-center md:items-start gap-2 mb-4">
                    <div className="text-muted-foreground text-sm">
                        {asset.ticker} • {asset.exchange || 'Unknown Exchange'} • {asset.currency || 'Unknown Currency'}
                    </div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">{asset.name || symbol}</h1>
                        {asset.company_url && (
                            <Link href={asset.company_url} target="_blank" rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800">
                                <ExternalLink size={16}/>
                            </Link>
                        )}
                        <div className="flex flex-wrap gap-2 items-center">
                            {asset.db?.status && <StatusBadge status={asset.db.status as AssetStatus}/>}
                            {asset.db?.risk_score !== undefined && <RiskBadge score={asset.db.risk_score}/>}
                            {asset.db?.risk_score !== null && <RiskScoreTooltip/>}
                        </div>
                    </div>
                    <Separator/>
                </div>

                <div>
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <PriceSection ticker={symbol} initial={{
                            currency: asset.currency,
                            last_price: asset.last_price,
                            prev_close: asset.last_price,
                        }
                        }/>


                        {/* DB Action Buttons */}
                        <div>
                            {asset.db?.in_db ? (
                                <StatusManager
                                    asset={asset}
                                />
                            ) : (
                                <div className={'flex flex-col items-end text-end max-w-52 gap-2'}>
                                    <AddStock stock={asset}/>
                                    <span className={'text-muted-foreground shadow-muted text-xs'}>
                                        To view advanced analytics and risk metrics, please add this stock to the system.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <Separator/>

                    {/* Asset Details Accordion */}
                    <Accordion type="single" collapsible className="w-full">
                        <MarketDataSection asset={asset}/>
                        <FinancialDataSection asset={asset}/>
                        <CompanyInfoSection asset={asset}/>
                    </Accordion>
                </div>
            </section>
            <Separator />
            <RiskAnalysisSection ticker={asset.ticker} inDb={asset.db?.in_db || false} asset={asset}/>
        </div>
    );
};

export default StockDetailPage;