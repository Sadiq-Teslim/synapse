'use client';

import { useState } from 'react';
import { StorageService } from '@/utils/storageService';
import { 
  UserProfile, 
  StrokeType, 
  AffectedSide, 
  SeverityLevel, 
  MobilityLevel 
} from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
  UserIcon,
  HeartIcon,
  SparklesIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  HandRaisedIcon,
} from '@heroicons/react/24/outline';
import { Squares2X2Icon } from '@heroicons/react/24/solid';

interface OnboardingScreenProps {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'personal' | 'stroke' | 'mobility' | 'goals' | 'complete';

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  
  // Form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [strokeType, setStrokeType] = useState<StrokeType>(StrokeType.UNKNOWN);
  const [strokeDate, setStrokeDate] = useState('');
  const [affectedSide, setAffectedSide] = useState<AffectedSide>(AffectedSide.LEFT);
  const [severity, setSeverity] = useState<SeverityLevel>(SeverityLevel.MODERATE);
  const [mobilityLevel, setMobilityLevel] = useState<MobilityLevel>(MobilityLevel.SOME_ASSISTANCE);
  const [dailyGoal, setDailyGoal] = useState(15);
  const [weeklyGoal, setWeeklyGoal] = useState(5);
  const [recoveryGoals, setRecoveryGoals] = useState<string[]>([]);

  const goalOptions = [
    'Improve arm movement',
    'Strengthen shoulder',
    'Increase range of motion',
    'Reduce pain during movement',
    'Build endurance',
    'Regain independence',
  ];

  const toggleGoal = (goal: string) => {
    setRecoveryGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleComplete = () => {
    const profile: UserProfile = {
      id: uuidv4(),
      firstName,
      lastName,
      strokeType,
      strokeDate,
      affectedSide,
      severity,
      mobilityLevel,
      dailyExerciseGoal: dailyGoal,
      weeklySessionGoal: weeklyGoal,
      recoveryGoals,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    StorageService.saveUserProfile(profile);
    StorageService.setFirstLaunchCompleted();
    setStep('complete');
    
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  const nextStep = () => {
    const steps: OnboardingStep[] = ['welcome', 'personal', 'stroke', 'mobility', 'goals', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const steps: OnboardingStep[] = ['welcome', 'personal', 'stroke', 'mobility', 'goals', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const getStepNumber = () => {
    const steps: OnboardingStep[] = ['welcome', 'personal', 'stroke', 'mobility', 'goals'];
    return steps.indexOf(step);
  };

  const renderProgressBar = () => {
    const stepNum = getStepNumber();
    if (stepNum <= 0) return null;
    
    return (
      <div className="absolute top-6 left-6 right-6 z-20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/70 text-sm">Step {stepNum} of 4</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-500 rounded-full"
            style={{ width: `${(stepNum / 4) * 100}%` }}
          />
        </div>
      </div>
    );
  };

  // Welcome Step
  if (step === 'welcome') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#5C2D91] to-[#00BCF2]" />
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl mb-6">
                <SparklesIcon className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up stagger-1">
              Synapse AI
            </h1>

            <p className="text-xl md:text-2xl text-white/90 font-medium mb-4 animate-fade-in-up stagger-2">
              Your brain has an incredible ability to heal.
            </p>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-8 animate-fade-in-up stagger-2">
              Let&apos;s unlock it together.
            </p>

            <p className="text-lg text-white/70 mb-12 max-w-lg mx-auto animate-fade-in-up stagger-3">
              AI-powered stroke rehabilitation personalized just for you.
              Let&apos;s get to know you better to create your recovery plan.
            </p>

            <div className="animate-fade-in-up stagger-4">
              <button
                onClick={nextStep}
                className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-semibold text-[#0078D4] bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 active:scale-100"
              >
                <span>Begin Setup</span>
                <ArrowRightIcon className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-16 animate-fade-in-up stagger-5">
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

  // Personal Info Step
  if (step === 'personal') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#5C2D91] to-[#00BCF2]" />
        {renderProgressBar()}

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-lg w-full">
            <div className="fluent-card bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0078D4] to-[#00BCF2] flex items-center justify-center">
                  <UserIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Tell us about yourself</h2>
                  <p className="text-gray-600">We&apos;ll personalize your experience</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter your first name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter your last name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={nextStep}
                  disabled={!firstName.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#0078D4] to-[#00BCF2] text-white rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Continue</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Stroke Info Step
  if (step === 'stroke') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#5C2D91] to-[#00BCF2]" />
        {renderProgressBar()}

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-lg w-full">
            <div className="fluent-card bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E74856] to-[#FF8C00] flex items-center justify-center">
                  <HeartIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Stroke Information</h2>
                  <p className="text-gray-600">Help us understand your condition</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of Stroke</label>
                  <select
                    value={strokeType}
                    onChange={(e) => setStrokeType(e.target.value as StrokeType)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all bg-white"
                  >
                    <option value={StrokeType.ISCHEMIC}>Ischemic (blocked blood vessel)</option>
                    <option value={StrokeType.HEMORRHAGIC}>Hemorrhagic (bleeding)</option>
                    <option value={StrokeType.TIA}>TIA (mini-stroke)</option>
                    <option value={StrokeType.UNKNOWN}>I&apos;m not sure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">When did your stroke occur?</label>
                  <input
                    type="date"
                    value={strokeDate}
                    onChange={(e) => setStrokeDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Which side is affected?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: AffectedSide.LEFT, label: 'Left Side' },
                      { value: AffectedSide.RIGHT, label: 'Right Side' },
                      { value: AffectedSide.BOTH, label: 'Both Sides' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setAffectedSide(value)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all ${
                          affectedSide === value
                            ? 'border-[#0078D4] bg-[#0078D4]/10 text-[#0078D4]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How severe is the impact?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: SeverityLevel.MILD, label: 'Mild', color: 'green' },
                      { value: SeverityLevel.MODERATE, label: 'Moderate', color: 'yellow' },
                      { value: SeverityLevel.SEVERE, label: 'Severe', color: 'red' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setSeverity(value)}
                        className={`px-4 py-3 rounded-xl border-2 transition-all ${
                          severity === value
                            ? 'border-[#0078D4] bg-[#0078D4]/10 text-[#0078D4]'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#0078D4] to-[#00BCF2] text-white rounded-xl hover:opacity-90 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobility Step
  if (step === 'mobility') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#5C2D91] to-[#00BCF2]" />
        {renderProgressBar()}

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-lg w-full">
            <div className="fluent-card bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00CC6A] to-[#10893E] flex items-center justify-center">
                  <HandRaisedIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Current Mobility</h2>
                  <p className="text-gray-600">We&apos;ll adapt exercises to your level</p>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your current mobility level?
                </label>
                {[
                  { value: MobilityLevel.INDEPENDENT, label: 'Independent', desc: 'I can move and exercise on my own' },
                  { value: MobilityLevel.SOME_ASSISTANCE, label: 'Some Assistance', desc: 'I need occasional help with movements' },
                  { value: MobilityLevel.SIGNIFICANT_ASSISTANCE, label: 'Significant Assistance', desc: 'I need regular help with most movements' },
                  { value: MobilityLevel.WHEELCHAIR, label: 'Wheelchair User', desc: 'I use a wheelchair for mobility' },
                ].map(({ value, label, desc }) => (
                  <button
                    key={value}
                    onClick={() => setMobilityLevel(value)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      mobilityLevel === value
                        ? 'border-[#0078D4] bg-[#0078D4]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`font-medium ${mobilityLevel === value ? 'text-[#0078D4]' : 'text-gray-900'}`}>
                      {label}
                    </div>
                    <div className="text-sm text-gray-500">{desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={nextStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#0078D4] to-[#00BCF2] text-white rounded-xl hover:opacity-90 transition-all"
                >
                  <span>Continue</span>
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Goals Step
  if (step === 'goals') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0078D4] via-[#5C2D91] to-[#00BCF2]" />
        {renderProgressBar()}

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-20">
          <div className="max-w-lg w-full">
            <div className="fluent-card bg-white/95 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFB900] to-[#FF8C00] flex items-center justify-center">
                  <SparklesIcon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Recovery Goals</h2>
                  <p className="text-gray-600">What do you want to achieve?</p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Select your recovery goals (choose all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {goalOptions.map((goal) => (
                      <button
                        key={goal}
                        onClick={() => toggleGoal(goal)}
                        className={`px-4 py-2 rounded-full border-2 text-sm transition-all ${
                          recoveryGoals.includes(goal)
                            ? 'border-[#0078D4] bg-[#0078D4] text-white'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily exercise goal: <span className="text-[#0078D4] font-bold">{dailyGoal} minutes</span>
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={dailyGoal}
                    onChange={(e) => setDailyGoal(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0078D4]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekly session goal: <span className="text-[#0078D4] font-bold">{weeklyGoal} sessions</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    value={weeklyGoal}
                    onChange={(e) => setWeeklyGoal(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0078D4]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1 session</span>
                    <span>7 sessions</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={prevStep}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleComplete}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#0078D4] to-[#00BCF2] text-white rounded-xl hover:opacity-90 transition-all"
                >
                  <span>Complete Setup</span>
                  <CheckCircleIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Complete Step
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#00CC6A] via-[#10893E] to-[#0078D4]" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center">
          <div className="mb-8 animate-bounce">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-2xl">
              <CheckCircleIcon className="w-16 h-16 text-[#00CC6A]" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome, {firstName}!
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Your personalized recovery plan is ready.
          </p>
          <p className="text-white/70">
            Loading your dashboard...
          </p>

          <div className="mt-8">
            <div className="w-16 h-1 bg-white/30 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-white animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

