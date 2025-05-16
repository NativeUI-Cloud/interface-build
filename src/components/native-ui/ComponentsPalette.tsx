
'use client';

import { useState } from 'react';
import { Search, Bot, Globe, PenTool, GitFork, Briefcase, UserCheck, Zap, Sparkles, MessageSquare, Send } from 'lucide-react';
import ActionListItem from './ActionListItem';
import AiNodesPalette from './AiNodesPalette';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const paletteActions = [
  { 
    title: 'Action in an app', 
    icon: Globe, 
    description: 'Do something in an app or service like Google Sheets, Telegram or Notion',
    onClick: () => console.log('Action in an app clicked')
  },
  { 
    title: 'Data transformation', 
    icon: PenTool, 
    description: 'Manipulate, filter or convert data',
    onClick: () => console.log('Data transformation clicked')
  },
  { 
    title: 'Flow', 
    icon: GitFork, 
    description: 'Branch, merge or loop the flow, etc.',
    onClick: () => console.log('Flow clicked')
  },
  { 
    title: 'Core', 
    icon: Briefcase, 
    description: 'Run code, make HTTP requests, set webhooks, etc.',
    onClick: () => console.log('Core clicked')
  },
  { 
    title: 'Human in the loop', 
    icon: UserCheck, 
    description: 'Wait for approval or human input before continuing',
    onClick: () => console.log('Human in the loop clicked')
  },
];


type ViewState = 'main' | 'aiNodes';

interface ComponentsPaletteProps {
  onNodeSelect: (nodeType: string) => void;
}

export default function ComponentsPalette({ onNodeSelect }: ComponentsPaletteProps) {
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [searchTerm, setSearchTerm] = useState('');

  const triggerActions = [
    {
      title: 'Chat Trigger',
      icon: MessageSquare,
      description: 'Start workflow from a chat interaction.',
      onClick: () => onNodeSelect('CHAT_TRIGGER'),
    },
    {
      title: 'Telegram Trigger',
      icon: Send,
      description: 'Start workflow from a Telegram message.',
      onClick: () => onNodeSelect('TELEGRAM_TRIGGER'),
    },
  ];

  const handleAiClick = () => {
    setCurrentView('aiNodes');
  };

  const handleBack = () => {
    setCurrentView('main');
    setSearchTerm(''); 
  };

  const filteredPaletteActions = paletteActions.filter(action => 
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (currentView === 'aiNodes') {
    return <AiNodesPalette onBack={handleBack} onNodeSelect={onNodeSelect} />;
  }

  return (
    <div className="flex h-full flex-col border-r bg-card text-foreground">
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-semibold">
          What happens next?
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search nodes..." 
            className="pl-9 h-10 bg-background border-border focus-visible:ring-accent" 
            aria-label="Search nodes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-grow px-2">
        <div className="space-y-1 p-2">
          <ActionListItem
            icon={Bot}
            title="AI"
            description="Build autonomous agents, summarize or search documents, etc."
            onClick={handleAiClick}
          />
          {filteredPaletteActions.map((action) => (
            <ActionListItem
              key={action.title}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={action.onClick}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="mt-auto p-2 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button 
                variant="outline" 
                className="w-full justify-start p-3 h-auto text-left hover:bg-accent/10"
                aria-label="Add a trigger"
              >
                <Zap className="h-6 w-6 mr-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-grow overflow-hidden">
                  <p className="font-semibold text-foreground truncate">Add a trigger</p>
                  <p className="text-sm text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">
                    Triggers start your workflow.
                  </p>
                </div>
                <Sparkles className="h-5 w-5 text-accent ml-2 flex-shrink-0" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-[calc(var(--sidebar-width)-1rem)] md:w-72 mb-1 ml-1 bg-card border-border shadow-lg"
            side="top"
            align="start"
          >
            {triggerActions.map((trigger) => (
              <DropdownMenuItem key={trigger.title} onClick={trigger.onClick} className="p-0 focus:bg-accent/20">
                <ActionListItem
                  icon={trigger.icon}
                  title={trigger.title}
                  description={trigger.description}
                  className="w-full hover:bg-transparent" 
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
