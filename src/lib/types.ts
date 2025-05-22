
export interface ToolConfigBase {
  id: string; // Unique ID for this specific tool instance on the node
  type: string; // e.g., 'COINGECKO', 'OPENWEATHERMAP'
  credentialId?: string; // Common field for tools that use a stored credential
}

export interface CoinGeckoToolConfig extends ToolConfigBase {
  type: 'COINGECKO';
  toolDescription?: 'set_automatically' | 'custom';
  resource?: string;
  operation?: string;
  coinId?: string;
  returnAll?: boolean;
  limit?: number;
}

export interface GitHubApiToolConfig extends ToolConfigBase {
  type: 'GITHUB_API';
  credentialId: string; // ID of the StoredCredential for GitHub API
}

export interface GoogleDriveToolConfig extends ToolConfigBase {
  type: 'GOOGLE_DRIVE_API';
  credentialId: string;
}

export interface DropboxToolConfig extends ToolConfigBase {
  type: 'DROPBOX_API';
  credentialId: string;
}

export interface GitLabToolConfig extends ToolConfigBase {
  type: 'GITLAB_API';
  credentialId: string;
}

export interface TrelloToolConfig extends ToolConfigBase {
  type: 'TRELLO_API';
  credentialId: string;
}

export interface BitqueryApiToolConfig extends ToolConfigBase {
  type: 'BITQUERY_API';
  credentialId: string;
}

export interface FirebaseToolConfig extends ToolConfigBase {
  type: 'FIREBASE_TOOL';
  credentialId: string; // For Firebase service account key or other auth method
}

export interface NotionToolConfig extends ToolConfigBase {
  type: 'NOTION_TOOL';
  credentialId: string; // For Notion API Key/Token
}

export interface BlockchainDataToolConfig extends ToolConfigBase {
  type: 'BLOCKCHAIN_DATA_TOOL';
  credentialId?: string; // Optional: for authenticated RPC endpoints or services
  network?: string; // e.g., 'ethereum_mainnet', 'polygon_mainnet'
  // Other specific parameters for blockchain data retrieval
}

export interface EtherscanApiToolConfig extends ToolConfigBase {
  type: 'ETHERSCAN_API';
  credentialId: string; // For the Etherscan API Key
  baseUrl?: string; // e.g., https://api.etherscan.io/api, https://api.bscscan.com/api
}

export interface TheGraphToolConfig extends ToolConfigBase {
  type: 'THE_GRAPH_API';
  subgraphQueryUrl: string; // The specific /query URL of the subgraph
  credentialId?: string; // Optional: API key for a specific Graph gateway/hosted service
}

export interface ShopifyAdminToolConfig extends ToolConfigBase {
  type: 'SHOPIFY_ADMIN_TOOL';
  credentialId: string; // Stores the ID of the credential holding the access token
  storeUrl: string; // The user's Shopify store URL (e.g., my-store.myshopify.com)
}

export interface PubMedSearchToolConfig extends ToolConfigBase {
  type: 'PUBMED_SEARCH_TOOL';
  credentialId?: string; // Optional: for an NCBI API key if provided
  // Specific PubMed search parameters can be added here later
}


export type AnyToolConfig =
  | CoinGeckoToolConfig
  | GitHubApiToolConfig
  | GoogleDriveToolConfig
  | DropboxToolConfig
  | GitLabToolConfig
  | TrelloToolConfig
  | BitqueryApiToolConfig
  | FirebaseToolConfig
  | NotionToolConfig
  | BlockchainDataToolConfig
  | EtherscanApiToolConfig
  | TheGraphToolConfig
  | ShopifyAdminToolConfig
  | PubMedSearchToolConfig
  | ToolConfigBase;

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  suggestedToolTypes?: string[];
  icon?: React.ElementType; // LucideIcon or similar
}

export interface NodeData {
  title?: string;
  subTitle?: string;
  chatModelCredentialId?: string;
  selectedModelId?: string;
  selectedProviderId?: string;
  promptSource?: 'chat-trigger' | 'system-prompt' | string; 
  systemPrompt?: string; 
  templateId?: string; // ID of the loaded template
  chatModelCredentialStatus?: StoredCredential['status'];
  chatModelValidationError?: string;
  connectedChatModelNodeId?: string;

  aiAgentNodeId?: string;
  modelName?: string;
  providerName?: string;
  status?: StoredCredential['status']; 
  validationError?: string; 

  inputConnected?: boolean;
  outputConnected?: boolean;
  targetAiAgentNodeId?: string;
  sourceTriggerNodeId?: string;

  connectors?: Record<string, { type: 'input' | 'output', connectedTo?: { nodeId: string, connectorId: string }[] }>;

  tools?: AnyToolConfig[];
  memoryType?: string;

  coingeckoToolNodeId?: string;
  parentAiAgentId?: string;
  representedToolId?: string; 

  telegramBotTokenCredentialId?: string;
  telegramBotTokenStatus?: StoredCredential['status'];

  isDisabled?: boolean; 

  [key: string]: any;
}

export interface Node {
  id: string;
  type: 'AI_AGENT' | 'CONNECTED_CHAT_MODEL' | 'CHAT_TRIGGER' | 'TELEGRAM_TRIGGER' | 'COINGECKO_TOOL_DISPLAY_NODE' | string;
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
  properties?: { 
    displayName: string; 
    name: string; 
    type: string; 
    default?: any; 
    description?: string; 
    typeOptions?: any 
  }[];
  predefinedSubgraphs?: { label: string; value: string }[];
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
  fromConnectorId: string;
  toNodeId: string;
  toConnectorId: string;
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
