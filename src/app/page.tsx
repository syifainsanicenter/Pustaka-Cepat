
'use client';
import { AppContainer } from '@/components/app/AppContainer';
import { useState } from 'react';

export default function Home() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return <AppContainer />;
  }
  // This will be replaced by the real landing page later
  return <AppContainer />;
}
