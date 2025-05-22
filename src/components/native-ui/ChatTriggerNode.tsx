
'use client';
import type React from 'react';
import { MessageSquare, Power, Trash2, MoreHorizontal, Play } from 'lucide-react';
import type { NodeData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TriggerNodeProps {
  id: string;
  name: string;
  data?: NodeData;
  position?: { x: number; y: number };
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  onNodeDoubleClick?: (nodeId: string) => void;
  onStartLineDraw?: (nodeId: string, connectorId: string, globalPosition: { x: number; y: number }, event: React.MouseEvent) => void;
  onConnectorMouseUp?: (nodeId: string, connectorId: string, connectorType: 'input' | 'output', globalPosition: { x: number; y: number }, event: React.MouseEvent) => void;
  onToggleDisabled: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onMoreOptions: (nodeId: string) => void;
}

const CONNECTOR_SIZE = 12;
const CONNECTOR_OFFSET_X = CONNECTOR_SIZE / 2;
const NODE_WIDTH = 224; // w-56
const NODE_HEIGHT = 80; // min-h-[80px]

export default function ChatTriggerNode({
    id,
    name,
    data,
    position,
    onMouseDown,
    isDragging,
    onNodeDoubleClick,
    onStartLineDraw,
    onConnectorMouseUp,
    onToggleDisabled,
    onDeleteNode,
    onMoreOptions,
}: TriggerNodeProps) {
  const title = data?.title || name || 'Chat Trigger';
  const isDisabled = data?.isDisabled ?? false;

  const handleDoubleClick = () => {
    if (onNodeDoubleClick) {
        console.log(`Chat Trigger Node ${id} double-clicked. No modal configured yet.`);
    }
  };

  const handleConnectorMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onStartLineDraw && position) {
      const connectorX = position.x + NODE_WIDTH;
      const connectorY = position.y + NODE_HEIGHT / 2;
      onStartLineDraw(id, 'output', { x: connectorX, y: connectorY }, event);
    }
  };

  const handleConnectorMouseUpEvent = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onConnectorMouseUp && position) {
      const connectorX = position.x + NODE_WIDTH;
      const connectorY = position.y + NODE_HEIGHT / 2;
      onConnectorMouseUp(id, 'output', 'output', { x: connectorX, y: connectorY }, event);
    }
  };

  const baseClass = "relative bg-sky-600 text-white rounded-lg shadow-md border w-56 min-h-[80px] p-3 flex flex-col select-none";
  const borderClass = isDisabled ? 'border-slate-500' : 'border-sky-500';

  return (
    <div
      className={cn(
        baseClass,
        borderClass,
        { 'opacity-60': isDisabled }
      )}
      style={{
        position: 'absolute',
        left: `${position?.x || 0}px`,
        top: `${position?.y || 0}px`,
        cursor: isDragging ? 'grabbing' : (onMouseDown ? 'grab' : 'default'),
        userSelect: 'none',
        zIndex: isDragging ? 1000 : 1,
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={handleDoubleClick}
      data-node-id={id} // Add node ID for canvas drop target detection
    >
      {/* Output Connector (Right) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 bg-slate-200 rounded-full border-2 border-slate-400 hover:border-slate-500 hover:bg-slate-300"
        style={{
            right: `-${CONNECTOR_OFFSET_X}px`,
            width: `${CONNECTOR_SIZE}px`,
            height: `${CONNECTOR_SIZE}px`,
            cursor: 'crosshair',
        }}
        title="Output Connector (Drag to connect)"
        data-node-id={id} // Important for event target identification
        data-connector-id="output"
        data-connector-type="output"
        onMouseDown={handleConnectorMouseDown}
        onMouseUp={handleConnectorMouseUpEvent}
      />

      <div className="flex items-start justify-between mb-auto">
        <div className="flex items-center space-x-2 flex-grow"> {/* mb-auto pushes content to top */}
          <MessageSquare className={cn("h-6 w-6 text-sky-200 flex-shrink-0", {'text-slate-400': isDisabled})} />
          <div className="overflow-hidden">
            <p className="font-semibold text-sm truncate" title={title}>{title}</p>
          </div>
        </div>
        <div className="flex items-center space-x-0.5 flex-shrink-0 ml-1">
           <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 text-sky-200 hover:text-white hover:bg-sky-500" onClick={(e) => { e.stopPropagation(); console.log('Play node ' + id); }} aria-label="Play Node" data-interactive="true">
            <Play className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 text-sky-200 hover:text-white hover:bg-sky-500" onClick={(e) => { e.stopPropagation(); onToggleDisabled(id); }} aria-label={isDisabled ? "Activate Node" : "Deactivate Node"} data-interactive="true">
            <Power className={cn("h-3 w-3", isDisabled ? "text-red-400" : "text-green-400")} />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 text-sky-200 hover:text-destructive hover:bg-sky-500" onClick={(e) => { e.stopPropagation(); onDeleteNode(id); }} aria-label="Delete Node" data-interactive="true">
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0.5 text-sky-200 hover:text-white hover:bg-sky-500" onClick={(e) => { e.stopPropagation(); onMoreOptions(id); }} aria-label="More Options" data-interactive="true">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
