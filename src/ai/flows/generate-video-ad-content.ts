'use server';
/**
 * @fileOverview Product to AI Video Ads Agent.
 * Generates cinematic commercial video content using Google Veo with Image-to-Video support.
 * Optimized for Virtual Try-On where models wear the specific product.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

const GenerateVideoAdInputSchema = z.object({
  productName: z.string(),
  productCategory: z.string(),
  background: z.string(),
  marketingText: z.string().optional(),
  photoDataUri: z.string().describe("Base64 data URI of the product image."),
  durationSeconds: z.number().default(5),
  isUgc: z.boolean().default(false),
  modelType: z.string().optional(),
  kidAge: z.string().optional(),
  apiKey: z.string().optional(),
});
export type GenerateVideoAdInput = z.infer<typeof GenerateVideoAdInputSchema>;

const GenerateVideoAdOutputSchema = z.object({
  videoDataUri: z.string().describe("The generated video as a base64 data URI (video/mp4)."),
  description: z.string().optional(),
});
export type GenerateVideoAdOutput = z.infer<typeof GenerateVideoAdOutputSchema>;

export async function generateVideoAdContent(input: GenerateVideoAdInput): Promise<GenerateVideoAdOutput> {
  const ai = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  const styleContext = input.isUgc 
    ? "authentic User Generated Content (UGC) style, handheld camera feel, natural home lighting, relatable vibe"
    : "high-end premium studio commercial, steady cinematic camera movement, dramatic fashion lighting, 8k resolution, professional color grading, sharp focus";

  let modelContext = "";
  if (input.modelType === 'mens') {
    modelContext = "The video features a professional male commercial talent WEARING the exact product from the image. The talent is presenting the garment in a modest and wholesome manner.";
  } else if (input.modelType === 'womens') {
    modelContext = "The video features a professional female commercial talent WEARING the exact product from the image. The talent is presenting the garment in a modest and wholesome manner.";
  } else if (input.modelType === 'kids') {
    modelContext = `The video features a wholesome youthful brand ambassador WEARING the exact product from the image in a safe, modest, and family-oriented commercial setting. The talent is presenting the product in a professional, high-end commercial context.`;
  } else {
    modelContext = "The video features the product alone as the absolute hero in a clean, high-fidelity studio showcase without people. Focus on the textures and design.";
  }

  const promptText = `Act as a world-class commercial cinematographer and fashion director. Create a high-end, professional studio-quality commercial video for the "${input.productName}". 

  CORE DIRECTIVE: The model MUST be WEARING the exact product shown in the provided image. Keep the garment's design, pattern, and color IDENTICAL to the original.
  SCENE: The talent is showcased in a ${input.background} environment with cinematic ${input.isUgc ? 'natural' : 'studio'} lighting.
  TALENT: ${modelContext}
  STYLE: ${styleContext}.
  MARKETING CONTEXT: ${input.marketingText || 'Premium quality, high-fidelity commercial appeal.'}
  
  MOTION: Subtle and elegant camera movement. Perform a slow cinematic zoom-in or a smooth orbital sweep around the talent wearing the product. Keep the product central and in sharp focus throughout.
  
  CONSTRAINT: The scene MUST be wholesome, professional, and suitable for a general commercial audience. Ensure all attire is modest and safe. Output only the highest quality studio rendering.`;

  try {
    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: [
        { text: promptText },
        { media: { url: input.photoDataUri, contentType: 'image/jpeg' } }
      ],
      config: {
        durationSeconds: input.durationSeconds > 8 ? 8 : input.durationSeconds,
        aspectRatio: '9:16',
        personGeneration: input.modelType && input.modelType !== 'none' ? 'allow_adult' : 'dont_allow',
      },
    });

    if (!operation) throw new Error('Video production engine failed to initiate.');

    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      if (!operation.done) await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) throw new Error('Video production error: ' + operation.error.message);

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media) throw new Error('Failed to retrieve generated video asset.');

    const videoUrl = `${videoPart.media.url}&key=${input.apiKey || process.env.GEMINI_API_KEY}`;
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error('Failed to fetch video data from production node.');
    
    const buffer = await response.arrayBuffer();
    const base64Video = Buffer.from(buffer).toString('base64');

    return {
      videoDataUri: `data:video/mp4;base64,${base64Video}`,
      description: `Professional ${input.isUgc ? 'UGC' : 'Studio'} ad for ${input.productName} generated successfully.`
    };
  } catch (error: any) {
    console.error("Veo Generation Error:", error);
    throw new Error("The AI Video node encountered a constraint. Ensure your product image is wholesome and clearly shows the garment.");
  }
}
