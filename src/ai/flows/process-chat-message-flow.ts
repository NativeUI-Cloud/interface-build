
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
    const { userInput, agentSystemPrompt, modelId, apiKey, apiEndpoint, providerId } = input;

    if (!modelId || !providerId) {
      return { aiResponse: '', error: 'Model ID or Provider ID is missing.' };
    }
    
    if (providerId === 'openai' && !apiKey) {
        return { aiResponse: '', error: `API key is required for OpenAI provider.` };
    }
    // Retain existing check for other providers that require API key and are not covered by ADC or local.
    if (!['ollama', 'googleai', 'openai', 'google-vertex', 'aws-bedrock'].includes(providerId) && !apiKey) {
        return { aiResponse: '', error: `API key is required for provider '${providerId}'.` };
    }

    try {
      if (providerId === 'openai') {
        if (!apiKey) { // Should be caught above, but as a safeguard for clarity
          return { aiResponse: '', error: 'OpenAI API key is missing for direct SDK call.' };
        }
        const openaiClient = new OpenAI({
          apiKey: apiKey.trim(),
          baseURL: apiEndpoint?.trim() || undefined, // Use provided endpoint or OpenAI default
        });

        const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
        if (agentSystemPrompt) {
          messages.push({ role: 'system', content: agentSystemPrompt });
        }
        messages.push({ role: 'user', content: userInput });

        try {
          const completion = await openaiClient.chat.completions.create({
            model: modelId, // e.g., "gpt-3.5-turbo", not "openai/gpt-3.5-turbo"
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
                errorMessage = `OpenAI API rate limit exceeded. Please try again later.`;
             }
          }
          return { aiResponse: '', error: errorMessage };
        }
      } else {
        // Existing Genkit-based logic for other providers
        const qualifiedModelName = modelId.includes('/') ? modelId : `${providerId}/${modelId}`;
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
           if(apiEndpoint && providerId === 'some_other_genkit_plugin_needing_endpoint_in_auth') {
             // Placeholder: Specific Genkit plugins might need endpoint in auth or config
             // generateOptions.auth.endpoint = apiEndpoint; 
             // or generateOptions.config.apiBase = apiEndpoint;
           }
        }
        
        if (providerId === 'googleai' || providerId === 'google-vertex') {
          generateOptions.config.safetySettings = [
              { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
              { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          ];
        }

        const response = await ai.generate(generateOptions);
        const aiResponseText = response.text;

        if (aiResponseText) {
          return { aiResponse: aiResponseText };
        } else {
          return { aiResponse: '', error: 'AI did not return a text response.' };
        }
      }
    } catch (error: any) { // Catch-all for broader errors, e.g. Genkit ai.generate issues for non-OpenAI providers
      console.error(`Error processing chat message with ${providerId}/${modelId} (Genkit path):`, error);
      let detailedError = error.message || `Failed to get response from ${providerId}/${modelId}.`;
      if (error.cause && error.cause.message) {
        detailedError += ` Cause: ${error.cause.message}`;
      }
      if (error.details) {
         detailedError += ` Details: ${JSON.stringify(error.details)}`;
      }
      if (error.stack && error.stack.includes("NOT_FOUND")) { // More specific to Genkit model not found
        detailedError = `Model '${providerId}/${modelId}' not found via Genkit or access denied. Ensure the model ID is correct for the provider and your Genkit plugin is configured.`;
      }
      return { 
        aiResponse: '', 
        error: detailedError
      };
    }
  }
);

