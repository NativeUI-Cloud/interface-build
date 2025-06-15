
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
import OpenAI from 'openai'; // Import OpenAI SDK

const LandingPageChatInputSchema = z.object({
  userInput: z.string().describe('The user-provided message to the assistant.'),
  currentPageContext: z.string().optional().describe('A string representation of the current page structure. (Future use)'),
  selectedModelIdentifier: z.string().optional().describe('The qualified identifier of the selected AI model (e.g., "googleai/gemini-1.5-pro-latest", "deepseek/deepseek-chat").'),
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

    // Default to the Genkit instance's default model if none is selected by user
    const modelToUse = selectedModelIdentifier || ai.defaultModel?.name || 'googleai/gemini-1.5-pro-latest';
    console.log(`[landingPageChatFlow] Attempting to use model: ${modelToUse}`);

    const systemPrompt = `You are an advanced AI Designer and Programmer Assistant integrated into a visual landing page builder.
The user is interacting with you via chat and expects you to understand design requests and, ideally, apply them directly to their page.
The user said: "${userInput}".

Your current capabilities are:
1.  **Interpret Design Requests**: Understand user requests to add, remove, or modify UI elements (e.g., "add a hero section with a large image and a call to action button", "change the button color to blue", "create three columns with feature cards").
2.  **Acknowledge and Plan (Simulated Execution)**:
    *   Acknowledge the request enthusiastically (e.g., "Alright, Designer! Adding a hero section with a large image and CTA button. I'm visualizing it now...").
    *   Describe briefly *how* you would construct this using the available elements in the builder (mentioning common elements like 'Section', 'Heading', 'Image', 'Button' if relevant to the request). If the user requests an element that doesn't seem to exist in the builder's palette, mention that you'd create a custom one or use a suitable placeholder.
    *   **Simulate Action**: State that you are now "designing" or "coding" that section.
    *   **Simulate Visual Feedback**: Mention that if this were fully integrated, the user would now see "cool programmer-designer effects on the canvas" while you work, perhaps with lines of code appearing and elements materializing.
    *   **Current Limitation**: Conclude by explaining that the feature to *directly apply these changes to the visual canvas via chat is still under development*.
    *   **Offer Alternatives**: Instead of direct application, offer to:
        a.  Provide detailed guidance on how *they* can build it using the visual builder's drag-and-drop tools and properties panel.
        b.  Generate HTML/CSS/React code snippets for the requested component/section that they could manually integrate if they were coding directly.
3.  **Answer General Questions**: If the user asks general questions about landing page design, Next.js, Tailwind CSS, or ShadCN UI components, answer them helpfully and concisely.

When suggesting UI elements, assume the builder has common ones like: Header, Section, Heading, TextBlock, Image, Button, Card, MarqueeTestimonials, TerminalAnimation, HeroVideoDialog, BentoGrid, AnimatedList, NftDisplayCard, TokenInfoDisplay, RoadmapTimeline, etc. If a request is for something very specific not on this list, state you'd use a generic placeholder or build it custom.

Be creative, engaging, and slightly playful in your persona as an AI Designer/Programmer.
Your primary role here is to act as if you are performing the design task, explain your (simulated) process, and then bridge the gap to the current reality by offering guidance or code snippets.`;

    const providerIdFromModel = modelToUse?.split('/')[0];
    const modelNameOnly = modelToUse?.split('/')[1];

    if (providerIdFromModel === 'deepseek' && modelNameOnly) {
        const deepSeekApiKey = process.env.DEEPSEEK_API_KEY;
        if (!deepSeekApiKey) {
            return { aiResponse: '', error: 'DeepSeek API key (DEEPSEEK_API_KEY) is not configured in your .env file. Please add it and restart the Genkit server.' };
        }
        try {
            console.log(`[landingPageChatFlow] Using OpenAI SDK for DeepSeek model: ${modelNameOnly}`);
            const deepseekClient = new OpenAI({
                apiKey: deepSeekApiKey,
                baseURL: 'https://api.deepseek.com/v1', // DeepSeek's OpenAI-compatible endpoint
            });
            
            const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];
            messages.push({ role: 'system', content: systemPrompt });
            messages.push({ role: 'user', content: userInput });

            const completion = await deepseekClient.chat.completions.create({
                model: modelNameOnly, // e.g., "deepseek-chat"
                messages: messages,
            });
            const aiResponseText = completion.choices[0]?.message?.content;
            if (aiResponseText) {
                return { aiResponse: aiResponseText };
            } else {
                return { aiResponse: '', error: 'DeepSeek API did not return a text response.' };
            }
        } catch (e: any) {
            console.error(`Error calling DeepSeek API for model ${modelToUse}:`, e);
            let errorMsg = `DeepSeek API Error: ${e.message || 'Unknown error'}`;
             if (e instanceof OpenAI.APIError) { 
                errorMsg = `DeepSeek API Error: ${e.status} ${e.name} - ${e.message}`;
                if (e.status === 404) {
                    errorMsg = `DeepSeek Model '${modelNameOnly}' not found or you do not have access. Check the model name and your API key.`;
                } else if (e.status === 401) {
                    errorMsg = `DeepSeek API Key is invalid or does not have permissions for the model '${modelNameOnly}'. Your key starts with: ${deepSeekApiKey.substring(0, 5)}...`;
                } else if (e.status === 429) {
                    errorMsg = `DeepSeek API rate limit exceeded. Please try again later. Visit their website for details on rate limits.`;
                }
            }
            return { aiResponse: '', error: errorMsg };
        }
    }

    // Default to Genkit ai.generate for other providers (like Google AI, or OpenAI via Genkit plugin)
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
      console.error('Error processing landing page chat message (Genkit path):', error);
      let errorMessage = error.message || 'Failed to get response from AI assistant.';
      
      if (error.message && (error.message.includes('[429 Too Many Requests]') || error.message.includes('429'))) {
        errorMessage = `You've exceeded the current quota for the selected model (${modelToUse}). Please check your plan and billing details with the AI provider (e.g., Google AI, OpenAI). For Google AI, visit: https://ai.google.dev/gemini-api/docs/rate-limits. For OpenAI: https://platform.openai.com/account/limits.`;
      } else if (error.cause && error.cause.message && (error.cause.message.includes('Plugin') || error.cause.message.includes('not found') || error.cause.message.includes('Could not load model'))) {
          errorMessage = `The selected model (${selectedModelIdentifier || modelToUse}) could not be processed by Genkit. The required Genkit plugin (e.g., for Google AI, OpenAI, DeepSeek, Anthropic) might not be configured correctly in your genkit.ts or the model is not supported by the configured plugins. Please ensure the plugin for '${providerIdFromModel || 'the selected provider'}' is installed and initialized in genkit.ts.`;
      } else if ((error.details && error.details.includes("NOT_FOUND")) || (error.message && error.message.includes("NOT_FOUND"))) {
        errorMessage = `Model '${selectedModelIdentifier || modelToUse}' not found or access denied by Genkit. Ensure it's a valid model identifier for a configured Genkit plugin.`;
      }
      return { 
        aiResponse: '', 
        error: errorMessage
      };
    }
  }
);
    
