
'use client';

import type React from 'react'; // For MouseEvent type
import { Bot, AlertTriangle, Plus, Settings2, SlidersHorizontal, Database, Wrench, Power, Trash2, MoreHorizontal, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NodeData } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AiAgentNodeProps {
  id: string;
  name: string;
  data?: NodeData;
  position?: { x: number; y: number };
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  onNodeDoubleClick?: (nodeId: string) => void;
  onOpenConfiguration?: (nodeId: string, initialSection?: string) => void;
  onStartLineDraw?: (nodeId: string, connectorId: string, globalPosition: { x: number; y: number }, event: React.MouseEvent) => void;
  onConnectorMouseUp?: (nodeId: string, connectorId: string, connectorType: 'input' | 'output', globalPosition: { x: number; y: number }, event: React.MouseEvent) => void;
  isProcessing?: boolean;
  onToggleDisabled: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onMoreOptions: (nodeId: string) => void;
}

const DiamondIcon = ({isConnected}: {isConnected?: boolean}) => (
  <svg width="12" height="12" viewBox="0 0 10 10" fill="currentColor" className={isConnected ? "text-green-500" : "text-slate-500"}>
    <path d="M5 0 L10 5 L5 10 L0 5 Z" />
  </svg>
);

const CONNECTOR_SIZE = 12;
const CONNECTOR_OFFSET_X = CONNECTOR_SIZE / 2;
const NODE_WIDTH = 256; // w-64
const NODE_MIN_HEIGHT = 120; // min-h-[120px]


export default function AiAgentNode({
    id,
    name,
    data,
    position,
    onMouseDown,
    isDragging,
    onNodeDoubleClick,
    onOpenConfiguration,
    onStartLineDraw,
    onConnectorMouseUp,
    isProcessing,
    onToggleDisabled,
    onDeleteNode,
    onMoreOptions,
}: AiAgentNodeProps) {
  const title = data?.title || name || 'AI Agent';
  const subTitle = data?.subTitle || 'Tools Agent';
  const isChatModelConnected = !!data?.selectedModelId;
  const isChatModelConfigValid = data?.selectedModelId && data.chatModelCredentialStatus === 'valid';
  const showWarning = !data?.selectedModelId || data?.chatModelCredentialStatus === 'invalid' || data?.chatModelCredentialStatus === 'unchecked';
  const isMemoryConfigured = !!data?.memoryType;
  const areToolsConfigured = !!data?.tools && data.tools.length > 0;
  const isDisabled = data?.isDisabled ?? false;


  const handleDoubleClick = () => {
    if (!isDragging && onNodeDoubleClick) {
      onNodeDoubleClick(id);
    }
  };

  const handleConnectorMouseDown = (connectorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onStartLineDraw && position) {
      let connectorX = 0;
      let connectorY = 0;
      if (connectorId === 'input-trigger') {
        connectorX = position.x;
        connectorY = position.y + NODE_MIN_HEIGHT / 2;
      } else if (connectorId === 'output-main') {
        connectorX = position.x + NODE_WIDTH;
        connectorY = position.y + NODE_MIN_HEIGHT / 2;
      }
      onStartLineDraw(id, connectorId, { x: connectorX, y: connectorY }, event);
    }
  };

  const handleConnectorMouseUpEvent = (connectorId: string, connectorType: 'input' | 'output', event: React.MouseEvent) => {
    event.stopPropagation();
    if (onConnectorMouseUp && position) {
        let connectorX = 0;
        let connectorY = 0;
         if (connectorId === 'input-trigger') {
          connectorX = position.x;
          connectorY = position.y + NODE_MIN_HEIGHT / 2;
        } else if (connectorId === 'output-main') {
          connectorX = position.x + NODE_WIDTH;
          connectorY = position.y + NODE_MIN_HEIGHT / 2;
        }
      onConnectorMouseUp(id, connectorId, connectorType, { x: connectorX, y: connectorY }, event);
    }
  };

  const borderClass = isProcessing
    ? 'border-yellow-400 animate-pulse'
    : (isDisabled ? 'border-slate-500' : (showWarning ? 'border-red-500' : 'border-green-500'));

  return (
    <div
      className={cn(
        "relative bg-slate-700 text-white rounded-lg shadow-xl border-2 w-64 min-h-[120px] p-3 flex flex-col select-none",
        borderClass,
        { 'opacity-60': isDisabled }
      )}
      style={{
        position: 'absolute',
        left: `${position?.x || 0}px`,
        top: `${position?.y || 0}px`,
        cursor: isDragging ? 'grabbing' : (onNodeDoubleClick || onOpenConfiguration ? 'pointer' : 'grab'),
        userSelect: 'none',
        zIndex: isDragging ? 1000 : (isProcessing ? 100 : 1),
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={handleDoubleClick}
      data-node-id={id}
    >
      {/* Input Connector for Triggers (Left) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 bg-slate-200 rounded-full border-2 border-slate-400 hover:border-slate-500 hover:bg-slate-300"
        style={{
            left: `-${CONNECTOR_OFFSET_X}px`,
            width: `${CONNECTOR_SIZE}px`,
            height: `${CONNECTOR_SIZE}px`,
            cursor: 'crosshair',
        }}
        title="Input for Triggers (Drag to connect)"
        data-node-id={id}
        data-connector-id="input-trigger"
        data-connector-type="input"
        onMouseDown={(e) => handleConnectorMouseDown('input-trigger', e)}
        onMouseUp={(e) => handleConnectorMouseUpEvent('input-trigger', 'input', e)}
      />

      {/* Main Output Connector (Right) */}
       <div
        className="absolute top-1/2 -translate-y-1/2 bg-slate-200 rounded-full border-2 border-slate-400 hover:border-slate-500 hover:bg-slate-300"
        style={{
            right: `-${CONNECTOR_OFFSET_X}px`,
            width: `${CONNECTOR_SIZE}px`,
            height: `${CONNECTOR_SIZE}px`,
            cursor: 'crosshair',
        }}
        title="Main Output (Drag to connect)"
        data-node-id={id}
        data-connector-id="output-main"
        data-connector-type="output"
        onMouseDown={(e) => handleConnectorMouseDown('output-main', e)}
        onMouseUp={(e) => handleConnectorMouseUpEvent('output-main', 'output', e)}
      />

      {/* Header & Node Controls */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center space-x-2 flex-grow">
          <Bot className={cn(`h-6 w-6`, isProcessing ? 'text-yellow-300 animate-pulse' : (showWarning ? 'text-red-400' : 'text-green-400'), {'text-slate-400': isDisabled})} />
          <div>
            <p className="font-semibold text-sm">{title}</p>
            <p className="text-xs text-slate-300">{subTitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-0.5 flex-shrink-0 ml-1">
           <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 text-slate-300 hover:text-white hover:bg-slate-600" onClick={(e) => { e.stopPropagation(); console.log('Play node ' + id); }} aria-label="Play Node" data-interactive="true">
            <Play className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 text-slate-300 hover:text-white hover:bg-slate-600" onClick={(e) => { e.stopPropagation(); onToggleDisabled(id); }} aria-label={isDisabled ? "Activate Node" : "Deactivate Node"} data-interactive="true">
            <Power className={cn("h-3 w-3", isDisabled ? "text-red-400" : "text-green-400")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 text-slate-300 hover:text-destructive hover:bg-slate-600" onClick={(e) => { e.stopPropagation(); onDeleteNode(id); }} aria-label="Delete Node" data-interactive="true">
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 text-slate-300 hover:text-white hover:bg-slate-600" onClick={(e) => { e.stopPropagation(); onMoreOptions(id); }} aria-label="More Options" data-interactive="true">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>
      {showWarning && !isProcessing && !isDisabled && <AlertTriangle className="absolute top-3 right-3 h-5 w-5 text-red-500" />}


      {/* Processing Text */}
      {isProcessing && (
        <div className="text-center text-xs text-yellow-300 py-1">
          Processing...
        </div>
      )}

      <div className="flex-grow" />

      {/* Bottom Connectors for Tools, Memory etc. */}
      <div className="absolute bottom-[-38px] left-0 right-0 flex justify-around items-start px-2">
        {[
          { label: 'Chat Model*', section: 'chatModel', isConnected: isChatModelConfigValid, Icon: isChatModelConfigValid ? SlidersHorizontal : Plus },
          { label: 'Memory', section: 'memory', isConnected: isMemoryConfigured, Icon: isMemoryConfigured ? Database : Plus },
          { label: 'Tool', section: 'tools', isConnected: areToolsConfigured, Icon: areToolsConfigured ? Wrench : Plus },
        ].map((item, index) => {
          const handleSpecialConnectorClick = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (onOpenConfiguration) {
              onOpenConfiguration(id, item.section);
            } else {
              console.log(`${item.label} configuration button clicked on node ${id}`);
            }
          };

          return (
            <div key={index} className="flex flex-col items-center space-y-0.5">
              <DiamondIcon isConnected={item.isConnected} />
              <div className="w-px h-2 bg-slate-500" />
              <Button
                variant="outline"
                size="icon"
                className={`h-5 w-5 bg-slate-600 border-slate-500 hover:bg-slate-500 text-white p-0.5 ${item.isConnected ? 'border-green-500' : ''}`}
                onClick={handleSpecialConnectorClick}
                aria-label={item.isConnected ? `Configure ${item.label}`: `Add ${item.label}`}
                data-interactive="true"
              >
                <item.Icon className="h-3 w-3" />
              </Button>
              <span className="text-xs text-slate-400 mt-0.5 whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
