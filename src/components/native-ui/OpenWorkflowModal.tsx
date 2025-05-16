
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
import { ScrollArea } from '@/components/ui/scroll-area';
import ActionListItem from './ActionListItem';
import type { Workflow } from '@/lib/types';
import * as workflowStore from '@/lib/workflowStore';
import { FolderOpen, Search, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OpenWorkflowModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onWorkflowSelect: (workflowId: string) => void;
  onWorkflowDelete: (workflowId: string) => void; // Callback to inform parent about deletion
  currentWorkflowId: string | null | undefined;
}

export default function OpenWorkflowModal({
  isOpen,
  onOpenChange,
  onWorkflowSelect,
  onWorkflowDelete,
  currentWorkflowId,
}: OpenWorkflowModalProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadWorkflows();
      setSearchTerm(''); // Reset search on open
    }
  }, [isOpen]);

  const loadWorkflows = () => {
    const allWorkflows = workflowStore.getAllWorkflows();
    // Sort by updatedAt descending to show recent workflows first
    allWorkflows.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    setWorkflows(allWorkflows);
  };

  const handleSelect = (workflowId: string) => {
    onWorkflowSelect(workflowId);
    onOpenChange(false);
  };

  const handleDeleteClick = (workflow: Workflow, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent ActionListItem's onClick
    setWorkflowToDelete(workflow);
  };

  const confirmDelete = () => {
    if (workflowToDelete) {
      onWorkflowDelete(workflowToDelete.id); // Inform parent
      loadWorkflows(); // Re-fetch workflows to update the list
      toast({ title: "Workflow Deleted", description: `"${workflowToDelete.name}" has been deleted.` });
      setWorkflowToDelete(null); // Close alert dialog
    }
  };

  const filteredWorkflows = useMemo(() => {
    if (!searchTerm) return workflows;
    return workflows.filter(
      (wf) =>
        wf.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, workflows]);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-card text-foreground p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-6 w-6 text-primary" />
              <DialogTitle className="text-xl font-semibold">Open Workflow</DialogTitle>
            </div>
            <DialogDescription>Select a workflow to open or manage your existing workflows.</DialogDescription>
          </DialogHeader>
          
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search workflows..."
                className="pl-9 bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="h-[50vh] p-2">
            {filteredWorkflows.length === 0 && (
              <div className="text-center text-muted-foreground p-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium">No workflows found</h3>
                <p className="text-sm">
                  {searchTerm ? `No workflows match "${searchTerm}".` : "You haven't created any workflows yet."}
                </p>
              </div>
            )}
            <div className="space-y-1 p-2">
              {filteredWorkflows.map((wf) => (
                <ActionListItem
                  key={wf.id}
                  icon={FileText}
                  title={wf.name}
                  description={`Last updated: ${new Date(wf.updatedAt).toLocaleDateString()}`}
                  onClick={() => handleSelect(wf.id)}
                  className={wf.id === currentWorkflowId ? 'bg-accent/20 border-accent ring-1 ring-accent' : ''}
                  actionButton={
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={(e) => handleDeleteClick(wf, e)}
                        aria-label={`Delete workflow ${wf.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              ))}
            </div>
          </ScrollArea>

          <DialogFooter className="p-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {workflowToDelete && (
        <AlertDialog open={!!workflowToDelete} onOpenChange={() => setWorkflowToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete "{workflowToDelete.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the workflow.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setWorkflowToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
