
'use client';

import type React from 'react';
import { DollarSign } from 'lucide-react';
import type { NodeData } from '@/lib/types';

interface CoinGeckoToolDisplayNodeProps {
  id: string;
  nodeData: NodeData; 
  position: { x: number; y: number };
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
  // No onDoubleClick needed for this simple display node yet
}

const CONNECTOR_SIZE = 12;
const NODE_WIDTH = 200;
const NODE_HEIGHT = 60;

export default function CoinGeckoToolDisplayNode({
  id,
  nodeData,
  position,
  onMouseDown,
  isDragging,
}: CoinGeckoToolDisplayNodeProps) {
  const toolName = nodeData?.title || 'CoinGecko API';

  // Input Connector (Top-Center)
  // This node will only have an input from the AI Agent
  // No onStartLineDraw or onConnectorMouseUp from this node for now

  return (
    <div
      id={id}
      className="absolute bg-green-700 text-white rounded-md shadow-lg border border-green-600 w-50 min-h-[60px] p-2 flex items-center space-x-2 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${NODE_WIDTH}px`,
        height: `${NODE_HEIGHT}px`,
        cursor: isDragging ? 'grabbing' : (onMouseDown ? 'grab' : 'default'),
        userSelect: 'none',
        zIndex: isDragging ? 1001 : 2, 
      }}
      onMouseDown={onMouseDown}
      data-node-id={id} // For drop target detection
    >
      {/* Input Connector (Top) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 bg-slate-200 rounded-full border-2 border-slate-400 hover:border-slate-500 hover:bg-slate-300"
        style={{
            top: `-${CONNECTOR_SIZE / 2}px`,
            width: `${CONNECTOR_SIZE}px`,
            height: `${CONNECTOR_SIZE}px`,
            cursor: 'crosshair', // Indicates it can receive a connection
        }}
        title="Input from AI Agent Tool Output"
        data-node-id={id}
        data-connector-id="input-main" // Standard input connector ID
        data-connector-type="input"
        // MouseUp here would be handled by onCanvasMouseUp if a line is dropped on it
      />

      <DollarSign className="h-6 w-6 text-green-300 flex-shrink-0" />
      <div className="flex-grow overflow-hidden">
        <p className="text-sm font-semibold truncate" title={toolName}>{toolName}</p>
        <p className="text-xs text-green-400">Tool</p>
      </div>
    </div>
  );
}
