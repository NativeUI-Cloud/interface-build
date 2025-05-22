
'use client';

import { useState, useEffect } from 'react';
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
import { Send, KeyRound, RefreshCw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { Node, StoredCredential } from '@/lib/types';
import { saveCredential, getCredentialById, validateApiKey } from '@/lib/credentialsStore';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TelegramTriggerNodeModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  node: Node | null;
  onConfigSave: (nodeId: string, credentialId: string, status: StoredCredential['status']) => void;
}

const TELEGRAM_PROVIDER_ID = 'telegram_bot';

export default function TelegramTriggerNodeModal({
  isOpen,
  onOpenChange,
  node,
  onConfigSave,
}: TelegramTriggerNodeModalProps) {
  const [credentialName, setCredentialName] = useState('');
  const [botToken, setBotToken] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentCredential, setCurrentCredential] = useState<StoredCredential | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && node?.data?.telegramBotTokenCredentialId) {
      const cred = getCredentialById(node.data.telegramBotTokenCredentialId);
      setCurrentCredential(cred);
      if (cred) {
        setCredentialName(cred.name);
        setBotToken(''); // Don't prefill token for security
      } else {
        setCredentialName('My Telegram Bot'); // Default for new
        setBotToken('');
      }
    } else if (isOpen) {
      setCurrentCredential(null);
      setCredentialName('My Telegram Bot');
      setBotToken('');
    }
  }, [isOpen, node]);

  const handleSaveAndVerify = async () => {
    if (!node) {
      toast({ title: "Error", description: "No node specified.", variant: "destructive" });
      return;
    }
    if (!credentialName.trim() || !botToken.trim()) {
      toast({ title: "Error", description: "Credential Name and Bot Token are required.", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    toast({ title: "Saving...", description: "Saving Telegram Bot Token." });

    // Save or update logic - for simplicity, we'll always save a new one if token is entered.
    // A more robust approach would allow updating existing credentials.
    const savedCredential = saveCredential({
      providerId: TELEGRAM_PROVIDER_ID,
      name: credentialName.trim(),
      apiKey: botToken.trim(), // Store token in apiKey field
    });

    if (!savedCredential) {
      toast({ title: "Error", description: "Failed to save credential.", variant: "destructive" });
      setIsVerifying(false);
      return;
    }
    
    toast({ title: "Verifying...", description: `Checking token for ${savedCredential.name}.`});
    try {
      // Placeholder for actual Telegram API validation
      const validatedCred = await validateApiKey(savedCredential); // This will use the new 'telegram_bot' case
      
      if (validatedCred.status === 'valid') {
        toast({ title: "Success", description: `${savedCredential.name} token verified and saved.` });
        onConfigSave(node.id, savedCredential.id, 'valid');
        onOpenChange(false);
      } else {
        toast({ title: "Verification Failed", description: validatedCred.validationError || "Could not verify token. It has been saved as unchecked.", variant: "destructive" });
        // Even if validation fails, we save it with the credential ID so user can see it on node
        onConfigSave(node.id, savedCredential.id, 'invalid'); 
        setCurrentCredential(validatedCred); // Keep modal open with new (invalid) cred loaded
      }
    } catch (error: any) {
      toast({ title: "Error Verifying", description: error.message || "Verification process failed.", variant: "destructive" });
       onConfigSave(node.id, savedCredential.id, 'unchecked');
       setCurrentCredential(savedCredential);
    } finally {
      setIsVerifying(false);
    }
  };
  
  const getStatusIcon = (status: StoredCredential['status'] | undefined) => {
    switch (status) {
      case 'valid': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'invalid': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'unchecked':
      default: return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Send className="mr-2 h-6 w-6 text-primary" />
            Configure Telegram Trigger
          </DialogTitle>
          <DialogDescription>
            Setup your Telegram Bot Token to receive messages.
            {currentCredential && (
              <div className="mt-2 text-xs flex items-center gap-1">
                Current Credential: {currentCredential.name} {getStatusIcon(currentCredential.status)}
                 {currentCredential.status === 'invalid' && currentCredential.validationError && 
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild><Info className="h-3 w-3 text-muted-foreground cursor-help"/></TooltipTrigger>
                            <TooltipContent><p className="max-w-xs">{currentCredential.validationError}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                 }
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="credName">Credential Name</Label>
            <Input
              id="credName"
              placeholder="e.g., My Project Bot"
              value={credentialName}
              onChange={(e) => setCredentialName(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="botToken">Telegram Bot Token</Label>
            <Input
              id="botToken"
              type="password"
              placeholder={currentCredential ? "Enter new token to change" : "Enter your Telegram Bot Token"}
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
              className="bg-background"
            />
             {currentCredential && <p className="text-xs text-muted-foreground">Leave blank to keep using the current token for "{currentCredential.name}". Enter a new token to update it.</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isVerifying}>
            Cancel
          </Button>
          <Button onClick={handleSaveAndVerify} disabled={isVerifying || !botToken.trim()}>
            {isVerifying ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
            {currentCredential && !botToken.trim() ? 'Close' : 'Save & Verify Token'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
