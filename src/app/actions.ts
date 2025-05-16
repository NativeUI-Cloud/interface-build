// @ts-nocheck
// TODO: Fix TS errors
"use server";

import { generateUiCode, type GenerateUiCodeInput } from '@/ai/flows/generate-ui-code';

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
