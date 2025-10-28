'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleAnalysis, type FormState } from '@/app/actions';
import type { AnalyzeNewsArticleOutput } from '@/ai/flows/analyze-news-article';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const initialState: FormState = { errors: {} };

type AnalysisFormProps = {
  onAnalysisStart: (data: { headline: string; content: string }) => void;
  onAnalysisComplete: (data: AnalyzeNewsArticleOutput) => void;
  onAnalysisError: (message: string) => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full" size="lg">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Analyzing...' : 'Analyze Article'}
    </Button>
  );
}

export function AnalysisForm({ onAnalysisStart, onAnalysisComplete, onAnalysisError }: AnalysisFormProps) {
  const [state, formAction] = useActionState(handleAnalysis, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const prevDataRef = useRef<AnalyzeNewsArticleOutput | undefined>();

  useEffect(() => {
    if (state.data && state.data !== prevDataRef.current) {
      onAnalysisComplete(state.data);
      formRef.current?.reset();
      prevDataRef.current = state.data;
    }
    if (state.errors?._form) {
      onAnalysisError(state.errors._form.join(', '));
    }
    if (state.errors?.headline || state.errors?.content) {
      onAnalysisError(''); 
    }
  }, [state, onAnalysisComplete, onAnalysisError]);

  return (
    <Card className="bg-secondary/50 border-2">
      <CardContent className="p-6">
        <form
          ref={formRef}
          action={formData => {
            const headline = formData.get('headline') as string;
            const content = formData.get('content') as string;
            onAnalysisStart({ headline, content });
            formAction(formData);
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <Label htmlFor="headline" className="text-sm font-medium">Headline</Label>
              <Input id="headline" name="headline" placeholder="e.g., NASA Confirms Alien Skeleton Found on Mars" className="mt-2 bg-background/70" />
              {state.errors?.headline && <p className="text-sm font-medium text-destructive mt-2">{state.errors.headline[0]}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Article Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Paste the full content of the news article here..."
              className="min-h-[200px] mt-2 bg-background/70 textarea-scrollbar"
            />
            {state.errors?.content && <p className="text-sm font-medium text-destructive mt-2">{state.errors.content[0]}</p>}
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
