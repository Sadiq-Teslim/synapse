'use client';

import { useEffect, useRef, useState } from 'react';

export default function TestPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState('Starting...');
  const [error, setError] = useState<string | null>(null);
  const [poseCount, setPoseCount] = useState(0);

  useEffect(() => {
    let detector: any = null;
    let animationId: number;
    let isRunning = true;

    const test = async () => {
      try {
        // Step 1: Get camera
        setStatus('1. Requesting camera...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });
        
        if (!videoRef.current) throw new Error('Video element not found');
        
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('2. Camera OK! Loading TensorFlow.js...');

        // Step 2: Load TensorFlow.js
        const tf = await import('@tensorflow/tfjs');
        await import('@tensorflow/tfjs-backend-webgl');
        await tf.setBackend('webgl');
        await tf.ready();
        setStatus('3. TensorFlow ready! Loading pose model...');

        // Step 3: Load pose detection
        const poseDetection = await import('@tensorflow-models/pose-detection');
        setStatus('4. Creating MoveNet detector...');

        detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          {
            modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          }
        );
        setStatus('5. Detector ready! Processing frames...');

        // Process frames
        const processFrame = async () => {
          if (!isRunning || !videoRef.current || !detector) return;
          
          try {
            const poses = await detector.estimatePoses(videoRef.current);
            
            if (poses && poses.length > 0 && poses[0].keypoints) {
              setPoseCount(poses[0].keypoints.length);
              setStatus(`✅ Working! Detected ${poses[0].keypoints.length} keypoints`);
              
              // Draw keypoints on canvas
              if (canvasRef.current && videoRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                if (ctx) {
                  ctx.clearRect(0, 0, 640, 480);
                  
                  // Draw connections
                  ctx.strokeStyle = '#00ff00';
                  ctx.lineWidth = 2;
                  
                  // Draw keypoints
                  poses[0].keypoints.forEach((kp: any) => {
                    if (kp.score > 0.3) {
                      ctx.beginPath();
                      ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI);
                      ctx.fillStyle = '#00ff00';
                      ctx.fill();
                    }
                  });
                }
              }
            } else {
              setStatus('⚠️ No pose detected - step into view');
            }
          } catch (e) {
            console.error('Frame error:', e);
          }
          
          if (isRunning) {
            animationId = requestAnimationFrame(processFrame);
          }
        };
        
        processFrame();

      } catch (err: any) {
        console.error('Test error:', err);
        setError(err.message || 'Unknown error');
      }
    };

    test();

    return () => {
      isRunning = false;
      if (animationId) cancelAnimationFrame(animationId);
      if (detector) {
        try { detector.dispose(); } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-white text-2xl font-bold mb-4">TensorFlow.js Pose Test</h1>
      
      <div className={`text-lg mb-4 px-4 py-2 rounded ${error ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
        {error ? `❌ Error: ${error}` : status}
      </div>

      {poseCount > 0 && (
        <div className="text-cyan-400 text-lg mb-4">
          🦴 Keypoints: {poseCount}
        </div>
      )}

      <div className="relative">
        <video
          ref={videoRef}
          className="w-full max-w-2xl rounded-lg border-2 border-gray-700"
          width={640}
          height={480}
          playsInline
          muted
          autoPlay
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}
        />
      </div>

      <div className="mt-4 text-gray-400 text-sm">
        You should see green dots on your body joints
      </div>

      <div className="flex gap-4 mt-6">
        <a 
          href="/exercise"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Try Exercise Page
        </a>
        <a 
          href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
