// Placeholder for Magic UI AnimatedList
// Ensure you run 'npx shadcn@latest add "https://magicui.design/r/animated-list"'
// to get the actual component.

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Placeholder, actual animation might use this
}

export const AnimatedList: React.FC<AnimatedListProps> = ({
  children,
  className,
  delay,
  ...props
}) => {
  // Simple placeholder: renders children in a list-like div
  return (
    <div className={cn("relative flex flex-col gap-2 overflow-y-auto", className)} {...props}>
      {React.Children.map(children, (child, index) => (
        <div key={index} className="animate-in fade-in duration-500" style={{ animationDelay: `${(delay || 0) + index * 100}ms`}}>
          {child}
        </div>
      ))}
    </div>
  );
};
