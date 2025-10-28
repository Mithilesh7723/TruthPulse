'use client';

import { useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { handleAnalysis, type FormState } from '@/app/actions';
import type { AnalyzeNewsArticleOutput } from '@/ai/flows/analyze-news-article';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const initialState: FormState = { errors: {} };

type AnalysisFormProps = {
  onAnalysisStart: () => void;
  onAnalysisComplete: (data: AnalyzeNewsArticleOutput) => void;
  onAnalysisError: (message: string) => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Analyzing...' : 'Analyze Article'}
    </Button>
  );
}

export function AnalysisForm({ onAnalysisStart, onAnalysisComplete, onAnalysisError }: AnalysisFormProps) {
  const [state, formAction] = useActionState(handleAnalysis, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.data) {
      onAnalysisComplete(state.data);
      formRef.current?.reset();
    }
    if (state.errors?._form) {
      onAnalysisError(state.errors._form.join(', '));
    }
    // If there are validation errors, we also need to stop the loading state in parent.
    if(state.errors?.headline || state.errors?.content) {
        onAnalysisError(''); // Clear server error, but stop loading
    }
  }, [state, onAnalysisComplete, onAnalysisError]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyze News Article</CardTitle>
        <CardDescription>
          Enter the headline and content of a news article to check its authenticity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={formData => {
            onAnalysisStart();
            formAction(formData);
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="headline">Headline</Label>
            <Input id="headline" name="headline" placeholder="e.g., NASA Confirms Alien Skeleton Found on Mars" />
            {state.errors?.headline && <p className="text-sm font-medium text-destructive">{state.errors.headline[0]}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Article Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Paste the full content of the news article here..."
              className="min-h-[150px]"
            />
            {state.errors?.content && <p className="text-sm font-medium text-destructive">{state.errors.content[0]}</p>}
          </div>
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
