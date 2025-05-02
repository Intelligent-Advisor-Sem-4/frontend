import {AlertTriangle, CheckCircle2, HelpCircle, ShieldAlert} from "lucide-react";
import {Badge} from "@/components/ui/badge";

type RiskBadgeProps = {
    score?: number | null;
    showIcon?: boolean;
    showValue?: boolean;
    showLabel?: boolean;
};

const RiskBadge = ({
                       score,
                       showIcon = true,
                       showValue = true,
                       showLabel = true
                   }: RiskBadgeProps) => {
    // Handle undefined, null, or NaN score
    if (score === undefined || score === null || isNaN(score)) {
        return (
            <Badge variant="outline"
                   className="flex items-center bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">
                {showIcon && <HelpCircle className="w-4 h-4 mr-1"/>}
                Risk{showLabel ? ": Undefined" : ""}
            </Badge>
        );
    }

    let riskLevel: 'Low' | 'Medium' | 'High';

    // Determine risk level based on score
    switch (true) {
        case score >= 7:
            riskLevel = 'High';
            break;
        case score >= 4:
            riskLevel = 'Medium';
            break;
        default:
            riskLevel = 'Low';
    }

    // Define style configurations based on risk level
    let badgeStyle: string;
    let RiskIcon;

    switch (riskLevel) {
        case 'High':
            badgeStyle = "bg-red-500 text-white dark:bg-red-900 dark:text-red-300";
            RiskIcon = ShieldAlert;
            break;
        case 'Medium':
            badgeStyle = "bg-yellow-500 text-white dark:bg-yellow-900 dark:text-yellow-300";
            RiskIcon = AlertTriangle;
            break;
        case 'Low':
            badgeStyle = "bg-green-500 text-white dark:bg-green-900 dark:text-green-300";
            RiskIcon = CheckCircle2;
            break;
    }

    return (
        <Badge className={`flex items-center ${badgeStyle}`}>
            {showIcon && <RiskIcon className="w-4 h-4 mr-1"/> }
            {showLabel ? ` ${riskLevel}` : ""}{showValue ? ` (${score.toFixed(1)})` : ""}
        </Badge>
    );
};

export default RiskBadge;