
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
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PlusCircle, Trash2, Type, Clock, Palette, TerminalSquareIcon } from 'lucide-react';
import type { TerminalLine } from './TerminalDemo'; // Assuming TerminalLine is exported
import { v4 as uuidv4 } from 'uuid';

interface EditTerminalModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialLines: TerminalLine[];
  onUpdate: (updatedLines: TerminalLine[]) => void;
}

export default function EditTerminalModal({
  isOpen,
  onOpenChange,
  initialLines,
  onUpdate,
}: EditTerminalModalProps) {
  const [editableLines, setEditableLines] = useState<TerminalLine[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Deep copy to avoid direct mutation, ensure unique IDs if missing
      setEditableLines(
        JSON.parse(JSON.stringify(initialLines || [])).map((line: TerminalLine) => ({
          ...line,
          id: line.id || uuidv4(),
          delay: line.delay === undefined ? 0 : Number(line.delay),
          className: line.className || '',
        }))
      );
    }
  }, [isOpen, initialLines]);

  const handleLineChange = (index: number, field: keyof TerminalLine, value: string | number) => {
    const newLines = [...editableLines];
    if (newLines[index]) {
      (newLines[index] as any)[field] = field === 'delay' ? Number(value) : value;
      setEditableLines(newLines);
      onUpdate(newLines);
    }
  };

  const handleAddLine = () => {
    const newLines = [
      ...editableLines,
      {
        id: uuidv4(),
        type: 'typing' as 'typing' | 'animated',
        text: 'New line...',
        delay: 0,
        className: '',
      },
    ];
    setEditableLines(newLines);
    onUpdate(newLines);
  };

  const handleRemoveLine = (indexToRemove: number) => {
    const newLines = editableLines.filter((_, index) => index !== indexToRemove);
    setEditableLines(newLines);
    onUpdate(newLines);
  };

  const handleCloseModal = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-card text-foreground p-0 flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center">
            <TerminalSquareIcon className="mr-2 h-5 w-5 text-primary" />
            Edit Terminal Animation Lines
          </DialogTitle>
          <DialogDescription>
            Modify the text, type, delay, and style for each line. Changes are reflected live.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow min-h-0">
          <div className="space-y-6 p-6">
            {editableLines.map((line, index) => (
              <div key={line.id} className="p-4 border rounded-lg shadow-sm bg-background/70 space-y-3 relative">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold text-foreground">Line #{index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveLine(index)}
                    aria-label="Remove line"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <Label htmlFor={`line-text-${index}`} className="flex items-center text-sm">
                    <Type className="mr-2 h-4 w-4 text-muted-foreground" /> Text
                  </Label>
                  <Textarea
                    id={`line-text-${index}`}
                    value={line.text as string} // Assuming text is editable as string
                    onChange={(e) => handleLineChange(index, 'text', e.target.value)}
                    placeholder="Enter line text..."
                    className="bg-card min-h-[60px]"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor={`line-type-${index}`} className="flex items-center text-sm"> Line Type</Label>
                    <Select
                      value={line.type}
                      onValueChange={(value) => handleLineChange(index, 'type', value as 'typing' | 'animated')}
                    >
                      <SelectTrigger id={`line-type-${index}`} className="bg-card">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="typing">Typing Animation</SelectItem>
                        <SelectItem value="animated">Animated Span</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`line-delay-${index}`} className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" /> Delay (ms)
                    </Label>
                    <Input
                      id={`line-delay-${index}`}
                      type="number"
                      value={line.delay || 0}
                      onChange={(e) => handleLineChange(index, 'delay', parseInt(e.target.value, 10) || 0)}
                      className="bg-card"
                      min="0"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`line-classname-${index}`} className="flex items-center text-sm">
                      <Palette className="mr-2 h-4 w-4 text-muted-foreground" /> ClassName (Styling)
                    </Label>
                    <Input
                      id={`line-classname-${index}`}
                      value={line.className || ''}
                      onChange={(e) => handleLineChange(index, 'className', e.target.value)}
                      placeholder="e.g., text-green-500"
                      className="bg-card"
                    />
                  </div>
                </div>
              </div>
            ))}
            {editableLines.length === 0 && (
              <p className="text-center text-muted-foreground py-6">No lines yet. Add one to get started!</p>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-muted/30 flex-shrink-0">
          <Button variant="outline" onClick={handleAddLine} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Line
          </Button>
        </div>

        <DialogFooter className="p-6 border-t flex-shrink-0">
          <Button variant="default" onClick={handleCloseModal}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
