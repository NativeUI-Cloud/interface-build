
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Shapes, Palette, PanelLeft, Edit3, Trash2, PlusCircle, Rows, Columns, GripVertical, Video, TerminalSquareIcon, TvIcon, LayoutGrid as LayoutGridIcon, Eye, Save, Undo2, GridIcon } from 'lucide-react'; // Added GridIcon
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { CanvasElement, CanvasRow, HeroVideoData, BentoData } from '@/lib/types'; // Added BentoData
import MarqueeDemo, { defaultReviews, type Review as MarqueeReviewType } from './landing-page-elements/MarqueeDemo';
import TerminalDemo, { defaultTerminalLines, type TerminalLine } from './landing-page-elements/TerminalDemo';
import HeroVideoDialogDemo from './landing-page-elements/HeroVideoDialogDemo';
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import BentoDemo, { defaultBentoFeatures } from './landing-page-elements/BentoDemo'; // New import

import ElementPreviewModal from './ElementPreviewModal';
import EditMarqueeModal from './landing-page-elements/EditMarqueeModal';
import EditHeroVideoModal from './landing-page-elements/EditHeroVideoModal';
import EditTerminalModal from './landing-page-elements/EditTerminalModal';


const webElements: { name: string; type: string; previewComponent: React.ReactNode; initialData: any; icon?: React.ElementType }[] = [
  {
    name: 'Marquee Testimonials',
    type: 'MarqueeTestimonials',
    previewComponent: <MarqueeDemo reviews={defaultReviews} />,
    initialData: { reviews: defaultReviews.map(r => ({...r, id: uuidv4() })) },
    icon: Rows,
  },
  {
    name: 'Terminal Animation',
    type: 'TerminalAnimation',
    previewComponent: <TerminalDemo lines={defaultTerminalLines} />,
    initialData: { lines: defaultTerminalLines.map(l => ({...l, id: uuidv4()})) },
    icon: TerminalSquareIcon,
  },
  {
    name: 'Hero Video',
    type: 'HeroVideoDialog',
    previewComponent: <HeroVideoDialogDemo />,
    initialData: {
      videoSrc: "https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb",
      thumbnailSrcLight: "https://startup-template-sage.vercel.app/hero-light.png",
      thumbnailSrcDark: "https://startup-template-sage.vercel.app/hero-dark.png",
      thumbnailAlt: "Hero Video",
      animationStyle: "from-center" as HeroVideoData['animationStyle'],
    },
    icon: Video,
  },
  {
    name: 'Bento Grid', // New Element
    type: 'BentoGrid',
    previewComponent: <BentoDemo features={defaultBentoFeatures} />,
    initialData: { features: defaultBentoFeatures.map(f => ({...f, id: uuidv4()})) }, // Ensure defaultBentoFeatures is imported
    icon: GridIcon, // Using GridIcon
  },
  {
    name: 'Hero Section',
    type: 'HeroSection',
    previewComponent: <div className="p-4 text-center border border-dashed rounded-md bg-background text-muted-foreground h-48 flex items-center justify-center w-full">Hero Preview</div>,
    initialData: { title: "Hero Title", subtitle: "Hero Subtitle"},
    icon: TvIcon,
  },
  {
    name: 'Feature Grid',
    type: 'FeatureGrid',
    previewComponent: <div className="p-4 text-center border border-dashed rounded-md bg-background text-muted-foreground h-40 flex items-center justify-center w-full">Feature Grid Preview</div>,
    initialData: { features: [{title: "Feature 1"}, {title: "Feature 2"}, {title: "Feature 3"}]},
    icon: LayoutGridIcon,
  },
  {
    name: 'Button',
    type: 'ButtonElement',
    previewComponent: <Button variant="default" size="lg" className="pointer-events-none">Example Button</Button>,
    initialData: { text: "Click Me"},
    icon: GripVertical,
  },
  {
    name: 'Heading',
    type: 'HeadingElement',
    previewComponent: <h1 className="text-3xl font-bold text-primary">Large Heading</h1>,
    initialData: { text: "My Awesome Heading", level: 'h1'}
  },
  {
    name: 'Text Block',
    type: 'TextBlockElement',
    previewComponent: <p className="text-base text-muted-foreground leading-relaxed">This is a paragraph of text.</p>,
    initialData: { text: "Lorem ipsum dolor sit amet."}
  },
];

export default function LandingPageGenerator() {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<{ name: string; component: React.ReactNode } | null>(null);
  
  const [canvasRows, setCanvasRows] = useState<CanvasRow[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [draggedElementName, setDraggedElementName] = useState<string | null>(null);


  const [isEditMarqueeModalOpen, setIsEditMarqueeModalOpen] = useState(false);
  const [editingMarqueeElementId, setEditingMarqueeElementId] = useState<string | null>(null);

  const [isEditHeroVideoModalOpen, setIsEditHeroVideoModalOpen] = useState(false); 
  const [editingHeroVideoElementId, setEditingHeroVideoElementId] = useState<string | null>(null); 

  const [isEditTerminalModalOpen, setIsEditTerminalModalOpen] = useState(false);
  const [editingTerminalElementId, setEditingTerminalElementId] = useState<string | null>(null);
  
  const [previousCanvasRows, setPreviousCanvasRows] = useState<CanvasRow[] | null>(null);

  const deepCopy = (obj: any) => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof Array) {
      return obj.reduce((arr, item, i) => {
        arr[i] = deepCopy(item);
        return arr;
      }, []);
    }
    if (obj instanceof Object) {
      return Object.keys(obj).reduce((newObj: any, key) => {
        newObj[key] = deepCopy(obj[key]);
        return newObj;
      }, {});
    }
    return obj; 
  };
  
  const storePreviousState = () => {
    setPreviousCanvasRows(deepCopy(canvasRows));
  };

  const handleUndo = () => {
    if (previousCanvasRows) {
      setCanvasRows(previousCanvasRows);
      setPreviousCanvasRows(null); // Only one level of undo for now
      toast({ title: "Undo Successful", description: "Reverted to the previous state." });
    } else {
      toast({ title: "Nothing to Undo", description: "No previous state saved.", variant: "default" });
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [previousCanvasRows]); // Re-bind if previousCanvasRows changes

  const handleSaveVersion = () => {
    const versionName = window.prompt("Enter a name for this version (optional):");
    const versionId = uuidv4();
    const versionTimestamp = new Date().toISOString();
    const versionData = {
      id: versionId,
      name: versionName || `Version - ${new Date(versionTimestamp).toLocaleString()}`,
      timestamp: versionTimestamp,
      rows: deepCopy(canvasRows),
    };
    try {
      const existingVersionsRaw = localStorage.getItem('landingPageVersions');
      const existingVersions = existingVersionsRaw ? JSON.parse(existingVersionsRaw) : [];
      existingVersions.push(versionData);
      localStorage.setItem('landingPageVersions', JSON.stringify(existingVersions));
      toast({ title: "Version Saved", description: `"${versionData.name}" saved successfully.` });
    } catch (e) {
      toast({ title: "Error Saving Version", description: "Could not save version to local storage.", variant: "destructive" });
    }
  };

  const handleElementBadgeClick = (element: typeof webElements[0]) => {
    setCurrentPreview({ name: element.name, component: element.previewComponent });
    setIsPreviewModalOpen(true);
  };

  const handleDragStart = (event: React.DragEvent<HTMLElement>, elementName: string) => {
    event.dataTransfer.setData("application/x-nativeui-landing-element-name", elementName);
    event.dataTransfer.effectAllowed = "move";
    setDraggedElementName(elementName);
  };

  const handleDragEnd = () => {
    setDraggedElementName(null);
  };


  const handleAddRow = () => {
    storePreviousState();
    const newRow: CanvasRow = {
      id: uuidv4(),
      layout: 'grid-cols-1',
      elements: [],
    };
    setCanvasRows(prevRows => [...prevRows, newRow]);
    setSelectedRowId(newRow.id);
    toast({ title: "Row Added", description: "A new row has been added to the canvas." });
  };

  const handleSetRowLayout = (rowId: string, layout: string) => {
    storePreviousState();
    setCanvasRows(prevRows => 
      prevRows.map(row => 
        row.id === rowId ? { ...row, layout } : row
      )
    );
  };

  const handleDropOnCanvas = (event: React.DragEvent<HTMLDivElement>, targetRowId?: string, targetColIndex?: number) => {
    event.preventDefault();
    const elementName = event.dataTransfer.getData("application/x-nativeui-landing-element-name");
    const elementDefinition = webElements.find(el => el.name === elementName);

    if (elementDefinition) {
      storePreviousState();
      const newElement: CanvasElement = {
        id: uuidv4(),
        name: elementDefinition.name,
        type: elementDefinition.type,
        data: deepCopy(elementDefinition.initialData || {}),
      };

      setCanvasRows(prevRows => {
        if (prevRows.length === 0) {
          const newRowId = uuidv4();
          setSelectedRowId(newRowId);
          return [{ id: newRowId, layout: 'grid-cols-1', elements: [newElement] }];
        }
        const effectiveRowId = targetRowId || selectedRowId || prevRows[prevRows.length - 1].id;
        return prevRows.map(row => {
          if (row.id === effectiveRowId) {
            return { ...row, elements: [...row.elements, newElement] };
          }
          return row;
        });
      });

      toast({
        title: `${elementDefinition.name} added`,
        description: "Element added to the canvas.",
        duration: 3000,
      });
    }
    setDraggedElementName(null);
  };

  const handleEditElement = (element: CanvasElement, rowId: string) => {
    if (element.type === 'MarqueeTestimonials') {
      setEditingMarqueeElementId(element.id); 
      setIsEditMarqueeModalOpen(true);
    } else if (element.type === 'HeroVideoDialog') {
      setEditingHeroVideoElementId(element.id);
      setIsEditHeroVideoModalOpen(true);
    } else if (element.type === 'TerminalAnimation') {
      setEditingTerminalElementId(element.id);
      setIsEditTerminalModalOpen(true);
    } else if (element.type === 'BentoGrid') {
      toast({ title: "Edit Bento Grid", description: "Bento Grid editing coming soon!", duration: 3000 });
      // setEditingBentoElementId(element.id); // Future: manage state for bento modal
      // setIsEditBentoModalOpen(true);
    } else {
      toast({
        title: `Edit ${element.name}`,
        description: `Editing for ${element.name} is not yet implemented.`,
        duration: 3000
      });
    }
  };

  const handleDeleteElement = (elementId: string, rowId: string) => {
    storePreviousState();
    setCanvasRows(prevRows =>
      prevRows.map(row => 
        row.id === rowId 
          ? { ...row, elements: row.elements.filter(el => el.id !== elementId) } 
          : row
      ).filter(row => row.elements.length > 0 || (prevRows.length === 1 && prevRows[0].id === rowId && row.elements.length === 0)) 
    );
    if (canvasRows.every(r => r.elements.length === 0) && canvasRows.length > 1) {
        setCanvasRows(prev => prev.filter(r => r.elements.length > 0));
    }
    toast({
      title: "Element removed",
      description: "The element has been removed from the canvas.",
      duration: 2000
    });
  };

  const handleUpdateMarqueeData = (updatedReviews: MarqueeReviewType[]) => {
    if (!editingMarqueeElementId) return;
    storePreviousState();
    setCanvasRows(prevRows =>
      prevRows.map(row => ({
        ...row,
        elements: row.elements.map(el =>
          el.id === editingMarqueeElementId && el.type === 'MarqueeTestimonials'
            ? { ...el, data: { ...el.data, reviews: updatedReviews } } 
            : el
        )
      }))
    );
    toast({ title: "Marquee Updated", description: "Changes applied to the Marquee."});
  };

  const handleUpdateHeroVideoData = (updatedData: HeroVideoData) => {
    if (!editingHeroVideoElementId) return;
    storePreviousState();
    setCanvasRows(prevRows =>
      prevRows.map(row => ({
        ...row,
        elements: row.elements.map(el =>
          el.id === editingHeroVideoElementId && el.type === 'HeroVideoDialog'
            ? { ...el, data: updatedData } 
            : el
        )
      }))
    );
     toast({ title: "Hero Video Updated", description: "Changes applied to the Hero Video."});
  };

  const handleUpdateTerminalData = (updatedLines: TerminalLine[]) => {
    if (!editingTerminalElementId) return;
    storePreviousState();
    setCanvasRows(prevRows =>
      prevRows.map(row => ({
        ...row,
        elements: row.elements.map(el =>
          el.id === editingTerminalElementId && el.type === 'TerminalAnimation'
            ? { ...el, data: { ...el.data, lines: updatedLines } }
            : el
        )
      }))
    );
    toast({ title: "Terminal Animation Updated", description: "Changes applied to the Terminal."});
  };
  
  const renderCanvasElement = (element: CanvasElement, rowId: string) => {
    let content;
    switch (element.type) {
      case 'MarqueeTestimonials':
        content = <MarqueeDemo reviews={element.data.reviews || []} />;
        break;
      case 'TerminalAnimation':
        content = <TerminalDemo lines={element.data.lines || []} />;
        break;
      case 'HeroVideoDialog':
        const videoData = element.data as HeroVideoData;
        content = (
          <div className="relative w-full mx-auto my-4">
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
        break;
      case 'BentoGrid': // New case
        content = <BentoDemo features={element.data.features || []} />;
        break;
      case 'HeroSection':
        content = <div className="p-8 text-center bg-card shadow-md rounded-lg w-full">
                 <h1 className="text-4xl font-bold mb-4 text-primary">{element.data.title}</h1>
                 <p className="text-xl text-muted-foreground">{element.data.subtitle}</p>
               </div>;
        break;
      case 'FeatureGrid':
        content = <div className="p-6 bg-card shadow-md rounded-lg grid md:grid-cols-3 gap-4 w-full">
                {(element.data.features || []).map((feature: any, index: number) => (
                  <div key={index} className="p-4 border rounded-md">
                    <h3 className="font-semibold text-lg text-primary">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">Description for {feature.title}</p>
                  </div>
                ))}
               </div>;
        break;
      case 'ButtonElement':
        content = <Button size="lg" className="pointer-events-none">{element.data.text}</Button>;
        break;
      case 'HeadingElement':
        const HeadingTag = element.data.level as keyof JSX.IntrinsicElements || 'h1';
        content = <HeadingTag className="text-3xl font-bold text-primary">{element.data.text}</HeadingTag>;
        break;
      case 'TextBlockElement':
        content = <p className="text-base text-muted-foreground leading-relaxed">{element.data.text}</p>;
        break;
      default:
        content = <div className="text-destructive p-2 bg-destructive/10 rounded-md">Unknown element type: {element.type}</div>;
        break;
    }
    return (
      <div className="relative border border-primary/30 p-1 my-2 shadow-md transition-all w-full group bg-card">
            <div className="absolute top-1 right-1 z-20 flex items-center gap-1 bg-background/80 p-1 rounded-md shadow-lg">
                <span className="text-xs text-foreground px-1.5 py-0.5 rounded-sm truncate max-w-[100px] sm:max-w-[150px] flex-shrink min-w-0">
                    {element.name}
                </span>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 p-1 flex-shrink-0"
                    onClick={() => handleEditElement(element, rowId)}
                    title={`Edit ${element.name}`}
                >
                    <Edit3 className="h-3.5 w-3.5"/>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1 flex-shrink-0"
                    onClick={() => handleDeleteElement(element.id, rowId)}
                    title={`Delete ${element.name}`}
                >
                    <Trash2 className="h-3.5 w-3.5"/>
                </Button>
            </div>
            <div className="p-2 pt-10 w-full"> {/* Increased pt to make space for controls */}
                {content}
            </div>
        </div>
    );
  };
  
  const selectedRowData = canvasRows.find(row => row.id === selectedRowId);
  const marqueeElementBeingEdited = canvasRows.flatMap(r => r.elements).find(el => el.id === editingMarqueeElementId && el.type === 'MarqueeTestimonials');
  const heroVideoElementBeingEdited = canvasRows.flatMap(r => r.elements).find(el => el.id === editingHeroVideoElementId && el.type === 'HeroVideoDialog');
  const terminalElementBeingEdited = canvasRows.flatMap(r => r.elements).find(el => el.id === editingTerminalElementId && el.type === 'TerminalAnimation');


  return (
    <>
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <header className="p-3 border-b border-border flex-shrink-0 flex justify-between items-center">
          <h1 className="text-xl font-semibold flex items-center">
            <PanelLeft className="h-6 w-6 mr-2 text-primary" />
            NativeUI
          </h1>
          <div className="flex items-center gap-2">
             <Button type="button" variant="outline" onClick={handleUndo} disabled={!previousCanvasRows}>
               <Undo2 className="mr-2 h-4 w-4" />
                Undo
            </Button>
            <Button type="button" variant="outline" onClick={handleSaveVersion}>
               <Save className="mr-2 h-4 w-4" />
                Save Version
            </Button>
             <Button type="button" variant="default" onClick={handleAddRow}>
               <PlusCircle className="mr-2 h-4 w-4" />
                Add Row
            </Button>
          </div>
        </header>

        <ResizablePanelGroup 
            direction={isMobile ? "vertical" : "horizontal"} 
            className="flex-grow"
        >
          <ResizablePanel 
            defaultSize={14} 
            minSize={isMobile ? 15 : 5} 
            maxSize={isMobile ? 40 : 25} 
            collapsible={true}
            collapsedSize={0}
            className={cn("bg-card", isMobile ? "border-b" : "border-r")}
          >
            <Card className="h-full rounded-none border-0 shadow-none flex flex-col">
              <CardHeader className="p-3 border-b flex-shrink-0">
                <CardTitle className="text-lg flex items-center">
                  <Shapes className="mr-2 h-5 w-5 text-muted-foreground" />
                  Elements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow overflow-hidden">
                <ScrollArea className="h-full p-3">
                   <div className="flex flex-wrap gap-2">
                    {webElements.map(el => (
                      <Badge
                        key={el.name}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, el.name)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleElementBadgeClick(el)}
                        variant="outline"
                        className="cursor-grab active:cursor-grabbing transition-colors hover:bg-accent hover:text-accent-foreground py-1.5 px-3 text-sm border-border"
                        title={`Drag to add "${el.name}" to canvas. Click to preview.`}
                      >
                        {el.icon && <el.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                        {el.name}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel 
            defaultSize={72} 
            minSize={30}
            className="flex flex-col bg-muted/20 dark:bg-zinc-800/30" 
          >
             <div 
                className="flex-1 h-full overflow-y-auto p-4 md:p-6 bg-zinc-100 dark:bg-zinc-900" // Added distinct background
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDropOnCanvas(e, selectedRowId || canvasRows[canvasRows.length -1]?.id)}
                data-ai-hint="website canvas editor" 
              >
                <div className="max-w-6xl mx-auto bg-card shadow-lg rounded-md p-2 md:p-4 min-h-full">  {/* Page-like container */}
                    {canvasRows.length === 0 ? (
                      <div 
                        className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50 py-10 min-h-[300px] border-2 border-dashed border-border rounded-md"
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        onDrop={(e) => { e.stopPropagation(); handleDropOnCanvas(e, undefined); }} // Allow dropping on empty canvas to create first row
                      >
                        <Rows className="h-20 w-20 mb-4 text-gray-400 dark:text-gray-500" />
                        <p className="text-lg font-medium">Page Canvas</p>
                        <p className="text-sm">Click "Add Row" to start, then drag elements from the left palette here.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {canvasRows.map(row => (
                          <div 
                            key={row.id} 
                            className={cn(
                              "grid gap-4 p-2 border-2 rounded-md min-h-[100px]",
                              selectedRowId === row.id ? 'border-primary bg-primary/5' : 'border-dashed border-border hover:border-primary/50 hover:bg-muted/10',
                              row.layout,
                              draggedElementName && selectedRowId === row.id && 'outline-2 outline-dashed outline-accent'
                            )}
                            onClick={() => setSelectedRowId(row.id)}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); if (selectedRowId !== row.id) setSelectedRowId(row.id); }}
                            onDrop={(e) => { e.stopPropagation(); handleDropOnCanvas(e, row.id); }}
                          >
                            {row.elements.length === 0 && Array.from({ length: parseInt(row.layout.split('-')[2] || '1', 10) }).map((_, idx) => (
                                <div key={idx} className="border border-dashed border-muted-foreground/30 rounded-md min-h-[80px] flex items-center justify-center text-muted-foreground/50 text-xs p-2">
                                  Column {idx + 1}
                                </div>
                            ))}
                            {row.elements.map(el => (
                              <div key={el.id} className="min-w-0 w-full"> 
                                {renderCanvasElement(el, row.id)}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
          </ResizablePanel>
          <ResizableHandle withHandle />

          <ResizablePanel 
            defaultSize={14} 
            minSize={isMobile ? 15 : 5} 
            maxSize={isMobile ? 40 : 25} 
            collapsible={true}
            collapsedSize={0}
            className={cn("bg-card", isMobile ? "border-t" : "border-l")}
          >
             <Card className="h-full rounded-none border-0 shadow-none flex flex-col">
              <CardHeader className="p-3 border-b flex-shrink-0">
                <CardTitle className="text-lg flex items-center">
                  <Palette className="mr-2 h-5 w-5 text-muted-foreground" />
                  Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-grow overflow-hidden">
                <ScrollArea className="h-full p-4 space-y-4"> 
                  {selectedRowData ? (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Row Settings (ID: ...{selectedRowData.id.slice(-4)})</h3>
                      <Label htmlFor="columnLayout">Column Layout</Label>
                      <div className="flex gap-2 mt-1">
                        {['grid-cols-1', 'grid-cols-2', 'grid-cols-3', 'grid-cols-4'].map(layout => (
                          <Button
                            key={layout}
                            variant={selectedRowData.layout === layout ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSetRowLayout(selectedRowData.id, layout)}
                          >
                            {layout.split('-')[2]} Col
                          </Button>
                        ))}
                      </div>
                    </div>
                  ) : (
                     <p className="text-sm text-muted-foreground">Select a row on the canvas to see its properties.</p>
                  )}
                  <hr className="my-4"/>
                  <p className="text-sm text-muted-foreground">Select an element on the canvas to edit its properties here. (Coming soon)</p>
                </ScrollArea>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {currentPreview && (
        <ElementPreviewModal
            isOpen={isPreviewModalOpen}
            onOpenChange={setIsPreviewModalOpen}
            elementName={currentPreview?.name}
        >
            {currentPreview?.component}
        </ElementPreviewModal>
      )}

      {isEditMarqueeModalOpen && marqueeElementBeingEdited && (
        <EditMarqueeModal
          isOpen={isEditMarqueeModalOpen}
          onOpenChange={setIsEditMarqueeModalOpen}
          initialReviews={marqueeElementBeingEdited.data.reviews || []}
          onUpdate={handleUpdateMarqueeData} 
        />
      )}

      {isEditHeroVideoModalOpen && heroVideoElementBeingEdited && (
        <EditHeroVideoModal
          isOpen={isEditHeroVideoModalOpen}
          onOpenChange={setIsEditHeroVideoModalOpen}
          initialData={heroVideoElementBeingEdited.data as HeroVideoData}
          onUpdate={handleUpdateHeroVideoData}
        />
      )}
      
      {isEditTerminalModalOpen && terminalElementBeingEdited && (
        <EditTerminalModal
          isOpen={isEditTerminalModalOpen}
          onOpenChange={setIsEditTerminalModalOpen}
          initialLines={terminalElementBeingEdited.data.lines || []}
          onUpdate={handleUpdateTerminalData}
        />
      )}
    </>
  );
}
