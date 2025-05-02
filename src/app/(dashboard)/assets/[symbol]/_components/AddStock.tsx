'use client';

import React, {JSX} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {PlusCircle} from 'lucide-react';
import {toast} from 'react-toastify';
import {createStockAction} from "@/app/(dashboard)/global-assets/[type]/_utils/actions";
import {formatMarketCap} from "@/app/(dashboard)/global-assets/[type]/_utils/utils";
import RiskBadge from "@/app/(dashboard)/_components/RiskBadge";

import {Asset} from "@/app/(dashboard)/assets/[symbol]/_utils/definitions";


const AddStock = ({stock}: { stock: Asset }): JSX.Element => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleAddStock = async () => {
        // Create loading toast
        const toastId = toast.loading(`Adding ${stock.ticker}...`, {
            pauseOnFocusLoss: false,
            autoClose: false,
        });

        try {
            const result = await createStockAction(stock.ticker);

            if (result.success) {
                // Update toast on success
                toast.update(toastId, {
                    render: result.message,
                    type: 'success',
                    autoClose: 2000,
                    isLoading: false
                });
            } else {
                // Update toast on error
                toast.update(toastId, {
                    render: result.message,
                    type: 'error',
                    autoClose: 3000,
                    isLoading: false
                });
            }
        } catch (error) {
            // Handle unexpected errors
            console.error('Error adding stock:', error);
            toast.update(toastId, {
                render: `Failed to add ${stock.ticker}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: 'error',
                autoClose: 3000,
                isLoading: false
            });
        }

        setIsOpen(false);
    };

    // Safely format price with null handling
    const formatPrice = (price: number | null): string => {
        return price !== null ? `$${price.toFixed(2)}` : 'N/A';
    };

    // Safely format PE ratio with null handling
    const formatPE = (pe: number | null): string => {
        return pe !== null ? pe.toFixed(2) : 'N/A';
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger>
                    <Button className="h-8">
                        <PlusCircle className="h-4 w-4 mr-1"/> Add to system
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Stock to System</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to add {stock.ticker} ({stock.name}) to the system?
                            This will make it available for risk analysis and monitoring.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Symbol</p>
                            <p className="font-medium">{stock.ticker}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Risk Level</p>
                            <RiskBadge score={stock.db?.risk_score ?? null}/>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Market Cap</p>
                            <p>{stock.market_cap !== null ? formatMarketCap(stock.market_cap) : 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Price</p>
                            <p>{formatPrice(stock.last_price)}</p>
                        </div>
                        {stock.exchange && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Exchange</p>
                                <p>{stock.exchange}</p>
                            </div>
                        )}
                        {stock.trailing_pe !== null && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">P/E Ratio</p>
                                <p>{formatPE(stock.trailing_pe)}</p>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddStock}>Add Stock</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddStock;