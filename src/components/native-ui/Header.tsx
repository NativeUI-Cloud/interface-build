import { ShapesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2">
        <ShapesIcon className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-semibold text-foreground">
          NativeUI <span className="font-light">Builder</span>
        </h1>
      </div>
      {/* Future elements like theme toggle or user profile can go here */}
    </header>
  );
}
