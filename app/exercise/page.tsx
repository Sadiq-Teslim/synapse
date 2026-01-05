'use client';

import { useEffect, useRef, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { PoseDetectionService } from '@/utils/poseDetection';
import { ExerciseAnalyzer } from '@/utils/exerciseAnalyzer';
import { StorageService } from '@/utils/storageService';
import { MemoryStorage } from '@/utils/memoryStorage';
import { BioController } from '@/utils/bioController';
import { PoseResult, FormQuality, ExerciseSession } from '@/types';
import { Memory, WorldConfig } from '@/types/memory';
import PoseOverlay from '@/components/PoseOverlay';
import FeedbackIndicator from '@/components/FeedbackIndicator';
import World3D from '@/components/World3D';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/solid';

const TARGET_REPS = 10;

function ExercisePageContent() {
  const searchParams = useSearchParams();
  const memoryId = searchParams.get('memory');
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const poseServiceRef = useRef<PoseDetectionService | null>(null);
  const previousAngleRef = useRef<number | null>(null);
  const wasAtTopRef = useRef(false);
  const angleHistoryRef = useRef<number[]>([]);
  const repsRef = useRef(0);
  
  const [isInitialized, setIsInitialized] = useState(false);
  const [initStatus, setInitStatus] = useState('Initializing camera...');
  const [currentPose, setCurrentPose] = useState<PoseResult | null>(null);
  const [formQuality, setFormQuality] = useState<FormQuality>(FormQuality.POOR);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('Position yourself in front of the camera');
  const [shoulderAngle, setShoulderAngle] = useState<number | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 640, height: 480 });
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  // 3D World state
  const [memory, setMemory] = useState<Memory | null>(null);
  const [worldConfig, setWorldConfig] = useState<WorldConfig | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const bioControllerRef = useRef<BioController | null>(null);

  // Load memory if memoryId is provided
  useEffect(() => {
    if (memoryId) {
      const loadedMemory = MemoryStorage.getMemory(memoryId);
      if (loadedMemory) {
        setMemory(loadedMemory);
        setIs3DMode(true);
        
        // Create world config from memory
        if (loadedMemory.worldUrl) {
          setWorldConfig({
            memoryId: loadedMemory.id,
            type: 'panorama',
            url: loadedMemory.worldUrl,
            initialPosition: { x: 0, y: 0, z: 0 },
          });
        }
        
        // Initialize bio-controller
        bioControllerRef.current = new BioController();
      }
    }
  }, [memoryId]);

  const processPose = useCallback((pose: PoseResult) => {
    setCurrentPose(pose);

    const metrics = ExerciseAnalyzer.analyzePose(
      pose, 
      previousAngleRef.current, 
      wasAtTopRef.current
    );
    
    setShoulderAngle(metrics.shoulderAngle);
    setFormQuality(metrics.formQuality);
    wasAtTopRef.current = metrics.isAtTop;
    previousAngleRef.current = metrics.shoulderAngle;

    // Update feedback message
    if (metrics.shoulderAngle === null) {
      setFeedbackMessage('Ensure your full body is visible');
    } else {
      switch (metrics.formQuality) {
        case FormQuality.EXCELLENT:
          setFeedbackMessage('Excellent form! Keep going!');
          break;
        case FormQuality.GOOD:
          setFeedbackMessage('Good! Try to reach a bit higher');
          break;
        case FormQuality.POOR:
          setFeedbackMessage('Adjust your arm position');
          break;
      }
    }

    // Track angle history
    if (metrics.shoulderAngle !== null) {
      angleHistoryRef.current.push(metrics.shoulderAngle);
    }

    // Detect rep completion
    if (metrics.isRepDetected) {
      repsRef.current += 1;
      setRepsCompleted(repsRef.current);
      wasAtTopRef.current = false;
      
      if (repsRef.current >= TARGET_REPS) {
        finishSession(repsRef.current);
      }
    }

    // Process 3D world movement if in 3D mode
    if (is3DMode && bioControllerRef.current && videoRef.current) {
      const bioResult = bioControllerRef.current.processPose(
        pose,
        videoRef.current.videoWidth,
        videoRef.current.videoHeight
      );
      
      if (bioResult.moved) {
        setFeedbackMessage('Moving forward in your memory...');
      }
      if (bioResult.rotated) {
        setFeedbackMessage('Looking around...');
      }
    }
  }, [is3DMode]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    const initializeCamera = async () => {
      try {
        setInitStatus('Requesting camera access...');
        
        stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user' 
          },
        });

        if (!videoRef.current) {
          throw new Error('Video element not found');
        }

        setInitStatus('Setting up video stream...');
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error('Video element not found'));
            return;
          }
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              setVideoDimensions({
                width: videoRef.current.videoWidth,
                height: videoRef.current.videoHeight,
              });
              resolve();
            }
          };
          
          videoRef.current.onerror = () => reject(new Error('Video failed to load'));
          
          // Timeout after 10 seconds
          setTimeout(() => reject(new Error('Video loading timeout')), 10000);
        });

        await videoRef.current.play();
        
        setInitStatus('Loading AI pose detection model...');
        
        // Initialize pose detection
        const poseService = new PoseDetectionService();
        await poseService.initialize();
        poseServiceRef.current = poseService;

        setInitStatus('Starting pose detection...');
        
        poseService.start(videoRef.current, (poseResult: PoseResult | null) => {
          if (poseResult) {
            processPose(poseResult);
          } else {
            setCurrentPose(null);
          }
        });

        setSessionStartTime(new Date());
        setIsInitialized(true);
        
      } catch (error: any) {
        console.error('Error initializing:', error);
        setCameraError(error.message || 'Could not access camera');
      }
    };

    initializeCamera();

    return () => {
      // Cleanup
      if (poseServiceRef.current) {
        poseServiceRef.current.dispose();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [processPose]);

  const finishSession = useCallback((finalReps: number) => {
    if (!sessionStartTime) return;

    const duration = Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000);
    const angleHistory = angleHistoryRef.current;
    const maxAngle = angleHistory.length > 0 ? Math.max(...angleHistory) : 0;
    const avgAngle = angleHistory.length > 0
      ? angleHistory.reduce((sum, angle) => sum + angle, 0) / angleHistory.length
      : 0;

    // Determine overall form quality
    const excellentCount = angleHistory.filter(
      (angle) => ExerciseAnalyzer.checkFormQuality(angle) === FormQuality.EXCELLENT
    ).length;
    const goodCount = angleHistory.filter(
      (angle) => ExerciseAnalyzer.checkFormQuality(angle) === FormQuality.GOOD
    ).length;
    
    const overallForm =
      excellentCount > goodCount
        ? FormQuality.EXCELLENT
        : goodCount > angleHistory.length / 3
        ? FormQuality.GOOD
        : FormQuality.POOR;

    const session: ExerciseSession = {
      id: uuidv4(),
      timestamp: new Date(),
      repsCompleted: finalReps,
      maxAngle,
      averageAngle: avgAngle,
      durationSeconds: duration,
      overallForm,
    };

    StorageService.saveSession(session);

    // Stop camera
    if (poseServiceRef.current) {
      poseServiceRef.current.dispose();
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    router.push(`/summary?id=${session.id}`);
  }, [sessionStartTime, router]);

  const handleEndSession = () => {
    finishSession(repsRef.current);
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const progressPercent = (repsCompleted / TARGET_REPS) * 100;

  if (cameraError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="ms-card p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Camera Access Required</h2>
          <p className="text-gray-600 mb-6">{cameraError}</p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0078D4] text-white font-semibold rounded-lg hover:bg-[#106EBE] transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-white/20 border-t-[#00BCF2] rounded-full animate-spin" />
          <p className="text-white/80 text-lg font-medium">{initStatus}</p>
          <p className="text-white/50 text-sm mt-2">This may take a few seconds</p>
          
          {/* Hidden video element for initialization */}
          <video
            ref={videoRef}
            className="hidden"
            playsInline
            muted
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* 3D World or Video Container */}
      <div className="relative w-full h-screen flex items-center justify-center">
        {is3DMode && worldConfig ? (
          // 3D World View
          <div className="absolute inset-0 w-full h-full">
            <World3D config={worldConfig} />
            {/* Small video overlay for pose detection */}
            <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-white/20 shadow-2xl">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
                autoPlay
                style={{ transform: 'scaleX(-1)' }}
              />
              {currentPose && (
                <PoseOverlay
                  pose={currentPose}
                  formQuality={formQuality}
                  canvasWidth={192}
                  canvasHeight={144}
                />
              )}
            </div>
          </div>
        ) : (
          // Standard Video View
          <div className="relative w-full h-full max-w-5xl flex items-center justify-center">
            <video
              ref={videoRef}
              className="max-w-full max-h-full object-contain rounded-lg"
              playsInline
              muted
              autoPlay
              style={{ transform: 'scaleX(-1)' }}
            />
            {currentPose && (
              <PoseOverlay
                pose={currentPose}
                formQuality={formQuality}
                canvasWidth={videoDimensions.width}
                canvasHeight={videoDimensions.height}
              />
            )}
          </div>
        )}
      </div>

      {/* Top UI Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none">
        <div className="max-w-5xl mx-auto">
          {/* Header Bar */}
          <div className="flex items-start justify-between">
            {/* Left Panel - Stats */}
            <div className="pointer-events-auto animate-fade-in-up">
              <div className="acrylic-dark rounded-2xl p-5 min-w-[200px]">
                {/* Progress Ring */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="rgba(255,255,255,0.2)"
                        strokeWidth="6"
                        fill="none"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="28"
                        stroke="url(#progressGradient)"
                        strokeWidth="6"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${progressPercent * 1.76} 176`}
                        className="transition-all duration-300"
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#0078D4" />
                          <stop offset="100%" stopColor="#106EBE" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">{repsCompleted}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm">Reps</p>
                    <p className="text-white text-2xl font-bold">{repsCompleted}/{TARGET_REPS}</p>
                  </div>
                </div>

                {/* Angle Display */}
                {shoulderAngle !== null && (
                  <div className="flex items-center justify-between py-3 border-t border-white/10">
                    <span className="text-white/60 text-sm">Arm Angle</span>
                    <span className="text-white font-bold text-lg">{shoulderAngle.toFixed(0)}°</span>
                  </div>
                )}
              </div>

              {/* Feedback */}
              <div className="mt-4">
                <FeedbackIndicator formQuality={formQuality} message={feedbackMessage} />
              </div>
            </div>

            {/* Right Panel - Status */}
            <div className="pointer-events-auto animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
              <div className="acrylic-dark rounded-2xl px-5 py-3 flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${isPaused ? 'bg-amber-400' : 'bg-green-400 animate-pulse'}`} />
                <span className="text-white font-medium">
                  {isPaused ? 'Paused' : 'Recording'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-4 pointer-events-auto animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
            {/* Pause Button */}
            <button
              onClick={handleTogglePause}
              className="w-16 h-16 rounded-full acrylic-dark flex items-center justify-center hover:scale-105 transition-transform active:scale-95"
            >
              {isPaused ? (
                <PlayIcon className="w-8 h-8 text-white" />
              ) : (
                <PauseIcon className="w-8 h-8 text-white" />
              )}
            </button>

            {/* End Session Button */}
            <button
              onClick={handleEndSession}
              className="h-16 px-8 rounded-full bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-3 hover:scale-105 transition-transform active:scale-95 shadow-lg"
            >
              <StopIcon className="w-6 h-6" />
              <span>End Session</span>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto pointer-events-auto">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0078D4] rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-center text-white/60 text-sm mt-2">
              {TARGET_REPS - repsCompleted} reps remaining
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExercisePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#0078D4] text-white">Loading...</div>}>
      <ExercisePageContent />
    </Suspense>
  );
}
