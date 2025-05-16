
export interface NodeData {
  title?: string;
  subTitle?: string;
  chatModelCredentialId?: string; 
  selectedModelId?: string; 
  selectedProviderId?: string; 
  promptSource?: 'chat-trigger' | 'custom' | string; // Allow specific trigger IDs
  customPrompt?: string;
  chatModelCredentialStatus?: StoredCredential['status']; 
  chatModelValidationError?: string; 
  connectedChatModelNodeId?: string; 
  // Fields for CONNECTED_CHAT_MODEL type node
  aiAgentNodeId?: string; 
  modelName?: string;
  providerName?: string;
  // providerId is already available via selectedProviderId or from credential
  credentialId?: string; // ID of the StoredCredential used by this connected model
  status?: StoredCredential['status']; // Status of the credential for the connected model
  validationError?: string; // Validation error for the connected model's credential
  
  // Connector specific data
  inputConnected?: boolean; // Example for an AI_AGENT input
  outputConnected?: boolean; // Example for a TRIGGER output
  targetAiAgentNodeId?: string; // For Triggers to link to AI Agent
  sourceTriggerNodeId?: string; // For AI Agent to link from Trigger

  connectors?: Record<string, { type: 'input' | 'output', connectedTo?: { nodeId: string, connectorId: string }[] }>;


  [key: string]: any; 
}

export interface Node {
  id: string;
  type: 'AI_AGENT' | 'CONNECTED_CHAT_MODEL' | 'CHAT_TRIGGER' | 'TELEGRAM_TRIGGER' | string; 
  name: string; 
  position?: { x: number; y: number }; 
  data?: NodeData; 
}

export interface LLMProvider {
  id: string;
  name: string;
  icon: React.ElementType; 
  description?: string;
  models: LLMModel[];
}

export interface LLMModel {
  id: string; 
  name: string; 
  providerId: string; 
  providerName: string; 
  icon?: React.ElementType; 
  defaultEndpoint?: string;
  apiKeyName?: string; 
  endpointLabel?: string; 
  requiresEndpoint?: boolean; 
  inputSchema?: any; 
  outputSchema?: any; 
  isChatModel?: boolean; 
  isEmbeddingsModel?: boolean; 
}

export interface StoredCredential {
  id: string; 
  modelId?: string; 
  providerId: string; 
  name:string; 
  apiKey: string; 
  endpoint?: string; 
  createdAt: string; 
  status: 'valid' | 'invalid' | 'unchecked'; 
  lastValidated?: string; 
  validationError?: string; 
}

export interface Connection {
  id: string;
  fromNodeId: string;
  fromConnectorId: string; // e.g., 'output', 'tool-output-1'
  toNodeId: string;
  toConnectorId: string;   // e.g., 'input', 'tool-input-1'
}

export interface Workflow {
  id: string;
  name: string;
  nodes: Node[];
  connections: Connection[];
  zoomLevel?: number;
  createdAt: string;
  updatedAt: string;
}
