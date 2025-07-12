'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating sales message templates
 * contextualized to a specific product description. It includes the input and output
 * schemas, the flow definition, and a wrapper function for easy invocation.
 *
 * - generateSalesTemplate - A function that generates sales message templates.
 * - GenerateSalesTemplateInput - The input type for the generateSalesTemplate function.
 * - GenerateSalesTemplateOutput - The return type for the generateSalesTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSalesTemplateInputSchema = z.object({
  productDescription: z
    .string()
    .describe(
      'A detailed description of the product for which the sales message template is being generated.'
    ),
  messageType: z
    .enum(['email', 'WhatsApp', 'text message'])
    .describe('The type of sales message template to generate.'),
  scenario: z
    .string()
    .describe(
      'The specific sales scenario or context for the template (e.g., initial contact, follow-up, special offer).' // Corrected typo
    ),
});
export type GenerateSalesTemplateInput = z.infer<typeof GenerateSalesTemplateInputSchema>;

const GenerateSalesTemplateOutputSchema = z.object({
  template: z.string().describe('The generated sales message template.'),
});
export type GenerateSalesTemplateOutput = z.infer<typeof GenerateSalesTemplateOutputSchema>;

export async function generateSalesTemplate(
  input: GenerateSalesTemplateInput
): Promise<GenerateSalesTemplateOutput> {
  return generateSalesTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSalesTemplatePrompt',
  input: {schema: GenerateSalesTemplateInputSchema},
  output: {schema: GenerateSalesTemplateOutputSchema},
  prompt: `You are an expert sales copywriter. Generate a sales message template for the following:

Product Description: {{{productDescription}}}
Message Type: {{{messageType}}}
Scenario: {{{scenario}}}

Template:`, // Keep the casing consistent
});

const generateSalesTemplateFlow = ai.defineFlow(
  {
    name: 'generateSalesTemplateFlow',
    inputSchema: GenerateSalesTemplateInputSchema,
    outputSchema: GenerateSalesTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
