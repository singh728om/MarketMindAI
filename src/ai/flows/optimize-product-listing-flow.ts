'use server';
/**
 * @fileOverview A Genkit flow for optimizing product listings for e-commerce marketplaces.
 *
 * - optimizeProductListing - A function that handles the product listing optimization process.
 * - OptimizeProductListingInput - The input type for the optimizeProductListing function.
 * - OptimizeProductListingOutput - The return type for the optimizeProductListing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeProductListingInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  category: z.string().describe('The category the product belongs to.'),
  keyFeatures: z
    .array(z.string())
    .describe('A list of key features and benefits of the product.'),
  targetAudience: z
    .string()
    .describe('The primary target audience for this product.'),
  marketplace: z
    .enum(['Amazon', 'Flipkart', 'Myntra'])
    .describe('The target marketplace for the listing (Amazon, Flipkart, or Myntra).'),
  existingDescription: z
    .string()
    .optional()
    .describe('An optional existing product description to refine.'),
});
export type OptimizeProductListingInput = z.infer<
  typeof OptimizeProductListingInputSchema
>;

const OptimizeProductListingOutputSchema = z.object({
  title: z.string().describe('An SEO-friendly and engaging product title.'),
  bulletPoints:
    z.array(z.string()).describe('5-7 compelling bullet points highlighting key features and benefits.'),
  description:
    z.string().describe('A detailed, persuasive product description.'),
  seoScore:
    z.number().min(0).max(100).describe('An SEO score (0-100) based on the generated content and product details.'),
  seoRecommendations: z
    .array(z.string())
    .optional()
    .describe('Optional recommendations for further SEO improvement.'),
});
export type OptimizeProductListingOutput = z.infer<
  typeof OptimizeProductListingOutputSchema
>;

export async function optimizeProductListing(
  input: OptimizeProductListingInput
): Promise<OptimizeProductListingOutput> {
  return optimizeProductListingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeProductListingPrompt',
  input: {schema: OptimizeProductListingInputSchema},
  output: {schema: OptimizeProductListingOutputSchema},
  prompt: `You are an expert e-commerce SEO specialist, copywriter, and marketplace listing optimizer.
Your goal is to create highly optimized and compelling product listings for the specified marketplace to maximize visibility and conversion rates.

Generate the following components for a product listing based on the provided details, ensuring they are SEO-friendly, engaging, and persuasive.
After generating the content, provide an SEO score from 0-100, where a higher score indicates better optimization for search engines and user engagement.
Also, provide optional recommendations for further SEO improvement.

Product Name: {{{productName}}}
Category: {{{category}}}
Key Features & Benefits:
{{#each keyFeatures}}- {{{this}}}
{{/each}}
Target Audience: {{{targetAudience}}}
Target Marketplace: {{{marketplace}}}

{{#if existingDescription}}Existing Description (for refinement): {{{existingDescription}}}{{/if}}

Instructions:
1. Create a product title that is concise, includes primary keywords, and entices clicks.
2. Generate 5 to 7 bullet points highlighting the most important features and benefits. Each bullet point should be compelling and easy to read.
3. Write a detailed product description that tells a story, addresses customer pain points, uses persuasive language, and incorporates relevant keywords naturally.
4. Evaluate the generated content for SEO quality, keyword integration, clarity, and persuasiveness, and assign an SEO score between 0 and 100.
5. Provide 2-3 specific, actionable recommendations for further improving the listing's SEO or conversion rate.

Ensure all outputs adhere strictly to the JSON schema provided.
`,
});

const optimizeProductListingFlow = ai.defineFlow(
  {
    name: 'optimizeProductListingFlow',
    inputSchema: OptimizeProductListingInputSchema,
    outputSchema: OptimizeProductListingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate product listing optimization.');
    }
    return output;
  }
);
