
'use client';

import { useState, useEffect, useRef } from 'react';
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
import { PlusCircle, Trash2, UserCircle, ImageIcon, Palette, FileText, UploadCloud, Link as LinkIcon, Info } from 'lucide-react';
import type { Review } from './MarqueeDemo'; // Import the Review type
import { v4 as uuidv4 } from 'uuid';
import Image from "next/image";

interface EditMarqueeModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialReviews: Review[];
  onUpdate: (updatedReviews: Review[]) => void;
}

export default function EditMarqueeModal({
  isOpen,
  onOpenChange,
  initialReviews,
  onUpdate,
}: EditMarqueeModalProps) {
  const [editableReviews, setEditableReviews] = useState<Review[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);


  useEffect(() => {
    if (isOpen) {
      // Ensure each review has an ID when modal opens
      const reviewsWithIds = (initialReviews || []).map(review => ({
        ...review,
        id: review.id || uuidv4(), // Assign an ID if it doesn't have one
      }));
      setEditableReviews(JSON.parse(JSON.stringify(reviewsWithIds)));
      fileInputRefs.current = reviewsWithIds.map(() => null);
    }
  }, [isOpen, initialReviews]);

  const handleReviewChange = (index: number, field: keyof Review, value: string | undefined) => {
    const newReviews = [...editableReviews];
    if (newReviews[index]) {
      if ((field === 'cardBackgroundColor' && (value === '#ffffff' || !value)) ||
          (field === 'cardTextColor' && (value === '#000000' || !value))) {
        (newReviews[index] as any)[field] = undefined;
      } else {
        (newReviews[index] as any)[field] = value;
      }
      setEditableReviews(newReviews);
      onUpdate(newReviews);
    }
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>, reviewIndex: number) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleReviewChange(reviewIndex, 'img', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = (reviewIndex: number) => {
    fileInputRefs.current[reviewIndex]?.click();
  };

  const handleAddReview = () => {
    const newReviewList = [
      ...editableReviews,
      {
        id: uuidv4(), // Assign a unique ID to the new review
        name: 'New Reviewer',
        username: `@new_${uuidv4().substring(0, 7)}`,
        body: 'Awesome product!',
        img: `https://avatar.vercel.sh/new_${uuidv4().substring(0,8)}?size=48`,
        cardBackgroundColor: undefined,
        cardTextColor: undefined,
      },
    ];
    setEditableReviews(newReviewList);
    fileInputRefs.current.push(null);
    onUpdate(newReviewList);
  };

  const handleRemoveReview = (indexToRemove: number) => {
    const newReviewList = editableReviews.filter((_, index) => index !== indexToRemove);
    setEditableReviews(newReviewList);
    fileInputRefs.current.splice(indexToRemove, 1);
    onUpdate(newReviewList);
  };

  const handleCloseModal = () => {
    onOpenChange(false);
  };

  const isDataURI = (str: string) => str.startsWith('data:image');

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-card text-foreground p-0 flex flex-col max-h-[85vh] overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold">Edit Marquee Testimonials</DialogTitle>
          <DialogDescription>Modify the content and appearance of the reviews. Changes are reflected live on the canvas.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow min-h-0">
          <div className="space-y-6 p-6">
            {editableReviews.map((review, index) => (
              <div key={review.id} className="p-4 border rounded-lg shadow-sm bg-background/70 space-y-3 relative">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-md font-semibold text-foreground">Review #{index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemoveReview(index)}
                    aria-label="Remove review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label htmlFor={`name-${index}`} className="flex items-center text-sm"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground"/> Name</Label>
                        <Input
                        id={`name-${index}`}
                        value={review.name}
                        onChange={(e) => handleReviewChange(index, 'name', e.target.value)}
                        placeholder="Reviewer's Name"
                        className="bg-card"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`username-${index}`} className="flex items-center text-sm"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground"/> Username</Label>
                        <Input
                        id={`username-${index}`}
                        value={review.username}
                        onChange={(e) => handleReviewChange(index, 'username', e.target.value)}
                        placeholder="@username"
                        className="bg-card"
                        />
                    </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`body-${index}`} className="flex items-center text-sm"><FileText className="mr-2 h-4 w-4 text-muted-foreground"/> Body</Label>
                  <Textarea
                    id={`body-${index}`}
                    value={review.body}
                    onChange={(e) => handleReviewChange(index, 'body', e.target.value)}
                    placeholder="Review text..."
                    className="bg-card min-h-[80px]"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center text-sm"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground"/> Avatar Image</Label>
                  <div className="flex items-center gap-3 p-3 border rounded-md bg-card">
                    {review.img ? (
                      <Image
                        src={review.img}
                        alt={`Avatar of ${review.name}`}
                        width={48}
                        height={48}
                        className="rounded-full object-cover border"
                        data-ai-hint="user avatar"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector('.avatar-placeholder')) {
                            const placeholder = document.createElement('div');
                            placeholder.className = 'avatar-placeholder w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs';
                            placeholder.innerText = review.name?.[0]?.toUpperCase() || '?';
                            parent.insertBefore(placeholder, target);
                          }
                        }}
                      />
                    ) : (
                        <div className="avatar-placeholder w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                          {review.name?.[0]?.toUpperCase() || '?'}
                        </div>
                     )}
                    <div className="flex-grow space-y-1.5">
                      <Input
                        id={`img-url-${index}`}
                        value={isDataURI(review.img) ? '(Uploaded Image)' : review.img}
                        onChange={(e) => !isDataURI(review.img) && handleReviewChange(index, 'img', e.target.value)}
                        placeholder="https://example.com/avatar.png or Upload"
                        className="bg-background"
                        disabled={isDataURI(review.img)}
                      />
                       <input
                        type="file"
                        accept="image/*"
                        ref={el => fileInputRefs.current[index] = el}
                        onChange={(e) => handleImageFileChange(e, index)}
                        className="hidden"
                        id={`file-input-${index}`}
                      />
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => triggerImageUpload(index)}>
                          <UploadCloud className="mr-2 h-4 w-4"/> {isDataURI(review.img) ? 'Change Upload' : 'Upload Image'}
                        </Button>
                        {isDataURI(review.img) && (
                           <Button variant="outline" size="sm" onClick={() => handleReviewChange(index, 'img', `https://avatar.vercel.sh/${review.username || review.name || 'placeholder'}?size=48` )}>
                             <LinkIcon className="mr-2 h-4 w-4"/> Use URL Instead
                           </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <Label htmlFor={`cardBgColor-${index}`} className="flex items-center text-sm"><Palette className="mr-2 h-4 w-4 text-muted-foreground"/> Card Background</Label>
                        <Input
                            id={`cardBgColor-${index}`}
                            type="color"
                            value={review.cardBackgroundColor || '#ffffff'}
                            onChange={(e) => handleReviewChange(index, 'cardBackgroundColor', e.target.value)}
                            className="bg-card w-full h-10 p-1"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor={`cardTextColor-${index}`} className="flex items-center text-sm"><Palette className="mr-2 h-4 w-4 text-muted-foreground"/> Card Text Color</Label>
                        <Input
                            id={`cardTextColor-${index}`}
                            type="color"
                            value={review.cardTextColor || '#000000'}
                            onChange={(e) => handleReviewChange(index, 'cardTextColor', e.target.value)}
                            className="bg-card w-full h-10 p-1"
                        />
                    </div>
                </div>
                 { (review.cardBackgroundColor || review.cardTextColor) &&
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                        handleReviewChange(index, 'cardBackgroundColor', undefined);
                        handleReviewChange(index, 'cardTextColor', undefined);
                    }}>Reset Card Colors</Button>
                }
              </div>
            ))}
             {editableReviews.length === 0 && (
                <p className="text-center text-muted-foreground py-6">No reviews yet. Add one to get started!</p>
             )}
          </div>
        </ScrollArea>

        <div className="px-6 py-4 border-t bg-muted/30 flex-shrink-0">
            <Button variant="outline" onClick={handleAddReview} size="sm">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Review
            </Button>
        </div>

        <DialogFooter className="p-6 border-t flex-shrink-0">
          <Button variant="default" onClick={handleCloseModal}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
