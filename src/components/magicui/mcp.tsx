
"use client";

import React from "react";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

import { cn } from "@/lib/utils";

export interface CommandOption {
  id: string;
  label: string;
}

export interface MCPProps extends React.HTMLAttributes<HTMLDivElement> {
  options?: CommandOption[];
  placeholder?: string;
}

export const MCP: React.FC<MCPProps> = ({
  options = [],
  placeholder = "Type a command...",
  className,
  ...props
}) => {
  return (
    <Command className={cn("w-full max-w-md rounded-md border bg-popover", className)} {...props}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        {options.map((opt) => (
          <CommandItem key={opt.id}>{opt.label}</CommandItem>
        ))}
      </CommandList>
    </Command>

  );
};

export default MCP;
