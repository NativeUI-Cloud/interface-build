
'use server';
/**
 * @fileOverview A Genkit flow to validate API credentials for various LLM providers.
 *
 * - validateCredential - A function that validates credentials.
 * - ValidateCredentialInput - The input type for the validateCredential function.
 * - ValidateCredentialOutput - The return type for the validateCredential function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import OpenAI from 'openai';

const ValidateCredentialInputSchema = z.object({
  providerId: z.string().describe('The ID of the LLM provider (e.g., "openai", "google", "anthropic").'),
  apiKey: z.string().optional().describe('The API key for the provider. Optional for providers like Ollama.'),
  endpoint: z.string().optional().describe('The API endpoint, if applicable.'),
  modelId: z.string().optional().describe('A specific model ID to test against, if applicable.'),
});
export type ValidateCredentialInput = z.infer<typeof ValidateCredentialInputSchema>;

const ValidateCredentialOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the credential is valid.'),
  error: z.string().optional().describe('Error message if validation failed.'),
});
export type ValidateCredentialOutput = z.infer<typeof ValidateCredentialOutputSchema>;

export async function validateCredential(input: ValidateCredentialInput): Promise<ValidateCredentialOutput> {
  return validateCredentialFlow(input);
}

const validateCredentialFlow = ai.defineFlow(
  {
    name: 'validateCredentialFlow',
    inputSchema: ValidateCredentialInputSchema,
    outputSchema: ValidateCredentialOutputSchema,
  },
  async (input: ValidateCredentialInput): Promise<ValidateCredentialOutput> => {
    const { providerId, apiKey, endpoint, modelId } = input;
    const effectiveApiKey = apiKey || ""; 

    let testUrlToUse: string | undefined;
    const fetchOptions: RequestInit = { headers: {} };

    if (!effectiveApiKey && !['ollama', 'aws-bedrock', 'google-vertex'].includes(providerId)) {
      return { isValid: false, error: 'API key is missing and required for this provider.' };
    }
    
    if (providerId !== 'google' && providerId !== 'azure-openai' && providerId !== 'ollama' && providerId !== 'openai') {
        if (effectiveApiKey) { 
            fetchOptions.headers!['Authorization'] = `Bearer ${effectiveApiKey.trim()}`;
        }
    }


    try {
      switch (providerId) {
        case 'openai':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for OpenAI.' };
          const openaiBaseUrl = (endpoint || 'https://api.openai.com/v1').replace(/\/$/, '');
          try {
            const openaiClient = new OpenAI({
              apiKey: effectiveApiKey.trim(),
              baseURL: openaiBaseUrl,
            });
            await openaiClient.models.list(); // Simple call to test authentication
            return { isValid: true };
          } catch (e: any) {
            let errorMessage = 'OpenAI API key validation failed.';
            if (e instanceof OpenAI.APIError) {
              errorMessage = `OpenAI API Error: ${e.status} ${e.name} - ${e.message}`;
            } else if (e.message) {
              errorMessage = e.message;
            }
            return { isValid: false, error: errorMessage };
          }

        case 'anthropic':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Anthropic.' };
          const anthropicBase = (endpoint || 'https://api.anthropic.com/v1').replace(/\/$/, '');
          testUrlToUse = `${anthropicBase}/messages`; 
          fetchOptions.method = 'POST';
          fetchOptions.headers!['anthropic-version'] = '2023-06-01';
          fetchOptions.headers!['content-type'] = 'application/json';
          fetchOptions.body = JSON.stringify({
              model: modelId || "claude-3-haiku-20240307", 
              max_tokens: 1,
              messages: [{role: "user", content: "test"}]
          });
          break;

        case 'google':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Google AI.' };
          const googleBase = (endpoint || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '');
          testUrlToUse = `${googleBase}/models?key=${effectiveApiKey.trim()}`;
          fetchOptions.method = 'GET';
          delete fetchOptions.headers!['Authorization']; 
          break;

        case 'mistral':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Mistral AI.' };
          const mistralBase = (endpoint || 'https://api.mistral.ai/v1').replace(/\/$/, '');
          testUrlToUse = `${mistralBase}/models`;
          fetchOptions.method = 'GET';
          break;

        case 'deepseek':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for DeepSeek.' };
          const deepseekBase = (endpoint || 'https://api.deepseek.com/v1').replace(/\/$/, '');
          testUrlToUse = `${deepseekBase}/models`;
          fetchOptions.method = 'GET';
          break;

        case 'groq':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Groq.' };
          const groqBase = (endpoint || 'https://api.groq.com/openai/v1').replace(/\/$/, '');
          testUrlToUse = `${groqBase}/models`; 
          fetchOptions.method = 'GET';
          break;

        case 'azure-openai':
          if (!effectiveApiKey) return { isValid: false, error: 'API key is required for Azure OpenAI.' };
          if (!endpoint) return { isValid: false, error: 'Azure Endpoint is required.' };
          testUrlToUse = `${endpoint.replace(/\/$/, '')}/openai/models?api-version=2023-05-15`;
          fetchOptions.headers!['api-key'] = effectiveApiKey.trim();
          delete fetchOptions.headers!['Authorization']; 
          fetchOptions.method = 'GET';
          break;

        case 'ollama':
          if (!endpoint) return { isValid: false, error: 'Ollama Endpoint is required.' };
          testUrlToUse = `${endpoint.replace(/\/$/, '')}/api/tags`; 
          delete fetchOptions.headers!['Authorization'];
          fetchOptions.method = 'GET';
          break;

        case 'aws-bedrock':
        case 'google-vertex':
          // These providers often use SDKs and more complex auth. A simple fetch test is not sufficient.
          console.warn(`Validation for ${providerId} is a placeholder. True validation requires SDK or specific auth checks.`);
          return { isValid: true, error: "Validation for this provider is complex and not fully implemented. Assumed valid if configured." };
        
        default:
          return { isValid: false, error: `Unsupported provider for validation: ${providerId}` };
      }

      if (testUrlToUse) {
        const response = await fetch(testUrlToUse, fetchOptions);
        if (!response.ok) {
          let errorPrefix = `API request for ${providerId} failed: ${response.status} - `;
          let errorDetail = `Server returned status ${response.status}.`;
          try {
            const errorJson = await response.json();
            errorDetail = errorJson.error?.message || errorJson.detail || JSON.stringify(errorJson);

            if (providerId === 'google') {
              const keySnippet = effectiveApiKey.length > 4 ? `...${effectiveApiKey.slice(-4)}` : 'the provided key';
              errorPrefix = `Google API request using key ending in '${keySnippet}' failed: ${response.status} - `;
              if (errorDetail.includes('GEMINI_API_KEY') || errorDetail.includes('GOOGLE_API_KEY') || errorDetail.toLowerCase().includes('api key not valid') || errorDetail.toLowerCase().includes('permission denied')) {
                errorDetail += " (This error from Google likely means the API key is invalid, not enabled for the Generative Language API, or lacks proper permissions for the model. Please verify the key and its configuration in your Google Cloud Console.)";
              }
            }
          } catch (e) {
            const textResponse = await response.text(); 
            errorDetail = textResponse || response.statusText || `Server returned status ${response.status}.`;
          }
          return { isValid: false, error: `${errorPrefix}${errorDetail}` };
        }
        return { isValid: true };
      } else {
        return { isValid: false, error: 'Internal error: Test URL not defined for provider (or handled by SDK path that failed silently).' };
      }

    } catch (error: any) {
      console.error(`Validation error for ${providerId}:`, error);
      return { isValid: false, error: error.message || 'An unexpected error occurred during validation.' };
    }
  }
);
