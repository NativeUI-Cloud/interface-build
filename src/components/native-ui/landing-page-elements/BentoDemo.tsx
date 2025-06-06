
'use client';

import React from "react";
import { FileText, CalendarDays, BellIcon, Share2Icon } from "lucide-react"; // Using Lucide icons

import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid"; // Assuming this path after npx add
import { Marquee } from "@/components/magicui/marquee"; // Assuming this path
import AnimatedBeamMultipleOutputDemo from "@/components/native-ui/landing-page-elements/AnimatedBeamMultipleOutputDemo"; // Adjusted path
import AnimatedListDemo from "@/components/native-ui/landing-page-elements/AnimatedListDemo"; // Adjusted path
import { v4 as uuidv4 } from 'uuid';
import type { BentoFeature } from '@/lib/types';


const files = [
  {
    id: uuidv4(),
    name: "bitcoin.pdf",
    body: "Bitcoin is a cryptocurrency invented in 2008 by an unknown person or group of people using the name Satoshi Nakamoto.",
  },
  {
    id: uuidv4(),
    name: "finances.xlsx",
    body: "A spreadsheet or worksheet is a file made of rows and columns that help sort data, arrange data easily, and calculate numerical data.",
  },
  {
    id: uuidv4(),
    name: "logo.svg",
    body: "Scalable Vector Graphics is an Extensible Markup Language-based vector image format for two-dimensional graphics with support for interactivity and animation.",
  },
  {
    id: uuidv4(),
    name: "keys.gpg",
    body: "GPG keys are used to encrypt and decrypt email, files, directories, and whole disk partitions and to authenticate messages.",
  },
  {
    id: uuidv4(),
    name: "seed.txt",
    body: "A seed phrase, seed recovery phrase or backup seed phrase is a list of words which store all the information needed to recover Bitcoin funds on-chain.",
  },
];

export const defaultBentoFeatures: BentoFeature[] = [
  {
    id: uuidv4(),
    Icon: FileText,
    name: "Save your files",
    description: "We automatically save your files as you type.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] "
      >
        {files.map((f) => (
          <figure
            key={f.id} // Changed from idx to f.id
            className={cn(
              "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none",
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="text-sm font-medium dark:text-white ">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-xs">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
  {
    id: uuidv4(),
    Icon: BellIcon,
    name: "Notifications",
    description: "Get notified when something happens.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedListDemo className="absolute right-2 top-4 h-[300px] w-full scale-75 border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90" />
    ),
  },
  {
    id: uuidv4(),
    Icon: Share2Icon,
    name: "Integrations",
    description: "Supports 100+ integrations and counting.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedBeamMultipleOutputDemo className="absolute right-2 top-4 h-[300px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105" />
    ),
  },
  {
    id: uuidv4(),
    Icon: CalendarDays,
    name: "Calendar",
    description: "Use the calendar to filter your files by date.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <Calendar
        mode="single"
        selected={new Date(2022, 4, 11, 0, 0, 0)}
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] group-hover:scale-90"
      />
    ),
  },
];

interface BentoDemoProps {
  features?: BentoFeature[];
}

export function BentoDemo({ features = defaultBentoFeatures }: BentoDemoProps) {
  return (
    <BentoGrid>
      {features.map((feature) => (
        <BentoCard key={feature.id} {...feature} />
      ))}
    </BentoGrid>
  );
}

export default BentoDemo;

