'use client';

import { useEffect, useRef } from 'react';
import { PoseResult, FormQuality, POSE_LANDMARKS } from '@/types';

interface PoseOverlayProps {
  pose: PoseResult | null;
  formQuality: FormQuality;
  canvasWidth: number;
  canvasHeight: number;
}

// MediaPipe Pose connections for upper body
const UPPER_BODY_CONNECTIONS = [
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.LEFT_ELBOW],
  [POSE_LANDMARKS.LEFT_ELBOW, POSE_LANDMARKS.LEFT_WRIST],
  [POSE_LANDMARKS.RIGHT_SHOULDER, POSE_LANDMARKS.RIGHT_ELBOW],
  [POSE_LANDMARKS.RIGHT_ELBOW, POSE_LANDMARKS.RIGHT_WRIST],
  [POSE_LANDMARKS.LEFT_SHOULDER, POSE_LANDMARKS.RIGHT_SHOULDER],
];

// Microsoft Fluent color palette
const COLORS = {
  [FormQuality.EXCELLENT]: {
    primary: '#107C10', // MS Green
    glow: 'rgba(16, 124, 16, 0.5)',
  },
  [FormQuality.GOOD]: {
    primary: '#FFB900', // MS Yellow
    glow: 'rgba(255, 185, 0, 0.5)',
  },
  [FormQuality.POOR]: {
    primary: '#D13438', // MS Red
    glow: 'rgba(209, 52, 56, 0.5)',
  },
};

export default function PoseOverlay({
  pose,
  formQuality,
  canvasWidth,
  canvasHeight,
}: PoseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    if (!pose || !pose.landmarks) return;

    const { primary, glow } = COLORS[formQuality];

    // Draw connections with glow effect
    ctx.shadowColor = glow;
    ctx.shadowBlur = 15;
    ctx.strokeStyle = primary;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    UPPER_BODY_CONNECTIONS.forEach(([start, end]) => {
      const startLandmark = pose.landmarks[start];
      const endLandmark = pose.landmarks[end];
      if (startLandmark && endLandmark) {
        const startVis = startLandmark.visibility ?? 1;
        const endVis = endLandmark.visibility ?? 1;
        if (startVis > 0.5 && endVis > 0.5) {
          ctx.beginPath();
          ctx.moveTo(startLandmark.x * canvasWidth, startLandmark.y * canvasHeight);
          ctx.lineTo(endLandmark.x * canvasWidth, endLandmark.y * canvasHeight);
          ctx.stroke();
        }
      }
    });

    // Draw landmarks with glow effect
    const keyPoints = [
      POSE_LANDMARKS.LEFT_SHOULDER,
      POSE_LANDMARKS.LEFT_ELBOW,
      POSE_LANDMARKS.LEFT_WRIST,
      POSE_LANDMARKS.RIGHT_SHOULDER,
      POSE_LANDMARKS.RIGHT_ELBOW,
      POSE_LANDMARKS.RIGHT_WRIST,
    ];

    keyPoints.forEach((index) => {
      const landmark = pose.landmarks[index];
      if (landmark) {
        const vis = landmark.visibility ?? 1;
        if (vis > 0.5) {
          // Outer glow
          ctx.shadowColor = glow;
          ctx.shadowBlur = 20;
          ctx.fillStyle = primary;
          ctx.beginPath();
          ctx.arc(
            landmark.x * canvasWidth,
            landmark.y * canvasHeight,
            10,
            0,
            2 * Math.PI
          );
          ctx.fill();

          // Inner white dot
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(
            landmark.x * canvasWidth,
            landmark.y * canvasHeight,
            4,
            0,
            2 * Math.PI
          );
          ctx.fill();
        }
      }
    });
  }, [pose, formQuality, canvasWidth, canvasHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
}
