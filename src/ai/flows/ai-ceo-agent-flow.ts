'use server';
/**
 * @fileOverview AI CEO Agent - Comprehensive Strategic & Financial Orchestration.
 * Trained to perform autonomous CEO tasks across 5 pillars: Growth, Profit, Inventory, Risk, and Strategy.
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
  pillars: z.object({
    revenueGrowth: z.array(z.string()).describe('Revenue growth strategies for approval.'),
    costOptimization: z.array(z.string()).describe('Cost and profit optimization tasks.'),
    inventoryPlanning: z.array(z.string()).describe('Inventory and supply chain actions.'),
    riskMonitoring: z.array(z.string()).describe('Risk and compliance alerts.'),
    strategicPlanning: z.array(z.string()).describe('Top-level strategic roadmap items.'),
  }),
  narrative: z.string().describe('Executive summary of business health.'),
  leakageInsights: z.array(z.object({
    reason: z.string(),
    impact: z.string(),
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
    prompt: `You are the AI CEO of a premier e-commerce brand operating on {{marketplace}} in India. 
    You act autonomously but require user approval for all strategic shifts.
    
    Training Context (Report Signals):
    {{reportSummary}}
    
    Your Mission:
    Perform a deep-dive analysis across 5 Business Pillars and output exactly 2 actionable items for each for user approval.
    
    1. REVENUE GROWTH: Identify scaling opportunities. (e.g., "Increase budget by 20% for SKU-X showing 4x ROAS").
    2. COST & PROFIT OPTIMIZATION: Identify margin erosion. (e.g., "Pause ads for Style-Y where returns are eating 100% of profit").
    3. INVENTORY & SUPPLY PLANNING: Capital efficiency. (e.g., "Liquidate 500 units of slow-moving Style-Z to free up ₹5L capital").
    4. RISK & COMPLIANCE: Marketplace health. (e.g., "Address 3 negative reviews on Amazon listing to prevent Buy Box loss").
    5. STRATEGIC PLANNING: Prioritization. (e.g., "Shift focus to Nykaa for the 'Silk' category as competition is 30% lower than Myntra").
    
    Return professional financial metrics and a concise executive narrative.`,
  });

  return output!;
}
