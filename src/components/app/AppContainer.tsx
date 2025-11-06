'use client';

import { useState } from 'react';
import type { Project, ProjectCategory } from '@/lib/types';
import { AppHeader } from './AppHeader';
import { LandingPage } from './LandingPage';
import { CategoryStep } from './CategoryStep';
import { IdeationStep } from './IdeationStep';
import { OutlineStep } from './OutlineStep';
import type { GenerateBookIdeasOutput } from '@/ai/flows/generate-book-ideas';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';

export type AppStep = 'landing' | 'category' | 'ideation' | 'style' | 'outline' | 'chapter' | 'export' | 'login' | 'register';

export function AppContainer() {
  const [step, setStep] = useState<AppStep>('landing');
  const [project, setProject] = useState<Project>({
    projectTitle: 'Kecerdasan Buatan dalam Pendidikan Islam',
    audience: 'Mahasiswa S1, Dosen, Peneliti Pendidikan',
    goal: 'Menjadi referensi utama tentang penerapan AI di lembaga pendidikan Islam',
    language: 'id',
    writingStyle: 'akademik ketat',
    tone: 'formal',
  });
  const [usageCount, setUsageCount] = useState(0);

  const handleStart = () => {
    if (usageCount > 0) {
      setStep('register');
    } else {
      setStep('category');
    }
  };

  const handleCategorySelect = (category: ProjectCategory) => {
    setProject((p) => ({ ...p, category }));
    setUsageCount(prev => prev + 1);
    setStep('ideation');
  };
  
  const handleIdeationComplete = (ideas: GenerateBookIdeasOutput['ideas'], chosenIdea: GenerateBookIdeasOutput['ideas'][0]) => {
    setProject(p => ({ ...p, ideas, chosenIdea }));
    setStep('outline');
  };

  const handleBack = () => {
    if (step === 'ideation') setStep('category');
    if (step === 'category') setStep('landing');
    if (step === 'outline') setStep('ideation');
    if (step === 'login' || step === 'register') setStep('landing');
  }

  const renderStep = () => {
    switch (step) {
      case 'landing':
        return <LandingPage onStart={handleStart} onLogin={() => setStep('login')} onRegister={() => setStep('register')} />;
      case 'category':
        return <CategoryStep onSelect={handleCategorySelect} onBack={handleBack}/>;
      case 'ideation':
        return <IdeationStep project={project} onComplete={handleIdeationComplete} onBack={handleBack} />;
      case 'outline':
        return <OutlineStep project={project} onBack={handleBack} />;
      case 'login':
        return <Login onBack={handleBack} />;
      case 'register':
        return <Register onBack={handleBack} />;
      default:
        return <LandingPage onStart={handleStart} onLogin={() => setStep('login')} onRegister={() => setStep('register')} />;
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {(step !== 'landing' && step !== 'login' && step !== 'register') && <AppHeader step={step} />}
      <main className="flex-1 flex flex-col">{renderStep()}</main>
    </div>
  );
}
