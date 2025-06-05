
// src/app/project/[projectId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { CanvasRow, CanvasElement, HeroVideoData, BentoFeature, AnimatedListItem as AnimatedListItemType, HeaderElementData, ProjectData, HtmlTag, TailwindFontSize, TextAlignment, AnnouncementBarData, NftDisplayCardData, TokenInfoDisplayData, RoadmapTimelineData, BadgeElementData, SeparatorElementData, ProgressElementData, SkeletonElementData, AlertElementData, ApiDataDisplayData, TransactionStatusData, GovernanceProposalData, ProposalStatus, TransactionStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

// Import the same display components used in LandingPageGenerator
// Ensure these components are client components and don't rely on builder-specific context if not provided.
import MarqueeDemo from '@/components/native-ui/landing-page-elements/MarqueeDemo';
import TerminalDemo from '@/components/native-ui/landing-page-elements/TerminalDemo';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';
import BentoDemo from '@/components/native-ui/landing-page-elements/BentoDemo';
import AnimatedListDemo from '@/components/native-ui/landing-page-elements/AnimatedListDemo';
import HeaderElement from '@/components/native-ui/landing-page-elements/HeaderElement';
import AnnouncementBar from '@/components/native-ui/landing-page-elements/AnnouncementBar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'; // Added for NFT Card & Governance Proposal
import * as LucideIcons from 'lucide-react'; // For FeatureItem
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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
      case 'AnnouncementBar':
        // Ensure all relevant props from AnnouncementBarData are passed
        const annData = element.data as AnnouncementBarData;
        return (
          <AnnouncementBar
            text={annData.text}
            linkText={annData.linkText}
            linkHref={annData.linkHref}
            variant={annData.variant}
            dismissible={annData.dismissible}
            backgroundColor={annData.backgroundColor}
            textColor={annData.textColor}
            linkColor={annData.linkColor}
            buttonBackgroundColor={annData.buttonBackgroundColor}
            buttonTextColor={annData.buttonTextColor}
            buttonBorderColor={annData.buttonBorderColor}
          />
        );
      case 'Section':
         const sectionStyle: React.CSSProperties = {};
          if (element.data.backgroundColor && element.data.backgroundColor.startsWith('#')) {
            sectionStyle.backgroundColor = element.data.backgroundColor;
          }
         return (
           <div
             style={sectionStyle}
             className={cn(
               "p-4 my-2 min-h-[50px] w-full rounded-md",
               element.data.className,
               !element.data.backgroundColor || !element.data.backgroundColor.startsWith('#')
                ? (element.data.backgroundColor || "border border-dashed border-muted-foreground/20")
                : "border-transparent"
             )}
           >
            {(element.data.elements || []).length === 0 && (
              <div className="text-center text-muted-foreground/50 text-sm italic">
                 Section Area
              </div>
            )}
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
      case 'ConnectWalletButton':
        return <Button className={cn("my-2", element.data.className)}>{element.data.text || "Connect Wallet"}</Button>;
      case 'NftDisplayCard':
        const nftData = element.data as NftDisplayCardData;
        return (
          <Card className="w-full max-w-xs my-2">
            <CardContent className="p-3">
              <Image
                src={nftData.imageUrl || "https://placehold.co/300x300.png?text=NFT"}
                alt={nftData.name || "NFT Image"}
                width={300}
                height={300}
                className="w-full h-auto rounded-md mb-2 object-cover aspect-square"
                data-ai-hint={nftData['data-ai-hint'] || "nft art"}
              />
              <h4 className="font-semibold text-sm truncate" title={nftData.name}>{nftData.name || "NFT Name"}</h4>
              <p className="text-xs text-muted-foreground truncate" title={nftData.collection}>{nftData.collection || "Collection Name"}</p>
              {nftData.price && <p className="text-sm font-medium mt-1">{nftData.price}</p>}
            </CardContent>
          </Card>
        );
      case 'TokenInfoDisplay':
        const tokenData = element.data as TokenInfoDisplayData;
        return <div className="p-4 my-2 border rounded-md text-sm bg-muted/30"><p><strong>Token:</strong> {tokenData.tokenSymbol || 'N/A'}</p><p><strong>Price:</strong> {tokenData.price || 'N/A'}</p><p><strong>Market Cap:</strong> {tokenData.marketCap || 'N/A'}</p></div>;
      case 'RoadmapTimeline':
        const roadmapData = element.data as RoadmapTimelineData;
        return (
            <div className="p-4 my-2 border rounded-md space-y-3 bg-muted/30">
                {(roadmapData.phases || []).map(phase => (
                    <div key={phase.id}>
                        <h4 className="font-semibold text-sm">{phase.title || 'Phase Title'}</h4>
                        <p className="text-xs text-muted-foreground">{phase.description || 'Phase description...'}</p>
                    </div>
                ))}
                {(!roadmapData.phases || roadmapData.phases.length === 0) && <p className="text-xs text-muted-foreground">Roadmap items go here.</p>}
            </div>
        );
      case 'BadgeElement':
        const badgeData = element.data as BadgeElementData;
        return <Badge variant={badgeData.variant || 'default'} className="my-2">{ badgeData.text || 'Badge' }</Badge>;
      case 'SeparatorElement':
        const separatorData = element.data as SeparatorElementData;
        return <Separator orientation={separatorData.orientation || 'horizontal'} className="my-4" />;
      case 'ProgressElement':
        const progressData = element.data as ProgressElementData;
        return (
          <div className="my-2 w-full">
            <Progress value={progressData.value || 0} className={cn(progressData.backgroundColor)} />
          </div>
        );
      case 'SkeletonElement':
        const skeletonData = element.data as SkeletonElementData;
        return <Skeleton className={cn(skeletonData.width, skeletonData.height, skeletonData.className, "my-2")} />;
      case 'Alert':
        const alertData = element.data as AlertElementData;
        const IconComp = alertData.iconName && (LucideIcons as any)[alertData.iconName] ? (LucideIcons as any)[alertData.iconName] : LucideIcons.Info;
        return (
          <Alert variant={alertData.variant || 'default'} className="my-2">
            <IconComp className="h-4 w-4" />
            {alertData.title && <AlertTitle>{alertData.title}</AlertTitle>}
            {alertData.description && <AlertDescription>{alertData.description}</AlertDescription>}
          </Alert>
        );
      case 'ApiDataDisplay':
          const apiData = element.data as ApiDataDisplayData;
          return (
            <Card className="my-2 w-full">
              <CardHeader>
                <CardTitle className="text-base">{apiData.title || "API Data"}</CardTitle>
              </CardHeader>
              <CardContent>
                {(apiData.items || []).length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {(apiData.items).map(item => (
                      <li key={item.id} className="flex justify-between">
                        <span className="font-medium text-muted-foreground">{item.key}:</span>
                        <span>{item.value}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No data to display.</p>
                )}
              </CardContent>
            </Card>
          );
        case 'TransactionStatusDisplay':
          const txData = element.data as TransactionStatusData;
          let TxIcon = LucideIcons.ClockIcon;
          let txColor = "text-blue-500";
          if (txData.status === 'success') { TxIcon = LucideIcons.CheckCircle2; txColor = "text-green-500"; }
          else if (txData.status === 'failed') { TxIcon = LucideIcons.AlertCircle; txColor = "text-red-500"; }
          return (
            <div className={cn("p-4 my-2 border rounded-md text-sm flex items-center gap-3", txData.status === 'success' ? 'bg-green-500/10 border-green-500/30' : txData.status === 'failed' ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/10 border-blue-500/30')}>
              <TxIcon className={cn("h-6 w-6", txColor)} />
              <div>
                <p className={cn("font-semibold", txColor)}>
                  {txData.status ? txData.status.charAt(0).toUpperCase() + txData.status.slice(1) : 'Unknown Status'}
                </p>
                {txData.transactionId && <p className="text-xs text-muted-foreground truncate" title={txData.transactionId}>TxID: {txData.transactionId}</p>}
                {txData.message && <p className="text-xs text-muted-foreground mt-0.5">{txData.message}</p>}
              </div>
            </div>
          );
        case 'GovernanceProposalCard':
          const proposalData = element.data as GovernanceProposalData;
          let statusBadgeColor = "bg-gray-500";
          if (proposalData.status === 'active') statusBadgeColor = "bg-blue-500";
          else if (proposalData.status === 'passed' || proposalData.status === 'executed') statusBadgeColor = "bg-green-500";
          else if (proposalData.status === 'failed') statusBadgeColor = "bg-red-500";
          return (
            <Card className="my-2 w-full">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base mb-1">{proposalData.title || "Proposal Title"}</CardTitle>
                  <Badge className={cn("text-xs", statusBadgeColor, "text-white")}>{proposalData.status || "N/A"}</Badge>
                </div>
                {proposalData.proposer && <CardDescription className="text-xs">Proposed by: {proposalData.proposer}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{proposalData.summary || "Summary of the proposal goes here."}</p>
                <div className="text-xs grid grid-cols-2 gap-x-4 gap-y-1">
                  {proposalData.endDate && <p><strong>Ends:</strong> {proposalData.endDate}</p>}
                  {proposalData.votesFor && <p><strong>For:</strong> {proposalData.votesFor}</p>}
                  {proposalData.votesAgainst && <p><strong>Against:</strong> {proposalData.votesAgainst}</p>}
                </div>
              </CardContent>
            </Card>
          );
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
              <div key={el.id} className={cn("min-w-0 w-full", el.data.cursor)}>
                {renderElementContent(el)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

