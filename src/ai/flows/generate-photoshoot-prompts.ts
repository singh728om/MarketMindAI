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
  productType: z.string().describe('The name or type of product (e.g., T-shirt, Saree).'),
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
    const modelText = input.modelType === 'none' ? 'the product alone' : `a ${input.modelType} model wearing or holding the product`;
    const prompt = `Act as a world-class commercial product photographer and digital artist. 
Your task is to take the product from the attached image and realistically integrate it into a professional photoshoot.

PRODUCT DETAILS:
- Product Type: ${input.productType}
- Model: ${modelText}
- Shot Angle: ${input.shotAngle || 'standard front view'}
- Environment: ${input.background || 'professional studio with soft-box lighting'}
- Aesthetic Style: ${input.style || 'high-end editorial, extremely detailed, 8k resolution, photorealistic, sharp focus'}

CONSTRAINTS:
1. PRESERVE THE PRODUCT: The product in the output must look exactly like the product in the provided image (colors, textures, patterns). Do not change the fundamental design of the product.
2. REALISTIC INTEGRATION: Place the product naturally in the specified environment with correct lighting, shadows, and reflections that match the background.
3. PROFESSIONAL COMPOSITION: Ensure the framing and angle (${input.shotAngle}) are professional and suitable for a high-end marketplace listing like Amazon or Myntra.

OUTPUT: Generate a single, high-fidelity professional commercial image.`;

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
      throw new Error('AI failed to generate the photoshoot image. Please try again with a clearer product photo.');
    }

    return {
      generatedImageDataUri: mediaPart.media.url,
      description: `A professional ${input.shotAngle || ''} photoshoot of ${input.productType} featuring ${input.modelType || 'no model'} in a ${input.background || 'studio'} setting.`,
    };
  }
);
