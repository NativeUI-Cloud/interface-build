
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WorkflowIcon, LayoutTemplate, ShapesIcon } from 'lucide-react';

interface StartupChoiceModalProps {
  isOpen: boolean;
  onChoice: (choice: 'builder' | 'landing') => void;
  onOpenChange: (isOpen: boolean) => void; 
}

export default function StartupChoiceModal({ isOpen, onChoice, onOpenChange }: StartupChoiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card text-foreground">
        <DialogHeader className="text-center pt-2">
          <div className="flex justify-center mb-3">
            <ShapesIcon className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold">Welcome to NativeUI Builder</DialogTitle>
          <DialogDescription className="mt-1 text-muted-foreground">
            How would you like to start today?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-2">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center space-y-2 text-center hover:bg-accent/10 focus-visible:ring-primary"
            onClick={() => onChoice('builder')}
          >
            <WorkflowIcon className="h-10 w-10 text-primary mb-2" />
            <span className="font-semibold text-base text-foreground">Use the Builder</span>
            {/* Subtitle removed */}
          </Button>
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center justify-center space-y-2 text-center hover:bg-accent/10 focus-visible:ring-primary"
            onClick={() => onChoice('landing')}
          >
            <LayoutTemplate className="h-10 w-10 text-primary mb-2" />
            <span className="font-semibold text-base text-foreground">Create Landing Page</span>
            {/* Subtitle removed */}
          </Button>
        </div>
        {/* No explicit footer buttons, choices above are the actions. The standard 'X' close will be handled by onOpenChange. */}
      </DialogContent>
    </Dialog>
  );
}
