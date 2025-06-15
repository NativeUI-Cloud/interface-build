
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { WorkflowIcon, LayoutTemplate, BotIcon, ShapesIcon } from 'lucide-react';

interface StartupChoiceModalProps {
  isOpen: boolean;
  onChoice: (choice: 'builder' | 'landing' | 'aiCodeChat') => void;
  onOpenChange: (isOpen: boolean) => void;
}

export default function StartupChoiceModal({ isOpen, onChoice, onOpenChange }: StartupChoiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-foreground">
        <DialogHeader className="text-center pt-2">
          <div className="flex justify-center mb-3">
            <ShapesIcon className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold">Welcome to NativeUI Builder</DialogTitle>
          <DialogDescription className="mt-1 text-muted-foreground">
            How would you like to start today?
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-1"> {/* Changed to 1 col for better stacking */}
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center space-y-2 text-center hover:bg-accent/10 focus-visible:ring-primary"
            onClick={() => onChoice('builder')}
          >
            <WorkflowIcon className="h-8 w-8 text-primary mb-1.5" />
            <span className="font-semibold text-base text-foreground">Automation</span>
            <span className="text-xs text-muted-foreground px-2">Build & manage AI agent workflows</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center space-y-2 text-center hover:bg-accent/10 focus-visible:ring-primary"
            onClick={() => onChoice('landing')}
          >
            <LayoutTemplate className="h-8 w-8 text-primary mb-1.5" />
            <span className="font-semibold text-base text-foreground">Landing Page Builder</span>
            <span className="text-xs text-muted-foreground px-2">Visually design landing pages</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center justify-center space-y-2 text-center hover:bg-accent/10 focus-visible:ring-primary"
            onClick={() => onChoice('aiCodeChat')}
          >
            <BotIcon className="h-8 w-8 text-primary mb-1.5" />
            <span className="font-semibold text-base text-foreground">AI Code Chat</span>
            <span className="text-xs text-muted-foreground px-2">Generate Next.js code with AI</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
