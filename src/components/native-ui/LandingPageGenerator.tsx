
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Shapes, Palette, Edit3, Trash2, Copy, Download, SendHorizonal, Sparkles, GripVertical,
  LayoutGrid as LayoutGridIcon, Type as TypeIcon, ImageIcon as ImageIconLucide, Database,
  Settings, Users, Play, Globe, Settings2 as SettingsIcon, ChevronDown, Search, PlusCircle,
  Monitor, Tablet, Smartphone, MousePointer, Hand, Circle as CircleIcon, Sun as SunIcon,
  Grid2x2 as GridIconLucide, Eye, PanelLeft, AlignHorizontalSpaceAround, Columns, Rows,
  Link as LinkIconLucide, Info, Heading1, Baseline, ImageDown, MousePointerClick,
  ListTodo, Youtube, TerminalSquareIcon, MessageSquareText, Undo2, Save, LayoutPanelLeft, Plus, Minus,
  ArrowRightLeft, FileText as FileTextLucide, GitFork, CreditCard, Home, UploadCloud, ClipboardCopy,
  ArrowLeft, MessageSquare, ListChecks // Added MessageSquare & ListChecks
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import NextImage from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CanvasElement, CanvasRow, HeroVideoData, MarqueeReviewType, TerminalLine as ITerminalLine, BentoFeature, AnimatedListItem as AnimatedListItemType, WebElementDefinition, Breakpoint as BreakpointType } from '@/lib/types';

import MarqueeDemo, { defaultReviews as defaultMarqueeReviews, type Review as MarqueeReview } from './landing-page-elements/MarqueeDemo';
import TerminalDemo, { defaultTerminalLines, type TerminalLine } from './landing-page-elements/TerminalDemo';
import HeroVideoDialogDemo from './landing-page-elements/HeroVideoDialogDemo';
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import BentoDemo, { defaultBentoFeatures } from './landing-page-elements/BentoDemo';
import AnimatedListDemo, { defaultNotifications as defaultAnimatedListItems } from './landing-page-elements/AnimatedListDemo';

import ElementPreviewModal from './ElementPreviewModal';
import EditMarqueeModal from './landing-page-elements/EditMarqueeModal';
import EditHeroVideoModal from './landing-page-elements/EditHeroVideoModal';
import EditTerminalModal from './landing-page-elements/EditTerminalModal';

import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from "@/hooks/use-mobile";

const PREDEFINED_BREAKPOINTS: BreakpointType[] = [
  { name: 'Desktop', width: 1280, icon: Monitor },
  { name: 'Tablet', width: 768, icon: Tablet },
  { name: 'Phone', width: 375, icon: Smartphone },
];

type LandingPageCreatorView = 'builder' | 'settings';

export default function LandingPageGenerator() {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [activeView, setActiveView] = useState<LandingPageCreatorView>('builder');

  // State for Builder View
  const [pageTitle, setPageTitle] = useState('Untitled Page');
  const [canvasRows, setCanvasRows] = useState<CanvasRow[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<{ name: string; previewComponent: React.ReactNode } | null>(null);
  const [activeCanvasTool, setActiveCanvasTool] = useState<'select' | 'pan'>('select');
  const [isCanvasPanning, setIsCanvasPanning] = useState(false);
  const [panStartCoords, setPanStartCoords] = useState<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [canvasZoom, setCanvasZoom] = useState(1.0);
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointType>(PREDEFINED_BREAKPOINTS[0]);
  const [previousCanvasRows, setPreviousCanvasRows] = useState<CanvasRow[] | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // State for Edit Modals (Builder View)
  const [isEditMarqueeModalOpen, setIsEditMarqueeModalOpen] = useState(false);
  const [editingMarqueeElementId, setEditingMarqueeElementId] = useState<string | null>(null);
  const [isEditHeroVideoModalOpen, setIsEditHeroVideoModalOpen] = useState(false);
  const [editingHeroVideoElementId, setEditingHeroVideoElementId] = useState<string | null>(null);
  const [isEditTerminalModalOpen, setIsEditTerminalModalOpen] = useState(false);
  const [editingTerminalElementId, setEditingTerminalElementId] = useState<string | null>(null);

  // State for Settings View
  const [siteTitleSettings, setSiteTitleSettings] = useState('My NativeUI Site');
  const [siteDescriptionSettings, setSiteDescriptionSettings] = useState('Made with NativeUI Builder');
  const [siteLanguageSettings, setSiteLanguageSettings] = useState('');
  const [disableAccessibilityAnimations, setDisableAccessibilityAnimations] = useState(false);
  const [optOutHtmlPaste, setOptOutHtmlPaste] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<string>('general');


  const webElements: WebElementDefinition[] = [
    { name: 'Section', type: 'Section', previewComponent: <div className="h-20 w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground text-sm">Section Placeholder</div>, initialData: {}, category: 'Layout', icon: LayoutPanelLeft },
    { name: 'Heading', type: 'Heading', previewComponent: <h1 className="text-2xl font-bold">Heading Text</h1>, initialData: { text: 'Default Heading', level: 'h1' }, category: 'Content', icon: Heading1 },
    { name: 'Text Block', type: 'TextBlock', previewComponent: <p>This is a paragraph of text.</p>, initialData: { text: 'Default text block content.' }, category: 'Content', icon: Baseline },
    { name: 'Image', type: 'Image', previewComponent: <NextImage src="https://placehold.co/300x200.png" alt="Placeholder" width={150} height={100} data-ai-hint="placeholder image"/>, initialData: { src: 'https://placehold.co/600x400.png', alt: 'Placeholder Image', width: 600, height: 400, 'data-ai-hint': 'placeholder' }, category: 'Content', icon: ImageDown },
    { name: 'Button', type: 'Button', previewComponent: <Button>Click Me</Button>, initialData: { text: 'Button Text', variant: 'default' }, category: 'Interactive', icon: MousePointerClick },
    { name: 'Marquee Testimonials', type: 'MarqueeTestimonials', previewComponent: <MarqueeDemo reviews={defaultMarqueeReviews} />, initialData: { reviews: defaultMarqueeReviews.map((r: MarqueeReviewType) => ({ ...r, id: uuidv4() })) }, category: 'Magic UI Components', icon: MessageSquareText },
    { name: 'Terminal Animation', type: 'TerminalAnimation', previewComponent: <TerminalDemo lines={defaultTerminalLines} />, initialData: { lines: defaultTerminalLines.map((l: ITerminalLine) => ({ ...l, id: uuidv4() })) }, category: 'Magic UI Components', icon: TerminalSquareIcon },
    { name: 'Hero Video', type: 'HeroVideoDialog', previewComponent: <HeroVideoDialogDemo />, initialData: { videoSrc: "https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb", thumbnailSrcLight: "https://startup-template-sage.vercel.app/hero-light.png", thumbnailSrcDark: "https://startup-template-sage.vercel.app/hero-dark.png", thumbnailAlt: "Hero Video", animationStyle: 'from-center' } as HeroVideoData, category: 'Magic UI Components', icon: Youtube },
    { name: 'Bento Grid', type: 'BentoGrid', previewComponent: <div className="p-2"><BentoDemo features={defaultBentoFeatures.slice(0,1)} /></div>, initialData: { features: defaultBentoFeatures.map(f => ({ ...f, id: uuidv4() })) }, category: 'Magic UI Components', icon: LayoutGridIcon },
    { name: 'Animated List', type: 'AnimatedList', previewComponent: <div className="p-2 h-40 overflow-hidden"><AnimatedListDemo notifications={defaultAnimatedListItems.slice(0,2)} /></div>, initialData: { items: defaultAnimatedListItems.map(n => ({ ...n, id: uuidv4() })) }, category: 'Magic UI Components', icon: ListChecks },
  ];

  const groupedWebElements = webElements.reduce((acc, el) => {
    (acc[el.category] = acc[el.category] || []).push(el);
    return acc;
  }, {} as Record<string, WebElementDefinition[]>);


  const deepCopy = useCallback((obj: any): any => {
    if (obj === null || typeof obj !== 'object' || React.isValidElement(obj) || typeof obj === 'function') {
      return obj;
    }
    if (obj instanceof Date) return new Date(obj.getTime());
    
    if (Array.isArray(obj)) {
      const arrCopy: any[] = [];
      for (let i = 0; i < obj.length; i++) {
        arrCopy[i] = deepCopy(obj[i]);
      }
      return arrCopy;
    }

    const objCopy: Record<string, any> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        objCopy[key] = deepCopy(obj[key]);
      }
    }
    return objCopy;
  }, []);


  const storePreviousState = useCallback(() => {
    setPreviousCanvasRows(deepCopy(canvasRows));
  }, [canvasRows, deepCopy]);

  const handleAddRow = () => {
    storePreviousState();
    const newRow: CanvasRow = { id: uuidv4(), layout: 'grid-cols-1', elements: [] };
    setCanvasRows(prev => [...prev, newRow]);
    setSelectedRowId(newRow.id);
    toast({ title: "Row Added", description: "A new row has been added to the canvas." });
  };

  const handleElementClick = (el: WebElementDefinition) => {
    setCurrentPreview({ name: el.name, previewComponent: el.previewComponent });
    setIsPreviewModalOpen(true);
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, elementName: string) => {
    event.dataTransfer.setData("application/json", JSON.stringify({ type: 'ADD_ELEMENT', elementName }));
  };

  const handleDropOnCanvas = (event: React.DragEvent<HTMLDivElement>, targetRowId?: string) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const dataString = event.dataTransfer.getData("application/json");
      if (!dataString) return;

      const { elementName } = JSON.parse(dataString);
      const elementDefinition = webElements.find(el => el.name === elementName);

      if (elementDefinition) {
        storePreviousState();
        const newElement: CanvasElement = {
          id: uuidv4(),
          name: elementDefinition.name,
          type: elementDefinition.type,
          data: deepCopy(elementDefinition.initialData),
        };

        setCanvasRows(prevRows => {
          let updated = false;
          let effectiveTargetRowId = targetRowId || selectedRowId;

          if (!effectiveTargetRowId && prevRows.length > 0) {
            effectiveTargetRowId = prevRows[prevRows.length - 1].id;
          } else if (!effectiveTargetRowId && prevRows.length === 0) {
             // If no rows exist, create one and add the element to it
            const newRowWithElement: CanvasRow = { id: uuidv4(), layout: 'grid-cols-1', elements: [newElement] };
            setSelectedRowId(newRowWithElement.id);
            toast({ title: "Element Added", description: `${elementDefinition.name} added to a new row.` });
            return [...prevRows, newRowWithElement];
          }
          
          const newRows = prevRows.map(row => {
            if (row.id === effectiveTargetRowId) {
              updated = true;
              return { ...row, elements: [...row.elements, newElement] };
            }
            return row;
          });

          if (updated) {
            toast({ title: "Element Added", description: `${elementDefinition.name} added to row.` });
            return newRows;
          }
          // Fallback if something unexpected happens, shouldn't be reached if logic above is sound
          const newRowWithElement: CanvasRow = { id: uuidv4(), layout: 'grid-cols-1', elements: [newElement] };
          setSelectedRowId(newRowWithElement.id);
          return [...prevRows, newRowWithElement];
        });
      }
    } catch (error) {
      console.error("Error processing drop data:", error);
      toast({ title: "Drop Error", description: "Could not add element.", variant: "destructive" });
    }
  };

  const handleRowClick = (rowId: string, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('.element-controls, .canvas-element-content')) {
      return; 
    }
    setSelectedRowId(rowId);
  };

  const handleChangeRowLayout = (layout: string) => {
    if (selectedRowId) {
      storePreviousState();
      setCanvasRows(prevRows =>
        prevRows.map(row =>
          row.id === selectedRowId ? { ...row, layout } : row
        )
      );
    }
  };

  const handleDeleteElement = (rowId: string, elementId: string) => {
    storePreviousState();
    setCanvasRows(prevRows =>
      prevRows.map(row =>
        row.id === rowId
          ? { ...row, elements: row.elements.filter(el => el.id !== elementId) }
          : row
      )
    );
    toast({ title: "Element Deleted", description: "The element has been removed." });
  };

  const handleEditElement = (rowId: string, elementId: string) => {
    const element = canvasRows.find(r => r.id === rowId)?.elements.find(e => e.id === elementId);
    if (!element) return;

    if (element.type === 'MarqueeTestimonials') {
      setEditingMarqueeElementId(elementId);
      setIsEditMarqueeModalOpen(true);
    } else if (element.type === 'HeroVideoDialog') {
      setEditingHeroVideoElementId(elementId);
      setIsEditHeroVideoModalOpen(true);
    } else if (element.type === 'TerminalAnimation') {
      setEditingTerminalElementId(elementId);
      setIsEditTerminalModalOpen(true);
    } else {
      toast({ title: "Edit Element", description: `Editing for ${element.name} coming soon!` });
    }
  };
  
  const handleUpdateMarqueeData = (elementId: string, updatedReviews: MarqueeReviewType[]) => {
    storePreviousState();
    setCanvasRows(prevRows => prevRows.map(row => ({
      ...row,
      elements: row.elements.map(el =>
        el.id === elementId && el.type === 'MarqueeTestimonials'
          ? { ...el, data: { ...el.data, reviews: updatedReviews } }
          : el
      )
    })));
  };

  const handleUpdateHeroVideoData = (elementId: string, updatedData: HeroVideoData) => {
    storePreviousState();
    setCanvasRows(prevRows => prevRows.map(row => ({
      ...row,
      elements: row.elements.map(el =>
        el.id === elementId && el.type === 'HeroVideoDialog'
          ? { ...el, data: { ...el.data, ...updatedData } }
          : el
      )
    })));
  };

  const handleUpdateTerminalData = (elementId: string, updatedLines: ITerminalLine[]) => {
    storePreviousState();
    setCanvasRows(prevRows => prevRows.map(row => ({
      ...row,
      elements: row.elements.map(el =>
        el.id === elementId && el.type === 'TerminalAnimation'
          ? { ...el, data: { ...el.data, lines: updatedLines } }
          : el
      )
    })));
  };

  const renderCanvasElement = (element: CanvasElement, rowId: string) => {
    const content = () => {
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
        case 'Section':
           return <div className="p-4 my-2 min-h-[50px] w-full border border-dashed border-neutral-300 rounded-md bg-neutral-50 dark:bg-neutral-800/30 text-neutral-400 flex items-center justify-center">Rendered Section</div>;
        case 'Heading':
          const { text: headingText = "Default Heading", level: headingLevel = 'h1' } = element.data;
          const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;
          return <HeadingTag className="my-2 font-bold">{headingText}</HeadingTag>;
        case 'TextBlock':
          return <p className="my-2 whitespace-pre-wrap">{element.data.text || "Default text block content."}</p>;
        case 'Image':
          return (
            <div className="my-2">
              <NextImage 
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
          return <div className="my-2 p-2 bg-red-100 text-red-700 rounded-md">Unknown element type: {element.name}</div>;
      }
    };
    return <div className="canvas-element-content w-full">{content()}</div>;
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('.element-controls, .canvas-element-content, button, input, select, textarea')) {
      return; 
    }
    if (activeCanvasTool === 'pan' && canvasRef.current) {
      event.preventDefault();
      setIsCanvasPanning(true);
      setPanStartCoords({
        x: event.clientX,
        y: event.clientY,
        scrollLeft: canvasRef.current.scrollLeft,
        scrollTop: canvasRef.current.scrollTop,
      });
      canvasRef.current.style.cursor = 'grabbing';
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!isCanvasPanning || !panStartCoords || !canvasRef.current) return;
      const dx = event.clientX - panStartCoords.x;
      const dy = event.clientY - panStartCoords.y;
      canvasRef.current.scrollLeft = panStartCoords.scrollLeft - dx;
      canvasRef.current.scrollTop = panStartCoords.scrollTop - dy;
    };
    const handleGlobalMouseUp = () => {
      if (isCanvasPanning && canvasRef.current) {
        setIsCanvasPanning(false);
        canvasRef.current.style.cursor = activeCanvasTool === 'pan' ? 'grab' : 'default';
      }
    };

    if (isCanvasPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isCanvasPanning, panStartCoords, activeCanvasTool, canvasRef]);


  const handleUndo = useCallback(() => {
    if (previousCanvasRows) {
      setCanvasRows(previousCanvasRows);
      setPreviousCanvasRows(null); 
      toast({ title: "Undo Successful", description: "Reverted to previous state." });
    } else {
      toast({ title: "Nothing to Undo", description: "No previous state found." });
    }
  }, [previousCanvasRows, toast]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo]);

  const handleSaveVersion = () => {
    storePreviousState(); 
    const versionName = window.prompt("Enter a name for this version (optional):");
    const versionId = uuidv4();
    const timestamp = new Date().toISOString();
    const versionData = {
      id: versionId,
      name: versionName || `Version - ${new Date(timestamp).toLocaleString()}`,
      timestamp,
      canvasRows: deepCopy(canvasRows), // Save a deep copy
      pageTitle, // Also save pageTitle
    };
    try {
      const existingVersionsRaw = localStorage.getItem('landingPageVersions');
      const existingVersions = existingVersionsRaw ? JSON.parse(existingVersionsRaw) : [];
      localStorage.setItem('landingPageVersions', JSON.stringify([...existingVersions, versionData]));
      toast({ title: "Version Saved", description: `Version "${versionData.name}" saved locally.` });
    } catch (e) {
      toast({ title: "Save Error", description: "Could not save version to local storage.", variant: "destructive" });
    }
  };
  
  const handleBreakpointChange = (bp: BreakpointType) => {
    setActiveBreakpoint(bp);
    toast({title: "Breakpoint Changed", description: `Canvas set to ${bp.name} (${bp.width}px)`});
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    toast({ title: "Publishing...", description: "Preparing your landing page." });

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const projectId = uuidv4();
    const projectData = {
      pageTitle: pageTitle,
      canvasRows: canvasRows,
    };

    try {
      localStorage.setItem(`project-${projectId}`, JSON.stringify(projectData));
      const publishedUrl = `${window.location.origin}/project/${projectId}`;
      
      await navigator.clipboard.writeText(publishedUrl);
      toast({
        title: "Landing Page Published!",
        description: (
          <div className="flex flex-col gap-1">
            <span>Your page is live (locally) at:</span>
            <a href={publishedUrl} target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80 break-all">{publishedUrl}</a>
            <span>Link copied to clipboard.</span>
          </div>
        ),
        duration: 9000,
      });
    } catch (error) {
      console.error("Error publishing to localStorage or copying to clipboard:", error);
      toast({
        title: "Publish Error",
        description: "Could not save page data locally or copy link. Check console.",
        variant: "destructive",
        duration: 9000,
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveSiteSettings = () => {
    const settings = {
      siteTitle: siteTitleSettings,
      siteDescription: siteDescriptionSettings,
      siteLanguage: siteLanguageSettings,
      disableAccessibilityAnimations,
      optOutHtmlPaste,
    };
    console.log("Site Settings Saved:", settings);
    toast({ title: "Settings Saved", description: "Site settings have been saved (logged to console)." });
  };

  const settingsSidebarNavItems = [
    { section: 'Site Settings', items: [
      { id: 'general', label: 'General', icon: Settings },
      { id: 'domains', label: 'Domains', icon: Globe },
      { id: 'redirects', label: 'Redirects', icon: ArrowRightLeft },
      { id: 'forms', label: 'Forms', icon: FileTextLucide },
      { id: 'staging', label: 'Staging & Versions', icon: GitFork },
      { id: 'plans', label: 'Plans', icon: CreditCard },
    ]},
    { section: 'Page Settings', items: [
      { id: 'pageHome', label: 'Home', icon: Home }, 
    ]}
  ];


  if (activeView === 'settings') {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <header className="p-3 border-b border-border flex-shrink-0 flex justify-between items-center bg-card shadow-sm h-14">
          <Button variant="ghost" size="sm" onClick={() => setActiveView('builder')} className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Builder
          </Button>
          <div className="text-lg font-semibold">Site Settings</div>
          <Button onClick={handleSaveSiteSettings} size="sm">Save Settings</Button>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-64 bg-card border-r border-border p-4 space-y-6 flex-shrink-0 overflow-y-auto">
            {settingsSidebarNavItems.map(group => (
              <div key={group.section}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">{group.section}</h3>
                <nav className="space-y-1">
                  {group.items.map(item => (
                    <Button
                      key={item.id}
                      variant={activeSettingsSection === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start text-sm h-9"
                      onClick={() => setActiveSettingsSection(item.id as string)}
                    >
                      <item.icon className="mr-2.5 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </div>
            ))}
          </aside>
          <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 bg-background">
            {activeSettingsSection === 'general' && (
              <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold text-foreground mb-6">General Settings</h1>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="siteTitleSettings" className="text-sm font-medium">Site Title</Label>
                      <Input id="siteTitleSettings" value={siteTitleSettings} onChange={(e) => setSiteTitleSettings(e.target.value)} className="mt-1 bg-card border-input"/>
                    </div>
                    <div>
                      <Label htmlFor="siteLanguageSettings" className="text-sm font-medium">Site Language</Label>
                      <Button variant="outline" className="w-full mt-1 justify-start text-muted-foreground bg-card border-input">Add...</Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="siteDescriptionSettings" className="text-sm font-medium">Site Description</Label>
                    <Textarea id="siteDescriptionSettings" value={siteDescriptionSettings} onChange={(e) => setSiteDescriptionSettings(e.target.value)} placeholder="Describe your site..." className="mt-1 min-h-[100px] bg-card border-input"/>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Preview</Label>
                    <div className="mt-1 p-4 border border-border rounded-md bg-card space-y-1">
                      <p className="text-xs text-green-600 dark:text-green-400">yoursite.url</p>
                      <p className="text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">{siteTitleSettings || "My Site"}</p>
                      <p className="text-sm text-muted-foreground">{siteDescriptionSettings || "Site description"}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium block mb-2">Accessibility</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="disableAnimations" checked={disableAccessibilityAnimations} onCheckedChange={(checked) => setDisableAccessibilityAnimations(Boolean(checked))} />
                      <Label htmlFor="disableAnimations" className="text-sm font-normal text-muted-foreground">Disable movement animations and custom cursors if the user prefers reduced motion</Label>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium block mb-2">HTML Paste</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="optOutHtml" checked={optOutHtmlPaste} onCheckedChange={(checked) => setOptOutHtmlPaste(Boolean(checked))} />
                      <Label htmlFor="optOutHtml" className="text-sm font-normal text-muted-foreground">Opt out of the HTML to Framer <a href="#" className="text-primary hover:underline">Chrome Extension</a></Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeSettingsSection !== 'general' && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Settings for "{settingsSidebarNavItems.flatMap(g => g.items).find(i=>i.id === activeSettingsSection)?.label || activeSettingsSection}" will appear here.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Builder Header */}
      <header className="p-2 border-b border-border flex-shrink-0 flex justify-between items-center bg-card shadow-sm h-14">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Shapes className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => toast({ title: "New File: TBD" })}>New File...</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleUndo} disabled={!previousCanvasRows}>Undo</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Redo: TBD" })}>Redo</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSaveVersion}>Save Version...</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "View Versions: TBD" })}>View Versions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Row" onClick={handleAddRow}><LayoutGridIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Text (TBD)" onClick={() => toast({title: "Add Text: TBD"})}><TypeIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Image (TBD)" onClick={() => toast({title: "Add Image: TBD"})}><ImageIconLucide className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Database (TBD)" onClick={() => toast({title: "Add Database: TBD"})}><Database className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleUndo} disabled={!previousCanvasRows} title="Undo">
              <Undo2 className="h-4 w-4" />
          </Button>
           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSaveVersion} title="Save Version">
              <Save className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
            className="h-8 text-sm font-semibold border-transparent focus:border-input bg-card text-foreground w-auto text-center"
            placeholder="Untitled Page"
          />
          <Badge variant="outline" className="text-xs text-primary border-primary">FREE</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Live Preview" onClick={() => {/* TODO: Preview logic */ toast({title: "Live Preview: TBD"})}}><Globe className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Page Settings" onClick={() => setActiveView('settings')}><SettingsIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Test/Play (TBD)" onClick={() => toast({title: "Play: TBD"})}><Play className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => toast({title: "Invite: TBD"})}><Users className="mr-1.5 h-3 w-3"/>Invite</Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://avatar.vercel.sh/user?size=32" alt="User" data-ai-hint="user avatar"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button onClick={handlePublish} disabled={isPublishing} className="h-8 bg-blue-500 hover:bg-blue-600 text-white">
            {isPublishing ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </header>

      {/* Breakpoint Controls Bar */}
      <div className="p-2 border-b border-border flex-shrink-0 flex justify-between items-center bg-card h-12">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <activeBreakpoint.icon className="h-4 w-4" />
          <span>{activeBreakpoint.name}</span>
          <span>({activeBreakpoint.width}px)</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              Breakpoint <PlusCircle className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {PREDEFINED_BREAKPOINTS.map(bp => (
              <DropdownMenuItem key={bp.name} onClick={() => handleBreakpointChange(bp)}>
                <bp.icon className="mr-2 h-4 w-4" /> {bp.name} ({bp.width}px)
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast({title: "Custom Breakpoint: TBD"})}>Custom...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ResizablePanelGroup
        direction={isMobile ? "vertical" : "horizontal"}
        className="flex-grow"
      >
        {/* Elements Palette */}
        <ResizablePanel
            defaultSize={isMobile ? 25 : 14}
            minSize={isMobile ? 15 : 5}
            maxSize={isMobile ? 40 : 25}
            collapsible={true}
            collapsedSize={0}
            className={cn("bg-card", isMobile ? "border-b" : "border-r")}
        >
          <Card className="h-full rounded-none border-0 shadow-none flex flex-col">
            <CardHeader className="p-3 border-b flex-shrink-0">
              <CardTitle className="text-base flex items-center">
                <PanelLeft className="mr-2 h-4 w-4 text-muted-foreground" />
                Elements
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-grow overflow-hidden">
              <ScrollArea className="h-full"> {/* Added p-3 here for inner spacing */}
                 <div className="p-3">
                  <Input placeholder="Search elements..." className="mb-3 h-9 bg-background" />
                  <Accordion type="multiple" defaultValue={Object.keys(groupedWebElements)} className="w-full">
                    {Object.entries(groupedWebElements).map(([category, elements]) => (
                      <AccordionItem value={category} key={category}>
                        <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline px-1">
                          {category}
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2 pl-0">
                          <div className="space-y-1.5">
                            {elements.map((el) => (
                              <div
                                key={el.name}
                                draggable
                                onDragStart={(e) => handleDragStart(e, el.name)}
                                onClick={() => handleElementClick(el)}
                                className="flex items-center p-2 rounded-md hover:bg-muted/50 cursor-grab active:cursor-grabbing"
                                title={`Drag to add ${el.name}`}
                              >
                                {el.icon && <el.icon className="mr-2.5 h-4 w-4 text-muted-foreground flex-shrink-0" />}
                                <span className="text-sm text-foreground truncate">{el.name}</span>
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                 </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Canvas Area */}
        <ResizablePanel defaultSize={isMobile ? 50 : 72} minSize={30}>
          <div 
            className="h-full flex flex-col bg-zinc-100 dark:bg-zinc-900 overflow-hidden relative" 
            ref={canvasRef} 
            onMouseDown={handleCanvasMouseDown}
          >
            <ScrollArea 
              className="flex-grow bg-zinc-100 dark:bg-zinc-900"
              style={{ cursor: activeCanvasTool === 'pan' ? 'grab' : 'default' }}
            >
              <div
                className="min-h-full p-4 md:p-8 transition-all duration-300 ease-in-out mx-auto"
                style={{ 
                    width: `${activeBreakpoint.width}px`, 
                    maxWidth: '100%', 
                    transform: `scale(${canvasZoom})`, 
                    transformOrigin: 'top center' 
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnCanvas(e, undefined)}
                data-ai-hint="website canvas editor"
              >
                {canvasRows.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-[300px] border-2 border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground">
                    <PanelLeft className="h-12 w-12 mb-2" />
                    <p>Drag elements here or click "Add Row"</p>
                  </div>
                )}
                {canvasRows.map((row) => (
                  <div
                    key={row.id}
                    className={cn(
                      "grid gap-4 my-4 p-2 border-2 rounded-md min-h-[80px]",
                      row.layout,
                      selectedRowId === row.id ? "border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-zinc-900" : "border-transparent hover:border-muted-foreground/30"
                    )}
                    onClick={(e) => handleRowClick(row.id, e)}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {e.stopPropagation(); handleDropOnCanvas(e, row.id);}}
                  >
                    {row.elements.length === 0 && parseInt(row.layout.split('-')[2] || '1', 10) > 0 &&
                      Array.from({ length: Math.max(1, parseInt(row.layout.split('-')?.[2] || '1', 10)) }).map((_, idx) => (
                        <div key={`placeholder-col-${row.id}-${idx}`} className="min-h-[50px] bg-muted/20 dark:bg-zinc-800/30 rounded flex items-center justify-center text-muted-foreground text-xs p-2">
                          Column {idx + 1}
                        </div>
                      ))
                    }
                    {row.elements.map((el) => (
                      <div key={el.id} className="relative group/element p-1 border border-transparent hover:border-blue-500/50 w-full">
                        <div className="absolute top-0 right-0 -mt-0.5 -mr-0.5 z-20 flex items-center gap-1 bg-card p-1 rounded-md shadow-lg element-controls">
                           <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-l-md flex-shrink min-w-0 truncate max-w-[100px] sm:max-w-[150px]" title={el.name}>{el.name}</span>
                           <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground flex-shrink-0" onClick={() => handleEditElement(row.id, el.id)} title="Edit Element"> <Edit3 className="h-3.5 w-3.5" /></Button>
                           <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 flex-shrink-0" onClick={() => handleDeleteElement(row.id, el.id)} title="Delete Element"> <Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                        <div className="mt-10 w-full">
                           {renderCanvasElement(el, row.id)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </ScrollArea>
            {/* Bottom Toolbar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-1 p-1.5 bg-zinc-800 text-zinc-300 rounded-lg shadow-xl">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Select Tool (V)" 
                    onClick={() => {setActiveCanvasTool('select'); if(canvasRef.current) canvasRef.current.style.cursor = 'default';}} 
                    className={cn("h-8 w-8 hover:bg-zinc-700", activeCanvasTool === 'select' && "bg-zinc-600 text-white")}
                > <MousePointer className="h-4 w-4" /></Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Pan Tool (H)" 
                    onClick={() => {setActiveCanvasTool('pan'); if(canvasRef.current) canvasRef.current.style.cursor = 'grab';}} 
                    className={cn("h-8 w-8 hover:bg-zinc-700", activeCanvasTool === 'pan' && "bg-zinc-600 text-white")}
                > <Hand className="h-4 w-4" /></Button>
                <Separator orientation="vertical" className="h-6 bg-zinc-700" />
                <Button variant="ghost" size="icon" title="Canvas Dark Mode (TBD)" onClick={() => toast({title: "Toggle Dark Mode: TBD"})} className="h-8 w-8 hover:bg-zinc-700"> <CircleIcon className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" title="Canvas Light Mode (TBD)" onClick={() => toast({title: "Toggle Light Mode: TBD"})} className="h-8 w-8 hover:bg-zinc-700"> <SunIcon className="h-4 w-4" /></Button>
                <Separator orientation="vertical" className="h-6 bg-zinc-700" />
                <Button variant="ghost" size="icon" title="Toggle Grid (TBD)" onClick={() => toast({title: "Toggle Grid: TBD"})} className="h-8 w-8 hover:bg-zinc-700"> <GridIconLucide className="h-4 w-4" /></Button>
                <Separator orientation="vertical" className="h-6 bg-zinc-700" />
                <Select 
                    value={Math.round(canvasZoom * 100) + '%'} 
                    onValueChange={(val) => { 
                        const numVal = parseInt(val.replace('%','')) / 100; 
                        if(!isNaN(numVal)) setCanvasZoom(numVal); 
                        toast({title: `Zoom set to ${val}`}) 
                    }}
                >
                  <SelectTrigger className="h-8 w-[70px] text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 focus:ring-zinc-500">
                    <SelectValue placeholder="Zoom" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 text-zinc-300 border-zinc-700">
                    {['25%', '50%', '75%', '100%', '125%', '150%', '200%'].map(z => <SelectItem key={z} value={z} className="text-xs focus:bg-zinc-700 focus:text-white">{z}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />
        
        {/* Global Styles & Properties Panel */}
        <ResizablePanel
          defaultSize={isMobile ? 25 : 14}
          minSize={isMobile ? 15 : 5}
          maxSize={isMobile ? 40 : 25}
          collapsible={true}
          collapsedSize={0}
          className={cn("bg-card", isMobile ? "border-t" : "border-l")}
        >
           <Card className="h-full rounded-none border-0 shadow-none flex flex-col">
              <CardHeader className="p-3 border-b flex-shrink-0">
                <CardTitle className="text-base flex items-center">
                  <Palette className="mr-2 h-4 w-4 text-muted-foreground" />
                  Properties
                </CardTitle>
              </CardHeader>
              <ScrollArea className="h-full"> {/* Added p-1 here */}
                <div className="p-1">
                  <Accordion type="multiple" defaultValue={['layout','styles','typography']} className="w-full">
                    <AccordionItem value="template">
                      <AccordionTrigger className="text-sm px-2 py-2.5">Template</AccordionTrigger>
                      <AccordionContent className="px-2 pb-2 space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-between text-xs">Default Template <Plus className="h-3 w-3" /></Button>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="breakpoint">
                      <AccordionTrigger className="text-sm px-2 py-2.5">Breakpoint</AccordionTrigger>
                      <AccordionContent className="px-2 pb-3 space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div><Label htmlFor="prop-x" className="text-xs">X</Label><Input id="prop-x" type="number" defaultValue="0" className="h-8 mt-1 bg-background text-xs"/></div>
                          <div><Label htmlFor="prop-y" className="text-xs">Y</Label><Input id="prop-y" type="number" defaultValue="0" className="h-8 mt-1 bg-background text-xs"/></div>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                          <div><Label htmlFor="prop-w" className="text-xs">W</Label><Input id="prop-w" type="number" defaultValue="1200" className="h-8 mt-1 bg-background text-xs"/></div>
                          <LinkIconLucide className="h-4 w-4 text-muted-foreground self-end mb-1.5" />
                          <div><Label htmlFor="prop-h" className="text-xs">H</Label><Input id="prop-h" type="number" defaultValue="800" className="h-8 mt-1 bg-background text-xs"/></div>
                        </div>
                         <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="prop-fixed-w" className="text-xs">Fixed W</Label>
                                <Select defaultValue="Auto">
                                    <SelectTrigger id="prop-fixed-w" className="h-8 mt-1 bg-background text-xs"><SelectValue/></SelectTrigger>
                                    <SelectContent><SelectItem value="Auto">Auto</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="prop-fixed-h" className="text-xs">Fixed H</Label>
                                <Select defaultValue="Auto">
                                    <SelectTrigger id="prop-fixed-h" className="h-8 mt-1 bg-background text-xs"><SelectValue/></SelectTrigger>
                                    <SelectContent><SelectItem value="Auto">Auto</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent>
                                </Select>
                            </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="layout">
                      <AccordionTrigger className="text-sm px-2 py-2.5">Layout</AccordionTrigger>
                      <AccordionContent className="px-2 pb-3 space-y-3">
                        <p className="text-xs text-muted-foreground">Row Columns (Selected: {selectedRowId ? canvasRows.find(r=>r.id === selectedRowId)?.layout.split('-')[2] || 'N/A' : 'None'})</p>
                        <div className="flex gap-1.5">
                          {['1', '2', '3', '4'].map(col => (
                            <Button key={col} variant="outline" size="xs" className="flex-1" onClick={() => handleChangeRowLayout(`grid-cols-${col}`)} disabled={!selectedRowId}>{col} Col</Button>
                          ))}
                        </div>
                         <Button variant="outline" size="sm" className="w-full justify-between text-xs">Add Layout Option <Plus className="h-3 w-3" /></Button>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="typography">
                      <AccordionTrigger className="text-sm px-2 py-2.5 flex items-center">Typography <Info className="ml-1.5 h-3 w-3 text-muted-foreground"/></AccordionTrigger>
                      <AccordionContent className="px-2 pb-3 space-y-3">
                         <div className="flex items-center gap-2">
                            <Label htmlFor="prop-font-base" className="text-xs flex-1">Base</Label>
                            <Input id="prop-font-base" type="number" defaultValue="16" className="h-8 w-16 bg-background text-xs"/>
                            <span className="text-xs text-muted-foreground">PX</span>
                            <Button variant="outline" size="icon" className="h-7 w-7"><Minus className="h-3 w-3"/></Button>
                            <Button variant="outline" size="icon" className="h-7 w-7"><Plus className="h-3 w-3"/></Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="cursor">
                      <AccordionTrigger className="text-sm px-2 py-2.5">Cursor</AccordionTrigger>
                      <AccordionContent className="px-2 pb-3">
                         <Button variant="outline" size="sm" className="w-full justify-between text-xs">Add Cursor Style <Plus className="h-3 w-3" /></Button>
                      </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="effects">
                      <AccordionTrigger className="text-sm px-2 py-2.5">Effects</AccordionTrigger>
                      <AccordionContent className="px-2 pb-3">
                         <Button variant="outline" size="sm" className="w-full justify-between text-xs">Add Effect <Plus className="h-3 w-3" /></Button>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="styles">
                      <AccordionTrigger className="text-sm px-2 py-2.5">Styles</AccordionTrigger>
                      <AccordionContent className="px-2 pb-3 space-y-3">
                         <div className="flex items-center gap-2">
                            <Label htmlFor="prop-fill" className="text-xs flex-1">Fill</Label>
                            <Input id="prop-fill" type="color" defaultValue="#FFFFFF" className="h-8 w-10 p-0.5 bg-background"/>
                         </div>
                         <div>
                            <Label htmlFor="prop-overflow" className="text-xs">Overflow</Label>
                            <Select defaultValue="Visible">
                                <SelectTrigger id="prop-overflow" className="h-8 mt-1 bg-background text-xs"><SelectValue/></SelectTrigger>
                                <SelectContent><SelectItem value="Visible">Visible</SelectItem><SelectItem value="Hidden">Hidden</SelectItem><SelectItem value="Scroll">Scroll</SelectItem></SelectContent>
                            </Select>
                         </div>
                         <Button variant="outline" size="sm" className="w-full justify-between text-xs">Add Style <Plus className="h-3 w-3" /></Button>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="codeoverrides">
                      <AccordionTrigger className="text-sm px-2 py-2.5">Code Overrides</AccordionTrigger>
                      <AccordionContent className="px-2 pb-3">
                         <Button variant="outline" size="sm" className="w-full justify-between text-xs">Add Override <Plus className="h-3 w-3" /></Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </ScrollArea>
            </Card>
        </ResizablePanel>
      </ResizablePanelGroup>

      {isPreviewModalOpen && currentPreview && (
        <ElementPreviewModal
          isOpen={isPreviewModalOpen}
          onOpenChange={setIsPreviewModalOpen}
          elementName={currentPreview.name}
        >
          {currentPreview.previewComponent}
        </ElementPreviewModal>
      )}

      {editingMarqueeElementId && (
        <EditMarqueeModal
          isOpen={isEditMarqueeModalOpen}
          onOpenChange={setIsEditMarqueeModalOpen}
          initialReviews={canvasRows.flatMap(r => r.elements).find(el => el.id === editingMarqueeElementId && el.type === 'MarqueeTestimonials')?.data.reviews || []}
          onUpdate={(updatedReviews) => handleUpdateMarqueeData(editingMarqueeElementId, updatedReviews)}
        />
      )}
      {editingHeroVideoElementId && (
        <EditHeroVideoModal
          isOpen={isEditHeroVideoModalOpen}
          onOpenChange={setIsEditHeroVideoModalOpen}
          initialData={canvasRows.flatMap(r => r.elements).find(el => el.id === editingHeroVideoElementId && el.type === 'HeroVideoDialog')?.data as HeroVideoData || {} as HeroVideoData}
          onUpdate={(updatedData) => handleUpdateHeroVideoData(editingHeroVideoElementId, updatedData)}
        />
      )}
       {editingTerminalElementId && (
        <EditTerminalModal
          isOpen={isEditTerminalModalOpen}
          onOpenChange={setIsEditTerminalModalOpen}
          initialLines={canvasRows.flatMap(r => r.elements).find(el => el.id === editingTerminalElementId && el.type === 'TerminalAnimation')?.data.lines || []}
          onUpdate={(updatedLines) => handleUpdateTerminalData(editingTerminalElementId, updatedLines)}
        />
      )}
    </div>
  );
}
