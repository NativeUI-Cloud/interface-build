
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BotIcon, User, SendHorizonal, ArrowLeft, ClipboardCopy, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AiCodeChatViewProps {
  messages: { id: string; text: string; sender: 'user' | 'ai' | 'system' }[];
  onSendMessage: (message: string) => void;
  isResponding: boolean;
  onClose: () => void;
}

export default function AiCodeChatView({
  messages,
  onSendMessage,
  isResponding,
  onClose,
}: AiCodeChatViewProps) {
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [latestGeneratedCode, setLatestGeneratedCode] = useState<string | null>(null);

  const handleSend = () => {
    if (input.trim() && !isResponding) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast({ title: "Code Copied!", description: "The AI-generated code has been copied." });
    }).catch(err => {
      toast({ title: "Copy Failed", description: "Could not copy code to clipboard.", variant: "destructive"});
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    // Update latest generated code when AI responds
    const lastAiMessage = messages.filter(msg => msg.sender === 'ai').pop();
    if (lastAiMessage && lastAiMessage.text.trim().startsWith('import')) { // Basic check for code
      setLatestGeneratedCode(lastAiMessage.text);
    }

  }, [messages]);

  const welcomeMessage = {
    id: 'ai-code-chat-welcome',
    text: `Hello! I'm your AI Code Chat assistant.
Describe the Next.js component or page section you'd like to build, and I'll try my best to generate the code for you.
For example: "Create a responsive hero section with a title, a short paragraph, and a call-to-action button."
Or: "Generate a Next.js functional component for a login form with email and password fields using ShadCN UI components."`,
    sender: 'ai' as const,
  };

  const displayMessages = messages.length === 0 ? [welcomeMessage] : messages;

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-3 border-b border-border flex-shrink-0 bg-card">
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Back to main view">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <BotIcon className="h-6 w-6 text-primary" />
          <h1 className="text-lg font-semibold">AI Code Chat</h1>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </header>

      <ResizablePanelGroup
        direction="horizontal"
        className="flex-grow border-t"
      >
        {/* Panel Izquierdo (Chat) */}
        <ResizablePanel defaultSize={40} minSize={30} className="flex flex-col">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-6 max-w-full mx-auto"> {/* Max-width full for chat */}
                {displayMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-start gap-3 text-sm',
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.sender === 'ai' && (
                      <div className="flex-shrink-0 p-1.5 bg-primary text-primary-foreground rounded-full self-start mt-1">
                        <BotIcon className="h-5 w-5" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[85%] rounded-lg shadow-sm',
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground p-3 rounded-br-none'
                          : msg.sender === 'ai' && msg.text.trim().startsWith('import')
                          ? 'bg-muted text-muted-foreground rounded-bl-none overflow-hidden w-full' // Code block takes more width
                          : msg.sender === 'ai' 
                          ? 'bg-muted text-muted-foreground p-3 rounded-bl-none' // Regular AI text message
                          : 'bg-red-100 text-red-700 p-3 text-center w-full' // System/error messages
                      )}
                    >
                      {msg.sender === 'ai' && msg.text.trim().startsWith('import') ? (
                        <pre className="bg-black/80 text-white p-3 rounded-md text-xs overflow-x-auto relative group">
                          <code>{msg.text}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6 text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCopyCode(msg.text)}
                            title="Copy code"
                          >
                            <ClipboardCopy className="h-3.5 w-3.5" />
                          </Button>
                        </pre>
                      ) : (
                        <p className="whitespace-pre-wrap p-3">{msg.text}</p>
                      )}
                    </div>
                    {msg.sender === 'user' && (
                      <div className="flex-shrink-0 p-1.5 bg-accent text-accent-foreground rounded-full self-start mt-1">
                        <User className="h-5 w-5" />
                      </div>
                    )}
                  </div>
                ))}
                {isResponding && (
                  <div className="flex items-start gap-3 text-sm justify-start">
                    <div className="flex-shrink-0 p-1.5 bg-primary text-primary-foreground rounded-full self-start mt-1">
                      <BotIcon className="h-5 w-5 animate-pulse" />
                    </div>
                    <div className="max-w-[85%] rounded-lg px-4 py-3 bg-muted text-muted-foreground rounded-bl-none animate-pulse shadow-sm">
                      Generating code...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <footer className="p-4 border-t border-border flex-shrink-0 bg-card">
              <Card className="max-w-full mx-auto"> {/* Max-width full for input card */}
                <CardContent className="p-3">
                  <div className="flex items-end gap-2">
                    <Textarea
                      placeholder="Describe the Next.js component or page you want to build..."
                      className="flex-grow bg-background border-input placeholder-muted-foreground focus:ring-primary focus:border-primary resize-none min-h-[60px] max-h-[200px]"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={isResponding}
                      rows={2}
                      aria-label="AI Code Chat input"
                    />
                    <Button
                      size="lg"
                      onClick={handleSend}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-[60px]"
                      disabled={isResponding || !input.trim()}
                      aria-label="Send message to AI Code Chat"
                    >
                      {isResponding ? (
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      ) : (
                        <SendHorizonal className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </footer>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Panel Derecho (Código y Vista Previa) */}
        <ResizablePanel defaultSize={60} minSize={30} className="flex flex-col p-1">
            <Tabs defaultValue="code" className="flex flex-col flex-1">
              <TabsList className="shrink-0">
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="flex-1 flex flex-col mt-0 p-1 overflow-hidden">
                <Card className="flex-1 flex flex-col overflow-hidden">
                  <CardHeader className="flex-shrink-0 flex items-center justify-between">
                    <CardTitle className="text-lg">Generated Code</CardTitle>
                    {latestGeneratedCode && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode(latestGeneratedCode)}
                      >
                        <ClipboardCopy className="mr-2 h-4 w-4" /> Copy Code
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-0">
                     <ScrollArea className="h-full p-2">
                      {latestGeneratedCode ? (
                        <pre className="bg-black/80 text-white p-3 rounded-md text-xs overflow-x-auto">
                          <code>{latestGeneratedCode}</code>
                        </pre>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                          <p>Code will appear here once generated.</p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="flex-1 mt-0 p-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">Live Preview (Conceptual)</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-full text-muted-foreground">
                    <p>A live preview of the generated component would appear here.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
