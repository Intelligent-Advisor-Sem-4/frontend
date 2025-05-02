import {Badge} from "@/components/ui/badge";
import {CheckCircle, Clock, AlertCircle, Ban} from "lucide-react";
import {AssetStatus} from "@/app/(dashboard)/assets/[symbol]/_utils/definitions";

type StatusBadgeProps = {
    status?: AssetStatus | null;
    showIcon?: boolean;
    showLabel?: boolean;
};

const StatusBadge = ({
                         status,
                         showIcon = true,
                         showLabel = true
                     }: StatusBadgeProps) => {
    // Handle undefined or null status
    if (status === undefined || status === null) {
        return (
            <Badge variant="outline"
                   className="flex items-center bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {showIcon && <Clock className="w-4 h-4 mr-1"/>}
                {showLabel ? "Unknown" : ""}
            </Badge>
        );
    }

    // Define style configurations based on status
    let badgeStyle: string;
    let StatusIcon;

    switch (status) {
        case 'Active':
            badgeStyle = "bg-green-500 text-white dark:bg-green-900 dark:text-green-300";
            StatusIcon = CheckCircle;
            break;
        case 'Pending':
            badgeStyle = "bg-blue-500 text-white dark:bg-blue-900 dark:text-blue-300";
            StatusIcon = Clock;
            break;
        case 'Warning':
            badgeStyle = "bg-yellow-500 text-white dark:bg-yellow-900 dark:text-yellow-300";
            StatusIcon = AlertCircle;
            break;
        case 'BlackList':
            badgeStyle = "bg-red-500 text-white dark:bg-red-900 dark:text-red-300";
            StatusIcon = Ban;
            break;
        default:
            badgeStyle = "bg-gray-500 text-white dark:bg-gray-900 dark:text-gray-300";
            StatusIcon = Clock;
    }

    return (
        <Badge className={`flex items-center ${badgeStyle}`}>
            {showIcon && <StatusIcon className="w-4 h-4 mr-1"/>}
            {showLabel ? status : ""}
        </Badge>
    );
};

export default StatusBadge;