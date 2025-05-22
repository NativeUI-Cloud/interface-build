
'use client';

import { useState } from 'react';
import { Search, Bot, Globe, PenTool, GitFork, Briefcase, UserCheck, Zap, Sparkles, MessageSquare, Send, DollarSign, Github, FolderKanban, Package, Gitlab, KanbanSquare, DatabaseZap, Flame, NotebookText, Network, SearchCode, ShoppingCart, Stethoscope } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

const basePaletteActions = [
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
  const { toast } = useToast();

  const handleAiClick = () => {
    setCurrentView('aiNodes');
  };

  const handleBack = () => {
    setCurrentView('main');
    setSearchTerm(''); 
  };

  const aiAction = {
    title: 'AI',
    icon: Bot,
    description: 'Build autonomous agents, summarize or search documents, etc.',
    onClick: handleAiClick, 
  };

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

  const toolInfoActions = [
    {
      title: 'CoinGecko Tool',
      icon: DollarSign,
      description: 'Access cryptocurrency data. Configured within an AI Agent.',
      onClick: () => toast({ title: "CoinGecko Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add and configure the CoinGecko tool." }),
    },
    {
      title: 'GitHub API Tool',
      icon: Github,
      description: 'Interact with GitHub API. Configured within an AI Agent.',
      onClick: () => toast({ title: "GitHub API Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add and configure the GitHub API tool." }),
    },
    {
      title: 'Google Drive Tool',
      icon: FolderKanban,
      description: 'Interact with Google Drive. Configured within an AI Agent.',
      onClick: () => toast({ title: "Google Drive Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
    {
      title: 'Dropbox Tool',
      icon: Package,
      description: 'Interact with Dropbox. Configured within an AI Agent.',
      onClick: () => toast({ title: "Dropbox Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
    {
      title: 'GitLab API Tool',
      icon: Gitlab,
      description: 'Interact with GitLab. Configured within an AI Agent.',
      onClick: () => toast({ title: "GitLab API Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
    {
      title: 'Trello Tool',
      icon: KanbanSquare,
      description: 'Interact with Trello. Configured within an AI Agent.',
      onClick: () => toast({ title: "Trello Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
    {
      title: 'Bitquery API Tool',
      icon: DatabaseZap,
      description: 'Access blockchain data via Bitquery. Configured within an AI Agent.',
      onClick: () => toast({ title: "Bitquery API Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
    {
      title: 'Firebase Tool',
      icon: Flame,
      description: 'Interact with Firebase services. Configured within an AI Agent.',
      onClick: () => toast({ title: "Firebase Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add and configure the Firebase tool." }),
    },
    {
      title: 'Notion Tool',
      icon: NotebookText,
      description: 'Interact with Notion. Configured within an AI Agent.',
      onClick: () => toast({ title: "Notion Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
    {
      title: 'Blockchain Data Tool',
      icon: Network,
      description: 'Fetch on-chain data. Configured within an AI Agent.',
      onClick: () => toast({ title: "Blockchain Data Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
    {
      title: 'Etherscan API Tool',
      icon: SearchCode,
      description: 'Query blockchain explorers like Etherscan. Configured within an AI Agent.',
      onClick: () => toast({ title: "Etherscan API Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add and configure this tool." }),
    },
    {
      title: 'The Graph Tool',
      icon: GitFork,
      description: 'Query subgraphs from The Graph Protocol. Configured within an AI Agent.',
      onClick: () => toast({ title: "The Graph Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add and configure this tool." }),
    },
    {
      title: 'Shopify Admin Tool',
      icon: ShoppingCart,
      description: 'Manage your Shopify store. Configured within an AI Agent.',
      onClick: () => toast({ title: "Shopify Admin Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
    {
      title: 'PubMed Search Tool',
      icon: Stethoscope,
      description: 'Search medical literature. Configured within an AI Agent.',
      onClick: () => toast({ title: "PubMed Search Tool Info", description: "Add an AI Agent node, then open its configuration and go to the 'Tools' tab to add this tool." }),
    },
  ];

  const allSearchableActions = [
    aiAction,
    ...basePaletteActions,
    ...triggerActions,
    ...toolInfoActions,
  ];

  const itemsToShowInScrollArea = searchTerm
    ? allSearchableActions.filter(action => 
        action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        action.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [
        aiAction, 
        ...basePaletteActions.filter(action => 
          action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          action.description.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      ];
  
  const defaultViewItems = [aiAction, ...basePaletteActions];


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
            placeholder="Search nodes & tools..." 
            className="pl-9 h-10 bg-background border-border focus-visible:ring-accent" 
            aria-label="Search nodes and tools"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <ScrollArea className="flex-grow px-2">
        <div className="space-y-1 p-2">
          {(searchTerm ? itemsToShowInScrollArea : defaultViewItems).map((action) => (
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

      {!searchTerm && (
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
      )}
    </div>
  );
}
