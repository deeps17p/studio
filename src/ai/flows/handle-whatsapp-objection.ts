
'use server';

/**
 * @fileOverview This file defines a Genkit flow for handling objections in a WhatsApp
 * conversation. It takes a conversation thread and user context to generate a
 * suitable reply.
 *
 * - handleWhatsappObjection - A function that generates a reply to a sales objection.
 * - HandleWhatsappObjectionInput - The input type for the function.
 * - HandleWhatsappObjectionOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HandleWhatsappObjectionInputSchema = z.object({
  conversationThread: z
    .string()
    .describe('The entire WhatsApp conversation thread up to this point.'),
  context: z
    .string()
    .describe(
      'The context or goal for the reply (e.g., "overcome price objection", "reiterate value", "book a meeting").'
    ),
  productContext: z.string().optional().describe('The context of the product this message is about. This will be used to ensure the analysis is tailored to the product.'),
});
export type HandleWhatsappObjectionInput = z.infer<typeof HandleWhatsappObjectionInputSchema>;

const HandleWhatsappObjectionOutputSchema = z.object({
  suggestedReply: z.string().describe('The AI-generated reply to send to the prospect.'),
});
export type HandleWhatsappObjectionOutput = z.infer<typeof HandleWhatsappObjectionOutputSchema>;

export async function handleWhatsappObjection(
  input: HandleWhatsappObjectionInput
): Promise<HandleWhatsappObjectionOutput> {
  return handleWhatsappObjectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'handleWhatsappObjectionPrompt',
  input: {schema: HandleWhatsappObjectionInputSchema},
  output: {schema: HandleWhatsappObjectionOutputSchema},
  prompt: `You are a world-class sales coach specializing in handling objections in real-time text conversations (like WhatsApp). Your task is to help a salesperson who is stuck after a prospect raised an objection.

Analyze the provided WhatsApp conversation thread to understand the context, the prospect's sentiment, and the specific objection being raised.

Then, using the user-provided context for the desired outcome, craft a concise, effective, and natural-sounding reply. The reply should be ready to copy-paste directly into WhatsApp.

**Key Principles:**
1.  **Acknowledge and Validate:** Start by acknowledging the prospect's concern. Don't dismiss it.
2.  **Reframe, Don't Argue:** Gently reframe the issue or pivot back to value. Avoid a direct confrontation.
3.  **Be Human:** Keep the tone conversational and authentic, like a real text message. Use short sentences and paragraphs.
4.  **End with a Question:** Keep the conversation moving by ending with a soft, open-ended question.

**Conversation Thread:**
\`\`\`
{{{conversationThread}}}
\`\`\`

**Salesperson's Goal for the Reply:**
"{{{context}}}"

{{#if productContext}}
**Product Information for Context:**
"{{{productContext}}}"
{{/if}}

Now, generate the suggested reply.
`,
});

const handleWhatsappObjectionFlow = ai.defineFlow(
  {
    name: 'handleWhatsappObjectionFlow',
    inputSchema: HandleWhatsappObjectionInputSchema,
    outputSchema: HandleWhatsappObjectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
