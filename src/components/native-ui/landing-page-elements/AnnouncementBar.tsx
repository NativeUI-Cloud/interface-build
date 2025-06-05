
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AnnouncementBarData } from '@/lib/types';

interface AnnouncementBarProps extends AnnouncementBarData {
  className?: string;
  // onDismiss is an internal handler, not passed from generator directly usually
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = "Lorem, ipsum dolor",
  linkText = "sit amet consectetur",
  linkHref = "#",
  variant = 'base',
  dismissible = false,
  backgroundColor, 
  textColor,       
  linkColor,         
  buttonBackgroundColor,
  buttonTextColor,
  buttonBorderColor,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true); 
  }, [text, linkText, linkHref, variant, dismissible]);

  if (!isVisible && dismissible) {
    return null;
  }

  // Base classes for the bar itself
  const barContainerClasses = cn(
    "w-full",
    {
      "border-b": variant === 'base',
      "fixed inset-x-0 bottom-0 z-50 border-t": variant === 'fixed',
      "fixed inset-x-0 bottom-0 z-50 p-4": variant === 'floating', // Floating has an outer wrapper
    },
    className
  );

  // Classes for the inner content div (especially for floating variant)
  const contentDivClasses = cn(
    "flex items-center justify-between px-4 py-2",
    {
      "rounded-md border shadow-lg": variant === 'floating',
    }
  );
  
  const isBgColorClass = backgroundColor && !backgroundColor.startsWith('#');
  const isTextColorClass = textColor && !textColor.startsWith('#');
  const isLinkColorClass = linkColor && !linkColor.startsWith('#');
  const isButtonBgColorClass = buttonBackgroundColor && !buttonBackgroundColor.startsWith('#');
  const isButtonTextColorClass = buttonTextColor && !buttonTextColor.startsWith('#');
  const isButtonBorderColorClass = buttonBorderColor && !buttonBorderColor.startsWith('#');

  const barStyle: React.CSSProperties = {};
  if (backgroundColor && backgroundColor.startsWith('#')) barStyle.backgroundColor = backgroundColor;
  if (textColor && textColor.startsWith('#')) barStyle.color = textColor;

  const textPStyle: React.CSSProperties = {};
   if (textColor && textColor.startsWith('#')) textPStyle.color = textColor;


  const linkStyle: React.CSSProperties = {};
  if (linkColor && linkColor.startsWith('#')) linkStyle.color = linkColor;
  
  const buttonStyle: React.CSSProperties = {};
  if (buttonBackgroundColor && buttonBackgroundColor.startsWith('#')) buttonStyle.backgroundColor = buttonBackgroundColor;
  if (buttonTextColor && buttonTextColor.startsWith('#')) buttonStyle.color = buttonTextColor;
  if (buttonBorderColor && buttonBorderColor.startsWith('#')) buttonStyle.borderColor = buttonBorderColor;


  const announcementContent = (
    <>
      {dismissible && variant !== 'base' && variant !== 'fixed' && <span />} {/* Spacer for justify-between in floating if dismissible */}
      {dismissible && (variant === 'base' || variant === 'fixed') && <span />}
      
      <p className={cn("text-center font-medium flex-grow", isTextColorClass ? textColor : 'text-gray-900 dark:text-gray-100')} style={textPStyle}>
        {text}
        {linkText && linkHref && (
          <Link href={linkHref} passHref legacyBehavior>
            <a 
              className={cn(
                "inline-block underline ml-1", 
                isLinkColorClass ? linkColor : 'text-primary hover:text-primary/80'
              )} 
              style={linkStyle}
            >
              {linkText}
            </a>
          </Link>
        )}
      </p>
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => setIsVisible(false)}
          className={cn(
            "rounded border p-1.5 shadow-sm transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-600/80 flex-shrink-0",
            isButtonBgColorClass ? buttonBackgroundColor : 'bg-white dark:bg-gray-700',
            isButtonBorderColorClass ? buttonBorderColor : 'border-gray-300 dark:border-gray-600',
          )}
          style={buttonStyle}
        >
          <X className={cn("size-5", isButtonTextColorClass ? buttonTextColor : 'text-gray-700 dark:text-gray-300')} style={{color: buttonTextColor?.startsWith('#') ? buttonTextColor : undefined}}/>
        </button>
      )}
       {/* Ensure spacer is present if dismissible is false but layout expects it (base/fixed with only text) */}
      {!dismissible && (variant === 'base' || variant === 'fixed') && <span className="w-9 h-9"/>}
    </>
  );

  return (
    <div 
        className={cn(
            barContainerClasses,
            isBgColorClass ? backgroundColor : 'bg-gray-100 dark:bg-gray-800' // Default bg if not a hex color
        )} 
        style={backgroundColor?.startsWith('#') ? {backgroundColor: backgroundColor} : {}}
    >
      {variant === 'floating' ? (
        <div 
            className={cn(
                contentDivClasses, 
                isBgColorClass ? backgroundColor : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
            )}
            style={backgroundColor?.startsWith('#') ? {backgroundColor: backgroundColor} : {}}
        >
          {announcementContent}
        </div>
      ) : (
        <div className={contentDivClasses}>
          {announcementContent}
        </div>
      )}
    </div>
  );
};

export default AnnouncementBar;
