'use client';

import type { LucideIcon } from 'lucide-react';
import { ChevronRightIcon } from 'lucide-react';

interface ActionListItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  actionButton?: React.ReactNode;
  className?: string;
}

export default function ActionListItem({ 
  icon: Icon, 
  title, 
  description, 
  onClick, 
  actionButton,
  className 
}: ActionListItemProps) {
  
  const itemContent = (
    <>
      <Icon className="h-6 w-6 mr-4 text-muted-foreground flex-shrink-0" />
      <div className="flex-grow overflow-hidden">
        <p className="font-semibold text-foreground truncate">{title}</p>
        <p className="text-sm text-muted-foreground text-ellipsis overflow-hidden whitespace-nowrap">
          {description}
        </p>
      </div>
      {actionButton ? (
        <div className="ml-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}> 
          {actionButton}
        </div>
      ) : (
        onClick && <ChevronRightIcon className="h-5 w-5 text-muted-foreground ml-2 flex-shrink-0" />
      )}
    </>
  );

  if (actionButton) {
    return (
      <div
        onClick={onClick}
        className={`flex items-center w-full text-left p-3 rounded-md ${onClick ? 'hover:bg-accent/10 cursor-pointer' : ''} ${className}`}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { onClick(e as any); } } : undefined}
        aria-label={title}
      >
        {itemContent}
      </div>
    );
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center w-full text-left p-3 hover:bg-accent/10 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
        aria-label={title}
      >
        {itemContent}
      </button>
    );
  }

  return (
    <div
      className={`flex items-center w-full text-left p-3 rounded-md ${className}`}
    >
      {itemContent}
    </div>
  );
}