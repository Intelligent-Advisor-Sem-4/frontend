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
import {CircleCheck, PlusCircle} from 'lucide-react';
import {toast} from 'react-toastify';
import {createStockAction, MinimalStockInfo} from "../_utils/actions";
import {formatMarketCap} from "../_utils/utils";
import RiskBadge from "@/app/(dashboard)/_components/RiskBadge";

const AddStockDialog = ({stock, in_db}: { stock: MinimalStockInfo, in_db: boolean }): JSX.Element => {
    const [isOpen, setIsOpen] = React.useState(false);

    const handleAddStock = async () => {
        // Create loading toast
        const toastId = toast.loading(`Adding ${stock.symbol}...`, {
            position: "bottom-right",
            pauseOnFocusLoss: false,
            autoClose: false,
        });

        try {
            const result = await createStockAction(stock.symbol);

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
            if (error instanceof Error) {
                console.error('Error adding stock:', error);
                toast.update(toastId, {
                    render: `Failed to add ${stock.symbol}: ${error.message || 'Unknown error'}`,
                    type: 'error',
                    autoClose: 3000,
                    isLoading: false
                });
            }
            toast.update(toastId, {
                render: `Failed to add ${stock.symbol}: ${error || 'Unknown error'}`,
                type: 'error',
                autoClose: 3000,
                isLoading: false
            });
        }

        setIsOpen(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    {!in_db ? (
                        <Button size="sm" variant="outline" className="h-8">
                            <PlusCircle className="h-4 w-4 mr-1"/> Add
                        </Button>) : (
                        <Button size="sm" variant="outline" className="h-8" disabled>
                            <CircleCheck className="h-4 w-4 mr-1"/> Added
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Stock to System</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to add {stock.symbol} ({stock.name}) to the system?
                            This will make it available for risk analysis and monitoring.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Symbol</p>
                            <p className="font-medium">{stock.symbol}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Risk Level</p>
                            <RiskBadge score={stock.risk_score}/>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Market Cap</p>
                            <p>{formatMarketCap(stock.marketCap)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">Price</p>
                            <p>${stock.price.toFixed(2)}</p>
                        </div>
                        {stock.exchange && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Exchange</p>
                                <p>{stock.exchange}</p>
                            </div>
                        )}
                        {stock.peRatio !== null && (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">P/E Ratio</p>
                                <p>{stock.peRatio.toFixed(2)}</p>
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

export default AddStockDialog;