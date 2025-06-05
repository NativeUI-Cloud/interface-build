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
  cardBackgroundColor?: string; // User-defined color for this specific card
  textColor?: string; // User-defined text color for this specific card
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

export interface AnnouncementBarData {
  text?: string;
  linkText?: string;
  linkHref?: string;
  variant?: 'base' | 'fixed' | 'floating';
  dismissible?: boolean;
  backgroundColor?: string; // Tailwind class or hex color
  textColor?: string;       // Tailwind class or hex color
  linkColor?: string;         // Tailwind class or hex color for the link
  // Optional specific button colors if needed, otherwise derive from textColor/bgColor
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonBorderColor?: string;
}

export interface ConnectWalletButtonData {
    text?: string;
    className?: string;
}

export interface NftDisplayCardData {
    imageUrl?: string;
    name?: string;
    collection?: string;
    price?: string;
    'data-ai-hint'?: string;
}

export interface TokenInfoDisplayData {
    tokenSymbol?: string;
    price?: string;
    marketCap?: string;
}

export interface RoadmapPhase {
    id: string;
    title: string;
    description: string;
}
export interface RoadmapTimelineData {
    phases: RoadmapPhase[];
}

export type BadgeVariant = "default" | "secondary" | "destructive" | "outline";
export interface BadgeElementData {
  text?: string;
  variant?: BadgeVariant;
}

export interface SeparatorElementData {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export interface ProgressElementData {
  value?: number; // 0-100
  indicatorColor?: string; // Tailwind class
  backgroundColor?: string; // Tailwind class
}

export interface SkeletonElementData {
  width?: string; // e.g., 'w-full', 'w-1/2', 'w-32'
  height?: string; // e.g., 'h-4', 'h-32'
  className?: string; // For additional custom styling like rounded corners
}

export interface AlertElementData {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  iconName?: string; // Optional: lucide icon name
}

// Web3 / API Specific Elements
export interface ApiDataItem {
  id: string;
  key: string;
  value: string;
}
export interface ApiDataDisplayData {
  title?: string;
  items: ApiDataItem[];
  layout?: 'list' | 'table'; // Potential future enhancement
}

export type TransactionStatus = 'pending' | 'success' | 'failed' | 'unknown';
export interface TransactionStatusData {
  status?: TransactionStatus;
  transactionId?: string;
  message?: string; // e.g., "Transaction confirmed on block X" or "Error: Insufficient funds"
}

export type ProposalStatus = 'active' | 'passed' | 'failed' | 'pending' | 'executed';
export interface GovernanceProposalData {
  title?: string;
  proposer?: string;
  summary?: string;
  status?: ProposalStatus;
  endDate?: string; // ISO string or human-readable
  votesFor?: string; // e.g., "1.2M XYZ" or percentage
  votesAgainst?: string;
}


export interface WebElementDefinition {
  name: string;
  type: string;
  previewComponent: React.ReactNode;
  initialData: Partial<CanvasElement['data']>;
  icon?: React.ElementType;
  category: string;
}

export interface CanvasElement {
  id: string;
  name: string;
  type: 'HeaderElement' | 'Section' | 'Heading' | 'TextBlock' | 'Image' | 'Button' | 'MagicCommandPalette' | 'Alert' | 'Card' | 'Dialog' | 'Tabs' | 'Tooltip' | 'MarqueeTestimonials' | 'TerminalAnimation' | 'HeroVideoDialog' | 'BentoGrid' | 'AnimatedList' | 'PricingTable' | 'FaqAccordion' | 'TeamSection' | 'ContactForm' | 'CtaSection' | 'TestimonialCard' | 'FeatureItem' | 'LogoCloud' | 'Footer' | 'AnnouncementBar' | 'ConnectWalletButton' | 'NftDisplayCard' | 'TokenInfoDisplay' | 'RoadmapTimeline' | 'BadgeElement' | 'SeparatorElement' | 'ProgressElement' | 'SkeletonElement' | 'ApiDataDisplay' | 'TransactionStatusDisplay' | 'GovernanceProposalCard' | string;
  data: Partial<HeaderElementData & MarqueeReviewType[] & TerminalLine[] & HeroVideoData & BentoFeature[] & AnimatedListItem[] & CommandOption[] & TestimonialCardData & FeatureItemData & LogoCloudData & FooterData & AnnouncementBarData & ConnectWalletButtonData & NftDisplayCardData & TokenInfoDisplayData & RoadmapTimelineData & BadgeElementData & SeparatorElementData & ProgressElementData & SkeletonElementData & AlertElementData & ApiDataDisplayData & TransactionStatusData & GovernanceProposalData & {
    // Common/generic fields
    text?: string;
    htmlTag?: HtmlTag;
    fontSize?: TailwindFontSize;
    textAlign?: TextAlignment;
    cursor?: string;
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    variant?: string | BadgeVariant | AlertElementData['variant']; // For Button, Alert, AnnouncementBar, Badge
    className?: string; // For Section general styling, custom classes
    'data-ai-hint'?: string;
    backgroundColor?: string; // General purpose background color
    textColor?: string; // General purpose text color
    linkColor?: string; // General purpose link color
    dismissible?: boolean; // For AnnouncementBar
    // For specific complex elements, they'll have their own structures
    reviews?: MarqueeReviewType[];
    lines?: TerminalLine[];
    // videoSrc, thumbnailSrcLight, thumbnailSrcDark etc are on HeroVideoData
    features?: BentoFeature[];
    items?: AnimatedListItem[] | ApiDataItem[]; // For AnimatedList and ApiDataDisplay
    // commands for MCP are on CommandOption[]
    // plans for PricingTable
    // members for TeamSection
    // fields for ContactForm
    // buttonText for CtaSection
    // quote, authorName etc for TestimonialCard
    // iconName, title, description, alignment for FeatureItem
    // logos, title, columns for LogoCloud
    // copyrightText, columns, socialLinks for Footer
    // linkText, linkHref, variant, button colors for AnnouncementBar
    // New Web3 elements
    imageUrl?: string; // For NftDisplayCard
    // name is already common for NftDisplayCard
    collection?: string; // For NftDisplayCard
    // price is already common for NftDisplayCard
    tokenSymbol?: string; // For TokenInfoDisplay
    // price is also for TokenInfoDisplay
    marketCap?: string; // For TokenInfoDisplay
    phases?: RoadmapPhase[]; // For RoadmapTimeline
    // New Shadcn simple elements
    orientation?: "horizontal" | "vertical"; // For Separator
    decorative?: boolean; // For Separator
    value?: number; // For Progress
    indicatorColor?: string; // For Progress
    // width, height, className already common for Skeleton
    title?: string; // For Alert, ApiDataDisplay, GovernanceProposalCard
    description?: string; // For Alert, FeatureItem, GovernanceProposalCard
    // iconName also for Alert
    // Web3 / API specific properties
    status?: TransactionStatus | ProposalStatus; // For TransactionStatus and GovernanceProposal
    transactionId?: string; // For TransactionStatus
    message?: string; // For TransactionStatus
    proposer?: string; // For GovernanceProposal
    summary?: string; // For GovernanceProposal
    endDate?: string; // For GovernanceProposal
    votesFor?: string; // For GovernanceProposal
    votesAgainst?: string; // For GovernanceProposal
    layout?: 'list' | 'table'; // For ApiDataDisplay
  }>;
}


export interface CanvasRow {
  id: string;
  layout: 'grid-cols-1' | 'grid-cols-2' | 'grid-cols-3' | 'grid-cols-4' | string;
  elements: CanvasElement[];
  backgroundColor?: string;
}

export interface Breakpoint {
  name: string;
  width: number;
  icon: React.ElementType;
}

export interface GenerateLandingPageCodeInput {
  description: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  pageTitle?: string;
  fontFamilyName?: string;
  fontFamilyImportUrl?: string;
}

export interface ProjectData {
  id: string;
  pageTitle: string;
  canvasRows: CanvasRow[];
  lastModified: string;
  pageFillColor?: string;
  fontFamilyName?: string;
  fontFamilyImportUrl?: string;
  bodyBackgroundColor?: string;
  propPageCursor?: string;
}

// For Landing Page AI Chat Assistant
export interface LandingPageChatInput {
  userInput: string;
  currentPageContext?: string; // Optional: a string representation of the current page structure
  selectedModelIdentifier?: string; // e.g., "googleai/gemini-1.5-pro-latest"
}
export interface LandingPageChatOutput {
  aiResponse: string;
  // In future, could include structured commands:
  // commands?: { action: 'add_element' | 'modify_element' | 'delete_element', details: any }[];
  error?: string;
}

