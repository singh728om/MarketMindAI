'use server';
/**
 * @fileOverview A Genkit flow for generating structured product catalog templates.
 *
 * - generateCatalogTemplate - A function that handles the generation of catalog templates.
 * - GenerateCatalogTemplateInput - The input type for the generateCatalogTemplate function.
 * - GenerateCatalogTemplateOutput - The return type for the generateCatalogTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCatalogTemplateInputSchema = z.object({
  marketplaces: z
    .array(z.string())
    .describe('List of target marketplaces (e.g., Amazon, Flipkart, Myntra).'),
  productType: z.string().describe('The type of product (e.g., Apparel, Electronics, Home Goods).'),
  desiredAttributes: z
    .array(z.string())
    .optional()
    .describe(
      'An optional list of key attributes to include in the template (e.g., color, size, material).'
    ),
});
export type GenerateCatalogTemplateInput = z.infer<typeof GenerateCatalogTemplateInputSchema>;

const GenerateCatalogTemplateOutputSchema = z.object({
  templateContent: z
    .string()
    .describe(
      'The generated product catalog template content, formatted as a CSV string with a header row.'
    ),
  notes: z
    .string()
    .optional()
    .describe(
      'Any additional notes or suggestions regarding the generated template or best practices for the specified marketplaces.'
    ),
});
export type GenerateCatalogTemplateOutput = z.infer<typeof GenerateCatalogTemplateOutputSchema>;

export async function generateCatalogTemplate(
  input: GenerateCatalogTemplateInput
): Promise<GenerateCatalogTemplateOutput> {
  return generateCatalogTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCatalogTemplatePrompt',
  input: {schema: GenerateCatalogTemplateInputSchema},
  output: {schema: GenerateCatalogTemplateOutputSchema},
  prompt: `You are an expert in e-commerce product catalog management, specializing in various marketplaces.
Your task is to generate a structured product catalog template in CSV format based on the provided product type, target marketplaces, and desired attributes.

The template should include a header row with appropriate column names. If 'desiredAttributes' are not provided, suggest common and essential attributes for the given 'productType' and 'marketplaces'.
Prioritize attributes that are crucial for listing quality, SEO, and product variations across the specified marketplaces.

Generate the CSV content first, followed by any 'notes' or suggestions.

Marketplaces: {{{marketplaces}}}
Product Type: {{{productType}}}
{{#if desiredAttributes}}
Desired Attributes: {{{desiredAttributes}}}
{{else}}
Desired Attributes: (None specified, please suggest)
{{/if}}

Output format example:
{
  "templateContent": "column1,column2,column3\nvalue1,value2,value3",
  "notes": "Your notes here"
}
`,
});

const generateCatalogTemplateFlow = ai.defineFlow(
  {
    name: 'generateCatalogTemplateFlow',
    inputSchema: GenerateCatalogTemplateInputSchema,
    outputSchema: GenerateCatalogTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
