'use client';

import { useState } from 'react';
import type { Project, ProjectCategory } from '@/lib/types';
import { AppHeader } from './AppHeader';
import { LandingPage } from './LandingPage';
import { CategoryStep } from './CategoryStep';
import { IdeationStep } from './IdeationStep';
import type { GenerateBookIdeasOutput } from '@/ai/flows/generate-book-ideas';
import type { CreateStructuredOutlineOutput } from '@/ai/flows/create-structured-outline';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { StyleStep } from './StyleStep';
import { ChapterStep, type ChapterContent } from './ChapterStep';
import { ExportStep } from './ExportStep';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export type AppStep = 'landing' | 'category' | 'ideation' | 'style' | 'outline' | 'chapter' | 'export' | 'login' | 'register';

function AppContent() {
  const { user, loading } = useUser();
  const [step, setStep] = useState<AppStep>('landing');
  const [project, setProject] = useState<Project>({
    projectTitle: 'Kecerdasan Buatan dalam Pendidikan Islam',
    audience: 'Mahasiswa S1',
    goal: 'Menjadi referensi utama tentang penerapan AI di lembaga pendidikan Islam',
    language: 'id',
    writingStyle: 'akademik ketat',
    tone: 'formal',
    chaptersCount: 10,
  });
  const [usageCount, setUsageCount] = useState(0);
  const [chapterContent, setChapterContent] = useState<ChapterContent>({});

  const handleStart = () => {
    // For a logged-in user with a 'free' plan, check usage.
    // In a real app, this usageCount would be stored in the database.
    if (user && user.plan === 'free' && usageCount > 0) {
      // Here you could show a "Upgrade your plan" modal.
      // For now, we'll just block them after one use.
       alert('Anda telah menggunakan jatah gratis Anda. Silakan upgrade paket Anda untuk melanjutkan.');
       return;
    }

    if (!user && usageCount > 0) {
      setStep('register');
    } else {
      setStep('category');
    }
  };

  const handleLoginSuccess = () => {
    setUsageCount(0); // Reset local usage count on login
    setStep('category');
  };
  

  const handleRegisterSuccess = () => {
    setUsageCount(0);
    setStep('category');
  };

  const handleLogout = () => {
    setStep('landing');
  };

  const handleCategorySelect = (category: ProjectCategory) => {
    setProject((p) => ({ ...p, category }));
    if (!user) {
        setUsageCount(prev => prev + 1);
    }
    setStep('ideation');
  };
  
  const handleIdeationComplete = (ideas: GenerateBookIdeasOutput['ideas'], chosenIdea: GenerateBookIdeasOutput['ideas'][0], language: Project['language']) => {
    setProject(p => ({ ...p, ideas, chosenIdea, language }));
    setStep('style');
  };
  
  const handleStyleComplete = (style: { writingStyle: string; tone: string; chaptersCount: number; }) => {
    setProject(p => ({ ...p, ...style }));
    setStep('outline');
  };
  
  const handleOutlineComplete = (outline: CreateStructuredOutlineOutput) => {
    setProject(p => ({ ...p, outline }));
    setStep('chapter');
  };

  const handleChapterComplete = (content: ChapterContent) => {
    setChapterContent(content);
    setStep('export');
  }

  const handleBack = () => {
    if (step === 'ideation') setStep('category');
    if (step === 'category') setStep('landing');
    if (step === 'style') setStep('ideation');
    if (step === 'outline') setStep('style');
    if (step === 'chapter') setStep('outline');
    if (step === 'export') setStep('chapter');
    if (step === 'login' || step === 'register') setStep('landing');
  }

  const renderStep = () => {
    // If loading, show a loading screen
    if (loading) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Memuat sesi Anda...</p>
        </div>
      );
    }

    switch (step) {
      case 'landing':
        return <LandingPage onStart={handleStart} onLogin={() => setStep('login')} onRegister={() => setStep('register')} />;
      case 'category':
        return <CategoryStep onSelect={handleCategorySelect} onBack={handleBack}/>;
      case 'ideation':
        return <IdeationStep project={project} onComplete={handleIdeationComplete} onBack={handleBack} />;
      case 'style':
        return <StyleStep project={project} onBack={handleBack} onComplete={handleStyleComplete} />;
      case 'outline':
        return <OutlineStep project={project} onBack={handleBack} onComplete={handleOutlineComplete} />;
      case 'chapter':
        return <ChapterStep project={project} onBack={handleBack} onComplete={handleChapterComplete} initialContent={chapterContent}/>;
      case 'export':
        return <ExportStep project={project} chapterContent={chapterContent} onBack={handleBack} />;
      case 'login':
        return <Login onBack={handleBack} onSwitchToRegister={() => setStep('register')} onLoginSuccess={handleLoginSuccess} />;
      case 'register':
        return <Register onBack={handleBack} onSwitchToLogin={() => setStep('login')} onRegisterSuccess={handleRegisterSuccess} />;
      default:
        return <LandingPage onStart={handleStart} onLogin={() => setStep('login')} onRegister={() => setStep('register')} />;
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {(step !== 'landing' && step !== 'login' && step !== 'register') && <AppHeader step={step} onLogout={handleLogout} />}
      <main className="flex-1 flex flex-col">{renderStep()}</main>
    </div>
  );
}


export function AppContainer() {
  return (
    <FirebaseClientProvider>
      <AppContent />
    </FirebaseClientProvider>
  )
}
