
import type { HeaderTemplate } from './types';
import { Feather, Zap, Aperture, Shield, Gem } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

export const headerTemplates: HeaderTemplate[] = [
  {
    id: 'minimalist-light',
    name: 'Minimalist Light',
    description: 'Clean and simple header with logo left and navigation right.',
    icon: Feather,
    data: {
      siteTitle: 'Minimalist Co.',
      logoUrl: '', // User can add their logo
      navLinks: [
        { id: uuidv4(), text: 'About', href: '#', isButton: false },
        { id: uuidv4(), text: 'Services', href: '#', isButton: false },
        { id: uuidv4(), text: 'Contact', href: '#', isButton: false },
      ],
      backgroundColor: 'bg-background',
      textColor: 'text-foreground',
      sticky: false,
      layout: 'logo-left-nav-right',
    },
  },
  {
    id: 'modern-cta-dark',
    name: 'Modern Dark CTA',
    description: 'Dark header with logo, navigation, and a prominent call-to-action button.',
    icon: Zap,
    data: {
      siteTitle: 'Modern Solutions',
      logoUrl: 'https://placehold.co/120x40/333333/FFFFFF.png?text=Modern', // Placeholder dark logo
      navLinks: [
        { id: uuidv4(), text: 'Features', href: '#', isButton: false },
        { id: uuidv4(), text: 'Pricing', href: '#', isButton: false },
        { id: uuidv4(), text: 'Blog', href: '#', isButton: false },
        { id: uuidv4(), text: 'Get Started', href: '#', isButton: true },
      ],
      backgroundColor: 'bg-gray-900',
      textColor: 'text-gray-100',
      gradientClass: 'bg-gradient-to-r from-gray-800 via-gray-900 to-black',
      sticky: true,
      layout: 'logo-left-nav-left-actions-right',
    },
  },
  {
    id: 'centered-logo-gradient',
    name: 'Centered Logo Gradient',
    description: 'Header with a centered logo and a vibrant gradient background.',
    icon: Aperture,
    data: {
      siteTitle: 'Center Stage',
      logoUrl: 'https://placehold.co/150x50/FFFFFF/007BFF.png?text=Center', // Placeholder bright logo
      navLinks: [
        { id: uuidv4(), text: 'Home', href: '#', isButton: false },
        { id: uuidv4(), text: 'Gallery', href: '#', isButton: false },
        { id: uuidv4(), text: 'Events', href: '#', isButton: false },
        { id: uuidv4(), text: 'Book Now', href: '#', isButton: true },
      ],
      backgroundColor: 'bg-transparent', // Gradient will take over
      textColor: 'text-white',
      gradientClass: 'bg-gradient-to-r from-purple-600 to-pink-500',
      sticky: true,
      layout: 'logo-center-nav-below',
    },
  },
  {
    id: 'corporate-split-nav',
    name: 'Corporate Split Navigation',
    description: 'Professional header with a centered logo and navigation links split on either side.',
    icon: Shield,
    data: {
      siteTitle: 'Corp Inc.',
      logoUrl: 'https://placehold.co/50x50/004085/FFFFFF.png?text=C', // Placeholder corporate logo
      navLinks: [
        // Links for left side
        { id: uuidv4(), text: 'Company', href: '#', isButton: false },
        { id: uuidv4(), text: 'Careers', href: '#', isButton: false },
        // Links for right side (will be handled by layout)
        { id: uuidv4(), text: 'Investors', href: '#', isButton: false },
        { id: uuidv4(), text: 'Login', href: '#', isButton: true },
      ],
      backgroundColor: 'bg-blue-700',
      textColor: 'text-white',
      sticky: false,
      layout: 'logo-center-nav-split',
    },
  },
  {
    id: 'playful-menu-button',
    name: 'Playful Menu Button Focus',
    description: 'A clean header that emphasizes a menu button for navigation, with a right-aligned action.',
    icon: Gem,
    data: {
      siteTitle: 'Playful App',
      logoUrl: 'https://placehold.co/40x40/FFC107/333333.png?text=P', // Placeholder playful logo
      navLinks: [ // These would typically go inside the mobile menu, main nav might be minimal
        { id: uuidv4(), text: 'Discover', href: '#', isButton: false },
        { id: uuidv4(), text: 'Community', href: '#', isButton: false },
        { id: uuidv4(), text: 'Support', href: '#', isButton: false },
        { id: uuidv4(), text: 'Download App', href: '#', isButton: true }, // Main action button
      ],
      backgroundColor: 'bg-background',
      textColor: 'text-foreground',
      sticky: true,
      layout: 'logo-left-nav-left-actions-right', // This layout can be adapted for a menu button focus
    },
  },
];
