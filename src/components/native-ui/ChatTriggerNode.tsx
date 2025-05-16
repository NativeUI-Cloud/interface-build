
'use client';
import type React from 'react';
import { MessageSquare } from 'lucide-react';
import type { NodeData } from '@/lib/types';

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
}: TriggerNodeProps) {
  const title = data?.title || name || 'Chat Trigger';

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

  return (
    <div
      className="relative bg-sky-600 text-white rounded-lg shadow-md border border-sky-500 w-56 min-h-[80px] p-3 flex flex-col select-none"
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

      <div className="flex items-center space-x-2 mb-auto"> {/* mb-auto pushes content to top */}
        <MessageSquare className="h-6 w-6 text-sky-200 flex-shrink-0" />
        <div className="overflow-hidden">
          <p className="font-semibold text-sm truncate" title={title}>{title}</p>
        </div>
      </div>
    </div>
  );
}
