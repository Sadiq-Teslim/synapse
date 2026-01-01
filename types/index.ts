export enum FormQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  POOR = 'poor',
}

export interface ExerciseSession {
  id: string;
  timestamp: Date;
  repsCompleted: number;
  maxAngle: number;
  averageAngle: number;
  durationSeconds: number;
  overallForm: FormQuality;
}

export interface PoseMetrics {
  shoulderAngle: number | null;
  formQuality: FormQuality;
  isRepDetected: boolean;
  isAtTop: boolean;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface PoseResult {
  landmarks: {
    [key: number]: PoseLandmark;
  };
}

// MediaPipe Pose landmark indices
export const POSE_LANDMARKS = {
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
} as const;

