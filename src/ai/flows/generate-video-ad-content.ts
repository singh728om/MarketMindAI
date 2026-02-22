'use server';
/**
 * @fileOverview Product to AI Video Ads Agent.
 * Generates cinematic 5s commercial video content using Google Veo.
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

  const prompt = `Create a high-end, 5-second cinematic UGC product commercial for "${input.productName}" in the "${input.productCategory}" category.
  The product should be showcased in a ${input.background} environment with professional studio lighting and smooth camera movement.
  MARKETING CONTEXT: ${input.marketingText || 'Premium quality, lifestyle appeal.'}
  
  Keep the video focused on the product. The style should be vibrant, clean, and optimized for social media engagement.`;

  try {
    let { operation } = await ai.generate({
      model: 'googleai/veo-2.0-generate-001',
      prompt: [
        { text: prompt },
        { media: { url: input.photoDataUri, contentType: 'image/jpeg' } }
      ],
      config: {
        durationSeconds: 5,
        aspectRatio: '9:16',
      },
    });

    if (!operation) throw new Error('Video production engine failed to initiate.');

    // Wait for production to complete (polling)
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      if (!operation.done) await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) throw new Error('Video production error: ' + operation.error.message);

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media) throw new Error('Failed to retrieve generated video asset.');

    // Fetch the video and convert to base64 for direct client delivery
    const videoUrl = `${videoPart.media.url}&key=${input.apiKey || process.env.GEMINI_API_KEY}`;
    const response = await fetch(videoUrl);
    if (!response.ok) throw new Error('Failed to fetch video data from production node.');
    
    const buffer = await response.arrayBuffer();
    const base64Video = Buffer.from(buffer).toString('base64');

    return {
      videoDataUri: `data:video/mp4;base64,${base64Video}`,
      description: `Professional UGC ad for ${input.productName} generated successfully.`
    };
  } catch (error: any) {
    console.error("Veo Generation Error:", error);
    throw new Error(error.message || "The AI Video node is currently busy. Please try again in a few moments.");
  }
}
