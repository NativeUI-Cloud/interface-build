
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  // DialogDescription, // Will be part of tabs now
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // New import
import { Switch } from "@/components/ui/switch"; // New import
import { DollarSign, HelpCircle, ExternalLink, Settings, FileText, Sparkles } from 'lucide-react';
import type { Node, CoinGeckoToolConfig, AnyToolConfig } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface CoinGeckoToolModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  agentNode: Node | null; 
  toolConfig?: CoinGeckoToolConfig; 
  onSave: (agentNodeId: string, toolConfig: AnyToolConfig) => void;
}

const resources = [
  { value: 'coin', label: 'Coin' },
  { value: 'coins_list', label: 'Coins List (All Coins)' },
  { value: 'contract', label: 'Contract Address (Token)' },
  { value: 'asset_platforms', label: 'Asset Platforms' },
  { value: 'categories', label: 'Categories' },
  { value: 'exchanges', label: 'Exchanges' },
  { value: 'indexes', label: 'Indexes' },
  { value: 'derivatives', label: 'Derivatives' },
  { value: 'global', label: 'Global Data' },
  { value: 'companies', label: 'Companies (Public Treasury)' },
];

// Operations per resource - simplified
const coinOperations = [
  { value: 'get_details', label: 'Get Coin Details' },
  { value: 'market_chart', label: 'Get Market Chart' },
  { value: 'history', label: 'Get Historical Data' },
  { value: 'tickers', label: 'Get Tickers' },
  { value: 'get_many', label: 'Get Many (List)' }, // Added as per image
];

const listOperations = [
    {value: 'get_all', label: 'Get All'}
];

const contractOperations = [
    { value: 'get_token_details', label: 'Get Token Details by Contract Address'},
    { value: 'market_chart_from_contract', label: 'Get Market Chart from Contract Address'}
];


export default function CoinGeckoToolModal({
  isOpen,
  onOpenChange,
  agentNode,
  toolConfig,
  onSave,
}: CoinGeckoToolModalProps) {
  const [toolDescription, setToolDescription] = useState<'set_automatically' | 'custom'>(toolConfig?.toolDescription || 'set_automatically');
  const [resource, setResource] = useState(toolConfig?.resource || 'coin');
  const [operation, setOperation] = useState(toolConfig?.operation || 'get_details');
  const [coinId, setCoinId] = useState(toolConfig?.coinId || '');
  const [returnAll, setReturnAll] = useState(toolConfig?.returnAll || false);
  const [limit, setLimit] = useState(toolConfig?.limit || 100);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setToolDescription(toolConfig?.toolDescription || 'set_automatically');
      setResource(toolConfig?.resource || 'coin');
      setOperation(toolConfig?.operation || (toolConfig?.resource === 'coin' ? 'get_many' : 'get_all'));
      setCoinId(toolConfig?.coinId || '');
      setReturnAll(toolConfig?.returnAll || false);
      setLimit(toolConfig?.limit === undefined ? 100 : toolConfig.limit);
    }
  }, [isOpen, toolConfig]);

  const handleSave = () => {
    if (!agentNode) {
      toast({ title: "Error", description: "No agent node specified for this tool.", variant: "destructive" });
      return;
    }
    if (!resource || !operation) {
      toast({ title: "Validation Error", description: "Resource and Operation are required.", variant: "destructive" });
      return;
    }
    const requiresCoinId = resource === 'coin' && ['get_details', 'market_chart', 'history', 'tickers'].includes(operation);
    if (requiresCoinId && !coinId.trim()) {
        toast({ title: "Validation Error", description: "Coin ID is required for this operation.", variant: "destructive" });
        return;
    }

    const newToolConfig: CoinGeckoToolConfig = {
      id: toolConfig?.id || `tool-${uuidv4()}`, 
      type: 'COINGECKO',
      toolDescription,
      resource,
      operation,
      coinId: requiresCoinId ? coinId.trim() : undefined,
      returnAll,
      limit: !returnAll ? limit : undefined,
    };
    onSave(agentNode.id, newToolConfig);
    onOpenChange(false);
  };

  const getOperationsForResource = () => {
    switch (resource) {
      case 'coin':
        return coinOperations;
      case 'contract':
        return contractOperations;
      case 'coins_list':
      case 'asset_platforms':
      case 'categories':
      case 'exchanges':
      case 'indexes':
      case 'derivatives':
      case 'global':
      case 'companies':
        return listOperations;
      default:
        return [{value: 'get_all', label: 'Get All (Default)'}];
    }
  };
  
  const currentOperations = getOperationsForResource();

   useEffect(() => {
    if (!currentOperations.find(op => op.value === operation)) {
      setOperation(currentOperations[0]?.value || '');
    }
  }, [resource, currentOperations, operation]);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-foreground p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-green-500" />
            <DialogTitle className="text-xl">CoinGecko</DialogTitle>
          </div>
        </DialogHeader>

        <Tabs defaultValue="parameters" className="w-full">
          <TabsList className="grid w-full grid-cols-3 px-6 border-b">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
          </TabsList>

          <div className="p-6 max-h-[60vh] overflow-y-auto">
            <TabsContent value="parameters" className="mt-0 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="toolDescription">Tool Description</Label>
                <Select value={toolDescription} onValueChange={(value) => setToolDescription(value as 'set_automatically' | 'custom')}>
                  <SelectTrigger id="toolDescription" className="bg-background">
                    <SelectValue placeholder="Select description type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="set_automatically">Set Automatically</SelectItem>
                    <SelectItem value="custom">Custom Description</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="resource">Resource</Label>
                <Select value={resource} onValueChange={setResource}>
                  <SelectTrigger id="resource" className="bg-background">
                    <SelectValue placeholder="Select resource" />
                  </SelectTrigger>
                  <SelectContent>
                    {resources.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="operation">Operation</Label>
                <Select value={operation} onValueChange={setOperation}>
                  <SelectTrigger id="operation" className="bg-background">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentOperations.map(op => <SelectItem key={op.value} value={op.value}>{op.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {resource === 'coin' && ['get_details', 'market_chart', 'history', 'tickers'].includes(operation) && (
                <div className="space-y-1">
                  <Label htmlFor="coinId">
                    Coin ID
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="inline h-3 w-3 ml-1 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>The ID of the coin (e.g., bitcoin, ethereum). Find IDs using 'Coins List' resource, then 'Get All' operation.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Label>
                  <Input
                    id="coinId"
                    value={coinId}
                    onChange={(e) => setCoinId(e.target.value)}
                    placeholder="e.g., bitcoin"
                    className="bg-background"
                  />
                </div>
              )}

              {resource === 'contract' && (
                <div className="space-y-1">
                  <Label htmlFor="contractAddress">Contract Address</Label>
                  <Input
                    id="contractAddress"
                    // value={contractAddress} onChange={e => setContractAddress(e.target.value)}
                    placeholder="e.g., 0x..."
                    className="bg-background"
                  />
                </div>
              )}

              { (operation === 'get_many' || operation === 'get_all') &&
                <>
                  <div className="flex items-center space-x-2">
                    <Switch id="returnAll" checked={returnAll} onCheckedChange={setReturnAll} />
                    <Label htmlFor="returnAll">Return All</Label>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-accent">
                        <Sparkles className="h-4 w-4" />
                    </Button>
                  </div>

                  {!returnAll && (
                    <div className="space-y-1">
                      <Label htmlFor="limit">Limit</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="limit"
                          type="number"
                          value={limit}
                          onChange={(e) => setLimit(parseInt(e.target.value, 10) || 0)}
                          placeholder="100"
                          className="bg-background"
                        />
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-accent">
                            <Sparkles className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              }

            </TabsContent>
            <TabsContent value="settings" className="mt-0">
              <div className="flex items-center justify-center h-40 border border-dashed rounded-md bg-background">
                <p className="text-muted-foreground">Tool-specific settings will appear here.</p>
              </div>
            </TabsContent>
            <TabsContent value="docs" className="mt-0">
              <p className="text-sm text-muted-foreground mb-2">
                This tool connects to the CoinGecko API. For detailed information on parameters and data formats, please refer to the official CoinGecko API documentation.
              </p>
              <Button variant="outline" asChild>
                <a href="https://www.coingecko.com/en/api/documentation" target="_blank" rel="noopener noreferrer">
                  CoinGecko API Docs <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </TabsContent>
          </div>
        </Tabs>
        
        <DialogFooter className="p-6 pt-0 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Tool</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

