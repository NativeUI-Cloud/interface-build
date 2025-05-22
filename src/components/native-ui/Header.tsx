
import { ShapesIcon, LogInIcon, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface HeaderProps {
  onOpenLoginModal: () => void;
  onOpenAgentTemplatesModal: () => void;
}

export default function Header({ onOpenLoginModal, onOpenAgentTemplatesModal }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2">
        <ShapesIcon className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-semibold text-foreground">
          NativeUI <span className="font-light">Builder</span>
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={onOpenAgentTemplatesModal}>
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Agent Templates</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button variant="outline" onClick={onOpenLoginModal}>
          <LogInIcon className="mr-2 h-4 w-4" />
          Login / Register
        </Button>
        <ThemeToggle />
      </div>
    </header>
  );
}
