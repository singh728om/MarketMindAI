'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating detailed narrative summaries for client performance reports.
 *
 * - generateClientReportNarrative - A function that generates a narrative summary based on client performance data.
 * - GenerateClientReportNarrativeInput - The input type for the generateClientReportNarrative function.
 * - GenerateClientReportNarrativeOutput - The return type for the generateClientReportNarrative function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateClientReportNarrativeInputSchema = z.object({
  clientName: z.string().describe('The name of the client for whom the report is being generated.').default('Client'),
  reportPeriod: z.string().describe('The reporting period (e.g., "Last Week", "October 2023").').default('This Week'),
  kpis: z.object({
    sales: z.string().describe('Formatted sales performance data (e.g., "$10,000", "+5% from last week").').default('N/A'),
    ctr: z.string().describe('Formatted click-through rate (CTR) data (e.g., "5.2%", "-0.5% point").').default('N/A'),
    conversion: z.string().describe('Formatted conversion rate data (e.g., "3.1%", "stable").').default('N/A'),
    roas: z.string().describe('Formatted return on ad spend (ROAS) data (e.g., "3.1x", "improved").').default('N/A'),
  }).describe('Key Performance Indicators for the report.'),
  weeklyPerformanceData: z.string().describe('A JSON string representing detailed weekly performance data (e.g., impressions, clicks, spend over time).').default('{}'),
  additionalContext: z.string().optional().describe('Any additional context or specific points to highlight in the narrative.').default(''),
});
export type GenerateClientReportNarrativeInput = z.infer<typeof GenerateClientReportNarrativeInputSchema>;

const GenerateClientReportNarrativeOutputSchema = z.object({
  narrativeSummary: z.string().describe('A detailed narrative summary of the client\'s performance.'),
});
export type GenerateClientReportNarrativeOutput = z.infer<typeof GenerateClientReportNarrativeOutputSchema>;

export async function generateClientReportNarrative(input: GenerateClientReportNarrativeInput): Promise<GenerateClientReportNarrativeOutput> {
  return generateClientReportNarrativeFlow(input);
}

const generateClientReportNarrativePrompt = ai.definePrompt({
  name: 'generateClientReportNarrativePrompt',
  input: { schema: GenerateClientReportNarrativeInputSchema },
  output: { schema: GenerateClientReportNarrativeOutputSchema },
  prompt: `You are an expert marketing analyst specialized in e-commerce, generating a client performance report for {{clientName}} for the period {{reportPeriod}}.
Based on the following data, write a concise, professional, and insightful narrative summary highlighting key performance indicators, trends, and actionable insights. Focus on clarity and value for the client.

---
Client Name: {{clientName}}
Report Period: {{reportPeriod}}

Key Performance Indicators:
- Sales: {{{kpis.sales}}}
- Click-Through Rate (CTR): {{{kpis.ctr}}}
- Conversion Rate: {{{kpis.conversion}}}
- Return on Ad Spend (ROAS): {{{kpis.roas}}}

Weekly Performance Data (JSON for trend analysis):
{{{weeklyPerformanceData}}}

Additional Context:
{{{additionalContext}}}
---

Please generate a narrative summary that covers:
1. Overall performance summary and key takeaways.
2. Detailed analysis of each KPI, explaining changes or stability.
3. Notable trends observed from the weekly performance data, if available.
4. Actionable insights or recommendations based on the performance to drive future growth.

Ensure the narrative is professional, easy to understand, and provides clear value to the client, concluding with a forward-looking statement.`,
});

const generateClientReportNarrativeFlow = ai.defineFlow(
  {
    name: 'generateClientReportNarrativeFlow',
    inputSchema: GenerateClientReportNarrativeInputSchema,
    outputSchema: GenerateClientReportNarrativeOutputSchema,
  },
  async (input) => {
    const { output } = await generateClientReportNarrativePrompt(input);
    return output!;
  },
);
