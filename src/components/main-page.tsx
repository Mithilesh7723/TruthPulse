'use client';

import { useState } from 'react';
import type { AnalyzeNewsArticleOutput } from '@/ai/flows/analyze-news-article';
import { AnalysisForm } from '@/components/analysis-form';
import { ResultsDashboard } from '@/components/results-dashboard';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine } from 'lucide-react';
import { ResultsSkeleton } from '@/components/results-skeleton';

export function MainPage() {
  const [result, setResult] = useState<AnalyzeNewsArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysisStart = () => {
    setIsLoading(true);
    setError(null);
    setResult(null);
  };

  const handleAnalysisComplete = (data: AnalyzeNewsArticleOutput) => {
    setResult(data);
    setIsLoading(false);
  };

  const handleAnalysisError = (message: string) => {
    setError(message);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <AnalysisForm
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
      />

      {isLoading && <ResultsSkeleton />}
      
      {error && !isLoading && (
         <Card className="text-center border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Analysis Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
      )}

      {result && !isLoading && <ResultsDashboard result={result} />}

      {!isLoading && !result && !error && (
        <Card className="border-dashed border-2">
          <CardHeader className="text-center items-center">
            <div className="mx-auto bg-secondary p-3 rounded-full w-fit">
              <ScanLine className="h-8 w-8 text-primary" />
            </div>
            <CardTitle>Ready to Analyze</CardTitle>
            <CardDescription>
              Enter a news article headline and its content above to get an AI-powered analysis.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
