
'use server';
/**
 * @fileOverview AI CEO Agent - Financial & Strategic Analysis for E-commerce.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit';

const AICeoInputSchema = z.object({
  marketplace: z.enum(['Amazon', 'Flipkart', 'Myntra', 'Ajio', 'Nykaa']),
  reportSummary: z.string().describe('Combined summary text or filenames of uploaded Sales, Inventory, Returns, and Ads reports.'),
  apiKey: z.string().optional(),
});
export type AICeoInput = z.infer<typeof AICeoInputSchema>;

const AICeoOutputSchema = z.object({
  metrics: z.object({
    totalSales: z.number().describe('Total revenue in INR.'),
    profit: z.number().describe('Net profit in INR.'),
    loss: z.number().describe('Identified loss/leakage in INR.'),
    returnRate: z.number().describe('Percentage of returns.'),
    ctr: z.number().describe('Click-through rate.'),
    roas: z.number().describe('Return on Ad Spend.'),
  }),
  recommendations: z.array(z.string()).describe('Top 3-5 high-impact CEO-level strategic actions.'),
  narrative: z.string().describe('A professional summary of the current business health.'),
});
export type AICeoOutput = z.infer<typeof AICeoOutputSchema>;

export async function runAICeoAnalysis(input: AICeoInput): Promise<AICeoOutput> {
  const ai = genkit({
    plugins: [googleAI({ apiKey: input.apiKey })],
  });

  const { output } = await ai.generate({
    model: 'googleai/gemini-2.5-flash',
    input: input,
    output: { schema: AICeoOutputSchema },
    prompt: `You are the AI CEO of a high-growth e-commerce brand operating on {{marketplace}} in India.
    
    Context:
    You have been provided with the following business intelligence signals:
    {{reportSummary}}
    
    Your Task:
    1. Act as a data-driven CEO to extract financial performance metrics.
    2. Analyze Profit vs Loss including ad spend leakage and return impacts.
    3. Generate exactly 4 strategic recommendations to increase ROAS and reduce returns.
    4. Provide a 2-sentence executive summary of the brand's health.
    
    Constraints:
    - Return numbers only (no strings in metric fields).
    - Ensure profit and loss are calculated realistically based on typical e-commerce margins (15-25%).
    - Recommendations must be actionable (e.g., "Liquidate slow-moving SKU-X" or "Shift 20% budget to high-CTR keywords").`,
  });

  return output!;
}
