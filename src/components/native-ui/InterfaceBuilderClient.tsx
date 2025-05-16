
// @ts-nocheck
// TODO: Fix TS errors
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type React from 'react';
import Header from './Header';
import ComponentsPalette from './ComponentsPalette';
import CanvasArea from './CanvasArea';
import AiAssistantPanel from './AiAssistantPanel';
import AiAgentNodeModal from './AiAgentNodeModal';
import ChatModelSelectionModal from './ChatModelSelectionModal'; 
import WorkflowNameModal from './WorkflowNameModal';
import ShareWorkflowModal from './ShareWorkflowModal';
import OpenWorkflowModal from './OpenWorkflowModal';
import type { Node, StoredCredential, LLMModel, NodeData, Connection, Workflow } from '@/lib/types'; 
import { getCredentialById } from '@/lib/credentialsStore';
import { getAllChatModels, llmProviders } from '@/lib/llmProviders'; 
import * as workflowStore from '@/lib/workflowStore';
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


interface DraggingState {
  nodeId: string;
  startMouseX: number;
  startMouseY: number;
  startNodeX: number;
  startNodeY: number;
}

const AI_AGENT_NODE_WIDTH = 256; 
const AI_AGENT_NODE_MIN_HEIGHT = 120;
const AI_AGENT_CONNECTOR_AREA_TOTAL_HEIGHT = 54; 
const CONNECTED_MODEL_NODE_WIDTH = 200;
const SPACING_BELOW_AI_NODE = 30;
const TRIGGER_NODE_WIDTH = 224; 
const TRIGGER_NODE_MIN_HEIGHT = 80;


const ZOOM_STEP = 0.1;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;

const ASSISTANT_PANEL_DEFAULT_SIZE = 25;

export default function InterfaceBuilderClient() {
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null);
  const [isWorkflowNameModalOpen, setIsWorkflowNameModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCreatingNewWorkflow, setIsCreatingNewWorkflow] = useState(false);
  const [isMyWorkflowsModalOpen, setIsMyWorkflowsModalOpen] = useState(false);

  const [selectedNodeType, setSelectedNodeType] = useState<string | null>(null);
  const [activeNodes, setActiveNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [drawingLine, setDrawingLine] = useState<{ fromNodeId: string; fromConnectorId: string; fromPosition: { x: number; y: number }; toPosition: { x: number; y: number } } | null>(null);
  
  const [isAiAgentModalOpen, setIsAiAgentModalOpen] = useState(false); 
  const [draggingState, setDraggingState] = useState<DraggingState | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [initialModalSection, setInitialModalSection] = useState<string | undefined>(undefined);
  
  const [configuringChatModelForNode, setConfiguringChatModelForNode] = useState<Node | null>(null);

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

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panStartCoords, setPanStartCoords] = useState<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);


  useEffect(() => {
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
        setIsCreatingNewWorkflow(false); 
      }
    } else {
      const allWorkflows = workflowStore.getAllWorkflows();
      if (allWorkflows.length > 0) {
        setIsMyWorkflowsModalOpen(true); 
      } else {
        setIsWorkflowNameModalOpen(true);
        setIsCreatingNewWorkflow(true); 
      }
    }
  }, []);

  const performSave = useCallback((workflowToSave: Workflow) => {
    const saved = workflowStore.saveWorkflow(workflowToSave);
    if (saved) {
      console.log("Workflow explicitly saved:", saved.name);
    } else {
      toast({ title: "Save Failed", description: "Could not save the workflow.", variant: "destructive" });
    }
    return saved;
  }, [toast]);

  useEffect(() => {
    if (currentWorkflow && (debouncedActiveNodes || debouncedConnections || debouncedWorkflowName || debouncedZoomLevel)) {
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
  }, [currentWorkflow, debouncedActiveNodes, debouncedConnections, debouncedWorkflowName, debouncedZoomLevel, activeNodes, connections, zoomLevel]);


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
    if (!currentWorkflow) {
      toast({ title: "No Active Workflow", description: "Please name your workflow first.", variant: "destructive" });
      setIsWorkflowNameModalOpen(true);
      return;
    }

    setSelectedNodeType(nodeType); 
    setEditingNodeId(null); 
    setInitialModalSection(undefined);

    let newNodePartial: Omit<Node, 'id' | 'position'> & { position?: {x: number, y: number} } | null = null;
    const newNodesCount = activeNodes.length; 
    const basePosition = { 
        x: 50 + (newNodesCount % 5) * (AI_AGENT_NODE_WIDTH + 30), 
        y: 50 + Math.floor(newNodesCount / 5) * (AI_AGENT_NODE_MIN_HEIGHT + 50) 
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
          data: { title: 'Chat Trigger', connectors: { output: { type: 'output'}}}
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
          data: { title: 'Telegram Trigger', connectors: { output: { type: 'output'}}}
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
        } else {
            toast({title: "Error", description: "Parent AI Agent node not found for this model.", variant: "destructive"});
        }
      }
    }
  };

  const handleNodeConfigureSection = (nodeId: string, section?: string) => {
    const nodeToEdit = activeNodes.find(n => n.id === nodeId);
    if (nodeToEdit) {
      if (section === 'chatModel' && nodeToEdit.type === 'AI_AGENT') {
        setConfiguringChatModelForNode(nodeToEdit);
      } else if (nodeToEdit.type === 'AI_AGENT') {
        setSelectedNodeType(nodeToEdit.type);
        setEditingNodeId(nodeToEdit.id);
        setInitialModalSection(section);
        setIsAiAgentModalOpen(true);
      }
    }
  };

  const handleNodeConfigChange = (nodeId: string, data: Partial<Node['data']>) => {
    let requiresConnectedNodeUpdate = false;
    let connectedModelNodeIdToUpdate: string | undefined;
    let newConnectedNodeData: Partial<NodeData> = {};

    setActiveNodes(prevNodes =>
      prevNodes.map(node => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, data: { ...node.data, ...data } };
          if (node.type === 'AI_AGENT' && (data.selectedModelId || data.chatModelCredentialStatus || data.chatModelCredentialId)) {
            requiresConnectedNodeUpdate = true;
            connectedModelNodeIdToUpdate = updatedNode.data?.connectedChatModelNodeId;
            
            const model = getAllChatModels().find(m => m.id === data.selectedModelId || m.id === node.data?.selectedModelId);
            const provider = llmProviders.find(p => p.id === data.selectedProviderId || p.id === node.data?.selectedProviderId);
            const credential = getCredentialById(data.chatModelCredentialId || node.data?.chatModelCredentialId || '');


            newConnectedNodeData = {
                modelName: model?.name,
                providerName: provider?.name,
                providerId: provider?.id,
                credentialId: credential?.id, 
                status: credential?.status, 
                validationError: credential?.validationError, 
            };
          }
          return updatedNode;
        }
        return node;
      })
    );
    
    if (requiresConnectedNodeUpdate && connectedModelNodeIdToUpdate) {
        setActiveNodes(prevNodes => 
            prevNodes.map(node => 
                node.id === connectedModelNodeIdToUpdate 
                ? { ...node, data: { ...node.data, ...newConnectedNodeData } }
                : node
            )
        );
    }
  };

  const handleAiAgentModalOpenChange = (open: boolean) => {
    setIsAiAgentModalOpen(open);
    if (!open) { 
      if (editingNodeId) { 
        setEditingNodeId(null);
      } else if (selectedNodeType === 'AI_AGENT' && !editingNodeId) { 
         if (!currentWorkflow) {
          toast({ title: "Workflow Not Ready", description: "Cannot add agent without an active workflow.", variant: "destructive"});
          setSelectedNodeType(null);
          return;
        }
        const newNodesCount = activeNodes.filter(n => n.type === 'AI_AGENT').length;
        const newNodeName = `AI Agent ${newNodesCount + 1}`;
        const basePosition = { 
          x: 50 + (activeNodes.length % 5) * (AI_AGENT_NODE_WIDTH + 30),
          y: 50 + Math.floor(activeNodes.length / 5) * (AI_AGENT_NODE_MIN_HEIGHT + 50)
        };
        const newNode: Node = {
          id: `node-${uuidv4()}`,
          type: 'AI_AGENT',
          name: newNodeName,
          position: basePosition,
          data: {
            title: newNodeName,
            subTitle: 'Tools Agent',
            promptSource: 'chat-trigger', 
            connectors: { 
                'input-trigger': { type: 'input' },
                'output-main': { type: 'output' },
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
    if (!open) {
      setConfiguringChatModelForNode(null);
    }
  };

  const handleChatModelCredentialSelectedForNode = (credentialId: string, modelId: string) => {
    if (!configuringChatModelForNode || configuringChatModelForNode.type !== 'AI_AGENT') return;

    const parentNode = configuringChatModelForNode;
    const credential = getCredentialById(credentialId);
    const model = getAllChatModels().find(m => m.id === modelId);
    const provider = model ? llmProviders.find(p => p.id === model.providerId) : null;

    if (!credential || !model || !provider) {
      console.error("Credential, model, or provider not found for chat model selection.");
      toast({title: "Error", description: "Could not configure chat model. Required details missing.", variant: "destructive"});
      setConfiguringChatModelForNode(null);
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
      connectors: { input: { type: 'input' } } 
    };

    let newNodesList = [...activeNodes];
    const parentNodeIndex = newNodesList.findIndex(n => n.id === parentNode.id);

    if (parentNodeIndex === -1) {
        console.error("Parent AI Agent node not found in active nodes list.");
        setConfiguringChatModelForNode(null);
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
      const newConnectedNodeX = (parentNode.position?.x || 0) + (AI_AGENT_NODE_WIDTH / 6) - (CONNECTED_MODEL_NODE_WIDTH / 2) ; 
      const newConnectedNodeY = (parentNode.position?.y || 0) + AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_TOTAL_HEIGHT + SPACING_BELOW_AI_NODE;
      
      const newConnectedNode: Node = {
        id: `cnode-${uuidv4()}`,
        type: 'CONNECTED_CHAT_MODEL',
        name: `Model: ${model.name}`, 
        position: { x: newConnectedNodeX, y: newConnectedNodeY },
        data: connectedNodeDataUpdate,
      };
      newNodesList.push(newConnectedNode);
      aiAgentUpdateData.connectedChatModelNodeId = newConnectedNode.id; 
    }
    
    newNodesList[parentNodeIndex] = {
        ...newNodesList[parentNodeIndex],
        data: { ...newNodesList[parentNodeIndex].data, ...aiAgentUpdateData}
    };
    
    setActiveNodes(newNodesList);
    setConfiguringChatModelForNode(null); 
    toast({title: "Chat Model Configured", description: `${model.name} has been linked to ${parentNode.name}.`});
  };

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


  const handleAttemptConnection = useCallback((toNodeId?: string, toConnectorId?: string, toConnectorType?: 'input' | 'output') => {
    if (!drawingLine || !toNodeId || !toConnectorId || !toConnectorType) {
      if (drawingLine) toast({ title: "Connection Invalid", description: "Target connector not found.", variant: "destructive" });
      return;
    }

    const { fromNodeId, fromConnectorId } = drawingLine;
    const fromNode = activeNodes.find(n => n.id === fromNodeId);
    const toNode = activeNodes.find(n => n.id === toNodeId);

    if (!fromNode || !toNode || fromNode.id === toNode.id) {
      toast({ title: "Connection Invalid", description: "Cannot connect a node to itself or invalid nodes.", variant: "destructive" });
      return;
    }
    
    const isTriggerToAgent = 
        (fromNode.type === 'CHAT_TRIGGER' || fromNode.type === 'TELEGRAM_TRIGGER') &&
        fromConnectorId === 'output' &&
        toNode.type === 'AI_AGENT' &&
        toConnectorId === 'input-trigger' &&
        toConnectorType === 'input';

    const isAgentToAgent =
        fromNode.type === 'AI_AGENT' &&
        fromConnectorId === 'output-main' &&
        toNode.type === 'AI_AGENT' &&
        toConnectorId === 'input-trigger' &&
        toConnectorType === 'input';
        
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
              return { ...n, data: { ...(n.data || {}), connectors: newConnectors }};
            }
            return n;
        }));
        toast({ title: "Connection Created", description: `Connected ${fromNode.name} to ${toNode.name}.` });
    } else {
      toast({ title: "Connection Invalid", description: "These node types or connectors are not compatible.", variant: "destructive"});
    }
  }, [drawingLine, activeNodes, connections, toast, setActiveNodes, setConnections]);

  const handleStartLineDraw = useCallback((nodeId: string, connectorId: string, globalPosition: { x: number; y: number }, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    setDrawingLine({
      fromNodeId: nodeId,
      fromConnectorId: connectorId,
      fromPosition: globalPosition, 
      toPosition: globalPosition,   
    });
  }, [setDrawingLine]);

  const handleCanvasMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (drawingLine) {
      const { x, y } = transformToCanvasCoordinates(event.clientX, event.clientY);
      setDrawingLine(prev => prev ? { ...prev, toPosition: { x, y } } : null);
    }
  }, [drawingLine, transformToCanvasCoordinates, setDrawingLine]);
  
  const handleCanvasMouseUp = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (drawingLine) {
      const targetElement = event.target as HTMLElement;
      const targetNodeElement = targetElement.closest('[data-node-id]') as HTMLElement | null; 
      const targetConnectorElement = targetElement.closest('[data-connector-id]') as HTMLElement | null;


      if (targetNodeElement && targetConnectorElement) {
        const toNodeId = targetNodeElement.dataset.nodeId;
        const toConnectorId = targetConnectorElement.dataset.connectorId;
        const toConnectorType = targetConnectorElement.dataset.connectorType as ('input' | 'output' | undefined);
        
        handleAttemptConnection(toNodeId, toConnectorId, toConnectorType);
      } else {
        toast({ title: "Connection Canceled", description: "Line dropped on empty space.", variant: "default" });
      }
      setDrawingLine(null); 
    }
  }, [drawingLine, transformToCanvasCoordinates, handleAttemptConnection, setDrawingLine, toast]);

  const handleConnectorMouseUp = useCallback((toNodeId: string, toConnectorId: string, toConnectorType: 'input' | 'output', globalPosition: { x: number, y: number }, event: React.MouseEvent) => {
    if (drawingLine) {
        event.preventDefault();
        event.stopPropagation();
        handleAttemptConnection(toNodeId, toConnectorId, toConnectorType);
        setDrawingLine(null);
    }
  }, [drawingLine, handleAttemptConnection, setDrawingLine]);

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
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!isPanning || !panStartCoords || !canvasAreaRef.current) return;

      const dx = event.clientX - panStartCoords.x;
      const dy = event.clientY - panStartCoords.y;
      
      canvasAreaRef.current.scrollLeft = panStartCoords.scrollLeft - (dx / zoomLevel);
      canvasAreaRef.current.scrollTop = panStartCoords.scrollTop - (dy / zoomLevel);
    };

    const handleGlobalMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
        setPanStartCoords(null);
        document.body.style.cursor = 'default';
      }
    };

    if (isPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isPanning, panStartCoords, zoomLevel, canvasAreaRef]);


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

      if (nodeDataChanged) {
        return { ...node, data: { ...(node.data || {}), connectors: newConnectors }};
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
  
  const handleToggleAiAssistantPanel = () => {
    const newOpenState = !isAiAssistantPanelOpen;
    setIsAiAssistantPanelOpen(newOpenState);
    if (mainPanelGroupRef.current && assistantPanelRef.current) {
      if (newOpenState) {
        assistantPanelRef.current.resize(ASSISTANT_PANEL_DEFAULT_SIZE);
      } else {
        assistantPanelRef.current.resize(0);
      }
    }
  };
  
  const handleTogglePaletteCollapse = () => {
    if (palettePanelRef.current) {
        const currentSize = palettePanelRef.current.getSize();
        if (currentSize > 0) {
            palettePanelRef.current.collapse();
        } else {
            palettePanelRef.current.expand();
            palettePanelRef.current.resize(25); // Or your default expanded size
        }
    }
  };
  
  const handleToggleWorkflowChatPanel = () => setIsWorkflowChatPanelVisible(prev => !prev);
  
  const handleRedo = () => console.log("Redo action triggered"); 
  const handleAutoLayout = () => {
    if (!currentWorkflow) return;
    const PADDING = 50;
    const NODE_SPACING_X = AI_AGENT_NODE_WIDTH + 50; 
    const NODE_SPACING_Y = AI_AGENT_NODE_MIN_HEIGHT + 70;
    const NODES_PER_ROW = Math.floor((canvasAreaRef.current?.offsetWidth || 800) / NODE_SPACING_X) || 1;

    setActiveNodes(prevNodes => 
        prevNodes.map((node, index) => {
            let newX = PADDING + (index % NODES_PER_ROW) * NODE_SPACING_X;
            let newY = PADDING + Math.floor(index / NODES_PER_ROW) * NODE_SPACING_Y;

            if (node.type === 'CONNECTED_CHAT_MODEL' && node.data?.aiAgentNodeId) {
                const parentAiNode = prevNodes.find(n => n.id === node.data.aiAgentNodeId);
                if (parentAiNode && parentAiNode.position) {
                    newX = parentAiNode.position.x + (AI_AGENT_NODE_WIDTH / 6) - (CONNECTED_MODEL_NODE_WIDTH / 2);
                    newY = parentAiNode.position.y + AI_AGENT_NODE_MIN_HEIGHT + AI_AGENT_CONNECTOR_AREA_TOTAL_HEIGHT + SPACING_BELOW_AI_NODE;
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

    const chatTriggerNode = activeNodes.find(n => n.type === 'CHAT_TRIGGER');
    if (!chatTriggerNode) {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: "System: Chat Trigger node not found in the workflow.", sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      return;
    }

    const connectionToAgent = connections.find(c => c.fromNodeId === chatTriggerNode.id && c.fromConnectorId === 'output');
    if (!connectionToAgent) {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: "System: Chat Trigger is not connected to an AI Agent.", sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      return;
    }
    
    const aiAgentNode = activeNodes.find(n => n.id === connectionToAgent.toNodeId && n.type === 'AI_AGENT');
    if (!aiAgentNode || !aiAgentNode.data) {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: "System: Connected AI Agent node not found or has no data.", sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      return;
    }
    
    setProcessingNodeId(aiAgentNode.id); // Start highlighting

    const { selectedModelId, chatModelCredentialId, chatModelCredentialStatus, promptSource, customPrompt } = aiAgentNode.data;
    if (!selectedModelId || !chatModelCredentialId) {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: `System: AI Agent "${aiAgentNode.name}" has no chat model configured.`, sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      setProcessingNodeId(null); // Stop highlighting
      return;
    }
    if (chatModelCredentialStatus !== 'valid') {
      setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: `System: Chat model for AI Agent "${aiAgentNode.name}" is not validated or invalid. Please check credentials.`, sender: 'system' }]);
      setIsWorkflowAiResponding(false);
      setProcessingNodeId(null); // Stop highlighting
      return;
    }
    
    const credential = getCredentialById(chatModelCredentialId);
     if (!credential || (!credential.apiKey && !['ollama', 'googleai'].includes(credential.providerId))) { 
       setWorkflowChatMessages(prev => [...prev, { id: uuidv4(), text: `System: API Key not found or required for AI Agent "${aiAgentNode.name}".`, sender: 'system' }]);
       setIsWorkflowAiResponding(false);
       setProcessingNodeId(null); // Stop highlighting
       return;
    }

    let agentSystemPrompt = "You are a helpful AI assistant."; 
    if (promptSource === 'custom' && customPrompt) {
      agentSystemPrompt = customPrompt;
    }
    
    const flowInput: ProcessChatMessageInput = {
      userInput,
      agentSystemPrompt,
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
      setProcessingNodeId(null); // Stop highlighting
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


  const nodeToConfigureForAiAgentModal = editingNodeId ? activeNodes.find(n => n.id === editingNodeId && n.type === 'AI_AGENT') : null;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden">
      <Header />
      <ResizablePanelGroup 
        direction="horizontal" 
        className="flex-grow border-t"
        ref={mainPanelGroupRef}
      >
        <ResizablePanel 
            ref={palettePanelRef}
            defaultSize={25} 
            minSize={5}
            maxSize={40} 
            collapsible 
            collapsedSize={0}
            onCollapse={() => console.log("Palette collapsed")}
            onExpand={() => console.log("Palette expanded")}
            className="min-w-[280px] md:min-w-[320px] transition-all duration-300 ease-in-out"
            order={1}
        >
           <ComponentsPalette onNodeSelect={handleNodeSelect} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel 
            defaultSize={75} 
            minSize={30}
            order={2}
        >
          <div className="flex h-full flex-col">
            <CanvasArea 
              ref={canvasAreaRef} 
              workflowName={currentWorkflow?.name || ''}
              onWorkflowNameChange={handleWorkflowNameChange}
              onCreateNewWorkflow={handleCreateNewWorkflow}
              onOpenMyWorkflows={handleOpenMyWorkflowsModal}
              onExplicitSave={handleExplicitSave}
              onOpenShareModal={handleOpenShareModal}
              activeNodes={activeNodes} 
              connections={connections}
              drawingLine={drawingLine}
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
              onCanvasMouseDown={handleCanvasMouseDown} // For panning
              processingNodeId={processingNodeId} // Pass processingNodeId
            />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          ref={assistantPanelRef}
          order={3}
          collapsible
          collapsedSize={0}
          defaultSize={0} // Start collapsed
          minSize={15} 
          maxSize={50}
          onCollapse={() => setIsAiAssistantPanelOpen(false)}
          onExpand={() => setIsAiAssistantPanelOpen(true)}
          className="transition-all duration-300 ease-in-out"
        >
          {isAiAssistantPanelOpen && ( // Render only if explicitly opened
            <AiAssistantPanel
              isOpen={isAiAssistantPanelOpen} // This prop might be redundant if panel visibility is controlled by ResizablePanel state
              onClose={handleToggleAiAssistantPanel} // Button inside AiAssistantPanel could call this
              messages={assistantMessages}
              onSendMessage={handleAssistantChatSend}
              isResponding={isAssistantResponding}
              userName="User" 
            />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>

      <WorkflowNameModal
        isOpen={isWorkflowNameModalOpen}
        onOpenChange={setIsWorkflowNameModalOpen}
        onSave={handleSaveWorkflowName}
        initialName={isCreatingNewWorkflow ? 'My New Workflow' : (currentWorkflow?.name || '')}
        isCreatingNew={isCreatingNewWorkflow}
      />

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
          initialSection={initialModalSection} 
        />
      )}

      {configuringChatModelForNode && (
        <ChatModelSelectionModal
          isOpen={!!configuringChatModelForNode}
          onOpenChange={handleChatModelSelectionModalOpenChange}
          onCredentialSelected={handleChatModelCredentialSelectedForNode}
          currentConfiguredProviderId={configuringChatModelForNode.data?.selectedProviderId} 
          currentConfiguredModelId={configuringChatModelForNode.data?.selectedModelId}
          currentConfiguredCredentialId={configuringChatModelForNode.data?.chatModelCredentialId}
        />
      )}
    </div>
  );
}

