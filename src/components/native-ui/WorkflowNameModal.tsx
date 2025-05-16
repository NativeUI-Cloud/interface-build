
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
import { WorkflowIcon } from 'lucide-react';

interface WorkflowNameModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (name: string) => void;
  initialName?: string;
  isCreatingNew?: boolean; // Added prop
}

export default function WorkflowNameModal({
  isOpen,
  onOpenChange,
  onSave,
  initialName = '',
  isCreatingNew = false, // Default to false
}: WorkflowNameModalProps) {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (isOpen) {
      setName(initialName || (isCreatingNew ? 'My New Workflow' : ''));
    }
  }, [isOpen, initialName, isCreatingNew]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onOpenChange(false);
    }
  };

  const dialogTitle = isCreatingNew ? "Create New Workflow" : "Workflow Name";
  const dialogDescription = isCreatingNew 
    ? "Please enter a name for your new workflow."
    : "Please enter a name for your workflow.";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && !name.trim() && !isCreatingNew && !initialName) {
        // If closing an initial, empty name prompt, do nothing to prevent auto-save of empty
      } else {
        onOpenChange(open);
      }
    }}>
      <DialogContent className="sm:max-w-md bg-card text-foreground">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <WorkflowIcon className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl">{dialogTitle}</DialogTitle>
          </div>
          <DialogDescription>
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          <Label htmlFor="workflow-name" className="text-sm">Name</Label>
          <Input
            id="workflow-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Customer Onboarding Flow"
            className="bg-background"
            onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          />
        </div>
        <DialogFooter>
          {isCreatingNew && (
             <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isCreatingNew ? 'Create Workflow' : 'Save Workflow'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
