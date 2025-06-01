"use client";


import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TabsDemo() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p>First tab content.</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p>Second tab content.</p>
      </TabsContent>
    </Tabs>
  );
}
