
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Send, X, CornerDownLeft, User, BotIcon } from 'lucide-react'; 
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

interface AiAssistantPanelProps {
  // isOpen prop removed as parent now controls rendering
  onClose: () => void;
  messages: { id: string; text: string; sender: 'user' | 'ai' | 'system' }[];
  onSendMessage: (message: string) => void;
  isResponding: boolean;
  userName?: string;
}

export default function AiAssistantPanel({
  onClose,
  messages,
  onSendMessage,
  isResponding,
  userName = 'user',
}: AiAssistantPanelProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (input.trim() && !isResponding) {
      onSendMessage(input.trim());
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
    id: 'welcome-msg',
    text: `Hi ${userName} 👋\nI can answer most questions about building workflows in NativeUI Builder.\nFor specific tasks, you'll see a ✨ button in the UI for context-specific help.\nHow can I help?`,
    sender: 'ai' as const,
  };

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full bg-card text-card-foreground shadow-lg rounded-lg overflow-hidden border border-border"
      )}
      aria-modal="false" 
      role="complementary" 
    >
      <header className="flex items-center justify-between p-3 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">AI Assistant</h2>
          <Badge variant="outline" className="border-primary text-primary text-xs">
            beta
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-muted-foreground hover:text-foreground h-7 w-7">
          <X className="h-4 w-4" />
          <span className="sr-only">Close AI Assistant</span>
        </Button>
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
            placeholder="Ask the assistant..."
            className="flex-grow bg-background border-input placeholder-muted-foreground focus:ring-primary focus:border-primary"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isResponding}
            aria-label="AI Assistant chat input"
          />
          <Button
            variant="default"
            size="icon"
            onClick={handleSend}
            className="bg-primary hover:bg-primary/90 disabled:bg-muted"
            disabled={isResponding || !input.trim()}
            aria-label="Send message to AI Assistant"
          >
            {isResponding ? (
              <CornerDownLeft className="h-5 w-5 animate-ping" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
