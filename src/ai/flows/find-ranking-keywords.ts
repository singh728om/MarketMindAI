'use server';
/**
 * @fileOverview AI Ranking Keyword Finder Agent.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const KeywordFinderInputSchema = z.object({
  productName: z.string(),
  category: z.string(),
  color: z.string().optional(),
  marketplace: z.string(),
  apiKey: z.string().optional(),
});
export type KeywordFinderInput = z.infer<typeof KeywordFinderInputSchema>;

const KeywordFinderOutputSchema = z.object({
  keywords: z.array(z.object({
    term: z.string(),
    volume: z.string(),
    difficulty: z.enum(['Low', 'Medium', 'High', 'Very High']),
  })),
});
export type KeywordFinderOutput = z.infer<typeof KeywordFinderOutputSchema>;

export async function findRankingKeywords(input: KeywordFinderInput): Promise<KeywordFinderOutput> {
  const ai = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    input: input,
    output: { schema: KeywordFinderOutputSchema },
    prompt: `You are a high-performance e-commerce SEO architect specialized in the Indian market for {{marketplace}}.
    Your task is to analyze the CURRENT search landscape for "{{productName}}" in the "{{category}}" category{{#if color}} with specific focus on the color "{{color}}"{{/if}}.
    
    Instructions:
    1. Identify exactly 10 high-intent, trending long-tail keywords that are currently driving sales on {{marketplace}}.
    2. Focus on "Golden Terms" (high volume, manageable difficulty) that Indian shoppers use.
    3. Include a mix of broad category terms and specific product attributes.
    4. Estimate "Search Volume" as a monthly range (e.g., "12k - 15k") and "Competition" based on latest marketplace saturation data.
    
    Product Context:
    - Name: {{productName}}
    - Category: {{category}}
    - Color: {{color}}
    - Marketplace: {{marketplace}}`,
  });

  return output!;
}
