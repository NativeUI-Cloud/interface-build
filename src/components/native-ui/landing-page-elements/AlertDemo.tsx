"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function AlertDemo() {
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        This is a demo alert from shadcn/ui. You can add more details here.
      </AlertDescription>
    </Alert>
  );
}
