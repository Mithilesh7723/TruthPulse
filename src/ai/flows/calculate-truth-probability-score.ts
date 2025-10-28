'use server';
/**
 * @fileOverview Calculates and displays a Truth Probability Score (%) based on multi-layered evidence from AI and real-time verification.
 *
 * - calculateTruthProbabilityScore - A function that handles the calculation of the truth probability score.
 * - CalculateTruthProbabilityScoreInput - The input type for the calculateTruthProbabilityScore function.
 * - CalculateTruthProbabilityScoreOutput - The return type for the calculateTruthProbabilityScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateTruthProbabilityScoreInputSchema = z.object({
  contentAnalysisScore: z.number().describe('The score from the content analysis, ranging from 0 to 1.'),
  factVerificationScore: z.number().describe('The score from the fact verification, ranging from 0 to 1.'),
  sourceCredibilityScore: z.number().describe('The score from the source credibility assessment, ranging from 0 to 1.'),
});
export type CalculateTruthProbabilityScoreInput = z.infer<typeof CalculateTruthProbabilityScoreInputSchema>;

const CalculateTruthProbabilityScoreOutputSchema = z.object({
  truthProbabilityScore: z
    .number()
    .describe('The calculated truth probability score, ranging from 0 to 100.'),
});
export type CalculateTruthProbabilityScoreOutput = z.infer<typeof CalculateTruthProbabilityScoreOutputSchema>;

export async function calculateTruthProbabilityScore(
  input: CalculateTruthProbabilityScoreInput
): Promise<CalculateTruthProbabilityScoreOutput> {
  return calculateTruthProbabilityScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateTruthProbabilityScorePrompt',
  input: {schema: CalculateTruthProbabilityScoreInputSchema},
  output: {schema: CalculateTruthProbabilityScoreOutputSchema},
  prompt: `Given the following scores from different verification layers, calculate the overall truth probability score as a percentage. The score must be between 0 and 100.

Content Analysis Score: {{contentAnalysisScore}}
Fact Verification Score: {{factVerificationScore}}
Source Credibility Score: {{sourceCredibilityScore}}

Consider that each score contributes equally to the overall truth probability.`,
});

const calculateTruthProbabilityScoreFlow = ai.defineFlow(
  {
    name: 'calculateTruthProbabilityScoreFlow',
    inputSchema: CalculateTruthProbabilityScoreInputSchema,
    outputSchema: CalculateTruthProbabilityScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    const truthProbabilityScore = Math.max(0, Math.min(100, (
      input.contentAnalysisScore + input.factVerificationScore + input.sourceCredibilityScore
    ) / 3 * 100));
    return {truthProbabilityScore: truthProbabilityScore}};
);
