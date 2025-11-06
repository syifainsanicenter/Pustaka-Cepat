import { BookHeart, ChevronDown, LogOut, UserCircle, Shield } from 'lucide-react';
import type { AppStep } from './AppContainer';
import { cn } from '@/lib/utils';
import { useAuth, useUser } from '@/firebase';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AppHeaderProps {
  step: AppStep;
  onLogout: () => void;
  onGoToAdmin?: () => void;
  isAdmin?: boolean;
}

const steps = [
  { id: 'category', name: 'Kategori' },
  { id: 'ideation', name: 'Ide' },
  { id: 'style', name: 'Gaya' },
  { id: 'outline', name: 'Outline' },
  { id: 'chapter', name: 'Bab' },
  { id: 'export', name: 'Ekspor' },
];

function UserMenu({ onLogout, onGoToAdmin, isAdmin }: { onLogout: () => void; onGoToAdmin?: () => void; isAdmin?: boolean; }) {
  const { user } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      onLogout();
    }
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">{user.displayName || user.email}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isAdmin && (
          <>
            <DropdownMenuItem onClick={onGoToAdmin}>
              <Shield className="mr-2 h-4 w-4" />
              Panel Admin
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function AppHeader({ step, onLogout, onGoToAdmin, isAdmin }: AppHeaderProps) {
  const currentStepIndex = steps.findIndex(s => s.id === step);

  // Don't show the progress header on the admin page
  if (step === 'admin') {
    return (
     <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <BookHeart className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Pustaka Cepat</h1>
        </div>
        <UserMenu onLogout={onLogout} onGoToAdmin={onGoToAdmin} isAdmin={isAdmin} />
      </div>
    </header>
    )
  }

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
        <UserMenu onLogout={onLogout} onGoToAdmin={onGoToAdmin} isAdmin={isAdmin} />
      </div>
    </header>
  );
}
