'use server';
/**
 * Professional AI Photoshoot Agent with Studio-Quality Prompting.
 * Engineered for Virtual Try-On where models wear the specific product from the image.
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
    modelText = 'the product alone as the central hero in a clean studio setting';
  } else if (input.modelType === 'kids') {
    modelText = `a wholesome youthful brand ambassador WEARING the exact product from the image in a modest, family-friendly high-end commercial setting`;
  } else if (input.modelType === 'mens') {
    modelText = `a professional male commercial talent WEARING the exact product from the image in modest, high-end commercial attire`;
  } else if (input.modelType === 'womens') {
    modelText = `a professional female commercial talent WEARING the exact product from the image in modest, high-end commercial attire`;
  }

  let angleDescription = "";
  switch (input.shotAngle) {
    case 'front': angleDescription = "straight-on eye-level front view, perfectly symmetrical"; break;
    case 'back': angleDescription = "view from behind showing high-fidelity back details"; break;
    case 'left-side': angleDescription = "left-side profile view, sharp focus"; break;
    case 'right-side': angleDescription = "right-side profile view, sharp focus"; break;
    case 'close': angleDescription = "macro close-up focus on premium textures and fine craftsmanship"; break;
    default: angleDescription = "standard high-end commercial angle";
  }

  let backgroundText = "";
  switch (input.background) {
    case 'studio': backgroundText = "clean professional high-key studio with soft shadows and neutral backdrop"; break;
    case 'outdoor': backgroundText = "natural daylight urban city or street setting, blurred background"; break;
    case 'sport': backgroundText = "dynamic high-performance fitness gym or stadium environment"; break;
    case 'nature': backgroundText = "serene natural environment like a park or forest with soft bokeh"; break;
    default: backgroundText = input.background || "professional luxury studio";
  }
  
  const promptEngineeringResponse = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    config: {
      safetySettings: [
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
      ]
    },
    prompt: `You are a world-class commercial fashion photographer specializing in luxury studio catalogs. Write a highly detailed, professional photography prompt for a VIRTUAL TRY-ON.
    
    HERO PRODUCT: ${input.productType}
    CATEGORY: ${input.category || 'General'}
    TALENT: ${modelText}
    ANGLE: ${angleDescription}
    BACKGROUND: ${backgroundText}
    AESTHETIC: ${input.style || 'high-end commercial editorial, modest, realistic high-key lighting, extremely detailed textures, 8k resolution, sharp focus'}
    
    CORE REQUIREMENT: The model MUST be wearing the product from the image. Maintain IDENTICAL color and pattern. Output ONLY the final prompt text.`,
  });

  const finalPromptText = promptEngineeringResponse.text;

  if (input.aiEngine === 'openai') {
    if (!input.openaiApiKey) throw new Error('OpenAI API Key is required for Astra Plus generation.');
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${input.openaiApiKey}`
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `A high-end commercial studio photo. ${finalPromptText}. The model is wearing the exact product from the reference. Perfectly realistic.`,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      })
    });

    const result = await response.json();
    if (result.error) throw new Error(`Astra Plus Error: ${result.error.message}`);
    
    return { generatedImageDataUri: `data:image/png;base64,${result.data[0].b64_json}` };
  }

  if (input.photoDataUri) {
    const response = await ai.generate({
      model: 'googleai/gemini-2.5-flash-image',
      config: { 
        responseModalities: ['TEXT', 'IMAGE'],
        safetySettings: [
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
      },
      prompt: [
        {media: {url: input.photoDataUri}},
        {text: `Perform a professional, high-end studio virtual try-on based on this direction: ${finalPromptText}. CONSTRAINT: The model in the new image MUST be WEARING the product from the original image. Keep the product IDENTICAL in design, pattern, and color. Ensure the scene is modest, safe, and family-friendly.`},
      ],
    });

    const mediaPart = response.message?.content.find(p => !!p.media);
    if (!mediaPart || !mediaPart.media) throw new Error('Astra Core failed to generate asset. Ensure the product image is wholesome and clear.');
    return { generatedImageDataUri: mediaPart.media.url };
  } else {
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: finalPromptText,
      config: {
        safetySettings: [
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
      }
    });

    if (!media || !media.url) throw new Error('Astra Core failed to generate image asset.');
    return { generatedImageDataUri: media.url };
  }
}
