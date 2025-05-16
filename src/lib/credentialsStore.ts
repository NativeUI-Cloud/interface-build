
'use client';
import type { StoredCredential } from './types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
import { validateCredential as validateCredentialFlow, type ValidateCredentialInput } from '@/ai/flows/validate-credential-flow';

const CREDENTIALS_STORAGE_KEY = 'nativeui-ai-credentials';

// Helper function to safely access localStorage
const getLocalStorage = (): Storage | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

export const getCredentials = (providerId?: string): StoredCredential[] => {
  const storage = getLocalStorage();
  if (!storage) return [];

  const rawCredentials = storage.getItem(CREDENTIALS_STORAGE_KEY);
  if (!rawCredentials) return [];

  try {
    const allCredentials = JSON.parse(rawCredentials) as StoredCredential[];
    if (providerId) {
      return allCredentials.filter(cred => cred.providerId === providerId);
    }
    return allCredentials;
  } catch (error) {
    console.error('Error parsing credentials from localStorage:', error);
    return [];
  }
};

export const saveCredential = (credentialData: Omit<StoredCredential, 'id' | 'createdAt' | 'status' | 'lastValidated' | 'validationError'>): StoredCredential | null => {
  const storage = getLocalStorage();
  if (!storage) return null;

  const newCredential: StoredCredential = {
    ...credentialData,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    status: 'unchecked', // Initialize status
  };

  const existingCredentials = getCredentials();
  const updatedCredentials = [...existingCredentials, newCredential];

  try {
    storage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updatedCredentials));
    return newCredential;
  } catch (error) {
    console.error('Error saving credential to localStorage:', error);
    return null;
  }
};

export const getCredentialById = (credentialId: string): StoredCredential | null => {
  const credentials = getCredentials();
  return credentials.find(c => c.id === credentialId) || null;
}

export const deleteCredential = (credentialId: string): boolean => {
  const storage = getLocalStorage();
  if (!storage) return false;

  const existingCredentials = getCredentials();
  const updatedCredentials = existingCredentials.filter(cred => cred.id !== credentialId);

  try {
    storage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(updatedCredentials));
    return true;
  } catch (error) {
    console.error('Error deleting credential from localStorage:', error);
    return false;
  }
};

export const updateCredential = (updatedCredentialData: Partial<StoredCredential> & { id: string }): StoredCredential | null => {
    const storage = getLocalStorage();
    if (!storage) return null;

    const existingCredentials = getCredentials();
    const index = existingCredentials.findIndex(cred => cred.id === updatedCredentialData.id);

    if (index === -1) {
        console.error('Credential to update not found');
        return null;
    }
    
    // Preserve original apiKey if not explicitly provided in update, or if provided as empty string (meaning no change)
    const originalApiKey = existingCredentials[index].apiKey;
    const newApiKey = (updatedCredentialData.apiKey === undefined || updatedCredentialData.apiKey === '') ? originalApiKey : updatedCredentialData.apiKey;

    const credentialToUpdate = { ...existingCredentials[index], ...updatedCredentialData, apiKey: newApiKey };

    // If API key or endpoint changed, mark as unchecked for re-validation
    if (existingCredentials[index].apiKey !== credentialToUpdate.apiKey || existingCredentials[index].endpoint !== credentialToUpdate.endpoint) {
        credentialToUpdate.status = 'unchecked';
        credentialToUpdate.validationError = undefined;
        credentialToUpdate.lastValidated = undefined;
    }
    
    const newCredentialsList = [...existingCredentials];
    newCredentialsList[index] = credentialToUpdate;

    try {
        storage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(newCredentialsList));
        return credentialToUpdate;
    } catch (error) {
        console.error('Error updating credential in localStorage:', error);
        return null;
    }
};

// Uses Genkit flow for actual API key validation logic
export const validateApiKey = async (credential: StoredCredential): Promise<StoredCredential> => {
  console.log(`Attempting validation for credential: ${credential.name} (${credential.providerId})`);
  
  const validationInput: ValidateCredentialInput = {
    providerId: credential.providerId,
    apiKey: credential.apiKey,
    endpoint: credential.endpoint,
    modelId: credential.modelId, // Pass modelId if available
  };

  try {
    const result = await validateCredentialFlow(validationInput);
    const updatedStatus: StoredCredential['status'] = result.isValid ? 'valid' : 'invalid';
    
    const validatedCredential = {
      ...credential,
      status: updatedStatus,
      validationError: result.error,
      lastValidated: new Date().toISOString(),
    };
    updateCredential(validatedCredential); // Persist the validation result
    return validatedCredential;
  } catch (flowError: any) {
    console.error('Error calling validation flow:', flowError);
    const errorCredential = {
      ...credential,
      status: 'invalid' as StoredCredential['status'],
      validationError: flowError.message || 'Validation flow failed.',
      lastValidated: new Date().toISOString(),
    };
    updateCredential(errorCredential);
    return errorCredential;
  }
};
