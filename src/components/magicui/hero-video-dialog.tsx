// Placeholder for Magic UI HeroVideoDialog
// Ensure you run 'npx shadcn@latest add "https://magicui.design/r/hero-video-dialog"'
// to get the actual component.

'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface HeroVideoDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  videoSrc: string;
  thumbnailSrc: string;
  thumbnailAlt?: string;
  animationStyle?: 'from-left' | 'from-right' | 'from-top' | 'from-bottom' | 'from-center' | 'none';
}

const HeroVideoDialog: React.FC<HeroVideoDialogProps> = ({
  className,
  videoSrc,
  thumbnailSrc,
  thumbnailAlt = "Video thumbnail",
  animationStyle = 'none', // Placeholder, actual animation not implemented here
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-lg border border-border shadow-md",
        "group",
        className
      )}
      {...props}
      onClick={() => {
        console.log("Placeholder HeroVideoDialog clicked. Video src:", videoSrc);
        // In a real component, this would open a modal/dialog with the video player
      }}
    >
      <Image
        src={thumbnailSrc}
        alt={thumbnailAlt}
        width={1920} // Example width, adjust as needed
        height={1080} // Example height, adjust as needed
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        priority
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 group-hover:opacity-100 opacity-75">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-play-circle text-white"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="10,8 16,12 10,16" />
        </svg>
      </div>
      <p className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-1 py-0.5 rounded">
        Placeholder - Click to Play (Console Log)
      </p>
    </div>
  );
};

export default HeroVideoDialog;
