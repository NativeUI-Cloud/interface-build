
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BotIcon, Send, User, MessageCircle, Globe, Rocket, Wind, Building as AnthropicIcon, Brain, Cpu } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { LLMModel } from '@/lib/types'; // Assuming this type might be useful, or define locally

interface AiModelOption {
  id: string; // e.g., "googleai/gemini-1.5-pro-latest"
  name: string; // e.g., "Gemini 1.5 Pro (Google AI)"
  icon: React.ElementType;
  providerId?: string; // e.g., "googleai" - might be useful for more complex logic later
  modelId?: string; // e.g., "gemini-1.5-pro-latest"
}

const availableModels: AiModelOption[] = [
  { id: 'googleai/gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro', icon: Globe, providerId: 'googleai', modelId: 'gemini-1.5-pro-latest'},
  { id: 'openai/gpt-4o', name: 'GPT-4o', icon: Cpu, providerId: 'openai', modelId: 'gpt-4o'},
  { id: 'anthropic/claude-3-haiku-20240307', name: 'Claude 3 Haiku', icon: AnthropicIcon, providerId: 'anthropic', modelId: 'claude-3-haiku-20240307'},
  { id: 'mistralai/mistral-large-latest', name: 'Mistral Large', icon: Wind, providerId: 'mistralai', modelId: 'mistral-large-latest'},
  { id: 'deepseek/deepseek-chat', name: 'DeepSeek Chat', icon: Brain, providerId: 'deepseek', modelId: 'deepseek-chat'},
  // Note: Actual Genkit model IDs for Mistral/DeepSeek might differ or require specific plugin names.
  // These are illustrative.
];


interface LandingPageAiChatProps {
  messages: { id: string; text: string; sender: 'user' | 'ai' | 'system' }[];
  onSendMessage: (message: string, selectedModelIdentifier?: string) => void;
  isResponding: boolean;
  userName?: string;
  className?: string;
}

export default function LandingPageAiChat({
  messages,
  onSendMessage,
  isResponding,
  userName = 'Designer',
  className,
}: LandingPageAiChatProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<AiModelOption>(availableModels[0]);

  const handleSend = () => {
    if (input.trim() && !isResponding) {
      onSendMessage(input.trim(), selectedModel.id);
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const welcomeMessage = {
    id: 'lp-chat-welcome',
    text: `Hi ${userName} 👋\nI can help you design your landing page. Describe what you'd like to add or change!\n(e.g., "Add a hero section with a large image and a call to action button")`,
    sender: 'ai' as const,
  };

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden border border-border",
        className
      )}
    >
      <header className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Landing Page AI</h2>
        </div>
        <Select
          value={selectedModel.id}
          onValueChange={(value) => {
            const model = availableModels.find(m => m.id === value);
            if (model) setSelectedModel(model);
          }}
        >
          <SelectTrigger className="w-auto h-8 text-xs px-2 py-1 bg-muted hover:bg-muted/80 border-border">
            <selectedModel.icon className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {availableModels.map(model => (
              <SelectItem key={model.id} value={model.id} className="text-xs">
                <div className="flex items-center">
                  <model.icon className="h-4 w-4 mr-2 text-muted-foreground" />
                  {model.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>

      <ScrollArea className="flex-grow p-4 bg-background" ref={scrollAreaRef}>
        <div className="space-y-4">
          {displayMessages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start gap-3 text-sm',
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0 p-1.5 bg-primary rounded-full">
                  <BotIcon className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={cn(
                  'max-w-[80%] rounded-lg px-3 py-2 whitespace-pre-wrap shadow-sm',
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-muted-foreground rounded-bl-none'
                )}
              >
                {msg.text}
              </div>
               {msg.sender === 'user' && (
                <div className="flex-shrink-0 p-1.5 bg-accent text-accent-foreground rounded-full">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}
          {isResponding && (
            <div className="flex items-start gap-3 text-sm justify-start">
              <div className="flex-shrink-0 p-1.5 bg-primary rounded-full">
                  <BotIcon className="h-4 w-4 text-primary-foreground animate-pulse" />
              </div>
              <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted text-muted-foreground rounded-bl-none animate-pulse shadow-sm">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <footer className="p-3 border-t border-border flex-shrink-0 bg-card">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Describe changes or ask for help..."
            className="flex-grow bg-background border-input placeholder-muted-foreground focus:ring-primary focus:border-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isResponding}
            aria-label="Landing Page AI chat input"
          />
          <Button
            variant="default"
            size="icon"
            onClick={handleSend}
            className="bg-primary hover:bg-primary/90 disabled:bg-muted"
            disabled={isResponding || !input.trim()}
            aria-label="Send message to Landing Page AI"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
