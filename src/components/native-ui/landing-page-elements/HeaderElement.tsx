
'use client';

import React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; 
import type { HeaderElementData, NavLinkItem, HeaderLayout } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle'; // Import ThemeToggle

interface HeaderElementProps extends HeaderElementData {
  // No additional props needed for basic rendering
}

const defaultNavLinks: NavLinkItem[] = [
  { id: '1', text: 'Home', href: '#' },
  { id: '2', text: 'Features', href: '#' },
  { id: '3', text: 'Pricing', href: '#' },
  { id: '4', text: 'Contact', href: '#' },
  { id: '5', text: 'Sign Up', href: '#', isButton: true },
];

const HeaderElement: React.FC<HeaderElementProps> = ({
  siteTitle = 'My Site',
  logoUrl,
  navLinks = defaultNavLinks,
  backgroundColor = 'bg-background', 
  textColor = 'text-foreground',   
  sticky = false,
  layout = 'logo-left-nav-right',
  gradientClass, 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const headerBaseClasses = 'w-full p-4 shadow-sm flex items-center relative';
  const headerClasses = cn(
    headerBaseClasses,
    gradientClass ? gradientClass : backgroundColor, // Apply gradient if present, otherwise background color
    textColor,
    sticky ? 'sticky top-0 z-50' : ''
  );

  const regularLinks = navLinks.filter(link => !link.isButton);
  const actionLinks = navLinks.filter(link => link.isButton);

  const renderNavLinks = (linksToRender: NavLinkItem[], forMobile: boolean = false, linkClassName?: string) => (
    linksToRender.map((link) => (
      <Link key={link.id} href={link.href} passHref legacyBehavior>
        <a
          className={cn(
            'font-medium transition-opacity hover:opacity-80',
            link.isButton && !forMobile 
              ? 'px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm'
              : link.isButton && forMobile 
              ? 'block w-full text-left p-3 bg-primary text-primary-foreground rounded-md my-1 text-sm'
              : forMobile 
              ? 'block w-full text-left p-3 hover:bg-muted/10 text-sm'
              : 'py-2 px-3 text-sm',
            linkClassName
          )}
          onClick={() => forMobile && setIsMobileMenuOpen(false)}
        >
          {link.text}
        </a>
      </Link>
    ))
  );
  
  const logoComponent = (
    <div className={cn(layout === 'logo-center-nav-below' || layout === 'logo-center-nav-split' || layout === 'nav-left-logo-center-actions-right' ? 'mx-auto md:mx-0' : '')}>
      {logoUrl ? (
        <Link href="/" passHref legacyBehavior>
          <a className="block">
            <NextImage 
              src={logoUrl} 
              alt={siteTitle || 'Logo'} 
              width={120} 
              height={40} 
              className="h-8 w-auto object-contain" 
              data-ai-hint="website logo"
            />
          </a>
        </Link>
      ) : (
        <Link href="/" passHref legacyBehavior>
          <a className="text-xl font-bold">{siteTitle}</a>
        </Link>
      )}
    </div>
  );

  const desktopNav = (
    <nav className={cn(
        "hidden md:flex items-center",
        layout === 'logo-left-nav-right' && "ml-auto space-x-1 lg:space-x-2",
        layout === 'logo-left-nav-left-actions-right' && "space-x-1 lg:space-x-2",
        (layout === 'logo-center-nav-split' || layout === 'nav-left-logo-center-actions-right') && "space-x-1 lg:space-x-2"
      )}
    >
      {renderNavLinks(regularLinks)}
    </nav>
  );

  const desktopActions = (
     <div className={cn(
        "hidden md:flex items-center",
        layout === 'logo-left-nav-right' && "ml-4 space-x-1 lg:space-x-2",
        layout === 'logo-left-nav-left-actions-right' && "ml-auto space-x-1 lg:space-x-2",
        (layout === 'logo-center-nav-split' || layout === 'nav-left-logo-center-actions-right') && "space-x-1 lg:space-x-2"
      )}
    >
      {renderNavLinks(actionLinks)}
      <div className="ml-2">
        <ThemeToggle />
      </div>
    </div>
  );

  const mobileMenuButton = (
    <div className={cn("md:hidden flex items-center gap-2", 
        (layout === 'logo-left-nav-right' || layout === 'logo-left-nav-left-actions-right') && 'ml-auto',
        (layout === 'nav-left-logo-center-actions-right' && actionLinks.length === 0) && 'ml-auto' // if no actions, menu button goes to right
    )}>
      <ThemeToggle />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
        className={cn(textColor, "hover:bg-muted/20")} 
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );

  return (
    <header className={headerClasses}>
      {layout === 'logo-left-nav-right' && (
        <div className="container mx-auto flex items-center justify-between">
          {logoComponent}
          <div className="hidden md:flex items-center">
            {desktopNav}
            {desktopActions}
          </div>
          {mobileMenuButton}
        </div>
      )}

      {layout === 'logo-center-nav-split' && (
        <div className="container mx-auto flex items-center justify-between">
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
             {renderNavLinks(regularLinks.slice(0, Math.ceil(regularLinks.length / 2)))}
          </nav>
          {logoComponent}
          <div className="hidden md:flex items-center">
            <nav className="flex items-center space-x-1 lg:space-x-2">
              {renderNavLinks(regularLinks.slice(Math.ceil(regularLinks.length / 2)))}
            </nav>
            {desktopActions}
          </div>
          {mobileMenuButton}
        </div>
      )}

      {layout === 'logo-center-nav-below' && (
         <div className="container mx-auto flex flex-col items-center">
          <div className="w-full flex justify-between items-center md:justify-center">
            {logoComponent}
            {mobileMenuButton}
          </div>
          <div className="hidden md:flex items-center mt-2 pt-2 border-t border-current/20 w-full justify-center">
            <nav className="flex items-center space-x-1 lg:space-x-2">
              {renderNavLinks(regularLinks)}
            </nav>
            {desktopActions}
          </div>
        </div>
      )}

      {layout === 'nav-left-logo-center-actions-right' && (
        <div className="container mx-auto flex items-center justify-between">
          {desktopNav}
          <div className="flex-1 flex justify-center items-center md:absolute md:left-1/2 md:-translate-x-1/2">
            {logoComponent}
          </div>
          <div className="hidden md:flex items-center">
            {desktopActions}
          </div>
          {mobileMenuButton}
        </div>
      )}
       
      {layout === 'logo-left-nav-left-actions-right' && (
         <div className="container mx-auto flex items-center">
          {logoComponent}
          <div className="hidden md:flex items-center ml-6"> {/* Added ml-6 for spacing */}
             {desktopNav}
          </div>
          <div className="ml-auto hidden md:flex items-center">
            {desktopActions}
          </div>
          {mobileMenuButton}
        </div>
      )}


      {/* Mobile Navigation Menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            'md:hidden absolute top-full left-0 right-0 z-40 shadow-lg py-2 px-2', 
            gradientClass ? gradientClass : backgroundColor, 
            textColor 
          )}
        >
          <nav className="flex flex-col space-y-1">
            {renderNavLinks(navLinks, true)} 
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderElement;

