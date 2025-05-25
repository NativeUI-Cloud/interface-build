
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, // Added if you want a description
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ElementPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  elementName?: string;
  children?: React.ReactNode; // This will be the previewComponent
}

export default function ElementPreviewModal({
  isOpen,
  onOpenChange,
  elementName,
  children,
}: ElementPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[80vh] bg-card text-foreground p-0 flex flex-col">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            Preview: {elementName || 'Component'}
          </DialogTitle>
          {/* Optional: You can add a DialogDescription here if needed */}
        </DialogHeader>
        <ScrollArea className="flex-grow p-4 overflow-auto">
          <div className="w-full h-full flex items-center justify-center">
            {children}
          </div>
        </ScrollArea>
        {/* Footer can be added if needed for actions like "Insert Component" */}
      </DialogContent>
    </Dialog>
  );
}
