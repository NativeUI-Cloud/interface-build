
import { config } from 'dotenv';
config(); // Load .env variables at the very top

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// Import for type, but we won't initialize the plugin in Genkit core for now
import type { OpenAIAuth } from 'genkitx-openai'; 

const effectivePlugins: any[] = [];

// Initialize Google AI plugin
try {
    const googlePluginInstance = googleAI();
    if (googlePluginInstance) {
        effectivePlugins.push(googlePluginInstance);
        console.log("GoogleAI plugin instance successfully created and added to effectivePlugins.");
    } else {
        console.error("GoogleAI plugin factory returned a falsy value. GoogleAI plugin might not be available.");
    }
} catch (e: any) {
    console.error("Error initializing GoogleAI plugin:", e.message || e);
}

// OpenAI plugin (genkitx-openai) is intentionally NOT added to effectivePlugins here
// to avoid the "plugin is not a function" error.
// Calls to OpenAI will be handled by the native openai SDK in process-chat-message-flow.ts.
console.warn("OpenAI plugin (genkitx-openai) is NOT being initialized with Genkit core to avoid potential 'plugin is not a function' errors. Direct SDK usage in flows is preferred for OpenAI.");

console.log("Final plugins being passed to Genkit:", effectivePlugins.map(p => ({ name: (p as any)?.name || 'Unknown Plugin Type', type: typeof p })));

export const ai = genkit({
  plugins: effectivePlugins, // Should now only contain googleAI()
  model: 'googleai/gemini-1.5-pro-latest', // Default model, can be overridden per call.
});

console.log("Genkit instance successfully created.");
