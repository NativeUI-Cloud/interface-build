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

    const systemPrompt = `You are a helpful AI Assistant for NativeUI Builder, an application that allows users to visually create and manage AI workflows using nodes and connections.
Your goal is to answer questions about how to use the application, its features (like AI Agents, Chat Triggers, connecting models), and general concepts of building AI workflows within this tool.
Be concise and helpful. The user's name is 'user'.`;

    try {
      const generateOptions: any = {
        model: 'googleai/gemini-1.5-pro-latest', // Or another suitable general model
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
      console.error('Error processing general assistant chat message:', error);
      return { 
        aiResponse: '', 
        error: error.message || 'Failed to get response from AI assistant.'
      };
    }
  }
);
