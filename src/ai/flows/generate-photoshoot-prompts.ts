'use server';
/**
 * @fileOverview A robust Genkit flow for professional AI photoshoots.
 * Supports both Image-to-Image (Gemini 2.5) and Text-to-Image (Imagen 4).
 *
 * - generatePhotoshoot - Primary function for generating commercial visual assets.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePhotoshootInputSchema = z.object({
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "Optional raw product photo as a data URI. If provided, image-to-image transformation is performed."
    ),
  productType: z.string().describe('The name or type of product (e.g., T-shirt, Saree).'),
  shotAngle: z.string().describe('The camera angle (e.g., front, back, zoom).').optional(),
  modelType: z.string().describe('The type of model to feature (e.g., male, female, kids).').optional(),
  background: z.string().describe('The desired background environment.').optional(),
  style: z.string().describe('The overall aesthetic style.').optional(),
});
export type GeneratePhotoshootInput = z.infer<typeof GeneratePhotoshootInputSchema>;

const GeneratePhotoshootOutputSchema = z.object({
  generatedImageDataUri: z.string().describe('The final photoshoot image as a data URI.'),
});
export type GeneratePhotoshootOutput = z.infer<typeof GeneratePhotoshootOutputSchema>;

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
    const modelText = input.modelType === 'none' ? 'the product alone' : `a ${input.modelType} model wearing or holding the product`;
    const promptText = `A world-class commercial product photoshoot of a ${input.productType}. 
Setting: ${input.background || 'professional high-key studio'}. 
Model: ${modelText}. 
Angle: ${input.shotAngle || 'standard front view'}. 
Style: ${input.style || 'high-end commercial editorial, extremely detailed, 8k resolution, photorealistic, sharp focus, magazine quality'}.
Ensure perfect lighting, natural shadows, and a premium marketplace aesthetic suitable for Amazon or Myntra.`;

    if (input.photoDataUri) {
      // IMAGE-TO-IMAGE: Transform uploaded product
      const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image',
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: `Transform this product into a professional photoshoot. ${promptText} CONSTRAINT: Keep the product's colors, patterns, and design identical to the original image.`},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const mediaPart = response.message?.content.find(p => !!p.media);
      if (!mediaPart || !mediaPart.media) {
        throw new Error('AI failed to generate image-to-image asset.');
      }
      return { generatedImageDataUri: mediaPart.media.url };
    } else {
      // TEXT-TO-IMAGE: Generate from description
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: promptText,
      });

      if (!media || !media.url) {
        throw new Error('AI failed to generate text-to-image asset.');
      }
      return { generatedImageDataUri: media.url };
    }
  }
);
