'use server';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

const OptimizeProductListingInputSchema = z.object({
  productName: z.string(),
  category: z.string(),
  keyFeatures: z.array(z.string()),
  targetAudience: z.string(),
  marketplace: z.enum(['Amazon', 'Flipkart', 'Myntra']),
  existingDescription: z.string().optional(),
  apiKey: z.string().optional(),
});
export type OptimizeProductListingInput = z.infer<typeof OptimizeProductListingInputSchema>;

const OptimizeProductListingOutputSchema = z.object({
  title: z.string(),
  bulletPoints: z.array(z.string()),
  description: z.string(),
  seoScore: z.number().min(0).max(100),
  seoRecommendations: z.array(z.string()).optional(),
});
export type OptimizeProductListingOutput = z.infer<typeof OptimizeProductListingOutputSchema>;

export async function optimizeProductListing(input: OptimizeProductListingInput): Promise<OptimizeProductListingOutput> {
  const config = input.apiKey ? { plugins: [googleAI({ apiKey: input.apiKey })] } : {};
  
  const prompt = ai.definePrompt({
    name: 'optimizeProductListingPrompt',
    input: {schema: OptimizeProductListingInputSchema},
    output: {schema: OptimizeProductListingOutputSchema},
    prompt: `You are an expert e-commerce SEO specialist. Create optimized listings for {{marketplace}}.
    Product: {{productName}}
    Features: {{#each keyFeatures}}- {{this}}{{/each}}
    Target: {{targetAudience}}`,
  });

  const {output} = await prompt(input, { config: config as any });
  return output!;
}
