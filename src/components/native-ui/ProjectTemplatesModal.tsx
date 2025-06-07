
'use client';

import React, { useState } from 'react';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { ProjectData, LandingPageTemplate } from '@/lib/types';
import { landingPageTemplates } from '@/lib/landingPageTemplates';
import { LayoutGrid, PlusCircle } from 'lucide-react';
import NextImage from 'next/image'; // Import NextImage

interface ProjectTemplatesModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onTemplateSelect: (templateProjectData: Omit<ProjectData, 'id' | 'lastModified'>, templateName: string) => void;
}

export default function ProjectTemplatesModal({
  isOpen,
  onOpenChange,
  onTemplateSelect,
}: ProjectTemplatesModalProps) {
  const [searchTerm, setSearchTerm] = useState(''); // For future search functionality

  const filteredTemplates = landingPageTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-card text-foreground p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <DialogTitle className="text-xl font-semibold">Choose a Landing Page Template</DialogTitle>
          </div>
          <DialogDescription>
            Select a template to get started quickly. You can customize it fully afterwards.
          </DialogDescription>
        </DialogHeader>

        {/* Placeholder for search input if needed in future */}
        {/* <div className="p-4 border-b">
          <Input placeholder="Search templates..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div> */}

        <ScrollArea className="h-[60vh] p-4">
          {filteredTemplates.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No templates match your search.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => {
                const IconComponent = template.icon || LayoutGrid;
                let dataAiHint = "template preview";
                if (template.name.toLowerCase().includes("saas")) dataAiHint = "saas dashboard";
                if (template.name.toLowerCase().includes("portfolio")) dataAiHint = "portfolio design";
                if (template.name.toLowerCase().includes("web3")) dataAiHint = "crypto dashboard";
                if (template.name.toLowerCase().includes("meme token")) dataAiHint = "cat crypto";


                return (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col"
                    onClick={() => onTemplateSelect(template.projectData, template.name)}
                  >
                    <CardHeader className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className="h-7 w-7 text-primary flex-shrink-0" />
                        <CardTitle className="text-base font-semibold leading-tight">{template.name}</CardTitle>
                      </div>
                      <CardDescription className="text-xs h-16 overflow-hidden text-ellipsis">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 flex-grow">
                      <div className="w-full aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
                        {template.previewImageUrl ? (
                          <NextImage 
                            src={template.previewImageUrl} 
                            alt={`${template.name} Preview`} 
                            width={400} 
                            height={300} 
                            className="w-full h-full object-cover rounded-md" 
                            data-ai-hint={dataAiHint}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">Template Preview (TBD)</span>
                        )}
                      </div>
                    </CardContent>
                    <div className="p-4 pt-2 border-t">
                       <Button variant="outline" size="sm" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Use This Template
                       </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="p-6 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
