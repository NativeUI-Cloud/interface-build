
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Projector, Search, Plus, Edit3, Trash2, MoreHorizontal, Globe, Copy, Sparkles, Settings, LayoutGrid } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ProjectMetadata {
  id: string;
  title: string;
  lastModified: string;
}

interface ProjectDashboardProps {
  projects: ProjectMetadata[];
  onEditProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateNewProject: () => void;
  onSwitchToAiGenerator: () => void;
  onSwitchToSettings: () => void;
}

export default function ProjectDashboard({
  projects,
  onEditProject,
  onDeleteProject,
  onCreateNewProject,
  onSwitchToAiGenerator,
  onSwitchToSettings,
}: ProjectDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePreviewProject = (projectId: string) => {
    const url = `${window.location.origin}/project/${projectId}`;
    window.open(url, '_blank');
    toast({ title: "Preview Opened", description: "Project preview opened in a new tab." });
  };

  const handleCopyLink = (projectId: string) => {
    const url = `${window.location.origin}/project/${projectId}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: "Link Copied", description: "Project link copied to clipboard." });
    }).catch(err => {
      toast({ title: "Error", description: "Could not copy link.", variant: "destructive" });
    });
  };


  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="p-4 border-b border-border flex-shrink-0 flex justify-between items-center bg-card shadow-sm h-16">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold">Landing Page Projects</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onSwitchToAiGenerator} variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4" /> AI Generator
          </Button>
          <Button onClick={onSwitchToSettings} variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
          <Button onClick={onCreateNewProject} size="sm">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </header>

      <div className="p-4 border-b border-border">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10 h-10 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-grow p-4 md:p-6 lg:p-8">
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Projector className="h-24 w-24 mb-6 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">No Projects Yet</h2>
            <p className="mb-6 max-w-sm">
              {searchTerm
                ? `No projects found matching "${searchTerm}". Try a different search or create a new project.`
                : "It looks like you haven't created any landing page projects. Click 'New Project' to get started!"}
            </p>
            <Button onClick={onCreateNewProject} size="lg">
              <Plus className="mr-2 h-5 w-5" /> Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="flex flex-col overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="p-4 cursor-pointer" onClick={() => onEditProject(project.id)}>
                  <div className="w-full aspect-[4/3] bg-muted rounded-md mb-3 flex items-center justify-center">
                    <LayoutGrid className="h-12 w-12 text-muted-foreground/50" />
                  </div>
                  <CardTitle className="text-base font-semibold truncate" title={project.title}>
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Modified {formatDistanceToNow(new Date(project.lastModified), { addSuffix: true })}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="p-3 border-t mt-auto flex justify-between items-center">
                  <Button variant="default" size="sm" className="flex-1 mr-2" onClick={() => onEditProject(project.id)}>
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreviewProject(project.id)}>
                        <Globe className="mr-2 h-4 w-4" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopyLink(project.id)}>
                        <Copy className="mr-2 h-4 w-4" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()} // Prevent closing dropdown
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the project "{project.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteProject(project.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete Project
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

