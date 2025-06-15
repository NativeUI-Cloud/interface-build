
'use server';
/**
 * @fileOverview A Genkit flow to handle chat with a general AI assistant for NativeUI Builder.
 *
 * - generalAssistantChat - A function that sends user input to an LLM with a specific system prompt.
 * - GeneralAssistantChatInput - The input type for the generalAssistantChat function.
 * - GeneralAssistantChatOutput - The return type for the generalAssistantChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GeneralAssistantChatInputSchema = z.object({
  userInput: z.string().describe('The user-provided message to the assistant.'),
});
export type GeneralAssistantChatInput = z.infer<typeof GeneralAssistantChatInputSchema>;

const GeneralAssistantChatOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated response from the assistant.'),
  error: z.string().optional().describe('Error message if processing failed.'),
});
export type GeneralAssistantChatOutput = z.infer<typeof GeneralAssistantChatOutputSchema>;

export async function generalAssistantChat(input: GeneralAssistantChatInput): Promise<GeneralAssistantChatOutput> {
  return generalAssistantChatFlow(input);
}

const generalAssistantChatFlow = ai.defineFlow(
  {
    name: 'generalAssistantChatFlow',
    inputSchema: GeneralAssistantChatInputSchema,
    outputSchema: GeneralAssistantChatOutputSchema,
  },
  async (input: GeneralAssistantChatInput): Promise<GeneralAssistantChatOutput> => {
    const { userInput } = input;

    // Use the default model configured in genkit.ts, or fallback if necessary
    const modelToUse = ai.defaultModel?.name || 'googleai/gemini-1.5-pro-latest';
    const provider = modelToUse.split('/')[0];

    console.log(`[generalAssistantChatFlow] Attempting to use model: ${modelToUse}`);

    const systemPrompt = `You are a helpful AI Assistant for NativeUI Builder, an application that allows users to visually create and manage AI workflows using nodes and connections.
Your goal is to answer questions about how to use the application, its features (like AI Agents, Chat Triggers, connecting models), and general concepts of building AI workflows within this tool.
Be concise and helpful. The user's name is 'user'.`;

    try {
      const generateOptions: any = {
        model: modelToUse,
        prompt: userInput,
        history: [{role: 'system', content: [{text: systemPrompt}]}],
        config: {
          safetySettings: [ // These are Google-specific; OpenAI handles safety differently or by default.
            // Consider making safetySettings conditional based on provider if strictness varies.
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
      console.error('Error processing general assistant chat message:', error);
      let errorMessage = error.message || 'Failed to get response from AI assistant.';
       if (error.message && (error.message.includes('[429 Too Many Requests]') || error.message.includes('429'))) {
        errorMessage = `You've exceeded the current quota for the AI model (${modelToUse}). Please check your plan and billing details with the AI provider. `;
        if (provider === 'googleai') {
          errorMessage += `For Google AI, visit: https://ai.google.dev/gemini-api/docs/rate-limits.`;
        } else if (provider === 'openai') {
          errorMessage += `For OpenAI, check your usage at https://platform.openai.com/usage.`;
        } else {
          errorMessage += `Please consult the provider's documentation for rate limits.`;
        }
      }
      return { 
        aiResponse: '', 
        error: errorMessage
      };
    }
  }
);

