'use server';

/**
 * @fileOverview Assesses the credibility of a news source.
 *
 * - assessSourceCredibility - A function that assesses the credibility of a news source.
 * - AssessSourceCredibilityInput - The input type for the assessSourceCredibility function.
 * - AssessSourceCredibilityOutput - The return type for the assessSourceCredibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessSourceCredibilityInputSchema = z.object({
  sourceName: z.string().describe('The name of the news source to assess.'),
});
export type AssessSourceCredibilityInput = z.infer<typeof AssessSourceCredibilityInputSchema>;

const AssessSourceCredibilityOutputSchema = z.object({
  credibilityScore: z.number().describe('A score representing the credibility of the source (0-1).'),
  reliabilityVerdict: z.string().describe('A short verdict on the reliability of the source.'),
  factors: z.array(z.string()).describe('Factors influencing the credibility assessment.'),
});
export type AssessSourceCredibilityOutput = z.infer<typeof AssessSourceCredibilityOutputSchema>;

export async function assessSourceCredibility(input: AssessSourceCredibilityInput): Promise<AssessSourceCredibilityOutput> {
  return assessSourceCredibilityFlow(input);
}

const assessSourceCredibilityPrompt = ai.definePrompt({
  name: 'assessSourceCredibilityPrompt',
  input: {schema: AssessSourceCredibilityInputSchema},
  output: {schema: AssessSourceCredibilityOutputSchema},
  prompt: `You are an AI assistant that assesses the credibility of news sources.

  Input:
  Source Name: {{{sourceName}}}

  Instructions:
  1. Research the news source using available domain reputation databases and historical accuracy records.
  2. Evaluate the source's transparency, fact-checking practices, and potential biases.
  3. Based on your findings, assign a credibility score between 0 and 1, where 0 indicates very low credibility and 1 indicates very high credibility.
  4. Provide a reliability verdict (e.g., "Highly Reliable", "Generally Reliable", "Mixed", "Unreliable").
  5. List the factors that influenced your assessment (e.g., "Strong fact-checking", "History of bias", "Lack of transparency").

  Output:
  Follow the schema to generate the output in a structured format.
  `,
});

const assessSourceCredibilityFlow = ai.defineFlow(
  {
    name: 'assessSourceCredibilityFlow',
    inputSchema: AssessSourceCredibilityInputSchema,
    outputSchema: AssessSourceCredibilityOutputSchema,
  },
  async input => {
    const {output} = await assessSourceCredibilityPrompt(input);
    return output!;
  }
);
