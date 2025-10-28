'use server';

/**
 * @fileOverview A content integrity assessment AI agent.
 *
 * - assessContentIntegrity - A function that handles the content integrity assessment process.
 * - AssessContentIntegrityInput - The input type for the assessContentIntegrity function.
 * - AssessContentIntegrityOutput - The return type for the assessContentIntegrity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessContentIntegrityInputSchema = z.object({
  headline: z.string().describe('The headline of the news article.'),
  content: z.string().describe('The content of the news article.'),
});
export type AssessContentIntegrityInput = z.infer<typeof AssessContentIntegrityInputSchema>;

const AssessContentIntegrityOutputSchema = z.object({
  clickbaitScore: z.number().describe('A score indicating the likelihood of clickbait content.'),
  emotionalExaggerationScore: z.number().describe('A score indicating the level of emotional exaggeration in the text.'),
  semanticIncoherenceScore: z.number().describe('A score indicating the degree of semantic incoherence within the content.'),
  redFlags: z.array(z.string()).describe('An array of red flags identified in the content.'),
});
export type AssessContentIntegrityOutput = z.infer<typeof AssessContentIntegrityOutputSchema>;

export async function assessContentIntegrity(input: AssessContentIntegrityInput): Promise<AssessContentIntegrityOutput> {
  return assessContentIntegrityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessContentIntegrityPrompt',
  input: {schema: AssessContentIntegrityInputSchema},
  output: {schema: AssessContentIntegrityOutputSchema},
  prompt: `You are an expert content integrity analyst. Your task is to analyze the given news article headline and content for clickbait, emotional exaggeration, and semantic incoherence.

  Headline: {{{headline}}}
  Content: {{{content}}}

  Assess the content and provide the following scores and red flags:

  - clickbaitScore: A score (0-1) indicating the likelihood of clickbait content. Consider sensationalism, misleading information, or overly hyped claims.
  - emotionalExaggerationScore: A score (0-1) indicating the level of emotional exaggeration in the text. Consider the use of strong emotional language, hyperbole, or biased sentiment.
  - semanticIncoherenceScore: A score (0-1) indicating the degree of semantic incoherence within the content. Consider contradictions, logical fallacies, or inconsistencies in the information presented.
  - redFlags: An array of specific red flags identified in the content. Examples include "Sensational wording", "Unverified source", "Logical fallacies", "Emotional manipulation", etc.

  Ensure that the scores and red flags are relevant and justified based on the content provided.
  Output should be valid JSON.
  `,
});

const assessContentIntegrityFlow = ai.defineFlow(
  {
    name: 'assessContentIntegrityFlow',
    inputSchema: AssessContentIntegrityInputSchema,
    outputSchema: AssessContentIntegrityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
