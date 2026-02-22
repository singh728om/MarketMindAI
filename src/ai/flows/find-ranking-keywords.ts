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
    prompt: `You are an expert e-commerce SEO specialist for {{marketplace}}. 
    Analyze the search landscape for "{{productName}}" in the {{category}} segment.
    Identify 5 high-intent keywords that are currently trending. 
    Estimate monthly search volume and competition difficulty.`,
  });

  return output!;
}
