'use server';
/**
 * @fileOverview AI Listing Optimization Agent with Vision Support.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {genkit} from 'genkit';

const OptimizeProductListingInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('Product category (e.g. Fashion, Electronics).'),
  color: z.string().optional().describe('Color of the product.'),
  marketplace: z.enum(['Amazon', 'Flipkart', 'Myntra']).describe('Target marketplace.'),
  photoDataUri: z.string().optional().describe('Base64 data URI of the product image for visual context.'),
  apiKey: z.string().optional(),
});
export type OptimizeProductListingInput = z.infer<typeof OptimizeProductListingInputSchema>;

const OptimizeProductListingOutputSchema = z.object({
  title: z.string().describe('SEO optimized product title.'),
  bulletPoints: z.array(z.string()).describe('5 high-converting key features.'),
  description: z.string().describe('Professional product description.'),
  seoScore: z.number().min(0).max(100).describe('Estimated SEO strength score.'),
});
export type OptimizeProductListingOutput = z.infer<typeof OptimizeProductListingOutputSchema>;

export async function optimizeProductListing(input: OptimizeProductListingInput): Promise<OptimizeProductListingOutput> {
  const localAi = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  const { output } = await localAi.generate({
    model: 'googleai/gemini-2.5-flash',
    input: input,
    output: { schema: OptimizeProductListingOutputSchema },
    prompt: [
      { text: `You are a professional e-commerce SEO specialist for the Indian market.
      Your task is to create a high-performance, algorithm-friendly product listing for {{marketplace}}.
      
      PRODUCT CONTEXT:
      - Name: {{productName}}
      - Category: {{category}}
      - Color: {{color}}
      
      INSTRUCTIONS:
      1. Analyze the provided image (if available) to extract visual selling points.
      2. Write a Title following {{marketplace}}'s best practices (Brand + Name + Attributes).
      3. Provide 5 Bullet Points focusing on "Benefits over Features" for Indian shoppers.
      4. Write a professional, SEO-rich Description.
      5. Calculate an SEO Score based on keyword density and readability.` },
      ...(input.photoDataUri ? [{ media: { url: input.photoDataUri } }] : [])
    ],
  });

  return output!;
}
