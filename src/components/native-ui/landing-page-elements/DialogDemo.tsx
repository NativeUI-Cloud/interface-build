"use client";


import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";


export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demo Dialog</DialogTitle>
          <DialogDescription>Dialog content goes here.</DialogDescription>
        </DialogHeader>

      </DialogContent>
    </Dialog>
  );
}
