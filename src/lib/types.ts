
import type React from 'react';

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
  credentialId: string;
}

export interface NotionToolConfig extends ToolConfigBase {
  type: 'NOTION_TOOL';
  credentialId: string;
}

export interface BlockchainDataToolConfig extends ToolConfigBase {
  type: 'BLOCKCHAIN_DATA_TOOL';
  credentialId?: string;
  network?: string;
}

export interface EtherscanApiToolConfig extends ToolConfigBase {
  type: 'ETHERSCAN_API';
  credentialId: string;
  baseUrl?: string;
}

export interface TheGraphToolConfig extends ToolConfigBase {
  type: 'THE_GRAPH_API';
  subgraphQueryUrl: string;
  credentialId?: string;
}

export interface ShopifyAdminToolConfig extends ToolConfigBase {
  type: 'SHOPIFY_ADMIN_TOOL';
  credentialId: string;
  storeUrl: string;
}

export interface PubMedSearchToolConfig extends ToolConfigBase {
  type: 'PUBMED_SEARCH_TOOL';
  credentialId?: string;
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
  defaultModelId?: string;
  defaultProviderId?: string;
  defaultMemoryType?: string;
}

export interface NodeData {
  title?: string;
  subTitle?: string;
  chatModelCredentialId?: string;
  selectedModelId?: string;
  selectedProviderId?: string;
  promptSource?: 'chat-trigger' | 'system-prompt' | string;
  systemPrompt?: string;
  templateId?: string;
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

// For Landing Page Visual Builder

export interface HeroVideoData {
  videoSrc: string;
  thumbnailSrcLight: string;
  thumbnailSrcDark: string;
  thumbnailAlt: string;
  animationStyle: 'from-left' | 'from-right' | 'from-top' | 'from-bottom' | 'from-center' | 'none';
}

export interface BentoFeature {
  id: string; // Added for key prop and editing
  Icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  cta: string;
  className: string;
  background?: React.ReactNode; // This is tricky to serialize and edit generically
  // For a more editable structure, we might need to define background types
  // e.g., background: { type: 'marquee', items: File[] } | { type: 'animatedList' } | { type: 'calendar' }
}

export interface BentoData {
  features: BentoFeature[];
}


export interface CanvasElement {
  id: string;
  name: string;
  type: string; // e.g., 'MarqueeTestimonials', 'HeroSection', 'HeroVideoDialog', 'BentoGrid'
  data: any; 
}

export interface CanvasRow {
  id: string;
  layout: 'grid-cols-1' | 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4' | string;
  elements: CanvasElement[];
}

// For AI Landing Page Code Generator (if distinct from visual builder elements)
export interface GenerateLandingPageCodeInput {
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pageTitle?: string;
}
