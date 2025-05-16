
'use client';

import type React from 'react';
import { Server, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { NodeData } from '@/lib/types';
import { llmProviders } from '@/lib/llmProviders';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface ConnectedChatModelNodeProps {
  id: string;
  nodeData: NodeData; 
  position: { x: number; y: number };
  onMouseDown?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isDragging?: boolean;
}

export default function ConnectedChatModelNode({
  id,
  nodeData,
  position,
  onMouseDown,
  onDoubleClick,
  isDragging,
}: ConnectedChatModelNodeProps) {
  const { modelName, providerId, status, validationError } = nodeData;
  
  const provider = llmProviders.find(p => p.id === providerId);
  const ProviderIcon = provider ? provider.icon : Server; // Fallback icon
  const providerName = provider ? provider.name : 'Unknown Provider';

  const getStatusIndicator = () => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <XCircle className="h-4 w-4 text-red-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-destructive-foreground bg-destructive p-2 rounded-md">
                  {validationError || 'Connection Error'}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      case 'unchecked':
      default:
         return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertTriangle className="h-4 w-4 text-yellow-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Status: Unchecked. Click to configure and verify.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
    }
  };

  return (
    <div
      id={id}
      className="absolute bg-slate-600 text-white rounded-md shadow-lg border border-slate-500 w-50 min-h-[60px] p-2 flex items-center space-x-2 select-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '200px', // Consistent width
        cursor: isDragging ? 'grabbing' : (onMouseDown ? (onDoubleClick ? 'pointer' : 'grab') : (onDoubleClick ? 'pointer' : 'default')),
        userSelect: 'none',
        zIndex: isDragging ? 1001 : 2, 
      }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      <ProviderIcon className="h-6 w-6 text-slate-300 flex-shrink-0" />
      <div className="flex-grow overflow-hidden">
        <p className="text-xs font-semibold truncate" title={modelName}>{modelName || 'Unknown Model'}</p>
        <p className="text-xs text-slate-400 truncate" title={providerName}>{providerName}</p>
      </div>
      <div className="flex-shrink-0">{getStatusIndicator()}</div>
    </div>
  );
}
