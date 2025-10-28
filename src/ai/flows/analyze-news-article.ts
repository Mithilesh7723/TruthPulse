'use server';

/**
 * @fileOverview A news article analysis AI agent.
 *
 * - analyzeNewsArticle - A function that handles the news article analysis process.
 * - AnalyzeNewsArticleInput - The input type for the analyzeNewsArticle function.
 * - AnalyzeNewsArticleOutput - The return type for the analyzeNewsArticle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeNewsArticleInputSchema = z.object({
  headline: z.string().describe('The headline of the news article.'),
  content: z.string().describe('The content of the news article.'),
});
export type AnalyzeNewsArticleInput = z.infer<typeof AnalyzeNewsArticleInputSchema>;

const AnalyzeNewsArticleOutputSchema = z.object({
  truthScore: z
    .number()
    .describe(
      'A score between 0 and 1 indicating the likelihood that the article is accurate, with 1 being most accurate.'
    ),
  verdict: z
    .string()
    .describe(
      'A short verdict such as Likely True, Unverified, or Likely False, based on the truthScore.'
    ),
  redFlags: z.array(z.string()).describe('A list of suspicious patterns found in the article.'),
  sourceCredibility: z
    .number()
    .describe('A score between 0 and 1 indicating the credibility of the source.'),
  factCheck: z
    .string()
    .describe('A summary of fact-checking results from verified fact-check databases.'),
  explanation: z
    .string()
    .describe('An explanation of the AI analysis, including reasons for the truthScore.'),
});
export type AnalyzeNewsArticleOutput = z.infer<typeof AnalyzeNewsArticleOutputSchema>;

export async function analyzeNewsArticle(
  input: AnalyzeNewsArticleInput
): Promise<AnalyzeNewsArticleOutput> {
  return analyzeNewsArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeNewsArticlePrompt',
  input: {schema: AnalyzeNewsArticleInputSchema},
  output: {schema: AnalyzeNewsArticleOutputSchema},
  prompt: `You are an AI assistant designed to analyze news articles and determine their truthfulness.

Analyze the following news article and provide a truth score, verdict, red flags, source credibility, fact-check summary, and explanation.

Headline: {{{headline}}}
Content: {{{content}}}

Your analysis should be structured as follows:
- truthScore: A score between 0 and 1 indicating the likelihood that the article is accurate.
- verdict: A short verdict such as Likely True, Unverified, or Likely False, based on the truthScore.
- redFlags: A list of suspicious patterns found in the article, such as sensational wording or unverified sources.
- sourceCredibility: A score between 0 and 1 indicating the credibility of the source.
- factCheck: A summary of fact-checking results from verified fact-check databases.
- explanation: An explanation of the AI analysis, including reasons for the truthScore.

Output:
`,
});

const analyzeNewsArticleFlow = ai.defineFlow(
  {
    name: 'analyzeNewsArticleFlow',
    inputSchema: AnalyzeNewsArticleInputSchema,
    outputSchema: AnalyzeNewsArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
