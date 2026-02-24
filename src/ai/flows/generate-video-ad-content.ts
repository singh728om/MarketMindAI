'use server';
/**
 * @fileOverview Product to AI Video Ads Agent.
 * Generates cinematic commercial video content using Google Veo with Image-to-Video support.
 * Optimized with safety-first prompting for policy compliance.
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
    : "high-end professional studio commercial, steady cinematic camera movement, dramatic fashion lighting, 8k resolution, modest presentation";

  let modelContext = "";
  if (input.modelType === 'mens') {
    modelContext = "The product is showcased by a professional male commercial talent in a modest and upscale manner.";
  } else if (input.modelType === 'womens') {
    modelContext = "The product is showcased by a professional female commercial talent in a modest and upscale manner.";
  } else if (input.modelType === 'kids') {
    modelContext = `The video features a wholesome and professional children's fashion presentation. A young talent is shown in a safe, modest, and family-oriented commercial setting wearing the ${input.productName}.`;
  } else {
    modelContext = "The video features the product alone in a clean, professional and high-fidelity showcase.";
  }

  const prompt = `Create a cinematic, family-friendly e-commerce product video for "${input.productName}" in the "${input.productCategory}" category.
  SCENE: The product is showcased in a ${input.background} environment.
  MODEL: ${modelContext}
  STYLE: ${styleContext}.
  MARKETING CONTEXT: ${input.marketingText || 'Premium quality, wholesome lifestyle appeal.'}
  
  MOTION: Subtle, elegant camera movement around the product. Keep the product central and perfectly in focus. 
  The video should feel like a high-converting, safe, and professional advertisement for a reputable brand.`;

  try {
    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: [
        { text: prompt },
        { media: { url: input.photoDataUri, contentType: 'image/jpeg' } }
      ],
      config: {
        durationSeconds: input.durationSeconds > 8 ? 8 : input.durationSeconds,
        aspectRatio: '9:16',
        safetySettings: [
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }
        ]
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
    throw new Error(error.message || "The AI Video node is currently busy. Please try again in a few moments.");
  }
}
