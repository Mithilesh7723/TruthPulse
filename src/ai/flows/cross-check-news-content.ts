'use server';

/**
 * @fileOverview A flow to cross-check news content against trusted APIs to validate key entities and claims.
 *
 * - crossCheckNewsContent - A function that handles the news content cross-checking process.
 * - CrossCheckNewsContentInput - The input type for the crossCheckNewsContent function.
 * - CrossCheckNewsContentOutput - The return type for the crossCheckNewsContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrossCheckNewsContentInputSchema = z.object({
  headline: z.string().describe('The headline of the news article.'),
  content: z.string().describe('The main content of the news article.'),
});
export type CrossCheckNewsContentInput = z.infer<
  typeof CrossCheckNewsContentInputSchema
>;

const CrossCheckNewsContentOutputSchema = z.object({
  factCheckResult: z
    .string() // Changed to string to hold the LLM's assessment
    .describe(
      'An assessment of the factual accuracy of the news content based on cross-checking with trusted APIs.'
    ),
  redFlags: z.array(z.string()).describe(
    'A list of potential red flags identified in the content, such as sensational wording or unverified sources.'
  ),
  confidenceLevel: z.number().describe(
    'A confidence level (0-1) indicating the reliability of the fact-checking result.'
  ),
});
export type CrossCheckNewsContentOutput = z.infer<
  typeof CrossCheckNewsContentOutputSchema
>;

export async function crossCheckNewsContent(
  input: CrossCheckNewsContentInput
): Promise<CrossCheckNewsContentOutput> {
  return crossCheckNewsContentFlow(input);
}

const crossCheckNewsContentPrompt = ai.definePrompt({
  name: 'crossCheckNewsContentPrompt',
  input: {schema: CrossCheckNewsContentInputSchema},
  output: {schema: CrossCheckNewsContentOutputSchema},
  prompt: `You are an AI assistant specializing in fact-checking news articles.

  Your task is to analyze the provided news article headline and content, cross-referencing it with trusted APIs and databases like Wikidata and FactCheck.org to validate key entities, claims, and sources.

  Identify any potential red flags, such as sensational wording, unverified sources, or inconsistencies with established facts.

  Based on your analysis, provide an assessment of the factual accuracy of the news content, a list of identified red flags, and a confidence level indicating the reliability of your assessment.

  Headline: {{{headline}}}
  Content: {{{content}}}

  Format your response as a JSON object with the following keys:
  - factCheckResult: An assessment of the factual accuracy of the news content.
  - redFlags: A list of potential red flags identified in the content.
  - confidenceLevel: A confidence level (0-1) indicating the reliability of the fact-checking result.
  `,
});

const crossCheckNewsContentFlow = ai.defineFlow(
  {
    name: 'crossCheckNewsContentFlow',
    inputSchema: CrossCheckNewsContentInputSchema,
    outputSchema: CrossCheckNewsContentOutputSchema,
  },
  async input => {
    const {output} = await crossCheckNewsContentPrompt(input);
    return output!;
  }
);
