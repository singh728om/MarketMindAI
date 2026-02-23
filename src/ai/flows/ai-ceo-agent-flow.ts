
'use server';
/**
 * @fileOverview AI CEO Agent - Financial & Strategic Analysis for E-commerce.
 * Trained to perform high-level strategic tasks, identify margin erosion, and suggest budget shifts.
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
  leakageInsights: z.array(z.object({
    reason: z.string().describe('The cause of loss (e.g., "High Returns", "Low Orders", "Ad Waste").'),
    impact: z.string().describe('The financial impact or specific style identifier.'),
  })).describe('Specific style-level or operational loss identifiers.'),
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
    
    Training Context:
    You have been provided with signals from Sales, Inventory, Returns, and Ads reports:
    {{reportSummary}}
    
    Your Task (CEO-Level Execution):
    1. Act as a data-driven CEO to extract financial performance metrics.
    2. Analyze Profit vs Loss specifically looking for Margin Erosion.
    3. Identify EXACT causes of loss. Look for:
       - Styles causing loss due to high return rates (>25%). Identify them as "Leakage".
       - Ad Waste: Products with low conversion but high CPC.
       - Inventory Overhead: Slow moving styles eating up warehouse capital.
    4. Generate exactly 4 strategic recommendations. Examples:
       - "Shift 15% budget from SKU-A to high-performing SKU-B."
       - "Liquidate Style-X via Lightning Deal to free up ₹2L capital."
       - "Restrict Ad-visibility in Tier-3 cities for Fragile items to reduce returns by 10%."
    5. Provide a 2-sentence executive summary reflecting the Brand's pulse on {{marketplace}}.
    
    Constraints:
    - Return numbers only (no strings in metric fields).
    - Recommendations must be board-room level strategic actions, not just SEO tweaks.`,
  });

  return output!;
}
