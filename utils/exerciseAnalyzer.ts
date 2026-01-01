import { PoseResult, PoseMetrics, FormQuality, POSE_LANDMARKS } from '@/types';

export class ExerciseAnalyzer {
  // Target angle for shoulder raise (in degrees)
  static readonly TARGET_ANGLE = 90.0;
  
  // Tolerance for "good" form (± degrees)
  static readonly GOOD_FORM_TOLERANCE = 15.0;
  static readonly EXCELLENT_FORM_TOLERANCE = 10.0;

  /**
   * Calculate shoulder flexion angle from pose landmarks
   */
  static calculateShoulderAngle(pose: PoseResult): number | null {
    try {
      const leftShoulder = pose.landmarks[POSE_LANDMARKS.LEFT_SHOULDER];
      const leftElbow = pose.landmarks[POSE_LANDMARKS.LEFT_ELBOW];
      const leftWrist = pose.landmarks[POSE_LANDMARKS.LEFT_WRIST];

      if (!leftShoulder || !leftElbow || !leftWrist) {
        return null;
      }

      // Calculate vectors
      const upperArm = {
        x: leftElbow.x - leftShoulder.x,
        y: leftElbow.y - leftShoulder.y,
      };
      const forearm = {
        x: leftWrist.x - leftElbow.x,
        y: leftWrist.y - leftElbow.y,
      };

      // Calculate angle using dot product formula
      const dot = upperArm.x * forearm.x + upperArm.y * forearm.y;
      const magUpper = Math.sqrt(upperArm.x * upperArm.x + upperArm.y * upperArm.y);
      const magFore = Math.sqrt(forearm.x * forearm.x + forearm.y * forearm.y);

      if (magUpper === 0 || magFore === 0) return null;

      const cosAngle = dot / (magUpper * magFore);
      // Clamp cosAngle to valid range [-1, 1]
      const clampedCos = Math.max(-1, Math.min(1, cosAngle));
      const angleRadians = Math.acos(clampedCos);
      const angleDegrees = (angleRadians * 180) / Math.PI;

      return angleDegrees;
    } catch (e) {
      console.error('Error calculating shoulder angle:', e);
      return null;
    }
  }

  /**
   * Check form quality based on angle
   */
  static checkFormQuality(angle: number | null): FormQuality {
    if (angle === null) return FormQuality.POOR;

    const deviation = Math.abs(angle - this.TARGET_ANGLE);

    if (deviation <= this.EXCELLENT_FORM_TOLERANCE) {
      return FormQuality.EXCELLENT;
    } else if (deviation <= this.GOOD_FORM_TOLERANCE) {
      return FormQuality.GOOD;
    } else {
      return FormQuality.POOR;
    }
  }

  /**
   * Analyze pose and return metrics
   */
  static analyzePose(
    pose: PoseResult | null,
    previousAngle?: number | null,
    wasAtTop: boolean = false
  ): PoseMetrics {
    if (!pose) {
      return {
        shoulderAngle: null,
        formQuality: FormQuality.POOR,
        isRepDetected: false,
        isAtTop: false,
      };
    }

    const angle = this.calculateShoulderAngle(pose);
    const formQuality = this.checkFormQuality(angle);

    // Detect rep: arm goes up and comes back down
    let isAtTop = false;
    let isRepDetected = false;

    if (angle !== null && previousAngle != null) {
      // At top: angle is close to target (within 20 degrees) and was increasing
      isAtTop = angle >= this.TARGET_ANGLE - 20 && previousAngle < angle;

      // Rep detected: was at top and now coming down
      isRepDetected = wasAtTop && angle < previousAngle && angle < this.TARGET_ANGLE - 30;
    }

    return {
      shoulderAngle: angle,
      formQuality,
      isRepDetected,
      isAtTop,
    };
  }
}

