
'use server';
/**
 * @fileOverview A Genkit flow to process a chat message using a specified AI model and prompt.
 *
 * - processChatMessage - A function that sends a user message to an LLM with a system prompt.
 * - ProcessChatMessageInput - The input type for the processChatMessage function.
 * - ProcessChatMessageOutput - The return type for the processChatMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import OpenAI from 'openai';

const ProcessChatMessageInputSchema = z.object({
  userInput: z.string().describe('The user-provided message.'),
  agentSystemPrompt: z.string().describe('The system prompt that guides the AI agent\'s behavior.'),
  modelId: z.string().describe('The identifier of the LLM to use (e.g., "gemini-1.5-pro-latest", "gpt-3.5-turbo").'),
  providerId: z.string().describe('The ID of the LLM provider (e.g., "googleai", "openai").'),
  apiKey: z.string().optional().describe('The API key for the selected provider. Required for most providers.'),
  apiEndpoint: z.string().optional().describe('The API endpoint for the selected provider, if non-default.'),
});
export type ProcessChatMessageInput = z.infer<typeof ProcessChatMessageInputSchema>;

const ProcessChatMessageOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-generated response to the user input.'),
  error: z.string().optional().describe('Error message if processing failed.'),
});
export type ProcessChatMessageOutput = z.infer<typeof ProcessChatMessageOutputSchema>;

export async function processChatMessage(input: ProcessChatMessageInput): Promise<ProcessChatMessageOutput> {
  return processChatMessageFlow(input);
}

const processChatMessageFlow = ai.defineFlow(
  {
    name: 'processChatMessageFlow',
    inputSchema: ProcessChatMessageInputSchema,
    outputSchema: ProcessChatMessageOutputSchema,
  },
  async (input: ProcessChatMessageInput): Promise<ProcessChatMessageOutput> => {
    let { userInput, agentSystemPrompt, modelId, apiKey, apiEndpoint, providerId } = input; // Made mutable

    // If OpenAI key is available AND the request is for GoogleAI, override to use OpenAI
    if (process.env.OPENAI_API_KEY && providerId === 'googleai') {
      console.log(`[processChatMessageFlow] Overriding GoogleAI request to use OpenAI (gpt-4o) due to OPENAI_API_KEY presence.`);
      providerId = 'openai';
      modelId = 'gpt-4o'; // Default OpenAI model
      // apiKey and apiEndpoint for OpenAI will be picked up by the OpenAI SDK path or from env if not passed explicitly
    }
    
    let attemptedModelForError = `${providerId}/${modelId}`; // For error reporting

    if (!modelId || !providerId) {
      return { aiResponse: '', error: 'Model ID or Provider ID is missing.' };
    }
    
    if (providerId === 'openai') {
        const openaiApiKeyToUse = apiKey || process.env.OPENAI_API_KEY;
        if (!openaiApiKeyToUse) { 
          return { aiResponse: '', error: 'OpenAI API key is missing for direct SDK call.' };
        }
        const openaiClient = new OpenAI({
          apiKey: openaiApiKeyToUse.trim(),
          baseURL: apiEndpoint?.trim() || undefined, 
        });

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
        if (agentSystemPrompt) {
          messages.push({ role: 'system', content: agentSystemPrompt });
        }
        messages.push({ role: 'user', content: userInput });
        
        attemptedModelForError = `OpenAI SDK/${modelId}`;

        try {
          const sdkModelId = modelId.startsWith('openai/') ? modelId.substring('openai/'.length) : modelId;
          const completion = await openaiClient.chat.completions.create({
            model: sdkModelId, 
            messages: messages,
          });

          const aiResponseText = completion.choices[0]?.message?.content;
          if (aiResponseText) {
            return { aiResponse: aiResponseText };
          } else {
            return { aiResponse: '', error: 'OpenAI API did not return a text response.' };
          }
        } catch (e: any) {
          console.error(`Error calling OpenAI API for model ${modelId}:`, e);
          let errorMessage = `OpenAI API Error: ${e.message || 'Unknown error'}`;
          if (e instanceof OpenAI.APIError) {
             errorMessage = `OpenAI API Error: ${e.status} ${e.name} - ${e.message}`;
             if (e.status === 404) {
                errorMessage = `OpenAI Model '${modelId}' not found or you do not have access. Check the model name and your API key permissions.`;
             } else if (e.status === 401) {
                errorMessage = `OpenAI API Key is invalid, revoked, or does not have permissions for the model '${modelId}'.`;
             } else if (e.status === 429) {
                errorMessage = `OpenAI API rate limit exceeded (${attemptedModelForError}). Please try again later. Visit https://platform.openai.com/account/limits.`;
             }
          }
          return { aiResponse: '', error: errorMessage };
        }
      } else {
        // Genkit-based logic for other providers (Google AI, etc.)
        const qualifiedModelName = modelId.includes('/') ? modelId : `${providerId}/${modelId}`;
        attemptedModelForError = qualifiedModelName;
        const generateOptions: any = {
          model: qualifiedModelName,
          prompt: userInput,
          config: {},
        };

        if (agentSystemPrompt) {
          generateOptions.history = [{role: 'system', content: [{text: agentSystemPrompt}]}];
        }
        
        if (apiKey && !['googleai', 'google-vertex', 'aws-bedrock', 'ollama'].includes(providerId)) { 
          generateOptions.auth = { apiKey };
        }
        
        if (providerId === 'googleai' || providerId === 'google-vertex') {
          generateOptions.config.safetySettings = [
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          ];
        }
        
        try {
            const response = await ai.generate(generateOptions);
            const aiResponseText = response.text;

            if (aiResponseText) {
                return { aiResponse: aiResponseText };
            } else {
                return { aiResponse: '', error: 'AI did not return a text response.' };
            }
        } catch (error: any) {
            console.error(`Error processing chat message with ${attemptedModelForError} (Genkit path):`, error);
            let detailedError = error.message || `Failed to get response from ${attemptedModelForError}.`;
            if (error.message && (error.message.includes('[429 Too Many Requests]') || error.message.includes('429'))) {
                detailedError = `You've exceeded the current quota for the model (${attemptedModelForError}). Please check your plan and billing details with the AI provider. `;
                if (providerId === 'googleai' || providerId === 'google-vertex') {
                  detailedError += `For Google AI, visit: https://ai.google.dev/gemini-api/docs/rate-limits.`;
                } else {
                  detailedError += `Please consult the provider's documentation for rate limits.`;
                }
            } else if (error.cause && error.cause.message) {
                detailedError += ` Cause: ${error.cause.message}`;
            }
            if (error.details) {
                detailedError += ` Details: ${JSON.stringify(error.details)}`;
            }
            if (error.stack && error.stack.includes("NOT_FOUND")) { 
                detailedError = `Model '${attemptedModelForError}' not found via Genkit or access denied. Ensure the model ID is correct for the provider and your Genkit plugin is configured.`;
            }
            return { 
                aiResponse: '', 
                error: detailedError
            };
        }
      }
    }
  );
    
