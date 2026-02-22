'use server';
/**
 * @fileOverview Professional AI Photoshoot Agent.
 * 
 * This agent acts as a digital photo studio. It takes user parameters and an optional 
 * raw product photo, uses Gemini to interpret and write a professional studio prompt, 
 * and then generates a final commercial-grade image.
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
    // STEP 1: ACT AS A PHOTOGRAPHER - Generate a professional prompt
    const modelText = input.modelType === 'none' ? 'the product alone' : `a ${input.modelType} model wearing or holding the product`;
    
    const promptEngineeringResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a world-class commercial fashion photographer and creative director. 
      Your task is to write a highly detailed, professional photography prompt for an AI image generator.
      
      PRODUCT: ${input.productType}
      MODEL: ${modelText}
      ANGLE: ${input.shotAngle || 'standard front view'}
      BACKGROUND: ${input.background || 'professional high-key studio'}
      STYLE: ${input.style || 'high-end commercial editorial'}

      Write a detailed description including lighting (e.g., softbox, rim light), camera specs (e.g., 85mm lens, f/1.8), and specific texture details. 
      Output ONLY the final prompt text.`,
    });

    const finalPromptText = promptEngineeringResponse.text;

    // STEP 2: GENERATE THE IMAGE
    if (input.photoDataUri) {
      // IMAGE-TO-IMAGE: Reshoot uploaded product
      const response = await ai.generate({
        model: 'googleai/gemini-2.5-flash-image',
        prompt: [
          {media: {url: input.photoDataUri}},
          {text: `Perform a professional studio reshoot. ${finalPromptText} CONSTRAINT: Keep the product's colors, branding, and design identical to the original image. Place it realistically in the scene.`},
        ],
        config: {
          responseModalities: ['TEXT', 'IMAGE'],
        },
      });

      const mediaPart = response.message?.content.find(p => !!p.media);
      if (!mediaPart || !mediaPart.media) {
        throw new Error('AI Photographer failed to develop the asset.');
      }
      return { generatedImageDataUri: mediaPart.media.url };
    } else {
      // TEXT-TO-IMAGE: Create from scratch
      const { media } = await ai.generate({
        model: 'googleai/imagen-4.0-fast-generate-001',
        prompt: finalPromptText,
      });

      if (!media || !media.url) {
        throw new Error('AI Photographer failed to capture the scene.');
      }
      return { generatedImageDataUri: media.url };
    }
  }
);
