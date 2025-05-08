import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OptimizedPortfolioResult } from "@/lib/types/profile";
import { Sparkles } from "lucide-react";
import Markdown from "react-markdown";
import { getPortfolioExplanation } from "@/actions/profile";
import GeminiLogo from "@/app/(dashboard)/assets/[symbol]/_components/GeminiLogo"

interface PortfolioExplanationProps {
  portfolioData: OptimizedPortfolioResult;
}

interface ShapContribution {
  stock: string;
  weight: number;
  contribution_to_return: number;
  shap_value: number;
  percentage_contribution: number;
}

interface ExplanationResponse {
  explanation: string;
  shap_explanation: ShapContribution[];
  shap_plot_base64: string;
}

export default function PortfolioExplanation({ portfolioData }: PortfolioExplanationProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<ExplanationResponse | null>(null);

  const fetchExplanation = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getPortfolioExplanation(portfolioData);

      if (!response.success) {
        throw new Error(response.error || "Unknown error");
      }

      setExplanation(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch explanation");
      console.error("Error fetching portfolio explanation:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExplanation();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-2xl font-bold">
        <Sparkles className="h-6 w-6 color-blue" />
          Explanation
          <div><GeminiLogo className="h-4 w-4" /></div>
          
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex flex-col items-center justify-center space-y-4 ">
            <div className="text-lg font-medium">thinking...</div>
            <div className="typing-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}

        {error && (
          <div className="text-destructive p-4 text-center">
            <p>Error loading analysis: {error}</p>
            <Button variant="outline" onClick={fetchExplanation} className="mt-2">
              Try Again
            </Button>
          </div>
        )}

        {explanation && (
          <div className="space-y-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{explanation.explanation}</Markdown>
            </div>

            {explanation.shap_explanation?.length > 0 && (
              <div>
                <p className="font-medium mb-2">Stock Contributions Breakdown</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {explanation.shap_explanation.map((item, index) => (
                    <div key={index} className="rounded-lg border p-3 shadow-sm">
                      <p className="font-semibold text-lg">{item.stock}</p>
                      <p>Weight: {(item.weight * 100).toFixed(2)}%</p>
                      <p>Contribution to Return: ${(item.contribution_to_return).toFixed(2)}</p>
                      <p>SHAP Value: {item.shap_value.toFixed(4)}</p>
                      <p>Contribution %: {item.percentage_contribution.toFixed(2)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {explanation.shap_plot_base64 && (
              <div className="mt-4">
                <p className="font-medium mb-2">Visual Contribution Analysis</p>
                <div className="flex justify-center">
                  <img
                    src={`data:image/png;base64,${explanation.shap_plot_base64}`}
                    alt="Stock Contribution Visualization"
                    className="max-w-md w-full h-auto rounded-md border"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}