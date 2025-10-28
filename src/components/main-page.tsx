'use client';

import { useState, useRef, useEffect } from 'react';
import type { AnalyzeNewsArticleOutput } from '@/ai/flows/analyze-news-article';
import { useToast } from "@/hooks/use-toast";
import { AnalysisForm } from '@/components/analysis-form';
import { ResultsDashboard } from '@/components/results-dashboard';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanLine } from 'lucide-react';
import { ResultsSkeleton } from '@/components/results-skeleton';

export function MainPage() {
  const [result, setResult] = useState<AnalyzeNewsArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [headline, setHeadline] = useState<string>('');
  const { toast } = useToast();
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result && !isLoading) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result, isLoading]);


  const handleAnalysisStart = (data: { headline: string; content: string }) => {
    setHeadline(data.headline);
    setIsLoading(true);
    setError(null);
    setResult(null);
  };

  const handleAnalysisComplete = (data: AnalyzeNewsArticleOutput) => {
    setResult(data);
    setIsLoading(false);
    toast({
      title: "Analysis Complete",
      description: "The analysis of the article has been successfully completed.",
    });
  };

  const handleAnalysisError = (message: string) => {
    setError(message);
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Uncover the Truth</h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground sm:mt-4">
          Our AI-powered tool analyzes news articles for bias, credibility, and factual accuracy. Paste an article below to begin.
        </p>
      </div>

      <AnalysisForm
        onAnalysisStart={handleAnalysisStart}
        onAnalysisComplete={handleAnalysisComplete}
        onAnalysisError={handleAnalysisError}
      />

      <div ref={resultsRef} className="scroll-mt-20">
        {isLoading && <ResultsSkeleton />}
        
        {error && !isLoading && (
           <Card className="text-center border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Analysis Failed</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
          </Card>
        )}

        {result && !isLoading && <ResultsDashboard result={result} headline={headline} />}

        {!isLoading && !result && !error && (
          <Card className="border-dashed border-2 bg-transparent">
            <CardHeader className="text-center items-center p-8">
              <div className="mx-auto bg-secondary p-4 rounded-full w-fit">
                <ScanLine className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="mt-4 text-xl font-semibold">Ready to Analyze</CardTitle>
              <CardDescription className="mt-2">
                Your analysis results will appear here.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}
