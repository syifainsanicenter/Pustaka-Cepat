'use client';

import { useState } from 'react';
import type { Project, ProjectCategory } from '@/lib/types';
import { AppHeader } from './AppHeader';
import { LandingPage } from './LandingPage';
import { CategoryStep } from './CategoryStep';
import { IdeationStep } from './IdeationStep';
import { OutlineStep } from './OutlineStep';
import type { GenerateBookIdeasOutput } from '@/ai/flows/generate-book-ideas';

export type AppStep = 'landing' | 'category' | 'ideation' | 'style' | 'outline' | 'chapter' | 'export';

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

  const handleStart = () => {
    setStep('category');
  };

  const handleCategorySelect = (category: ProjectCategory) => {
    setProject((p) => ({ ...p, category }));
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
  }

  const renderStep = () => {
    switch (step) {
      case 'landing':
        return <LandingPage onStart={handleStart} />;
      case 'category':
        return <CategoryStep onSelect={handleCategorySelect} onBack={handleBack}/>;
      case 'ideation':
        return <IdeationStep project={project} onComplete={handleIdeationComplete} onBack={handleBack} />;
      case 'outline':
        return <OutlineStep project={project} onBack={handleBack} />;
      default:
        return <LandingPage onStart={handleStart} />;
    }
  };

  return (
    <div className="flex flex-col flex-1">
      {step !== 'landing' && <AppHeader step={step} />}
      <main className="flex-1 flex flex-col">{renderStep()}</main>
    </div>
  );
}
