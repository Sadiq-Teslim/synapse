'use client';

import { StorageService } from '@/utils/storageService';
import { SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { Squares2X2Icon } from '@heroicons/react/24/solid';

interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const handleGetStarted = () => {
    StorageService.setFirstLaunchCompleted();
    onComplete();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background - solid blue branding */}
      <div className="absolute inset-0 bg-[#0078D4]" />
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Logo/Icon */}
          <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl mb-6">
              <SparklesIcon className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
            Synapse AI
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-4 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
            Your brain has an incredible ability to heal.
          </p>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-8 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
            Let&apos;s unlock it together.
          </p>

          {/* Description */}
          <p className="text-lg text-white/70 mb-12 max-w-lg mx-auto animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
            AI-powered stroke rehabilitation with real-time pose detection. 
            Get personalized feedback and track your recovery journey.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
            <button
              onClick={handleGetStarted}
              className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-semibold text-[#0078D4] bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-100"
            >
              <span>Start Your Recovery Journey</span>
              <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Microsoft Imagine Cup Badge */}
          <div className="mt-16 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Squares2X2Icon className="w-5 h-5 text-white/80" />
              <span className="text-sm text-white/80 font-medium">Microsoft Imagine Cup 2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
