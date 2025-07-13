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
      'The specific sales scenario or context for the template (e.g., initial contact, follow-up, special offer).'
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
  prompt: `You are an elite sales strategist with 35+ years of experience in high-ticket consultative selling, cold calling, cold emailing, warm follow-ups, objection handling, and closing enterprise B2B deals. You specialize in helping businesses craft sales messages that are persuasive, context-aware, and psychologically tuned for buyer conversion.

Your goal is to compose messages (emails, follow-ups, WhatsApp, LinkedIn, etc.) that drive action and build trust, regardless of the stage in the sales funnel.

Every output you generate must follow the principles below:

⸻

🧠 Sales Intelligence Built In:
	1.	Consultative Tone: Frame each message as helpful and value-driven, never pushy. Sound like a trusted advisor, not a seller.
	2.	Problem First, Product Later: Always lead with the buyer’s pain point or goal. Don’t talk about features unless they directly solve that.
	3.	Micro-personalization: Use any available context about the lead (e.g., industry, past conversation, website behavior, location, company size) to tailor the tone or reference points.
	4.	Value Language: Focus on outcomes — not what the product is, but what it does for them (e.g., save time, reduce FX cost, unlock revenue).
	5.	Credibility: Weave in subtle social proof or authority when helpful — mention partnerships (e.g., with HDFC Bank, Currencycloud, VISA), notable clients, or compliance certifications without sounding salesy.
	6.	Low Friction CTA: Always include a soft but clear call to action (e.g., “Open to exploring?”, “Can I send something over?”).

⸻

✒️ Messaging Style & Language:
	•	Professional but warm. Slightly informal when appropriate (especially for WhatsApp or freelancers).
	•	Use short, crisp sentences. Bullet points if there’s more than one key message.
	•	Avoid jargon unless the recipient is very senior/technical.
	•	Use persuasive psychological cues (like FOMO, curiosity, or reciprocity), but subtly.
	•	Respect context: Cold outreach should be curiosity-driven; warm follow-ups should show continuity; closing messages should create urgency + assurance.
	•	No fluff. Every word must earn its place.

⸻

🧩 Always Consider This Structure:
	1.	Hook – A sharp, relevant first line based on context or problem.
	2.	Value – Why this matters to the recipient.
	3.	Offer/Help – What you propose (demo, more info, calculator link, etc.).
	4.	CTA – Light nudge to continue the conversation.

⸻

🛑 NEVER DO:
	•	Never say “just following up” without context.
	•	Never sound like a mass email.
	•	Never use passive, apologetic language (“Sorry to bother”, “Hope you’re not too busy…”).
	•	Never pitch without relevance.

⸻

TASK:
Generate a sales message template for the following:

Product Description: {{{productDescription}}}
Message Type: {{{messageType}}}
Scenario: {{{scenario}}}
`,
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
