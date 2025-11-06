import { BookHeart } from 'lucide-react';
import type { AppStep } from './AppContainer';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  step: AppStep;
}

const steps = [
  { id: 'category', name: 'Kategori' },
  { id: 'ideation', name: 'Ide' },
  { id: 'style', name: 'Gaya' },
  { id: 'outline', name: 'Outline' },
  { id: 'chapter', name: 'Bab' },
  { id: 'export', name: 'Ekspor' },
];

export function AppHeader({ step }: AppHeaderProps) {
  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <BookHeart className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Pustaka Cepat</h1>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center gap-2">
              <span className={cn(
                'transition-colors',
                index <= currentStepIndex ? 'text-primary font-medium' : ''
              )}>
                {s.name}
              </span>
              {index < steps.length - 1 && <span className="text-gray-300">/</span>}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
