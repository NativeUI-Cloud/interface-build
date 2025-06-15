
import { config } from 'dotenv';
config(); // Load .env variables at the very top

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {openai} from 'genkitx-openai'; // Import the openai plugin

const effectivePlugins: any[] = [];
let defaultModelIdentifier = 'googleai/gemini-1.5-pro-latest';

// Initialize Google AI plugin
try {
    const googlePluginInstance = googleAI();
    if (googlePluginInstance) {
        effectivePlugins.push(googlePluginInstance);
        console.log("GoogleAI plugin instance successfully created and added.");
    } else {
        console.error("GoogleAI plugin factory returned a falsy value.");
    }
} catch (e: any) {
    console.error("Error initializing GoogleAI plugin:", e.message || e);
}

// Conditionally initialize OpenAI plugin if API key is present
if (process.env.OPENAI_API_KEY) {
    try {
        const openaiPluginInstance = openai(); // Assumes API key is picked from OPENAI_API_KEY env var
        if (openaiPluginInstance) {
            effectivePlugins.push(openaiPluginInstance);
            defaultModelIdentifier = 'openai/gpt-4o'; // Switch default model to OpenAI
            console.log("OpenAI plugin instance successfully created and added. Default model switched to OpenAI.");
        } else {
            console.error("OpenAI plugin factory returned a falsy value. OpenAI plugin might not be available.");
        }
    } catch (e: any) {
        console.error("Error initializing OpenAI plugin:", e.message || e);
        console.warn("Falling back to Google AI as default due to OpenAI plugin initialization error.");
    }
} else {
    console.log("OPENAI_API_KEY not found in environment. OpenAI plugin not initialized. Using Google AI as default.");
}

console.log("Final plugins being passed to Genkit:", effectivePlugins.map(p => ({ name: (p as any)?.name || 'Unknown Plugin Type', type: typeof p })));
console.log("Default model identifier for Genkit:", defaultModelIdentifier);

export const ai = genkit({
  plugins: effectivePlugins,
  model: defaultModelIdentifier, // Set the determined default model
});

console.log("Genkit instance successfully created.");
