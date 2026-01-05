# Synapse Chronos - 3D World Integration Plan

## The Vision 🎮

**"I just want to walk in my garden one last time."**

Transform stroke rehabilitation from boring repetitive exercises into an emotional journey through the patient's own memories, reconstructed as immersive 3D worlds.

## Core Concept

1. **Patient uploads 5-10 photos** of meaningful places (childhood village, wedding venue, favorite park)
2. **AI reconstructs 2D photos into 3D immersive worlds** using 3D Gaussian Splatting or NeRFs
3. **Patient controls movement through 3D world** by performing rehab exercises
   - High-knee step → Move forward in memory
   - Torso rotation → Look around
   - Arm raises → Unlock audio memories

## Tech Stack

### Option A: 3D Gaussian Splatting (Advanced)
- **Backend**: Python + Azure ML
- **Process**: 
  1. User uploads photos/video
  2. Send to Azure ML endpoint
  3. Run 3DGS training (open source, fast)
  4. Stream splat file back to browser
- **Rendering**: Three.js + gsplat.js (WebGL)

### Option B: API-Based (Easier - Recommended for MVP)
- **Blockade Labs Skybox AI API**: Generate 360° worlds from text prompts
- **Luma AI API**: Generate 3D scenes from images
- **Process**:
  1. User uploads photo
  2. Send to API with prompt ("A peaceful village in Lagos, 1990")
  3. Receive 360° panorama or 3D scene
  4. Render in Three.js

### Option C: Unity WebGL (Most Polished)
- **Unity with Gaussian Splatting plugin**
- Export as WebGL build
- Embed in Next.js app
- Communicate via WebSocket/PostMessage

## Implementation Phases

### Phase 1: Photo Upload & Processing
- [ ] Add photo upload component to onboarding
- [ ] Store photos in localStorage (or Azure Blob Storage)
- [ ] Create "Memory Gallery" screen
- [ ] Integrate Blockade Labs API for 360° generation

### Phase 2: 3D World Renderer
- [ ] Set up Three.js in React
- [ ] Create 360° panorama viewer
- [ ] Add camera controls (initially mouse/touch)
- [ ] Add basic lighting and atmosphere

### Phase 3: Bio-Controller Integration
- [ ] Map pose detection to camera movement
  - Right knee Y position → Forward movement
  - Left arm angle → Look left/right
  - Torso rotation → Camera rotation
- [ ] Add movement thresholds
- [ ] Smooth camera interpolation

### Phase 4: Exercise-to-Movement Mapping
- [ ] High-knee step detection → Forward movement
- [ ] Torso rotation → Camera pan
- [ ] Arm raises → Unlock points of interest
- [ ] Add visual feedback (progress bar, distance traveled)

### Phase 5: Audio Memories (Optional)
- [ ] Add audio recording/upload
- [ ] Trigger audio at specific locations
- [ ] "This is where we got married..."

### Phase 6: Vitals Monitoring (Future)
- [ ] Integrate rPPG (Remote Photoplethysmography)
- [ ] Monitor heart rate via camera
- [ ] Alert if over-exertion detected

## File Structure

```
synapse-ai-web/
├── app/
│   ├── memories/
│   │   ├── page.tsx          # Memory gallery
│   │   └── [id]/
│   │       └── page.tsx      # 3D world view
│   └── exercise/
│       └── page.tsx          # Updated with 3D world option
├── components/
│   ├── MemoryUpload.tsx      # Photo upload component
│   ├── MemoryGallery.tsx     # List of memories
│   ├── World3D.tsx           # Three.js 3D world renderer
│   ├── BioController.tsx      # Pose-to-movement mapper
│   └── VitalsMonitor.tsx     # rPPG heart rate (future)
├── utils/
│   ├── worldGenerator.ts     # API calls to Blockade/Luma
│   ├── bioController.ts      # Pose-to-movement logic
│   └── threejsSetup.ts       # Three.js initialization
└── types/
    └── memory.ts             # Memory/World types
```

## API Integration

### Blockade Labs Skybox AI
```typescript
const generateWorld = async (prompt: string) => {
  const response = await fetch('https://api.blockadelabs.com/api/v1/skybox', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prompt })
  });
  return response.json();
};
```

### Luma AI (Alternative)
```typescript
const generateScene = async (image: File) => {
  const formData = new FormData();
  formData.append('image', image);
  
  const response = await fetch('https://api.lumalabs.ai/v1/scenes', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`
    },
    body: formData
  });
  return response.json();
};
```

## Pose-to-Movement Mapping

```typescript
// Example: High-knee step → Forward movement
if (rightKneeY > threshold && !isMoving) {
  moveCameraForward(1.0); // Move 1 meter forward
  isMoving = true;
}

// Torso rotation → Camera pan
const torsoAngle = calculateTorsoRotation(pose);
camera.rotateY(torsoAngle * 0.01);

// Arm raise → Unlock POI
if (leftArmAngle < 90 && !poiUnlocked) {
  unlockPointOfInterest();
  playAudioMemory();
}
```

## Next Steps

1. **Start with Blockade Labs API** (easiest)
2. **Create photo upload flow** in onboarding
3. **Build basic 360° viewer** with Three.js
4. **Connect pose detection** to camera movement
5. **Test with real exercises**

## Resources

- [Blockade Labs API Docs](https://docs.blockadelabs.com/)
- [Three.js Documentation](https://threejs.org/docs/)
- [3D Gaussian Splatting Paper](https://repo-sam.inria.fr/fungraph/3d-gaussian-splatting/)
- [gsplat.js (WebGL renderer)](https://github.com/mkkellogg/GaussianSplats3D)

