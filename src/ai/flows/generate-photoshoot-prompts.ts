'use server';
/**
 * @fileOverview Professional AI Photoshoot Agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

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
  const modelText = input.modelType === 'none' ? 'the product alone' : `a ${input.modelType} model wearing or holding the product`;
  
  // Use provided API key or fallback to environment
  const config = input.apiKey ? { plugins: [googleAI({ apiKey: input.apiKey })] } : {};
  
  const promptEngineeringResponse = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    config: {
      ...config,
    } as any,
    prompt: `You are a world-class commercial fashion photographer. Write a highly detailed, professional photography prompt for an AI image generator.
    PRODUCT: ${input.productType}
    MODEL: ${modelText}
    ANGLE: ${input.shotAngle || 'standard front view'}
    BACKGROUND: ${input.background || 'professional high-key studio'}
    STYLE: ${input.style || 'high-end commercial editorial'}
    Output ONLY the final prompt text.`,
  });

  const finalPromptText = promptEngineeringResponse.text;

  if (input.photoDataUri) {
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      config: {
        ...config,
        responseModalities: ['TEXT', 'IMAGE'],
      } as any,
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `Perform a professional studio reshoot. ${finalPromptText} CONSTRAINT: Keep the product identical to the original image.`},
      ],
    });

    const mediaPart = response.message?.content.find(p => !!p.media);
    if (!mediaPart || !mediaPart.media) throw new Error('AI Photographer failed.');
    return { generatedImageDataUri: mediaPart.media.url };
  } else {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      config: config as any,
      prompt: finalPromptText,
    });

    if (!media || !media.url) throw new Error('AI Photographer failed.');
    return { generatedImageDataUri: media.url };
  }
}
