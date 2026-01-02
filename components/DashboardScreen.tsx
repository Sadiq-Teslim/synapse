'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/utils/storageService';
import { ExerciseSession, UserProfile, DailyCheckIn, AffectedSide } from '@/types';
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
  UserCircleIcon,
  CalendarDaysIcon,
  TrophyIcon,
  BoltIcon,
  FaceSmileIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { Squares2X2Icon } from '@heroicons/react/24/solid';

interface DashboardScreenProps {
  userProfile?: UserProfile | null;
}

export default function DashboardScreen({ userProfile }: DashboardScreenProps) {
  const router = useRouter();
  const [sessions, setSessions] = useState<ExerciseSession[]>([]);
  const [todayCheckIn, setTodayCheckIn] = useState<DailyCheckIn | null>(null);

  useEffect(() => {
    loadSessions();
    loadTodayCheckIn();
  }, []);

  const loadSessions = () => {
    const loadedSessions = StorageService.getSessions();
    setSessions(loadedSessions);
  };

  const loadTodayCheckIn = () => {
    const checkIn = StorageService.getTodayCheckIn();
    setTodayCheckIn(checkIn);
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

  const handleResetApp = () => {
    if (confirm('This will clear all data including your profile. Are you sure?')) {
      StorageService.clearAllData();
      window.location.reload();
    }
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getDaysSinceStroke = () => {
    if (!userProfile?.strokeDate) return null;
    const strokeDate = new Date(userProfile.strokeDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - strokeDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getWeeklyProgress = () => {
    const weekSessions = StorageService.getThisWeekSessions();
    const goal = userProfile?.weeklySessionGoal || 5;
    return { completed: weekSessions.length, goal };
  };

  const getDailyProgress = () => {
    const todaySessions = StorageService.getTodaySessions();
    const totalMinutes = todaySessions.reduce((sum, s) => sum + s.durationSeconds, 0) / 60;
    const goal = userProfile?.dailyExerciseGoal || 15;
    return { completed: Math.round(totalMinutes), goal };
  };

  const totalReps = sessions.reduce((sum, session) => sum + session.repsCompleted, 0);
  const avgFormScore = sessions.length > 0
    ? sessions.reduce((sum, session) => {
        const score = session.overallForm === 'excellent' ? 100 : session.overallForm === 'good' ? 75 : 25;
        return sum + score;
      }, 0) / sessions.length
    : 0;
  const totalMinutes = sessions.reduce((sum, session) => sum + session.durationSeconds, 0) / 60;

  const weeklyProgress = getWeeklyProgress();
  const dailyProgress = getDailyProgress();
  const daysSinceStroke = getDaysSinceStroke();

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

  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];
  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];

  const getPersonalizedTips = () => {
    const tips = [];
    
    if (userProfile?.affectedSide === AffectedSide.LEFT) {
      tips.push({ 
        title: 'Focus on Left Side', 
        desc: 'Your exercises are optimized for left-side recovery. Take extra care with positioning.',
        icon: HeartIcon
      });
    } else if (userProfile?.affectedSide === AffectedSide.RIGHT) {
      tips.push({ 
        title: 'Focus on Right Side', 
        desc: 'Your exercises are optimized for right-side recovery. Take extra care with positioning.',
        icon: HeartIcon
      });
    }

    tips.push({ 
      title: 'Consistency', 
      desc: 'Practice daily for best results. Even 5-10 minutes helps rebuild neural pathways.',
      icon: SparklesIcon
    });

    tips.push({ 
      title: 'Rest & Recovery', 
      desc: 'Allow time for rest. Your brain heals during sleep.',
      icon: MoonIcon
    });

    return tips.slice(0, 3);
  };

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
                <button
                  onClick={handleResetApp}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Settings"
                >
                  <Cog6ToothIcon className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Personalized Welcome Section */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0078D4] to-[#5C2D91] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {userProfile?.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {getTimeGreeting()}, {userProfile?.firstName || 'there'}!
                </h2>
                <p className="text-gray-600">
                  {daysSinceStroke 
                    ? `Day ${daysSinceStroke} of your recovery journey` 
                    : 'Continue your recovery journey today'}
                </p>
              </div>
            </div>

            {/* Today's Check-in Status */}
            {todayCheckIn && (
              <div className="flex items-center gap-6 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <FaceSmileIcon className="w-5 h-5 text-[#0078D4]" />
                  <span className="text-sm text-gray-600">Mood:</span>
                  <span className="text-lg">{moodEmojis[todayCheckIn.mood - 1]}</span>
                  <span className="text-sm font-medium text-gray-700">{moodLabels[todayCheckIn.mood - 1]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <HeartIcon className="w-5 h-5 text-[#E74856]" />
                  <span className="text-sm text-gray-600">Pain:</span>
                  <span className="text-sm font-medium text-gray-700">{todayCheckIn.painLevel}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <BoltIcon className="w-5 h-5 text-[#FFB900]" />
                  <span className="text-sm text-gray-600">Energy:</span>
                  <span className="text-sm font-medium text-gray-700">{['Low', 'Low', 'Medium', 'High', 'High'][todayCheckIn.energyLevel - 1]}</span>
                </div>
              </div>
            )}
          </div>

          {/* Goals Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Daily Goal */}
            <div className="ms-card p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-[#0078D4]" />
                  <h3 className="font-semibold text-gray-900">Today&apos;s Goal</h3>
                </div>
                <span className="text-sm text-gray-500">{dailyProgress.completed}/{dailyProgress.goal} min</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-[#0078D4] to-[#00BCF2] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((dailyProgress.completed / dailyProgress.goal) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {dailyProgress.completed >= dailyProgress.goal 
                  ? '🎉 Daily goal achieved!' 
                  : `${dailyProgress.goal - dailyProgress.completed} minutes to go`}
              </p>
            </div>

            {/* Weekly Goal */}
            <div className="ms-card p-6 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrophyIcon className="w-5 h-5 text-[#FFB900]" />
                  <h3 className="font-semibold text-gray-900">Weekly Goal</h3>
                </div>
                <span className="text-sm text-gray-500">{weeklyProgress.completed}/{weeklyProgress.goal} sessions</span>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: weeklyProgress.goal }).map((_, i) => (
                  <div 
                    key={i}
                    className={`flex-1 h-3 rounded-full ${
                      i < weeklyProgress.completed 
                        ? 'bg-gradient-to-r from-[#FFB900] to-[#FF8C00]' 
                        : 'bg-gray-100'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {weeklyProgress.completed >= weeklyProgress.goal 
                  ? '🏆 Weekly goal achieved!' 
                  : `${weeklyProgress.goal - weeklyProgress.completed} sessions left this week`}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="ms-card p-5 animate-fade-in-up hover:scale-[1.02] transition-transform cursor-default"
                style={{ animationDelay: `${0.2 + index * 0.1}s`, opacity: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md`}>
                    <stat.icon className="w-5 h-5 text-white" />
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
                  {userProfile?.affectedSide 
                    ? `Continue building neural pathways for your ${userProfile.affectedSide} side recovery.`
                    : 'Continue building neural pathways with AI-guided shoulder exercises.'}
                </p>
                {userProfile?.recoveryGoals && userProfile.recoveryGoals.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {userProfile.recoveryGoals.slice(0, 3).map((goal) => (
                      <span key={goal} className="px-3 py-1 bg-[#0078D4]/10 text-[#0078D4] text-xs font-medium rounded-full">
                        {goal}
                      </span>
                    ))}
                  </div>
                )}
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

          {/* Personalized Tips Section */}
          <div className="ms-card p-6 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.7s' }}>
            <div className="flex items-center gap-2 mb-4">
              <LightBulbIcon className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg font-semibold text-gray-900">Recovery Tips for You</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getPersonalizedTips().map((tip) => (
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

          {/* User Profile Summary */}
          {userProfile && (
            <div className="ms-card p-6 mt-8 animate-fade-in-up" style={{ opacity: 0, animationDelay: '0.8s' }}>
              <div className="flex items-center gap-2 mb-4">
                <UserCircleIcon className="w-5 h-5 text-[#0078D4]" />
                <h3 className="text-lg font-semibold text-gray-900">Your Profile</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Affected Side</p>
                  <p className="font-medium text-gray-900 capitalize">{userProfile.affectedSide} Side</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Severity</p>
                  <p className="font-medium text-gray-900 capitalize">{userProfile.severity}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Daily Goal</p>
                  <p className="font-medium text-gray-900">{userProfile.dailyExerciseGoal} min</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 mb-1">Weekly Goal</p>
                  <p className="font-medium text-gray-900">{userProfile.weeklySessionGoal} sessions</p>
                </div>
              </div>
            </div>
          )}
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
