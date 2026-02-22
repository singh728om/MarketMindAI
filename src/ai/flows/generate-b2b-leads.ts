'use server';
/**
 * @fileOverview B2B Lead Generation Agent specialized for the Indian Market.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const LeadGenInputSchema = z.object({
  niche: z.string().describe('The industry or product category.'),
  location: z.string().optional().describe('Target region or city for the leads. Defaults to India.'),
  websiteUrl: z.string().optional().describe('Reference brand website for context.'),
  apiKey: z.string().optional(),
});
export type LeadGenInput = z.infer<typeof LeadGenInputSchema>;

const LeadGenOutputSchema = z.object({
  results: z.array(z.object({
    businessName: z.string().describe('The official name of the company.'),
    mobile: z.string().describe('A professional contact number or mobile pattern.'),
    email: z.string().describe('The professional email address.'),
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
    prompt: `You are a B2B growth and lead generation specialist focusing on the Indian market. 
    Your goal is to find 5 highly relevant potential business partners or distributors for a brand in the "{{niche}}" category.
    
    Context:
    Target Location: {{#if location}}{{location}}{{else}}India{{/if}}
    {{#if websiteUrl}}Reference Website: {{websiteUrl}}{{/if}}
    
    Instructions:
    1. Focus on businesses operating in India. 
    2. Provide only: Business Name, Mobile (formatted for India +91...), and professional Email.
    3. Ensure the leads are high-quality potential distributors or retailers for the specified niche.`,
  });

  return output!;
}
