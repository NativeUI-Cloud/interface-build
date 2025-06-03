
// src/app/project/[projectId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { CanvasRow, CanvasElement, HeroVideoData, BentoFeature, AnimatedListItem as AnimatedListItemType, HeaderElementData, ProjectData, HtmlTag, TailwindFontSize, TextAlignment } from '@/lib/types';
import { cn } from '@/lib/utils';

// Import the same display components used in LandingPageGenerator
// Ensure these components are client components and don't rely on builder-specific context if not provided.
import MarqueeDemo from '@/components/native-ui/landing-page-elements/MarqueeDemo';
import TerminalDemo from '@/components/native-ui/landing-page-elements/TerminalDemo';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog'; 
import BentoDemo from '@/components/native-ui/landing-page-elements/BentoDemo';
import AnimatedListDemo from '@/components/native-ui/landing-page-elements/AnimatedListDemo';
import HeaderElement from '@/components/native-ui/landing-page-elements/HeaderElement'; // Import HeaderElement
import { Button } from '@/components/ui/button'; 
import Image from 'next/image'; 

// Interface ProjectData moved to src/lib/types.ts

export default function PublishedProjectPage() {
  const params = useParams();
  const projectId = params.projectId as string;
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      try {
        const storedData = localStorage.getItem(`project-${projectId}`);
        if (storedData) {
          const parsedData = JSON.parse(storedData) as ProjectData;
          setProjectData(parsedData);
          if (typeof document !== 'undefined') {
            if (parsedData.pageTitle) {
              document.title = parsedData.pageTitle;
            }

            const BODY_STYLE_ID = 'dynamic-body-background-style';
            let bodyStyleTag = document.getElementById(BODY_STYLE_ID) as HTMLStyleElement | null;
            if (parsedData.bodyBackgroundColor) {
              if (!bodyStyleTag) {
                bodyStyleTag = document.createElement('style');
                bodyStyleTag.id = BODY_STYLE_ID;
                document.head.appendChild(bodyStyleTag);
              }
              bodyStyleTag.innerHTML = `body { background-color: ${parsedData.bodyBackgroundColor} !important; }`;
            } else if (bodyStyleTag) {
              bodyStyleTag.remove(); // Remove style if no color specified
            }


            if (parsedData.fontFamilyImportUrl) {
              const FONT_STYLESHEET_ID = 'dynamic-google-font-stylesheet-published';
              let link = document.getElementById(FONT_STYLESHEET_ID) as HTMLLinkElement | null;
              if (!link) {
                link = document.createElement('link');
                link.id = FONT_STYLESHEET_ID;
                link.rel = 'stylesheet';
                document.head.appendChild(link);
              }
              link.href = parsedData.fontFamilyImportUrl;
            }
          }
        } else {
          setError('Project not found. It might not have been published or was removed.');
        }
      } catch (e) {
        console.error("Error loading project from localStorage:", e);
        setError('Failed to load project data. The data might be corrupted.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Project ID is missing.');
      setIsLoading(false);
    }

    // Cleanup dynamic body style on component unmount or projectId change
    return () => {
      if (typeof document !== 'undefined') {
        const bodyStyleTag = document.getElementById('dynamic-body-background-style');
        if (bodyStyleTag) {
          bodyStyleTag.remove();
        }
      }
    };
  }, [projectId]);

  const renderElementContent = (element: CanvasElement) => {
    const tag = element.data.htmlTag || (element.type === 'Heading' ? 'h1' : 'p');
    const textContent = element.data.text || (element.type === 'Heading' ? "Default Heading" : "Default text block content.");
    
    let textClassesArray: string[] = [];
    textClassesArray.push(element.data.textAlign || 'text-left');

    if (element.data.fontSize) {
      textClassesArray.push(element.data.fontSize);
    } else if (tag.startsWith('h')) {
      if (tag === 'h1') textClassesArray.push("text-4xl");
      else if (tag === 'h2') textClassesArray.push("text-3xl");
      else if (tag === 'h3') textClassesArray.push("text-2xl");
      else if (tag === 'h4') textClassesArray.push("text-xl");
      else if (tag === 'h5') textClassesArray.push("text-lg");
      else if (tag === 'h6') textClassesArray.push("text-base");
    } else {
      textClassesArray.push("text-base");
    }

    if (tag.startsWith('h')) {
      textClassesArray.push("font-bold");
      if (tag === 'h1') textClassesArray.push("my-3");
      else if (tag === 'h2') textClassesArray.push("my-2.5");
      else if (tag === 'h3') textClassesArray.push("my-2");
      else if (tag === 'h4') textClassesArray.push("my-1.5");
      else if (tag === 'h5') textClassesArray.push("my-1");
      else if (tag === 'h6') textClassesArray.push("my-1");
    } else {
      textClassesArray.push("my-2");
    }
    
    const textClasses = cn(textClassesArray);

    switch (element.type) {
      case 'MarqueeTestimonials':
        return <MarqueeDemo reviews={element.data.reviews || []} />;
      case 'TerminalAnimation':
        return <TerminalDemo lines={element.data.lines || []} />;
      case 'HeroVideoDialog':
        const videoData = element.data as HeroVideoData;
        return (
          <div className="relative w-full my-4">
            <HeroVideoDialog
              className="block dark:hidden" 
              videoSrc={videoData.videoSrc}
              thumbnailSrc={videoData.thumbnailSrcLight}
              thumbnailAlt={videoData.thumbnailAlt}
              animationStyle={videoData.animationStyle}
              data-ai-hint="product video light"
            />
             <HeroVideoDialog
              className="hidden dark:block"
              videoSrc={videoData.videoSrc}
              thumbnailSrc={videoData.thumbnailSrcDark}
              thumbnailAlt={videoData.thumbnailAlt}
              animationStyle={videoData.animationStyle}
              data-ai-hint="product video dark"
            />
          </div>
        );
      case 'BentoGrid':
        return <BentoDemo features={(element.data as any).features || []} />;
      case 'AnimatedList':
        return <AnimatedListDemo notifications={(element.data as any).items || []} />;
      case 'HeaderElement': 
        return <HeaderElement {...(element.data as HeaderElementData)} />;
      case 'Section':
         const sectionStyle: React.CSSProperties = {
           backgroundColor: element.data.backgroundColor || 'transparent',
         };
         return (
           <div 
             style={sectionStyle} 
             className={cn(
               "p-4 my-2 min-h-[50px] w-full rounded-md", 
               element.data.className, 
               !element.data.backgroundColor && "border border-dashed border-muted-foreground/20" 
             )}
           >
            {(element.data.elements || []).length === 0 && (
              <div className="text-center text-muted-foreground/50 text-sm italic">
                 Section Area
              </div>
            )}
            {/* If sections could contain child elements, they would be rendered here based on projectData structure */}
           </div>
         );
      case 'Heading':
      case 'TextBlock':
        return React.createElement(tag, { className: cn("whitespace-pre-wrap", textClasses) }, textContent);
      case 'Image':
        return (
          <div className="my-2">
            <Image 
              src={element.data.src || "https://placehold.co/600x400.png"} 
              alt={element.data.alt || "Placeholder Image"} 
              width={element.data.width || 600} 
              height={element.data.height || 400} 
              className="max-w-full h-auto"
              data-ai-hint={element.data['data-ai-hint'] || "image"}
            />
          </div>
        );
      case 'Button':
        return <Button variant="default" className="my-2">{element.data.text || "Button"}</Button>;
      default:
        return <div className="my-2 p-2 bg-red-100 text-red-700 rounded-md">Unknown element type: {element.type} ({element.name})</div>;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading project...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!projectData) {
    return <div className="flex items-center justify-center min-h-screen">Project data could not be loaded.</div>;
  }

  const pageCanvasStyle: React.CSSProperties = {};
  if (projectData.pageFillColor) {
    pageCanvasStyle.backgroundColor = projectData.pageFillColor;
  } else {
    pageCanvasStyle.backgroundColor = 'transparent'; 
  }

  if (projectData.fontFamilyName) {
    pageCanvasStyle.fontFamily = `'${projectData.fontFamilyName}', sans-serif`;
  }


  return (
    <div 
      className="container mx-auto p-4 max-w-full" 
      style={pageCanvasStyle} 
    >
      <div className="bg-transparent text-foreground min-h-screen">
        {projectData.canvasRows.map(row => (
          <div
            key={row.id}
            className={cn(
              "grid gap-4 my-0", 
              row.layout
            )}
            style={{ backgroundColor: row.backgroundColor || 'transparent' }}
          >
            {row.elements.length === 0 && parseInt(row.layout.split('-')[2] || '1', 10) > 0 &&
              Array.from({ length: parseInt(row.layout.split('-')[2] || '1', 10) }).map((_, idx) => (
                <div key={`placeholder-col-${idx}`} className="min-h-[50px] bg-neutral-100 dark:bg-neutral-800 rounded flex items-center justify-center text-neutral-400 text-sm">
                  Empty Column {idx + 1}
                </div>
              ))
            }
            {row.elements.map(el => (
              <div key={el.id} className="min-w-0 w-full">
                {renderElementContent(el)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

