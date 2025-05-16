import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ComponentCardProps {
  name: string;
  icon: LucideIcon;
  description: string;
}

export default function ComponentCard({ name, icon: Icon, description }: ComponentCardProps) {
  return (
    <Card className="cursor-grab transition-all hover:shadow-md active:cursor-grabbing active:shadow-lg">
      <CardContent className="flex flex-col items-center justify-center p-4 text-center space-y-2">
        <Icon className="h-8 w-8 text-accent mb-1" />
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
