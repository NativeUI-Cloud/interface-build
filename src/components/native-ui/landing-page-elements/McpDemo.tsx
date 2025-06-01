
"use client";

import React from "react";
import MCP, { CommandOption } from "@/components/magicui/mcp";


export const defaultCommands: CommandOption[] = [
  { id: "1", label: "Open Project" },
  { id: "2", label: "New File" },
  { id: "3", label: "Search Docs" },
  { id: "4", label: "Exit" },
];


interface McpDemoProps extends React.HTMLAttributes<HTMLDivElement> {
  commands?: CommandOption[];
}

const McpDemo: React.FC<McpDemoProps> = ({ commands = defaultCommands, ...props }) => {

  return <MCP options={commands} {...props} />;
};

export default McpDemo;
