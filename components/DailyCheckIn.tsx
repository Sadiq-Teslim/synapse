'use client';

import { useState } from 'react';
import { StorageService } from '@/utils/storageService';
import { DailyCheckIn } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import {
  SunIcon,
  MoonIcon,
  FaceSmileIcon,
  HeartIcon,
  BoltIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

interface DailyCheckInProps {
  userName: string;
  onComplete: () => void;
}

export default function DailyCheckInScreen({ userName, onComplete }: DailyCheckInProps) {
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [painLevel, setPainLevel] = useState<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10>(3);
  const [energyLevel, setEnergyLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [sleepQuality, setSleepQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [notes, setNotes] = useState('');

  const moodEmojis = ['😢', '😔', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Okay', 'Good', 'Great'];

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleSubmit = () => {
    const checkIn: DailyCheckIn = {
      id: uuidv4(),
      date: new Date().toISOString().split('T')[0],
      mood,
      painLevel,
      energyLevel,
      sleepQuality,
      notes: notes.trim() || undefined,
      timestamp: new Date(),
    };

    StorageService.saveCheckIn(checkIn);
    onComplete();
  };

  const getPainColor = (level: number) => {
    if (level <= 3) return 'bg-green-500';
    if (level <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0078D4]" />
      
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xl mb-4">
              {new Date().getHours() < 17 ? (
                <SunIcon className="w-8 h-8 text-white" />
              ) : (
                <MoonIcon className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {getTimeGreeting()}, {userName}!
            </h1>
            <p className="text-white/80">How are you feeling today?</p>
          </div>

          {/* Check-in Card */}
          <div className="fluent-card bg-white/95 backdrop-blur-xl p-6 rounded-2xl shadow-2xl space-y-6">
            {/* Mood */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FaceSmileIcon className="w-5 h-5 text-[#0078D4]" />
                <label className="text-sm font-medium text-gray-700">
                  Overall Mood: <span className="text-[#0078D4]">{moodLabels[mood - 1]}</span>
                </label>
              </div>
              <div className="flex justify-between gap-2">
                {moodEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setMood((index + 1) as 1 | 2 | 3 | 4 | 5)}
                    className={`flex-1 py-3 text-2xl rounded-xl border-2 transition-all ${
                      mood === index + 1
                        ? 'border-[#0078D4] bg-[#0078D4]/10 scale-110'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Pain Level */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <HeartIcon className="w-5 h-5 text-[#E74856]" />
                <label className="text-sm font-medium text-gray-700">
                  Pain Level: <span className={painLevel <= 3 ? 'text-green-600' : painLevel <= 6 ? 'text-yellow-600' : 'text-red-600'}>{painLevel}/10</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value) as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #00CC6A ${painLevel * 10}%, #e5e7eb ${painLevel * 10}%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No pain</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BoltIcon className="w-5 h-5 text-[#FFB900]" />
                <label className="text-sm font-medium text-gray-700">
                  Energy Level
                </label>
              </div>
              <div className="flex justify-between gap-2">
                {['Very Low', 'Low', 'Moderate', 'High', 'Very High'].map((label, index) => (
                  <button
                    key={index}
                    onClick={() => setEnergyLevel((index + 1) as 1 | 2 | 3 | 4 | 5)}
                    className={`flex-1 py-2 text-xs rounded-xl border-2 transition-all ${
                      energyLevel === index + 1
                        ? 'border-[#FFB900] bg-[#FFB900]/10 text-[#FFB900] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleep Quality */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MoonIcon className="w-5 h-5 text-[#5C2D91]" />
                <label className="text-sm font-medium text-gray-700">
                  How did you sleep last night?
                </label>
              </div>
              <div className="flex justify-between gap-2">
                {['Very Poor', 'Poor', 'Okay', 'Good', 'Excellent'].map((label, index) => (
                  <button
                    key={index}
                    onClick={() => setSleepQuality((index + 1) as 1 | 2 | 3 | 4 | 5)}
                    className={`flex-1 py-2 text-xs rounded-xl border-2 transition-all ${
                      sleepQuality === index + 1
                        ? 'border-[#5C2D91] bg-[#5C2D91]/10 text-[#5C2D91] font-medium'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Any notes or concerns? (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How you're feeling, what you noticed..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0078D4] focus:border-transparent transition-all resize-none"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#0078D4] text-white rounded-xl hover:bg-[#106EBE] transition-all font-medium"
            >
              <span>Continue to Dashboard</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Skip option */}
          <button
            onClick={onComplete}
            className="w-full mt-4 text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}



