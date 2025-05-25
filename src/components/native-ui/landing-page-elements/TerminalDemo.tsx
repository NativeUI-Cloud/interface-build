
'use client';

import React from 'react';
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
import type { HTMLAttributes, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';


export interface TerminalLine {
  id: string;
  type: 'typing' | 'animated';
  text: string | ReactNode; // ReactNode allows JSX, string is safer for simple cases
  delay?: number;
  className?: string;
  children?: TerminalLine[]; // For nested structures if needed in future
}

export const defaultTerminalLines: TerminalLine[] = [
  { id: '1', type: 'typing', text: '> pnpm dlx shadcn@latest init', delay: 0, className: '' },
  { id: '2', type: 'animated', text: '✔ Preflight checks.', delay: 1500, className: 'text-green-500' },
  { id: '3', type: 'animated', text: '✔ Verifying framework. Found Next.js.', delay: 2000, className: 'text-green-500' },
  { id: '4', type: 'animated', text: '✔ Validating Tailwind CSS.', delay: 2500, className: 'text-green-500' },
  { id: '5', type: 'animated', text: '✔ Validating import alias.', delay: 3000, className: 'text-green-500' },
  { id: '6', type: 'animated', text: '✔ Writing components.json.', delay: 3500, className: 'text-green-500' },
  { id: '7', type: 'animated', text: '✔ Checking registry.', delay: 4000, className: 'text-green-500' },
  { id: '8', type: 'animated', text: '✔ Updating tailwind.config.ts', delay: 4500, className: 'text-green-500' },
  { id: '9', type: 'animated', text: '✔ Updating app/globals.css', delay: 5000, className: 'text-green-500' },
  { id: '10', type: 'animated', text: '✔ Installing dependencies.', delay: 5500, className: 'text-green-500' },
  {
    id: '11',
    type: 'animated',
    text: "ℹ Updated 1 file:\n  - lib/utils.ts",
    delay: 6000,
    className: 'text-blue-500'
  },
  { id: '12', type: 'typing', text: 'Success! Project initialization completed.', delay: 6500, className: 'text-muted-foreground' },
  { id: '13', type: 'typing', text: 'You may now add components.', delay: 7000, className: 'text-muted-foreground' },
];

interface TerminalDemoProps extends HTMLAttributes<HTMLDivElement> {
  lines?: TerminalLine[];
}

export function TerminalDemo({ lines = defaultTerminalLines, ...props }: TerminalDemoProps) {
  return (
    <Terminal {...props}>
      {(lines || []).map((line) => {
        if (line.type === 'typing') {
          return (
            <TypingAnimation key={line.id} delay={line.delay} className={line.className}>
              {line.text}
            </TypingAnimation>
          );
        }
        if (line.type === 'animated') {
          return (
            <AnimatedSpan key={line.id} delay={line.delay} className={line.className}>
              {line.text}
            </AnimatedSpan>
          );
        }
        return null;
      })}
    </Terminal>
  );
}

export default TerminalDemo;
