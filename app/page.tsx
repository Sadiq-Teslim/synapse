'use client';

import { useEffect, useState } from 'react';
import { StorageService } from '@/utils/storageService';
import { UserProfile } from '@/types';
import OnboardingScreen from '@/components/OnboardingScreen';
import DailyCheckInScreen from '@/components/DailyCheckIn';
import DashboardScreen from '@/components/DashboardScreen';
import { SparklesIcon } from '@heroicons/react/24/outline';

type AppState = 'loading' | 'onboarding' | 'checkin' | 'dashboard';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Check user status
    const profile = StorageService.getUserProfile();
    
    if (!profile) {
      // New user - show onboarding
      setAppState('onboarding');
    } else {
      setUserProfile(profile);
      
      // Check if user has done daily check-in
      const hasCheckedIn = StorageService.hasCheckedInToday();
      
      if (!hasCheckedIn) {
        // Show daily check-in
        setAppState('checkin');
      } else {
        // Go to dashboard
        setAppState('dashboard');
      }
    }
  }, []);

  const handleOnboardingComplete = () => {
    const profile = StorageService.getUserProfile();
    setUserProfile(profile);
    setAppState('checkin');
  };

  const handleCheckInComplete = () => {
    setAppState('dashboard');
  };

  // Loading state with nice animation
  if (appState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0078D4] via-[#5C2D91] to-[#00BCF2]">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-xl mb-4 animate-pulse">
            <SparklesIcon className="w-10 h-10 text-white" />
          </div>
          <p className="text-white/80 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Onboarding flow
  if (appState === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // Daily check-in
  if (appState === 'checkin' && userProfile) {
    return (
      <DailyCheckInScreen 
        userName={userProfile.firstName} 
        onComplete={handleCheckInComplete} 
      />
    );
  }

  // Dashboard (main app)
  return <DashboardScreen userProfile={userProfile} />;
}
