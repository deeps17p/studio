
'use server';

/**
 * @fileOverview AI agent to improve the clarity and impact of sales messages.
 *
 * - improveMessageClarity - A function that handles the message improvement process.
 * - ImproveMessageClarityInput - The input type for the improveMessageClarity function.
 * - ImproveMessageClarityOutput - The return type for the improveMessageClarity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveMessageClarityInputSchema = z.object({
  message: z.string().describe('The sales message to improve.'),
  productContext: z.string().optional().describe('The context of the product this message is about. This will be used to ensure the improved message is tailored to the product.'),
});
export type ImproveMessageClarityInput = z.infer<typeof ImproveMessageClarityInputSchema>;

const ImproveMessageClarityOutputSchema = z.object({
  improvedMessage: z.string().describe('The improved sales message.'),
  explanation: z.string().describe('Explanation of the changes made.'),
});
export type ImproveMessageClarityOutput = z.infer<typeof ImproveMessageClarityOutputSchema>;

export async function improveMessageClarity(input: ImproveMessageClarityInput): Promise<ImproveMessageClarityOutput> {
  return improveMessageClarityFlow(input);
}

const improveMessageClarityPrompt = ai.definePrompt({
  name: 'improveMessageClarityPrompt',
  input: {schema: ImproveMessageClarityInputSchema},
  output: {schema: ImproveMessageClarityOutputSchema},
  prompt: `You are an AI-powered writing assistant specializing in sales communication.

You will receive a sales message and provide an improved version that is clearer, more impactful, and persuasive.
{{#if productContext}}
You MUST tailor your improvements to the following product context:
Product Context: {{{productContext}}}
{{/if}}

Explain the changes you made and why they enhance the message's effectiveness.

Original Message: {{{message}}}`,
});

const improveMessageClarityFlow = ai.defineFlow(
  {
    name: 'improveMessageClarityFlow',
    inputSchema: ImproveMessageClarityInputSchema,
    outputSchema: ImproveMessageClarityOutputSchema,
  },
  async input => {
    const {output} = await improveMessageClarityPrompt(input);
    return output!;
  }
);
