'use server';
/**
 * @fileOverview B2B Lead Generation Agent.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const LeadGenInputSchema = z.object({
  niche: z.string().describe('The industry or product category.'),
  location: z.string().optional().describe('Target region or city for the leads.'),
  websiteUrl: z.string().optional().describe('Reference brand website for context.'),
  apiKey: z.string().optional(),
});
export type LeadGenInput = z.infer<typeof LeadGenInputSchema>;

const LeadGenOutputSchema = z.object({
  results: z.array(z.object({
    company: z.string(),
    contact: z.string(),
    email: z.string(),
    website: z.string(),
    reason: z.string().describe('Why this is a good lead.'),
  })),
});
export type LeadGenOutput = z.infer<typeof LeadGenOutputSchema>;

export async function generateB2BLeads(input: LeadGenInput): Promise<LeadGenOutput> {
  const ai = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    input: input,
    output: { schema: LeadGenOutputSchema },
    prompt: `You are a B2B growth and lead generation specialist. 
    Your goal is to find 3 highly relevant potential business partners, distributors, or corporate clients for a brand in the "{{niche}}" niche.
    
    Context:
    {{#if location}}Target Location: {{location}}{{/if}}
    {{#if websiteUrl}}Reference Website: {{websiteUrl}}{{/if}}
    
    Instructions:
    1. Provide realistic company names and professional contact personas.
    2. Suggest a professional email address pattern.
    3. Include a "reason" explaining why this lead is a strong strategic match for a brand in this specific category.`,
  });

  return output!;
}
