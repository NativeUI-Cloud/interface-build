
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Shapes, Palette, PanelLeft, Edit3, Trash2, Copy, Download, SendHorizonal, Sparkles, GripVertical, LayoutGrid as LayoutGridIcon,
  Type as TypeIcon, Database, Settings, Users, Play, Globe, Settings2 as SettingsIcon, ChevronDown, Search, PlusCircle,
  Monitor, Tablet, Smartphone, MousePointer, Hand, Circle as CircleIcon, Sun as SunIcon, Grid as GridIconLucide, Eye,
  Link as LinkIconLucide, Info, Heading1, Baseline, ImageIcon, MessageSquareText, ListChecks, Youtube, TerminalSquareIcon,
  Undo2, Save, LayoutPanelLeft, Plus, Minus, CreditCard, HelpCircle, Mail, Megaphone, UserCircle, Video,
  ArrowLeft, ClipboardCopy, FileText, GitFork, Home, UploadCloud, ListTodo, TerminalSquare, PanelTop, PanelBottom, Server, FontAwesome, Type, FilePlus2, Projector,
  AlignCenter, AlignLeft, AlignRight, FontSize, HandIcon, Star, UserSquare2, MessageSquareQuote, Lightbulb, Building, Twitter, Facebook, Linkedin, Instagram
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CanvasElement, CanvasRow, HeroVideoData, MarqueeReviewType, TerminalLine as ITerminalLine, BentoFeature, AnimatedListItem as AnimatedListItemType, WebElementDefinition, Breakpoint as BreakpointType, HeaderElementData, GenerateLandingPageCodeInput, ProjectData, HtmlTag, TailwindFontSize, TextAlignment, TestimonialCardData, FeatureItemData, LogoCloudData, FooterData, LogoItem, FooterColumn, FooterLink } from '@/lib/types';
import { handleGenerateLandingPageCodeAction } from '@/app/actions';
import { useTheme } from "next-themes";
import * as LucideIcons from 'lucide-react';


import MarqueeDemo, { defaultReviews as defaultMarqueeReviews } from './landing-page-elements/MarqueeDemo';
import TerminalDemo, { defaultTerminalLines } from './landing-page-elements/TerminalDemo';
import HeroVideoDialogDemo from './landing-page-elements/HeroVideoDialogDemo';
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import BentoDemo, { defaultBentoFeatures } from './landing-page-elements/BentoDemo';
import AnimatedListDemo, { defaultNotifications as defaultAnimatedListItems } from './landing-page-elements/AnimatedListDemo';
import HeaderElement from './landing-page-elements/HeaderElement';
import AlertDemo from './landing-page-elements/AlertDemo';
import CardDemo from './landing-page-elements/CardDemo';

import DialogDemo from './landing-page-elements/DialogDemo';
import TabsDemo from './landing-page-elements/TabsDemo';
import TooltipDemo from './landing-page-elements/TooltipDemo';
import McpDemo, { defaultCommands as defaultMcpCommands } from './landing-page-elements/McpDemo';
import ProjectDashboard from './ProjectDashboard';


import ElementPreviewModal from './ElementPreviewModal';
import EditMarqueeModal from './landing-page-elements/EditMarqueeModal';
import EditHeroVideoModal from './landing-page-elements/EditHeroVideoModal';
import EditTerminalModal from './landing-page-elements/EditTerminalModal';
import EditHeaderModal from './landing-page-elements/EditHeaderModal';

import { v4 as uuidv4 } from 'uuid';
import { useIsMobile } from "@/hooks/use-mobile";

const PREDEFINED_BREAKPOINTS: BreakpointType[] = [
  { name: 'Desktop', width: 1280, icon: Monitor },
  { name: 'Tablet', width: 768, icon: Tablet },
  { name: 'Phone', width: 375, icon: Smartphone },
];

const defaultHeaderData: HeaderElementData = {
  siteTitle: 'My Awesome Site',
  logoUrl: '',
  navLinks: [
    { id: uuidv4(), text: 'Home', href: '#' },
    { id: uuidv4(), text: 'About', href: '#' },
    { id: uuidv4(), text: 'Services', href: '#' },
    { id: uuidv4(), text: 'Contact', href: '#', isButton: true },
  ],
  backgroundColor: 'bg-background',
  textColor: 'text-foreground',
  sticky: false,
};

const googleFonts = [
  { name: 'Roboto', importUrl: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap', family: "'Roboto', sans-serif" },
  { name: 'Open Sans', importUrl: 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&display=swap', family: "'Open Sans', sans-serif" },
  { name: 'Lato', importUrl: 'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap', family: "'Lato', sans-serif" },
  { name: 'Montserrat', importUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&display=swap', family: "'Montserrat', sans-serif" },
  { name: 'Poppins', importUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700&display=swap', family: "'Poppins', sans-serif" },
  { name: 'Nunito', importUrl: 'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap', family: "'Nunito', sans-serif" },
  { name: 'Source Sans Pro', importUrl: 'https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700&display=swap', family: "'Source Sans Pro', sans-serif" },
  { name: 'Inter', importUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap', family: "'Inter', sans-serif" },
  { name: 'Work Sans', importUrl: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;700&display=swap', family: "'Work Sans', sans-serif" },
  { name: 'Raleway', importUrl: 'https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;700&display=swap', family: "'Raleway', sans-serif" },
  { name: 'Noto Sans', importUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&display=swap', family: "'Noto Sans', sans-serif" },
  { name: 'Ubuntu', importUrl: 'https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap', family: "'Ubuntu', sans-serif" },
  { name: 'PT Sans', importUrl: 'https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap', family: "'PT Sans', sans-serif" },
  { name: 'Oswald', importUrl: 'https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;700&display=swap', family: "'Oswald', sans-serif" },
  { name: 'Merriweather', importUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap', family: "'Merriweather', serif" },
  { name: 'Playfair Display', importUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap', family: "'Playfair Display', serif" },
  { name: 'Lora', importUrl: 'https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap', family: "'Lora', serif" },
  { name: 'Roboto Slab', importUrl: 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;400;500;700&display=swap', family: "'Roboto Slab', serif" },
  { name: 'PT Serif', importUrl: 'https://fonts.googleapis.com/css2?family=PT+Serif:wght@400;700&display=swap', family: "'PT Serif', serif" },
  { name: 'EB Garamond', importUrl: 'https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&display=swap', family: "'EB Garamond', serif" },
  { name: 'Bitter', importUrl: 'https://fonts.googleapis.com/css2?family=Bitter:wght@300;400;700&display=swap', family: "'Bitter', serif" },
  { name: 'Lobster', importUrl: 'https://fonts.googleapis.com/css2?family=Lobster&display=swap', family: "'Lobster', cursive" },
  { name: 'Pacifico', importUrl: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap', family: "'Pacifico', cursive" },
  { name: 'Satisfy', importUrl: 'https://fonts.googleapis.com/css2?family=Satisfy&display=swap', family: "'Satisfy', cursive" },
  { name: 'Permanent Marker', importUrl: 'https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap', family: "'Permanent Marker', cursive" },
  { name: 'Abril Fatface', importUrl: 'https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap', family: "'Abril Fatface', cursive" },
  { name: 'Righteous', importUrl: 'https://fonts.googleapis.com/css2?family=Righteous&display=swap', family: "'Righteous', cursive" },
  { name: 'Alfa Slab One', importUrl: 'https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap', family: "'Alfa Slab One', cursive" },
  { name: 'Roboto Mono', importUrl: 'https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;500;700&display=swap', family: "'Roboto Mono', monospace" },
  { name: 'Source Code Pro', importUrl: 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;700&display=swap', family: "'Source Code Pro', monospace" },
  { name: 'Inconsolata', importUrl: 'https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;700&display=swap', family: "'Inconsolata', monospace" },
  { name: 'Space Mono', importUrl: 'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap', family: "'Space Mono', monospace" },
];

const fontSizeOptions: { value: TailwindFontSize; label: string }[] = [
  { value: 'text-xs', label: 'X-Small (xs)' },
  { value: 'text-sm', label: 'Small (sm)' },
  { value: 'text-base', label: 'Base (base)' },
  { value: 'text-lg', label: 'Large (lg)' },
  { value: 'text-xl', label: 'X-Large (xl)' },
  { value: 'text-2xl', label: '2X-Large (2xl)' },
  { value: 'text-3xl', label: '3X-Large (3xl)' },
  { value: 'text-4xl', label: '4X-Large (4xl)' },
  { value: 'text-5xl', label: '5X-Large (5xl)' },
  { value: 'text-6xl', label: '6X-Large (6xl)' },
];
const DEFAULT_FONT_SIZE_VALUE = "__DEFAULT_FONT_SIZE__";


const textAlignOptions: { value: TextAlignment; label: string; icon: React.ElementType }[] = [
  { value: 'text-left', label: 'Left', icon: AlignLeft },
  { value: 'text-center', label: 'Center', icon: AlignCenter },
  { value: 'text-right', label: 'Right', icon: AlignRight },
];

const DEFAULT_CURSOR_VALUE = "__DEFAULT_CURSOR__";
const cursorOptions: { value: string; label: string }[] = [
  { value: DEFAULT_CURSOR_VALUE, label: 'Default (Auto)' },
  { value: 'cursor-auto', label: 'Auto' },
  { value: 'cursor-default', label: 'Default Arrow' },
  { value: 'cursor-pointer', label: 'Pointer (Hand)' },
  { value: 'cursor-wait', label: 'Wait (Hourglass)' },
  { value: 'cursor-text', label: 'Text (I-beam)' },
  { value: 'cursor-move', label: 'Move (All directions)' },
  { value: 'cursor-not-allowed', label: 'Not Allowed' },
  { value: 'cursor-grab', label: 'Grab (Open Hand)' },
  { value: 'cursor-grabbing', label: 'Grabbing (Closed Hand)' },
  { value: 'cursor-help', label: 'Help (Question Mark)' },
  { value: 'cursor-zoom-in', label: 'Zoom In' },
  { value: 'cursor-zoom-out', label: 'Zoom Out' },
  { value: 'cursor-none', label: 'None (Hidden)' },
  { value: 'cursor-crosshair', label: 'Crosshair' },
  { value: 'cursor-progress', label: 'Progress (Busy)' },
];


const webElements: WebElementDefinition[] = [
  { name: 'Header', type: 'HeaderElement', previewComponent: <HeaderElement {...defaultHeaderData} />, initialData: defaultHeaderData, category: 'Layout', icon: PanelTop },
  { name: 'Section', type: 'Section', previewComponent: <div className="h-20 w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground text-sm p-2">Section: Add columns and elements inside.</div>, initialData: { className: 'py-12', backgroundColor: undefined }, category: 'Layout', icon: LayoutPanelLeft },
  { name: 'Heading', type: 'Heading', previewComponent: <h1 className="text-2xl font-bold p-2">Heading Text</h1>, initialData: { text: 'Default Heading', htmlTag: 'h1', textAlign: 'text-left' }, category: 'Content', icon: Heading1 },
  { name: 'Text Block', type: 'TextBlock', previewComponent: <p className="p-2">This is a paragraph of text. Edit me!</p>, initialData: { text: 'Default text block content.', htmlTag: 'p', textAlign: 'text-left' }, category: 'Content', icon: Baseline },
  { name: 'Image', type: 'Image', previewComponent: <NextImage src="https://placehold.co/300x200.png" alt="Placeholder" width={150} height={100} data-ai-hint="placeholder image" className="m-2"/>, initialData: { src: 'https://placehold.co/600x400.png', alt: 'Placeholder Image', width: 600, height: 400, 'data-ai-hint': 'placeholder image' }, category: 'Content', icon: ImageIcon },
  { name: 'Button', type: 'Button', previewComponent: <div className="p-2"><Button>Click Me</Button></div>, initialData: { text: 'Button Text', variant: 'default' }, category: 'Interactive Elements', icon: MousePointer },
  { name: 'Magic Command Palette', type: 'MagicCommandPalette', previewComponent: <McpDemo />, initialData: { commands: defaultMcpCommands }, category: 'Magic UI Components', icon: Palette },
  { name: 'Alert', type: 'Alert', previewComponent: <AlertDemo />, initialData: {}, category: 'Shadcn UI Components', icon: Info },
  { name: 'Card', type: 'Card', previewComponent: <CardDemo />, initialData: {}, category: 'Shadcn UI Components', icon: FileText },
  { name: 'Dialog', type: 'Dialog', previewComponent: <DialogDemo />, initialData: {}, category: 'Shadcn UI Components', icon: Undo2 },
  { name: 'Tabs', type: 'Tabs', previewComponent: <TabsDemo />, initialData: {}, category: 'Shadcn UI Components', icon: ListTodo },
  { name: 'Tooltip', type: 'Tooltip', previewComponent: <TooltipDemo />, initialData: {}, category: 'Shadcn UI Components', icon: ClipboardCopy },
  { name: 'Marquee Testimonials', type: 'MarqueeTestimonials', previewComponent: <MarqueeDemo reviews={defaultMarqueeReviews.slice(0,2)} />, initialData: { reviews: defaultMarqueeReviews.map((r: MarqueeReviewType) => ({ ...r, id: uuidv4() })) }, category: 'Magic UI Components', icon: MessageSquareText },
  { name: 'Terminal Animation', type: 'TerminalAnimation', previewComponent: <TerminalDemo lines={defaultTerminalLines.slice(0,3)} />, initialData: { lines: defaultTerminalLines.map((l: ITerminalLine) => ({ ...l, id: uuidv4() })) }, category: 'Magic UI Components', icon: TerminalSquare },
  { name: 'Hero Video', type: 'HeroVideoDialog', previewComponent: <HeroVideoDialogDemo />, initialData: { videoSrc: "https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb", thumbnailSrcLight: "https://startup-template-sage.vercel.app/hero-light.png", thumbnailSrcDark: "https://startup-template-sage.vercel.app/hero-dark.png", thumbnailAlt: "Hero Video", animationStyle: 'from-center' } as HeroVideoData, category: 'Magic UI Components', icon: Youtube },
  { name: 'Bento Grid', type: 'BentoGrid', previewComponent: <div className="p-2 overflow-hidden"><BentoDemo features={defaultBentoFeatures.slice(0,1)} /></div>, initialData: { features: defaultBentoFeatures.map(f => ({ ...f, id: uuidv4() })) }, category: 'Magic UI Components', icon: LayoutGridIcon },
  { name: 'Animated List', type: 'AnimatedList', previewComponent: <div className="p-2 h-40 overflow-hidden"><AnimatedListDemo notifications={defaultAnimatedListItems.slice(0,2)} /></div>, initialData: { items: defaultAnimatedListItems.map(n => ({ ...n, id: uuidv4() })) }, category: 'Magic UI Components', icon: ListChecks },
  { name: 'Pricing Table', type: 'PricingTable', previewComponent: <div className="h-20 w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground text-sm p-2">Pricing Table Placeholder</div>, initialData: { plans: [] }, category: 'Content', icon: CreditCard },
  { name: 'FAQ Accordion', type: 'FaqAccordion', previewComponent: <div className="p-2 w-full"><Accordion type="single" collapsible className="w-full"><AccordionItem value="item-1"><AccordionTrigger>Question 1?</AccordionTrigger><AccordionContent>Answer 1.</AccordionContent></AccordionItem></Accordion></div>, initialData: { items: [{question: "FAQ 1", answer: "Answer 1"}] }, category: 'Content', icon: HelpCircle },
  { name: 'Team Section', type: 'TeamSection', previewComponent: <div className="h-20 w-full bg-muted/50 rounded-md flex items-center justify-center text-muted-foreground text-sm p-2 gap-2"><Avatar><AvatarFallback>TM</AvatarFallback></Avatar><Avatar><AvatarFallback>JD</AvatarFallback></Avatar></div>, initialData: { members: [] }, category: 'Content', icon: Users },
  { name: 'Contact Form', type: 'ContactForm', previewComponent: <div className="p-2 space-y-2 w-full"><Label htmlFor="email-prev">Email</Label><Input id="email-prev" type="email" placeholder="Email" /><Button size="sm">Submit</Button></div>, initialData: { fields: [] }, category: 'Interactive Elements', icon: Mail },
  { name: 'Call to Action Section', type: 'CtaSection', previewComponent: <div className="p-4 bg-primary/10 rounded-md text-center space-y-2"><h3 className="font-semibold">Call to Action!</h3><Button>Get Started</Button></div>, initialData: { title: "Ready to start?", buttonText: "Sign Up" }, category: 'Layout', icon: Megaphone },
  { name: 'Testimonial Card', type: 'TestimonialCard', icon: MessageSquareQuote, category: 'Content', previewComponent: <Card className="w-full max-w-xs m-2"><CardHeader><Avatar className="mb-2"><AvatarImage src="https://avatar.vercel.sh/placeholder" alt="User" /><AvatarFallback>U</AvatarFallback></Avatar><CardTitle className="text-sm">John Doe</CardTitle><CardDescription className="text-xs">CEO, Example Inc.</CardDescription></CardHeader><CardContent><p className="text-sm italic">"This is a great product!"</p></CardContent></Card>, initialData: { quote: "This product changed my life!", authorName: "Jane Doe", authorRole: "Designer", avatarUrl: "https://avatar.vercel.sh/jane?size=64", cardBackgroundColor: undefined, textColor: undefined } as TestimonialCardData },
  { name: 'Feature Item', type: 'FeatureItem', icon: Lightbulb, category: 'Content', previewComponent: <div className="p-4 m-2 border rounded-lg text-center w-48"><Star className="mx-auto h-8 w-8 text-primary mb-2" /><h3 className="font-semibold text-sm">Feature Title</h3><p className="text-xs text-muted-foreground">Brief description of the feature.</p></div>, initialData: { iconName: 'Award', title: 'Amazing Feature', description: 'Explain why this feature is so amazing and beneficial to the user.', alignment: 'center' } as FeatureItemData },
  { name: 'Logo Cloud', type: 'LogoCloud', icon: Building, category: 'Content', previewComponent: <div className="p-4 m-2 border rounded-lg w-full max-w-md"><p className="text-center text-sm text-muted-foreground mb-2">Our Partners</p><div className="flex justify-around items-center"><LucideIcons.Figma className="h-8 w-8 text-muted-foreground/70" /><LucideIcons.Framer className="h-8 w-8 text-muted-foreground/70" /><LucideIcons.Sketch className="h-8 w-8 text-muted-foreground/70" /></div></div>, initialData: { title: 'Trusted By', logos: [{id: uuidv4(), src: "https://placehold.co/100x40/svg?text=Logo1&font=roboto", alt: "Client Logo 1"}, {id: uuidv4(), src: "https://placehold.co/120x30/svg?text=Logo2&font=open-sans", alt: "Client Logo 2"}], columns: 4 } as LogoCloudData },
  { name: 'Footer', type: 'Footer', icon: PanelBottom, category: 'Layout', previewComponent: <footer className="p-4 bg-muted/50 text-center text-xs w-full m-2 rounded"><p>&copy; 2024 Your Company</p></footer>, initialData: { copyrightText: `© ${new Date().getFullYear()} Your Company. All rights reserved.`, columns: [{id: uuidv4(), title: 'Links', links: [{id: uuidv4(), text: 'Privacy', href: '#'}, {id: uuidv4(), text: 'Terms', href: '#'}]}], backgroundColor: 'bg-muted', textColor: 'text-muted-foreground', socialLinks: [] } as FooterData },
];

interface StoredProjectMetadata {
  id: string;
  title: string;
  lastModified: string;
}

const htmlTagOptions: { value: HtmlTag; label: string }[] = [
  { value: 'p', label: 'Paragraph (p)' },
  { value: 'h1', label: 'Heading 1 (h1)' },
  { value: 'h2', label: 'Heading 2 (h2)' },
  { value: 'h3', label: 'Heading 3 (h3)' },
  { value: 'h4', label: 'Heading 4 (h4)' },
  { value: 'h5', label: 'Heading 5 (h5)' },
  { value: 'h6', label: 'Heading 6 (h6)' },
];


export default function LandingPageGenerator() {
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [activeView, setActiveView] = useState<'dashboard' | 'editor' | 'settings' | 'ai-generator'>('editor');

  const [hasMounted, setHasMounted] = useState(false);
  const [allProjects, setAllProjects] = useState<StoredProjectMetadata[]>([]);



  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState('Untitled Page');
  const [canvasRows, setCanvasRows] = useState<CanvasRow[]>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<{ name: string; previewComponent: React.ReactNode } | null>(null);
  const [previousCanvasRows, setPreviousCanvasRows] = useState<CanvasRow[] | null>(null);

  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'success' | 'error_local_save' | 'error_clipboard'>('idle');
  const [publishedPageUrl, setPublishedPageUrl] = useState<string | null>(null);
  const [paletteSearchTerm, setPaletteSearchTerm] = useState('');


  const [activeCanvasTool, setActiveCanvasTool] = useState<'select' | 'pan'>('select');
  const [isCanvasPanning, setIsCanvasPanning] = useState(false);
  const [panStartCoords, setPanStartCoords] = useState<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [canvasZoom, setCanvasZoom] = useState(1.0);
  const [activeBreakpoint, setActiveBreakpoint] = useState<BreakpointType>(PREDEFINED_BREAKPOINTS[0]);
  const [isGridVisible, setIsGridVisible] = useState(false);


  const [isEditMarqueeModalOpen, setIsEditMarqueeModalOpen] = useState(false);
  const [editingMarqueeElementId, setEditingMarqueeElementId] = useState<string | null>(null);
  const [isEditHeroVideoModalOpen, setIsEditHeroVideoModalOpen] = useState(false);
  const [editingHeroVideoElementId, setEditingHeroVideoElementId] = useState<string | null>(null);
  const [isEditTerminalModalOpen, setIsEditTerminalModalOpen] = useState(false);
  const [editingTerminalElementId, setEditingTerminalElementId] = useState<string | null>(null);
  const [isEditHeaderModalOpen, setIsEditHeaderModalOpen] = useState(false);
  const [editingHeaderElementId, setEditingHeaderElementId] = useState<string | null>(null);


  const [aiPageDescription, setAiPageDescription] = useState('');
  const [aiPrimaryColor, setAiPrimaryColor] = useState('#1A202C');
  const [aiSecondaryColor, setAiSecondaryColor] = useState('#EDF2F7');
  const [aiAccentColor, setAiAccentColor] = useState('#4DC0B5');
  const [aiFontFamilyName, setAiFontFamilyName] = useState(googleFonts[0].name);
  const [aiFontFamilyImportUrl, setAiFontFamilyImportUrl] = useState(googleFonts[0].importUrl);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);



  const [siteTitleSettings, setSiteTitleSettings] = useState('My NativeUI Site');
  const [siteDescriptionSettings, setSiteDescriptionSettings] = useState('Made with NativeUI Builder');
  const [siteLanguageSettings, setSiteLanguageSettings] = useState('');
  const [disableAccessibilityAnimations, setDisableAccessibilityAnimations] = useState(false);
  const [optOutHtmlPaste, setOptOutHtmlPaste] = useState(false);
  const [activeSettingsSection, setActiveSettingsSection] = useState<string>('general');


  const [propPositionX, setPropPositionX] = useState(0);
  const [propPositionY, setPropPositionY] = useState(0);
  const [propWidth, setPropWidth] = useState(activeBreakpoint.width);
  const [propHeight, setPropHeight] = useState(800);
  const [propFixedW, setPropFixedW] = useState("Auto");
  const [propFixedH, setPropFixedH] = useState("Auto");
  const [propBaseFontSize, setPropBaseFontSize] = useState(16);
  const [propPageFontFamilyName, setPropPageFontFamilyName] = useState(googleFonts[0].name);
  const [propPageFontFamilyImportUrl, setPropPageFontFamilyImportUrl] = useState(googleFonts[0].importUrl);
  const [propPageFillColor, setPropPageFillColor] = useState<string | undefined>(undefined);
  const [propPageCursor, setPropPageCursor] = useState<string | undefined>(undefined);
  const [propOverflow, setPropOverflow] = useState("Visible");
  const [propBodyBackgroundColor, setPropBodyBackgroundColor] = useState<string | undefined>(undefined);
  const originalBodyBackgroundColorRef = useRef<string | null>(null);

  const [draggingElementInfo, setDraggingElementInfo] = useState<{ rowId: string; elementId: string; elementIndex: number } | null>(null);
  const [dragOverElementInfo, setDragOverElementInfo] = useState<{ rowId: string; elementId: string; elementIndex: number } | null>(null);

  const selectedElement = React.useMemo(() => {
    if (!selectedElementId || !selectedRowId) return null;
    const row = canvasRows.find(r => r.id === selectedRowId);
    return row?.elements.find(el => el.id === selectedElementId) || null;
  }, [selectedElementId, selectedRowId, canvasRows]);


  useEffect(() => {
    setPropWidth(activeBreakpoint.width);
  }, [activeBreakpoint]);


  const loadAllProjectsMetadata = useCallback(() => {
    const storage = localStorage;
    const projects: StoredProjectMetadata[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith('project-')) {
        const storedData = storage.getItem(key);
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData) as ProjectData;
            projects.push({
              id: key.replace('project-', ''),
              title: parsedData.pageTitle || 'Untitled Project',
              lastModified: parsedData.lastModified || new Date(0).toISOString(),
            });
          } catch (e) {
            console.error(`Error parsing project data for key ${key}:`, e);
          }
        }
      }
    }
    projects.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    setAllProjects(projects);
    return projects;
  }, []);

  useEffect(() => {
    setHasMounted(true);
    const projects = loadAllProjectsMetadata();
    const lastProjectId = localStorage.getItem('landingPageBuilder-lastProjectId');
    originalBodyBackgroundColorRef.current = typeof document !== 'undefined' ? document.body.style.backgroundColor : '';


    if (projects.length > 0) {
      setActiveView('dashboard');
    } else {
      setActiveView('editor');
      resetEditorState();
    }
    return () => {
      if (originalBodyBackgroundColorRef.current !== null && typeof document !== 'undefined') {
        document.body.style.backgroundColor = originalBodyBackgroundColorRef.current;
      }
      const dynamicStyleTag = document.getElementById('dynamic-body-background-style');
      if (dynamicStyleTag) {
        dynamicStyleTag.remove();
      }
    };
  }, [loadAllProjectsMetadata]);


  useEffect(() => {
    if (currentProjectId) {
        localStorage.setItem('landingPageBuilder-lastProjectId', currentProjectId);
    } else if (activeView === 'editor') {
        localStorage.removeItem('landingPageBuilder-lastProjectId');
    }
  }, [currentProjectId, activeView]);


  const resetEditorState = (newTitle: string = 'Untitled Page') => {
    setPageTitle(newTitle);
    setCanvasRows([]);
    setCurrentProjectId(null);
    setPreviousCanvasRows(null);
    setPublishStatus('idle');
    setPublishedPageUrl(null);
    setPropPageFontFamilyName(googleFonts[0].name);
    setPropPageFontFamilyImportUrl(googleFonts[0].importUrl);
    setPropPageFillColor(undefined);
    setPropPageCursor(undefined);
    setPropBodyBackgroundColor(undefined);
    setSelectedRowId(null);
    setSelectedElementId(null);
    if (typeof document !== 'undefined' && originalBodyBackgroundColorRef.current !== null) {
      document.body.style.backgroundColor = originalBodyBackgroundColorRef.current;
      const dynamicStyleTag = document.getElementById('dynamic-body-background-style');
      if (dynamicStyleTag) {
        dynamicStyleTag.remove();
      }
    }
    setActiveView('editor');
    toast({ title: "New Page Ready", description: "The editor has been reset for a new landing page." });
  };

  const handleNewPage = () => {
    resetEditorState(`My New Page ${allProjects.length + 1}`);
  };


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
    const newRow: CanvasRow = { id: uuidv4(), layout: 'grid-cols-1', elements: [], backgroundColor: undefined };
    setCanvasRows(prev => [...prev, newRow]);
    setSelectedRowId(newRow.id);
    setSelectedElementId(null);
    toast({ title: "Row Added", description: "A new row has been added to the canvas." });
  };

  const handleElementClickInPalette = (el: WebElementDefinition) => {
    setCurrentPreview({ name: el.name, previewComponent: el.previewComponent });
    setIsPreviewModalOpen(true);
  };

  const handleElementDragStart = (event: React.DragEvent<HTMLDivElement>, rowId: string, elementId: string, elementIndex: number) => {
    setDraggingElementInfo({ rowId, elementId, elementIndex });
    event.dataTransfer.setData('application/json', JSON.stringify({ type: 'REORDER_ELEMENT', elementId, rowId, elementIndex }));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  const handleElementDragEnd = () => {
    setDraggingElementInfo(null);
    setDragOverElementInfo(null);
  };
  
  const handleElementDragOver = (event: React.DragEvent<HTMLDivElement>, rowId: string, elementId: string, elementIndex: number) => {
    event.preventDefault();
    event.stopPropagation(); 
    if (draggingElementInfo && draggingElementInfo.rowId === rowId) {
        event.dataTransfer.dropEffect = 'move';
        if (draggingElementInfo.elementId !== elementId) { 
            setDragOverElementInfo({ rowId, elementId, elementIndex });
        } else {
            setDragOverElementInfo(null);
        }
    } else {
        event.dataTransfer.dropEffect = 'none';
        setDragOverElementInfo(null);
    }
  };
  
  const handleElementDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget as Node;
    if (!(event.currentTarget as Node).contains(relatedTarget)) {
        setDragOverElementInfo(null);
    }
  };
  
  const handleElementDropOnElement = (event: React.DragEvent<HTMLDivElement>, targetRowId: string, targetElementId: string, targetElementIndex: number) => {
    event.preventDefault();
    event.stopPropagation(); 
    if (!draggingElementInfo) {
      setDragOverElementInfo(null);
      return;
    }
  
    const { rowId: sourceRowId, elementId: sourceElementId, elementIndex: sourceElementIndex } = draggingElementInfo;
  
    if (sourceRowId !== targetRowId) {
      toast({ title: "Move Canceled", description: "Elements can only be reordered within the same row.", variant: "default" });
      setDraggingElementInfo(null);
      setDragOverElementInfo(null);
      return;
    }
  
    if (sourceElementId === targetElementId) { 
      setDraggingElementInfo(null);
      setDragOverElementInfo(null);
      return;
    }
  
    storePreviousState();
  
    setCanvasRows((prevRows) =>
      prevRows.map((row) => {
        if (row.id === sourceRowId) {
          const newElements = [...row.elements];
          const [draggedItem] = newElements.splice(sourceElementIndex, 1);
          
          newElements.splice(targetElementIndex, 0, draggedItem);
          
          return { ...row, elements: newElements };
        }
        return row;
      })
    );
  
    toast({ title: "Element Reordered", description: "Element order updated within the row." });
    setDraggingElementInfo(null);
    setDragOverElementInfo(null);
  };

  const handleDropOnCanvas = (event: React.DragEvent<HTMLDivElement>, targetRowId?: string) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const dataString = event.dataTransfer.getData("application/json");
      if (!dataString) return;
      const parsedData = JSON.parse(dataString);

      if (parsedData.type === 'ADD_ELEMENT') {
        const { elementName } = parsedData;
        const elementDefinition = webElements.find(el => el.name === elementName);

        if (elementDefinition) {
          storePreviousState();
          const newElement: CanvasElement = {
            id: uuidv4(),
            name: elementDefinition.name,
            type: elementDefinition.type,
            data: deepCopy(elementDefinition.initialData),
          };
          
          if (newElement.type === 'Heading' || newElement.type === 'TextBlock') {
             newElement.data.textAlign = 'text-left';
          }


          setCanvasRows(prevRows => {
            if (targetRowId) {
              const newRows = prevRows.map(row => {
                if (row.id === targetRowId) {
                  return { ...row, elements: [...row.elements, newElement] };
                }
                return row;
              });
              toast({ title: "Element Added", description: `${elementDefinition.name} added to row.` });
              return newRows;
            } else {
              const newRowWithElement: CanvasRow = { id: uuidv4(), layout: 'grid-cols-1', elements: [newElement], backgroundColor: undefined };
              setSelectedRowId(newRowWithElement.id);
              setSelectedElementId(null);
              toast({ title: "Element Added", description: `${elementDefinition.name} added to a new row.` });
              return [...prevRows, newRowWithElement];
            }
          });
        }
      } else if (parsedData.type === 'REORDER_ELEMENT' && targetRowId && draggingElementInfo) {
         const { rowId: sourceRowId, elementIndex: sourceElementIndex } = draggingElementInfo;
         if (sourceRowId === targetRowId) {
            storePreviousState();
            setCanvasRows(prevRows => prevRows.map(r => {
                if (r.id === sourceRowId) {
                    const newElements = [...r.elements];
                    const [draggedItem] = newElements.splice(sourceElementIndex, 1);
                    newElements.push(draggedItem); 
                    return {...r, elements: newElements};
                }
                return r;
            }));
            toast({ title: "Element Moved", description: "Element moved to the end of the row." });
         }
      }
    } catch (error) {
      console.error("Error processing drop data:", error);
      toast({ title: "Drop Error", description: "Could not add or move element.", variant: "destructive" });
    }
    setDraggingElementInfo(null);
    setDragOverElementInfo(null);
  };

  const handleRowClick = (rowId: string, event: React.MouseEvent) => {
    if ((event.target as HTMLElement).closest('.element-controls, .canvas-element-content, [draggable="true"]')) {
      return;
    }
    setSelectedRowId(rowId);
    setSelectedElementId(null); // Deselect element when row is clicked
  };

  const handleElementDivClick = (rowId: string, elementId: string, event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation(); // Prevent row click from firing
    setSelectedRowId(rowId);
    setSelectedElementId(elementId);
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
    if (selectedElementId === elementId) {
      setSelectedElementId(null); // Deselect if the deleted element was selected
    }
    toast({ title: "Element Deleted", description: "The element has been removed." });
  };

  const handleEditElement = (rowId: string, elementId: string) => {
    const element = canvasRows.find(r => r.id === rowId)?.elements.find(e => e.id === elementId);
    if (!element) return;

    storePreviousState();
    setSelectedRowId(rowId); // Ensure row is also "selected" for context
    setSelectedElementId(elementId); // Set the element to be edited

    if (element.type === 'MarqueeTestimonials') {
      setEditingMarqueeElementId(elementId);
      setIsEditMarqueeModalOpen(true);
    } else if (element.type === 'HeroVideoDialog') {
      setEditingHeroVideoElementId(elementId);
      setIsEditHeroVideoModalOpen(true);
    } else if (element.type === 'TerminalAnimation') {
      setEditingTerminalElementId(elementId);
      setIsEditTerminalModalOpen(true);
    } else if (element.type === 'HeaderElement') {
      setEditingHeaderElementId(elementId);
      setIsEditHeaderModalOpen(true);
    }
     else {
       if (!['Heading', 'TextBlock', 'Section', 'TestimonialCard', 'FeatureItem', 'LogoCloud', 'Footer', 'Image', 'Button'].includes(element.type)) {
         toast({ title: "Edit Element", description: `Editing for ${element.name} via modal coming soon! Basic props in panel.` });
       }
    }
  };

  const handleUpdateSelectedElementData = (dataKey: keyof CanvasElement['data'], value: any) => {
    if (!selectedElementId || !selectedRowId) return;
    storePreviousState();
    setCanvasRows(prevRows =>
      prevRows.map(row =>
        row.id === selectedRowId
          ? {
              ...row,
              elements: row.elements.map(el =>
                el.id === selectedElementId
                  ? { ...el, data: { ...el.data, [dataKey]: value } }
                  : el
              ),
            }
          : row
      )
    );
  };


  const handleUpdateMarqueeData = (elementId: string, updatedData: {reviews: MarqueeReviewType[]}) => {
    setCanvasRows(prevRows => prevRows.map(row => ({
      ...row,
      elements: row.elements.map(el =>
        el.id === elementId && el.type === 'MarqueeTestimonials'
          ? { ...el, data: { ...el.data, ...updatedData } }
          : el
      )
    })));
  };

  const handleUpdateHeroVideoData = (elementId: string, updatedData: HeroVideoData) => {
    setCanvasRows(prevRows => prevRows.map(row => ({
      ...row,
      elements: row.elements.map(el =>
        el.id === elementId && el.type === 'HeroVideoDialog'
          ? { ...el, data: { ...el.data, ...updatedData } }
          : el
      )
    })));
  };

  const handleUpdateTerminalData = (elementId: string, updatedData: {lines: ITerminalLine[]}) => {
     setCanvasRows(prevRows => prevRows.map(row => ({
      ...row,
      elements: row.elements.map(el =>
        el.id === elementId && el.type === 'TerminalAnimation'
          ? { ...el, data: { ...el.data, ...updatedData } }
          : el
      )
    })));
  };

  const handleUpdateHeaderData = (elementId: string, updatedData: HeaderElementData) => {
     setCanvasRows(prevRows => prevRows.map(row => ({
      ...row,
      elements: row.elements.map(el =>
        el.id === elementId && el.type === 'HeaderElement'
          ? { ...el, data: { ...el.data, ...updatedData } }
          : el
      )
    })));
  };


  const renderCanvasElement = (element: CanvasElement, rowId: string) => {
    const content = () => {
      const tag = element.data.htmlTag || (element.type === 'Heading' ? 'h1' : 'p');
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
      
      const textContent = element.data.text || (element.type === 'Heading' ? "Default Heading" : "Default text block content.");
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
                 "p-4 my-2 min-h-[50px] w-full border border-dashed rounded-md",
                 element.data.className,
                 !element.data.backgroundColor ? "border-neutral-300 bg-neutral-50 dark:bg-neutral-800/30" : "border-transparent"
               )}
             >
               <div className={cn("flex items-center justify-center", !element.data.backgroundColor && "text-neutral-400")}>
                 Section: Add elements inside. (Content goes here)
               </div>
             </div>
           );
        case 'Heading':
        case 'TextBlock':
          return React.createElement(tag, { className: cn("whitespace-pre-wrap", textClasses) }, textContent);
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
        case 'MagicCommandPalette':
          return <McpDemo commands={(element.data as any).commands || defaultMcpCommands} />;
        case 'Alert':
          return <AlertDemo />;
        case 'Card':
          return <CardDemo />;
        case 'Dialog':
          return <DialogDemo />;
        case 'Tabs':
          return <TabsDemo />;
        case 'Tooltip':
          return <TooltipDemo />;
        case 'PricingTable':
          return <div className="p-4 my-2 min-h-[100px] w-full border border-dashed border-neutral-300 rounded-md bg-neutral-50 dark:bg-neutral-800/30 text-neutral-400 flex items-center justify-center">Pricing Table Element</div>;
        case 'FaqAccordion':
          return <div className="p-4 my-2 min-h-[80px] w-full border border-dashed border-neutral-300 rounded-md bg-neutral-50 dark:bg-neutral-800/30 text-neutral-400 flex items-center justify-center">FAQ Accordion Element</div>;
        case 'TeamSection':
          return <div className="p-4 my-2 min-h-[100px] w-full border border-dashed border-neutral-300 rounded-md bg-neutral-50 dark:bg-neutral-800/30 text-neutral-400 flex items-center justify-center">Team Section Element</div>;
        case 'ContactForm':
          return <div className="p-4 my-2 min-h-[120px] w-full border border-dashed border-neutral-300 rounded-md bg-neutral-50 dark:bg-neutral-800/30 text-neutral-400 flex items-center justify-center">Contact Form Element</div>;
        case 'CtaSection':
          return <div className="p-4 my-2 min-h-[100px] w-full border border-dashed border-neutral-300 rounded-md bg-primary/10 text-neutral-400 flex flex-col items-center justify-center"><h3 className="font-semibold">Call to Action!</h3><p>Placeholder text for CTA.</p><Button variant="default" className="mt-2">Sign Up Now</Button></div>;
        case 'TestimonialCard':
          const testimonialData = element.data as TestimonialCardData;
          return (
            <Card className="w-full my-2" style={{ backgroundColor: testimonialData.cardBackgroundColor, color: testimonialData.textColor }}>
              <CardHeader className="flex flex-row items-center gap-3">
                {testimonialData.avatarUrl && <Avatar><NextImage src={testimonialData.avatarUrl} alt={testimonialData.authorName || 'author'} width={40} height={40} className="rounded-full" data-ai-hint="user avatar" /><AvatarFallback>{testimonialData.authorName?.[0]}</AvatarFallback></Avatar>}
                <div>
                  <CardTitle className="text-base">{testimonialData.authorName}</CardTitle>
                  {testimonialData.authorRole && <CardDescription className="text-xs" style={{ color: testimonialData.textColor ? 'inherit' : undefined, opacity: 0.8 }}>{testimonialData.authorRole}</CardDescription>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="italic">"{testimonialData.quote}"</p>
              </CardContent>
            </Card>
          );
        case 'FeatureItem':
          const featureData = element.data as FeatureItemData;
          const IconComponent = (LucideIcons as any)[featureData.iconName] || Lightbulb;
          const alignmentClass = {
            left: 'text-left items-start',
            center: 'text-center items-center',
            right: 'text-right items-end',
          }[featureData.alignment || 'center'];
          return (
            <div className={cn("flex flex-col gap-2 p-4 my-2", alignmentClass)}>
              <IconComponent className="h-10 w-10 text-primary mb-2" />
              <h3 className="text-lg font-semibold">{featureData.title}</h3>
              <p className="text-muted-foreground text-sm">{featureData.description}</p>
            </div>
          );
        case 'LogoCloud':
          const logoCloudData = element.data as LogoCloudData;
          const gridColsClass = `grid-cols-${logoCloudData.columns || 4}`;
          return (
            <div className="my-4 py-8">
              {logoCloudData.title && <h3 className="text-xl font-semibold text-center mb-6">{logoCloudData.title}</h3>}
              <div className={cn("grid gap-8 items-center", gridColsClass)}>
                {(logoCloudData.logos || []).map(logo => (
                  logo.href ? (
                    <a key={logo.id} href={logo.href} target="_blank" rel="noopener noreferrer" className="flex justify-center grayscale opacity-75 hover:grayscale-0 hover:opacity-100 transition-all">
                      <NextImage src={logo.src} alt={logo.alt} width={120} height={40} className="object-contain" data-ai-hint="company logo" />
                    </a>
                  ) : (
                    <div key={logo.id} className="flex justify-center grayscale opacity-75">
                      <NextImage src={logo.src} alt={logo.alt} width={120} height={40} className="object-contain" data-ai-hint="company logo" />
                    </div>
                  )
                ))}
              </div>
            </div>
          );
        case 'Footer':
          const footerData = element.data as FooterData;
          return (
            <footer className={cn("py-8 px-4 md:px-8 mt-10", footerData.backgroundColor || 'bg-muted', footerData.textColor || 'text-muted-foreground')}>
              <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  {(footerData.columns || []).map(col => (
                    <div key={col.id}>
                      {col.title && <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider" style={{color: footerData.textColor ? 'inherit' : undefined}}>{col.title}</h4>}
                      <ul className="space-y-2">
                        {(col.links || []).map(link => (
                          <li key={link.id}><a href={link.href} className="text-sm hover:underline" style={{color: footerData.textColor ? 'inherit' : undefined, opacity: 0.8}}>{link.text}</a></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center text-xs" style={{borderColor: footerData.textColor ? 'currentColor' : undefined, opacity: 0.7}}>
                  <p>{footerData.copyrightText || `© ${new Date().getFullYear()} Your Company`}</p>
                  {(footerData.socialLinks && footerData.socialLinks.length > 0) && (
                    <div className="flex space-x-4 mt-4 md:mt-0">
                      {footerData.socialLinks.map(social => {
                         let SocialIcon;
                         switch(social.platform.toLowerCase()) {
                           case 'twitter': SocialIcon = LucideIcons.Twitter; break;
                           case 'facebook': SocialIcon = LucideIcons.Facebook; break;
                           case 'linkedin': SocialIcon = LucideIcons.Linkedin; break;
                           case 'instagram': SocialIcon = LucideIcons.Instagram; break;
                           default: SocialIcon = LucideIcons.Link;
                         }
                         return <a key={social.platform} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.platform} className="hover:opacity-75"><SocialIcon className="h-5 w-5" style={{color: footerData.textColor ? 'inherit' : undefined}} /></a>
                      })}
                    </div>
                  )}
                </div>
              </div>
            </footer>
          );
        default:
          return <div className="my-2 p-2 bg-red-100 text-red-700 rounded-md">Unknown element type: {element.name} ({element.type})</div>;
      }
    };
    return <div className={cn("canvas-element-content w-full", element.data.cursor)}>{content()}</div>;
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (activeCanvasTool === 'pan' && scrollAreaRef.current && !target.closest('.element-controls, .canvas-element-content, button, input, select, textarea, [role="button"], [draggable="true"], [data-page-canvas="true"]')) {
      event.preventDefault();
      setIsCanvasPanning(true);
      setPanStartCoords({
        x: event.clientX,
        y: event.clientY,
        scrollLeft: scrollAreaRef.current.scrollLeft,
        scrollTop: scrollAreaRef.current.scrollTop,
      });
      document.body.style.cursor = 'grabbing';
    }
  };

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (!isCanvasPanning || !panStartCoords || !scrollAreaRef.current) return;
      const dx = event.clientX - panStartCoords.x;
      const dy = event.clientY - panStartCoords.y;
      scrollAreaRef.current.scrollLeft = panStartCoords.scrollLeft - dx;
      scrollAreaRef.current.scrollTop = panStartCoords.scrollTop - dy;
    };
    const handleGlobalMouseUp = () => {
      if (isCanvasPanning) {
        setIsCanvasPanning(false);
        document.body.style.cursor = activeCanvasTool === 'pan' ? 'grab' : 'default';
      }
    };

    if (isCanvasPanning) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    } else {
       document.body.style.cursor = activeCanvasTool === 'pan' ? 'grab' : 'default';
    }
    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'default'; // Reset on unmount
    };
  }, [isCanvasPanning, panStartCoords, activeCanvasTool, scrollAreaRef]);


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
    const versionData: ProjectData = {
      id: versionId,
      pageTitle,
      canvasRows: deepCopy(canvasRows),
      lastModified: timestamp,
      pageFillColor: propPageFillColor,
      fontFamilyName: propPageFontFamilyName,
      fontFamilyImportUrl: propPageFontFamilyImportUrl,
      bodyBackgroundColor: propBodyBackgroundColor,
      propPageCursor: propPageCursor,
    };
    try {
      const existingVersionsRaw = localStorage.getItem('landingPageVersions');
      const existingVersions = existingVersionsRaw ? JSON.parse(existingVersionsRaw) : [];
      localStorage.setItem('landingPageVersions', JSON.stringify([...existingVersions, versionData]));
      toast({ title: "Version Saved", description: `Version "${versionName || `Version - ${new Date(timestamp).toLocaleString()}`}" saved locally.` });
    } catch (e) {
      toast({ title: "Save Error", description: "Could not save version to local storage.", variant: "destructive" });
    }
  };

  const handleBreakpointChange = (bp: BreakpointType) => {
    setActiveBreakpoint(bp);
    toast({title: "Breakpoint Changed", description: `Canvas set to ${bp.name} (${bp.width}px)`});
  };

  const handleLivePreview = () => {
    const previewId = currentProjectId || uuidv4();
    const projectData: ProjectData = {
      id: previewId,
      pageTitle: pageTitle,
      canvasRows: canvasRows,
      lastModified: new Date().toISOString(),
      pageFillColor: propPageFillColor,
      fontFamilyName: propPageFontFamilyName,
      fontFamilyImportUrl: propPageFontFamilyImportUrl,
      bodyBackgroundColor: propBodyBackgroundColor,
      propPageCursor: propPageCursor,
    };
    try {
      localStorage.setItem(`project-${previewId}`, JSON.stringify(projectData));
      if (!currentProjectId) {
        setCurrentProjectId(previewId);
      }
      window.open(`/project/${previewId}`, '_blank');
      toast({title: "Live Preview Opened", description: "Previewing your page in a new tab."});
    } catch (error) {
      console.error('Error opening preview:', error);
      toast({
        title: 'Preview Error',
        description: 'Could not open preview.',
        variant: 'destructive',
      });
    }
  };

  const handlePublish = async () => {
    setPublishStatus('publishing');
    await new Promise(resolve => setTimeout(resolve, 1000));

    let projectIdToUse = currentProjectId;

    if (!projectIdToUse) {
      projectIdToUse = uuidv4();
      setCurrentProjectId(projectIdToUse);
    }

    const projectData: ProjectData = {
      id: projectIdToUse,
      pageTitle: pageTitle,
      canvasRows: canvasRows,
      lastModified: new Date().toISOString(),
      pageFillColor: propPageFillColor,
      fontFamilyName: propPageFontFamilyName,
      fontFamilyImportUrl: propPageFontFamilyImportUrl,
      bodyBackgroundColor: propBodyBackgroundColor,
      propPageCursor: propPageCursor,
    };

    try {
      localStorage.setItem(`project-${projectIdToUse}`, JSON.stringify(projectData));
      loadAllProjectsMetadata();
      const url = `${window.location.origin}/project/${projectIdToUse}`;
      setPublishedPageUrl(url);

      navigator.clipboard.writeText(url)
        .then(() => {
          toast({
            title: currentProjectId && currentProjectId === projectIdToUse ? "Page Updated!" : "Page Published!",
            description: (
              <div className="flex flex-col gap-1">
                <span>Your page is available at:</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80 break-all">{url}</a>
                <span>Link copied to clipboard.</span>
              </div>
            ),
            duration: 9000,
          });
        })
        .catch(copyError => {
          console.error("Failed to copy link to clipboard:", copyError);
          toast({
            title: currentProjectId && currentProjectId === projectIdToUse ? "Page Updated!" : "Page Published!",
            description: (
              <div className="flex flex-col gap-1">
                <span>Your page is available at:</span>
                <a href={url} target="_blank" rel="noopener noreferrer" className="underline text-primary hover:text-primary/80 break-all">{url}</a>
                <span>Could not copy link. Please copy it manually.</span>
              </div>
            ),
            variant: "default",
            duration: 9000,
          });
        });
      setPublishStatus('success');
    } catch (error) {
      console.error("Error publishing to localStorage:", error);
      setPublishStatus('error_local_save');
      toast({
        title: "Publish Error",
        description: "Could not save page data locally. Check console for details.",
        variant: "destructive",
      });
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
      { id: 'redirects', label: 'Redirects', icon: ArrowLeft },
      { id: 'forms', label: 'Forms', icon: FileText },
      { id: 'staging', label: 'Staging & Versions', icon: GitFork },
      { id: 'plans', label: 'Plans', icon: CreditCard },
    ]},
    { section: 'Page Settings', items: [
      { id: 'pageHome', label: 'Home', icon: Home },
    ]}
  ];

  const groupedWebElements = React.useMemo(() => {
    return webElements.reduce((acc, el) => {
      (acc[el.category] = acc[el.category] || []).push(el);
      return acc;
    }, {} as Record<string, WebElementDefinition[]>);
  }, []);


  const filteredGroupedElements = React.useMemo(() => {
    const baseGrouped = Object.entries(groupedWebElements).map(([category, elements]) => ({ category, elements }));
    if (paletteSearchTerm.trim() === '') {
      return baseGrouped.filter(group => Array.isArray(group.elements) && group.elements.length > 0);
    }
    return baseGrouped
      .map(({ category, elements }) => {
        const filtered = Array.isArray(elements) ? elements.filter(el => el.name.toLowerCase().includes(paletteSearchTerm.toLowerCase())) : [];
        return { category, elements: filtered };
      })
      .filter(group => Array.isArray(group.elements) && group.elements.length > 0);
  }, [paletteSearchTerm, groupedWebElements]);

   const editingMarqueeData = canvasRows.flatMap(r => r.elements).find(el => el.id === editingMarqueeElementId && el.type === 'MarqueeTestimonials')?.data as { reviews: MarqueeReviewType[] } | undefined;
   const editingHeroVideoData = canvasRows.flatMap(r => r.elements).find(el => el.id === editingHeroVideoElementId && el.type === 'HeroVideoDialog')?.data as HeroVideoData | undefined;
   const editingTerminalData = canvasRows.flatMap(r => r.elements).find(el => el.id === editingTerminalElementId && el.type === 'TerminalAnimation')?.data as { lines: ITerminalLine[] } | undefined;
   const editingHeaderData = canvasRows.flatMap(r => r.elements).find(el => el.id === editingHeaderElementId && el.type === 'HeaderElement')?.data as HeaderElementData | undefined;

  const handleGenerateAIPage = async () => {
    if (!aiPageDescription.trim()) {
      toast({ title: 'Error', description: 'Please provide a description for the page.', variant: 'destructive' });
      return;
    }
    setIsGenerating(true);
    setGeneratedCode(null);
    const input: GenerateLandingPageCodeInput = {
      description: aiPageDescription,
      primaryColor: aiPrimaryColor,
      secondaryColor: aiSecondaryColor,
      accentColor: aiAccentColor,
      pageTitle: pageTitle || "AI Generated Page",
      fontFamilyName: aiFontFamilyName,
      fontFamilyImportUrl: aiFontFamilyImportUrl,
    };
    try {
      const result = await handleGenerateLandingPageCodeAction(input);
      if (result.code) {
        setGeneratedCode(result.code);
        toast({ title: 'Page Code Generated!', description: 'Preview the code below. You can copy and paste it into a new Next.js page file.' });
      } else {
        toast({ title: 'Generation Failed', description: result.error || 'The AI could not generate the page code.', variant: 'destructive' });
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'An unexpected error occurred.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !propPageFontFamilyImportUrl) return;

    const FONT_STYLESHEET_ID = 'dynamic-google-font-stylesheet';
    const existingLink = document.getElementById(FONT_STYLESHEET_ID);
    if (existingLink) {
      existingLink.remove();
    }

    const link = document.createElement('link');
    link.id = FONT_STYLESHEET_ID;
    link.rel = 'stylesheet';
    link.href = propPageFontFamilyImportUrl;
    document.head.appendChild(link);

    return () => {
      const linkToRemove = document.getElementById(FONT_STYLESHEET_ID);
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [propPageFontFamilyImportUrl]);

  useEffect(() => {
    if (typeof window !== 'undefined' && originalBodyBackgroundColorRef.current !== null) {
      const dynamicStyleTagId = 'dynamic-body-background-style';
      let styleTag = document.getElementById(dynamicStyleTagId) as HTMLStyleElement | null;

      if (propBodyBackgroundColor) {
        if (!styleTag) {
          styleTag = document.createElement('style');
          styleTag.id = dynamicStyleTagId;
          document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = `body { background-color: ${propBodyBackgroundColor} !important; }`;
      } else {
        if (styleTag) {
          styleTag.remove(); // Remove the dynamic style
        }
        // Restore original only if it was set
        document.body.style.backgroundColor = originalBodyBackgroundColorRef.current || '';
      }
    }
  }, [propBodyBackgroundColor]);


  const loadProjectForEditing = (projectId: string) => {
    const projectDataRaw = localStorage.getItem(`project-${projectId}`);
    if (projectDataRaw) {
      try {
        const projectData = JSON.parse(projectDataRaw) as ProjectData;
        setCurrentProjectId(projectId);
        setPageTitle(projectData.pageTitle || 'Untitled Project');
        setCanvasRows(projectData.canvasRows || []);
        setSelectedRowId(null);
        setSelectedElementId(null);

        setPropPageFontFamilyName(projectData.fontFamilyName || googleFonts[0].name);
        setPropPageFontFamilyImportUrl(projectData.fontFamilyImportUrl || googleFonts[0].importUrl);
        setPropPageFillColor(projectData.pageFillColor || undefined);
        setPropPageCursor(projectData.propPageCursor || undefined);
        setPropBodyBackgroundColor(projectData.bodyBackgroundColor || undefined);

        setActiveView('editor');
        toast({title: "Project Loaded", description: `Editing "${projectData.pageTitle || 'Untitled Project'}"`});
      } catch (e) {
        toast({title: "Error", description: "Could not load project data.", variant: "destructive"});
      }
    } else {
      toast({title: "Error", description: "Project not found.", variant: "destructive"});
    }
  };

  const deleteProjectFromDashboard = (projectId: string) => {
    localStorage.removeItem(`project-${projectId}`);
    if (currentProjectId === projectId) {
      resetEditorState();
    }
    loadAllProjectsMetadata();
    toast({title: "Project Deleted", description: "The project has been removed."});
  };

  const currentPropFillColor = selectedRowId && !selectedElementId
    ? canvasRows.find(r => r.id === selectedRowId)?.backgroundColor || undefined
    : (selectedElementId && selectedElement?.type !== 'Section' ? undefined : propPageFillColor);


  const handleFillColorChange = (color: string) => {
    const newColor = (color === '#FFFFFF' || color === '#00000000' || color === '#000000') ? undefined : color; 
    if (selectedRowId && !selectedElementId) { // Editing row fill
      setCanvasRows(prevRows =>
        prevRows.map(row =>
          row.id === selectedRowId ? { ...row, backgroundColor: newColor } : row
        )
      );
    } else if (!selectedRowId && !selectedElementId) { // Editing page canvas fill
      setPropPageFillColor(newColor);
    }
  };
  
  const handleBodyFillColorChange = (color: string) => {
    const newColor = (color === '#FFFFFF' || color === '#00000000' || color === '#000000') ? undefined : color;
    setPropBodyBackgroundColor(newColor);
  };

  const toggleGridVisibility = () => {
    setIsGridVisible(prev => !prev);
  };
  
  const genericFillLabel = selectedElementId
    ? (selectedElement?.type === 'Section' ? "Fill (N/A - Use Section Properties)" : "Element Fill (TBD)")
    : (selectedRowId ? "Row Background" : "Page Canvas Background");


  if (!hasMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        Loading Page Builder...
      </div>
    );
  }

  if (activeView === 'dashboard') {
    return (
      <ProjectDashboard
        projects={allProjects}
        onEditProject={loadProjectForEditing}
        onDeleteProject={deleteProjectFromDashboard}
        onCreateNewProject={handleNewPage}
        onSwitchToAiGenerator={() => setActiveView('ai-generator')}
        onSwitchToSettings={() => setActiveView('settings')}
      />
    );
  }


  if (activeView === 'settings') {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <header className="p-3 border-b border-border flex-shrink-0 flex justify-between items-center bg-card shadow-sm h-14">
          <Button variant="ghost" size="sm" onClick={() => setActiveView(allProjects.length > 0 ? 'dashboard' : 'editor')} className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {allProjects.length > 0 ? 'Dashboard' : 'Builder'}
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
          <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
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

  if (activeView === 'ai-generator') {
    return (
      <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
        <header className="p-3 border-b border-border flex-shrink-0 flex justify-between items-center bg-card shadow-sm h-14">
          <Button variant="ghost" size="sm" onClick={() => setActiveView(allProjects.length > 0 ? 'dashboard' : 'editor')} className="text-sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to {allProjects.length > 0 ? 'Dashboard' : 'Builder'}
          </Button>
          <div className="text-lg font-semibold flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-primary" /> AI Landing Page Generator
          </div>
          <Button onClick={handleGenerateAIPage} disabled={isGenerating} size="sm">
            {isGenerating ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <SendHorizonal className="mr-2 h-4 w-4" />}
            Generate Page
          </Button>
        </header>
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Describe Your Landing Page</CardTitle>
              <CardDescription>Tell the AI what kind of landing page you want to create. Be as detailed as possible.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="aiPageDescription">Page Description (Purpose, Sections, Vibe)</Label>
                <Textarea
                  id="aiPageDescription"
                  value={aiPageDescription}
                  onChange={(e) => setAiPageDescription(e.target.value)}
                  placeholder="e.g., A landing page for a new AI-powered productivity app. It should have a hero section with a catchy headline, a features section highlighting 3 key benefits with icons, a pricing table, and a simple footer."
                  className="min-h-[120px] bg-card border-input"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="aiPrimaryColor">Primary Color</Label>
                  <Input id="aiPrimaryColor" type="color" value={aiPrimaryColor} onChange={(e) => setAiPrimaryColor(e.target.value)} className="h-10 p-1 bg-card"/>
                </div>
                <div>
                  <Label htmlFor="aiSecondaryColor">Secondary Color</Label>
                  <Input id="aiSecondaryColor" type="color" value={aiSecondaryColor} onChange={(e) => setAiSecondaryColor(e.target.value)} className="h-10 p-1 bg-card"/>
                </div>
                <div>
                  <Label htmlFor="aiAccentColor">Accent Color</Label>
                  <Input id="aiAccentColor" type="color" value={aiAccentColor} onChange={(e) => setAiAccentColor(e.target.value)} className="h-10 p-1 bg-card"/>
                </div>
              </div>
              <div>
                <Label htmlFor="aiFontFamily">Font Family</Label>
                <Select
                  value={aiFontFamilyName}
                  onValueChange={(value) => {
                    const selectedFont = googleFonts.find(f => f.name === value);
                    if (selectedFont) {
                      setAiFontFamilyName(selectedFont.name);
                      setAiFontFamilyImportUrl(selectedFont.importUrl);
                    }
                  }}
                >
                  <SelectTrigger id="aiFontFamily" className="bg-card border-input">
                    <SelectValue placeholder="Select a font" />
                  </SelectTrigger>
                  <SelectContent>
                    {googleFonts.map(font => (
                      <SelectItem key={font.name} value={font.name}>
                        <span style={{ fontFamily: font.family }}>{font.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          {generatedCode && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Page Code (Next.js Component)</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] border rounded-md bg-muted/30 p-4">
                  <pre className="text-xs whitespace-pre-wrap">
                    <code>{generatedCode}</code>
                  </pre>
                </ScrollArea>
                 <Button
                    onClick={() => {
                      if (generatedCode) {
                        navigator.clipboard.writeText(generatedCode);
                        toast({ title: "Code Copied!", description: "The generated code has been copied to your clipboard." });
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    disabled={!generatedCode}
                  >
                    <ClipboardCopy className="mr-2 h-4 w-4"/> Copy Code
                  </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }


  const pageCanvasStyle: React.CSSProperties = {
      width: `${activeBreakpoint.width}px`,
      minHeight: 'max(70vh, 500px)',
      transform: `scale(${canvasZoom})`,
      transformOrigin: 'center center',
      fontFamily: googleFonts.find(f => f.name === propPageFontFamilyName)?.family || 'sans-serif',
      backgroundColor: propPageFillColor || 'transparent',
  };

  if (isGridVisible) {
      pageCanvasStyle.backgroundImage = 'radial-gradient(hsl(var(--muted-foreground)) 0.5px, transparent 0.5px)';
      pageCanvasStyle.backgroundSize = '15px 15px';
      pageCanvasStyle.backgroundPosition = '-7px -7px';
  }


  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <header className="p-2 border-b border-border flex-shrink-0 flex justify-between items-center bg-card shadow-sm h-14">
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8"><Shapes className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleNewPage}><FilePlus2 className="mr-2 h-4 w-4 text-primary"/>New Page...</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveView('dashboard')}><Projector className="mr-2 h-4 w-4 text-primary"/>My Projects</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleUndo} disabled={!previousCanvasRows}>Undo</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "Redo: TBD" })}>Redo</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSaveVersion}>Save Version...</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast({ title: "View Versions: TBD" })}>View Versions</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveView('ai-generator')}>
                 <Sparkles className="mr-2 h-4 w-4 text-primary" /> AI Page Generator
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Row" onClick={handleAddRow}><LayoutGridIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Text (TBD)" onClick={() => toast({title: "Add Text: TBD"})}><TypeIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Add Image (TBD)" onClick={() => toast({title: "Add Image: TBD"})}><ImageIcon className="h-4 w-4" /></Button>
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
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Live Preview" onClick={handleLivePreview}><Globe className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Page Settings" onClick={() => setActiveView('settings')}><SettingsIcon className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Test/Play (TBD)" onClick={() => toast({title: "Play: TBD"})}><Play className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" className="h-8" onClick={() => toast({title: "Invite: TBD"})}><Users className="mr-1.5 h-3 w-3"/>Invite</Button>
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://avatar.vercel.sh/user?size=32" alt="User" data-ai-hint="user avatar"/>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <Button onClick={handlePublish} disabled={publishStatus === 'publishing'} className="h-8 bg-blue-500 hover:bg-blue-600 text-white">
            {publishStatus === 'publishing' ? <Sparkles className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
            {currentProjectId ? "Update Page" : (publishStatus === 'publishing' ? "Publishing..." : "Publish")}
          </Button>
        </div>
      </header>

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
        <ResizablePanel
            defaultSize={14}
            minSize={isMobile ? 15 : 10}
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
              <ScrollArea className="h-full">
                 <div className="p-3">
                  <Input placeholder="Search elements..." className="mb-3 h-9 bg-background" value={paletteSearchTerm} onChange={e => setPaletteSearchTerm(e.target.value)} />
                  <Accordion type="multiple" defaultValue={filteredGroupedElements.map(g => g.category)} className="w-full">
                    {filteredGroupedElements.map(({ category, elements }) => (
                      <AccordionItem value={category} key={category}>
                        <AccordionTrigger className="text-sm font-medium py-2.5 hover:no-underline px-1">
                          {category}
                        </AccordionTrigger>
                        <AccordionContent className="pt-1 pb-2 pl-1">
                          <div className="space-y-1.5">
                             {Array.isArray(elements) && elements.map((el) => (
                              <div
                                key={el.name}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("application/json", JSON.stringify({ type: 'ADD_ELEMENT', elementName: el.name }));
                                }}
                                onClick={() => handleElementClickInPalette(el)}
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
                     {paletteSearchTerm.trim() !== '' && filteredGroupedElements.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">No elements found for "{paletteSearchTerm}".</p>
                      )}
                  </Accordion>
                 </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={68} minSize={30}>
          <div
            className="h-full flex flex-col overflow-hidden relative"
            onMouseDown={handleCanvasMouseDown}
          >
            <ScrollArea
              className="flex-grow"
              style={{ cursor: activeCanvasTool === 'pan' ? (isCanvasPanning ? 'grabbing' : 'grab') : 'default' }}
              ref={scrollAreaRef}
            >
              <div
                className="flex items-center justify-center min-h-full min-w-full" 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.stopPropagation();
                    handleDropOnCanvas(e, undefined);
                }}
              >
                <div
                  data-page-canvas="true"
                  className={cn(
                    "transition-all duration-300 shadow-xl relative p-4 md:p-8",
                    canvasRows.length === 0 && "flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/50",
                    propPageCursor // Apply page cursor if set
                  )}
                  style={pageCanvasStyle}
                  onDragOver={(e) => {e.preventDefault(); e.stopPropagation();}}
                  onDrop={(e) => {e.stopPropagation(); handleDropOnCanvas(e, undefined);}}
                  onClick={() => { setSelectedRowId(null); setSelectedElementId(null); }}
                >
                  {canvasRows.length > 0 ? (
                    <div className="max-w-full mx-auto">
                      {canvasRows.map((row) => (
                        <div
                          key={row.id}
                          className={cn(
                            "grid gap-4 my-0 p-2 border-2 rounded-md min-h-[60px] w-full",
                            row.layout,
                            selectedRowId === row.id && !selectedElementId ? "border-primary ring-2 ring-primary ring-offset-2 dark:ring-offset-background" : "border-transparent hover:border-muted-foreground/30"
                          )}
                          style={{ backgroundColor: row.backgroundColor || 'transparent' }}
                          onClick={(e) => handleRowClick(row.id, e)}
                          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                          onDrop={(e) => {e.stopPropagation(); handleDropOnCanvas(e, row.id);}}
                        >
                          {row.elements.length === 0 && parseInt(row.layout.split('-')[2] || '1', 10) > 0 &&
                            Array.from({ length: Math.max(1, parseInt(row.layout.split('-')?.[2] || '1', 10)) }).map((_, idx) => (
                              <div key={`placeholder-col-${row.id}-${idx}`} className="min-h-[40px] bg-muted/20 dark:bg-zinc-800/50 rounded flex items-center justify-center text-muted-foreground text-xs p-2">
                                Column {idx + 1}
                              </div>
                            ))
                          }
                          {row.elements.map((el, index) => {
                            const isDraggingThis = draggingElementInfo?.elementId === el.id;
                            const isDragOverThis = dragOverElementInfo?.elementId === el.id && dragOverElementInfo?.rowId === row.id && draggingElementInfo && draggingElementInfo.rowId === row.id;
                            const isSelected = selectedElementId === el.id;
                            const elementCursorClass = el.data.cursor;
                            return (
                            <div 
                              key={el.id} 
                              draggable={true}
                              onDragStart={(e) => handleElementDragStart(e, row.id, el.id, index)}
                              onDragEnd={handleElementDragEnd}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (draggingElementInfo && draggingElementInfo.rowId === row.id) {
                                    e.dataTransfer.dropEffect = 'move';
                                    if (draggingElementInfo.elementId !== el.id) {
                                        setDragOverElementInfo({ rowId: row.id, elementId: el.id, elementIndex: index });
                                    } else {
                                        setDragOverElementInfo(null);
                                    }
                                } else {
                                    e.dataTransfer.dropEffect = 'none';
                                    setDragOverElementInfo(null);
                                }
                              }}
                              onDragLeave={handleElementDragLeave}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (draggingElementInfo && draggingElementInfo.rowId === row.id && draggingElementInfo.elementId !== el.id) {
                                    handleElementDropOnElement(e, row.id, el.id, index);
                                }
                                setDragOverElementInfo(null);
                              }}
                              onClick={(e) => handleElementDivClick(row.id, el.id, e)}
                              className={cn(
                                "relative group/element p-1 border w-full transition-all duration-150 ease-in-out",
                                isSelected ? "border-blue-500 ring-1 ring-blue-500" : "border-transparent hover:border-primary/50",
                                { "opacity-30": isDraggingThis },
                                { "border-blue-500 border-dashed ring-1 ring-blue-500 bg-blue-500/5": isDragOverThis && !isDraggingThis },
                                isDraggingThis ? 'cursor-grabbing' : elementCursorClass
                              )}
                            >
                               <div className="absolute top-0 right-0 z-20 flex items-center gap-0.5 bg-card p-0.5 rounded-bl-md shadow-lg element-controls opacity-0 group-hover/element:opacity-100 transition-opacity duration-200">
                                 <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground cursor-move flex-shrink-0" title="Drag to reorder">
                                   <GripVertical className="h-3.5 w-3.5" />
                                 </Button>
                                 <span className="text-xs px-1 py-0.5 bg-primary/10 text-primary rounded-l-md flex-shrink min-w-0 truncate max-w-[80px] sm:max-w-[120px]" title={el.name}>{el.name}</span>
                                 <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground flex-shrink-0" onClick={() => handleEditElement(row.id, el.id)} title="Edit Element"> <Edit3 className="h-3.5 w-3.5" /></Button>
                                 <Button variant="ghost" size="icon" className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10 flex-shrink-0" onClick={() => handleDeleteElement(row.id, el.id)} title="Delete Element"> <Trash2 className="h-3.5 w-3.5" /></Button>
                              </div>
                              <div className="mt-8 w-full">
                                 {renderCanvasElement(el, row.id)}
                              </div>
                            </div>
                          )})}
                        </div>
                      ))}
                    </div>
                  ) : (
                     <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-10 text-center">
                      <LayoutGridIcon className="h-16 w-16 mb-4 text-muted-foreground/70" />
                      <p className="text-lg font-medium">Drag elements here to build your page</p>
                      <p className="text-sm">or click "Add Row" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
              <div className="flex items-center gap-1 p-1.5 bg-zinc-800 text-zinc-300 rounded-lg shadow-xl">
                <Button
                    variant="ghost"
                    size="icon"
                    title="Select Tool (V)"
                    onClick={() => {setActiveCanvasTool('select');}}
                    className={cn("h-8 w-8 hover:bg-zinc-700", activeCanvasTool === 'select' && "bg-zinc-600 text-white")}
                > <MousePointer className="h-4 w-4" /></Button>
                <Button
                    variant="ghost"
                    size="icon"
                    title="Pan Tool (H)"
                    onClick={() => {setActiveCanvasTool('pan');}}
                    className={cn("h-8 w-8 hover:bg-zinc-700", activeCanvasTool === 'pan' && "bg-zinc-600 text-white")}
                > <HandIcon className="h-4 w-4" /></Button>
                <Separator orientation="vertical" className="h-6 bg-zinc-700" />
                <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Set Dark Mode" 
                    onClick={() => setTheme('dark')} 
                    className={cn("h-8 w-8 hover:bg-zinc-700", theme === 'dark' && "bg-zinc-600 text-white")}> 
                    <CircleIcon className="h-4 w-4" />
                </Button>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Set Light Mode" 
                    onClick={() => setTheme('light')} 
                    className={cn("h-8 w-8 hover:bg-zinc-700", theme === 'light' && "bg-zinc-600 text-white")}> 
                    <SunIcon className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 bg-zinc-700" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  title="Toggle Grid" 
                  onClick={toggleGridVisibility} 
                  className={cn("h-8 w-8 hover:bg-zinc-700", isGridVisible && "bg-zinc-600 text-white")}
                >
                  <GridIconLucide className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6 bg-zinc-700" />
                <Select
                    value={`${Math.round(canvasZoom * 100)}%`}
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
        
        <ResizablePanel
          defaultSize={18}
          minSize={15}
          maxSize={isMobile ? 40 : 30}
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
              <ScrollArea className="h-full">
                <div className="p-1">
                  <Accordion type="multiple" defaultValue={['element_specific', 'typography', 'styles', 'layout', 'breakpoint', 'cursor']} className="w-full">
                     {selectedElement && (selectedElement.type === 'Heading' || selectedElement.type === 'TextBlock') && (
                        <AccordionItem value="element_specific">
                          <AccordionTrigger className="text-sm px-2 py-2.5">{selectedElement.name} Properties</AccordionTrigger>
                          <AccordionContent className="px-2 pb-3 space-y-3">
                            <div>
                              <Label htmlFor="elementTextContent" className="text-xs">Text Content</Label>
                              <Textarea
                                id="elementTextContent"
                                value={selectedElement.data.text || ''}
                                onChange={(e) => handleUpdateSelectedElementData('text', e.target.value)}
                                className="h-20 mt-1 bg-background text-xs"
                                disabled={!selectedElementId}
                              />
                            </div>
                            <div>
                              <Label htmlFor="elementHtmlTag" className="text-xs">HTML Tag</Label>
                              <Select
                                value={selectedElement.data.htmlTag || (selectedElement.type === 'Heading' ? 'h1' : 'p')}
                                onValueChange={(value) => handleUpdateSelectedElementData('htmlTag', value as HtmlTag)}
                                disabled={!selectedElementId}
                              >
                                <SelectTrigger id="elementHtmlTag" className="h-8 mt-1 bg-background text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {htmlTagOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                             <div>
                              <Label htmlFor="elementFontSize" className="text-xs">Font Size</Label>
                              <Select
                                value={selectedElement.data.fontSize || DEFAULT_FONT_SIZE_VALUE}
                                onValueChange={(value) => {
                                  const newFontSize = value === DEFAULT_FONT_SIZE_VALUE ? undefined : (value as TailwindFontSize);
                                  handleUpdateSelectedElementData('fontSize', newFontSize);
                                }}
                                disabled={!selectedElementId}
                              >
                                <SelectTrigger id="elementFontSize" className="h-8 mt-1 bg-background text-xs">
                                  <SelectValue placeholder="Default based on tag" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={DEFAULT_FONT_SIZE_VALUE} className="text-xs">Default based on Tag</SelectItem>
                                  {fontSizeOptions.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label className="text-xs block mb-1.5">Text Alignment</Label>
                              <div className="flex space-x-1">
                                {textAlignOptions.map(opt => (
                                  <Button
                                    key={opt.value}
                                    variant={selectedElement.data.textAlign === opt.value ? 'secondary' : 'outline'}
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleUpdateSelectedElementData('textAlign', opt.value as TextAlignment)}
                                    title={opt.label}
                                    disabled={!selectedElementId}
                                  >
                                    <opt.icon className="h-4 w-4" />
                                  </Button>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                      {selectedElement && selectedElement.type === 'Section' && (
                        <AccordionItem value="section_styles">
                          <AccordionTrigger className="text-sm px-2 py-2.5">Section Styles</AccordionTrigger>
                          <AccordionContent className="px-2 pb-3 space-y-3">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="sectionFillColor" className="text-xs flex-1">
                                Section Background
                              </Label>
                              <Input
                                id="sectionFillColor"
                                type="color"
                                value={selectedElement.data.backgroundColor || '#FFFFFF'}
                                onChange={(e) => handleUpdateSelectedElementData('backgroundColor', e.target.value === '#FFFFFF' || e.target.value === '#000000' ? undefined : e.target.value)}
                                className="h-8 w-10 p-0.5 bg-background"
                              />
                            </div>
                             <div>
                                <Label htmlFor="sectionClassName" className="text-xs">Custom CSS Classes</Label>
                                <Input
                                  id="sectionClassName"
                                  value={selectedElement.data.className || ''}
                                  onChange={(e) => handleUpdateSelectedElementData('className', e.target.value)}
                                  placeholder="e.g., py-12 md:py-20"
                                  className="h-8 mt-1 bg-background text-xs"
                                />
                              </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
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
                          <div><Label htmlFor="prop-x" className="text-xs">X</Label><Input id="prop-x" type="number" value={propPositionX} onChange={e=>setPropPositionX(Number(e.target.value))} className="h-8 mt-1 bg-background text-xs"/></div>
                          <div><Label htmlFor="prop-y" className="text-xs">Y</Label><Input id="prop-y" type="number" value={propPositionY} onChange={e=>setPropPositionY(Number(e.target.value))} className="h-8 mt-1 bg-background text-xs"/></div>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                          <div><Label htmlFor="prop-w" className="text-xs">W</Label><Input id="prop-w" type="number" value={propWidth} onChange={e=>setPropWidth(Number(e.target.value))} className="h-8 mt-1 bg-background text-xs"/></div>
                          <LinkIconLucide className="h-4 w-4 text-muted-foreground self-end mb-1.5" />
                          <div><Label htmlFor="prop-h" className="text-xs">H</Label><Input id="prop-h" type="number" value={propHeight} onChange={e=>setPropHeight(Number(e.target.value))} className="h-8 mt-1 bg-background text-xs"/></div>
                        </div>
                         <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label htmlFor="prop-fixed-w" className="text-xs">Fixed W</Label>
                                <Select value={propFixedW} onValueChange={setPropFixedW}>
                                    <SelectTrigger id="prop-fixed-w" className="h-8 mt-1 bg-background text-xs"><SelectValue/></SelectTrigger>
                                    <SelectContent><SelectItem value="Auto">Auto</SelectItem><SelectItem value="Fixed">Fixed</SelectItem></SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="prop-fixed-h" className="text-xs">Fixed H</Label>
                                <Select value={propFixedH} onValueChange={setPropFixedH}>
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
                        <p className="text-xs text-muted-foreground">Row Columns (Selected: {selectedRowId && !selectedElementId ? canvasRows.find(r=>r.id === selectedRowId)?.layout.split('-')[2] || 'N/A' : 'None'})</p>
                        <div className="flex gap-1.5">
                          {['1', '2', '3', '4'].map(col => (
                            <Button key={col} variant="outline" size="xs" className="flex-1" onClick={() => handleChangeRowLayout(`grid-cols-${col}`)} disabled={!selectedRowId || !!selectedElementId}>{col} Col</Button>
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
                            <Input id="prop-font-base" type="number" value={propBaseFontSize} onChange={e=>setPropBaseFontSize(Number(e.target.value))} className="h-8 w-16 bg-background text-xs" disabled={!!selectedElementId}/>
                            <span className="text-xs text-muted-foreground">PX</span>
                            <Button variant="outline" size="icon" className="h-7 w-7" disabled={!!selectedElementId}><Minus className="h-3 w-3"/></Button>
                            <Button variant="outline" size="icon" className="h-7 w-7" disabled={!!selectedElementId}><Plus className="h-3 w-3"/></Button>
                        </div>
                        <div>
                          <Label htmlFor="propPageFontFamily" className="text-xs">Font Family</Label>
                          <Select
                            value={propPageFontFamilyName}
                            onValueChange={(value) => {
                              const selectedFont = googleFonts.find(f => f.name === value);
                              if (selectedFont) {
                                setPropPageFontFamilyName(selectedFont.name);
                                setPropPageFontFamilyImportUrl(selectedFont.importUrl);
                              }
                            }}
                            disabled={!!selectedElementId}
                          >
                            <SelectTrigger id="propPageFontFamily" className="h-8 mt-1 bg-background text-xs">
                              <SelectValue placeholder="Select a font" />
                            </SelectTrigger>
                            <SelectContent>
                              {googleFonts.map(font => (
                                <SelectItem key={font.name} value={font.name} className="text-xs">
                                  <span style={{ fontFamily: font.family }}>{font.name}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                     <AccordionItem value="cursor">
                        <AccordionTrigger className="text-sm px-2 py-2.5 flex items-center">
                          <MousePointer className="mr-2 h-4 w-4 text-muted-foreground"/> Cursor
                        </AccordionTrigger>
                        <AccordionContent className="px-2 pb-3 space-y-3">
                          <div className="space-y-1">
                            <Label htmlFor="prop-cursor" className="text-xs">
                              {selectedElementId ? "Element Cursor" : "Page Cursor"}
                            </Label>
                            <Select
                              value={
                                selectedElementId && selectedElement?.data.cursor
                                  ? selectedElement.data.cursor
                                  : !selectedElementId && propPageCursor
                                  ? propPageCursor
                                  : DEFAULT_CURSOR_VALUE
                              }
                              onValueChange={(value) => {
                                const actualValue = value === DEFAULT_CURSOR_VALUE ? undefined : value;
                                if (selectedElementId) {
                                  handleUpdateSelectedElementData('cursor', actualValue);
                                } else {
                                  setPropPageCursor(actualValue);
                                }
                              }}
                            >
                              <SelectTrigger id="prop-cursor" className="h-8 mt-1 bg-background text-xs">
                                <SelectValue placeholder="Default (Auto)" />
                              </SelectTrigger>
                              <SelectContent>
                                {cursorOptions.map(opt => (
                                  <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground mt-1">
                              {selectedElementId ? "Sets cursor for this element. Clears to inherit from page or browser default." : "Sets cursor for the entire page. Affects elements without their own cursor style."}
                            </p>
                          </div>
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
                            <Label htmlFor="prop-fill" className="text-xs flex-1">
                              {genericFillLabel}
                            </Label>
                            <Input
                              id="prop-fill"
                              type="color"
                              value={currentPropFillColor || '#FFFFFF'}
                              onChange={e => handleFillColorChange(e.target.value)}
                              className="h-8 w-10 p-0.5 bg-background"
                              disabled={!!selectedElementId && selectedElement?.type !== 'Section'}
                            />
                         </div>
                        <div className="flex items-center gap-2">
                            <Label htmlFor="prop-body-bg-fill" className="text-xs flex-1">
                                Outer Page Background
                            </Label>
                            <Input
                                id="prop-body-bg-fill"
                                type="color"
                                value={propBodyBackgroundColor || '#FFFFFF'}
                                onChange={e => handleBodyFillColorChange(e.target.value)}
                                className="h-8 w-10 p-0.5 bg-background"
                            />
                        </div>
                         <div>
                            <Label htmlFor="prop-overflow" className="text-xs">Overflow</Label>
                            <Select value={propOverflow} onValueChange={setPropOverflow}>
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

      {editingMarqueeElementId && editingMarqueeData && (
        <EditMarqueeModal
          isOpen={isEditMarqueeModalOpen}
          onOpenChange={setIsEditMarqueeModalOpen}
          initialReviews={editingMarqueeData.reviews}
          onUpdate={(updatedReviews) => handleUpdateMarqueeData(editingMarqueeElementId, { reviews: updatedReviews })}
        />
      )}
      {editingHeroVideoElementId && editingHeroVideoData && (
        <EditHeroVideoModal
          isOpen={isEditHeroVideoModalOpen}
          onOpenChange={setIsEditHeroVideoModalOpen}
          initialData={editingHeroVideoData}
          onUpdate={(updatedData) => handleUpdateHeroVideoData(editingHeroVideoElementId, updatedData)}
        />
      )}
       {editingTerminalElementId && editingTerminalData && (
        <EditTerminalModal
          isOpen={isEditTerminalModalOpen}
          onOpenChange={setIsEditTerminalModalOpen}
          initialLines={editingTerminalData.lines}
          onUpdate={(updatedLines) => handleUpdateTerminalData(editingTerminalElementId, {lines: updatedLines})}
        />
      )}
      {editingHeaderElementId && editingHeaderData && (
        <EditHeaderModal
          isOpen={isEditHeaderModalOpen}
          onOpenChange={setIsEditHeaderModalOpen}
          initialData={editingHeaderData}
          onUpdate={(updatedData) => handleUpdateHeaderData(editingHeaderElementId, updatedData)}
        />
      )}
    </div>
  );
}

