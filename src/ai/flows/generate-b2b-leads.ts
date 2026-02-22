'use server';
/**
 * @fileOverview B2B Lead Generation Agent.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const LeadGenInputSchema = z.object({
  niche: z.string(),
  location: z.string().optional(),
  apiKey: z.string().optional(),
});
export type LeadGenInput = z.infer<typeof LeadGenInputSchema>;

const LeadGenOutputSchema = z.object({
  results: z.array(z.object({
    company: z.string(),
    contact: z.string(),
    email: z.string(),
    website: z.string(),
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
    prompt: `You are a B2B growth specialist. 
    Generate a list of 3 highly relevant potential business leads for a company in the "{{niche}}" niche{{#if location}} located in {{location}}{{/if}}.
    Provide realistic company names, contact persons, and professional websites.`,
  });

  return output!;
}
