'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/utils/storageService';
import { ExerciseSession } from '@/types';
import ProgressChart from './ProgressChart';
import {
  ChartBarIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  PlayIcon,
  ArrowPathIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
  LightBulbIcon,
  SparklesIcon,
  HeartIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { Squares2X2Icon } from '@heroicons/react/24/solid';

export default function DashboardScreen() {
  const router = useRouter();
  const [sessions, setSessions] = useState<ExerciseSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const loadedSessions = StorageService.getSessions();
    setSessions(loadedSessions);
  };

  const handleStartExercise = () => {
    router.push('/exercise');
  };

  const handleClearSessions = () => {
    if (confirm('Are you sure you want to clear all sessions?')) {
      StorageService.clearAllSessions();
      loadSessions();
    }
  };

  const totalReps = sessions.reduce((sum, session) => sum + session.repsCompleted, 0);
  const avgFormScore = sessions.length > 0
    ? sessions.reduce((sum, session) => {
        const score = session.overallForm === 'excellent' ? 100 : session.overallForm === 'good' ? 75 : 25;
        return sum + score;
      }, 0) / sessions.length
    : 0;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.durationSeconds, 0) / 60;

  const stats = [
    { 
      label: 'Total Sessions', 
      value: sessions.length, 
      icon: ChartBarIcon, 
      color: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-500'
    },
    { 
      label: 'Total Reps', 
      value: totalReps, 
      icon: FireIcon, 
      color: 'from-green-500 to-emerald-600',
      iconBg: 'bg-green-500'
    },
    { 
      label: 'Avg Form Score', 
      value: `${avgFormScore.toFixed(0)}%`, 
      icon: StarIcon, 
      color: 'from-amber-500 to-orange-600',
      iconBg: 'bg-amber-500'
    },
    { 
      label: 'Total Time', 
      value: `${totalMinutes.toFixed(0)}m`, 
      icon: ClockIcon, 
      color: 'from-purple-500 to-violet-600',
      iconBg: 'bg-purple-500'
    },
  ];

  const tips = [
    { 
      title: 'Consistency', 
      desc: 'Practice daily for best results. Even 5-10 minutes helps.',
      icon: SparklesIcon
    },
    { 
      title: 'Proper Form', 
      desc: 'Focus on quality over quantity. Good form builds better habits.',
      icon: HeartIcon
    },
    { 
      title: 'Rest & Recovery', 
      desc: 'Allow time for rest. Your brain heals during sleep.',
      icon: MoonIcon
    },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 acrylic border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0078D4] to-[#00BCF2] flex items-center justify-center shadow-lg">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Synapse AI</h1>
                  <p className="text-xs text-gray-500">Recovery Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={loadSessions}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <ArrowPathIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
            <p className="text-gray-600">Track your progress and continue your recovery journey.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="ms-card p-6 animate-fade-in-up hover:scale-[1.02] transition-transform cursor-default"
                style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Action Card */}
          <div className="ms-card-elevated p-8 mb-8 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready for your next session?</h3>
                <p className="text-gray-600 max-w-md">
                  Continue building neural pathways with AI-guided shoulder exercises.
                </p>
              </div>
              <button
                onClick={handleStartExercise}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#0078D4] to-[#00BCF2] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-100"
              >
                <PlayIcon className="w-6 h-6" />
                <span>Start Exercise</span>
              </button>
            </div>
          </div>

          {/* Charts and History Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Progress Chart */}
            <div className="ms-card p-6 animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
                <span className="text-sm text-gray-500">{sessions.length} sessions</span>
              </div>
              <div className="h-64">
                <ProgressChart sessions={sessions} />
              </div>
            </div>

            {/* Recent Sessions */}
            <div className="ms-card p-6 animate-fade-in-up stagger-5" style={{ opacity: 0, animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Sessions</h3>
                {sessions.length > 0 && (
                  <button
                    onClick={handleClearSessions}
                    className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors inline-flex items-center gap-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
              
              {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ClipboardDocumentListIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No sessions yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start your first exercise to see your progress!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {[...sessions].reverse().slice(0, 5).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                          session.overallForm === 'excellent'
                            ? 'bg-gradient-to-br from-green-400 to-green-600'
                            : session.overallForm === 'good'
                            ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                            : 'bg-gradient-to-br from-red-400 to-red-600'
                        }`}>
                          {session.repsCompleted}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {new Date(session.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {session.repsCompleted} reps • {session.maxAngle.toFixed(0)}° max
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        session.overallForm === 'excellent'
                          ? 'bg-green-100 text-green-700'
                          : session.overallForm === 'good'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {session.overallForm}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tips Section */}
          <div className="ms-card p-6 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.7s' }}>
            <div className="flex items-center gap-2 mb-4">
              <LightBulbIcon className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">Recovery Tips</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tips.map((tip) => (
                <div key={tip.title} className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <tip.icon className="w-5 h-5 text-blue-600" />
                    <h4 className="font-semibold text-gray-900">{tip.title}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Squares2X2Icon className="w-4 h-4" />
            <span>Built for Microsoft Imagine Cup 2025</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
