'use server';
/**
 * @fileOverview A Genkit flow for generating User-Generated Content (UGC) campaign assets.
 *
 * - generateUgcCampaignAssets - A function that handles the generation of creative hooks, scripts, and creator briefs.
 * - GenerateUgcCampaignAssetsInput - The input type for the generateUgcCampaignAssets function.
 * - GenerateUgcCampaignAssetsOutput - The return type for the generateUgcCampaignAssets function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateUgcCampaignAssetsInputSchema = z.object({
  productDescription: z.string().describe('A detailed description of the product for which UGC is being generated.'),
  targetAudience: z.string().describe('Description of the target audience for the UGC campaign.'),
  campaignGoal: z.string().describe('The primary goal of the UGC campaign (e.g., brand awareness, sales, engagement, lead generation).'),
  keyFeatures: z.array(z.string()).describe('A list of key product features or selling points to highlight in the UGC.'),
  desiredTone: z.string().describe('The desired tone for the UGC (e.g., funny, informative, inspiring, authentic, relatable).'),
});
export type GenerateUgcCampaignAssetsInput = z.infer<typeof GenerateUgcCampaignAssetsInputSchema>;

const GenerateUgcCampaignAssetsOutputSchema = z.object({
  creativeHooks: z.array(z.string()).describe('An array of 10 creative, attention-grabbing hooks suitable for short-form video or social media posts.'),
  scriptIdeas: z.array(z.object({
    title: z.string().describe('A title for the script idea.'),
    script: z.string().describe('A detailed script idea outlining the scene, dialogue, and call to action.'),
  })).describe('An array of detailed script ideas for UGC videos/posts.'),
  creatorBrief: z.string().describe('A comprehensive creator brief, including campaign overview, objectives, key messages, target audience, technical requirements, and legal guidelines.'),
});
export type GenerateUgcCampaignAssetsOutput = z.infer<typeof GenerateUgcCampaignAssetsOutputSchema>;

export async function generateUgcCampaignAssets(input: GenerateUgcCampaignAssetsInput): Promise<GenerateUgcCampaignAssetsOutput> {
  return ugcCampaignAssetsFlow(input);
}

const ugcCampaignAssetsPrompt = ai.definePrompt({
  name: 'ugcCampaignAssetsPrompt',
  input: { schema: GenerateUgcCampaignAssetsInputSchema },
  output: { schema: GenerateUgcCampaignAssetsOutputSchema },
  prompt: `You are an expert marketing manager specializing in User-Generated Content (UGC) campaigns. Your task is to generate creative hooks, detailed script ideas, and a comprehensive creator brief based on the provided product and campaign details.

Product Description: {{{productDescription}}}
Target Audience: {{{targetAudience}}}
Campaign Goal: {{{campaignGoal}}}
Key Features to Highlight:
{{#each keyFeatures}}- {{{this}}}
{{/each}}
Desired Tone: {{{desiredTone}}}

Based on the above information, generate the following:

1.  **10 Creative Hooks**: These should be short, engaging, and designed to grab attention on social media platforms.
2.  **Detailed Script Ideas**: Provide 2-3 distinct script ideas. Each script should include a title, a brief scene description, potential dialogue/narration, and a clear call to action.
3.  **Comprehensive Creator Brief**: This brief should guide a content creator and include:
    -   Campaign Overview & Objectives
    -   Key Messages to Convey
    -   Target Audience description
    -   Content Requirements (e.g., video length, format, key visuals)
    -   Call to Action (CTA)
    -   Mandatory Inclusions (e.g., hashtags, product mentions)
    -   Things to Avoid
    -   Legal & Disclosure Guidelines
`,
});

const ugcCampaignAssetsFlow = ai.defineFlow(
  {
    name: 'ugcCampaignAssetsFlow',
    inputSchema: GenerateUgcCampaignAssetsInputSchema,
    outputSchema: GenerateUgcCampaignAssetsOutputSchema,
  },
  async (input) => {
    const { output } = await ugcCampaignAssetsPrompt(input);
    if (!output) {
      throw new Error('Failed to generate UGC campaign assets.');
    }
    return output;
  }
);
