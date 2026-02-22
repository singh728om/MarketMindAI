'use server';
/**
 * @fileOverview Professional AI Photoshoot Agent with Dynamic Key Support.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {z} from 'genkit';

const GeneratePhotoshootInputSchema = z.object({
  photoDataUri: z.string().optional(),
  productType: z.string(),
  shotAngle: z.string().optional(),
  modelType: z.string().optional(),
  background: z.string().optional(),
  style: z.string().optional(),
  apiKey: z.string().optional(),
});
export type GeneratePhotoshootInput = z.infer<typeof GeneratePhotoshootInputSchema>;

const GeneratePhotoshootOutputSchema = z.object({
  generatedImageDataUri: z.string(),
});
export type GeneratePhotoshootOutput = z.infer<typeof GeneratePhotoshootOutputSchema>;

export async function generatePhotoshoot(input: GeneratePhotoshootInput): Promise<GeneratePhotoshootOutput> {
  // Initialize a localized Genkit instance to use the dynamic API key
  const ai = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  const modelText = input.modelType === 'none' ? 'the product alone' : `a ${input.modelType} model wearing or holding the product`;
  
  // Step 1: Creative Direction (Prompt Engineering)
  const promptEngineeringResponse = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are a world-class commercial fashion photographer. Write a highly detailed, professional photography prompt for an AI image generator.
    PRODUCT: ${input.productType}
    MODEL: ${modelText}
    ANGLE: ${input.shotAngle || 'standard front view'}
    BACKGROUND: ${input.background || 'professional high-key studio'}
    STYLE: ${input.style || 'high-end commercial editorial'}
    Output ONLY the final prompt text.`,
  });

  const finalPromptText = promptEngineeringResponse.text;

  // Step 2: Generation
  if (input.photoDataUri) {
    // Image-to-Image Reshoot
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `Perform a professional studio reshoot. ${finalPromptText} CONSTRAINT: Keep the product identical to the original image in terms of design, color, and texture.`},
      ],
    });

    const mediaPart = response.message?.content.find(p => !!p.media);
    if (!mediaPart || !mediaPart.media) throw new Error('AI Photographer failed to generate image.');
    return { generatedImageDataUri: mediaPart.media.url };
  } else {
    // Text-to-Image Creation
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: finalPromptText,
    });

    if (!media || !media.url) throw new Error('AI Photographer failed to generate image.');
    return { generatedImageDataUri: media.url };
  }
}
