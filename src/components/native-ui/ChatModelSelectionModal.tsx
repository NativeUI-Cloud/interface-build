
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import ActionListItem from './ActionListItem';
import { llmProviders, getAllChatModels, getProviderById } from '@/lib/llmProviders';
import type { LLMProvider, LLMModel, StoredCredential } from '@/lib/types';
import { saveCredential, getCredentials, deleteCredential, updateCredential, validateApiKey, getCredentialById } from '@/lib/credentialsStore';
import { ChevronLeft, Plus, Search, Trash2, Edit3, KeyRound, Globe, Server, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ChatModelSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCredentialSelected: (credentialId: string, modelId: string) => void; // modelId is for chat models
  currentConfiguredProviderId?: string; // Can be pre-selected provider for generic tools
  currentConfiguredModelId?: string;
  currentConfiguredCredentialId?: string; 
}

type ModalStep = 'provider_list' | 'model_list' | 'credential_management' | 'credential_form';

export default function ChatModelSelectionModal({
  isOpen,
  onOpenChange,
  onCredentialSelected,
  currentConfiguredProviderId,
  currentConfiguredModelId,
  currentConfiguredCredentialId,
}: ChatModelSelectionModalProps) {
  const [step, setStep] = useState<ModalStep>('provider_list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<LLMProvider | null>(null);
  const [selectedModel, setSelectedModel] = useState<LLMModel | null>(null);
  
  const [allStoredCredentials, setAllStoredCredentials] = useState<StoredCredential[]>([]);
  const [credentialsForSelectedProvider, setCredentialsForSelectedProvider] = useState<StoredCredential[]>([]);
  const [editingCredential, setEditingCredential] = useState<StoredCredential | null>(null);

  const [credentialName, setCredentialName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiEndpoint, setApiEndpoint] = useState('');
  const [isVerifying, setIsVerifying] = useState<string | null>(null); 
  const [selectedSubgraphKey, setSelectedSubgraphKey] = useState<string>(''); // For The Graph API

  const { toast } = useToast();

  const refreshCredentials = () => {
    const creds = getCredentials();
    setAllStoredCredentials(creds);
    if (selectedProvider) {
      setCredentialsForSelectedProvider(creds.filter(c => c.providerId === selectedProvider.id));
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshCredentials();
      const providerToSelect = currentConfiguredProviderId ? getProviderById(currentConfiguredProviderId) : null;
      
      if (providerToSelect) {
        setSelectedProvider(providerToSelect);
        const modelToSelect = currentConfiguredModelId ? providerToSelect.models.find(m => m.id === currentConfiguredModelId) : null;
        if (modelToSelect) {
          setSelectedModel(modelToSelect);
          setApiEndpoint(modelToSelect.defaultEndpoint || '');
          setStep('credential_management'); // Go to credential list for this model/provider
          if (currentConfiguredCredentialId) {
            const cred = getCredentialById(currentConfiguredCredentialId);
            if (cred) {
              setEditingCredential(cred);
              setCredentialName(cred.name);
              setApiKey(''); 
              setApiEndpoint(cred.endpoint || modelToSelect.defaultEndpoint || '');
              if (providerToSelect.id === 'the_graph_api') {
                setSelectedSubgraphKey(cred.endpoint || providerToSelect.predefinedSubgraphs?.[0]?.value || 'custom');
              }
              setStep('credential_form'); // If credential also known, go to form
            }
          }
        } else if (providerToSelect.models.length === 0 || providerToSelect.models.every(m => !m.isChatModel)) {
          // If provider has no chat models (e.g., it's a generic tool provider), go to its credential management
          setSelectedModel(null); // No specific model
          const defaultEndpoint = providerToSelect.properties?.find(p=>p.name === 'endpoint')?.default || providerToSelect.properties?.find(p=>p.name === 'server')?.default || '';
          setApiEndpoint(defaultEndpoint);
          if (providerToSelect.id === 'the_graph_api') {
            setSelectedSubgraphKey(defaultEndpoint || providerToSelect.predefinedSubgraphs?.[0]?.value || 'custom');
          }
          setStep('credential_management');
          if (currentConfiguredCredentialId) {
            const cred = getCredentialById(currentConfiguredCredentialId);
             if (cred && cred.providerId === providerToSelect.id) {
                handleEditCredential(cred); // Pre-fill form if editing existing tool credential
             }
          }
        } else {
          // Provider has models, but none specifically selected yet
          setStep('model_list');
        }
      } else {
        // No provider pre-selected, start from provider list
        setStep('provider_list');
      }
    } else { 
      // Reset on close
      setStep('provider_list');
      setSearchTerm('');
      setSelectedProvider(null);
      setSelectedModel(null);
      setEditingCredential(null);
      setCredentialName('');
      setApiKey('');
      setApiEndpoint('');
      setSelectedSubgraphKey('');
      setIsVerifying(null);
    }
  }, [isOpen, currentConfiguredProviderId, currentConfiguredModelId, currentConfiguredCredentialId]);


  useEffect(() => {
    if (selectedProvider) {
       setCredentialsForSelectedProvider(allStoredCredentials.filter(c => c.providerId === selectedProvider.id));
       if (selectedProvider.id === 'the_graph_api') {
        // Initialize selectedSubgraphKey and apiEndpoint for The Graph
        const defaultGraphEndpoint = selectedProvider.predefinedSubgraphs?.[0]?.value || '';
        setSelectedSubgraphKey(apiEndpoint || defaultGraphEndpoint || 'custom');
        if (!apiEndpoint && defaultGraphEndpoint) {
            setApiEndpoint(defaultGraphEndpoint);
        }
       }
    }
  }, [selectedProvider, allStoredCredentials, apiEndpoint]);


  const filteredProviders = useMemo(() => {
    if (!searchTerm) return llmProviders;
    return llmProviders.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const modelsForSelectedProvider = useMemo(() => {
    if (!selectedProvider) return [];
    // Filter for actual chat models if the provider has them
    const chatModels = selectedProvider.models.filter(m => m.isChatModel);
    if (chatModels.length === 0 && selectedProvider.properties) {
        // This indicates it's a generic tool provider, no models to list here
        return []; 
    }
    if (!searchTerm && step === 'model_list') return chatModels;
    if (step === 'model_list') {
      return chatModels.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return chatModels;
  }, [selectedProvider, searchTerm, step]);


  const handleProviderSelect = (provider: LLMProvider) => {
    setSelectedProvider(provider);
    setSearchTerm(''); 
    const chatModels = provider.models.filter(m => m.isChatModel);
    if (chatModels.length === 0) {
      setSelectedModel(null); 
      const defaultEp = provider.properties?.find(p=>p.name === 'endpoint')?.default || provider.properties?.find(p=>p.name === 'server')?.default || '';
      setApiEndpoint(defaultEp);
       if (provider.id === 'the_graph_api') {
        const graphDefault = provider.predefinedSubgraphs?.[0]?.value || 'custom';
        setSelectedSubgraphKey(graphDefault);
        setApiEndpoint(graphDefault === 'custom' ? '' : graphDefault);
      }
      setStep('credential_management');
    } else {
      setStep('model_list');
    }
  };
  
  const handleModelSelect = (model: LLMModel) => {
    setSelectedModel(model);
    setApiEndpoint(model.defaultEndpoint || '');
    setCredentialsForSelectedProvider(
      allStoredCredentials.filter(c => c.providerId === selectedProvider?.id && (c.modelId === model.id || !c.modelId))
    );
    setStep('credential_management');
  };

  const handleEditCredential = (credential: StoredCredential) => {
    setEditingCredential(credential);
    setCredentialName(credential.name);
    setApiKey(''); // Don't prefill API key for editing
    const currentProvider = getProviderById(credential.providerId);
    const currentModel = currentProvider?.models.find(m => m.id === credential.modelId);
    
    let endpointToSet = credential.endpoint || currentModel?.defaultEndpoint || currentProvider?.properties?.find(p=>p.name === 'endpoint' || p.name === 'server')?.default || '';
    setApiEndpoint(endpointToSet);

    if (credential.providerId === 'the_graph_api' && currentProvider?.predefinedSubgraphs) {
      const isPredefined = currentProvider.predefinedSubgraphs.some(sg => sg.value === credential.endpoint);
      setSelectedSubgraphKey(isPredefined ? credential.endpoint! : 'custom');
      if (!isPredefined) {
        // If it's custom, apiEndpoint is already set to credential.endpoint.
        // If credential.endpoint was empty, it might fall back to default, which is fine.
      }
    } else {
      setSelectedSubgraphKey(''); // Reset for non-Graph API providers
    }
    setStep('credential_form');
  };
  
  const handleUseCredential = (credentialId: string) => {
    const effectiveModelId = selectedModel?.id || 'provider-default'; 
    onCredentialSelected(credentialId, effectiveModelId);
    onOpenChange(false); 
  };

  const handleDeleteCredential = (credentialId: string) => {
    if (deleteCredential(credentialId)) {
      toast({ title: "Success", description: "Credential deleted." });
      refreshCredentials();
    } else {
      toast({ title: "Error", description: "Failed to delete credential.", variant: "destructive" });
    }
  };

  const handleVerifyCredential = async (credentialToVerify: StoredCredential, isVerifyingAfterSave: boolean = false) => {
    setIsVerifying(credentialToVerify.id);
    toast({ title: "Verifying...", description: `Checking connection for ${credentialToVerify.name}.`});
    try {
      const validationInput = {
        ...credentialToVerify, 
        modelId: credentialToVerify.modelId || selectedModel?.id 
      };
      const validatedCredResult = await validateApiKey(validationInput); 
      refreshCredentials(); 
      
      if (validatedCredResult.status === 'valid') {
        toast({ title: "Success", description: `${credentialToVerify.name} connected successfully.` });
        if (isVerifyingAfterSave) { 
            handleUseCredential(validatedCredResult.id);
        }
        return true;
      } else {
        toast({ title: "Verification Failed", description: validatedCredResult.validationError || "Could not connect.", variant: "destructive" });
        if (isVerifyingAfterSave) {
            if (!editingCredential && validatedCredResult) { 
                setEditingCredential(validatedCredResult); 
            }
        }
        return false;
      }
    } catch (error: any) {
      toast({ title: "Error Verifying", description: error.message || "Verification process failed.", variant: "destructive" });
      refreshCredentials(); 
      if (isVerifyingAfterSave) {
        const currentCredInStore = getCredentialById(credentialToVerify.id);
        if (!editingCredential && currentCredInStore) {
            setEditingCredential(currentCredInStore);
        }
      }
      return false;
    } finally {
      setIsVerifying(null);
    }
  };

  const handleSaveOrUpdateCredential = async () => {
    if (!selectedProvider || !credentialName.trim()) { 
      toast({ title: "Error", description: "Provider and Credential Name are required.", variant: "destructive" });
      return;
    }

    if (!editingCredential && !apiKey.trim()) {
      const apiKeyProp = selectedProvider.properties?.find(p => p.name === 'apiKey' || p.name === 'accessToken' || p.name === 'apiKeyAndToken' || p.name === 'serviceAccount');
      const apiKeyRequired = apiKeyProp?.type !== 'string' || !apiKeyProp.typeOptions?.optional; // Basic check, refine if needed
      if (apiKeyRequired) {
         toast({ title: "Error", description: "API Key/Token is required for new credentials.", variant: "destructive" });
         return;
      }
    }

    let savedOrUpdatedCredential: StoredCredential | null = null;
    const providerRequiresEndpoint = selectedProvider.models.find(m => m.id === selectedModel?.id)?.requiresEndpoint !== false || 
                                   selectedProvider.properties?.some(p => p.name === 'endpoint' || p.name === 'server');

    const credentialPayload = {
        providerId: selectedProvider.id,
        modelId: selectedModel?.id, 
        name: credentialName.trim(),
        apiKey: apiKey, 
        endpoint: providerRequiresEndpoint ? apiEndpoint : undefined,
    };

    if (editingCredential) {
      savedOrUpdatedCredential = updateCredential({ ...credentialPayload, id: editingCredential.id });
    } else {
      savedOrUpdatedCredential = saveCredential(credentialPayload);
    }

    if (savedOrUpdatedCredential) {
      await handleVerifyCredential(savedOrUpdatedCredential, true);
    } else {
      toast({ title: "Error", description: `Failed to ${editingCredential ? 'update' : 'save'} credential.`, variant: "destructive" });
    }
  };


  const getStatusIcon = (status: StoredCredential['status']) => {
    switch (status) {
      case 'valid': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'invalid': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'unchecked': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const relevantCredentialsForContext = useMemo(() => {
    if (!selectedProvider) return [];
    if (selectedModel) { 
      return credentialsForSelectedProvider.filter(
          c => c.providerId === selectedProvider.id && (c.modelId === selectedModel.id || !c.modelId) 
      );
    }
    return credentialsForSelectedProvider.filter(c => c.providerId === selectedProvider.id);
  }, [credentialsForSelectedProvider, selectedModel, selectedProvider]);


  const renderProviderList = () => (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b">
        <DialogTitle className="text-xl">Select Provider</DialogTitle>
        <DialogDescription>Choose a service provider to connect to.</DialogDescription>
      </DialogHeader>
      <div className="p-0">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[50vh] p-2">
          <div className="space-y-1 p-2">
            {filteredProviders.map((provider) => (
              <ActionListItem
                key={provider.id}
                icon={provider.icon}
                title={provider.name}
                description={provider.description || `${provider.models.filter(m => m.isChatModel).length} chat model(s) available`}
                onClick={() => handleProviderSelect(provider)}
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
  
  const renderModelList = () => ( 
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => { setStep('provider_list'); setSearchTerm(''); setSelectedProvider(null);}} className="absolute left-6 top-7 text-sm">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <DialogTitle className="text-xl text-center">{selectedProvider?.name} Models</DialogTitle>
        <DialogDescription className="text-center">Select a specific chat model.</DialogDescription>
      </DialogHeader>
       <div className="p-0">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${selectedProvider?.name} models...`}
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[50vh] p-2">
          <div className="space-y-1 p-2">
            {modelsForSelectedProvider.map((model) => ( 
              <ActionListItem
                key={model.id}
                icon={model.icon || selectedProvider?.icon || Server}
                title={model.name}
                description={`Part of ${selectedProvider?.name}`}
                onClick={() => handleModelSelect(model)}
              />
            ))}
             {modelsForSelectedProvider.length === 0 && <p className="text-center text-muted-foreground p-4">No chat models found for "{searchTerm}".</p>}
          </div>
        </ScrollArea>
      </div>
    </>
  );

  const renderCredentialManagement = () => (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b">
         <Button variant="ghost" size="sm" 
            onClick={() => { 
                const providerHasChatModels = selectedProvider?.models.some(m => m.isChatModel);
                setStep(providerHasChatModels ? 'model_list' : 'provider_list'); 
                setSearchTerm(''); 
                setSelectedModel(null); 
                if (!providerHasChatModels) setSelectedProvider(null); 
            }} 
            className="absolute left-6 top-7 text-sm"
        >
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <DialogTitle className="text-xl text-center">{selectedModel?.name || selectedProvider?.name} Credentials</DialogTitle>
        <DialogDescription className="text-center">Manage or add credentials for {selectedProvider?.name}{selectedModel ? ` - ${selectedModel.name}` : ''}.</DialogDescription>
      </DialogHeader>
      <div className="p-6 space-y-4">
        {relevantCredentialsForContext.length > 0 && (
          <div className="space-y-2">
            <Label className="font-semibold">Existing Credentials for {selectedModel?.name || selectedProvider?.name}</Label>
            <ScrollArea className="h-[max(20vh,150px)] border rounded-md p-2 bg-background">
              {relevantCredentialsForContext.map(cred => ( 
                <div key={cred.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{getStatusIcon(cred.status)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Status: {cred.status}</p>
                          {cred.validationError && <p className="max-w-xs text-destructive">{cred.validationError}</p>}
                          {cred.lastValidated && <p>Last checked: {new Date(cred.lastValidated).toLocaleString()}</p>}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div>
                      <p className="font-medium">{cred.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cred.providerId}{cred.modelId ? ` / ${cred.modelId.substring(0,15)}...` : ''}
                        {cred.endpoint ? ` @ ${cred.endpoint.substring(0,30)}...` : (selectedProvider?.models.find(m => m.id === cred.modelId)?.defaultEndpoint ? ' @ Default' : '')}
                      </p>
                       {cred.status === 'invalid' && cred.validationError && (
                        <p className="text-xs text-destructive max-w-xs truncate" title={cred.validationError}>{cred.validationError}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                     <Button variant="default" size="sm" onClick={() => handleUseCredential(cred.id)} disabled={isVerifying === cred.id || cred.status === 'invalid'}>
                      Use
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleVerifyCredential(cred)} disabled={isVerifying === cred.id}>
                            {isVerifying === cred.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Verify Credential</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                     <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCredential(cred)} disabled={isVerifying === cred.id}>
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>Edit Credential</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCredential(cred.id)} disabled={isVerifying === cred.id}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Delete Credential</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
        )}
        <Button className="w-full" onClick={() => { 
            setEditingCredential(null); 
            setCredentialName(''); 
            setApiKey(''); 
            const defaultEp = selectedModel?.defaultEndpoint || selectedProvider?.properties?.find(p=>p.name === 'endpoint' || p.name === 'server')?.default || '';
            setApiEndpoint(defaultEp); 
            if (selectedProvider?.id === 'the_graph_api') {
                const graphDefault = selectedProvider.predefinedSubgraphs?.[0]?.value || 'custom';
                setSelectedSubgraphKey(graphDefault);
                setApiEndpoint(graphDefault === 'custom' ? '' : graphDefault);
            } else {
                setSelectedSubgraphKey('');
            }
            setStep('credential_form');
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add New Credential
        </Button>
      </div>
    </>
  );

  const renderCredentialForm = () => {
    const endpointProperty = selectedProvider?.properties?.find(p => p.name === 'endpoint' || p.name === 'server');
    const apiKeyProperty = selectedProvider?.properties?.find(p => p.name === 'apiKey' || p.name === 'accessToken' || p.name === 'apiKeyAndToken' || p.name === 'serviceAccount');
    const providerRequiresEndpoint = selectedModel?.requiresEndpoint !== false || !!endpointProperty;
    const isGraphApi = selectedProvider?.id === 'the_graph_api';

    return (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => setStep('credential_management')} className="absolute left-6 top-7 text-sm">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <DialogTitle className="text-xl text-center">
          {editingCredential ? 'Edit' : 'New'} {selectedProvider?.name} Credential
        </DialogTitle>
         <DialogDescription className="text-center">
            For: {selectedModel?.name || selectedProvider?.name}
            {editingCredential && <span className="block text-xs">ID: {editingCredential.id.substring(0,8)}... Status: {editingCredential.status}</span>}
         </DialogDescription>
      </DialogHeader>
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="space-y-1">
          <Label htmlFor="credName">Credential Name <span className="text-destructive">*</span></Label>
          <Input id="credName" placeholder="e.g., My Personal Key" value={credentialName} onChange={e => setCredentialName(e.target.value)} className="bg-background"/>
        </div>
        <div className="space-y-1">
          <Label htmlFor="apiKey">
            {apiKeyProperty?.displayName || selectedModel?.apiKeyName || selectedProvider?.name + ' API Key/Token' || 'API Key/Token'}
            {!editingCredential && <span className="text-destructive">*</span>}
          </Label>
          <Input 
            id="apiKey" 
            type="password" 
            placeholder={editingCredential ? "Enter new key/token to change" : "Enter your API key/token"} 
            value={apiKey} 
            onChange={e => setApiKey(e.target.value)} 
            className="bg-background"
          />
          {editingCredential && <p className="text-xs text-muted-foreground">Leave blank to keep existing API key/token.</p>}
          {apiKeyProperty?.description && <p className="text-xs text-muted-foreground mt-1">{apiKeyProperty.description}</p>}
        </div>

        {isGraphApi && selectedProvider?.predefinedSubgraphs && (
          <div className="space-y-1">
            <Label htmlFor="subgraphSelect">{endpointProperty?.displayName || 'Subgraph Query URL'}</Label>
            <Select
              value={selectedSubgraphKey}
              onValueChange={(value) => {
                setSelectedSubgraphKey(value);
                if (value === 'custom') {
                  setApiEndpoint(''); // Clear endpoint for custom input
                } else {
                  setApiEndpoint(value);
                }
              }}
            >
              <SelectTrigger id="subgraphSelect" className="bg-background">
                <SelectValue placeholder="Select a subgraph or choose custom" />
              </SelectTrigger>
              <SelectContent>
                {selectedProvider.predefinedSubgraphs.map(sg => (
                  <SelectItem key={sg.value} value={sg.value}>{sg.label}</SelectItem>
                ))}
                <SelectItem value="custom">Custom URL...</SelectItem>
              </SelectContent>
            </Select>
            {selectedSubgraphKey === 'custom' && (
              <Input
                id="customApiEndpoint"
                placeholder="Enter custom Subgraph Query URL (e.g., https://api.thegraph.com/...)"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="bg-background mt-2"
              />
            )}
            {endpointProperty?.description && selectedSubgraphKey !== 'custom' && (
                 <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
                    {endpointProperty.description}
                 </p>
             )}
          </div>
        )}

        {providerRequiresEndpoint && !isGraphApi && (
          <div className="space-y-1">
            <Label htmlFor="apiEndpoint">{endpointProperty?.displayName || selectedModel?.endpointLabel || 'API Endpoint'}</Label>
            <Input 
              id="apiEndpoint" 
              placeholder={selectedModel?.defaultEndpoint || endpointProperty?.default || "Enter API endpoint/server URL"} 
              value={apiEndpoint} 
              onChange={e => setApiEndpoint(e.target.value)} 
              className="bg-background"
            />
             {(selectedModel?.defaultEndpoint || endpointProperty?.default) && 
                <p className="text-xs text-muted-foreground mt-1">
                    Default: {selectedModel?.defaultEndpoint || endpointProperty?.default}
                </p>
             }
             {endpointProperty?.description && 
                <p className="text-xs text-muted-foreground mt-1 whitespace-pre-line">
                    {endpointProperty.description}
                </p>
             }
          </div>
        )}
      </div>
      <DialogFooter className="p-6 border-t">
        <Button variant="outline" onClick={() => { setEditingCredential(null); setStep('credential_management'); }}>Cancel</Button>
        <Button onClick={handleSaveOrUpdateCredential} disabled={isVerifying !== null || !credentialName.trim() || (!editingCredential && !apiKey.trim() && !selectedProvider?.properties?.find(p=>p.name ==='apiKey')?.typeOptions?.optional) }>
            {isVerifying ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : (editingCredential ? <Edit3 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />) }
            {editingCredential ? 'Update & Verify' : 'Save & Verify'}
        </Button>
      </DialogFooter>
    </>
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        {step === 'provider_list' && renderProviderList()}
        {step === 'model_list' && selectedProvider && renderModelList()}
        {step === 'credential_management' && selectedProvider && renderCredentialManagement()}
        {step === 'credential_form' && selectedProvider && renderCredentialForm()}
      </DialogContent>
    </Dialog>
  );
}

