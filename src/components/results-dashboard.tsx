import type { AnalyzeNewsArticleOutput } from '@/ai/flows/analyze-news-article';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScoreGauge } from '@/components/score-gauge';
import { AlertTriangle, BookCheck, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type ResultsDashboardProps = {
  result: AnalyzeNewsArticleOutput;
};

const getScoreInfo = (score: number) => {
  if (score > 0.7) {
    return {
      color: 'hsl(var(--accent))',
      textColor: 'text-accent',
      verdict: result.verdict || 'Likely True',
    };
  }
  if (score > 0.4) {
    return {
      color: 'hsl(var(--chart-4))',
      textColor: 'text-chart-4',
      verdict: result.verdict || 'Unverified',
    };
  }
  return {
    color: 'hsl(var(--destructive))',
    textColor: 'text-destructive',
    verdict: result.verdict || 'Likely False',
  };
};

export function ResultsDashboard({ result }: ResultsDashboardProps) {
  const scoreInfo = getScoreInfo(result.truthScore);

  return (
    <div className="animate-in fade-in-50 duration-500">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">{result.headline}</CardTitle>
          <CardDescription>Analysis Results</CardDescription>
        </CardHeader>
      </Card>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col items-center justify-center text-center shadow-md">
            <CardHeader>
                <CardTitle>Truth Probability Score</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <ScoreGauge score={result.truthScore} color={scoreInfo.color} />
                <h3 className={`text-3xl font-bold ${scoreInfo.textColor}`}>{scoreInfo.verdict}</h3>
            </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle>AI Explanation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{result.explanation}</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Suspicious Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            {result.redFlags && result.redFlags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {result.redFlags.map((flag, index) => (
                  <Badge key={index} variant="destructive">{flag}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No significant suspicious patterns detected.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex-row items-center gap-2 space-y-0">
            <BookCheck className="h-5 w-5 text-primary" />
            <CardTitle>Verification</CardTitle>
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
              <h4 className="font-semibold">Fact Check</h4>
              <p className="text-muted-foreground">{result.factCheck}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 text-center text-xs text-muted-foreground p-4 bg-card rounded-lg">
        <p><strong>Disclaimer:</strong> This AI analysis is for informational purposes only and is not a guarantee of truth. Always verify information through multiple official sources.</p>
      </div>
    </div>
  );
}
