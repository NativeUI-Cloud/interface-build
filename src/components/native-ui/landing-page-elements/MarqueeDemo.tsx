
"use client";

import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import Image from "next/image";
import { v4 as uuidv4 } from 'uuid'; // Import uuid

// Interface for a single review, now with an ID
export interface Review {
  id: string; // Unique ID for each review
  name: string;
  username: string;
  body: string;
  img: string;
  cardBackgroundColor?: string;
  cardTextColor?: string;
}

// Default reviews with unique IDs
export const defaultReviews: Review[] = [
  {
    id: uuidv4(),
    name: "Jack",
    username: "@jack",
    body: "I've never seen anything like this before. It's amazing. I love it.",
    img: "https://avatar.vercel.sh/jack",
  },
  {
    id: uuidv4(),
    name: "Jill",
    username: "@jill",
    body: "I don't know what to say. I'm speechless. This is amazing.",
    img: "https://avatar.vercel.sh/jill",
  },
  {
    id: uuidv4(),
    name: "John",
    username: "@john",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/john",
  },
  {
    id: uuidv4(),
    name: "Jane",
    username: "@jane",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jane",
  },
  {
    id: uuidv4(),
    name: "Jenny",
    username: "@jenny",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/jenny",
  },
  {
    id: uuidv4(),
    name: "James",
    username: "@james",
    body: "I'm at a loss for words. This is amazing. I love it.",
    img: "https://avatar.vercel.sh/james",
  },
];

const ReviewCard = ({
  img,
  name,
  username,
  body,
  cardBackgroundColor,
  cardTextColor,
}: Review) => {
  const cardStyle: React.CSSProperties = {};
  if (cardBackgroundColor) {
    cardStyle.backgroundColor = cardBackgroundColor;
  }
  if (cardTextColor) {
    cardStyle.color = cardTextColor;
  }

  return (
    <figure
      className={cn(
        "relative h-full cursor-pointer overflow-hidden rounded-xl border p-4",
        "w-full max-w-[200px] sm:max-w-[220px] md:max-w-xs lg:w-64",
        !cardBackgroundColor && "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        !cardBackgroundColor && "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
      style={cardStyle}
    >
      <div className="flex flex-row items-center gap-2">
        <Image className="rounded-full" width="32" height="32" alt={`Avatar of ${name}`} src={img} data-ai-hint="user avatar" />
        <div className="flex flex-col">
          <figcaption className={cn("text-sm font-medium", cardTextColor ? '' : 'dark:text-white text-foreground')}>
            {name}
          </figcaption>
          <p className={cn("text-xs font-medium", cardTextColor ? 'opacity-70' : 'dark:text-white/40 text-muted-foreground')}>{username}</p>
        </div>
      </div>
      <blockquote className={cn("mt-2 text-sm", cardTextColor ? '' : 'text-foreground/80 dark:text-white/80')}>{body}</blockquote>
    </figure>
  );
};

interface MarqueeDemoProps {
  reviews: Review[]; // Changed to non-optional
}

export default function MarqueeDemo({ reviews }: MarqueeDemoProps) {
  if (!reviews || reviews.length === 0) {
    return <div className="p-4 text-center text-muted-foreground">Marquee requires review data. Add some reviews!</div>;
  }

  const firstRow = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondRow = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden py-4 bg-background">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.id} {...review} />
        ))}
      </Marquee>
      {secondRow.length > 0 && (
        <Marquee reverse pauseOnHover className="[--duration:20s] mt-4">
          {secondRow.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </Marquee>
      )}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}
