
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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Film, Image as ImageIcon, Type, SlidersHorizontal, Info } from 'lucide-react';
import type { HeroVideoData } from '@/lib/types';

interface EditHeroVideoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: HeroVideoData;
  onUpdate: (updatedData: HeroVideoData) => void;
}

const animationStyles: HeroVideoData['animationStyle'][] = [
  'from-left',
  'from-right',
  'from-top',
  'from-bottom',
  'from-center',
  'none',
];

export default function EditHeroVideoModal({
  isOpen,
  onOpenChange,
  initialData,
  onUpdate,
}: EditHeroVideoModalProps) {
  const [editableData, setEditableData] = useState<HeroVideoData>(initialData);

  useEffect(() => {
    if (isOpen) {
      setEditableData(JSON.parse(JSON.stringify(initialData || {})));
    }
  }, [isOpen, initialData]);

  const handleChange = (field: keyof HeroVideoData, value: string) => {
    const newData = { ...editableData, [field]: value };
    setEditableData(newData);
    onUpdate(newData);
  };

  const handleCloseModal = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card text-foreground p-0 flex flex-col max-h-[85vh]">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center">
            <Film className="mr-2 h-5 w-5 text-primary" />
            Edit Hero Video
          </DialogTitle>
          <DialogDescription>
            Modify the video source, thumbnails, and animation. Changes are reflected live.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow min-h-0">
          <div className="space-y-4 p-6">
            <div className="space-y-1">
              <Label htmlFor="videoSrc" className="flex items-center text-sm">
                <Film className="mr-2 h-4 w-4 text-muted-foreground" /> Video Source URL
              </Label>
              <Input
                id="videoSrc"
                value={editableData.videoSrc || ''}
                onChange={(e) => handleChange('videoSrc', e.target.value)}
                placeholder="e.g., https://www.youtube.com/embed/your-video-id"
                className="bg-background"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="thumbnailSrcLight" className="flex items-center text-sm">
                <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Thumbnail URL (Light Mode)
              </Label>
              <Input
                id="thumbnailSrcLight"
                value={editableData.thumbnailSrcLight || ''}
                onChange={(e) => handleChange('thumbnailSrcLight', e.target.value)}
                placeholder="https://example.com/thumbnail-light.png"
                className="bg-background"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="thumbnailSrcDark" className="flex items-center text-sm">
                <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Thumbnail URL (Dark Mode)
              </Label>
              <Input
                id="thumbnailSrcDark"
                value={editableData.thumbnailSrcDark || ''}
                onChange={(e) => handleChange('thumbnailSrcDark', e.target.value)}
                placeholder="https://example.com/thumbnail-dark.png"
                className="bg-background"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="thumbnailAlt" className="flex items-center text-sm">
                <Type className="mr-2 h-4 w-4 text-muted-foreground" /> Thumbnail Alt Text
              </Label>
              <Input
                id="thumbnailAlt"
                value={editableData.thumbnailAlt || ''}
                onChange={(e) => handleChange('thumbnailAlt', e.target.value)}
                placeholder="Descriptive text for the thumbnail"
                className="bg-background"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="animationStyle" className="flex items-center text-sm">
                <SlidersHorizontal className="mr-2 h-4 w-4 text-muted-foreground" /> Animation Style
              </Label>
              <Select
                value={editableData.animationStyle || 'none'}
                onValueChange={(value) => handleChange('animationStyle', value as HeroVideoData['animationStyle'])}
              >
                <SelectTrigger id="animationStyle" className="bg-background">
                  <SelectValue placeholder="Select animation style" />
                </SelectTrigger>
                <SelectContent>
                  {animationStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t flex-shrink-0">
          <Button variant="default" onClick={handleCloseModal}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
