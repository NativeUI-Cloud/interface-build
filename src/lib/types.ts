
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

export interface MarqueeReviewType {
  id: string;
  name: string;
  username: string;
  body: string;
  img: string;
  cardBackgroundColor?: string;
  cardTextColor?: string;
}

export interface TerminalLine {
  id: string;
  type: 'typing' | 'animated';
  text: string | React.ReactNode;
  delay?: number;
  className?: string;
}

export interface HeroVideoData {
  videoSrc: string;
  thumbnailSrcLight: string;
  thumbnailSrcDark: string;
  thumbnailAlt: string;
  animationStyle: 'from-left' | 'from-right' | 'from-top' | 'from-bottom' | 'from-center' | 'none';
}

export interface BentoFeature {
  id: string;
  Icon: React.ElementType;
  name: string;
  description: string;
  href: string;
  cta: string;
  className: string;
  background?: React.ReactNode;
}

export interface BentoData {
  features: BentoFeature[];
}

// For Animated List (Magic UI)
export interface AnimatedListItem {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji or character
  color: string; // Hex color
  time: string;
}

export interface AnimatedListData {
  items: AnimatedListItem[];
}

export interface CommandOption {
  id: string;
  label: string;
}

export interface NavLinkItem {
  id: string;
  text: string;
  href: string;
  isButton?: boolean;
  submenu?: NavLinkItem[];
}

export type HeaderLayout = 
  | 'logo-left-nav-right' 
  | 'logo-center-nav-split' 
  | 'logo-center-nav-below' 
  | 'nav-left-logo-center-actions-right' 
  | 'logo-left-nav-left-actions-right';

export interface HeaderElementData {
  siteTitle?: string;
  logoUrl?: string;
  navLinks?: NavLinkItem[];
  backgroundColor?: string;
  textColor?: string;
  sticky?: boolean;
  layout?: HeaderLayout;
  gradientClass?: string;
  templateId?: string;
}

export interface HeaderTemplate {
  id: string;
  name: string;
  description: string;
  icon?: React.ElementType;
  data: Partial<HeaderElementData>;
}


export type HtmlTag = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TailwindFontSize = 
  | 'text-xs' | 'text-sm' | 'text-base' | 'text-lg' | 'text-xl' 
  | 'text-2xl' | 'text-3xl' | 'text-4xl' | 'text-5xl' | 'text-6xl';
export type TextAlignment = 'text-left' | 'text-center' | 'text-right';


// New Element Data Structures
export interface TestimonialCardData {
  quote: string;
  authorName: string;
  authorRole?: string;
  avatarUrl?: string;
  cardBackgroundColor?: string;
  textColor?: string;
}

export interface FeatureItemData {
  iconName: string; // Lucide icon name string
  title: string;
  description: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface LogoItem {
  id: string;
  src: string;
  alt: string;
  href?: string;
}
export interface LogoCloudData {
  logos: LogoItem[];
  title?: string;
  columns?: 2 | 3 | 4 | 5 | 6;
}

export interface FooterLink {
  id: string;
  text: string;
  href: string;
}
export interface FooterColumn {
  id: string;
  title?: string;
  links: FooterLink[];
}
export interface FooterData {
  copyrightText?: string;
  columns?: FooterColumn[];
  backgroundColor?: string;
  textColor?: string;
  socialLinks?: { platform: 'twitter' | 'facebook' | 'linkedin' | 'instagram' | string; href: string }[];
}


export interface WebElementDefinition {
  name: string;
  type: string;
  previewComponent: React.ReactNode;
  initialData: Partial<CanvasElement['data']>; // Use Partial here
  icon?: React.ElementType;
  category: string;
}

export interface CanvasElement {
  id: string;
  name: string;
  type: 'HeaderElement' | 'Section' | 'Heading' | 'TextBlock' | 'Image' | 'Button' | 'MagicCommandPalette' | 'Alert' | 'Card' | 'Dialog' | 'Tabs' | 'Tooltip' | 'MarqueeTestimonials' | 'TerminalAnimation' | 'HeroVideoDialog' | 'BentoGrid' | 'AnimatedList' | 'PricingTable' | 'FaqAccordion' | 'TeamSection' | 'ContactForm' | 'CtaSection' | 'TestimonialCard' | 'FeatureItem' | 'LogoCloud' | 'Footer' | string;
  data: {
    reviews?: MarqueeReviewType[];
    lines?: TerminalLine[];
    videoSrc?: string;
    thumbnailSrcLight?: string;
    thumbnailSrcDark?: string;
    thumbnailAlt?: string;
    animationStyle?: HeroVideoData['animationStyle'];
    features?: BentoFeature[];
    items?: AnimatedListItem[];
    commands?: CommandOption[];
    // Header specific data
    siteTitle?: string;
    logoUrl?: string;
    navLinks?: NavLinkItem[];
    backgroundColor?: string; // For elements like Section/Row, Header itself
    textColor?: string; // For Header text color, TestimonialCard text
    sticky?: boolean;
    layout?: HeaderElementData['layout'];
    gradientClass?: string;
    templateId?: string;
    // Generic text/button data
    text?: string;
    htmlTag?: HtmlTag; // For Heading and TextBlock
    fontSize?: TailwindFontSize; // For text elements
    textAlign?: TextAlignment; // For text elements
    cursor?: string; // For element-specific cursor
    // level property is deprecated for Heading, use htmlTag
    src?: string; // For Image, LogoItem
    alt?: string; // For Image, LogoItem
    width?: number; // For Image
    height?: number; // For Image
    variant?: string; // For Button, Alert
    className?: string; // For Section general styling
    plans?: any[]; // For Pricing Table
    // For FAQ Accordion
    // For Team Section
    members?: any[];
    // For Contact Form
    fields?: any[];
    // For CTA Section
    buttonText?: string;
    // AI Hint for images
    'data-ai-hint'?: string;

    // New Element Data
    quote?: string; // TestimonialCard
    authorName?: string; // TestimonialCard
    authorRole?: string; // TestimonialCard
    avatarUrl?: string; // TestimonialCard
    cardBackgroundColor?: string; // TestimonialCard

    iconName?: string; // FeatureItem (lucide icon name)
    title?: string; // FeatureItem, LogoCloud, CtaSection
    description?: string; // FeatureItem
    alignment?: 'left' | 'center' | 'right'; // FeatureItem

    logos?: LogoItem[]; // LogoCloud
    columns?: 2 | 3 | 4 | 5 | 6; // LogoCloud, Footer columns

    copyrightText?: string; // Footer
    // Footer columns are part of 'columns' property above using FooterColumn[]
    socialLinks?: { platform: string; href: string }[]; // Footer
  };
}

export interface CanvasRow {
  id: string;
  layout: 'grid-cols-1' | 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4' | string;
  elements: CanvasElement[];
  backgroundColor?: string; // Added for row-specific background color
}

export interface Breakpoint {
  name: string;
  width: number;
  icon: React.ElementType;
}

// For AI Landing Page Code Generator (if distinct from visual builder elements)
export interface GenerateLandingPageCodeInput {
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pageTitle?: string;
  fontFamilyName?: string;
  fontFamilyImportUrl?: string;
}

// Project data structure for localStorage
export interface ProjectData {
  id: string; // Renamed from currentProjectId for clarity in storage
  pageTitle: string;
  canvasRows: CanvasRow[];
  lastModified: string;
  pageFillColor?: string;
  fontFamilyName?: string;
  fontFamilyImportUrl?: string;
  bodyBackgroundColor?: string; // New: For the overall page body background
  propPageCursor?: string; // New: For page-level cursor
}
    

    
