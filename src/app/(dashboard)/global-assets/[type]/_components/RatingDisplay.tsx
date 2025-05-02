// Rating component
import {JSX} from "react";

const RatingDisplay = ({rating}: { rating: string | null }): JSX.Element => {
    if (rating === null) {
        return <span className="text-gray-500">N/A</span>;
    }

    const parts = rating.split(" - ");
    const score = parts[0];
    const label = parts.length > 1 ? parts[1] : "";
    const numScore = parseFloat(score);

    let color: string;
    if (numScore <= 1.5) color = "text-green-600 font-semibold";
    else if (numScore <= 2.5) color = "text-green-500";
    else if (numScore <= 3.5) color = "text-yellow-500";
    else color = "text-red-500";

    return (
        <div className="flex flex-col">
            <span className={color}>{score}</span>
            <span className="text-xs text-gray-500">{label}</span>
        </div>
    );
};

export default RatingDisplay;