
'use client';

import { useState } from 'react';
import { ArrowLeft, Search, Bot, Atom, Link as LinkIcon, Binary, Scale, Tag, Sparkles } from 'lucide-react';
import ActionListItem from './ActionListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface AiNodesPaletteProps {
  onBack: () => void;
  onNodeSelect: (nodeType: string) => void; // Added prop
}

export default function AiNodesPalette({ onBack, onNodeSelect }: AiNodesPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const aiNodeActions = [
    {
      title: 'AI Agent',
      icon: Bot,
      description: 'Generates an action plan and executes it. Can use external tools.',
      onClick: () => onNodeSelect('AI_AGENT'), // Use the passed prop to trigger modal
      nodeType: 'AI_AGENT',
    },
    {
      title: 'OpenAI',
      icon: Atom, 
      description: 'Message an assistant or GPT, analyze images, generate audio, etc.',
      onClick: () => console.log('OpenAI clicked'),
    },
    {
      title: 'Basic LLM Chain',
      icon: LinkIcon,
      description: 'A simple chain to prompt a large language model.',
      onClick: () => console.log('Basic LLM Chain clicked'),
      actionButton: (
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/10 focus-visible:ring-accent text-accent">
          <Sparkles className="h-5 w-5" />
          <span className="sr-only">Configure LLM Chain</span>
        </Button>
      ),
    },
    {
      title: 'Information Extractor',
      icon: Binary, 
      description: 'Extract information from text in a structured format.',
      onClick: () => console.log('Information Extractor clicked'),
    },
    {
      title: 'Question and Answer Chain',
      icon: LinkIcon,
      description: 'Answer questions about retrieved documents.',
      onClick: () => console.log('Question and Answer Chain clicked'),
    },
    {
      title: 'Sentiment Analysis',
      icon: Scale,
      description: 'Analyze the sentiment of your text.',
      onClick: () => console.log('Sentiment Analysis clicked'),
    },
    {
      title: 'Summarization Chain',
      icon: LinkIcon,
      description: 'Transforms text into a concise summary.',
      onClick: () => console.log('Summarization Chain clicked'),
    },
    {
      title: 'Text Classifier',
      icon: Tag,
      description: 'Classify your text into distinct categories.',
      onClick: () => console.log('Text Classifier clicked'),
    },
  ];

  const filteredAiNodeActions = aiNodeActions.filter(action => 
    action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    action.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col border-r bg-card text-foreground">
      <div className="p-4 space-y-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to main palette
        </Button>
        <h2 className="text-xl font-semibold">AI Nodes</h2>
        <p className="text-sm text-muted-foreground">
          Select an AI Node to add to your workflow
        </p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search AI nodes..."
            className="pl-9 h-10 bg-background border-border focus-visible:ring-accent"
            aria-label="Search AI nodes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-grow px-2">
        <div className="space-y-1 p-2">
          {filteredAiNodeActions.map((action) => (
            <ActionListItem
              key={action.title}
              icon={action.icon}
              title={action.title}
              description={action.description}
              onClick={action.onClick}
              actionButton={action.actionButton}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
