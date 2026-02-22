
'use server';
/**
 * @fileOverview AI Website Builder Agent.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const WebsiteBuilderInputSchema = z.object({
  brandName: z.string(),
  niche: z.string(),
  requirements: z.string().optional(),
  apiKey: z.string().optional(),
});
export type WebsiteBuilderInput = z.infer<typeof WebsiteBuilderInputSchema>;

const WebsiteBuilderOutputSchema = z.object({
  html: z.string().describe('The full HTML content of the landing page, using Tailwind CSS via CDN.'),
  recommendations: z.array(z.string()).describe('Design or copy suggestions.'),
});
export type WebsiteBuilderOutput = z.infer<typeof WebsiteBuilderOutputSchema>;

export async function generateWebsite(input: WebsiteBuilderInput): Promise<WebsiteBuilderOutput> {
  const ai = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    input: input,
    output: { schema: WebsiteBuilderOutputSchema },
    prompt: `You are an expert e-commerce web designer. Build a conversion-optimized, professional landing page for the brand "{{brandName}}" in the "{{niche}}" niche.
    
    Technical Constraints:
    - Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
    - Include a sticky navbar, a hero section with CTA, a product features section, and a professional footer.
    - Use high-quality placeholder images from Unsplash (e.g., https://images.unsplash.com/photo-...).
    - Ensure the page is responsive and mobile-friendly.
    
    Brand Context:
    Brand Name: {{brandName}}
    Niche: {{niche}}
    {{#if requirements}}Special Requirements: {{requirements}}{{/if}}
    
    Provide the full HTML document and 3 strategic recommendations.`,
  });

  return output!;
}
