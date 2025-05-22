
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
import { Github, KeyRound, RefreshCw, Server, User } from 'lucide-react';
import type { StoredCredential, GitHubApiToolConfig } from '@/lib/types';
import { saveCredential, getCredentialById, validateApiKey, updateCredential } from '@/lib/credentialsStore';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface GitHubApiCredentialModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  // Called when a credential is saved and successfully verified, passing the new tool config
  onSave: (toolConfig: GitHubApiToolConfig) => void; 
  // Optional: pass existing credential if we want to edit
  existingCredentialId?: string | null; 
}

const GITHUB_PROVIDER_ID = 'github_api';

export default function GitHubApiCredentialModal({
  isOpen,
  onOpenChange,
  onSave,
  existingCredentialId,
}: GitHubApiCredentialModalProps) {
  const [credentialName, setCredentialName] = useState('');
  const [githubServer, setGithubServer] = useState('https://api.github.com');
  const [githubUser, setGithubUser] = useState(''); // Stored for UI, not directly in StoredCredential generic fields
  const [accessToken, setAccessToken] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStoredCredential, setCurrentStoredCredential] = useState<StoredCredential | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (existingCredentialId) {
        const cred = getCredentialById(existingCredentialId);
        setCurrentStoredCredential(cred);
        if (cred) {
          setCredentialName(cred.name);
          setGithubServer(cred.endpoint || 'https://api.github.com');
          // User field is not part of StoredCredential, would need custom logic if it was saved elsewhere
          setGithubUser(''); // Reset or load if stored differently
          setAccessToken(''); // Don't prefill token for security
        } else {
          // existingCredentialId provided but not found, treat as new
          setCredentialName('My GitHub API Token');
          setGithubServer('https://api.github.com');
          setGithubUser('');
          setAccessToken('');
        }
      } else {
        // New credential
        setCurrentStoredCredential(null);
        setCredentialName('My GitHub API Token');
        setGithubServer('https://api.github.com');
        setGithubUser('');
        setAccessToken('');
      }
    }
  }, [isOpen, existingCredentialId]);

  const handleSaveAndVerify = async () => {
    if (!credentialName.trim() || !accessToken.trim()) {
      toast({ title: "Error", description: "Credential Name and Access Token are required.", variant: "destructive" });
      return;
    }
    if (!githubServer.trim()) {
      toast({ title: "Error", description: "GitHub Server URL is required.", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    toast({ title: "Saving...", description: "Saving GitHub API Credential." });

    let savedOrUpdatedCred: StoredCredential | null;

    if (currentStoredCredential) {
      // Update existing credential
      savedOrUpdatedCred = updateCredential({
        id: currentStoredCredential.id,
        providerId: GITHUB_PROVIDER_ID,
        name: credentialName.trim(),
        apiKey: accessToken.trim(), // Access Token stored in apiKey field
        endpoint: githubServer.trim(), // Server URL stored in endpoint field
        // Note: 'githubUser' is not part of StoredCredential standard fields
      });
    } else {
      // Save new credential
      savedOrUpdatedCred = saveCredential({
        providerId: GITHUB_PROVIDER_ID,
        name: credentialName.trim(),
        apiKey: accessToken.trim(),
        endpoint: githubServer.trim(),
      });
    }
    

    if (!savedOrUpdatedCred) {
      toast({ title: "Error", description: "Failed to save credential.", variant: "destructive" });
      setIsVerifying(false);
      return;
    }
    
    setCurrentStoredCredential(savedOrUpdatedCred); // Update current credential state

    toast({ title: "Verifying...", description: `Checking token for ${savedOrUpdatedCred.name}.`});
    try {
      const validatedCred = await validateApiKey(savedOrUpdatedCred);
      
      // Update the currentStoredCredential with the validation result from store
      const finalCred = getCredentialById(validatedCred.id);
      setCurrentStoredCredential(finalCred);
      
      if (finalCred?.status === 'valid') {
        toast({ title: "Success", description: `${finalCred.name} token verified and saved.` });
        
        // Create the tool configuration object to pass back
        const toolConfig: GitHubApiToolConfig = {
          id: `githubtool-${uuidv4()}`, // Generate a new ID for this tool instance
          type: 'GITHUB_API',
          credentialId: finalCred.id,
        };
        onSave(toolConfig); // Pass the new tool config
        onOpenChange(false); // Close modal
      } else {
        toast({ title: "Verification Failed", description: finalCred?.validationError || "Could not verify token.", variant: "destructive" });
        // Keep modal open for user to correct, currentStoredCredential is now updated with invalid status
      }
    } catch (error: any) {
      toast({ title: "Error Verifying", description: error.message || "Verification process failed.", variant: "destructive" });
       const errorCred = getCredentialById(savedOrUpdatedCred.id); // get potentially updated status
       setCurrentStoredCredential(errorCred);
    } finally {
      setIsVerifying(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Github className="mr-2 h-6 w-6 text-primary" />
            Configure GitHub API Credential
          </DialogTitle>
          <DialogDescription>
            Provide details to connect to the GitHub API.
             {currentStoredCredential && (
              <span className="text-xs ml-1">
                (Editing: {currentStoredCredential.name} - Status: {currentStoredCredential.status})
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="credName">Credential Name</Label>
            <Input
              id="credName"
              placeholder="e.g., My Personal GitHub Token"
              value={credentialName}
              onChange={(e) => setCredentialName(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="githubServer">GitHub Server URL</Label>
            <Input
              id="githubServer"
              placeholder="https://api.github.com"
              value={githubServer}
              onChange={(e) => setGithubServer(e.target.value)}
              className="bg-background"
            />
          </div>
           <div className="space-y-1">
            <Label htmlFor="githubUser">GitHub User (Optional)</Label>
            <Input
              id="githubUser"
              placeholder="Your GitHub username"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
              className="bg-background"
            />
            <p className="text-xs text-muted-foreground">Mainly for your reference. Not typically used in token authentication for /user endpoint.</p>
          </div>
          <div className="space-y-1">
            <Label htmlFor="accessToken">Access Token</Label>
            <Input
              id="accessToken"
              type="password"
              placeholder={currentStoredCredential ? "Enter new token to change" : "Enter your GitHub Personal Access Token"}
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              className="bg-background"
            />
             {currentStoredCredential && <p className="text-xs text-muted-foreground">Leave blank to keep using the current token for "{currentStoredCredential.name}".</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isVerifying}>
            Cancel
          </Button>
          <Button onClick={handleSaveAndVerify} disabled={isVerifying || (!accessToken.trim() && !currentStoredCredential) || !githubServer.trim() || !credentialName.trim()}>
            {isVerifying ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <KeyRound className="mr-2 h-4 w-4" />}
            {currentStoredCredential ? 'Update & Verify' : 'Save & Verify'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
