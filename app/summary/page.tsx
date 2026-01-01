'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StorageService } from '@/utils/storageService';
import { ExerciseSession } from '@/types';
import {
  CheckCircleIcon,
  PlayIcon,
  HomeIcon,
  TrophyIcon,
  HandThumbUpIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';
import { Squares2X2Icon } from '@heroicons/react/24/solid';

export default function SummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('id');
  const [session, setSession] = useState<ExerciseSession | null>(null);

  useEffect(() => {
    if (sessionId) {
      const sessions = StorageService.getSessions();
      const foundSession = sessions.find((s) => s.id === sessionId);
      if (foundSession) {
        setSession(foundSession);
      }
    }
  }, [sessionId]);

  const handleBackToDashboard = () => {
    router.push('/');
  };

  const handleStartNewSession = () => {
    router.push('/exercise');
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="w-12 h-12 border-4 border-[#0078D4]/20 border-t-[#0078D4] rounded-full animate-spin" />
      </div>
    );
  }

  const formConfig = {
    excellent: {
      Icon: TrophyIcon,
      title: 'Outstanding!',
      subtitle: 'You nailed it!',
      color: 'from-green-500 to-emerald-600',
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
    },
    good: {
      Icon: HandThumbUpIcon,
      title: 'Great Work!',
      subtitle: 'Keep it up!',
      color: 'from-amber-500 to-orange-600',
      bg: 'from-amber-50 to-orange-50',
      border: 'border-amber-200',
    },
    poor: {
      Icon: ArrowTrendingUpIcon,
      title: 'Good Effort!',
      subtitle: 'Room to improve',
      color: 'from-blue-500 to-indigo-600',
      bg: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
    },
  };

  const config = formConfig[session.overallForm] || formConfig.good;

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {/* Success Animation */}
          <div className="text-center mb-8 animate-scale-in">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-2xl mb-6 animate-bounce" style={{ animationDuration: '2s' }}>
              <CheckCircleIcon className="w-16 h-16" />
            </div>
          </div>

          {/* Main Card */}
          <div className="ms-card-elevated overflow-hidden animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
            {/* Header */}
            <div className={`bg-gradient-to-r ${config.color} px-8 py-8 text-center text-white`}>
              <config.Icon className="w-12 h-12 mx-auto mb-3" />
              <h1 className="text-3xl font-bold mb-1">{config.title}</h1>
              <p className="text-white/80 text-lg">{config.subtitle}</p>
            </div>

            {/* Stats Grid */}
            <div className="p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className={`p-5 rounded-xl bg-gradient-to-br ${config.bg} ${config.border} border`}>
                  <p className="text-sm text-gray-500 mb-1">Reps Completed</p>
                  <p className="text-3xl font-bold text-gray-900">{session.repsCompleted}</p>
                </div>
                <div className={`p-5 rounded-xl bg-gradient-to-br ${config.bg} ${config.border} border`}>
                  <p className="text-sm text-gray-500 mb-1">Max Angle</p>
                  <p className="text-3xl font-bold text-gray-900">{session.maxAngle.toFixed(0)}°</p>
                </div>
                <div className={`p-5 rounded-xl bg-gradient-to-br ${config.bg} ${config.border} border`}>
                  <p className="text-sm text-gray-500 mb-1">Duration</p>
                  <p className="text-3xl font-bold text-gray-900">{session.durationSeconds}s</p>
                </div>
                <div className={`p-5 rounded-xl bg-gradient-to-br ${config.bg} ${config.border} border`}>
                  <p className="text-sm text-gray-500 mb-1">Avg Angle</p>
                  <p className="text-3xl font-bold text-gray-900">{session.averageAngle.toFixed(0)}°</p>
                </div>
              </div>

              {/* Form Quality */}
              <div className={`p-5 rounded-xl bg-gradient-to-br ${config.bg} ${config.border} border mb-8 text-center`}>
                <p className="text-sm text-gray-500 mb-2">Form Quality</p>
                <p className={`text-2xl font-bold capitalize bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                  {session.overallForm}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleStartNewSession}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#0078D4] to-[#00BCF2] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-100 flex items-center justify-center gap-2"
                >
                  <PlayIcon className="w-5 h-5" />
                  Start Another Session
                </button>
                <button
                  onClick={handleBackToDashboard}
                  className="w-full py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <HomeIcon className="w-5 h-5" />
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>

          {/* Microsoft Badge */}
          <div className="text-center mt-8 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200">
              <Squares2X2Icon className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
