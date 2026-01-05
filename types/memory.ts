export interface Memory {
  id: string;
  name: string;
  description?: string;
  photos: string[]; // Base64 or URLs
  worldUrl?: string; // 360° panorama or 3D scene URL
  createdAt: Date;
  lastUsed?: Date;
}

export interface WorldConfig {
  memoryId: string;
  type: 'panorama' | '3d-scene';
  url: string;
  initialPosition?: { x: number; y: number; z: number };
  pointsOfInterest?: PointOfInterest[];
}

export interface PointOfInterest {
  id: string;
  position: { x: number; y: number; z: number };
  name: string;
  audioUrl?: string;
  unlocked: boolean;
}

export interface BioControllerConfig {
  // Movement mappings
  highKneeStep: {
    enabled: boolean;
    threshold: number; // knee Y position threshold
    movementSpeed: number; // meters per step
  };
  torsoRotation: {
    enabled: boolean;
    sensitivity: number; // rotation multiplier
  };
  armRaise: {
    enabled: boolean;
    threshold: number; // arm angle threshold
    unlockDistance: number; // distance to unlock POI
  };
}

