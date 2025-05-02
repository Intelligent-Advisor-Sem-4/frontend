import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {Info} from "lucide-react"

export function RiskScoreTooltip() {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-primary cursor-pointer"/>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm text-sm leading-snug bg-popover text-popover-foreground">
                    <p>
                        Risk score is calculated on a 0–10 scale (10 = highest risk), based on available financial
                        metrics:
                    </p>
                    <ul className="list-disc pl-4 mt-1 space-y-0.5">
                        <li><strong>Market Cap:</strong> Smaller companies are riskier.</li>
                        <li><strong>52-week High/Low:</strong> Large price swings increase risk.</li>
                        <li><strong>P/E Ratio:</strong> Negative or very high values signal valuation risk.</li>
                        <li><strong>EPS:</strong> Negative or low earnings increase risk, especially in large caps.</li>
                        <li><strong>Debt-to-Equity:</strong> Higher debt levels raise risk.</li>
                        <li><strong>Beta:</strong> High beta means more market volatility.</li>
                    </ul>
                    <p className="mt-1">Handles missing data gracefully and normalizes the score to a 0–10 scale.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
