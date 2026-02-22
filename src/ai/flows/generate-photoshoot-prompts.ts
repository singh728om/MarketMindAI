'use server';
/**
 * @fileOverview A Genkit flow for generating professional AI photoshoots from product images.
 *
 * - generatePhotoshoot - A function that handles the image-to-image photoshoot process.
 * - GeneratePhotoshootInput - The input type for the photoshoot function.
 * - GeneratePhotoshootOutput - The return type for the photoshoot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePhotoshootInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  productType: z.string().describe('The type of product being photographed (e.g., dress, jewelry).'),
  shotAngle: z.string().describe('The camera angle (e.g., front, back, zoom).').optional(),
  modelType: z.string().describe('The type of model to feature (e.g., male, female, kids).').optional(),
  background: z.string().describe('The desired background environment.').optional(),
  style: z.string().describe('The overall aesthetic style.').optional(),
});
export type GeneratePhotoshootInput = z.infer<typeof GeneratePhotoshootInputSchema>;

const GeneratePhotoshootOutputSchema = z.object({
  generatedImageDataUri: z.string().describe('The generated photoshoot image as a data URI.'),
  description: z.string().describe('A brief description of the generated shot.'),
});
export type GeneratePhotoshootOutput = z.infer<typeof GeneratePhotoshootOutputSchema>;

/**
 * Executes an AI-powered photoshoot using Gemini 2.5 Flash Image.
 * It takes a product photo and places it in a new generated context.
 */
export async function generatePhotoshoot(input: GeneratePhotoshootInput): Promise<GeneratePhotoshootOutput> {
  return generatePhotoshootFlow(input);
}

const generatePhotoshootFlow = ai.defineFlow(
  {
    name: 'generatePhotoshootFlow',
    inputSchema: GeneratePhotoshootInputSchema,
    outputSchema: GeneratePhotoshootOutputSchema,
  },
  async input => {
    const prompt = `You are a professional product photographer. 
Take the product from the provided image and place it in a high-end commercial photoshoot.
Product: ${input.productType}
Shot Angle: ${input.shotAngle || 'front view'}
Model: ${input.modelType || 'no model'}
Background: ${input.background || 'minimalist studio'}
Style: ${input.style || 'high-fashion editorial, 8k, photorealistic'}

Ensure the product details are preserved while the environment and lighting are perfectly integrated. 
The output must be a single professional image.`;

    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: prompt},
      ],
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    const mediaPart = response.message?.content.find(p => !!p.media);
    
    if (!mediaPart || !mediaPart.media) {
      throw new Error('Failed to generate image from Gemini.');
    }

    return {
      generatedImageDataUri: mediaPart.media.url,
      description: `A professional ${input.shotAngle || ''} ${input.productType} photoshoot in a ${input.background || 'studio'} setting.`,
    };
  }
);
