
// @ts-nocheck
// TODO: Fix TS errors
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Header from './Header';
import ComponentsPalette from './ComponentsPalette';
import CanvasArea from './CanvasArea';
import AiAssistantPanel from './AiAssistantPanel';
import AiAgentNodeModal from './AiAgentNodeModal';
import ChatModelSelectionModal from './ChatModelSelectionModal';
import WorkflowNameModal from './WorkflowNameModal';
import ShareWorkflowModal from './ShareWorkflowModal';
import OpenWorkflowModal from './OpenWorkflowModal';
import CoinGeckoToolModal from './CoinGeckoToolModal';
import GitHubApiCredentialModal from './GitHubApiCredentialModal';
import TelegramTriggerNodeModal from './TelegramTriggerNodeModal';
import LoginModal from './LoginModal';
import AgentTemplatesModal from './AgentTemplatesModal';
import StartupChoiceModal from './StartupChoiceModal';
import LandingPageGenerator from './LandingPageGenerator'; 
import type { Node, StoredCredential, LLMModel, NodeData, Connection, Workflow, AnyToolConfig, CoinGeckoToolConfig, GitHubApiToolConfig, GoogleDriveToolConfig, DropboxToolConfig, GitLabToolConfig, TrelloToolConfig, BitqueryApiToolConfig, FirebaseToolConfig, NotionToolConfig, BlockchainDataToolConfig, EtherscanApiToolConfig, TheGraphToolConfig, ShopifyAdminToolConfig, PubMedSearchToolConfig, AgentTemplate } from '@/lib/types';
import { getCredentialById, getCredentials } from '@/lib/credentialsStore';
import { getAllChatModels, llmProviders, getProviderById } from '@/lib/llmProviders';
import * as workflowStore from '@/lib/workflowStore';
import { agentTemplates } from '@/lib/agentTemplates';
import type { PanelGroupHandle, PanelHandle } from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { processChatMessage, type ProcessChatMessageInput } from '@/ai/flows/process-chat-message-flow';
import { generalAssistantChat, type GeneralAssistantChatInput } from '@/ai/flows/general-assistant-flow';
import { useDebounce } from '@/hooks/use-debounce';
import { LayoutTemplate, WorkflowIcon } from 'lucide-react';


interface DraggingState {
  nodeId: string;
  startMouseX: number;
  startMouseY: number;
  startNodeX: number;
  startNodeY: number;
}

const AI_AGENT_NODE_WIDTH = 256;
const AI_AGENT_NODE_MIN_HEIGHT = 120;
const AI_AGENT_CONNECTOR_AREA_HEIGHT = 38;
const CONNECTED_MODEL_NODE_WIDTH = 200;
const CONNECTED_MODEL_NODE_HEIGHT = 60;
const COINGECKO_TOOL_NODE_WIDTH = 200;
const COINGECKO_TOOL_NODE_HEIGHT = 60;
const SPACING_BELOW_AI_NODE_CONNECTORS = 40;

const TRIGGER_NODE_WIDTH = 224;
const TRIGGER_NODE_MIN_HEIGHT = 80;


const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

const ASSISTANT_PANEL_DEFAULT_SIZE = 25;
const PALETTE_PANEL_DEFAULT_SIZE = 25;


export default function InterfaceBuilderClient() {
  const [currentView, setCurrentView] = useState<'builder' | 'landingCreator' | null>(null);
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [isWorkflowNameModalOpen, setIsWorkflowNameModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreatingNewWorkflow, setIsCreatingNewWorkflow] = useState(false);
  const [isMyWorkflowsModalOpen, setIsMyWorkflowsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAgentTemplatesModalOpen, setIsAgentTemplatesModalOpen] = useState(false);
  const [isStartupChoiceModalOpen, setIsStartupChoiceModalOpen] = useState(true);


  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [activeNodes, setActiveNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [drawingLineState, setDrawingLineState] = useState<{ fromNodeId: string; fromConnectorId: string; fromPosition: { x: number; y: number }; toPosition: { x: number; y: number } } | null>(null);

  const [isAiAgentModalOpen, setIsAiAgentModalOpen] = useState(false);
  const [draggingState, setDraggingState] = useState<DraggingState | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [initialModalSection, setInitialModalSection] = useState<string | undefined>(undefined);

  const [isChatModelSelectionModalOpen, setIsChatModelSelectionModalOpen] = useState(false);
  const [configuringChatModelForNode, setConfiguringChatModelForNode] = useState<Node | null>(null);

  const [configuringToolDetails, setConfiguringToolDetails] = useState<{
    agentNodeId: string;
    toolType: string;
    existingToolId?: string;
    providerId: string;
  } | null>(null);


  const [isCoinGeckoToolModalOpen, setIsCoinGeckoToolModalOpen] = useState(false);
  const [isGitHubApiCredentialModalOpen, setIsGitHubApiCredentialModalOpen] = useState(false);
  const [agentNodeForToolConfig, setAgentNodeForToolConfig] = useState<Node | null>(null);
  const [editingToolIdForAgent, setEditingToolIdForAgent] = useState<string | undefined>(undefined);
  const [editingToolConfig, setEditingToolConfig] = useState<CoinGeckoToolConfig | undefined>(undefined);


  const [isTelegramTriggerModalOpen, setIsTelegramTriggerModalOpen] = useState(false);
  const [editingTelegramNodeId, setEditingTelegramNodeId] = useState<string | null>(null);


  const [zoomLevel, setZoomLevel] = useState(1);

  const [isWorkflowChatPanelVisible, setIsWorkflowChatPanelVisible] = useState(false);
  const [workflowChatMessages, setWorkflowChatMessages] = useState<{ id: string; text: string; sender: 'user' | 'ai' | 'system' }[]>([]);
  const [isWorkflowAiResponding, setIsWorkflowAiResponding] = useState(false);
  const [processingNodeId, setProcessingNodeId] = useState<string | null>(null);

  const [isAiAssistantPanelOpen, setIsAiAssistantPanelOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState<{ id: string; text: string; sender: 'user' | 'ai' | 'system' }[]>([]);
  const [isAssistantResponding, setIsAssistantResponding] = useState(false);

  const mainPanelGroupRef = useRef<PanelGroupHandle>(null);
  const palettePanelRef = useRef<PanelHandle>(null);
  const assistantPanelRef = useRef<PanelHandle>(null);

  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const debouncedActiveNodes = useDebounce(activeNodes, 500);
  const debouncedConnections = useDebounce(connections, 500);
  const debouncedWorkflowName = useDebounce(currentWorkflow?.name, 500);
  const debouncedZoomLevel = useDebounce(zoomLevel, 500);

  const [isPanning, setIsPanning] = useState(false);
  const [panStartCoords, setPanStartCoords] = useState<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);

  const performSave = useCallback((workflowToSave: Workflow) => {
    const saved = workflowStore.saveWorkflow(workflowToSave);
    if (saved) {
      console.log("Workflow explicitly saved:", saved.name);
    } else {
      toast({ title: "Save Failed", description: "Could not save the workflow.", variant: "destructive" });
    }
    return saved;
  }, [toast]);

  const initializeBuilderEnvironment = useCallback(() => {
    const activeId = workflowStore.getActiveWorkflowId();
    if (activeId) {
      const loadedWorkflow = workflowStore.getWorkflowById(activeId);
      if (loadedWorkflow) {
        setCurrentWorkflow(loadedWorkflow);
        setActiveNodes(loadedWorkflow.nodes || []);
        setConnections(loadedWorkflow.connections || []);
        setZoomLevel(loadedWorkflow.zoomLevel || 1);
      } else {
        workflowStore.setActiveWorkflowId(null);
        setIsWorkflowNameModalOpen(true);
        setIsCreatingNewWorkflow(true);
      }
    } else {
      const allWorkflows = workflowStore.getAllWorkflows();
      if (allWorkflows.length > 0) {
        setIsWorkflowNameModalOpen(true);
        setIsCreatingNewWorkflow(true);
      } else {
        setIsWorkflowNameModalOpen(true);
        setIsCreatingNewWorkflow(true);
      }
    }
  }, [setCurrentWorkflow, setActiveNodes, setConnections, setZoomLevel, setIsWorkflowNameModalOpen, setIsCreatingNewWorkflow]);


  const handleStartupChoice = (choice: 'builder' | 'landing') => {
    setIsStartupChoiceModalOpen(false);
    if (choice === 'builder') {
      setCurrentView('builder');
      initializeBuilderEnvironment();
    } else if (choice === 'landing') {
      setCurrentView('landingCreator');
      // toast({ title: "Landing Page Creator", description: "This feature is coming soon! For now, you're seeing a placeholder." });
    }
  };

  const handleStartupModalOpenChange = (open: boolean) => {
    if (!open && isStartupChoiceModalOpen && currentView === null) { 
        setIsStartupChoiceModalOpen(false);
        setCurrentView('builder'); 
        initializeBuilderEnvironment();
    } else if (!open) {
        setIsStartupChoiceModalOpen(false);
    }
  };


  useEffect(() => {
    if (currentView === 'builder' && currentWorkflow && (debouncedActiveNodes || debouncedConnections || debouncedWorkflowName || debouncedZoomLevel)) {
      const workflowToSave: Workflow = {
        ...currentWorkflow,
        name: debouncedWorkflowName || currentWorkflow.name,
        nodes: debouncedActiveNodes || activeNodes,
        connections: debouncedConnections || connections,
        zoomLevel: debouncedZoomLevel || zoomLevel,
        updatedAt: new Date().toISOString(),
      };
      workflowStore.saveWorkflow(workflowToSave);
      console.log("Workflow auto-saved:", workflowToSave.name);
    }
  }, [currentView, currentWorkflow, debouncedActiveNodes, debouncedConnections, debouncedWorkflowName, debouncedZoomLevel, activeNodes, connections, zoomLevel, performSave]);


  const handleSaveWorkflowName = (name: string) => {
    let wf: Workflow | null = null;
    if (isCreatingNewWorkflow) {
      wf = workflowStore.createNewWorkflow(name, [], [], 1);
      if (wf) {
        setActiveNodes([]);
        setConnections([]);
        setZoomLevel(1);
        toast({ title: "New Workflow Created", description: `Workflow "${wf.name}" is ready.` });
      }
    } else if (currentWorkflow) {
      wf = { ...currentWorkflow, name, updatedAt: new Date().toISOString() };
      toast({ title: "Workflow Renamed", description: `Workflow renamed to "${name}".` });
    } else {
      wf = workflowStore.createNewWorkflow(name, [], [], 1);
      toast({ title: "Workflow Created", description: `Workflow "${name}" has been saved.` });
    }

    if (wf) {
      setCurrentWorkflow(wf);
      workflowStore.setActiveWorkflowId(wf.id);
      performSave(wf);
    } else {
      toast({ title: "Error", description: "Could not create or update workflow.", variant: "destructive" });
    }
    setIsWorkflowNameModalOpen(false);
    setIsCreatingNewWorkflow(false);
  };

  const handleWorkflowNameChange = (newName: string) => {
    if (currentWorkflow) {
      setCurrentWorkflow(prev => prev ? { ...prev, name: newName } : null);
    }
  };

  const handleExplicitSave = () => {
    if (currentWorkflow) {
      const workflowToSave: Workflow = {
        ...currentWorkflow,
        nodes: activeNodes,
        connections: connections,
        zoomLevel: zoomLevel,
        updatedAt: new Date().toISOString(),
      };
      const savedWf = performSave(workflowToSave);
      if (savedWf) {
        toast({ title: "Workflow Saved", description: `Workflow "${savedWf.name}" has been saved.` });
      }
    } else {
      toast({ title: "Nothing to Save", description: "No active workflow.", variant: "default" });
    }
  };

  const handleOpenShareModal = () => {
    if (currentWorkflow) {
      setIsShareModalOpen(true);
    } else {
      toast({ title: "No Workflow", description: "Create or open a workflow to share it.", variant: "default" });
    }
  };

  const handleCreateNewWorkflow = () => {
    setIsCreatingNewWorkflow(true);
    setIsWorkflowNameModalOpen(true);
  };

  const handleOpenMyWorkflowsModal = () => {
    setIsMyWorkflowsModalOpen(true);
  };

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const handleOpenAgentTemplatesModal = () => {
    setIsAgentTemplatesModalOpen(true);
  };

  const handleTemplateSelectedFromModal = (templateId: string) => {
    if (currentView === 'builder' && !currentWorkflow && !isCreatingNewWorkflow) {
        toast({ title: "No Active Workflow", description: "Please name your workflow first or select 'Create New Workflow'.", variant: "destructive" });
        setIsWorkflowNameModalOpen(true);
        setIsCreatingNewWorkflow(true);
        return;
    }

    const template = agentTemplates.find(t => t.id === templateId);
    if (!template) {
        toast({ title: "Error", description: "Selected template not found.", variant: "destructive" });
        return;
    }

    const newNodesCount = activeNodes.length;
    const basePosition = {
        x: 100 + (newNodesCount % 5) * (AI_AGENT_NODE_WIDTH + 60),
        y: 100 + Math.floor(newNodesCount / 5) * (AI_AGENT_NODE_MIN_HEIGHT + 80 + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS),
    };

    let agentNodeData: Partial<NodeData> = {
        title: template.name,
        subTitle: template.description.substring(0, 50) + (template.description.length > 50 ? '...' : ''),
        isDisabled: false,
        promptSource: 'system-prompt',
        systemPrompt: template.systemPrompt,
        templateId: template.id,
        memoryType: template.defaultMemoryType || null,
        selectedModelId: template.defaultModelId,
        selectedProviderId: template.defaultProviderId,
        connectors: {
            'input-trigger': { type: 'input' },
            'output-main': { type: 'output' },
            'output-chat-model': { type: 'output' },
            'output-memory': { type: 'output' },
            'output-tools': { type: 'output' },
        }
    };
    
    if (template.suggestedToolTypes && Array.isArray(template.suggestedToolTypes)) {
        agentNodeData.tools = template.suggestedToolTypes.map(toolType => ({
            id: `tool-${uuidv4()}`,
            type: toolType
        }));
    }

    let newAgentNode: Node = {
        id: `node-${uuidv4()}`,
        type: 'AI_AGENT',
        name: `Agent from ${template.name}`,
        position: basePosition,
        data: agentNodeData as NodeData,
    };

    let newNodesList = [...activeNodes];
    let newConnectionsList = [...connections];

    if (template.defaultProviderId && template.defaultModelId) {
        const allCreds = getCredentials(template.defaultProviderId);
        const validModelCred = allCreds.find(c =>
            (c.modelId === template.defaultModelId || !c.modelId) && // Check for model-specific or provider-generic cred
            c.status === 'valid'
        );

        if (validModelCred && newAgentNode.data) {
            const model = getAllChatModels().find(m => m.id === template.defaultModelId && m.providerId === template.defaultProviderId);
            if (model) {
                newAgentNode.data.chatModelCredentialId = validModelCred.id;
                newAgentNode.data.selectedModelId = model.id;
                newAgentNode.data.selectedProviderId = model.providerId;
                newAgentNode.data.chatModelCredentialStatus = 'valid';
                newAgentNode.data.chatModelValidationError = undefined;

                const connectedModelNodeId = `cnode-${uuidv4()}`;
                newAgentNode.data.connectedChatModelNodeId = connectedModelNodeId;

                const connectedModelNodeData: NodeData = {
                    modelName: model.name,
                    providerName: model.providerName,
                    providerId: model.providerId,
                    credentialId: validModelCred.id,
                    status: 'valid',
                    validationError: undefined,
                    aiAgentNodeId: newAgentNode.id,
                    isDisabled: false,
                    connectors: { 'input-main': { type: 'input' } }
                };

                const newConnectedNodeX = basePosition.x + (AI_AGENT_NODE_WIDTH / 6) - (CONNECTED_MODEL_NODE_WIDTH / 2);
                const newConnectedNodeY = basePosition.y + AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS;

                newNodesList.push({
                    id: connectedModelNodeId,
                    type: 'CONNECTED_CHAT_MODEL',
                    name: `Model: ${model.name}`,
                    position: { x: newConnectedNodeX, y: newConnectedNodeY },
                    data: connectedModelNodeData,
                });

                newConnectionsList.push({
                    id: `conn-model-${uuidv4()}`,
                    fromNodeId: newAgentNode.id,
                    fromConnectorId: 'output-chat-model',
                    toNodeId: connectedModelNodeId,
                    toConnectorId: 'input-main',
                });
            }
        } else if (template.defaultModelId) { 
            toast({ title: "Default Model Not Auto-Connected", description: `Could not find a valid pre-existing credential for the template's default model (${template.defaultModelId}). Please configure the chat model manually for the new agent.`, duration: 8000 });
        }
    }
    
    newNodesList.push(newAgentNode);
    setActiveNodes(newNodesList);
    setConnections(newConnectionsList);

    toast({ title: "Agent Created from Template", description: `Created '${newAgentNode.name}'. Review its configuration and connect any necessary triggers or tools.`});
    setIsAgentTemplatesModalOpen(false);
  };


  const handleSelectWorkflowFromModal = (workflowId: string) => {
    const selectedWorkflow = workflowStore.getWorkflowById(workflowId);
    if (selectedWorkflow) {
      setCurrentWorkflow(selectedWorkflow);
      setActiveNodes(selectedWorkflow.nodes || []);
      setConnections(selectedWorkflow.connections || []);
      setZoomLevel(selectedWorkflow.zoomLevel || 1);
      workflowStore.setActiveWorkflowId(selectedWorkflow.id);
      toast({ title: "Workflow Opened", description: `"${selectedWorkflow.name}" is now active.` });
    } else {
      toast({ title: "Error", description: "Could not open workflow.", variant: "destructive" });
    }
    setIsMyWorkflowsModalOpen(false);
  };

  const handleDeleteWorkflowFromStore = (workflowId: string) => {
    const wasCurrentWorkflow = currentWorkflow?.id === workflowId;
    workflowStore.deleteWorkflow(workflowId);
    if (wasCurrentWorkflow) {
      const allWorkflows = workflowStore.getAllWorkflows();
      if (allWorkflows.length > 0) {
        allWorkflows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        handleSelectWorkflowFromModal(allWorkflows[0].id);
      } else {
        setCurrentWorkflow(null);
        setActiveNodes([]);
        setConnections([]);
        setIsWorkflowNameModalOpen(true);
        setIsCreatingNewWorkflow(true);
      }
    }
  };


  const handleNodeSelect = (nodeType: string) => {
    if (!currentWorkflow && !isCreatingNewWorkflow) {
      toast({ title: "No Active Workflow", description: "Please name your workflow first.", variant: "destructive" });
      setIsWorkflowNameModalOpen(true);
      setIsCreatingNewWorkflow(true);
      return;
    }

    setSelectedNodeType(nodeType);
    setEditingNodeId(null);
    setInitialModalSection(undefined);

    let newNodePartial: Omit<Node, 'id' | 'position'> & { position?: {x: number, y: number} } | null = null;
    const newNodesCount = activeNodes.length;
    const basePosition = {
        x: 50 + (newNodesCount % 5) * (AI_AGENT_NODE_WIDTH + 30),
        y: 50 + Math.floor(newNodesCount / 5) * (AI_AGENT_NODE_MIN_HEIGHT + 50 + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS)
    };

    switch (nodeType) {
      case 'AI_AGENT':
        setIsAiAgentModalOpen(true);
        return;

      case 'CHAT_TRIGGER':
        if (activeNodes.some(n => n.type === 'CHAT_TRIGGER')) {
          toast({ title: "Chat Trigger Exists", description: "A Chat Trigger node can only be added once.", variant: "default" });
          setSelectedNodeType(null);
          return;
        }
        newNodePartial = {
          type: 'CHAT_TRIGGER',
          name: 'Chat Trigger',
          data: { title: 'Chat Trigger', isDisabled: false, connectors: { output: { type: 'output'}}}
        };
        setIsWorkflowChatPanelVisible(true);
        break;

      case 'TELEGRAM_TRIGGER':
        if (activeNodes.some(n => n.type === 'TELEGRAM_TRIGGER')) {
          toast({ title: "Telegram Trigger Exists", description: "A Telegram Trigger node can only be added once.", variant: "default" });
          setSelectedNodeType(null);
          return;
        }
        newNodePartial = {
          type: 'TELEGRAM_TRIGGER',
          name: 'Telegram Trigger',
          data: { title: 'Telegram Trigger', isDisabled: false, connectors: { output: { type: 'output'}}}
        };
        break;

      default:
        console.warn("Unknown node type selected:", nodeType);
        setSelectedNodeType(null);
        return;
    }

    if (newNodePartial) {
      const newNode: Node = {
        ...newNodePartial,
        id: `node-${uuidv4()}`,
        position: newNodePartial.position || basePosition,
         data: { ...(newNodePartial.data || {}), isDisabled: false },
      };
      setActiveNodes(prevNodes => [...prevNodes, newNode]);
    }
    setSelectedNodeType(null);
  };

  const handleNodeDoubleClick = (nodeId: string) => {
    const nodeToEdit = activeNodes.find(n => n.id === nodeId);
    if (nodeToEdit) {
      if (nodeToEdit.type === 'AI_AGENT') {
        setSelectedNodeType(nodeToEdit.type);
        setEditingNodeId(nodeToEdit.id);
        setInitialModalSection(undefined);
        setIsAiAgentModalOpen(true);
      } else if (nodeToEdit.type === 'CONNECTED_CHAT_MODEL' && nodeToEdit.data?.aiAgentNodeId) {
        const parentAgentNode = activeNodes.find(n => n.id === nodeToEdit.data.aiAgentNodeId);
        if (parentAgentNode) {
            setConfiguringChatModelForNode(parentAgentNode);
            setIsChatModelSelectionModalOpen(true);
        } else {
            toast({title: "Error", description: "Parent AI Agent node not found for this model.", variant: "destructive"});
        }
      } else if (nodeToEdit.type === 'TELEGRAM_TRIGGER') {
        setEditingTelegramNodeId(nodeToEdit.id);
        setIsTelegramTriggerModalOpen(true);
      }
    }
  };

  const handleNodeConfigureSection = (nodeId: string, section?: string) => {
    const nodeToEdit = activeNodes.find(n => n.id === nodeId);
    if (nodeToEdit) {
      if (section === 'chatModel' && nodeToEdit.type === 'AI_AGENT') {
        setConfiguringChatModelForNode(nodeToEdit);
        setConfiguringToolDetails(null);
        setIsChatModelSelectionModalOpen(true);
      } else if (section === 'tools' && nodeToEdit.type === 'AI_AGENT') {
        setSelectedNodeType(nodeToEdit.type);
        setEditingNodeId(nodeToEdit.id);
        setInitialModalSection('tools');
        setIsAiAgentModalOpen(true);
      } else if (nodeToEdit.type === 'AI_AGENT') {
        setSelectedNodeType(nodeToEdit.type);
        setEditingNodeId(nodeToEdit.id);
        setInitialModalSection(section);
        setIsAiAgentModalOpen(true);
      }
    }
  };

  const handleOpenToolConfigurationModal = (agentNodeId: string, toolType: string, existingToolId?: string) => {
    const agentNode = activeNodes.find(n => n.id === agentNodeId);
    if (!agentNode) {
      toast({ title: "Error", description: `Agent node ${agentNodeId} not found.`, variant: "destructive" });
      return;
    }

    setAgentNodeForToolConfig(agentNode);
    setEditingToolIdForAgent(existingToolId);

    if (toolType === 'COINGECKO') {
      const tool = agentNode.data?.tools?.find(t => t.id === existingToolId && t.type === 'COINGECKO') as CoinGeckoToolConfig | undefined;
      setEditingToolConfig(tool);
      setIsCoinGeckoToolModalOpen(true);
    } else if (toolType === 'GITHUB_API') {
      setIsGitHubApiCredentialModalOpen(true);
    } else {
      const providerIdForTool = toolType.toLowerCase().replace('_tool', '').replace('_api', '_api');
      const provider = getProviderById(providerIdForTool);
      if (provider) {
         setConfiguringToolDetails({
          agentNodeId: agentNode.id,
          toolType: toolType,
          existingToolId: existingToolId,
          providerId: provider.id,
        });
        setConfiguringChatModelForNode(null); 
        setIsChatModelSelectionModalOpen(true);
      } else {
        toast({ title: "Tool Configuration", description: `Configuration for ${toolType} tool via generic credential modal not yet fully set up or provider ID mismatch.`, duration: 5000 });
        setAgentNodeForToolConfig(null);
        setEditingToolIdForAgent(undefined);
      }
    }
  };


  const handleOpenGitHubApiCredentialModal = (agentNodeId: string, existingToolId?: string) => {
    const agentNode = activeNodes.find(n => n.id === agentNodeId);
    if (agentNode) {
      setAgentNodeForToolConfig(agentNode);
      setEditingToolIdForAgent(existingToolId);
      setIsGitHubApiCredentialModalOpen(true);
    } else {
       toast({ title: "Error", description: "Agent node not found for GitHub tool configuration.", variant: "destructive" });
    }
  };

  const handleSaveToolConfig = (agentNodeId: string, toolConfig: AnyToolConfig) => {
    let newNodes = [...activeNodes];
    let newConnections = [...connections];
    let agentNodeUpdated = false;

    newNodes = newNodes.map(node => {
      if (node.id === agentNodeId && node.type === 'AI_AGENT') {
        agentNodeUpdated = true;
        const existingTools = node.data?.tools || [];
        const toolIndex = existingTools.findIndex(t => t.id === toolConfig.id);
        let updatedTools: AnyToolConfig[];
        if (toolIndex > -1) {
          updatedTools = [...existingTools];
          updatedTools[toolIndex] = toolConfig;
        } else {
          updatedTools = [...existingTools, toolConfig];
        }

        let updatedNodeData = { ...node.data, tools: updatedTools };

        if (toolConfig.type === 'COINGECKO') {
          const visualToolNodeId = `cgdisp-${agentNodeId}`;
          const existingVisualToolNode = newNodes.find(n => n.id === visualToolNodeId);

          if (!existingVisualToolNode) {
            const agentNodePosition = node.position || { x: 100, y: 100 };
            const newToolNodePosition = {
              x: agentNodePosition.x + AI_AGENT_NODE_WIDTH * 5/6 - COINGECKO_TOOL_NODE_WIDTH / 2,
              y: agentNodePosition.y + AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS,
            };
            const newToolDisplayNode: Node = {
              id: visualToolNodeId,
              type: 'COINGECKO_TOOL_DISPLAY_NODE',
              name: 'CoinGecko API',
              position: newToolNodePosition,
              data: {
                parentAiAgentId: agentNodeId,
                representedToolId: toolConfig.id,
                isDisabled: false,
                connectors: { 'input-main': { type: 'input' } },
              },
            };
            newNodes.push(newToolDisplayNode);
             updatedNodeData.coingeckoToolNodeId = visualToolNodeId;

            const newConnection: Connection = {
              id: `conn-tool-${uuidv4()}`,
              fromNodeId: agentNodeId,
              fromConnectorId: 'output-tools',
              toNodeId: visualToolNodeId,
              toConnectorId: 'input-main',
            };
            newConnections.push(newConnection);
          } else {
             updatedNodeData.coingeckoToolNodeId = visualToolNodeId;
          }
        }
        return { ...node, data: updatedNodeData };
      }
      return node;
    });

    if (agentNodeUpdated) {
        setActiveNodes(newNodes);
        setConnections(newConnections);
    }

    toast({ title: "Tool Saved", description: `${toolConfig.type.replace(/_API|_TOOL/gi, '')} tool configuration updated for agent.` });
    setIsCoinGeckoToolModalOpen(false);
    setIsGitHubApiCredentialModalOpen(false);
    setAgentNodeForToolConfig(null);
    setEditingToolConfig(undefined);
    setEditingToolIdForAgent(undefined);
    setConfiguringToolDetails(null);
  };


  const handleNodeConfigChange = (nodeId: string, data: Partial<Node['data']>) => {
    let newNodesList = [...activeNodes];
    let newConnectionsList = [...connections];
    let requiresConnectedModelUpdate = false;
    let connectedModelNodeIdToUpdate: string | undefined;
    let newConnectedNodeData: Partial<NodeData> = {};

    const parentNodeIndex = newNodesList.findIndex(n => n.id === nodeId);
    if (parentNodeIndex === -1) return;

    const oldNode = newNodesList[parentNodeIndex];
    const updatedNode = { ...oldNode, data: { ...oldNode.data, ...data } };
    newNodesList[parentNodeIndex] = updatedNode;

    if (updatedNode.type === 'AI_AGENT' &&
        (data.selectedModelId !== oldNode.data?.selectedModelId ||
         data.chatModelCredentialId !== oldNode.data?.chatModelCredentialId ||
         data.chatModelCredentialStatus !== oldNode.data?.chatModelCredentialStatus
        )
    ) {
        requiresConnectedModelUpdate = true;
        connectedModelNodeIdToUpdate = updatedNode.data?.connectedChatModelNodeId;

        const model = getAllChatModels().find(m => m.id === updatedNode.data?.selectedModelId);
        const provider = model ? llmProviders.find(p => p.id === updatedNode.data?.selectedProviderId || p.id === model.providerId) : null;
        const credential = getCredentialById(updatedNode.data?.chatModelCredentialId || '');

        if (model && provider && credential && credential.status === 'valid') {
            newConnectedNodeData = {
                modelName: model.name,
                providerName: provider.name,
                providerId: provider.id,
                credentialId: credential.id,
                status: credential.status,
                validationError: credential.validationError,
                aiAgentNodeId: updatedNode.id,
                isDisabled: false,
                connectors: { 'input-main': { type: 'input' } }
            };

            if (connectedModelNodeIdToUpdate) {
                const nodeIndex = newNodesList.findIndex(n => n.id === connectedModelNodeIdToUpdate);
                if (nodeIndex > -1) {
                    newNodesList[nodeIndex] = {
                        ...newNodesList[nodeIndex],
                        data: { ...newNodesList[nodeIndex].data, ...newConnectedNodeData }
                    };
                }
            } else {
                const newConnectedModelNodeId = `cnode-${uuidv4()}`;
                updatedNode.data!.connectedChatModelNodeId = newConnectedModelNodeId;
                newNodesList[parentNodeIndex] = updatedNode; 

                const agentNodePosition = updatedNode.position || { x: 100, y: 100 };
                const newConnectedNodeX = agentNodePosition.x + (AI_AGENT_NODE_WIDTH / 6) - (CONNECTED_MODEL_NODE_WIDTH / 2);
                const newConnectedNodeY = agentNodePosition.y + AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS;

                newNodesList.push({
                    id: newConnectedModelNodeId,
                    type: 'CONNECTED_CHAT_MODEL',
                    name: `Model: ${model.name}`,
                    position: { x: newConnectedNodeX, y: newConnectedNodeY },
                    data: newConnectedNodeData as NodeData,
                });

                newConnectionsList.push({
                    id: `conn-model-${uuidv4()}`,
                    fromNodeId: updatedNode.id,
                    fromConnectorId: 'output-chat-model',
                    toNodeId: newConnectedModelNodeId,
                    toConnectorId: 'input-main',
                });
            }
        } else if (connectedModelNodeIdToUpdate) { 
             newNodesList = newNodesList.filter(n => n.id !== connectedModelNodeIdToUpdate);
             newConnectionsList = newConnectionsList.filter(c => !(c.toNodeId === connectedModelNodeIdToUpdate && c.fromNodeId === updatedNode.id && c.fromConnectorId === 'output-chat-model'));
             delete updatedNode.data!.connectedChatModelNodeId;
             newNodesList[parentNodeIndex] = updatedNode; 
        }
    }

    setActiveNodes(newNodesList);
    setConnections(newConnectionsList);
  };

  const handleAiAgentModalOpenChange = (open: boolean) => {
    setIsAiAgentModalOpen(open);
    if (!open) {
      if (editingNodeId) {
        setEditingNodeId(null);
      } else if (selectedNodeType === 'AI_AGENT' && !editingNodeId) { 
         if (!currentWorkflow && !isCreatingNewWorkflow) {
          toast({ title: "Workflow Not Ready", description: "Cannot add agent without an active workflow. Please name your workflow first.", variant: "destructive"});
          setSelectedNodeType(null); 
          setIsWorkflowNameModalOpen(true);
          setIsCreatingNewWorkflow(true);
          return;
        }
        const newNodesCount = activeNodes.filter(n => n.type === 'AI_AGENT').length;
        const newNodeName = `AI Agent ${newNodesCount + 1}`;
        const basePosition = {
          x: 50 + (activeNodes.length % 5) * (AI_AGENT_NODE_WIDTH + 30),
          y: 50 + Math.floor(activeNodes.length / 5) * (AI_AGENT_NODE_MIN_HEIGHT + 50 + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS)
        };
        const newNode: Node = {
          id: `node-${uuidv4()}`,
          type: 'AI_AGENT',
          name: newNodeName,
          position: basePosition,
          data: {
            title: newNodeName,
            subTitle: 'Tools Agent', 
            isDisabled: false,
            promptSource: 'chat-trigger', 
            connectors: {
                'input-trigger': { type: 'input' },
                'output-main': { type: 'output' },
                'output-chat-model': { type: 'output' },
                'output-memory': { type: 'output' },
                'output-tools': { type: 'output' },
             }
          }
        };
        setActiveNodes(prevNodes => [...prevNodes, newNode]);
      }
      setSelectedNodeType(null); 
      setInitialModalSection(undefined);
    }
  };

  const handleChatModelSelectionModalOpenChange = (open: boolean) => {
    setIsChatModelSelectionModalOpen(open);
    if (!open) {
      setConfiguringChatModelForNode(null);
      setConfiguringToolDetails(null); 
    }
  };

  const handleTelegramTriggerConfigSave = (nodeId: string, credentialId: string, status: StoredCredential['status']) => {
    setActiveNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId && node.type === 'TELEGRAM_TRIGGER'
          ? { ...node, data: { ...node.data, telegramBotTokenCredentialId: credentialId, telegramBotTokenStatus: status } }
          : node
      )
    );
    toast({ title: "Telegram Trigger Updated", description: "Bot token configuration saved." });
  };

  const handleCredentialSelectedFromManager = (credentialId: string, modelId: string) => { // modelId is for LLM model
    if (configuringToolDetails) {
      const { agentNodeId, toolType, existingToolId } = configuringToolDetails;
      const agentNode = activeNodes.find(n => n.id === agentNodeId);
      if (!agentNode) {
        toast({ title: "Error", description: "Agent node not found for tool credential.", variant: "destructive" });
        setConfiguringToolDetails(null);
        setIsChatModelSelectionModalOpen(false);
        return;
      }

      let newToolConfig: AnyToolConfig;
      const newToolInstanceId = existingToolId || `tool-${uuidv4()}`;
      const selectedCred = getCredentialById(credentialId);

      switch (toolType) {
        case 'DROPBOX_API':
          newToolConfig = { id: newToolInstanceId, type: 'DROPBOX_API', credentialId };
          break;
        case 'GITLAB_API':
          newToolConfig = { id: newToolInstanceId, type: 'GITLAB_API', credentialId };
          break;
        case 'TRELLO_API':
          newToolConfig = { id: newToolInstanceId, type: 'TRELLO_API', credentialId };
          break;
        case 'BITQUERY_API':
          newToolConfig = { id: newToolInstanceId, type: 'BITQUERY_API', credentialId };
          break;
        case 'FIREBASE_TOOL':
          newToolConfig = { id: newToolInstanceId, type: 'FIREBASE_TOOL', credentialId };
          break;
        case 'NOTION_TOOL':
          newToolConfig = { id: newToolInstanceId, type: 'NOTION_TOOL', credentialId };
          break;
        case 'BLOCKCHAIN_DATA_TOOL':
          newToolConfig = { id: newToolInstanceId, type: 'BLOCKCHAIN_DATA_TOOL', credentialId };
          break;
        case 'ETHERSCAN_API':
          newToolConfig = { 
            id: newToolInstanceId, 
            type: 'ETHERSCAN_API', 
            credentialId, 
            baseUrl: selectedCred?.endpoint 
          };
          break;
        case 'THE_GRAPH_API':
          newToolConfig = {
            id: newToolInstanceId,
            type: 'THE_GRAPH_API',
            subgraphQueryUrl: selectedCred?.endpoint || '', 
            credentialId: selectedCred?.apiKey ? credentialId : undefined 
          };
          break;
        case 'SHOPIFY_ADMIN_TOOL':
          newToolConfig = {
            id: newToolInstanceId,
            type: 'SHOPIFY_ADMIN_TOOL',
            credentialId, 
            storeUrl: selectedCred?.endpoint || '', 
          };
          break;
        case 'PUBMED_SEARCH_TOOL':
          newToolConfig = {
            id: newToolInstanceId,
            type: 'PUBMED_SEARCH_TOOL',
            credentialId: selectedCred?.apiKey ? credentialId : undefined, 
          };
          break;
        default:
          toast({ title: "Error", description: `Unknown tool type for credential: ${toolType}`, variant: "destructive" });
          setConfiguringToolDetails(null);
          setIsChatModelSelectionModalOpen(false);
          return;
      }
      handleSaveToolConfig(agentNodeId, newToolConfig); 
      setConfiguringToolDetails(null); 

    } else if (configuringChatModelForNode && configuringChatModelForNode.type === 'AI_AGENT') {
      const parentNode = configuringChatModelForNode;
      const credential = getCredentialById(credentialId);
      const model = getAllChatModels().find(m => m.id === modelId); 
      const provider = model ? llmProviders.find(p => p.id === model.providerId) : null;

      if (!credential || !model || !provider) {
        toast({title: "Error", description: "Could not configure chat model. Required details missing.", variant: "destructive"});
        setConfiguringChatModelForNode(null);
        setIsChatModelSelectionModalOpen(false);
        return;
      }

      const aiAgentUpdateData: Partial<NodeData> = {
        chatModelCredentialId: credential.id,
        selectedModelId: model.id,
        selectedProviderId: provider.id,
        chatModelCredentialStatus: credential.status,
        chatModelValidationError: credential.validationError,
      };

      const connectedNodeDataUpdate: NodeData = {
        modelName: model.name,
        providerName: provider.name,
        providerId: provider.id,
        credentialId: credential.id,
        status: credential.status,
        validationError: credential.validationError,
        aiAgentNodeId: parentNode.id,
        isDisabled: false,
        connectors: { 'input-main': { type: 'input' } }
      };

      let newNodesList = [...activeNodes];
      const parentNodeIndex = newNodesList.findIndex(n => n.id === parentNode.id);

      if (parentNodeIndex === -1) { 
          setConfiguringChatModelForNode(null);
          setIsChatModelSelectionModalOpen(false);
          return;
      }

      let connectedNodeId = parentNode.data?.connectedChatModelNodeId;
      let existingConnectedNode = connectedNodeId ? newNodesList.find(n => n.id === connectedNodeId) : null;

      if (existingConnectedNode) {
        const nodeIndex = newNodesList.findIndex(n => n.id === existingConnectedNode!.id);
        if (nodeIndex > -1) {
          newNodesList[nodeIndex] = {
            ...newNodesList[nodeIndex],
            data: { ...newNodesList[nodeIndex].data, ...connectedNodeDataUpdate }
          };
        }
      } else {
        const newConnectedModelNodeId = `cnode-${uuidv4()}`;
        aiAgentUpdateData.connectedChatModelNodeId = newConnectedModelNodeId; 

        const agentNodePosition = parentNode.position || { x: 100, y: 100 };
        const newConnectedNodeX = agentNodePosition.x + (AI_AGENT_NODE_WIDTH / 6) - (CONNECTED_MODEL_NODE_WIDTH / 2);
        const newConnectedNodeY = agentNodePosition.y + AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS;

        const newConnectedNode: Node = {
          id: newConnectedModelNodeId,
          type: 'CONNECTED_CHAT_MODEL',
          name: `Model: ${model.name}`,
          position: { x: newConnectedNodeX, y: newConnectedNodeY },
          data: connectedNodeDataUpdate,
        };
        newNodesList.push(newConnectedNode);
      }

      newNodesList[parentNodeIndex] = {
          ...newNodesList[parentNodeIndex],
          data: { ...newNodesList[parentNodeIndex].data, ...aiAgentUpdateData}
      };

      setActiveNodes(newNodesList);

      const currentConnections = Array.isArray(connections) ? connections : [];
      let updatedConnections = [...currentConnections];

      if(connectedNodeId && connectedNodeId !== aiAgentUpdateData.connectedChatModelNodeId) {
          updatedConnections = updatedConnections.filter(c => !(c.toNodeId === connectedNodeId && c.fromNodeId === parentNode.id && c.fromConnectorId === 'output-chat-model'));
      }
      if (aiAgentUpdateData.connectedChatModelNodeId && (!connectedNodeId || connectedNodeId !== aiAgentUpdateData.connectedChatModelNodeId)) {
          const existingConnection = updatedConnections.find(c => c.fromNodeId === parentNode.id && c.fromConnectorId === 'output-chat-model' && c.toNodeId === aiAgentUpdateData.connectedChatModelNodeId);
          if(!existingConnection) {
              updatedConnections.push({
                id: `conn-model-${uuidv4()}`,
                fromNodeId: parentNode.id,
                fromConnectorId: 'output-chat-model',
                toNodeId: aiAgentUpdateData.connectedChatModelNodeId,
                toConnectorId: 'input-main',
              });
          }
      }
      setConnections(updatedConnections);


      toast({title: "Chat Model Configured", description: `${model.name} has been linked to ${parentNode.name}.`});
    }
    setIsChatModelSelectionModalOpen(false);
    setConfiguringChatModelForNode(null);
    setConfiguringToolDetails(null);
  };

  const handleAttemptConnection = useCallback((toNodeId?: string, toConnectorId?: string, toConnectorType?: 'input' | 'output') => {
    if (!drawingLineState || !toNodeId || !toConnectorId || !toConnectorType) {
      if (drawingLineState) toast({ title: "Connection Invalid", description: "Target connector not found.", variant: "destructive" });
      return;
    }

    const { fromNodeId, fromConnectorId } = drawingLineState;
    const fromNode = activeNodes.find(n => n.id === fromNodeId);
    const toNode = activeNodes.find(n => n.id === toNodeId);

    if (!fromNode || !toNode || fromNode.id === toNode.id) {
      toast({ title: "Connection Invalid", description: "Cannot connect a node to itself or invalid nodes.", variant: "destructive" });
      return;
    }

    if (fromNode.data?.connectors?.[fromConnectorId]?.type !== 'output' || toConnectorType !== 'input') {
       toast({ title: "Connection Invalid", description: "Connections must be from an output to an input.", variant: "destructive"});
       return;
    }

    const isTriggerToAgent =
        (fromNode.type === 'CHAT_TRIGGER' || fromNode.type === 'TELEGRAM_TRIGGER') &&
        fromConnectorId === 'output' &&
        toNode.type === 'AI_AGENT' &&
        toConnectorId === 'input-trigger';

    const isAgentToAgent =
        fromNode.type === 'AI_AGENT' &&
        fromConnectorId === 'output-main' &&
        toNode.type === 'AI_AGENT' &&
        toConnectorId === 'input-trigger';

    if (isTriggerToAgent || isAgentToAgent) {
        if (connections.some(c => c.toNodeId === toNodeId && c.toConnectorId === toConnectorId)) {
            toast({ title: "Connection Invalid", description: `Input '${toConnectorId}' on ${toNode.name} is already connected.`, variant: "destructive"});
            return;
        }

        const newConnection: Connection = {
            id: `conn-${uuidv4()}`,
            fromNodeId,
            fromConnectorId,
            toNodeId,
            toConnectorId,
        };
        setConnections(prev => [...prev, newConnection]);

        setActiveNodes(prevNodes => prevNodes.map(n => {
            let nodeDataChanged = false;
            const newConnectors = { ...(n.data?.connectors || {}) };

            if (n.id === fromNode.id && newConnectors[fromConnectorId]) {
                newConnectors[fromConnectorId].connectedTo = [
                    ...(newConnectors[fromConnectorId].connectedTo || []),
                    { nodeId: toNodeId, connectorId: toConnectorId }
                ];
                nodeDataChanged = true;
            }
            if (n.id === toNode.id && newConnectors[toConnectorId]) {
                newConnectors[toConnectorId].connectedTo = [
                    ...(newConnectors[toConnectorId].connectedTo || []),
                    { nodeId: fromNodeId, connectorId: fromConnectorId }
                ];
                nodeDataChanged = true;
            }

            if (nodeDataChanged) {
              return { ...n, data: { ...(n.data || {}), connectors: newConnectors, inputConnected: (n.id === toNode.id ? true : n.data?.inputConnected), outputConnected: (n.id === fromNode.id ? true : n.data?.outputConnected) }};
            }
            return n;
        }));
        toast({ title: "Connection Created", description: `Connected ${fromNode.name} to ${toNode.name}.` });
    } else {
      toast({ title: "Connection Invalid", description: "These node types or connectors are not compatible for direct connection.", variant: "destructive"});
    }
  }, [drawingLineState, activeNodes, connections, toast]);


  const handleNodeDragStart = (nodeId: string, event: React.MouseEvent<HTMLDivElement>) => {
    const nodeToDrag = activeNodes.find(n => n.id === nodeId);
    if (nodeToDrag && nodeToDrag.position) {
      const target = event.target as HTMLElement;
      if (target.closest('button, input, textarea, select, [role="button"], [data-interactive="true"], [data-connector-id]')) {
        return;
      }
      event.preventDefault(); 

      setDraggingState({
        nodeId,
        startMouseX: event.clientX / zoomLevel, 
        startMouseY: event.clientY / zoomLevel, 
        startNodeX: nodeToDrag.position.x,
        startNodeY: nodeToDrag.position.y,
      });
    }
  };


  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!draggingState) return;

      const deltaX = (event.clientX / zoomLevel) - draggingState.startMouseX;
      const deltaY = (event.clientY / zoomLevel) - draggingState.startMouseY;

      const newX = draggingState.startNodeX + deltaX;
      const newY = draggingState.startNodeY + deltaY;

      setActiveNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === draggingState.nodeId
            ? { ...node, position: { x: newX, y: newY } }
            : node
        )
      );
    };

    const handleGlobalMouseUp = () => {
      if (draggingState) {
        setDraggingState(null);
      }
    };

    if (draggingState) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [draggingState, zoomLevel]); 


  const transformToCanvasCoordinates = useCallback((clientX: number, clientY: number): { x: number, y: number } => {
    if (!canvasAreaRef.current) return { x: clientX, y: clientY };

    const scalableDiv = canvasAreaRef.current.querySelector('[data-canvas-area="true"]') as HTMLElement;
    if (!scalableDiv) return {x: clientX, y: clientY}; 

    const rect = scalableDiv.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / zoomLevel,
      y: (clientY - rect.top) / zoomLevel,
    };
  }, [zoomLevel, canvasAreaRef]); 

  const handleStartLineDraw = useCallback((nodeId: string, connectorId: string, globalPosition: { x: number; y: number }, event: React.MouseEvent) => {
    event.preventDefault(); 
    event.stopPropagation(); 

    setDrawingLineState({
      fromNodeId: nodeId,
      fromConnectorId: connectorId,
      fromPosition: globalPosition, 
      toPosition: globalPosition,   
    });
  }, [setDrawingLineState]); 

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (drawingLineState) {
      const { x, y } = transformToCanvasCoordinates(event.clientX, event.clientY);
      setDrawingLineState(prev => prev ? { ...prev, toPosition: { x, y } } : null);
    }
    if (isPanning && panStartCoords && canvasAreaRef.current) {
        const dx = event.clientX - panStartCoords.x;
        const dy = event.clientY - panStartCoords.y;
        canvasAreaRef.current.scrollLeft = panStartCoords.scrollLeft - dx; 
        canvasAreaRef.current.scrollTop = panStartCoords.scrollTop - dy;
    }
  }, [drawingLineState, transformToCanvasCoordinates, setDrawingLineState, isPanning, panStartCoords, canvasAreaRef]);

  const handleCanvasMouseUp = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (drawingLineState) {
      const targetElement = event.target as HTMLElement;
      const targetNodeElement = targetElement.closest('[data-node-id]') as HTMLElement | null;
      const targetConnectorElement = targetElement.closest('[data-connector-id]') as HTMLElement | null;


      if (targetNodeElement && targetConnectorElement) {
        const toNodeId = targetNodeElement.dataset.nodeId;
        const toConnectorId = targetConnectorElement.dataset.connectorId;
        const toConnectorType = targetConnectorElement.dataset.connectorType as ('input' | 'output' | undefined);

        handleAttemptConnection(toNodeId, toConnectorId, toConnectorType);
      } else {
        toast({ title: "Connection Canceled", description: "Line dropped on empty space or invalid target.", variant: "default" });
      }
      setDrawingLineState(null); 
    }
    if (isPanning) {
        setIsPanning(false);
        setPanStartCoords(null);
        document.body.style.cursor = 'default';
    }
  }, [drawingLineState, handleAttemptConnection, setDrawingLineState, toast, isPanning, setIsPanning, setPanStartCoords]);


  const handleConnectorMouseUp = useCallback((toNodeId: string, toConnectorId: string, toConnectorType: 'input' | 'output', globalPosition: { x: number, y: number }, event: React.MouseEvent) => {
    if (drawingLineState) {
        event.preventDefault();
        event.stopPropagation();
        handleAttemptConnection(toNodeId, toConnectorId, toConnectorType);
        setDrawingLineState(null); 
    }
  }, [drawingLineState, handleAttemptConnection]); 


  const handleCanvasMouseDown = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-node-id], button, input, [data-connector-id], [data-interactive="true"]')) {
      return;
    }
    if (!canvasAreaRef.current) return;
    event.preventDefault(); 

    setIsPanning(true);
    setPanStartCoords({
      x: event.clientX, 
      y: event.clientY,
      scrollLeft: canvasAreaRef.current.scrollLeft,
      scrollTop: canvasAreaRef.current.scrollTop,
    });
    document.body.style.cursor = 'grabbing';
  }, [canvasAreaRef, setIsPanning, setPanStartCoords]);

  useEffect(() => {
    const handleGlobalMouseMoveForPanning = (event: MouseEvent) => {
      if (!isPanning || !panStartCoords || !canvasAreaRef.current) return;

      const dx = event.clientX - panStartCoords.x;
      const dy = event.clientY - panStartCoords.y;

      canvasAreaRef.current.scrollLeft = panStartCoords.scrollLeft - dx;
      canvasAreaRef.current.scrollTop = panStartCoords.scrollTop - dy;
    };

    const handleGlobalMouseUpForPanning = () => {
      if (isPanning) {
        setIsPanning(false);
        setPanStartCoords(null);
        document.body.style.cursor = 'default';
      }
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMoveForPanning);
      document.addEventListener('mouseup', handleGlobalMouseUpForPanning);
    } else {
      document.removeEventListener('mousemove', handleGlobalMouseMoveForPanning);
      document.removeEventListener('mouseup', handleGlobalMouseUpForPanning);
      document.body.style.cursor = 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMoveForPanning);
      document.removeEventListener('mouseup', handleGlobalMouseUpForPanning);
      document.body.style.cursor = 'default';
    };
  }, [isPanning, panStartCoords, canvasAreaRef]); 


  const handleDeleteConnection = (connectionId: string) => {
    const connectionToDelete = connections.find(conn => conn.id === connectionId);
    if (!connectionToDelete) return;

    setConnections(prevConnections => prevConnections.filter(conn => conn.id !== connectionId));

    setActiveNodes(prevNodes => prevNodes.map(node => {
      let nodeDataChanged = false;
      const newConnectors = { ...(node.data?.connectors || {}) };

      if (node.id === connectionToDelete.fromNodeId && newConnectors[connectionToDelete.fromConnectorId]?.connectedTo) {
        newConnectors[connectionToDelete.fromConnectorId].connectedTo =
          newConnectors[connectionToDelete.fromConnectorId].connectedTo?.filter(
            (ct: any) => !(ct.nodeId === connectionToDelete.toNodeId && ct.connectorId === connectionToDelete.toConnectorId)
          );
        nodeDataChanged = true;
      }

      if (node.id === connectionToDelete.toNodeId && newConnectors[connectionToDelete.toConnectorId]?.connectedTo) {
        newConnectors[connectionToDelete.toConnectorId].connectedTo =
          newConnectors[connectionToDelete.toConnectorId].connectedTo?.filter(
            (ct: any) => !(ct.nodeId === connectionToDelete.fromNodeId && ct.connectorId === connectionToDelete.fromConnectorId)
          );
        nodeDataChanged = true;
      }

      if (nodeDataChanged && node.data) {
        const isNowInputConnected = Array.isArray(connections) ? connections.some(c => c.id !== connectionId && c.toNodeId === node.id) : false;
        const isNowOutputConnected = Array.isArray(connections) ? connections.some(c => c.id !== connectionId && c.fromNodeId === node.id) : false;
        return { 
            ...node, 
            data: { 
                ...(node.data || {}), 
                connectors: newConnectors,
                inputConnected: isNowInputConnected,
                outputConnected: isNowOutputConnected,
            }
        };
      }
      return node;
    }));

    toast({ title: "Connection Deleted", description: "The connection has been removed." });
  };

  const handleAddNodeOnConnection = (connectionId: string) => {
    console.log("Attempting to add node on connection:", connectionId);
    const connection = connections.find(c => c.id === connectionId);
    if (connection) {
        const fromNode = activeNodes.find(n => n.id === connection.fromNodeId);
        const toNode = activeNodes.find(n => n.id === connection.toNodeId);
        toast({
            title: "Add Node (Not Implemented)",
            description: `Would add node between ${fromNode?.name} and ${toNode?.name}.`
        });
    }
  };


  const handleZoomIn = () => setZoomLevel(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP));

  const handleToggleAiAssistantPanel = useCallback(() => {
    setIsAiAssistantPanelOpen(prevState => !prevState);
  }, []);


  const handleTogglePaletteCollapse = () => {
    if (palettePanelRef.current) {
        const currentSize = palettePanelRef.current.getSize();
        if (currentSize > 0) {
            palettePanelRef.current.collapse();
        } else {
            palettePanelRef.current.expand();
            palettePanelRef.current.resize(PALETTE_PANEL_DEFAULT_SIZE); 
        }
    }
  };

  const handleToggleWorkflowChatPanel = () => setIsWorkflowChatPanelVisible(prev => !prev);

  const handleRedo = () => console.log("Redo action triggered");
  const handleAutoLayout = () => {
    if (!currentWorkflow) return;
    const PADDING = 50;
    const NODE_SPACING_X = AI_AGENT_NODE_WIDTH + 50; 
    const NODE_SPACING_Y = AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS + 50; 
    const NODES_PER_ROW = Math.floor((canvasAreaRef.current?.offsetWidth || 800) / NODE_SPACING_X) || 1; 

    setActiveNodes(prevNodes =>
        prevNodes.map((node, index) => {
            let newX = PADDING + (index % NODES_PER_ROW) * NODE_SPACING_X;
            let newY = PADDING + Math.floor(index / NODES_PER_ROW) * NODE_SPACING_Y;

            if (node.type === 'CONNECTED_CHAT_MODEL' && node.data?.aiAgentNodeId) {
                const parentAiNode = prevNodes.find(n => n.id === node.data.aiAgentNodeId);
                if (parentAiNode && parentAiNode.position) {
                    newX = parentAiNode.position.x + (AI_AGENT_NODE_WIDTH / 6) - (CONNECTED_MODEL_NODE_WIDTH / 2); 
                    newY = parentAiNode.position.y + AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS;
                }
            } else if (node.type === 'COINGECKO_TOOL_DISPLAY_NODE' && node.data?.parentAiAgentId) {
                 const parentAiNode = prevNodes.find(n => n.id === node.data.parentAiAgentId);
                 if (parentAiNode && parentAiNode.position) {
                    newX = parentAiNode.position.x + (AI_AGENT_NODE_WIDTH * 5/6) - (COINGECKO_TOOL_NODE_WIDTH / 2); 
                    newY = parentAiNode.position.y + AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_HEIGHT + SPACING_BELOW_AI_NODE_CONNECTORS;
                }
            }
            return { ...node, position: { x: newX, y: newY }};
        })
    );
    toast({title: "Auto-Layout Applied", description: "Nodes have been rearranged."});
  };

  const handleWorkflowChatSend = async (userInput: string) => {
    if (!currentWorkflow) {
      toast({title: "Error", description: "No active workflow to process chat.", variant: "destructive"});
      return;
    }
    if (!userInput.trim()) return;
    setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: userInput, sender: 'user' }]);
    setIsWorkflowAiResponding(true);

    const chatTriggerNode = activeNodes.find(n => n.type === 'CHAT_TRIGGER' && !n.data?.isDisabled);
    if (!chatTriggerNode) {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: "System: Active Chat Trigger node not found or is disabled.", sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      return;
    }

    const connectionToAgent = connections.find(c => c.fromNodeId === chatTriggerNode.id && c.fromConnectorId === 'output');
    if (!connectionToAgent) {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: "System: Chat Trigger is not connected to an AI Agent.", sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      return;
    }

    const aiAgentNode = activeNodes.find(n => n.id === connectionToAgent.toNodeId && n.type === 'AI_AGENT' && !n.data?.isDisabled);
    if (!aiAgentNode || !aiAgentNode.data) {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: "System: Connected AI Agent node not found, is disabled, or has no data.", sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      return;
    }

    setProcessingNodeId(aiAgentNode.id); 

    const { selectedModelId, chatModelCredentialId, chatModelCredentialStatus, promptSource, systemPrompt } = aiAgentNode.data;
    if (!selectedModelId || !chatModelCredentialId) {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: `System: AI Agent "${aiAgentNode.name}" has no chat model configured.`, sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      setProcessingNodeId(null);
      return;
    }
    if (chatModelCredentialStatus !== 'valid') {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: `System: Chat model for AI Agent "${aiAgentNode.name}" is not validated or invalid. Please check credentials.`, sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      setProcessingNodeId(null);
      return;
    }

    const credential = getCredentialById(chatModelCredentialId);
     if (!credential) {
       setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: `System: Credential not found for AI Agent "${aiAgentNode.name}".`, sender: 'system' }]);
       setIsWorkflowAiResponding(false);
       setProcessingNodeId(null);
       return;
    }

    if (credential.providerId === 'openai' && !credential.apiKey) {
        setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: `System: OpenAI API Key not found in credential for AI Agent "${aiAgentNode.name}".`, sender: 'system' }]);
        setIsWorkflowAiResponding(false);
        setProcessingNodeId(null);
        return;
    }


    let agentSystemPromptText = "You are a helpful AI assistant."; 
    if (promptSource === 'system-prompt' && systemPrompt) {
      agentSystemPromptText = systemPrompt;
    }

    const flowInput: ProcessChatMessageInput = {
      userInput,
      agentSystemPrompt: agentSystemPromptText,
      modelId: selectedModelId,
      providerId: credential.providerId, 
      apiKey: credential.apiKey, 
      apiEndpoint: credential.endpoint, 
    };

    try {
      const result = await processChatMessage(flowInput);
      if (result.error) {
        setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: `AI Error: ${result.error}`, sender: 'system' }]);
      } else {
        setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: result.aiResponse, sender: 'ai' }]);
      }
    } catch (error) {
      console.error("Error calling processChatMessage flow:", error);
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: "System: An unexpected error occurred while contacting the AI.", sender: 'system' }]);
    } finally {
      setIsWorkflowAiResponding(false);
      setProcessingNodeId(null); 
    }
  };

  const handleAssistantChatSend = async (userInput: string) => {
    if (!userInput.trim()) return;
    setAssistantMessages(prev => [...prev, { id: uuidv4(), text: userInput, sender: 'user' }]);
    setIsAssistantResponding(true);

    const flowInput: GeneralAssistantChatInput = { userInput };

    try {
      const result = await generalAssistantChat(flowInput);
      if (result.error) {
        setAssistantMessages(prev => [...prev, { id: uuidv4(), text: `Assistant Error: ${result.error}`, sender: 'system' }]);
      } else {
        setAssistantMessages(prev => [...prev, { id: uuidv4(), text: result.aiResponse, sender: 'ai' }]);
      }
    } catch (error) {
      console.error("Error calling generalAssistantChat flow:", error);
      setAssistantMessages(prev => [...prev, { id: uuidv4(), text: "System: An unexpected error occurred while contacting the AI Assistant.", sender: 'system' }]);
    } finally {
      setIsAssistantResponding(false);
    }
  };

  const handleImportWorkflow = (importedWorkflowData: Partial<Workflow>) => {
    if (!importedWorkflowData.name || !Array.isArray(importedWorkflowData.nodes) || importedWorkflowData.connections === undefined ) {
        toast({ title: "Import Error", description: "Invalid workflow file format. Missing name, nodes, or connections.", variant: "destructive" });
        return;
    }

    const newWorkflow: Workflow = workflowStore.createNewWorkflow(
        `Imported - ${importedWorkflowData.name.substring(0, 50)}`,
        Array.isArray(importedWorkflowData.nodes) ? importedWorkflowData.nodes : [],
        Array.isArray(importedWorkflowData.connections) ? importedWorkflowData.connections : [],
        importedWorkflowData.zoomLevel || 1
    );

    if (newWorkflow) {
        setCurrentWorkflow(newWorkflow);
        setActiveNodes(newWorkflow.nodes || []); 
        setConnections(Array.isArray(newWorkflow.connections) ? newWorkflow.connections : []); 
        setZoomLevel(newWorkflow.zoomLevel || 1);
        workflowStore.setActiveWorkflowId(newWorkflow.id);
        toast({ title: "Workflow Imported", description: `"${newWorkflow.name}" has been imported and is now active.` });
    } else {
        toast({ title: "Import Failed", description: "Could not save the imported workflow.", variant: "destructive" });
    }
};


  const handleImportFromUrl = async () => {
    const url = window.prompt("Enter the URL of the workflow JSON file:");
    if (!url) return;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        handleImportWorkflow(data as Partial<Workflow>);
    } catch (error: any) {
        console.error("Error importing from URL:", error);
        toast({ title: "Import Error", description: `Failed to import from URL: ${error.message}`, variant: "destructive" });
    }
  };

  const handleImportFromFile = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json,application/json';
    fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const fileContent = event.target?.result as string;
                    const data = JSON.parse(fileContent);
                    handleImportWorkflow(data as Partial<Workflow>);
                } catch (error: any) {
                    console.error("Error importing from file:", error);
                    toast({ title: "Import Error", description: `Failed to parse file: ${error.message}`, variant: "destructive" });
                }
            };
            reader.readAsText(file);
        }
    };
    fileInput.click();
  };

  const handleToggleNodeDisabled = (nodeId: string) => {
    setActiveNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, isDisabled: !(node.data?.isDisabled ?? false) } }
          : node
      )
    );
  };

  const handleDeleteNode = (nodeId: string) => {
    const nodeToDelete = activeNodes.find(n => n.id === nodeId);
    if (!nodeToDelete) return;

    let newNodes = activeNodes.filter(n => n.id !== nodeId);
    let newConnectionsValue = Array.isArray(connections) ? connections.filter(
      conn => conn.fromNodeId !== nodeId && conn.toNodeId !== nodeId
    ) : [];

    if (nodeToDelete.type === 'AI_AGENT') {
      if (nodeToDelete.data?.connectedChatModelNodeId) {
        newNodes = newNodes.filter(n => n.id !== nodeToDelete.data.connectedChatModelNodeId);
      }
      if (nodeToDelete.data?.coingeckoToolNodeId) { 
        newNodes = newNodes.filter(n => n.id !== nodeToDelete.data.coingeckoToolNodeId);
      }
    }
    else if (nodeToDelete.type === 'CONNECTED_CHAT_MODEL' || nodeToDelete.type === 'COINGECKO_TOOL_DISPLAY_NODE') {
        const parentIdKey = nodeToDelete.type === 'CONNECTED_CHAT_MODEL' ? 'aiAgentNodeId' : 'parentAiAgentId';
        const parentId = nodeToDelete.data?.[parentIdKey];
        if(parentId){
            newNodes = newNodes.map(n => {
                if (n.id === parentId && n.type === 'AI_AGENT' && n.data) {
                    const updatedData = {...n.data};
                    if(nodeToDelete.type === 'CONNECTED_CHAT_MODEL' && updatedData.connectedChatModelNodeId === nodeId) {
                        delete updatedData.connectedChatModelNodeId;
                    }
                    if(nodeToDelete.type === 'COINGECKO_TOOL_DISPLAY_NODE' && updatedData.coingeckoToolNodeId === nodeId) {
                        delete updatedData.coingeckoToolNodeId;
                    }
                    return {...n, data: updatedData};
                }
                return n;
            });
        }
    }


    setActiveNodes(newNodes);
    setConnections(newConnectionsValue);
    toast({ title: "Node Deleted", description: `Node "${nodeToDelete.name}" and its connections removed.`});
  };

  const handleMoreNodeOptions = (nodeId: string) => {
    console.log("More options clicked for node:", nodeId);
    toast({ title: "More Options", description: `More options for node ${nodeId} (not implemented).`});
  };


  const nodeToConfigureForAiAgentModal = editingNodeId ? activeNodes.find(n => n.id === editingNodeId && n.type === 'AI_AGENT') : null;
  const nodeToConfigureForTelegramModal = editingTelegramNodeId ? activeNodes.find(n => n.id === editingTelegramNodeId && n.type === 'TELEGRAM_TRIGGER') : null;
  
  const agentNodeForGitHubConfig = agentNodeForToolConfig; 
  const existingGitHubTool = agentNodeForToolConfig?.data?.tools?.find(t => t.id === editingToolIdForAgent && t.type === 'GITHUB_API') as GitHubApiToolConfig | undefined;


  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <StartupChoiceModal
        isOpen={isStartupChoiceModalOpen}
        onChoice={handleStartupChoice}
        onOpenChange={handleStartupModalOpenChange}
      />

      {!isStartupChoiceModalOpen && currentView === 'builder' && (
        <>
          <Header
            onOpenLoginModal={handleOpenLoginModal}
            onOpenAgentTemplatesModal={handleOpenAgentTemplatesModal}
          />
           <ResizablePanelGroup
            direction="horizontal"
            className="flex-grow border-t"
            ref={mainPanelGroupRef}
          >
            <ResizablePanel
                ref={palettePanelRef}
                defaultSize={PALETTE_PANEL_DEFAULT_SIZE}
                minSize={0} 
                maxSize={40}
                collapsible
                collapsedSize={0}
                className="transition-all duration-300 ease-in-out bg-card"
                order={1}
            >
               <ComponentsPalette onNodeSelect={handleNodeSelect} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
                minSize={30}
                order={2}
                className="flex flex-col" 
            >
                <CanvasArea
                  ref={canvasAreaRef}
                  workflowName={currentWorkflow?.name || ''}
                  onWorkflowNameChange={handleWorkflowNameChange}
                  onCreateNewWorkflow={handleCreateNewWorkflow}
                  onOpenMyWorkflows={handleOpenMyWorkflowsModal}
                  onExplicitSave={handleExplicitSave}
                  onOpenShareModal={handleOpenShareModal}
                  onImportFromUrl={handleImportFromUrl}
                  onImportFromFile={handleImportFromFile}
                  activeNodes={activeNodes}
                  connections={connections}
                  drawingLine={drawingLineState}
                  onNodeDragStart={handleNodeDragStart}
                  draggingNodeId={draggingState?.nodeId || null}
                  onNodeDoubleClick={handleNodeDoubleClick}
                  onNodeConfigureSection={handleNodeConfigureSection}
                  zoomLevel={zoomLevel}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onToggleMaximize={handleTogglePaletteCollapse}
                  onToggleWorkflowChatPanel={handleToggleWorkflowChatPanel}
                  isWorkflowChatPanelVisible={isWorkflowChatPanelVisible}
                  onToggleAiAssistantPanel={handleToggleAiAssistantPanel}
                  onRedo={handleRedo}
                  onAutoLayout={handleAutoLayout}
                  onStartLineDraw={handleStartLineDraw}
                  onConnectorMouseUp={handleConnectorMouseUp}
                  onCanvasMouseMove={handleCanvasMouseMove}
                  onCanvasMouseUp={handleCanvasMouseUp}
                  onDeleteConnection={handleDeleteConnection}
                  onAddNodeOnConnection={handleAddNodeOnConnection}
                  workflowChatMessages={workflowChatMessages}
                  onWorkflowChatSend={handleWorkflowChatSend}
                  isWorkflowAiResponding={isWorkflowAiResponding}
                  onCanvasMouseDown={handleCanvasMouseDown}
                  processingNodeId={processingNodeId}
                  onToggleNodeDisabled={handleToggleNodeDisabled}
                  onDeleteNode={handleDeleteNode}
                  onMoreNodeOptions={handleMoreNodeOptions}
                  className="flex-grow" 
                />
            </ResizablePanel>
            {isAiAssistantPanelOpen && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel
                  ref={assistantPanelRef}
                  order={3}
                  collapsible
                  collapsedSize={0}
                  defaultSize={ASSISTANT_PANEL_DEFAULT_SIZE}
                  minSize={0} 
                  maxSize={40}
                  onCollapse={() => setIsAiAssistantPanelOpen(false)}
                  onExpand={() => setIsAiAssistantPanelOpen(true)}
                  className="transition-all duration-300 ease-in-out"
                >
                 <AiAssistantPanel
                    onClose={() => setIsAiAssistantPanelOpen(false)}
                    messages={assistantMessages}
                    onSendMessage={handleAssistantChatSend}
                    isResponding={isAssistantResponding}
                    userName="User"
                  />
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </>
      )}

      {!isStartupChoiceModalOpen && currentView === 'landingCreator' && (
        <LandingPageGenerator />
      )}


      {currentView === 'builder' && (
        <WorkflowNameModal
            isOpen={isWorkflowNameModalOpen && !isStartupChoiceModalOpen}
            onOpenChange={setIsWorkflowNameModalOpen}
            onSave={handleSaveWorkflowName}
            initialName={currentWorkflow?.name || ''}
            isCreatingNew={isCreatingNewWorkflow}
        />
      )}

      <ShareWorkflowModal
        isOpen={isShareModalOpen}
        onOpenChange={setIsShareModalOpen}
        workflow={currentWorkflow}
      />

      <OpenWorkflowModal
        isOpen={isMyWorkflowsModalOpen}
        onOpenChange={setIsMyWorkflowsModalOpen}
        onWorkflowSelect={handleSelectWorkflowFromModal}
        onWorkflowDelete={handleDeleteWorkflowFromStore}
        currentWorkflowId={currentWorkflow?.id}
      />

      {isAiAgentModalOpen && (selectedNodeType === 'AI_AGENT' || editingNodeId) && (
        <AiAgentNodeModal
          isOpen={isAiAgentModalOpen}
          onOpenChange={handleAiAgentModalOpenChange}
          node={nodeToConfigureForAiAgentModal}
          onNodeConfigChange={handleNodeConfigChange}
          onOpenToolConfiguration={handleOpenToolConfigurationModal}
          onOpenGitHubApiCredentialModal={handleOpenGitHubApiCredentialModal}
          initialSection={initialModalSection}
        />
      )}

      {isCoinGeckoToolModalOpen && agentNodeForToolConfig && (
        <CoinGeckoToolModal
          isOpen={isCoinGeckoToolModalOpen}
          onOpenChange={(open) => {
            setIsCoinGeckoToolModalOpen(open);
            if (!open) {
              setAgentNodeForToolConfig(null);
              setEditingToolConfig(undefined);
              setEditingToolIdForAgent(undefined);
            }
          }}
          agentNode={agentNodeForToolConfig}
          toolConfig={editingToolConfig}
          onSave={(agentNodeId, toolConfig) => handleSaveToolConfig(agentNodeId, toolConfig as AnyToolConfig)}
        />
      )}

      {isGitHubApiCredentialModalOpen && agentNodeForToolConfig && (
        <GitHubApiCredentialModal
          isOpen={isGitHubApiCredentialModalOpen}
          onOpenChange={(open) => {
            setIsGitHubApiCredentialModalOpen(open);
             if (!open) {
              setAgentNodeForToolConfig(null);
              setEditingToolIdForAgent(undefined);
            }
          }}
          onSave={(toolConfig) => handleSaveToolConfig(agentNodeForToolConfig.id, toolConfig)}
          existingCredentialId={existingGitHubTool?.credentialId}
        />
      )}

      {isTelegramTriggerModalOpen && nodeToConfigureForTelegramModal && (
        <TelegramTriggerNodeModal
          isOpen={isTelegramTriggerModalOpen}
          onOpenChange={setIsTelegramTriggerModalOpen}
          node={nodeToConfigureForTelegramModal}
          onConfigSave={handleTelegramTriggerConfigSave}
        />
      )}


      {isChatModelSelectionModalOpen && (
        <ChatModelSelectionModal
          isOpen={isChatModelSelectionModalOpen}
          onOpenChange={handleChatModelSelectionModalOpenChange}
          onCredentialSelected={handleCredentialSelectedFromManager}
          currentConfiguredProviderId={
            configuringToolDetails?.providerId || 
            configuringChatModelForNode?.data?.selectedProviderId 
          }
          currentConfiguredModelId={configuringChatModelForNode?.data?.selectedModelId} 
          currentConfiguredCredentialId={ 
            configuringChatModelForNode?.data?.chatModelCredentialId ||
            (configuringToolDetails?.existingToolId && activeNodes.find(n => n.id === configuringToolDetails.agentNodeId)?.data?.tools?.find((t: AnyToolConfig) => t.id === configuringToolDetails.existingToolId)?.credentialId)
          }
        />
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
      />

      <AgentTemplatesModal
        isOpen={isAgentTemplatesModalOpen}
        onOpenChange={setIsAgentTemplatesModalOpen}
        onTemplateSelect={handleTemplateSelectedFromModal}
      />
    </div>
  );
}

    
