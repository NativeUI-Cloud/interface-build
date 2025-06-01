
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
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PanelTop, Image as ImageIcon, Palette, Link as LinkIconLucide, PlusCircle, Trash2, GripVertical, Layers, Paintbrush } from 'lucide-react';
import type { HeaderElementData, NavLinkItem, HeaderLayout } from '@/lib/types';
import { headerTemplates } from '@/lib/headerTemplates';
import type { HeaderTemplate } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

interface EditHeaderModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: HeaderElementData;
  onUpdate: (updatedData: HeaderElementData) => void;
}

const layoutOptions: { value: HeaderLayout; label: string }[] = [
  { value: 'logo-left-nav-right', label: 'Logo Left, Nav Right' },
  { value: 'logo-center-nav-split', label: 'Logo Center, Nav Split' },
  { value: 'logo-center-nav-below', label: 'Logo Center, Nav Below' },
  { value: 'logo-left-nav-left-actions-right', label: 'Logo Left, Nav Left, Actions Right' },
  { value: 'nav-left-logo-center-actions-right', label: 'Nav Left, Logo Center, Actions Right'},
];


export default function EditHeaderModal({
  isOpen,
  onOpenChange,
  initialData,
  onUpdate,
}: EditHeaderModalProps) {
  const [editableData, setEditableData] = useState<HeaderElementData>(initialData);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(initialData?.templateId || 'custom');

  useEffect(() => {
    if (isOpen) {
      const dataToEdit = JSON.parse(JSON.stringify(initialData || {}));
      if (!dataToEdit.navLinks) {
        dataToEdit.navLinks = [];
      } else {
        dataToEdit.navLinks = dataToEdit.navLinks.map((link: NavLinkItem) => ({
          ...link,
          id: link.id || uuidv4(),
        }));
      }
      setEditableData(dataToEdit);
      setSelectedTemplateId(dataToEdit.templateId || 'custom');
    }
  }, [isOpen, initialData]);

  const handleChange = (field: keyof HeaderElementData, value: any) => {
    const newData = { ...editableData, [field]: value };
    setEditableData(newData);
    onUpdate(newData);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (templateId === 'custom') {
      handleChange('templateId', undefined);
      // Optionally reset to some defaults or keep current custom values
    } else {
      const template = headerTemplates.find(t => t.id === templateId);
      if (template) {
        const templateDataWithIds = {
          ...template.data,
          navLinks: (template.data.navLinks || []).map(link => ({...link, id: uuidv4()})),
          templateId: templateId, // Store the selected template ID
        };
        setEditableData(templateDataWithIds as HeaderElementData);
        onUpdate(templateDataWithIds as HeaderElementData);
      }
    }
  };

  const handleNavLinkChange = (index: number, field: keyof NavLinkItem, value: any) => {
    const newNavLinks = [...(editableData.navLinks || [])];
    if (newNavLinks[index]) {
      (newNavLinks[index] as any)[field] = value;
      handleChange('navLinks', newNavLinks);
    }
  };

  const handleAddNavLink = () => {
    const newLink: NavLinkItem = { id: uuidv4(), text: 'New Link', href: '#', isButton: false };
    const newNavLinks = [...(editableData.navLinks || []), newLink];
    handleChange('navLinks', newNavLinks);
  };

  const handleRemoveNavLink = (indexToRemove: number) => {
    const newNavLinks = (editableData.navLinks || []).filter((_, index) => index !== indexToRemove);
    handleChange('navLinks', newNavLinks);
  };
  
  const handleCloseModal = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl bg-card text-foreground p-0 flex flex-col h-[600px] overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-xl font-semibold flex items-center">
            <PanelTop className="mr-2 h-5 w-5 text-primary" />
            Edit Header Element
          </DialogTitle>
          <DialogDescription>
            Customize the header's appearance and navigation. Changes are reflected live.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-grow min-h-0">
          <div className="space-y-6 p-6">
            <div className="space-y-1">
              <Label htmlFor="headerTemplate" className="text-sm flex items-center">
                 <Layers className="mr-2 h-4 w-4 text-muted-foreground" /> Select Template (Optional)
              </Label>
              <Select value={selectedTemplateId} onValueChange={handleTemplateChange}>
                <SelectTrigger id="headerTemplate" className="bg-background">
                  <SelectValue placeholder="Choose a template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="custom">Custom Configuration</SelectItem>
                  {headerTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      <div className="flex items-center">
                        {template.icon && <template.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                        {template.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplateId !== 'custom' && headerTemplates.find(t=>t.id === selectedTemplateId) && (
                 <p className="text-xs text-muted-foreground mt-1">
                    {headerTemplates.find(t=>t.id === selectedTemplateId)?.description}
                 </p>
              )}
            </div>
            
            <div className="space-y-1">
              <Label htmlFor="siteTitle" className="text-sm">Site Title</Label>
              <Input
                id="siteTitle"
                value={editableData.siteTitle || ''}
                onChange={(e) => handleChange('siteTitle', e.target.value)}
                placeholder="Your Site Name"
                className="bg-background"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="logoUrl" className="flex items-center text-sm">
                <ImageIcon className="mr-2 h-4 w-4 text-muted-foreground" /> Logo URL (Optional)
              </Label>
              <Input
                id="logoUrl"
                value={editableData.logoUrl || ''}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="https://example.com/logo.png"
                className="bg-background"
              />
               <p className="text-xs text-muted-foreground">If a logo URL is provided, it will be displayed instead of the Site Title text.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="backgroundColor" className="flex items-center text-sm">
                  <Palette className="mr-2 h-4 w-4 text-muted-foreground" /> Background Color Class
                </Label>
                <Input
                  id="backgroundColor"
                  value={editableData.backgroundColor || 'bg-background'}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                  placeholder="e.g., bg-blue-500 or bg-transparent"
                  className="bg-background"
                />
                 <p className="text-xs text-muted-foreground">Tailwind CSS background color. Overridden by gradient.</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="textColor" className="flex items-center text-sm">
                  <Palette className="mr-2 h-4 w-4 text-muted-foreground" /> Text Color Class
                </Label>
                <Input
                  id="textColor"
                  value={editableData.textColor || 'text-foreground'}
                  onChange={(e) => handleChange('textColor', e.target.value)}
                  placeholder="e.g., text-white"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">Tailwind CSS text color.</p>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="gradientClass" className="flex items-center text-sm">
                <Paintbrush className="mr-2 h-4 w-4 text-muted-foreground" /> Background Gradient Class (Optional)
              </Label>
              <Input
                id="gradientClass"
                value={editableData.gradientClass || ''}
                onChange={(e) => handleChange('gradientClass', e.target.value)}
                placeholder="e.g., bg-gradient-to-r from-purple-500 to-pink-500"
                className="bg-background"
              />
              <p className="text-xs text-muted-foreground">Overrides Background Color Class if set.</p>
            </div>

             <div className="space-y-1">
              <Label htmlFor="headerLayout" className="text-sm">Header Layout</Label>
              <Select
                value={editableData.layout || 'logo-left-nav-right'}
                onValueChange={(value) => handleChange('layout', value as HeaderLayout)}
              >
                <SelectTrigger id="headerLayout" className="bg-background">
                  <SelectValue placeholder="Select layout" />
                </SelectTrigger>
                <SelectContent>
                  {layoutOptions.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>


            <div className="flex items-center space-x-2">
              <Switch
                id="stickyHeader"
                checked={editableData.sticky || false}
                onCheckedChange={(checked) => handleChange('sticky', checked)}
              />
              <Label htmlFor="stickyHeader" className="text-sm">Sticky Header</Label>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">Navigation Links</Label>
              {(editableData.navLinks || []).map((link, index) => (
                <div key={link.id || index} className="p-3 border rounded-md bg-background/50 space-y-2">
                  <div className="flex items-center justify-between">
                     <Label htmlFor={`navText-${index}`} className="text-xs font-medium flex items-center">
                        <GripVertical className="mr-1 h-3 w-3 text-muted-foreground cursor-move" /> Link #{index + 1}
                    </Label>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:bg-destructive/10" onClick={() => handleRemoveNavLink(index)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor={`navText-${index}`} className="text-xs">Text</Label>
                      <Input
                        id={`navText-${index}`}
                        value={link.text}
                        onChange={(e) => handleNavLinkChange(index, 'text', e.target.value)}
                        className="bg-card h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`navHref-${index}`} className="text-xs">URL (href)</Label>
                      <Input
                        id={`navHref-${index}`}
                        value={link.href}
                        onChange={(e) => handleNavLinkChange(index, 'href', e.target.value)}
                        className="bg-card h-9 text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Switch
                      id={`navIsButton-${index}`}
                      checked={link.isButton || false}
                      onCheckedChange={(checked) => handleNavLinkChange(index, 'isButton', checked)}
                    />
                    <Label htmlFor={`navIsButton-${index}`} className="text-xs">Display as button</Label>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddNavLink} className="mt-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Nav Link
              </Button>
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
