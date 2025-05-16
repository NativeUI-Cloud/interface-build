
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Link2, Mail, Lock, Eye, EyeOff, Users, Globe } from 'lucide-react';
import type { Workflow } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ShareWorkflowModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  workflow: Workflow | null;
}

type SharingOption = 'public' | 'private' | 'specific_users';

export default function ShareWorkflowModal({
  isOpen,
  onOpenChange,
  workflow,
}: ShareWorkflowModalProps) {
  const [selectedOption, setSelectedOption] = useState<SharingOption>('private');
  const [requirePassword, setRequirePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emails, setEmails] = useState('');
  const { toast } = useToast();

  const workflowLink = workflow ? `${window.location.origin}/workflow/${workflow.id}` : '';

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens, or load from workflow.sharingSettings if implemented
      setSelectedOption('private');
      setRequirePassword(false);
      setPassword('');
      setEmails('');
      setShowPassword(false);
    }
  }, [isOpen]);

  const handleShare = () => {
    if (!workflow) {
      toast({ title: "Error", description: "No workflow selected to share.", variant: "destructive" });
      return;
    }
    // In a real app, you'd save these settings to your backend
    console.log('Sharing Settings:', {
      workflowId: workflow.id,
      option: selectedOption,
      emails: selectedOption === 'specific_users' ? emails.split(',').map(e => e.trim()).filter(e => e) : undefined,
      password: selectedOption === 'private' && requirePassword ? password : undefined,
    });
    toast({ title: "Sharing Updated (Simulated)", description: "Sharing settings have been logged to console." });
    onOpenChange(false);
  };

  const handleCopyLink = () => {
    if (workflowLink) {
      navigator.clipboard.writeText(workflowLink)
        .then(() => {
          toast({ title: "Link Copied!", description: "Workflow link copied to clipboard." });
        })
        .catch(err => {
          toast({ title: "Copy Failed", description: "Could not copy link.", variant: "destructive" });
          console.error('Failed to copy link: ', err);
        });
    }
  };

  if (!workflow) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Share "{workflow.name}"
          </DialogTitle>
          <DialogDescription>
            Choose how you want to share this workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="flex items-center space-x-2 bg-muted p-3 rounded-md">
            <Link2 className="h-5 w-5 text-muted-foreground" />
            <Input
              id="workflow-link"
              value={workflowLink}
              readOnly
              className="flex-grow bg-background border-border"
            />
            <Button variant="outline" size="sm" onClick={handleCopyLink}>
              Copy link
            </Button>
          </div>

          <RadioGroup value={selectedOption} onValueChange={(value) => setSelectedOption(value as SharingOption)}>
            <div className="space-y-3">
              <Label className="flex items-center p-3 rounded-md border hover:bg-muted/50 cursor-pointer data-[state=checked]:border-primary data-[state=checked]:ring-1 data-[state=checked]:ring-primary">
                <RadioGroupItem value="public" id="public" className="mr-3" />
                <Globe className="h-5 w-5 mr-2 text-blue-500" />
                <div>
                  <span className="font-medium">Public</span>
                  <p className="text-xs text-muted-foreground">Anyone with the link can view.</p>
                </div>
              </Label>

              <Label className="flex items-center p-3 rounded-md border hover:bg-muted/50 cursor-pointer data-[state=checked]:border-primary data-[state=checked]:ring-1 data-[state=checked]:ring-primary">
                <RadioGroupItem value="private" id="private" className="mr-3" />
                <Lock className="h-5 w-5 mr-2 text-orange-500" />
                <div>
                  <span className="font-medium">Private</span>
                  <p className="text-xs text-muted-foreground">Only you (or with password) can view.</p>
                </div>
              </Label>

              {selectedOption === 'private' && (
                <div className="pl-10 space-y-3 border-l-2 border-dashed ml-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="require-password"
                      checked={requirePassword}
                      onCheckedChange={setRequirePassword}
                    />
                    <Label htmlFor="require-password">Require password</Label>
                  </div>
                  {requirePassword && (
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="pr-10 bg-background"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              <Label className="flex items-center p-3 rounded-md border hover:bg-muted/50 cursor-pointer data-[state=checked]:border-primary data-[state=checked]:ring-1 data-[state=checked]:ring-primary">
                <RadioGroupItem value="specific_users" id="specific_users" className="mr-3" />
                <Mail className="h-5 w-5 mr-2 text-green-500" />
                <div>
                  <span className="font-medium">Specific people</span>
                  <p className="text-xs text-muted-foreground">Only people with specified email addresses.</p>
                </div>
              </Label>
              {selectedOption === 'specific_users' && (
                 <div className="pl-10 border-l-2 border-dashed ml-4 py-3">
                  <Label htmlFor="emails" className="text-sm font-medium">Email addresses (comma-separated)</Label>
                  <Input
                    id="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="user1@example.com, user2@example.com"
                    className="mt-1 bg-background"
                  />
                </div>
              )}
            </div>
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare}>Save Sharing Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
