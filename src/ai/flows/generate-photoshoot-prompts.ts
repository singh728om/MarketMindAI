'use server';
/**
 * @fileOverview A Genkit flow for generating creative and specific photoshoot prompts for product images.
 *
 * - generatePhotoshootPrompts - A function that handles the generation of image generation prompts.
 * - GeneratePhotoshootPromptsInput - The input type for the generatePhotoshootPrompts function.
 * - GeneratePhotoshootPromptsOutput - The return type for the generatePhotoshootPrompts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePhotoshootPromptsInputSchema = z.object({
  productType: z.string().describe('The type of product being photographed (e.g., dress, jewelry, electronics).'),
  productDescription: z.string().describe('A detailed description of the product, including key features and unique selling points.').optional(),
  fabric: z.string().describe('The material or fabric of the product (e.g., silk, cotton, denim, leather).').optional(),
  background: z.string().describe('The desired background for the photoshoot (e.g., minimalist studio, outdoor garden, cityscape, abstract).').optional(),
  modelType: z.string().describe('The type of model to feature, if any (e.g., Indian model, diverse model, male model, female model).').optional(),
  lighting: z.string().describe('The desired lighting style (e.g., soft natural light, dramatic studio lighting, golden hour).').optional(),
  style: z.string().describe('The overall aesthetic or style of the photoshoot (e.g., minimalist, luxurious, vibrant, rustic, high-fashion).').optional(),
});
export type GeneratePhotoshootPromptsInput = z.infer<typeof GeneratePhotoshootPromptsInputSchema>;

const GeneratePhotoshootPromptsOutputSchema = z.object({
  promptString: z.string().describe('A detailed image generation prompt suitable for AI image models like DALL-E or Midjourney.'),
});
export type GeneratePhotoshootPromptsOutput = z.infer<typeof GeneratePhotoshootPromptsOutputSchema>;

export async function generatePhotoshootPrompts(input: GeneratePhotoshootPromptsInput): Promise<GeneratePhotoshootPromptsOutput> {
  return generatePhotoshootPromptsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePhotoshootPrompt',
  input: {schema: GeneratePhotoshootPromptsInputSchema},
  output: {schema: GeneratePhotoshootPromptsOutputSchema},
  prompt: `You are an AI creative director specializing in e-commerce product photography. Your task is to generate a detailed and inspiring image generation prompt for a product photoshoot, suitable for AI image models like DALL-E or Midjourney. Focus on creating a visually appealing and professional image that highlights the product for online marketplaces. Ensure the generated prompt is a single, concise string, free of internal quotation marks unless absolutely necessary for the prompt itself.

Product Type: {{{productType}}}
{{#if productDescription}}Product Description: {{{productDescription}}}{{/if}}

{{#if fabric}}Fabric: {{{fabric}}} {{/if}}
{{#if background}}Background: {{{background}}} {{/if}}
{{#if modelType}}Model Type: {{{modelType}}} {{/if}}
{{#if lighting}}Lighting: {{{lighting}}} {{/if}}
{{#if style}}Style: {{{style}}} {{/if}}

Based on the details above, generate a single, descriptive prompt string for an AI image generator. The prompt should be evocative and include details about composition, mood, aesthetic, and specific elements that will make the product stand out. Do not include any introductory or concluding remarks, just the prompt string itself. Example: 'A stunning close-up shot of a luxurious silk scarf, draped elegantly over a minimalist marble pedestal, bathed in soft, ethereal natural light from a large window. The background is a blurred, opulent living room with subtle gold accents. The overall style is high-fashion editorial, clean and sophisticated, 8k, photorealistic.'

Your generated prompt should be production-ready and creative.`,
});

const generatePhotoshootPromptsFlow = ai.defineFlow(
  {
    name: 'generatePhotoshootPromptsFlow',
    inputSchema: GeneratePhotoshootPromptsInputSchema,
    outputSchema: GeneratePhotoshootPromptsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
