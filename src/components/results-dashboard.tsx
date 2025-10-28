import type { AnalyzeNewsArticleOutput } from '@/ai/flows/analyze-news-article';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreGauge } from '@/components/score-gauge';
import { AlertTriangle, BookCheck, Bot, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type ResultsDashboardProps = {
  result: AnalyzeNewsArticleOutput;
  headline: string;
};

const getScoreInfo = (score: number, verdict: string) => {
  if (score > 0.7) {
    return {
      color: 'hsl(var(--chart-2))',
      textColor: 'text-green-400',
      verdict: verdict || 'Likely True',
    };
  }
  if (score > 0.4) {
    return {
      color: 'hsl(var(--chart-4))',
      textColor: 'text-yellow-400',
      verdict: verdict || 'Unverified',
    };
  }
  return {
    color: 'hsl(var(--destructive))',
    textColor: 'text-red-500',
    verdict: verdict || 'Likely False',
  };
};

export function ResultsDashboard({ result, headline }: ResultsDashboardProps) {
  const scoreInfo = getScoreInfo(result.truthScore, result.verdict);

  return (
    <div className="animate-in fade-in-50 duration-500 space-y-8">
      <Card className="text-center shadow-lg bg-secondary/30">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">{headline}</CardTitle>
          <CardDescription>Analysis Results</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center text-center shadow-md lg:col-span-1 bg-secondary/30">
            <CardHeader>
                <CardTitle>Truth Probability</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <ScoreGauge score={result.truthScore} color={scoreInfo.color} />
                <h3 className={`text-3xl font-bold ${scoreInfo.textColor}`}>{scoreInfo.verdict}</h3>
            </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-md bg-secondary/30">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle>AI Explanation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{result.explanation}</p>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-secondary/30">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <AlertTriangle className="h-6 w-6 text-yellow-400" />
              <CardTitle>Red Flags</CardTitle>
            </CardHeader>
            <CardContent>
              {result.redFlags && result.redFlags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {result.redFlags.map((flag, index) => (
                    <Badge key={index} variant="destructive" className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">{flag}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No significant red flags detected.</p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md bg-secondary/30">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <BookCheck className="h-6 w-6 text-primary" />
              <CardTitle>Verification Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold">Source Credibility</h4>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground">Score: <span className="font-bold text-foreground">{(result.sourceCredibility * 100).toFixed(0)}%</span></p>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold">Fact-Check Summary</h4>
                <p className="text-muted-foreground">{result.factCheck}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground p-4 bg-secondary/20 rounded-lg">
        <p><strong>Disclaimer:</strong> This AI analysis is for informational purposes only and is not a guarantee of truth. Always verify information through multiple official sources.</p>
      </div>
    </div>
  );
}
