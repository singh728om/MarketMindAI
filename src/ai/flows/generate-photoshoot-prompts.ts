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
  category: z.string().optional(),
  shotAngle: z.string().optional(),
  modelType: z.string().optional(),
  kidAge: z.string().optional(),
  kidGender: z.string().optional(),
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

  let modelText = "";
  if (input.modelType === 'none') {
    modelText = 'the product alone in a clean setting';
  } else if (input.modelType === 'kids') {
    const gender = input.kidGender === 'boy' ? 'boy' : 'girl';
    modelText = `a professional ${input.kidAge || '5'}-year-old ${gender} model wearing or holding the product`;
  } else {
    modelText = `a professional ${input.modelType} model wearing or holding the product`;
  }
  
  // Step 1: Creative Direction (Prompt Engineering)
  const promptEngineeringResponse = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are a world-class commercial fashion and product photographer. Write a highly detailed, professional photography prompt for an AI image generator.
    PRODUCT: ${input.productType}
    CATEGORY: ${input.category || 'General'}
    MODEL: ${modelText}
    ANGLE: ${input.shotAngle || 'standard front view'}
    BACKGROUND: ${input.background || 'professional high-key studio'}
    STYLE: ${input.style || 'high-end commercial editorial'}
    
    The prompt should focus on realistic lighting, high-fidelity textures, and a professional brand aesthetic. Output ONLY the final prompt text.`,
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
        {text: `Perform a professional studio reshoot based on this creative direction: ${finalPromptText}. CONSTRAINT: Keep the product absolutely identical to the original image in terms of design, color, and texture. Do not hallucinate new logos or patterns.`},
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
