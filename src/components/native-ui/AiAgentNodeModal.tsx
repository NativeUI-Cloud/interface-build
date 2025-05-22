
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Bot, FlaskConical, ExternalLink, Info, SquareSlash, ChevronDown, Plus, Settings2, ScrollText, Database, KeyRound, CheckCircle2, AlertTriangle, XCircle, Brain, Cpu, Container, Leaf, ToyBrick, Feather, Wrench, DollarSign, Github, FolderKanban, Package, Gitlab, KanbanSquare, DatabaseZap, Flame, NotebookText, Network, SearchCode, GitFork, ShoppingCart, Stethoscope, BookOpenCheck } from 'lucide-react';
import type { Node, StoredCredential, AnyToolConfig, AgentTemplate } from '@/lib/types';
import ChatModelSelectionModal from './ChatModelSelectionModal';
import { getCredentialById } from '@/lib/credentialsStore';
import { getAllChatModels } from '@/lib/llmProviders';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ActionListItem from './ActionListItem';
import { agentTemplates } from '@/lib/agentTemplates'; // Import templates


interface AiAgentNodeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  node?: Node | null;
  onNodeConfigChange: (nodeId: string, data: Partial<Node['data']>) => void;
  onOpenToolConfiguration: (agentNodeId: string, toolType: string, existingToolId?: string) => void;
  onOpenGitHubApiCredentialModal: (agentNodeId: string, existingToolId?: string) => void; 
  initialSection?: string; 
}

type PromptSource = 'chat-trigger' | 'system-prompt';

export default function AiAgentNodeModal({ 
  isOpen, 
  onOpenChange, 
  node, 
  onNodeConfigChange, 
  onOpenToolConfiguration,
  onOpenGitHubApiCredentialModal,
  initialSection 
}: AiAgentNodeModalProps) {
  const modalTitle = node?.name || 'AI Agent';
  const [isChatModelModalOpen, setIsChatModelModalOpen] = useState(false);
  
  const [selectedChatModelName, setSelectedChatModelName] = useState<string | null>(null);
  const [currentCredentialStatus, setCurrentCredentialStatus] = useState<StoredCredential['status'] | null>(null);
  const [currentCredentialValidationError, setCurrentCredentialValidationError] = useState<string | undefined>(undefined);


  const [promptSource, setPromptSource] = useState<PromptSource>('chat-trigger');
  const [systemPrompt, setSystemPrompt] = useState<string>(''); // Renamed from customPrompt
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>(node?.data?.templateId);
  const [loadedTemplateDescription, setLoadedTemplateDescription] = useState<string | undefined>(undefined);
  const [loadedTemplateSuggestedTools, setLoadedTemplateSuggestedTools] = useState<string[] | undefined>(undefined);


  const memoryOptions = [
    { id: 'simple', title: 'Simple Memory', description: 'Stores in n8n memory, so no credentials required', icon: Database },
    { id: 'motorhead', title: 'Motorhead', description: 'Use Motorhead Memory', icon: Cpu },
    { id: 'postgres', title: 'Postgres Chat Memory', description: 'Stores the chat history in Postgres table.', icon: Container },
    { id: 'mongodb', title: 'MongoDB Chat Memory', description: 'Stores the chat history in MongoDB collection.', icon: Leaf },
    { id: 'redis', title: 'Redis Chat Memory', description: 'Stores the chat history in Redis.', icon: Container },
    { id: 'xata', title: 'Xata', description: 'Use Xata Memory', icon: Feather },
    { id: 'zep', title: 'Zep', description: 'Use Zep Memory', icon: ToyBrick },
  ];
  const [selectedMemory, setSelectedMemory] = useState<string | null>(node?.data?.memoryType || null);

  useEffect(() => {
    if (isOpen && node?.data) {
      setPromptSource(node.data.promptSource || 'chat-trigger');
      setSystemPrompt(node.data.systemPrompt || ''); // Use systemPrompt
      setSelectedMemory(node.data.memoryType || null);
      setSelectedTemplateId(node.data.templateId);

      if (node.data.templateId) {
        const template = agentTemplates.find(t => t.id === node.data.templateId);
        setLoadedTemplateDescription(template?.description);
        setLoadedTemplateSuggestedTools(template?.suggestedToolTypes);
      } else {
        setLoadedTemplateDescription(undefined);
        setLoadedTemplateSuggestedTools(undefined);
      }
      
      if (node.data.chatModelCredentialStatus) {
        setCurrentCredentialStatus(node.data.chatModelCredentialStatus);
        setCurrentCredentialValidationError(node.data.chatModelValidationError);
      } else if (node.data.chatModelCredentialId) {
        const credential = getCredentialById(node.data.chatModelCredentialId);
        if (credential) {
          setCurrentCredentialStatus(credential.status);
          setCurrentCredentialValidationError(credential.validationError);
        } else {
          setCurrentCredentialStatus(null);
          setCurrentCredentialValidationError(undefined);
        }
      } else {
        setCurrentCredentialStatus(null);
        setCurrentCredentialValidationError(undefined);
      }

      if (node.data.selectedModelId) {
        const allModels = getAllChatModels();
        const modelDetails = allModels.find(m => m.id === node.data.selectedModelId);
        setSelectedChatModelName(modelDetails?.name || 'Configured Model');
      } else if (node.data.chatModelCredentialId) {
        const credential = getCredentialById(node.data.chatModelCredentialId);
        setSelectedChatModelName(credential?.name || 'Configured Model');
      } else {
        setSelectedChatModelName(null);
      }

    } else if (!isOpen) {
      setSelectedChatModelName(null);
      setCurrentCredentialStatus(null);
      setCurrentCredentialValidationError(undefined);
      setLoadedTemplateDescription(undefined);
      setLoadedTemplateSuggestedTools(undefined);
      if (!node) { 
        setPromptSource('chat-trigger');
        setSystemPrompt('');
        setSelectedMemory(null);
        setSelectedTemplateId(undefined);
      }
    }
  }, [isOpen, node?.data]);

  const handlePromptSourceChange = (value: string) => {
    const newSource = value as PromptSource;
    setPromptSource(newSource);
    if (node) {
      onNodeConfigChange(node.id, { ...node.data, promptSource: newSource });
    }
  };

  const handleSystemPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = event.target.value;
    setSystemPrompt(newPrompt);
    if (node) {
      onNodeConfigChange(node.id, { ...node.data, systemPrompt: newPrompt, templateId: undefined }); // Clear templateId if prompt is manually edited
      setSelectedTemplateId(undefined);
      setLoadedTemplateDescription(undefined);
      setLoadedTemplateSuggestedTools(undefined);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    const selectedTemplate = agentTemplates.find(t => t.id === templateId);
    if (selectedTemplate && node) {
      setSystemPrompt(selectedTemplate.systemPrompt);
      setPromptSource('system-prompt'); // Assume template implies system prompt
      setSelectedTemplateId(selectedTemplate.id);
      setLoadedTemplateDescription(selectedTemplate.description);
      setLoadedTemplateSuggestedTools(selectedTemplate.suggestedToolTypes);
      onNodeConfigChange(node.id, { 
        ...node.data, 
        systemPrompt: selectedTemplate.systemPrompt,
        promptSource: 'system-prompt',
        templateId: selectedTemplate.id 
      });
    } else if (templateId === "none" && node) {
      // User selected "No Template" or similar
      setSelectedTemplateId(undefined);
      // Optionally clear the prompt or revert to a default, or just let user manage it.
      // For now, just clear template tracking. User can clear prompt manually if desired.
      setLoadedTemplateDescription(undefined);
      setLoadedTemplateSuggestedTools(undefined);
      onNodeConfigChange(node.id, { ...node.data, templateId: undefined });
    }
  };


  const handleChatModelCredentialSelected = (credentialId: string, modelId: string) => {
    if (node) {
      const credential = getCredentialById(credentialId);
      onNodeConfigChange(node.id, { 
        ...node.data, 
        chatModelCredentialId: credentialId, 
        selectedModelId: modelId,
        selectedProviderId: credential?.providerId,
        chatModelCredentialStatus: credential?.status, 
        chatModelValidationError: credential?.validationError, 
      });
    }
    setIsChatModelModalOpen(false); 
  };

  const handleMemorySelect = (memoryId: string) => {
    setSelectedMemory(memoryId);
    if (node) {
      onNodeConfigChange(node.id, { ...node.data, memoryType: memoryId });
    }
    console.log(`Memory selected: ${memoryId}`);
  };
  
  const handleAddOrConfigureTool = (toolType: string) => {
    if (node) {
      const existingTool = node.data?.tools?.find(t => t.type === toolType);
      // Always open configuration, whether new or existing.
      // The tool-specific modal or credential manager will handle "new" vs "edit".
      onOpenToolConfiguration(node.id, toolType, existingTool?.id);
    }
  };

  const getStatusIconAndColor = () => {
    switch (currentCredentialStatus) {
      case 'valid': return { icon: <CheckCircle2 className="h-4 w-4 text-green-500" />, color: 'text-green-500' };
      case 'invalid': return { icon: <XCircle className="h-4 w-4 text-red-500" />, color: 'text-red-500' };
      case 'unchecked': return { icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />, color: 'text-yellow-500' };
      default: return { icon: <Plus className="mr-2 h-4 w-4" />, color: '' };
    }
  };
  const { icon: statusIcon, color: statusColor } = getStatusIconAndColor();

  const availableTools = [
    { type: 'COINGECKO', title: 'CoinGecko Tool', description: 'Consume CoinGecko API for cryptocurrency data.', icon: DollarSign },
    { type: 'GITHUB_API', title: 'GitHub API Tool', description: 'Interact with the GitHub API.', icon: Github },
    { type: 'GOOGLE_DRIVE_API', title: 'Google Drive Tool', description: 'Interact with Google Drive files.', icon: FolderKanban },
    { type: 'DROPBOX_API', title: 'Dropbox Tool', description: 'Interact with Dropbox files.', icon: Package },
    { type: 'GITLAB_API', title: 'GitLab API Tool', description: 'Interact with GitLab repositories.', icon: Gitlab },
    { type: 'TRELLO_API', title: 'Trello Tool', description: 'Manage Trello boards and cards.', icon: KanbanSquare },
    { type: 'BITQUERY_API', title: 'Bitquery API Tool', description: 'Access blockchain data via Bitquery GraphQL API.', icon: DatabaseZap },
    { type: 'FIREBASE_TOOL', title: 'Firebase Tool', description: 'Interact with Firebase services.', icon: Flame },
    { type: 'NOTION_TOOL', title: 'Notion Tool', description: 'Interact with Notion pages and databases.', icon: NotebookText },
    { type: 'BLOCKCHAIN_DATA_TOOL', title: 'Blockchain Data Tool', description: 'Fetch data from various blockchains.', icon: Network },
    { type: 'ETHERSCAN_API', title: 'Etherscan API Tool', description: 'Query Etherscan-like blockchain explorers.', icon: SearchCode },
    { type: 'THE_GRAPH_API', title: 'The Graph Tool', description: 'Query subgraphs from The Graph Protocol.', icon: GitFork },
    { type: 'SHOPIFY_ADMIN_TOOL', title: 'Shopify Admin Tool', description: 'Interact with Shopify stores via Admin API.', icon: ShoppingCart },
    { type: 'PUBMED_SEARCH_TOOL', title: 'PubMed Search Tool', description: 'Search for medical literature on PubMed.', icon: Stethoscope },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-2xl bg-card text-foreground p-0">
          <DialogHeader className="p-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="h-7 w-7 text-primary" />
                <DialogTitle className="text-xl font-semibold">{modalTitle}</DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <FlaskConical className="mr-2 h-4 w-4" />
                  Test step
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Docs
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </DialogHeader>

          <Tabs defaultValue={initialSection || "parameters"} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger value="parameters" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                <ScrollText className="mr-2 h-5 w-5" />
                Parameters
              </TabsTrigger>
               <TabsTrigger value="memory" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                <Brain className="mr-2 h-5 w-5" />
                Memory
              </TabsTrigger>
              <TabsTrigger value="tools" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                <Wrench className="mr-2 h-5 w-5" />
                Tools
              </TabsTrigger>
              <TabsTrigger value="settings" className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none">
                <Settings2 className="mr-2 h-5 w-5" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <TabsContent value="parameters" className="mt-0 space-y-6">
                <Alert variant="default" className="bg-accent/10 border-accent/30">
                  <Info className="h-5 w-5 text-accent" />
                  <AlertDescription className="text-accent-foreground/90">
                    Tip: Get a feel for agents with our quick{' '}
                    <a href="#" className="underline hover:text-accent">tutorial</a> or see an{' '}
                    <a href="#" className="underline hover:text-accent">example</a> of how this node works.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="template-select">Load Template (Optional)</Label>
                  <Select value={selectedTemplateId || "none"} onValueChange={handleTemplateSelect}>
                    <SelectTrigger id="template-select" className="bg-background">
                      <SelectValue placeholder="Select a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Template (Custom)</SelectItem>
                      {agentTemplates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex items-center">
                            {template.icon && <template.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                            {template.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedTemplateId && loadedTemplateDescription && (
                    <Alert variant="default" className="mt-2 border-border bg-muted/30">
                      <BookOpenCheck className="h-5 w-5 text-muted-foreground"/>
                      <AlertTitle className="font-medium text-foreground/90">
                        Template: {agentTemplates.find(t=>t.id === selectedTemplateId)?.name}
                      </AlertTitle>
                      <AlertDescription className="text-xs text-muted-foreground">
                        {loadedTemplateDescription}
                        {loadedTemplateSuggestedTools && loadedTemplateSuggestedTools.length > 0 && (
                          <div className="mt-1">
                            <strong>Suggested Tools:</strong> {loadedTemplateSuggestedTools.join(', ')}. Configure these in the 'Tools' tab.
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>


                <div className="space-y-2">
                  <Label htmlFor="source-prompt">Source for Prompt (User Message)</Label>
                  <Select 
                    value={promptSource} 
                    onValueChange={handlePromptSourceChange}
                  >
                    <SelectTrigger id="source-prompt" className="bg-background">
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chat-trigger">Connected Chat Trigger Node</SelectItem>
                      <SelectItem value="system-prompt">Use System Prompt Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="system-prompt">System Prompt (Guides AI Behavior)</Label>
                  <div className="relative">
                    <Textarea
                      id="system-prompt"
                      value={promptSource === 'system-prompt' ? systemPrompt : (promptSource === 'chat-trigger' ? "{{ $json.chatInput }}" : systemPrompt)}
                      onChange={handleSystemPromptChange}
                      disabled={promptSource === 'chat-trigger'}
                      placeholder={promptSource === 'system-prompt' ? 'Enter your system prompt here (e.g., You are a helpful assistant)...' : 'Input will come from Chat Trigger'}
                      className="bg-background min-h-[100px] pr-10"
                      rows={6}
                    />
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7 text-muted-foreground hover:text-foreground">
                      <SquareSlash className="h-4 w-4" />
                      <span className="sr-only">Edit expression</span>
                    </Button>
                  </div>
                  {promptSource === 'chat-trigger' && node?.data?.inputConnected === false && <p className="text-xs text-destructive">[WARN: Chat Trigger input not connected on canvas]</p> }
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="require-output-format" className="flex-grow">
                    Require Specific Output Format
                  </Label>
                  <Switch id="require-output-format" />
                </div>
                
                <div className="space-y-2">
                  <Label>Options</Label>
                  <div className="p-3 rounded-md border border-dashed border-border bg-background text-sm text-muted-foreground">
                    No properties
                  </div>
                  <Button variant="outline" className="w-full justify-between bg-background">
                    Add Option
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="memory" className="mt-0 space-y-4">
                <Alert variant="default" className="border-border bg-muted/50">
                  <Brain className="h-5 w-5 text-foreground/70" />
                  <AlertDescription className="text-foreground/80">
                    Memory allows an AI model to remember and reference past interactions with it.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  {memoryOptions.map((option) => (
                    <ActionListItem
                      key={option.id}
                      icon={option.icon}
                      title={option.title}
                      description={option.description}
                      onClick={() => handleMemorySelect(option.id)}
                      className={selectedMemory === option.id ? 'bg-accent/20 border-accent ring-1 ring-accent' : 'hover:bg-muted/30'}
                    />
                  ))}
                </div>
                 {selectedMemory && (
                  <Alert variant="default" className="mt-6">
                    <AlertTitle>Configure {memoryOptions.find(m => m.id === selectedMemory)?.title}</AlertTitle>
                    <AlertDescription>
                      Further configuration options for the selected memory type ({selectedMemory}) would appear here. This might include connection details, limits, etc.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="tools" className="mt-0 space-y-4">
                 <Alert variant="default" className="border-border bg-muted/50">
                  <Wrench className="h-5 w-5 text-foreground/70" />
                  <AlertDescription className="text-foreground/80">
                    Tools allow AI Agents to interact with external services or perform specific actions.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  {node?.data?.tools && node.data.tools.length > 0 && (
                    <div className="mb-4">
                      <Label className="text-sm font-medium">Configured Tools:</Label>
                      {node.data.tools.map((tool: AnyToolConfig) => {
                        const toolDef = availableTools.find(at => at.type === tool.type);
                        return (
                         <ActionListItem
                          key={tool.id}
                          icon={toolDef?.icon || Settings2}
                          title={toolDef?.title || `${tool.type.replace(/_API|_TOOL/gi, '')} Tool`}
                          description={`ID: ${tool.id.substring(0,8)}... - Click to reconfigure`}
                          onClick={() => handleAddOrConfigureTool(tool.type)} // Will open config for this existing tool
                          className={'bg-muted/30'}
                        />
                        );
                      })}
                    </div>
                  )}

                  <Label className="text-sm font-medium">Available Tools to Add:</Label>
                   {availableTools.map(tool => (
                     <ActionListItem
                      key={tool.type}
                      icon={tool.icon}
                      title={tool.title}
                      description={tool.description}
                      onClick={() => handleAddOrConfigureTool(tool.type)} // Will open config for adding this new tool
                      className="hover:bg-muted/30"
                    />
                   ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-0">
                <div className="flex items-center justify-center h-40 border border-dashed rounded-md bg-background">
                  <p className="text-muted-foreground">Settings for {modalTitle} will appear here.</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          <DialogFooter className="p-6 border-t border-border bg-muted/30 flex flex-row justify-around items-center">
            <div className="flex flex-col items-center gap-1">
                <Label htmlFor="chat-model-btn" className={`text-xs text-muted-foreground ${statusColor}`}>
                    Chat Model{' '}
                    {selectedChatModelName ? (
                        <>
                        ({selectedChatModelName})
                        {currentCredentialStatus === 'invalid' && currentCredentialValidationError && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="ml-1 cursor-help">{statusIcon}</span>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="text-destructive-foreground bg-destructive p-2 rounded-md">{currentCredentialValidationError}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {currentCredentialStatus && currentCredentialStatus !== 'invalid' && <span className="ml-1">{statusIcon}</span>}
                        </>
                    ) : (
                        <span className="text-destructive">*</span>
                    )}
                </Label>
              <Button 
                id="chat-model-btn" 
                variant={selectedChatModelName ? (currentCredentialStatus === 'invalid' ? "destructive" : "default") : "outline"} 
                size="sm" 
                className="bg-background hover:bg-accent/10"
                onClick={() => setIsChatModelModalOpen(true)}
              >
                {selectedChatModelName && currentCredentialStatus !== null && currentCredentialStatus !== 'unchecked' && currentCredentialStatus !== 'invalid' ? <KeyRound className="mr-2 h-4 w-4" /> : (selectedChatModelName ? statusIcon : <Plus className="mr-2 h-4 w-4" /> )}
                {selectedChatModelName ? 'Change Model' : 'Add Model'}
              </Button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Label htmlFor="memory-btn" className="text-xs text-muted-foreground">Memory {node?.data?.memoryType ? `(${node.data.memoryType})`: ''}</Label>
              <Button 
                id="memory-btn" 
                variant={node?.data?.memoryType ? "default" : "outline"} 
                size="icon" 
                className="rounded-full bg-background hover:bg-accent/10"
                onClick={() => {
                  // Consider focusing the Memory tab if already in this modal
                }}
              >
                <Database className="h-5 w-5" />
                <span className="sr-only">Add Memory</span>
              </Button>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Label htmlFor="tool-btn" className="text-xs text-muted-foreground">Tool</Label>
              <Button 
                id="tool-btn" 
                variant={node?.data?.tools && node.data.tools.length > 0 ? "default" : "outline"}
                size="icon" 
                className="rounded-full bg-background hover:bg-accent/10"
                onClick={() => {
                  // Consider focusing the Tools tab
                }}
              >
                <Settings2 className="h-5 w-5" />
                <span className="sr-only">Add Tool</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ChatModelSelectionModal
        isOpen={isChatModelModalOpen}
        onOpenChange={setIsChatModelModalOpen}
        onCredentialSelected={handleChatModelCredentialSelected}
        currentConfiguredProviderId={node?.data?.selectedProviderId}
        currentConfiguredModelId={node?.data?.selectedModelId}
        currentConfiguredCredentialId={node?.data?.chatModelCredentialId}
      />
    </>
  );
}
