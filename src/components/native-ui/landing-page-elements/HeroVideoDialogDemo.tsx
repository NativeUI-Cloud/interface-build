
'use client';

import HeroVideoDialog from "@/components/magicui/hero-video-dialog"; // Assumes user has run npx shadcn add for this

export function HeroVideoDialogDemo() {
  return (
    <div className="relative w-full max-w-md mx-auto my-4"> {/* Added some constraints for demo */}
      <HeroVideoDialog
        className="block dark:hidden"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
        thumbnailAlt="Hero Video Light"
        data-ai-hint="product video light"
      />
      <HeroVideoDialog
        className="hidden dark:block"
        animationStyle="from-center"
        videoSrc="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
        thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
        thumbnailAlt="Hero Video Dark"
        data-ai-hint="product video dark"
      />
    </div>
  );
}

export default HeroVideoDialogDemo;
