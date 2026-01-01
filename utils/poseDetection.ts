import { PoseResult } from '@/types';

// TensorFlow.js pose detection
let poseDetection: any = null;
let tf: any = null;

export class PoseDetectionService {
  private detector: any = null;
  private isRunning = false;
  private animationFrameId: number | null = null;
  private onResultsCallback?: (results: PoseResult | null) => void;
  private videoElement?: HTMLVideoElement;
  private isModelReady = false;

  constructor() {}

  /**
   * Initialize TensorFlow.js Pose Detection
   */
  async initialize(): Promise<void> {
    try {
      // Dynamically import TensorFlow.js
      if (!tf) {
        tf = await import('@tensorflow/tfjs');
        await import('@tensorflow/tfjs-backend-webgl');
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TensorFlow.js initialized with WebGL backend');
      }

      // Import pose detection
      if (!poseDetection) {
        poseDetection = await import('@tensorflow-models/pose-detection');
      }

      // Create MoveNet detector (faster and more reliable than BlazePose)
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
          enableSmoothing: true,
        }
      );

      this.isModelReady = true;
      console.log('MoveNet pose detector initialized');
      
    } catch (error) {
      console.error('Error initializing pose detection:', error);
      throw error;
    }
  }

  /**
   * Convert TensorFlow pose to our PoseResult format
   */
  private convertToPoseResult(poses: any[]): PoseResult | null {
    if (!poses || poses.length === 0 || !poses[0].keypoints) {
      return null;
    }

    const keypoints = poses[0].keypoints;
    const landmarks: { [key: number]: any } = {};

    // MoveNet keypoint indices:
    // 0: nose, 1: left_eye, 2: right_eye, 3: left_ear, 4: right_ear
    // 5: left_shoulder, 6: right_shoulder, 7: left_elbow, 8: right_elbow
    // 9: left_wrist, 10: right_wrist, 11: left_hip, 12: right_hip
    // 13: left_knee, 14: right_knee, 15: left_ankle, 16: right_ankle

    // Map to MediaPipe-style indices for compatibility
    const moveNetToMediaPipe: { [key: number]: number } = {
      5: 11,  // left_shoulder
      6: 12,  // right_shoulder
      7: 13,  // left_elbow
      8: 14,  // right_elbow
      9: 15,  // left_wrist
      10: 16, // right_wrist
    };

    keypoints.forEach((kp: any, index: number) => {
      const mappedIndex = moveNetToMediaPipe[index] ?? index;
      landmarks[mappedIndex] = {
        x: kp.x / (this.videoElement?.videoWidth || 640),
        y: kp.y / (this.videoElement?.videoHeight || 480),
        z: 0,
        visibility: kp.score || 0,
      };
    });

    return { landmarks };
  }

  /**
   * Start pose detection loop
   */
  start(videoElement: HTMLVideoElement, onResults: (results: PoseResult | null) => void): void {
    this.videoElement = videoElement;
    this.onResultsCallback = onResults;
    this.isRunning = true;
    
    this.processFrame();
  }

  /**
   * Process video frames in a loop
   */
  private async processFrame(): Promise<void> {
    if (!this.isRunning || !this.videoElement || !this.detector) {
      return;
    }

    try {
      // Only process if video is playing and has valid dimensions
      if (this.videoElement.readyState >= 2 && 
          this.videoElement.videoWidth > 0 && 
          this.videoElement.videoHeight > 0) {
        
        const poses = await this.detector.estimatePoses(this.videoElement, {
          flipHorizontal: false,
        });
        
        const poseResult = this.convertToPoseResult(poses);
        
        if (this.onResultsCallback) {
          this.onResultsCallback(poseResult);
        }
      }
    } catch (error) {
      console.error('Error processing frame:', error);
    }

    // Continue the loop (throttle to ~30fps for performance)
    if (this.isRunning) {
      this.animationFrameId = requestAnimationFrame(() => this.processFrame());
    }
  }

  /**
   * Stop pose detection
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.onResultsCallback = undefined;
  }

  /**
   * Dispose resources
   */
  dispose(): void {
    this.stop();
    if (this.detector) {
      try {
        this.detector.dispose();
      } catch (e) {
        // Ignore dispose errors
      }
      this.detector = null;
    }
  }

  /**
   * Check if model is ready
   */
  get ready(): boolean {
    return this.isModelReady;
  }
}
