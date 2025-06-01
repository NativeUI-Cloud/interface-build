"use client"

import * as React from "react"
import useEmblaCarousel, { EmblaOptionsType } from "embla-carousel-react"

import { cn } from "@/lib/utils"

export type CarouselProps = React.HTMLAttributes<HTMLDivElement> & {
  opts?: EmblaOptionsType
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ className, opts, children, ...props }, ref) => {
    const [emblaRef] = useEmblaCarousel(opts)
    return (
      <div ref={ref} className={cn("relative", className)} {...props}>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {children}
          </div>
        </div>
      </div>
    )
  }
)
Carousel.displayName = "Carousel"

export type CarouselItemProps = React.HTMLAttributes<HTMLDivElement>

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
      {...props}
    />
  )
)
CarouselItem.displayName = "CarouselItem"

export { Carousel, CarouselItem }
