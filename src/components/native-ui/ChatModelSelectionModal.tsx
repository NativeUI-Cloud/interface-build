
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
import { llmProviders, getAllChatModels } from '@/lib/llmProviders';
import type { LLMProvider, LLMModel, StoredCredential } from '@/lib/types';
import { saveCredential, getCredentials, deleteCredential, updateCredential, validateApiKey, getCredentialById } from '@/lib/credentialsStore';
import { ChevronLeft, Plus, Search, Trash2, Edit3, KeyRound, Globe, Server, CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
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
  onCredentialSelected: (credentialId: string, modelId: string) => void;
  currentConfiguredProviderId?: string;
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
      if (currentConfiguredCredentialId) {
        const cred = getCredentialById(currentConfiguredCredentialId);
        if (cred) {
          const provider = llmProviders.find(p => p.id === cred.providerId);
          const model = provider?.models.find(m => m.id === cred.modelId); // modelId on credential might be preferred if set
          if (provider && model) {
            setSelectedProvider(provider);
            setSelectedModel(model);
            setEditingCredential(cred); 
            setCredentialName(cred.name);
            setApiKey(''); 
            setApiEndpoint(cred.endpoint || model.defaultEndpoint || '');
            setStep('credential_form');
            return; 
          }
        }
      } else if (currentConfiguredProviderId && currentConfiguredModelId) {
        const provider = llmProviders.find(p => p.id === currentConfiguredProviderId);
        const model = provider?.models.find(m => m.id === currentConfiguredModelId);
        if (provider && model) {
          setSelectedProvider(provider);
          setSelectedModel(model);
          setStep('credential_management');
          return; 
        }
      }
      setStep('provider_list');

    } else { 
      setStep('provider_list');
      setSearchTerm('');
      setSelectedProvider(null);
      setSelectedModel(null);
      setEditingCredential(null);
      setCredentialName('');
      setApiKey('');
      setApiEndpoint('');
      setIsVerifying(null);
    }
  }, [isOpen, currentConfiguredProviderId, currentConfiguredModelId, currentConfiguredCredentialId]);


  useEffect(() => {
    if (selectedProvider) {
       setCredentialsForSelectedProvider(allStoredCredentials.filter(c => c.providerId === selectedProvider.id));
    }
  }, [selectedProvider, allStoredCredentials]);


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
    const models = selectedProvider.models.filter(m => m.isChatModel);
    if (!searchTerm && step === 'model_list') return models;
    if (step === 'model_list') {
      return models.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return models;
  }, [selectedProvider, searchTerm, step]);


  const handleProviderSelect = (provider: LLMProvider) => {
    setSelectedProvider(provider);
    setSearchTerm(''); 
    setStep('model_list');
  };
  
  const handleModelSelect = (model: LLMModel) => {
    setSelectedModel(model);
    setApiEndpoint(model.defaultEndpoint || '');
    setCredentialsForSelectedProvider(allStoredCredentials.filter(c => c.providerId === selectedProvider?.id && (c.modelId === model.id || !c.modelId)));
    setStep('credential_management');
  };

  const handleEditCredential = (credential: StoredCredential) => {
    setEditingCredential(credential);
    setCredentialName(credential.name);
    setApiKey(''); 
    setApiEndpoint(credential.endpoint || selectedModel?.defaultEndpoint || '');
    setStep('credential_form');
  };
  
  const handleUseCredential = (credentialId: string) => {
    if (!selectedModel) return; 
    onCredentialSelected(credentialId, selectedModel.id);
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

  const handleVerifyCredential = async (credential: StoredCredential, isVerifyingAfterSave: boolean = false) => {
    setIsVerifying(credential.id);
    toast({ title: "Verifying...", description: `Checking connection for ${credential.name}.`});
    try {
      const validatedCred = await validateApiKey(credential); 
      refreshCredentials(); // Refresh local list with new status from store
      
      if (validatedCred.status === 'valid') {
        toast({ title: "Success", description: `${credential.name} connected successfully.` });
        if (isVerifyingAfterSave) { 
            handleUseCredential(validatedCred.id); // This will close modal and select
        }
        return true; // Indicate success
      } else {
        toast({ title: "Verification Failed", description: validatedCred.validationError || "Could not connect.", variant: "destructive" });
        if (isVerifyingAfterSave) {
            // Stay on form if validation fails after save
            if (!editingCredential && validatedCred) { 
                setEditingCredential(validatedCred); // Keep form populated, now with an ID if it was new
            }
        }
        return false; // Indicate failure
      }
    } catch (error: any) {
      toast({ title: "Error Verifying", description: error.message || "Verification process failed.", variant: "destructive" });
      refreshCredentials(); 
      if (isVerifyingAfterSave) {
        const currentCredInStore = getCredentialById(credential.id);
        if (!editingCredential && currentCredInStore) {
            setEditingCredential(currentCredInStore);
        }
      }
      return false; // Indicate failure
    } finally {
      setIsVerifying(null);
    }
  };

  const handleSaveOrUpdateCredential = async () => {
    if (!selectedProvider || !selectedModel || !credentialName.trim()) {
      toast({ title: "Error", description: "Provider, Model, and Credential Name are required.", variant: "destructive" });
      return;
    }
    // For new credentials, API key is required. For updates, it's optional (blank means keep existing).
    if (!editingCredential && !apiKey.trim()) {
      toast({ title: "Error", description: "API Key is required for new credentials.", variant: "destructive" });
      return;
    }

    let savedOrUpdatedCredential: StoredCredential | null = null;
    const credentialPayload = {
        providerId: selectedProvider.id,
        modelId: selectedModel.id,
        name: credentialName.trim(),
        apiKey: apiKey, // Pass empty string if user wants to clear/rely on existing for update
        endpoint: selectedModel.requiresEndpoint !== false ? apiEndpoint : undefined,
    };

    if (editingCredential) {
      savedOrUpdatedCredential = updateCredential({ ...credentialPayload, id: editingCredential.id });
    } else {
      savedOrUpdatedCredential = saveCredential(credentialPayload);
    }

    if (savedOrUpdatedCredential) {
      // Now verify the just saved/updated credential.
      // handleVerifyCredential will show toasts and decide if to call handleUseCredential.
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
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const relevantCredentialsForModel = useMemo(() => {
    if (!selectedModel || !selectedProvider) return [];
    return credentialsForSelectedProvider.filter(
        c => c.modelId === selectedModel.id || 
             (!c.modelId && c.providerId === selectedProvider.id) 
    );
  }, [credentialsForSelectedProvider, selectedModel, selectedProvider]);


  const renderProviderList = () => (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b">
        <DialogTitle className="text-xl">Select Chat Model Provider</DialogTitle>
        <DialogDescription>Choose an LLM provider to connect to.</DialogDescription>
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
                description={provider.description || `${provider.models.length} model(s) available`}
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
        <DialogDescription className="text-center">Select a specific model.</DialogDescription>
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
             {modelsForSelectedProvider.length === 0 && <p className="text-center text-muted-foreground p-4">No models found for "{searchTerm}".</p>}
          </div>
        </ScrollArea>
      </div>
    </>
  );

  const renderCredentialManagement = () => (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b">
         <Button variant="ghost" size="sm" onClick={() => { setStep('model_list'); setSearchTerm(''); setSelectedModel(null); }} className="absolute left-6 top-7 text-sm">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back to Models
        </Button>
        <DialogTitle className="text-xl text-center">{selectedModel?.name} Credentials</DialogTitle>
        <DialogDescription className="text-center">Manage or add credentials for {selectedProvider?.name}.</DialogDescription>
      </DialogHeader>
      <div className="p-6 space-y-4">
        {relevantCredentialsForModel.length > 0 && (
          <div className="space-y-2">
            <Label className="font-semibold">Existing Credentials for {selectedModel?.name}</Label>
            <ScrollArea className="h-[max(20vh,150px)] border rounded-md p-2 bg-background">
              {relevantCredentialsForModel.map(cred => ( 
                <div key={cred.id} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span>{getStatusIcon(cred.status)}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Status: {cred.status}</p>
                          {cred.validationError && <p className="max-w-xs">Error: {cred.validationError}</p>}
                          {cred.lastValidated && <p>Last checked: {new Date(cred.lastValidated).toLocaleString()}</p>}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <div>
                      <p className="font-medium">{cred.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {cred.endpoint ? `Endpoint: ${cred.endpoint}` : 'Default Endpoint'}
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
        <Button className="w-full" onClick={() => { setEditingCredential(null); setCredentialName(''); setApiKey(''); setApiEndpoint(selectedModel?.defaultEndpoint || ''); setStep('credential_form');}}>
          <Plus className="mr-2 h-4 w-4" /> Add New Credential
        </Button>
      </div>
    </>
  );

  const renderCredentialForm = () => (
    <>
      <DialogHeader className="px-6 pt-6 pb-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => setStep('credential_management')} className="absolute left-6 top-7 text-sm">
          <ChevronLeft className="mr-1 h-4 w-4" /> Back
        </Button>
        <DialogTitle className="text-xl text-center">
          {editingCredential ? 'Edit' : 'New'} {selectedProvider?.name} Credential
        </DialogTitle>
         <DialogDescription className="text-center">For model: {selectedModel?.name}</DialogDescription>
      </DialogHeader>
      <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <div className="space-y-1">
          <Label htmlFor="credName">Credential Name <span className="text-destructive">*</span></Label>
          <Input id="credName" placeholder="e.g., My Personal Key" value={credentialName} onChange={e => setCredentialName(e.target.value)} className="bg-background"/>
        </div>
        <div className="space-y-1">
          <Label htmlFor="apiKey">{selectedModel?.apiKeyName || selectedProvider?.name + ' API Key' || 'API Key'} {!editingCredential && <span className="text-destructive">*</span>}</Label>
          <Input 
            id="apiKey" 
            type="password" 
            placeholder={editingCredential ? "Enter new API key to change" : "Enter your API key"} 
            value={apiKey} 
            onChange={e => setApiKey(e.target.value)} 
            className="bg-background"
          />
          {editingCredential && <p className="text-xs text-muted-foreground">Leave blank to keep existing API key.</p>}
        </div>
        {(selectedModel?.requiresEndpoint !== false) && (
          <div className="space-y-1">
            <Label htmlFor="apiEndpoint">{selectedModel?.endpointLabel || 'API Endpoint'}</Label>
            <Input 
              id="apiEndpoint" 
              placeholder={selectedModel?.defaultEndpoint || "Enter API endpoint"} 
              value={apiEndpoint} 
              onChange={e => setApiEndpoint(e.target.value)} 
              className="bg-background"
            />
             {selectedModel?.defaultEndpoint && <p className="text-xs text-muted-foreground mt-1">Default: {selectedModel.defaultEndpoint}</p>}
          </div>
        )}
      </div>
      <DialogFooter className="p-6 border-t">
        <Button variant="outline" onClick={() => { setEditingCredential(null); setStep('credential_management'); }}>Cancel</Button>
        <Button onClick={handleSaveOrUpdateCredential} disabled={isVerifying !== null}>
            {isVerifying ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : (editingCredential ? <Edit3 className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />) }
            {editingCredential ? 'Update & Verify' : 'Save & Verify'}
        </Button>
      </DialogFooter>
    </>
  );


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0">
        {step === 'provider_list' && renderProviderList()}
        {step === 'model_list' && selectedProvider && renderModelList()}
        {step === 'credential_management' && selectedProvider && selectedModel && renderCredentialManagement()}
        {step === 'credential_form' && selectedProvider && selectedModel && renderCredentialForm()}
      </DialogContent>
    </Dialog>
  );
}

