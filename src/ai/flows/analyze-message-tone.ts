'use server';

/**
 * @fileOverview Analyzes the tone of a drafted message and provides suggestions for improvement.
 *
 * - analyzeMessageTone - A function that analyzes the message tone and suggests adjustments.
 * - AnalyzeMessageToneInput - The input type for the analyzeMessageTone function.
 * - AnalyzeMessageToneOutput - The return type for the analyzeMessageTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMessageToneInputSchema = z.object({
  message: z.string().describe('The drafted message to analyze.'),
});
export type AnalyzeMessageToneInput = z.infer<typeof AnalyzeMessageToneInputSchema>;

const AnalyzeMessageToneOutputSchema = z.object({
  tone: z.string().describe('The overall tone of the message (e.g., positive, negative, neutral).'),
  suggestions: z.string().describe('Suggestions on how to adjust the message to be more positive and persuasive.'),
});
export type AnalyzeMessageToneOutput = z.infer<typeof AnalyzeMessageToneOutputSchema>;

export async function analyzeMessageTone(input: AnalyzeMessageToneInput): Promise<AnalyzeMessageToneOutput> {
  return analyzeMessageToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMessageTonePrompt',
  input: {schema: AnalyzeMessageToneInputSchema},
  output: {schema: AnalyzeMessageToneOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing the tone of sales messages and providing suggestions for improvement.

  Analyze the following message and provide feedback on its tone, as well as suggestions on how to make it more positive and persuasive.

  Message: {{{message}}}
  `,
});

const analyzeMessageToneFlow = ai.defineFlow(
  {
    name: 'analyzeMessageToneFlow',
    inputSchema: AnalyzeMessageToneInputSchema,
    outputSchema: AnalyzeMessageToneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
