
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  FlaskConical,
  Maximize2,
  MessageSquare,
  MessageSquareOff,
  MoreHorizontal,
  Plus,
  RefreshCw,
  RotateCw,
  Send,
  Sparkles,
  Trash2,
  Users,
  X,
  ZoomIn,
  ZoomOut,
  FilePlus2,
  FolderOpen,
  Download,
  Settings,
  LifeBuoy,
  UploadCloud,
  Link,
  Power, 
  Play,  
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import type { Node, Connection } from '@/lib/types';
import AiAgentNode from './AiAgentNode';
import ConnectedChatModelNode from './ConnectedChatModelNode';
import ChatTriggerNode from './ChatTriggerNode';
import TelegramTriggerNode from './TelegramTriggerNode';
import CoinGeckoToolDisplayNode from './CoinGeckoToolDisplayNode';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { v4 as uuidv4 } from 'uuid';


interface CanvasAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  onCreateNewWorkflow: () => void;
  onOpenMyWorkflows: () => void;
  onExplicitSave: () => void;
  onOpenShareModal: () => void;
  onImportFromUrl: () => void;
  onImportFromFile: () => void;
  activeNodes: Node[];
  connections: Connection[];
  drawingLine: { fromNodeId: string; fromConnectorId: string; fromPosition: { x: number; y: number }; toPosition: { x: number; y: number } } | null;
  onNodeDragStart: (nodeId: string, event: React.MouseEvent<HTMLDivElement>) => void;
  draggingNodeId: string | null;
  onNodeDoubleClick: (nodeId: string) => void;
  onNodeConfigureSection?: (nodeId: string, section?: string) => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleMaximize: () => void;
  onToggleWorkflowChatPanel: () => void;
  isWorkflowChatPanelVisible: boolean;
  onToggleAiAssistantPanel: () => void;
  onRedo: () => void;
  onAutoLayout: () => void;
  onStartLineDraw: (nodeId: string, connectorId: string, globalPosition: { x: number, y: number }, event: React.MouseEvent) => void;
  onConnectorMouseUp: (nodeId: string, connectorId: string, connectorType: 'input' | 'output', globalPosition: { x: number, y: number }, event: React.MouseEvent) => void;
  onCanvasMouseMove: (event: React.MouseEvent<HTMLDivElement>) => void;
  onCanvasMouseUp: (event: React.MouseEvent<HTMLDivElement>) => void;
  onCanvasMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDeleteConnection: (connectionId: string) => void;
  onAddNodeOnConnection: (connectionId: string) => void;
  workflowChatMessages: { id: string; text: string; sender: 'user' | 'ai' | 'system' }[];
  onWorkflowChatSend: (message: string) => void;
  isWorkflowAiResponding: boolean;
  processingNodeId: string | null;
  onToggleNodeDisabled: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onMoreNodeOptions: (nodeId: string) => void;
  className?: string;
}

const AI_AGENT_NODE_WIDTH = 256;
const AI_AGENT_NODE_MIN_HEIGHT = 120;
const DIAMOND_ICON_HEIGHT = 12;
const AI_AGENT_CONNECTOR_AREA_HEIGHT = 38;
const SPACING_BELOW_AI_NODE_CONNECTORS = 40;

const CONNECTED_MODEL_NODE_WIDTH = 200;
const CONNECTED_MODEL_NODE_HEIGHT = 60;

const COINGECKO_TOOL_NODE_WIDTH = 200;
const COINGECKO_TOOL_NODE_HEIGHT = 60;

const TRIGGER_NODE_WIDTH = 224;
const TRIGGER_NODE_HEIGHT = 80;


const getConnectorPosition = (node: Node, connectorId: string): { x: number; y: number } | null => {
  if (!node.position) return null;
  const { x, y } = node.position;

  let connectorX = x;
  let connectorY = y;

  switch (node.type) {
    case 'AI_AGENT':
      if (connectorId === 'input-trigger') {
        connectorX = x;
        connectorY = y + AI_AGENT_NODE_MIN_HEIGHT / 2;
      } else if (connectorId === 'output-main') {
        connectorX = x + AI_AGENT_NODE_WIDTH;
        connectorY = y + AI_AGENT_NODE_MIN_HEIGHT / 2;
      } else if (connectorId === 'output-chat-model') {
        // Positioned at the first diamond icon's center below the node
        connectorX = x + (AI_AGENT_NODE_WIDTH / 6); // Approx 1/3 of the way for 3 buttons
        connectorY = y + AI_AGENT_NODE_MIN_HEIGHT + DIAMOND_ICON_HEIGHT / 2 + 4; // 4px is approx spacing for diamond
      } else if (connectorId === 'output-memory') {
        // Positioned at the second diamond icon's center below the node
        connectorX = x + (AI_AGENT_NODE_WIDTH / 2); // Center for 3 buttons
        connectorY = y + AI_AGENT_NODE_MIN_HEIGHT + DIAMOND_ICON_HEIGHT / 2 + 4;
      } else if (connectorId === 'output-tools') {
        // Positioned at the third diamond icon's center below the node
        connectorX = x + (AI_AGENT_NODE_WIDTH * 5/6); // Approx 2/3 of the way for 3 buttons
        connectorY = y + AI_AGENT_NODE_MIN_HEIGHT + DIAMOND_ICON_HEIGHT / 2 + 4;
      } else {
        connectorX = x + AI_AGENT_NODE_WIDTH / 2;
        connectorY = y + AI_AGENT_NODE_MIN_HEIGHT / 2;
      }
      break;
    case 'CHAT_TRIGGER':
    case 'TELEGRAM_TRIGGER':
      if (connectorId === 'output') {
        connectorX = x + TRIGGER_NODE_WIDTH;
        connectorY = y + TRIGGER_NODE_HEIGHT / 2;
      }
      break;
    case 'CONNECTED_CHAT_MODEL':
      if (connectorId === 'input-main') {
        connectorX = x + CONNECTED_MODEL_NODE_WIDTH / 2;
        connectorY = y; // Top-center for input
      }
      break;
    case 'COINGECKO_TOOL_DISPLAY_NODE':
       if (connectorId === 'input-main') {
        connectorX = x + COINGECKO_TOOL_NODE_WIDTH / 2;
        connectorY = y; // Top-center for input
      }
      break;
    default:
      return { x: x + (node.data?.width || 100) / 2, y: y + (node.data?.height || 50) / 2 };
  }
  return { x: connectorX, y: connectorY };
};


const CanvasArea = React.forwardRef<HTMLDivElement, CanvasAreaProps>(({
  workflowName,
  onWorkflowNameChange,
  onCreateNewWorkflow,
  onOpenMyWorkflows,
  onExplicitSave,
  onOpenShareModal,
  onImportFromUrl,
  onImportFromFile,
  activeNodes,
  connections,
  drawingLine,
  onNodeDragStart,
  draggingNodeId,
  onNodeDoubleClick,
  onNodeConfigureSection,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  onToggleMaximize,
  onToggleWorkflowChatPanel,
  isWorkflowChatPanelVisible,
  onToggleAiAssistantPanel,
  onRedo,
  onAutoLayout,
  onStartLineDraw,
  onConnectorMouseUp,
  onCanvasMouseMove,
  onCanvasMouseUp,
  onCanvasMouseDown,
  onDeleteConnection,
  onAddNodeOnConnection,
  workflowChatMessages,
  onWorkflowChatSend,
  isWorkflowAiResponding,
  processingNodeId,
  onToggleNodeDisabled,
  onDeleteNode,
  onMoreNodeOptions,
  className,
  ...props
}, ref) => {
  const [workflowChatInput, setWorkflowChatInput] = useState('');
  const workflowChatScrollAreaRef = useRef<HTMLDivElement>(null);
  const [localWorkflowName, setLocalWorkflowName] = useState(workflowName);
  const [workflowStatusActive, setWorkflowStatusActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'executions'>('editor');


  useEffect(() => {
    setLocalWorkflowName(workflowName);
  }, [workflowName]);

  const handleNameInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalWorkflowName(event.target.value);
  };

  const handleNameInputBlur = () => {
    if (localWorkflowName.trim() && localWorkflowName !== workflowName) {
      onWorkflowNameChange(localWorkflowName.trim());
    } else if (!localWorkflowName.trim() && workflowName) {
       setLocalWorkflowName(workflowName);
    }
  };

  const handleNameInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleNameInputBlur();
      (event.target as HTMLInputElement).blur();
    }
  };

  const handleLocalWorkflowChatSend = () => {
    if (workflowChatInput.trim() && !isWorkflowAiResponding) {
      onWorkflowChatSend(workflowChatInput);
      setWorkflowChatInput('');
    }
  };

  useEffect(() => {
    if (workflowChatScrollAreaRef.current) {
      workflowChatScrollAreaRef.current.scrollTo({ top: workflowChatScrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [workflowChatMessages]);

  const handleTestWorkflowClick = () => {
    if (!isWorkflowChatPanelVisible) {
      onToggleWorkflowChatPanel();
    }
  };

  return (
    <div className={cn("flex h-full flex-col bg-card text-card-foreground", className)} {...props}>
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between p-2 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={onCreateNewWorkflow} aria-label="New Workflow">
                  <FilePlus2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New Workflow</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={onOpenMyWorkflows} aria-label="Open Workflows">
                  <FolderOpen className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Open Workflows</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Input
            value={localWorkflowName}
            onChange={handleNameInputChange}
            onBlur={handleNameInputBlur}
            onKeyPress={handleNameInputKeyPress}
            className="text-lg font-semibold border-transparent focus-visible:border-input h-8 w-auto bg-card text-card-foreground"
            aria-label="Workflow Title"
            placeholder="Workflow Name"
          />
        </div>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'executions')}>
            <TabsList className="bg-muted h-8">
              <TabsTrigger value="editor" className="text-xs px-2 py-1 h-full">Editor</TabsTrigger>
              <TabsTrigger value="executions" className="text-xs px-2 py-1 h-full">Executions</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Label htmlFor="workflow-status" className="text-xs text-muted-foreground">
              {workflowStatusActive ? 'Active' : 'Inactive'}
            </Label>
            <Switch
              id="workflow-status"
              checked={workflowStatusActive}
              onCheckedChange={(checked) => { setWorkflowStatusActive(checked); console.log('Workflow status changed to:', checked); }}
              className="h-5 w-9 data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-slate-300 [&>span]:h-4 [&>span]:w-4 [&>span[data-state=checked]]:translate-x-4 [&>span[data-state=unchecked]]:translate-x-0.5"
            />
          </div>
          <Button variant="outline" size="sm" onClick={onOpenShareModal} className="h-8 text-xs">
            <Users className="mr-1.5 h-3.5 w-3.5" />
            Share
          </Button>
          <Button variant="default" size="sm" onClick={onExplicitSave} className="h-8 text-xs">Save</Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-popover text-popover-foreground">
              <DropdownMenuItem onClick={() => console.log('Duplicate workflow clicked')}>
                <FilePlus2 className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Download workflow clicked')}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onImportFromUrl}>
                <Link className="mr-2 h-4 w-4" />
                Import from URL...
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onImportFromFile}>
                <UploadCloud className="mr-2 h-4 w-4" />
                Import from File...
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Push to Git clicked')}>
                Push to Git
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log('Workflow settings clicked')}>
                <Settings className="mr-2 h-4 w-4" />
                Workflow Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Help clicked')}>
                <LifeBuoy className="mr-2 h-4 w-4" />
                Help & Documentation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Viewport for canvas and overlay buttons */}
      <div
        className="flex-grow relative overflow-auto cursor-grab bg-zinc-800"
        ref={ref}
        onMouseMove={onCanvasMouseMove}
        onMouseUp={onCanvasMouseUp}
      >
      {activeTab === 'editor' && (
        <>
          {/* Scalable Container */}
          <div
            className="relative p-4 bg-zinc-800" 
            style={{
              transformOrigin: '0 0', 
              transform: `scale(${zoomLevel})`,
              width: '10000px', 
              height: '10000px', 
            }}
            data-canvas-area="true"
            data-ai-hint="workflow background"
            onMouseDown={onCanvasMouseDown}
          >
            <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
              <defs>
                <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="rgba(255, 255, 255, 0.2)" />
                </pattern>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
                  <polygon points="0 0, 10 3.5, 0 7" fill="rgba(156, 163, 175, 0.7)" />
                </marker>
              </defs>
              <rect width="100%" height="100%" fill="url(#dotGrid)" />

              {Array.isArray(connections) && connections.map((conn) => {
                const fromNode = activeNodes.find(n => n.id === conn.fromNodeId);
                const toNode = activeNodes.find(n => n.id === conn.toNodeId);
                if (!fromNode || !toNode) return null;
                const startPos = getConnectorPosition(fromNode, conn.fromConnectorId);
                const endPos = getConnectorPosition(toNode, conn.toConnectorId);
                if (!startPos || !endPos) return null;

                let strokeColor = "rgba(156, 163, 175, 0.7)"; // Default gray
                let strokeDash = undefined;

                if (conn.fromConnectorId === 'output-chat-model' || (conn.toConnectorId === 'input-main' && toNode.type === 'CONNECTED_CHAT_MODEL')) {
                    strokeColor = "rgba(59, 130, 246, 0.7)"; // Blue for chat model connections
                    strokeDash = "5,5";
                } else if (conn.fromConnectorId === 'output-tools' || (conn.toConnectorId === 'input-main' && toNode.type === 'COINGECKO_TOOL_DISPLAY_NODE')) {
                    strokeColor = "rgba(34, 197, 94, 0.7)"; // Green for tool connections
                    strokeDash = "5,5";
                } else if ((fromNode.type === 'CHAT_TRIGGER' || fromNode.type === 'TELEGRAM_TRIGGER') && toNode.type === 'AI_AGENT') {
                    strokeColor = "rgba(239, 68, 68, 0.8)"; // Red for trigger to agent
                }


                return (
                  <line
                    key={conn.id}
                    x1={startPos.x} y1={startPos.y}
                    x2={endPos.x} y2={endPos.y}
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    markerEnd="url(#arrowhead)"
                    strokeDasharray={strokeDash}
                  />
                );
              })}


              {drawingLine && (
                <line
                  x1={drawingLine.fromPosition.x} y1={drawingLine.fromPosition.y}
                  x2={drawingLine.toPosition.x} y2={drawingLine.toPosition.y}
                  stroke="rgba(250, 204, 21, 0.8)" strokeWidth="2.5" strokeDasharray="4,4" markerEnd="url(#arrowhead)"
                />
              )}
            </svg>

            {/* Render Nodes */}
            {activeNodes.map((node) => {
              if (node.type === 'AI_AGENT') {
                return (
                  <AiAgentNode
                    key={node.id} id={node.id} name={node.name} data={node.data} position={node.position}
                    onMouseDown={(e) => onNodeDragStart(node.id, e)} isDragging={node.id === draggingNodeId}
                    onNodeDoubleClick={() => onNodeDoubleClick(node.id)} onOpenConfiguration={onNodeConfigureSection}
                    onStartLineDraw={onStartLineDraw} onConnectorMouseUp={onConnectorMouseUp}
                    isProcessing={node.id === processingNodeId}
                    onToggleDisabled={onToggleNodeDisabled}
                    onDeleteNode={onDeleteNode}
                    onMoreOptions={onMoreNodeOptions}
                  />
                );
              } else if (node.type === 'CONNECTED_CHAT_MODEL' && node.data && node.position) {
                return (
                  <ConnectedChatModelNode
                    key={node.id} id={node.id} nodeData={node.data} position={node.position}
                    onMouseDown={(e) => onNodeDragStart(node.id, e)} onDoubleClick={() => onNodeDoubleClick(node.id)}
                    isDragging={node.id === draggingNodeId}
                  />
                );
              } else if (node.type === 'COINGECKO_TOOL_DISPLAY_NODE' && node.data && node.position) {
                return (
                  <CoinGeckoToolDisplayNode
                    key={node.id} id={node.id} nodeData={node.data} position={node.position}
                    onMouseDown={(e) => onNodeDragStart(node.id, e)}
                    isDragging={node.id === draggingNodeId}
                  />
                );
              } else if (node.type === 'CHAT_TRIGGER' && node.position) {
                return (
                  <ChatTriggerNode
                    key={node.id} id={node.id} name={node.name} data={node.data} position={node.position}
                    onMouseDown={(e) => onNodeDragStart(node.id, e)} isDragging={node.id === draggingNodeId}
                    onStartLineDraw={onStartLineDraw} onConnectorMouseUp={onConnectorMouseUp}
                    onToggleDisabled={onToggleNodeDisabled}
                    onDeleteNode={onDeleteNode}
                    onMoreOptions={onMoreNodeOptions}
                  />
                );
              } else if (node.type === 'TELEGRAM_TRIGGER' && node.position) {
                return (
                  <TelegramTriggerNode
                    key={node.id} id={node.id} name={node.name} data={node.data} position={node.position}
                    onMouseDown={(e) => onNodeDragStart(node.id, e)} isDragging={node.id === draggingNodeId}
                    onNodeDoubleClick={() => onNodeDoubleClick(node.id)}
                    onStartLineDraw={onStartLineDraw} onConnectorMouseUp={onConnectorMouseUp}
                    onToggleDisabled={onToggleNodeDisabled}
                    onDeleteNode={onDeleteNode}
                    onMoreOptions={onMoreNodeOptions}
                  />
                );
              }
              return null;
            })}

            {/* Render Connection Action Buttons */}
            {Array.isArray(connections) && connections.map((conn) => {
              const fromNode = activeNodes.find(n => n.id === conn.fromNodeId);
              const toNode = activeNodes.find(n => n.id === conn.toNodeId);
              if (!fromNode || !toNode) return null;
              if (fromNode.type === 'CONNECTED_CHAT_MODEL' || toNode.type === 'CONNECTED_CHAT_MODEL' ||
                  fromNode.type === 'COINGECKO_TOOL_DISPLAY_NODE' || toNode.type === 'COINGECKO_TOOL_DISPLAY_NODE') {
                return null;
              }


              const startPos = getConnectorPosition(fromNode, conn.fromConnectorId);
              const endPos = getConnectorPosition(toNode, conn.toConnectorId);
              if (!startPos || !endPos) return null;

              const midX = (startPos.x + endPos.x) / 2;
              const midY = (startPos.y + endPos.y) / 2;

              return (
                <div
                  key={`actions-${conn.id}`}
                  className="absolute flex gap-1 bg-background/80 p-1 rounded-md shadow-md"
                  style={{
                    left: `${midX}px`,
                    top: `${midY}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10
                  }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 bg-card hover:bg-muted"
                          onClick={() => onAddNodeOnConnection(conn.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add node on connection</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onDeleteConnection(conn.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete connection</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              );
            })}
          </div>
        </>
      )}
      {activeTab === 'executions' && (
        <div className="flex items-center justify-center h-full bg-zinc-800 text-white">
          <p>Executions history and logs will appear here.</p>
        </div>
      )}
        {/* AI Assistant Toggle Button - Statically positioned relative to this viewport */}
        {activeTab === 'editor' && (
            <Button
                variant="outline"
                size="icon"
                className="absolute bottom-16 right-4 z-20 bg-card hover:bg-muted shadow-md h-9 w-9"
                onClick={onToggleAiAssistantPanel}
                aria-label="Toggle AI Assistant"
            >
                <Sparkles className="h-5 w-5" />
            </Button>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="flex items-center justify-between p-1.5 border-t border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" aria-label="Close Workflow Chat Panel" onClick={onToggleWorkflowChatPanel} className="h-9 w-9"><X className="h-5 w-5 text-muted-foreground" /></Button>
          <Button variant="ghost" size="icon" aria-label="Toggle Maximize Palette" onClick={onToggleMaximize} className="h-9 w-9"><Maximize2 className="h-5 w-5 text-muted-foreground" /></Button>
          <Button variant="ghost" size="icon" aria-label="Zoom In" onClick={onZoomIn} className="h-9 w-9"><ZoomIn className="h-5 w-5 text-muted-foreground" /></Button>
          <Button variant="ghost" size="icon" aria-label="Zoom Out" onClick={onZoomOut} className="h-9 w-9"><ZoomOut className="h-5 w-5 text-muted-foreground" /></Button>
          <Button variant="ghost" size="icon" aria-label="Redo" onClick={onRedo} className="h-9 w-9"><RotateCw className="h-5 w-5 text-muted-foreground" /></Button>
          <Button variant="ghost" size="icon" aria-label="Auto-layout" onClick={onAutoLayout} className="h-9 w-9"><Sparkles className="h-5 w-5 text-muted-foreground" /></Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="default" size="sm" onClick={handleTestWorkflowClick} className="h-8 text-xs">
            <FlaskConical className="mr-1.5 h-4 w-4" /> Test workflow
          </Button>
          <Button variant="outline" size="sm" onClick={onToggleWorkflowChatPanel} className="h-8 text-xs">
            {isWorkflowChatPanelVisible ? <MessageSquareOff className="mr-1.5 h-4 w-4" /> : <MessageSquare className="mr-1.5 h-4" />}
            {isWorkflowChatPanelVisible ? "Hide chat" : "Show chat"}
          </Button>
          <Button variant="destructive" size="icon" className="h-8 w-8" aria-label="Delete workflow">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Workflow Chat Panel */}
      {isWorkflowChatPanelVisible && (
        <div className="bg-card text-card-foreground border-t border-border p-4 flex flex-col h-[200px] flex-shrink-0">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Workflow Chat</span>
              <span className="text-muted-foreground text-xs">Session {uuidv4().substring(0,8)}</span>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground" aria-label="Refresh chat session">
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground" aria-label="Close workflow chat panel" onClick={onToggleWorkflowChatPanel}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-grow mb-2 bg-background rounded-md p-2" ref={workflowChatScrollAreaRef}>
            {workflowChatMessages.map(msg => (
              <div key={msg.id} className={`mb-2 p-2 rounded-md max-w-[80%] text-sm ${
                msg.sender === 'user' ? 'bg-primary text-primary-foreground ml-auto' :
                msg.sender === 'ai' ? 'bg-secondary text-secondary-foreground mr-auto' :
                'bg-muted text-muted-foreground text-center mx-auto w-full'
              }`}>
                {msg.text}
              </div>
            ))}
            {isWorkflowAiResponding && (
                 <div className="mb-2 p-2 rounded-md max-w-[80%] text-sm bg-secondary text-secondary-foreground mr-auto animate-pulse">
                    AI is thinking...
                 </div>
            )}
            {workflowChatMessages.length === 0 && !isWorkflowAiResponding && (
              <p className="text-sm text-muted-foreground text-center py-4">No messages yet. Start typing below!</p>
            )}
          </ScrollArea>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Input
              type="text"
              placeholder="Type a message for the workflow..."
              className="flex-grow bg-input border-border placeholder-muted-foreground focus:ring-primary focus:border-primary text-foreground h-9"
              value={workflowChatInput}
              onChange={(e) => setWorkflowChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLocalWorkflowChatSend()}
              disabled={isWorkflowAiResponding}
            />
            <Button variant="default" size="icon" onClick={handleLocalWorkflowChatSend} className="bg-primary hover:bg-primary/90 h-9 w-9" disabled={isWorkflowAiResponding}>
              {isWorkflowAiResponding ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
CanvasArea.displayName = "CanvasArea";

export default CanvasArea;

    
