'use server';

import { analyzeNewsArticle } from '@/ai/flows/analyze-news-article';
import { z } from 'zod';
import type { AnalyzeNewsArticleOutput } from '@/ai/flows/analyze-news-article';

const FormSchema = z.object({
  headline: z.string().min(5, { message: 'Headline must be at least 5 characters.' }),
  content: z.string().min(100, { message: 'Article content must be at least 100 characters.' }),
});

export type FormState = {
  data?: AnalyzeNewsArticleOutput;
  errors?: {
    headline?: string[];
    content?: string[];
    _form?: string[];
  };
};

export async function handleAnalysis(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = FormSchema.safeParse({
    headline: formData.get('headline'),
    content: formData.get('content'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await analyzeNewsArticle({
      headline: validatedFields.data.headline,
      content: validatedFields.data.content,
    });
    return { data: result };
  } catch (error) {
    console.error('Analysis Error:', error);
    return {
      errors: { _form: ['An unexpected error occurred during analysis. Please try again.'] },
    };
  }
}
