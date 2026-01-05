/**
 * Bio-Controller: Maps pose detection to 3D world movement
 */

import { PoseResult, POSE_LANDMARKS } from '@/types';
import { moveCameraForward, rotateCamera } from '@/components/World3D';

export interface BioControllerState {
  lastKneeY: number | null;
  lastTorsoAngle: number | null;
  lastArmAngle: number | null;
  isMoving: boolean;
  movementThreshold: number;
}

export interface BioControllerConfig {
  highKneeStep: {
    enabled: boolean;
    threshold: number; // Minimum knee lift height (0-1 normalized)
    movementSpeed: number; // Meters per step
  };
  torsoRotation: {
    enabled: boolean;
    sensitivity: number; // Rotation multiplier
  };
  armRaise: {
    enabled: boolean;
    threshold: number; // Arm angle threshold in degrees
  };
}

const DEFAULT_CONFIG: BioControllerConfig = {
  highKneeStep: {
    enabled: true,
    threshold: 0.15, // 15% of screen height
    movementSpeed: 0.5, // 0.5 meters per step
  },
  torsoRotation: {
    enabled: true,
    sensitivity: 0.02,
  },
  armRaise: {
    enabled: true,
    threshold: 90, // degrees
  },
};

export class BioController {
  private state: BioControllerState;
  private config: BioControllerConfig;

  constructor(config: Partial<BioControllerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = {
      lastKneeY: null,
      lastTorsoAngle: null,
      lastArmAngle: null,
      isMoving: false,
      movementThreshold: 0.1,
    };
  }

  /**
   * Process pose and update 3D world camera
   */
  processPose(pose: PoseResult, videoWidth: number, videoHeight: number): {
    moved: boolean;
    rotated: boolean;
    armRaised: boolean;
  } {
    const result = {
      moved: false,
      rotated: false,
      armRaised: false,
    };

    if (!pose.landmarks) return result;

    // High-knee step detection → Forward movement
    // Using hip and wrist to approximate leg lift (MoveNet doesn't have knee landmarks)
    if (this.config.highKneeStep.enabled) {
      const rightHip = pose.landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
      const rightWrist = pose.landmarks[POSE_LANDMARKS.RIGHT_WRIST];
      
      if (rightHip && rightWrist) {
        const hipY = rightHip.y;
        const wristY = rightWrist.y;
        const legLift = (hipY - wristY) / videoHeight; // Normalized leg extension
        
        if (this.state.lastKneeY !== null) {
          // Detect upward movement (leg lifting)
          if (legLift > this.config.highKneeStep.threshold && 
              this.state.lastKneeY < this.config.highKneeStep.threshold &&
              !this.state.isMoving) {
            moveCameraForward(this.config.highKneeStep.movementSpeed);
            this.state.isMoving = true;
            result.moved = true;
          } else if (legLift < this.config.highKneeStep.threshold * 0.5) {
            this.state.isMoving = false;
          }
        }
        
        this.state.lastKneeY = legLift;
      }
    }

    // Torso rotation → Camera rotation
    if (this.config.torsoRotation.enabled) {
      const leftShoulder = pose.landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const rightShoulder = pose.landmarks[POSE_LANDMARKS.RIGHT_SHOULDER];
      
      if (leftShoulder && rightShoulder) {
        const shoulderAngle = Math.atan2(
          rightShoulder.y - leftShoulder.y,
          rightShoulder.x - leftShoulder.x
        );
        
        if (this.state.lastTorsoAngle !== null) {
          const angleDiff = shoulderAngle - this.state.lastTorsoAngle;
          if (Math.abs(angleDiff) > 0.05) {
            rotateCamera(angleDiff * this.config.torsoRotation.sensitivity);
            result.rotated = true;
          }
        }
        
        this.state.lastTorsoAngle = shoulderAngle;
      }
    }

    // Arm raise detection
    if (this.config.armRaise.enabled) {
      const leftShoulder = pose.landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const leftElbow = pose.landmarks[POSE_LANDMARKS.LEFT_ELBOW];
      const leftWrist = pose.landmarks[POSE_LANDMARKS.LEFT_WRIST];
      
      if (leftShoulder && leftElbow && leftWrist) {
        // Calculate arm angle
        const armAngle = this.calculateAngle(
          leftShoulder,
          leftElbow,
          leftWrist
        );
        
        if (armAngle < this.config.armRaise.threshold) {
          result.armRaised = true;
        }
      }
    }

    return result;
  }

  /**
   * Calculate angle between three points
   */
  private calculateAngle(
    point1: { x: number; y: number },
    point2: { x: number; y: number },
    point3: { x: number; y: number }
  ): number {
    const a = Math.sqrt(
      Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
    const b = Math.sqrt(
      Math.pow(point3.x - point2.x, 2) + Math.pow(point3.y - point2.y, 2)
    );
    const c = Math.sqrt(
      Math.pow(point3.x - point1.x, 2) + Math.pow(point3.y - point1.y, 2)
    );
    
    const angle = Math.acos((a * a + b * b - c * c) / (2 * a * b));
    return (angle * 180) / Math.PI;
  }

  /**
   * Reset controller state
   */
  reset(): void {
    this.state = {
      lastKneeY: null,
      lastTorsoAngle: null,
      lastArmAngle: null,
      isMoving: false,
      movementThreshold: 0.1,
    };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<BioControllerConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

