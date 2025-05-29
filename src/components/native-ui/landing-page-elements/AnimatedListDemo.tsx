
"use client";

import React from 'react'; // Added React import
import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list"; // Will use placeholder or actual component
import type { AnimatedListItem as AnimatedListItemType } from '@/lib/types'; // Use type from lib
import { v4 as uuidv4 } from 'uuid';


export const defaultNotifications: AnimatedListItemType[] = [
  {
    id: uuidv4(),
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    id: uuidv4(),
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
  {
    id: uuidv4(),
    name: "New message",
    description: "Magic UI",
    time: "5m ago",
    icon: "💬",
    color: "#FF3D71",
  },
  {
    id: uuidv4(),
    name: "New event",
    description: "Magic UI",
    time: "2m ago",
    icon: "🗞️",
    color: "#1E86FF",
  },
  // Duplicating for a longer list in demo
  {
    id: uuidv4(),
    name: "Payment received",
    description: "Magic UI",
    time: "15m ago",
    icon: "💸",
    color: "#00C9A7",
  },
  {
    id: uuidv4(),
    name: "User signed up",
    description: "Magic UI",
    time: "10m ago",
    icon: "👤",
    color: "#FFB800",
  },
];


const Notification = ({ name, description, icon, color, time }: AnimatedListItemType) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-card [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-background dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium text-foreground dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{time}</span>
          </figcaption>
          <p className="text-sm font-normal text-muted-foreground dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};

interface AnimatedListDemoProps {
  notifications?: AnimatedListItemType[];
  className?: string;
}

export function AnimatedListDemo({
  notifications = defaultNotifications, // Use passed notifications or default
  className,
}: AnimatedListDemoProps) {
  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full flex-col overflow-hidden rounded-lg border bg-background p-2 shadow", // Added border and bg
        className,
      )}
    >
      <AnimatedList>
        {(notifications || []).map((item) => ( // Ensure notifications is an array
          <Notification {...item} key={item.id} /> // Use item.id as key
        ))}
      </AnimatedList>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background"></div>
    </div>
  );
}

export default AnimatedListDemo;
