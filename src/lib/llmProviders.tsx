
import type { LLMProvider, LLMModel } from './types';
import { Building, Cpu, Globe, Cloud, Server, Brain, Wind, Home, Rocket, Box } from 'lucide-react';
import type React from 'react';

// Placeholder for Azure Icon
const AzureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12.41 2.87a.7.7 0 00-.82 0L2.71 9.41a.7.7 0 000 .82l4.7 3.35 4.18-3.08a.7.7 0 000-1.05L7.93 7.19l3.66-2.61a.7.7 0 00.82-.01zM16.54 7.12l-4.18 3.08a.7.7 0 000 1.05l3.66 2.26 4.18-3.08a.7.7 0 000-1.05l-3.66-2.26zM11.59 21.13a.7.7 0 00.82 0l8.88-6.54a.7.7 0 000-.82l-4.7-3.35-4.18 3.08a.7.7 0 000 1.05l3.66 2.26-3.66 2.61a.7.7 0 00-.82.01zM7.46 16.88l4.18-3.08a.7.7 0 000-1.05L7.98 10.5l-4.18 3.08a.7.7 0 000 1.05l3.66 2.25z" />
  </svg>
);

// Placeholder for Groq Icon
const GroqIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 <Rocket {...props} /> // Using Rocket as a placeholder for speed
);


const anthropicModels: LLMModel[] = [
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', providerId: 'anthropic', providerName: 'Anthropic', defaultEndpoint: 'https://api.anthropic.com/v1', apiKeyName: 'Anthropic API Key', isChatModel: true },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', providerId: 'anthropic', providerName: 'Anthropic', defaultEndpoint: 'https://api.anthropic.com/v1', apiKeyName: 'Anthropic API Key', isChatModel: true },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', providerId: 'anthropic', providerName: 'Anthropic', defaultEndpoint: 'https://api.anthropic.com/v1', apiKeyName: 'Anthropic API Key', isChatModel: true },
];

const openaiModels: LLMModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', providerId: 'openai', providerName: 'OpenAI', defaultEndpoint: 'https://api.openai.com/v1', apiKeyName: 'OpenAI API Key', isChatModel: true },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', providerId: 'openai', providerName: 'OpenAI', defaultEndpoint: 'https://api.openai.com/v1', apiKeyName: 'OpenAI API Key', isChatModel: true },
  { id: 'gpt-4-turbo-preview', name: 'GPT-4 Turbo Preview', providerId: 'openai', providerName: 'OpenAI', defaultEndpoint: 'https://api.openai.com/v1', apiKeyName: 'OpenAI API Key', isChatModel: true },
  { id: 'gpt-4', name: 'GPT-4', providerId: 'openai', providerName: 'OpenAI', defaultEndpoint: 'https://api.openai.com/v1', apiKeyName: 'OpenAI API Key', isChatModel: true },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', providerId: 'openai', providerName: 'OpenAI', defaultEndpoint: 'https://api.openai.com/v1', apiKeyName: 'OpenAI API Key', isChatModel: true },
];

const googleModels: LLMModel[] = [
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro', providerId: 'google', providerName: 'Google AI', icon: Globe, defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta', apiKeyName: 'Google AI API Key', isChatModel: true },
  { id: 'gemini-pro', name: 'Gemini Pro', providerId: 'google', providerName: 'Google AI', icon: Globe, defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta', apiKeyName: 'Google AI API Key', isChatModel: true },
];

const azureOpenAIModels: LLMModel[] = [
    { id: 'azure-gpt-4-turbo', name: 'GPT-4 Turbo (Azure)', providerId: 'azure-openai', providerName: 'Azure OpenAI', requiresEndpoint: true, endpointLabel: 'Azure Endpoint', apiKeyName: 'Azure API Key', isChatModel: true },
    { id: 'azure-gpt-35-turbo', name: 'GPT-3.5 Turbo (Azure)', providerId: 'azure-openai', providerName: 'Azure OpenAI', requiresEndpoint: true, endpointLabel: 'Azure Endpoint', apiKeyName: 'Azure API Key', isChatModel: true },
];

const awsBedrockModels: LLMModel[] = [
    { id: 'bedrock-anthropic-claude-3-sonnet', name: 'Anthropic Claude 3 Sonnet (Bedrock)', providerId: 'aws-bedrock', providerName: 'AWS Bedrock', requiresEndpoint: false, apiKeyName: 'AWS Access Key ID', endpointLabel:'AWS Secret Access Key & Region', isChatModel: true }, // Simplified for now
];

const deepseekModels: LLMModel[] = [
    { id: 'deepseek-chat', name: 'DeepSeek Chat', providerId: 'deepseek', providerName: 'DeepSeek', defaultEndpoint: 'https://api.deepseek.com/v1', apiKeyName: 'DeepSeek API Key', isChatModel: true },
];

const googleVertexModels: LLMModel[] = [
    { id: 'vertex-gemini-1.5-pro', name: 'Gemini 1.5 Pro (Vertex AI)', providerId: 'google-vertex', providerName: 'Google Vertex AI', defaultEndpoint: 'https://us-central1-aiplatform.googleapis.com/v1', apiKeyName: 'Google Cloud Access Token', isChatModel: true }, // Endpoint varies by region
];

const groqModels: LLMModel[] = [
    { id: 'groq-llama3-70b', name: 'Llama3 70b (Groq)', providerId: 'groq', providerName: 'Groq', defaultEndpoint: 'https://api.groq.com/openai/v1', apiKeyName: 'Groq API Key', isChatModel: true },
    { id: 'groq-mixtral-8x7b', name: 'Mixtral 8x7B (Groq)', providerId: 'groq', providerName: 'Groq', defaultEndpoint: 'https://api.groq.com/openai/v1', apiKeyName: 'Groq API Key', isChatModel: true },
];

const mistralModels: LLMModel[] = [
    { id: 'mistral-large-latest', name: 'Mistral Large', providerId: 'mistral', providerName: 'Mistral AI', defaultEndpoint: 'https://api.mistral.ai/v1', apiKeyName: 'Mistral API Key', isChatModel: true },
    { id: 'mistral-medium-latest', name: 'Mistral Medium', providerId: 'mistral', providerName: 'Mistral AI', defaultEndpoint: 'https://api.mistral.ai/v1', apiKeyName: 'Mistral API Key', isChatModel: true },
    { id: 'mistral-small-latest', name: 'Mistral Small', providerId: 'mistral', providerName: 'Mistral AI', defaultEndpoint: 'https://api.mistral.ai/v1', apiKeyName: 'Mistral API Key', isChatModel: true },
];

const ollamaModels: LLMModel[] = [
    { id: 'ollama-llama3', name: 'Llama 3 (Ollama)', providerId: 'ollama', providerName: 'Ollama', defaultEndpoint: 'http://localhost:11434', requiresEndpoint: true, apiKeyName: 'Ollama (No API Key Needed)', isChatModel: true },
    { id: 'ollama-phi3', name: 'Phi-3 (Ollama)', providerId: 'ollama', providerName: 'Ollama', defaultEndpoint: 'http://localhost:11434', requiresEndpoint: true, apiKeyName: 'Ollama (No API Key Needed)', isChatModel: true },
];


export const llmProviders: LLMProvider[] = [
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: Building,
    description: 'Models by Anthropic',
    models: anthropicModels,
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: Cpu,
    description: 'Models by OpenAI',
    models: openaiModels,
  },
  {
    id: 'google',
    name: 'Google AI',
    icon: Globe,
    description: 'Gemini models by Google',
    models: googleModels,
  },
  {
    id: 'azure-openai',
    name: 'Azure OpenAI',
    icon: AzureIcon,
    description: 'OpenAI models on Azure',
    models: azureOpenAIModels,
  },
  {
    id: 'aws-bedrock',
    name: 'AWS Bedrock',
    icon: Server,
    description: 'Foundation models on AWS',
    models: awsBedrockModels,
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: Brain,
    description: 'Models by DeepSeek AI',
    models: deepseekModels,
  },
   {
    id: 'google-vertex',
    name: 'Google Vertex AI',
    icon: Box, // Using Box as a different G icon
    description: 'Models on Google Cloud Vertex AI',
    models: googleVertexModels,
  },
  {
    id: 'groq',
    name: 'Groq',
    icon: GroqIcon,
    description: 'Fast inference with Groq',
    models: groqModels,
  },
  {
    id: 'mistral',
    name: 'Mistral AI',
    icon: Wind,
    description: 'Models by Mistral AI',
    models: mistralModels,
  },
  {
    id: 'ollama',
    name: 'Ollama',
    icon: Home,
    description: 'Run LLMs locally with Ollama',
    models: ollamaModels,
  },
];

export const getAllChatModels = (): LLMModel[] => {
  return llmProviders.flatMap(provider => provider.models.filter(model => model.isChatModel));
};
