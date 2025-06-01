
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react'; // For close button

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
  animationStyle = 'none',
  ...props
}) => {
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

  const openVideoPlayer = () => {
    setIsVideoPlayerOpen(true);
  };

  const closeVideoPlayer = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Prevent click on thumbnail when closing via button
    setIsVideoPlayerOpen(false);
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeVideoPlayer();
      }
    };
    if (isVideoPlayerOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isVideoPlayerOpen]);

  // Ensure videoSrc is a valid embeddable URL
  const getEmbedUrl = (src: string) => {
    try {
      const url = new URL(src);
      if (url.hostname === 'youtu.be') {
        return `https://www.youtube.com/embed/${url.pathname.substring(1)}`;
      }
      if (url.hostname === 'www.youtube.com' && url.pathname === '/watch') {
        const videoId = url.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      // If it's already an embed URL or another known video host, return as is (or add more specific handlers)
      if (url.hostname === 'www.youtube.com' && url.pathname.startsWith('/embed/')) {
        return src;
      }
    } catch (error) {
      console.error("Invalid video URL:", error);
      return ''; // Return empty string or a default placeholder if URL is invalid
    }
    return src; // Fallback if not a typical YouTube share URL
  };

  const embedVideoSrc = getEmbedUrl(videoSrc);

  return (
    <>
      <div
        className={cn(
          "relative w-full cursor-pointer overflow-hidden rounded-lg border border-border shadow-md",
          "group",
          className
        )}
        {...props}
        onClick={openVideoPlayer} // Open player on click
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openVideoPlayer();}}
        aria-label={`Play video: ${thumbnailAlt}`}
      >
        <Image
          src={thumbnailSrc}
          alt={thumbnailAlt}
          width={1920}
          height={1080}
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
      </div>

      {isVideoPlayerOpen && embedVideoSrc && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-50"
          onClick={closeVideoPlayer} // Close if clicking outside the video frame
        >
          <div 
            className="relative w-full max-w-3xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside video frame
          >
            <button
              onClick={closeVideoPlayer}
              className="absolute -top-2 -right-2 z-10 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close video player"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`${embedVideoSrc}?autoplay=1&rel=0`} // Added autoplay and rel=0
              title="Video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      {isVideoPlayerOpen && !embedVideoSrc && (
         <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in-50" onClick={closeVideoPlayer}>
            <div className="bg-background p-6 rounded-lg shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
                <p className="text-destructive-foreground">Invalid video URL provided.</p>
                <button onClick={closeVideoPlayer} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">Close</button>
            </div>
         </div>
      )}
    </>
  );
};

export default HeroVideoDialog;
