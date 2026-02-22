'use server';
/**
 * @fileOverview A Genkit flow for the Reviews & Reputation Agent.
 *
 * - manageReviewsAndReputation - A function that generates personalized response templates for customer reviews
 *   and summarizes key insights from review sentiment.
 * - ManageReviewsAndReputationInput - The input type for the manageReviewsAndReputation function.
 * - ManageReviewsAndReputationOutput - The return type for the manageReviewsAndReputation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ManageReviewsAndReputationInputSchema = z.object({
  customerReview: z.string().describe('The full text of the customer review.'),
  productName: z.string().describe('The name of the product the review is for.'),
  brandName: z.string().describe('The name of the brand.'),
  reviewSentiment: z.enum(['positive', 'negative', 'neutral']).describe('The overall sentiment of the customer review.'),
  marketplace: z.string().describe('The marketplace where the review was posted (e.g., Amazon, Flipkart, Myntra).'),
});
export type ManageReviewsAndReputationInput = z.infer<typeof ManageReviewsAndReputationInputSchema>;

const ManageReviewsAndReputationOutputSchema = z.object({
  responseTemplate: z.string().describe('A personalized, professional, and empathetic response template for the customer review.'),
  sentimentInsights: z.string().describe('Key insights and a summary of the sentiment from the customer review, highlighting actionable feedback for the brand manager.'),
});
export type ManageReviewsAndReputationOutput = z.infer<typeof ManageReviewsAndReputationOutputSchema>;

export async function manageReviewsAndReputation(input: ManageReviewsAndReputationInput): Promise<ManageReviewsAndReputationOutput> {
  return manageReviewsAndReputationFlow(input);
}

const manageReviewsAndReputationPrompt = ai.definePrompt({
  name: 'manageReviewsAndReputationPrompt',
  input: { schema: ManageReviewsAndReputationInputSchema },
  output: { schema: ManageReviewsAndReputationOutputSchema },
  prompt: `You are a skilled brand manager assistant for the brand '{{{brandName}}}'.
Your task is to analyze customer reviews for the product '{{{productName}}}' on '{{{marketplace}}}'.

Based on the provided customer review and its sentiment, you need to perform two main actions:

1.  **Generate a personalized response template for the customer.** The response should be professional, empathetic, and address the specific points raised in the review. Maintain the brand's tone and focus on customer satisfaction.
2.  **Summarize key insights from the review's sentiment.** Provide actionable feedback for the brand manager, highlighting what customers liked or disliked, recurring themes, or potential areas for product/service improvement.

Customer Review: """{{{customerReview}}}"""
Review Sentiment: {{{reviewSentiment}}}

Ensure both the response template and sentiment insights are concise and directly address the input.`,
});

const manageReviewsAndReputationFlow = ai.defineFlow(
  {
    name: 'manageReviewsAndReputationFlow',
    inputSchema: ManageReviewsAndReputationInputSchema,
    outputSchema: ManageReviewsAndReputationOutputSchema,
  },
  async (input) => {
    const { output } = await manageReviewsAndReputationPrompt(input);
    return output!;
  }
);
