'use server';
/**
 * @fileOverview A flow that generates Next.js UI code from a description.
 *
 * - generateUiCode - A function that generates Next.js UI code.
 * - GenerateUiCodeInput - The input type for the generateUiCode function.
 * - GenerateUiCodeOutput - The return type for the generateUiCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateUiCodeInputSchema = z.object({
  description: z
    .string()
    .describe('The description of the UI to generate, including desired components, layout, and functionality.'),
  primaryColor: z
    .string()
    .default('#1A202C')
    .describe('The primary color of the UI in hex format.'),
  secondaryColor: z
    .string()
    .default('#EDF2F7')
    .describe('The secondary color of the UI in hex format.'),
  accentColor: z
    .string()
    .default('#4DC0B5')
    .describe('The accent color of the UI in hex format.'),
});
export type GenerateUiCodeInput = z.infer<typeof GenerateUiCodeInputSchema>;

const GenerateUiCodeOutputSchema = z.object({
  code: z.string().describe('The generated Next.js code for the UI.'),
});
export type GenerateUiCodeOutput = z.infer<typeof GenerateUiCodeOutputSchema>;

export async function generateUiCode(input: GenerateUiCodeInput): Promise<GenerateUiCodeOutput> {
  return generateUiCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateUiCodePrompt',
  input: {schema: GenerateUiCodeInputSchema},
  output: {schema: GenerateUiCodeOutputSchema},
  prompt: `You are an expert Next.js developer who specializes in generating UI code from descriptions.

You will generate Next.js code based on the description provided, using the specified colors for styling.

Description: {{{description}}}
Primary Color: {{{primaryColor}}}
Secondary Color: {{{secondaryColor}}}
Accent Color: {{{accentColor}}}

Ensure the code is well-formatted, readable, and follows Next.js best practices. Return only the code.

Do not include any explanation or surrounding text. Just the code.
`,
});

const generateUiCodeFlow = ai.defineFlow(
  {
    name: 'generateUiCodeFlow',
    inputSchema: GenerateUiCodeInputSchema,
    outputSchema: GenerateUiCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
