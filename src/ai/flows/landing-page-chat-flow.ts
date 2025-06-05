
'use server';
/**
 * @fileOverview A Genkit flow to handle chat with an AI assistant for building landing pages.
 *
 * - landingPageChat - A function that sends user input to an LLM for landing page assistance.
 * - LandingPageChatInput - The input type for the landingPageChat function.
 * - LandingPageChatOutput - The return type for the landingPageChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import type { LandingPageChatInput, LandingPageChatOutput } from '@/lib/types';

const LandingPageChatInputSchema = z.object({
  userInput: z.string().describe('The user-provided message to the assistant.'),
  currentPageContext: z.string().optional().describe('A string representation of the current page structure. (Future use)'),
  selectedModelIdentifier: z.string().optional().describe('The qualified identifier of the selected AI model (e.g., "googleai/gemini-1.5-pro-latest").'),
});

const LandingPageChatOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated response from the assistant.'),
  error: z.string().optional().describe('Error message if processing failed.'),
});

export async function landingPageChat(input: LandingPageChatInput): Promise<LandingPageChatOutput> {
  return landingPageChatFlow(input);
}

const landingPageChatFlow = ai.defineFlow(
  {
    name: 'landingPageChatFlow',
    inputSchema: LandingPageChatInputSchema,
    outputSchema: LandingPageChatOutputSchema,
  },
  async (input: LandingPageChatInput): Promise<LandingPageChatOutput> => {
    const { userInput, selectedModelIdentifier } = input;

    const modelToUse = selectedModelIdentifier || 'googleai/gemini-1.5-pro-latest';
    console.log(`[landingPageChatFlow] Attempting to use model: ${modelToUse}`);

    const systemPrompt = `You are an AI assistant helping a user build a landing page using a visual builder.
The user said: "${userInput}".

If the user is asking to make a change to the page (e.g., "add a hero section", "change the button color to blue", "create three columns with feature cards"), respond by acknowledging the request and explaining that while you understand what they want to do, the ability to directly modify the page via chat is still under development. Offer to provide guidance on how they might achieve this using the builder's tools, or offer to generate HTML/CSS/React code snippets they could manually integrate if they were coding directly.

If the user is asking a general question about landing page design principles, Next.js, Tailwind CSS, or ShadCN UI components, answer it helpfully and concisely.
For example, if they ask "how do I make a good hero section?", you can give design tips. If they ask "what's a good Tailwind class for a primary button?", you can suggest some.

Be concise and helpful. Do not attempt to generate full page code unless specifically asked for a snippet.
Your primary role here is to guide and assist with planning, not to directly execute complex page manipulations in this current version.`;

    try {
      const generateOptions: any = {
        model: modelToUse, 
        prompt: userInput,
        history: [{role: 'system', content: [{text: systemPrompt}]}],
        config: {
          safetySettings: [
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          ],
        },
      };
      
      const response = await ai.generate(generateOptions);
      const aiResponseText = response.text;

      if (aiResponseText) {
        return { aiResponse: aiResponseText };
      } else {
        return { aiResponse: '', error: 'AI did not return a text response.' };
      }
    } catch (error: any) {
      console.error('Error processing landing page chat message:', error);
      let errorMessage = error.message || 'Failed to get response from AI assistant.';
      
      if (error.message && error.message.includes('[429 Too Many Requests]')) {
        errorMessage = `You've exceeded the current quota for the selected model (${modelToUse}). Please check your plan and billing details with the AI provider (e.g., Google AI). For more info, visit: https://ai.google.dev/gemini-api/docs/rate-limits`;
      } else if (error.cause && error.cause.message && error.cause.message.includes('Plugin googleAI not found')) {
          errorMessage = `The selected model (${selectedModelIdentifier}) could not be processed. The required Genkit plugin (e.g., for OpenAI, Anthropic) might not be configured in genkit.ts. Only Google AI models are currently enabled.`;
      } else if (error.details && error.details.includes("NOT_FOUND")) {
        errorMessage = `Model '${selectedModelIdentifier}' not found or access denied. Ensure it's a valid model for a configured Genkit plugin.`;
      }
      return { 
        aiResponse: '', 
        error: errorMessage
      };
    }
  }
);

    
