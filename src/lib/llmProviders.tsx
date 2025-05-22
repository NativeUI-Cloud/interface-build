
import type { LLMProvider, LLMModel } from './types';
import { Building, Cpu, Globe, Cloud, Server, Brain, Wind, Home, Rocket, Box, Github, FolderKanban, Package, Gitlab, KanbanSquare, DatabaseZap, Flame as FirebaseIcon, NotebookText, Network, SearchCode, GitFork, ShoppingCart, Stethoscope } from 'lucide-react';
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

const theGraphPredefinedSubgraphs = [
  // Ethereum Mainnet
  { label: 'Uniswap V3 (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3' },
  { label: 'Uniswap V2 (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2' },
  { label: 'Sushiswap (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/sushiswap/exchange' },
  { label: 'Aave V2 (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v2' },
  { label: 'Aave V3 (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3' },
  { label: 'Compound V2 (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/graphprotocol/compound-v2' },
  { label: 'Curve Finance (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/curvefi/curve' },
  { label: 'Balancer V2 (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2' },
  { label: 'MakerDAO (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/protofire/maker-protocol' },
  { label: 'ENS (Mainnet)', value: 'https://api.thegraph.com/subgraphs/name/ensdomains/ens' },

  // Polygon (Matic)
  { label: 'QuickSwap (Polygon)', value: 'https://api.thegraph.com/subgraphs/name/quickswap/exchange' },
  { label: 'Aave V3 (Polygon)', value: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-polygon' },
  { label: 'Uniswap V3 (Polygon)', value: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon' },
  { label: 'Sushiswap (Polygon)', value: 'https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange' },

  // Arbitrum
  { label: 'Uniswap V3 (Arbitrum)', value: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-arbitrum' },
  { label: 'Sushiswap (Arbitrum)', value: 'https://api.thegraph.com/subgraphs/name/sushiswap/arbitrum-exchange' },
  { label: 'GMX (Arbitrum)', value: 'https://api.thegraph.com/subgraphs/name/gmx-io/gmx-stats' },
  { label: 'Aave V3 (Arbitrum)', value: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-arbitrum' },
  
  // Optimism
  { label: 'Uniswap V3 (Optimism)', value: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3-optimism' },
  { label: 'Synthetix (Optimism)', value: 'https://api.thegraph.com/subgraphs/name/synthetix-optimism/mainnet-main' },
  { label: 'Aave V3 (Optimism)', value: 'https://api.thegraph.com/subgraphs/name/aave/protocol-v3-optimism' },

  // Solana (Note: The Graph's support for Solana is via its decentralized network and may require different endpoint structures or keys. These are examples and might need verification)
  { label: 'Serum DEX (Solana - Example)', value: 'https://api.thegraph.com/subgraphs/name/project-serum/serum-dex-v3' }, // This is a conceptual example, real Solana subgraphs may use different URLs
  { label: 'Raydium (Solana - Example)', value: 'https://api.thegraph.com/subgraphs/name/raydium-exchange/raydium-amm' }, // Conceptual
  { label: 'Mango Markets v3 (Solana - Example)', value: 'https://graph.mango.markets/subgraphs/name/mango-markets/mango-v3' }, // Official, but may require API key for hosted service
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
  {
    id: 'github_api',
    name: 'GitHub API',
    icon: Github,
    description: 'Credentials for GitHub API access',
    models: [], 
    properties: [ 
        {
			displayName: 'Github Server',
			name: 'server', 
			type: 'string',
			default: 'https://api.github.com',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken', 
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
    ]
  },
  {
    id: 'google_drive_api',
    name: 'Google Drive API',
    icon: FolderKanban, 
    description: 'Credentials for Google Drive API',
    models: [],
    properties: [
        {
            displayName: 'API Key or Service Account JSON',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ],
  },
  {
    id: 'dropbox_api',
    name: 'Dropbox API',
    icon: Package, 
    description: 'Credentials for Dropbox API',
    models: [],
    properties: [
        {
            displayName: 'Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
        {
            displayName: 'API Endpoint',
            name: 'endpoint',
            type: 'string',
            default: 'https://api.dropboxapi.com',
        }
    ],
  },
  {
    id: 'gitlab_api',
    name: 'GitLab API',
    icon: Gitlab,
    description: 'Credentials for GitLab API',
    models: [],
    properties: [
        {
			displayName: 'GitLab Server URL',
			name: 'server',
			type: 'string',
			default: 'https://gitlab.com',
		},
        {
            displayName: 'Personal Access Token',
            name: 'accessToken',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
    ],
  },
  {
    id: 'trello_api',
    name: 'Trello API',
    icon: KanbanSquare, 
    description: 'Credentials for Trello API',
    models: [],
    properties: [
        {
            displayName: 'API Key & Token',
            name: 'apiKeyAndToken', // Field name for combined key and token
            type: 'string',
            typeOptions: { password: true }, // Keep it masked
            default: '',
            description: 'Enter as "key=YOUR_API_KEY&token=YOUR_API_TOKEN"',
        },
        {
            displayName: 'API Endpoint',
            name: 'endpoint',
            type: 'string',
            default: 'https://api.trello.com',
        }
    ],
  },
  {
    id: 'bitquery_api',
    name: 'Bitquery API',
    icon: DatabaseZap, 
    description: 'Credentials for Bitquery GraphQL API',
    models: [],
    properties: [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
        },
         {
            displayName: 'API Endpoint',
            name: 'endpoint',
            type: 'string',
            default: 'https://graphql.bitquery.io',
        }
    ],
  },
  {
    id: 'firebase',
    name: 'Firebase',
    icon: FirebaseIcon, 
    description: 'Credentials for Firebase services',
    models: [],
    properties: [
      {
        displayName: 'Service Account JSON (stringified)',
        name: 'serviceAccount', 
        type: 'string', 
        typeOptions: { password: true }, 
        default: '',
        description: 'Paste the content of your Firebase service account JSON file here.',
      },
      {
        displayName: 'Database URL (Optional)',
        name: 'databaseURL', 
        type: 'string',
        default: '',
        description: 'e.g., https://<YOUR_PROJECT_ID>.firebaseio.com',
      },
    ],
  },
  {
    id: 'notion_api',
    name: 'Notion API',
    icon: NotebookText,
    description: 'Credentials for Notion API access',
    models: [],
    properties: [
      {
        displayName: 'Notion Integration Token (API Key)',
        name: 'apiKey',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'Your internal integration token for Notion.',
      },
      {
        displayName: 'API Endpoint',
        name: 'endpoint',
        type: 'string',
        default: 'https://api.notion.com/v1',
      }
    ],
  },
  {
    id: 'blockchain_node_rpc',
    name: 'Blockchain Node RPC',
    icon: Network,
    description: 'Credentials for a generic Blockchain RPC endpoint (e.g., Ethereum, Polygon)',
    models: [],
    properties: [
      {
        displayName: 'RPC Endpoint URL',
        name: 'endpoint', // Stored in StoredCredential's endpoint field
        type: 'string',
        default: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID',
        description: 'The URL of the blockchain RPC node.',
      },
      {
        displayName: 'API Key (Optional)',
        name: 'apiKey', // Stored in StoredCredential's apiKey field
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'API Key if required by your RPC provider.',
      },
    ],
  },
  {
    id: 'etherscan_api',
    name: 'Etherscan API',
    icon: SearchCode,
    description: 'Credentials for Etherscan and compatible block explorers',
    models: [],
    properties: [
      {
        displayName: 'API Key',
        name: 'apiKey',
        type: 'string',
        typeOptions: { password: true },
        default: '',
      },
      {
        displayName: 'API Base URL',
        name: 'endpoint', // Reusing 'endpoint' for consistency
        type: 'string',
        default: 'https://api.etherscan.io/api',
        description: 'e.g., https://api.etherscan.io/api, https://api.bscscan.com/api, etc.',
      },
    ],
  },
  {
    id: 'the_graph_api',
    name: 'The Graph API',
    icon: GitFork, 
    description: 'Query subgraphs on The Graph Protocol',
    models: [],
    predefinedSubgraphs: theGraphPredefinedSubgraphs,
    properties: [
      {
        displayName: 'Subgraph Query URL',
        name: 'endpoint', 
        type: 'string',
        default: theGraphPredefinedSubgraphs[0]?.value || '', 
        description: `Select a predefined subgraph or choose "Custom URL..." to enter your own. Examples include popular DEXes, lending protocols, and ENS across various chains.\n` + 
                     `Ethereum: Uniswap V3, Aave V2, Compound, Curve, ENS.\n` +
                     `Polygon: QuickSwap, Aave V3, Uniswap V3.\n` +
                     `Arbitrum: Uniswap V3, GMX, Aave V3.\n` +
                     `Optimism: Uniswap V3, Synthetix, Aave V3.\n` +
                     `Solana: (Note: Solana subgraphs often use specific hosted service URLs; ensure correct URL.)`,
      },
      {
        displayName: 'API Key (Optional)',
        name: 'apiKey',
        type: 'string',
        typeOptions: { password: true },
        default: '',
        description: 'API Key for authenticated access to a specific Graph gateway or decentralized network.',
      },
    ],
  },
  {
    id: 'shopify_admin_api',
    name: 'Shopify Admin API',
    icon: ShoppingCart,
    description: 'Credentials for Shopify Admin API',
    models: [],
    properties: [
      { 
        displayName: 'Shopify Store URL (e.g., your-store.myshopify.com)', 
        name: 'endpoint', 
        type: 'string', 
        default: 'your-store.myshopify.com', 
        description: 'The *.myshopify.com domain of your store.'
      },
      { 
        displayName: 'Admin API Access Token', 
        name: 'apiKey', 
        type: 'string', 
        typeOptions: { password: true }, 
        default: '', 
        description: 'Your Shopify Admin API access token (for custom or private apps).'
      },
    ],
  },
  {
    id: 'pubmed_api',
    name: 'PubMed API',
    icon: Stethoscope,
    description: 'Search medical literature on PubMed (NCBI E-utilities)',
    models: [],
    properties: [
      { 
        displayName: 'NCBI API Key (Optional)', 
        name: 'apiKey', 
        type: 'string', 
        typeOptions: { password: true }, 
        default: '', 
        description: 'Optional. Provides higher request rates.'
      },
      { 
        displayName: 'PubMed API Base URL', 
        name: 'endpoint', 
        type: 'string', 
        default: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/', 
        description: 'Base URL for NCBI E-utilities.'
      },
    ],
  },
];

export const getAllChatModels = (): LLMModel[] => {
  return llmProviders.flatMap(provider => provider.models.filter(model => model.isChatModel));
};

export const getProviderById = (providerId: string): LLMProvider | undefined => {
  return llmProviders.find(p => p.id === providerId);
};
