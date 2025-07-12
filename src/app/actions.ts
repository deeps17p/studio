
"use server";

import { z } from "zod";
import { generateSalesTemplate as generateSalesTemplateFlow, GenerateSalesTemplateInput } from '@/ai/flows/generate-sales-template';
import { improveMessageClarity as improveMessageClarityFlow, ImproveMessageClarityInput } from '@/ai/flows/improve-message-clarity';
import { analyzeMessageTone as analyzeMessageToneFlow, AnalyzeMessageToneInput } from '@/ai/flows/analyze-message-tone';
import { researchProduct as researchProductFlow, ResearchProductInput } from '@/ai/flows/research-product';


const generateSalesTemplateSchema = z.object({
  productDescription: z.string(),
  messageType: z.enum(['email', 'WhatsApp', 'text message']),
  scenario: z.string(),
});

export async function generateSalesTemplateAction(values: GenerateSalesTemplateInput) {
  const validatedInput = generateSalesTemplateSchema.safeParse(values);
  if (!validatedInput.success) {
    return { failure: "Invalid input." };
  }
  try {
    const output = await generateSalesTemplateFlow(validatedInput.data as GenerateSalesTemplateInput);
    return { success: output };
  } catch (error) {
    console.error(error);
    return { failure: "Failed to generate template." };
  }
}

const improveMessageClaritySchema = z.object({
  message: z.string(),
  productContext: z.string().optional(),
});

export async function improveMessageClarityAction(values: ImproveMessageClarityInput) {
  const validatedInput = improveMessageClaritySchema.safeParse(values);
  if (!validatedInput.success) {
    return { failure: "Invalid input." };
  }
  try {
    const output = await improveMessageClarityFlow(validatedInput.data);
    return { success: output };
  } catch (error) {
    console.error(error);
    return { failure: "Failed to improve message." };
  }
}

const analyzeMessageToneSchema = z.object({
  message: z.string(),
  productContext: z.string().optional(),
});

export async function analyzeMessageToneAction(values: AnalyzeMessageToneInput) {
  const validatedInput = analyzeMessageToneSchema.safeParse(values);
  if (!validatedInput.success) {
    return { failure: "Invalid input." };
  }
  try {
    const output = await analyzeMessageToneFlow(validatedInput.data);
    return { success: output };
  } catch (error) {
    console.error(error);
    return { failure: "Failed to analyze tone." };
  }
}

const researchProductSchema = z.object({
  productName: z.string(),
});

export async function researchProductAction(values: ResearchProductInput) {
    const validatedInput = researchProductSchema.safeParse(values);
    if (!validatedInput.success) {
        return { failure: "Invalid input." };
    }
    try {
        const output = await researchProductFlow(validatedInput.data);
        return { success: output };
    } catch (error) {
        console.error(error);
        return { failure: "Failed to research product." };
    }
}
