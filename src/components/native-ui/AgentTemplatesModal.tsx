
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import ActionListItem from './ActionListItem';
import type { AgentTemplate } from '@/lib/types';
import { agentTemplates } from '@/lib/agentTemplates';
import { LayoutGrid } from 'lucide-react';

interface AgentTemplatesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onTemplateSelect: (templateId: string) => void;
}

export default function AgentTemplatesModal({
  isOpen,
  onOpenChange,
  onTemplateSelect,
}: AgentTemplatesModalProps) {
  const handleSelect = (templateId: string) => {
    onTemplateSelect(templateId);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card text-foreground p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl font-semibold">AI Agent Templates</DialogTitle>
          </div>
          <DialogDescription>
            Select a template to quickly create a pre-configured AI Agent.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] p-2">
          <div className="space-y-1 p-4">
            {agentTemplates.map((template) => (
              <ActionListItem
                key={template.id}
                icon={template.icon || LayoutGrid} // Fallback icon
                title={template.name}
                description={template.description}
                onClick={() => handleSelect(template.id)}
                className="hover:bg-accent/10"
              />
            ))}
            {agentTemplates.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No agent templates available.</p>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="p-6 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
