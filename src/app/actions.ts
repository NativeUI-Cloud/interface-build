
// @ts-nocheck
// TODO: Fix TS errors
"use server";

import { generateUiCode, type GenerateUiCodeInput } from '@/ai/flows/generate-ui-code';
import { generateLandingPageCode, type GenerateLandingPageCodeOutput } from '@/ai/flows/generate-landing-page-code';
import type { GenerateLandingPageCodeInput as ILandingPageInput } from '@/lib/types';
import { landingPageChat, type LandingPageChatInput, type LandingPageChatOutput } from '@/ai/flows/landing-page-chat-flow';


export async function handleGenerateCodeAction(description: string): Promise<{ code: string | null; error: string | null }> {
  if (!description || description.trim() === "") {
    return { code: null, error: "Description cannot be empty." };
  }

  try {
    const input: GenerateUiCodeInput = {
      description,
      primaryColor: "#1A202C", // Dark Blue from theme
      secondaryColor: "#EDF2F7", // Light Gray from theme
      accentColor: "#4DC0B5", // Teal from theme
    };
    const result = await generateUiCode(input);
    if (result && result.code) {
      return { code: result.code, error: null };
    }
    return { code: null, error: "AI did not return code." };
  } catch (error) {
    console.error("Error generating UI code:", error);
    let errorMessage = "Failed to generate code due to an unexpected error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return { code: null, error: errorMessage };
  }
}

export async function handleGenerateLandingPageCodeAction(
  input: ILandingPageInput
): Promise<{ code: string | null; error: string | null }> {
  if (!input.description || input.description.trim() === "") {
    return { code: null, error: "Landing page description cannot be empty." };
  }

  try {
    // The input already matches GenerateLandingPageCodeInput from '@/lib/types'
    // which now includes fontFamilyName and fontFamilyImportUrl
    const result: GenerateLandingPageCodeOutput = await generateLandingPageCode(input);
    if (result && result.code) {
      return { code: result.code, error: null };
    }
    return { code: null, error: "AI did not return landing page code." };
  } catch (error: any) {
    console.error("Error generating landing page code:", error);
    let errorMessage = "Failed to generate landing page code due to an unexpected error.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return { code: null, error: errorMessage };
  }
}

export async function handleLandingPageChatAction(
  input: LandingPageChatInput
): Promise<LandingPageChatOutput> {
  if (!input.userInput || input.userInput.trim() === "") {
    return { aiResponse: '', error: "User input cannot be empty." };
  }

  try {
    // No need to manually construct qualifiedModelId here if it's already in input.selectedModelIdentifier
    const result = await landingPageChat(input);
    return result;
  } catch (error: any) {
    console.error("Error in landing page chat action:", error);
    return { 
      aiResponse: '', 
      error: error.message || 'Failed to process chat message with AI for landing page.' 
    };
  }
}

    
