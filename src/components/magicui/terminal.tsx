// Simplified placeholders for Magic UI Terminal components
// Actual Magic UI components might have more complex props and animations.
'use client';

import React from 'react';
import type { HTMLAttributes, ReactNode, FC } from 'react'; // Added FC
import { cn } from '@/lib/utils';

interface TerminalProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Terminal: FC<TerminalProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "w-full max-w-2xl rounded-lg bg-zinc-900 p-4 text-sm font-mono text-zinc-200 shadow-lg overflow-auto min-h-[200px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface TypingAnimationProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  delay?: number; // Placeholder, actual animation would use this
}

export const TypingAnimation: FC<TypingAnimationProps> = ({ children, className, delay, ...props }) => {
  // In a real component, useEffect and useState would handle the typing animation
  return (
    <span className={cn("block whitespace-pre-wrap", className)} {...props}>
      {children}
    </span>
  );
};

interface AnimatedSpanProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  delay?: number; // Placeholder
}

export const AnimatedSpan: FC<AnimatedSpanProps> = ({ children, className, delay, ...props }) => {
  // In a real component, useEffect and useState would handle the delayed appearance/animation
  return (
    <span className={cn("block whitespace-pre-wrap", className)} {...props}>
      {children}
    </span>
  );
};
