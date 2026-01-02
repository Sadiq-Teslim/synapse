export enum FormQuality {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  POOR = 'poor',
}

// Stroke Types
export enum StrokeType {
  ISCHEMIC = 'ischemic',
  HEMORRHAGIC = 'hemorrhagic',
  TIA = 'tia',
  UNKNOWN = 'unknown',
}

// Affected body side
export enum AffectedSide {
  LEFT = 'left',
  RIGHT = 'right',
  BOTH = 'both',
}

// Severity level
export enum SeverityLevel {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

// Mobility level
export enum MobilityLevel {
  INDEPENDENT = 'independent',
  SOME_ASSISTANCE = 'some_assistance',
  SIGNIFICANT_ASSISTANCE = 'significant_assistance',
  WHEELCHAIR = 'wheelchair',
}

// User Profile
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  dateOfBirth?: string;
  
  // Stroke Information
  strokeType: StrokeType;
  strokeDate: string;
  affectedSide: AffectedSide;
  severity: SeverityLevel;
  mobilityLevel: MobilityLevel;
  
  // Goals
  dailyExerciseGoal: number; // minutes
  weeklySessionGoal: number; // sessions
  recoveryGoals: string[];
  
  // Settings
  createdAt: Date;
  lastUpdated: Date;
}

// Daily Check-in
export interface DailyCheckIn {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5; // 1 = very low, 5 = excellent
  painLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  energyLevel: 1 | 2 | 3 | 4 | 5;
  sleepQuality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
  timestamp: Date;
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

