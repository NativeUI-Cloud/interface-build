
'use server';
/**
 * @fileOverview A Genkit flow to generate Next.js code from a user's description.
 *
 * - aiCodeChat - A function that generates Next.js code.
 * - AiCodeChatInput - The input type for the aiCodeChat function.
 * - AiCodeChatOutput - The return type for the aiCodeChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiCodeChatInputSchema = z.object({
  description: z.string().describe('A detailed description of the Next.js component or page section the user wants to build. Include functionality, desired UI elements (ShadCN if applicable), and overall purpose.'),
  // Optionally, add context later like existing code snippets or project structure
});
export type AiCodeChatInput = z.infer<typeof AiCodeChatInputSchema>;

const AiCodeChatOutputSchema = z.object({
  code: z.string().nullable().describe('The generated Next.js React functional component code as a single string. This should be ready to be copy-pasted into a .tsx file.'),
  explanation: z.string().nullable().describe('A brief explanation of the generated code, if any. (Currently not requested from AI, can be added later)'),
  error: z.string().optional().describe('Error message if code generation failed.'),
});
export type AiCodeChatOutput = z.infer<typeof AiCodeChatOutputSchema>;


export async function aiCodeChat(input: AiCodeChatInput): Promise<AiCodeChatOutput> {
  return aiCodeChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiCodeChatPrompt',
  input: {schema: AiCodeChatInputSchema},
  output: {schema: z.object({ code: z.string().describe('The generated Next.js code for the component/page.') }) }, // AI should only output the code string
  prompt: `You are an expert Next.js 14+ (App Router) and React developer specializing in creating modern, responsive, and functional UI components and page sections.
The user will provide a description of what they want to build. Your task is to generate a single, self-contained Next.js React functional component (.tsx) based on this description.

**User Request:**
{{{description}}}

**Key Guidelines:**
1.  **Technology Stack:**
    *   Next.js (App Router by default, Server Components preferred unless client-side interactivity is explicitly required and cannot be achieved otherwise).
    *   React (Functional Components with Hooks).
    *   TypeScript.
    *   Tailwind CSS for styling.
    *   ShadCN UI components (from \`@/components/ui/...\`) should be heavily preferred for common UI elements like Buttons, Cards, Inputs, Dialogs, etc. Assume all ShadCN components are available.
    *   Lucide Icons (\`lucide-react\`) for icons. Assume all lucide-react icons are available for import.
2.  **Code Structure:**
    *   Generate a single default exported functional component.
    *   Include all necessary imports at the top (React, Next.js features like \`next/image\`, ShadCN components, lucide-react icons).
    *   If client-side interactivity is absolutely necessary (e.g., state management with \`useState\`, effects with \`useEffect\`), include \`'use client';\` at the top of the file. Otherwise, aim for Server Components.
    *   Ensure the component returns a single root JSX element.
3.  **Styling:**
    *   Use Tailwind CSS utility classes extensively for styling.
    *   Apply responsive design principles (e.g., \`md:\`, \`lg:\` prefixes).
4.  **Placeholders:**
    *   For images, use \`next/image\` and placeholder URLs like \`https://placehold.co/WIDTHxHEIGHT.png\`. Add a \`data-ai-hint\` attribute with 1-2 keywords for image search (e.g., \`data-ai-hint="abstract background"\`).
    *   For text content that isn't specified, use relevant placeholder text (e.g., "Dynamic Page Title", "Feature description goes here...").
5.  **Output Format:**
    *   **CRITICAL: Respond ONLY with the TypeScript code for the component.**
    *   Do NOT include any explanations, markdown formatting (like \`\`\`tsx ... \`\`\`), or any other text before or after the code block.
    *   The output must be directly usable as the content of a \`.tsx\` file.

Generate the Next.js component code now.
`,
});

const aiCodeChatFlow = ai.defineFlow(
  {
    name: 'aiCodeChatFlow',
    inputSchema: AiCodeChatInputSchema,
    outputSchema: AiCodeChatOutputSchema,
  },
  async (input: AiCodeChatInput) => {
    let modelUsedForError = ai.defaultModel?.name || 'unknown_default_model';
    try {
      // The prompt() call uses the default model configured in genkit.ts
      const { output } = await prompt(input); 
      modelUsedForError = prompt.model?.name || modelUsedForError; // Update with actual model if available from prompt object

      if (output && output.code) {
        return { code: output.code, explanation: null, error: undefined };
      } else {
        return { code: null, explanation: null, error: "AI did not return valid code." };
      }
    } catch (error: any) {
      console.error("Error in aiCodeChatFlow:", error);
      let errorMessage = error.message || "Failed to generate code.";
      const provider = modelUsedForError.split('/')[0];

      if (error.message && (error.message.includes('[429 Too Many Requests]') || error.message.includes('429'))) {
        errorMessage = `You've exceeded the current quota for the AI model (${modelUsedForError}). Please check your plan and billing details with the AI provider. `;
        if (provider === 'googleai') {
          errorMessage += `For Google AI, visit: https://ai.google.dev/gemini-api/docs/rate-limits.`;
        } else if (provider === 'openai') {
          errorMessage += `For OpenAI, check your usage at https://platform.openai.com/usage.`;
        } else {
          errorMessage += `Please consult the provider's documentation for rate limits.`;
        }
      }
      return { code: null, explanation: null, error: errorMessage };
    }
  }
);

