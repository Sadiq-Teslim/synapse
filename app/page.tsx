'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/utils/storageService';
import WelcomeScreen from '@/components/WelcomeScreen';
import DashboardScreen from '@/components/DashboardScreen';

export default function Home() {
  const router = useRouter();
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const firstLaunch = StorageService.isFirstLaunch();
    setIsFirstLaunch(firstLaunch);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (isFirstLaunch) {
    return <WelcomeScreen onComplete={() => setIsFirstLaunch(false)} />;
  }

  return <DashboardScreen />;
}

