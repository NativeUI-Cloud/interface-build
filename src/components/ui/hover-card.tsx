"use client"

import * as React from "react"
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

import { cn } from "@/lib/utils"

const HoverCard = HoverCardPrimitive.Root
const HoverCardTrigger = HoverCardPrimitive.Trigger
const HoverCardPortal = HoverCardPrimitive.Portal

const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    className={cn(
      "z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

export {
  HoverCard,
  HoverCardTrigger,
  HoverCardPortal,
  HoverCardContent
}
