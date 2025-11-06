'use client';

import { useState } from 'react';
import type { Project, ProjectCategory } from '@/lib/types';
import { AppHeader } from './AppHeader';
import { LandingPage } from './LandingPage';
import { CategoryStep } from './CategoryStep';
import { IdeationStep } from './IdeationStep';
import { OutlineStep } from './OutlineStep';
import type { GenerateBookIdeasOutput } from '@/ai/flows/generate-book-ideas';
import type { CreateStructuredOutlineOutput } from '@/ai/flows/create-structured-outline';
import { Login } from '@/components/auth/Login';
import { Register } from '@/components/auth/Register';
import { StyleStep } from './StyleStep';

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

  const handleRegisterSuccess = () => {
    // For now, just reset usage and go to category.
    // In a real app, this would involve user authentication.
    setUsageCount(0);
    setStep('category');
  };

  const handleCategorySelect = (category: ProjectCategory) => {
    setProject((p) => ({ ...p, category }));
    setUsageCount(prev => prev + 1);
    setStep('ideation');
  };
  
  const handleIdeationComplete = (ideas: GenerateBookIdeasOutput['ideas'], chosenIdea: GenerateBookIdeasOutput['ideas'][0]) => {
    setProject(p => ({ ...p, ideas, chosenIdea }));
    setStep('style');
  };
  
  const handleStyleComplete = (style: { writingStyle: string; tone: string; language: 'id' | 'en' | 'ar' | 'su' | 'jv' | 'zh' }) => {
    setProject(p => ({ ...p, ...style }));
    setStep('outline');
  };
  
  const handleOutlineComplete = (outline: CreateStructuredOutlineOutput) => {
    setProject(p => ({ ...p, outline }));
    setStep('chapter');
  };

  const handleBack = () => {
    if (step === 'ideation') setStep('category');
    if (step === 'category') setStep('landing');
    if (step === 'style') setStep('ideation');
    if (step === 'outline') setStep('style');
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
      case 'style':
        return <StyleStep project={project} onBack={handleBack} onComplete={handleStyleComplete} />;
      case 'outline':
        return <OutlineStep project={project} onBack={handleBack} onComplete={handleOutlineComplete} />;
      case 'login':
        return <Login onBack={handleBack} onSwitchToRegister={() => setStep('register')} />;
      case 'register':
        return <Register onBack={handleBack} onSwitchToLogin={() => setStep('login')} onRegisterSuccess={handleRegisterSuccess} />;
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
