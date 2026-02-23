'use server';
/**
 * Professional AI Photoshoot Agent with Dynamic Key Support and Multi-Engine Generation (Gemini & OpenAI).
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
  background: z.string().optional(),
  style: z.string().optional(),
  apiKey: z.string().optional(),
  openaiApiKey: z.string().optional(),
  aiEngine: z.enum(['gemini', 'openai']).optional().default('gemini'),
});
export type GeneratePhotoshootInput = z.infer<typeof GeneratePhotoshootInputSchema>;

const GeneratePhotoshootOutputSchema = z.object({
  generatedImageDataUri: z.string(),
});
export type GeneratePhotoshootOutput = z.infer<typeof GeneratePhotoshootOutputSchema>;

export async function generatePhotoshoot(input: GeneratePhotoshootInput): Promise<GeneratePhotoshootOutput> {
  const ai = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  let modelText = "";
  if (input.modelType === 'none') {
    modelText = 'the product alone in a clean setting';
  } else if (input.modelType === 'kids') {
    modelText = `a professional ${input.kidAge || '5'}-year-old child model wearing or holding the product`;
  } else if (input.modelType === 'mens') {
    modelText = `a professional male fashion model wearing or holding the product`;
  } else if (input.modelType === 'womens') {
    modelText = `a professional female fashion model wearing or holding the product`;
  }

  let angleDescription = "";
  switch (input.shotAngle) {
    case 'front': angleDescription = "straight-on eye-level front view"; break;
    case 'back': angleDescription = "view from behind showing back details"; break;
    case 'left-side': angleDescription = "left-side profile view"; break;
    case 'right-side': angleDescription = "right-side profile view"; break;
    case 'close': angleDescription = "macro close-up focus on textures and fine craftsmanship"; break;
    default: angleDescription = "standard commercial angle";
  }

  let backgroundText = "";
  switch (input.background) {
    case 'studio': backgroundText = "clean professional high-key studio with soft shadows"; break;
    case 'outdoor': backgroundText = "natural daylight outdoor city or street setting"; break;
    case 'sport': backgroundText = "dynamic fitness gym or stadium environment"; break;
    case 'nature': backgroundText = "serene natural environment like a park or forest"; break;
    default: backgroundText = input.background || "professional studio";
  }
  
  const promptEngineeringResponse = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    prompt: `You are a world-class commercial fashion photographer. Write a highly detailed photography prompt.
    PRODUCT: ${input.productType}
    CATEGORY: ${input.category || 'General'}
    MODEL: ${modelText}
    ANGLE: ${angleDescription}
    BACKGROUND: ${backgroundText}
    STYLE: ${input.style || 'high-end commercial editorial, extremely detailed, 8k resolution, realistic lighting'}
    
    The prompt should focus on realism and professional brand aesthetic. Output ONLY the final prompt text.`,
  });

  const finalPromptText = promptEngineeringResponse.text;

  // --- ENGINE SELECTION LOGIC ---

  if (input.aiEngine === 'openai') {
    if (!input.openaiApiKey) throw new Error('OpenAI API Key is required for DALL-E generation.');
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${input.openaiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: finalPromptText,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      })
    });

    const result = await response.json();
    if (result.error) throw new Error(`OpenAI Error: ${result.error.message}`);
    
    return { generatedImageDataUri: `data:image/png;base64,${result.data[0].b64_json}` };
  }

  // --- DEFAULT GEMINI/IMAGEN LOGIC ---
  if (input.photoDataUri) {
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      config: { responseModalities: ['TEXT', 'IMAGE'] },
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `Perform a professional studio reshoot based on this creative direction: ${finalPromptText}. CONSTRAINT: Keep the product absolutely identical to the original image in terms of design, color, and texture.`},
      ],
    });

    const mediaPart = response.message?.content.find(p => !!p.media);
    if (!mediaPart || !mediaPart.media) throw new Error('AI Photographer failed to generate image.');
    return { generatedImageDataUri: mediaPart.media.url };
  } else {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: finalPromptText,
    });

    if (!media || !media.url) throw new Error('AI Photographer failed to generate image.');
    return { generatedImageDataUri: media.url };
  }
}
