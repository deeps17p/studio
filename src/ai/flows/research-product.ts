
'use server';

/**
 * @fileOverview This file defines a Genkit flow for researching a product
 * based on its name and generating a concise description.
 *
 * - researchProduct - A function that researches a product and returns its description.
 * - ResearchProductInput - The input type for the researchProduct function.
 * - ResearchProductOutput - The return type for the researchProduct function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResearchProductInputSchema = z.object({
  productName: z
    .string()
    .describe('The name of the product to research.'),
});
export type ResearchProductInput = z.infer<typeof ResearchProductInputSchema>;

const ResearchProductOutputSchema = z.object({
  productDescription: z
    .string()
    .describe('A concise and effective description of the product, suitable for use in sales messaging.'),
});
export type ResearchProductOutput = z.infer<typeof ResearchProductOutputSchema>;

export async function researchProduct(input: ResearchProductInput): Promise<ResearchProductOutput> {
  return researchProductFlow(input);
}

const prompt = ai.definePrompt({
  name: 'researchProductPrompt',
  input: {schema: ResearchProductInputSchema},
  output: {schema: ResearchProductOutputSchema},
  prompt: `You are an expert market researcher and product analyst. Your task is to research the given product name and generate a concise, compelling, and accurate description.

Focus on the product's core value proposition, its target audience, and what makes it unique. The description should be optimized for use in a sales context.

Product Name: {{{productName}}}

Generate the product description.
`,
});

const researchProductFlow = ai.defineFlow(
  {
    name: 'researchProductFlow',
    inputSchema: ResearchProductInputSchema,
    outputSchema: ResearchProductOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
