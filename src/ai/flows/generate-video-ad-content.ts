'use server';
/**
 * @fileOverview A Genkit flow for generating video ad content, including storyboards and prompts, based on product information.
 *
 * - generateVideoAdContent - A function that handles the video ad content generation process.
 * - GenerateVideoAdContentInput - The input type for the generateVideoAdContent function.
 * - GenerateVideoAdContentOutput - The return type for the generateVideoAdContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVideoAdContentInputSchema = z.object({
  productName: z.string().describe('The name of the product.'),
  productDescription: z
    .string()
    .describe('A detailed description of the product.'),
  targetAudience: z
    .string()
    .optional()
    .describe('The target audience for the video ad.'),
  keyFeatures: z
    .array(z.string())
    .optional()
    .describe('Key features or selling points of the product.'),
  callToAction: z
    .string()
    .optional()
    .describe('The desired call to action for the ad (e.g., "Shop Now", "Learn More").'),
  adGoal: z
    .string()
    .optional()
    .describe('The primary goal of the ad (e.g., "increase sales", "build brand awareness").'),
});
export type GenerateVideoAdContentInput = z.infer<
  typeof GenerateVideoAdContentInputSchema
>;

const GenerateVideoAdContentOutputSchema = z.object({
  storyboard: z
    .array(
      z.object({
        sceneNumber: z.number().describe('The sequential number of the scene.'),
        description: z.string().describe('A brief description of the scene.'),
        visualElements: z
          .string()
          .optional()
          .describe('Key visual components and setting for the scene.'),
        audioElements: z
          .string()
          .optional()
          .describe('Suggested audio elements like music, sound effects, or narration.'),
      })
    )
    .describe('A step-by-step storyboard for the video advertisement.'),
  videoGenerationPrompt: z
    .string()
    .describe(
      'A detailed prompt suitable for a text-to-video AI model to generate the advertisement.'
    ),
  creativeIdeas: z
    .array(z.string())
    .optional()
    .describe('Additional creative suggestions for the video ad.'),
});
export type GenerateVideoAdContentOutput = z.infer<
  typeof GenerateVideoAdContentOutputSchema
>;

export async function generateVideoAdContent(
  input: GenerateVideoAdContentInput
): Promise<GenerateVideoAdContentOutput> {
  return generateVideoAdContentFlow(input);
}

const generateVideoAdContentPrompt = ai.definePrompt({
  name: 'generateVideoAdContentPrompt',
  input: {schema: GenerateVideoAdContentInputSchema},
  output: {schema: GenerateVideoAdContentOutputSchema},
  prompt: `You are an expert video ad creative director for e-commerce, specializing in generating compelling storyboards and prompts for AI video generation models.

Based on the following product information, create a detailed storyboard for a short video advertisement (15-30 seconds) and a comprehensive prompt for an AI video generation tool (like Google's Veo or similar).

The video should be engaging, highlight key product features, and align with the specified ad goal and target audience.

Product Name: {{{productName}}}
Product Description: {{{productDescription}}}
{{#if targetAudience}}Target Audience: {{{targetAudience}}}{{/if}}
{{#if keyFeatures}}Key Features: {{#each keyFeatures}}- {{{this}}}{{/each}}{{/if}}
{{#if callToAction}}Call to Action: {{{callToAction}}}{{/if}}
{{#if adGoal}}Ad Goal: {{{adGoal}}}{{/if}}


Guidelines for Storyboard:
- Break the video into 3-5 distinct scenes.
- For each scene, provide a 'sceneNumber', 'description', 'visualElements', and 'audioElements'.
- The 'visualElements' should describe the camera angle, setting, and on-screen actions.
- The 'audioElements' should suggest background music, sound effects, or voice-over.
- Ensure a clear narrative flow that leads to the call to action.

Guidelines for Video Generation Prompt:
- Write a single, concise, and highly descriptive text prompt that an AI video model can use to generate the entire video.
- Include details about the overall style, mood, lighting, and transitions.
- Reference key elements from the storyboard.

Guidelines for Creative Ideas:
- Provide 2-3 additional, short creative ideas or alternative angles for the video ad.


Example Output Format:
{
  "storyboard": [
    {
      "sceneNumber": 1,
      "description": "Opening shot of product in an attractive setting.",
      "visualElements": "Close-up, slow pan over product on a minimalist table with soft natural light.",
      "audioElements": "Uplifting, modern background music starts."
    }
    // ... more scenes
  ],
  "videoGenerationPrompt": "Generate a 20-second commercial. A stylish, modern product is showcased on a minimalist white table with soft, warm natural light. Dynamic camera movements, smooth transitions between scenes. Upbeat electronic music throughout. Final scene displays product with 'Shop Now' text overlay.",
  "creativeIdeas": [
    "Idea 1", "Idea 2"
  ]
}
`,
});

const generateVideoAdContentFlow = ai.defineFlow(
  {
    name: 'generateVideoAdContentFlow',
    inputSchema: GenerateVideoAdContentInputSchema,
    outputSchema: GenerateVideoAdContentOutputSchema,
  },
  async (input) => {
    const {output} = await generateVideoAdContentPrompt(input);
    if (!output) {
      throw new Error('Failed to generate video ad content.');
    }
    return output;
  }
);
