'use server';
/**
 * @fileOverview A Genkit flow for the AI Growth Recommendation Engine.
 *
 * - generateGrowthRecommendations - A function that handles the generation of data-driven growth recommendations.
 * - GenerateGrowthRecommendationsInput - The input type for the generateGrowthRecommendations function.
 * - GenerateGrowthRecommendationsOutput - The return type for the generateGrowthRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateGrowthRecommendationsInputSchema = z.object({
  productIdentifier: z.string().describe('The ASIN, SKU, or URL of the product.'),
  marketplace: z.array(z.string()).describe('The marketplaces (e.g., Amazon, Flipkart, Myntra) the product is sold on.'),
  productCategory: z.string().describe('The category of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  currentPerformanceSummary: z.string().describe('A summary of current product performance, including sales, CTR, conversion rates, and any known issues.'),
  goals: z.array(z.string()).describe('The primary growth goals for this product (e.g., increase sales, improve CTR, enhance listing quality, expand market reach.').optional(),
});
export type GenerateGrowthRecommendationsInput = z.infer<typeof GenerateGrowthRecommendationsInputSchema>;

const RecommendationSchema = z.object({
  category: z.string().describe('The category of the recommendation (e.g., Listing Optimization, Ad Strategy, Pricing, Inventory, Customer Service).'),
  action: z.string().describe('A specific, actionable step to take.'),
  expectedImpact: z.string().describe('The anticipated positive impact of implementing this action.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The urgency and importance of this recommendation.'),
});

const GenerateGrowthRecommendationsOutputSchema = z.object({
  summary: z.string().describe('An overall summary of the generated growth recommendations and their potential impact.'),
  recommendations: z.array(RecommendationSchema).describe('A list of data-driven, actionable recommendations to improve marketplace performance.'),
  growthOpportunities: z.array(z.string()).describe('Identified new growth opportunities or market segments to explore.'),
});
export type GenerateGrowthRecommendationsOutput = z.infer<typeof GenerateGrowthRecommendationsOutputSchema>;

export async function generateGrowthRecommendations(input: GenerateGrowthRecommendationsInput): Promise<GenerateGrowthRecommendationsOutput> {
  return generateGrowthRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateGrowthRecommendationsPrompt',
  input: { schema: GenerateGrowthRecommendationsInputSchema },
  output: { schema: GenerateGrowthRecommendationsOutputSchema },
  prompt: `You are an expert e-commerce strategist and AI Growth Recommendation Engine. Your task is to analyze the provided product information, current performance, and goals to generate data-driven, actionable recommendations for improving marketplace performance and unlocking new growth opportunities.

Consider the following details:
Product Identifier: {{{productIdentifier}}}
Marketplaces: {{#each marketplace}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Product Category: {{{productCategory}}}
Product Description: {{{productDescription}}}
Current Performance Summary: {{{currentPerformanceSummary}}}
{{#if goals}}Goals: {{#each goals}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}{{/if}}

Based on the information above, provide:
1.  An overall summary of your recommendations and their potential impact.
2.  A list of specific, actionable recommendations, categorized by area (e.g., Listing Optimization, Ad Strategy, Pricing, Inventory, Customer Service), including the expected impact and priority.
3.  Any identified new growth opportunities or market segments.

Ensure all recommendations are actionable and clearly state their expected impact. Prioritize recommendations based on their potential for immediate and long-term growth.`,
});

const generateGrowthRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateGrowthRecommendationsFlow',
    inputSchema: GenerateGrowthRecommendationsInputSchema,
    outputSchema: GenerateGrowthRecommendationsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
