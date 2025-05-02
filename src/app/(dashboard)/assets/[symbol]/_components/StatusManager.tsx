"use client";

import {deleteStockAction} from "../_utils/actions";
import {useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Button} from "@/components/ui/button";
import {Trash2, BadgeCheck, Clock, AlertTriangle, Ban} from "lucide-react";
import {toast} from "react-toastify";
import {updateStockStatusAction} from "../_utils/actions"; // Import the server action
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Asset, AssetStatus} from "@/app/(dashboard)/assets/[symbol]/_utils/definitions";

const statusOptions = [
    {value: "Active", label: "Active", icon: <BadgeCheck className="h-4 w-4 text-green-600 dark:text-green-400"/>},
    {value: "Pending", label: "Pending", icon: <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400"/>},
    {
        value: "Warning",
        label: "Warning",
        icon: <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400"/>
    },
    {value: "BlackList", label: "BlackList", icon: <Ban className="h-4 w-4 text-red-600 dark:text-red-400"/>},
];

const StatusManager = ({
                           asset,
                       }: {
    asset: Asset;
}) => {
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (status: AssetStatus) => {
        if (!asset.db?.asset_id) {
            toast.error("Cannot update status: Asset ID is missing");
            return;
        }

        // Show loading toast
        const toastId = toast.loading(`Updating ${asset.ticker} status to ${status}...`, {
            position: "bottom-right",
            pauseOnFocusLoss: false,
            autoClose: false,
        });

        setLoading(true);

        try {
            // Call the server action to update status
            const result = await updateStockStatusAction(asset.db.asset_id, status);

            if (result.success) {
                // Update toast on success
                toast.update(toastId, {
                    render: result.message,
                    type: "success",
                    autoClose: 2000,
                    isLoading: false
                });
            } else {
                // Update toast on error
                toast.update(toastId, {
                    render: result.message,
                    type: "error",
                    autoClose: 3000,
                    isLoading: false
                });
            }
        } catch (error) {
            // Handle unexpected errors
            console.error('Error updating stock status:', error);

            toast.update(toastId, {
                render: `Failed to update ${asset.ticker} status: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: "error",
                autoClose: 3000,
                isLoading: false
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!asset.db?.asset_id) {
            toast.error("Cannot update status: Asset ID is missing");
            return;
        }

        // Show loading toast
        const toastId = toast.loading(`Removing ${asset.ticker} from database...`, {
            position: "bottom-right",
            pauseOnFocusLoss: false,
            autoClose: false,
        });

        setLoading(true);

        try {
            // Implement your remove stock action here
            const result = await deleteStockAction(asset.db.asset_id);

            if (result.success) {
                toast.update(toastId, {
                    render: `${asset.ticker} removed successfully`,
                    type: "success",
                    autoClose: 2000,
                    isLoading: false
                });
            } else {
                toast.update(toastId, {
                    render: `Failed to remove ${asset.ticker}`,
                    type: "error",
                    autoClose: 3000,
                    isLoading: false
                });
            }
        } catch (error) {
            console.error('Error removing stock:', error);

            toast.update(toastId, {
                render: `Failed to remove ${asset.ticker}: ${error instanceof Error ? error.message : 'Unknown error'}`,
                type: "error",
                autoClose: 3000,
                isLoading: false
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Select
                disabled={loading}
                onValueChange={(value) => handleStatusChange(value as AssetStatus)}
                defaultValue={asset.db?.status || undefined}
            >
                <SelectTrigger className="w-full sm:w-48 border-gray-300 dark:border-gray-600">
                    <SelectValue placeholder="Change Status"/>
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map(({value, label, icon}) => (
                        <SelectItem
                            key={value}
                            value={value}
                            className="flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            {icon}
                            {label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4"/> Remove from DB
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove <span className="font-medium">{asset.ticker}</span> from the
                            database? This action is irreversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2">
                        <DialogClose disabled={loading}>
                            Cancel
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleRemove}
                            disabled={loading}
                        >
                            Yes, Remove
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default StatusManager;