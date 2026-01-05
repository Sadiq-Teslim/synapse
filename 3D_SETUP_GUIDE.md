# 3D World Integration - Complete Setup Guide

## 🎯 What You Need to Set Up

To make the 3D world feature fully functional, you need to configure the following:

### 1. Environment Variables (API Keys)

Create a `.env.local` file in the `synapse-ai-web` directory with your API keys:

```env
# Blockade Labs Skybox AI (Recommended for 360° panoramas)
NEXT_PUBLIC_BLOCKADE_API_KEY=your_blockade_api_key_here

# OR Luma AI (Alternative for 3D scenes)
NEXT_PUBLIC_LUMA_API_KEY=your_luma_api_key_here
```

**Note:** You only need ONE of these APIs. Blockade Labs is recommended for easier setup.

### 2. Getting API Keys

#### Option A: Blockade Labs (Recommended)
1. Go to https://www.blockadelabs.com/
2. Sign up for an account
3. Navigate to API section
4. Generate an API key
5. Copy the key to `.env.local`

**Pricing:** Usually has a free tier for testing

#### Option B: Luma AI
1. Go to https://lumalabs.ai/
2. Sign up for an account
3. Get API access from their developer portal
4. Copy the key to `.env.local`

### 3. File Structure Check

Make sure these files exist:
```
synapse-ai-web/
├── .env.local                    # ← Create this file
├── components/
│   ├── World3D.tsx              # ✅ Created
│   └── MemoryUpload.tsx         # ✅ Created
├── utils/
│   ├── bioController.ts        # ✅ Created
│   ├── worldGenerator.ts       # ✅ Created
│   └── memoryStorage.ts        # ✅ Created
├── types/
│   └── memory.ts               # ✅ Created
└── app/
    ├── memories/
    │   ├── page.tsx            # ✅ Created
    │   └── new/
    │       └── page.tsx        # ✅ Created
    └── exercise/
        └── page.tsx            # ✅ Updated
```

### 4. Testing Without API Keys (Development Mode)

If you don't have API keys yet, you can still test the flow:

1. **Memory Upload** - Works without API (photos stored locally)
2. **3D World Viewer** - Will show loading state (you can add a test panorama URL)
3. **Bio-Controller** - Works fully (pose detection → movement)

**To test with a placeholder image:**
- Upload photos during onboarding
- Manually add a `worldUrl` to a memory in localStorage
- Use a 360° panorama image URL (like from https://www.360cities.net/)

### 5. Manual World URL Setup (For Testing)

If you want to test without API, you can manually add a world URL:

1. Open browser DevTools (F12)
2. Go to Console
3. Run:
```javascript
// Get all memories
const memories = JSON.parse(localStorage.getItem('synapse_ai_memories') || '[]');

// Add a test panorama URL to first memory
if (memories.length > 0) {
  memories[0].worldUrl = 'https://example.com/panorama.jpg'; // Replace with actual 360° image
  localStorage.setItem('synapse_ai_memories', JSON.stringify(memories));
  console.log('World URL added!');
}
```

### 6. Integration Points to Check

#### A. Memory Upload Flow
- ✅ Onboarding includes memory step
- ✅ Photos are stored in localStorage
- ⚠️ **TODO:** Connect to world generation API in `MemoryUpload.tsx`

#### B. World Generation
- ✅ API functions ready in `utils/worldGenerator.ts`
- ⚠️ **TODO:** Call `generateWorldFromPrompt()` after photo upload

#### C. Exercise Screen
- ✅ Detects memory from URL parameter
- ✅ Loads 3D world if `worldUrl` exists
- ✅ Bio-controller integrated

### 7. Code Changes Needed (If Using API)

Update `components/MemoryUpload.tsx` to generate world after upload:

```typescript
// In handleSubmit function, after creating memory:
const handleSubmit = async () => {
  // ... existing code ...
  
  // Generate world from description
  if (description.trim()) {
    setIsGenerating(true);
    const prompt = createPromptFromDescription(description);
    const worldResult = await generateWorldFromPrompt(prompt);
    
    if (worldResult.success && worldResult.worldUrl) {
      memory.worldUrl = worldResult.worldUrl;
    }
    setIsGenerating(false);
  }
  
  onComplete(memory);
};
```

### 8. Testing Checklist

- [ ] Create `.env.local` with API key
- [ ] Run `npm install` (if not done)
- [ ] Start dev server: `npm run dev`
- [ ] Complete onboarding (including memory upload)
- [ ] Check that photos are saved
- [ ] Go to `/memories` page
- [ ] Start exercise with a memory
- [ ] Verify 3D world loads (or shows loading state)
- [ ] Test pose detection → camera movement

### 9. Troubleshooting

**Issue: "API key not configured" error**
- ✅ Check `.env.local` file exists
- ✅ Verify key is correct
- ✅ Restart dev server after adding env vars

**Issue: 3D world doesn't load**
- ✅ Check browser console for errors
- ✅ Verify `worldUrl` exists in memory object
- ✅ Test with a known 360° panorama URL

**Issue: Bio-controller not working**
- ✅ Check camera permissions
- ✅ Verify pose detection is running
- ✅ Check browser console for errors

### 10. Production Deployment

For production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform:
   - Go to project settings
   - Add `NEXT_PUBLIC_BLOCKADE_API_KEY` or `NEXT_PUBLIC_LUMA_API_KEY`
   - Redeploy

2. **Important:** Never commit `.env.local` to git (it's in `.gitignore`)

### 11. Alternative: Use Static 360° Images

If you don't want to use APIs, you can:

1. Generate 360° panoramas using other tools
2. Host them on a CDN or your server
3. Manually set `worldUrl` in memories
4. The 3D viewer will work with any 360° image URL

**Free 360° Image Resources:**
- https://www.360cities.net/
- https://www.flickr.com/groups/equirectangular/
- Generate with AI tools like Midjourney (prompt: "360 panorama")

---

## Quick Start (Minimal Setup)

If you just want to test the UI flow:

1. **Skip API setup** - The app works without it
2. **Test memory upload** - Photos are stored locally
3. **Add test world URL manually** - Use browser console (see step 5 above)
4. **Test exercise flow** - Everything else works!

The bio-controller and pose detection work independently of the world generation API.

---

## Summary

**Minimum Required:**
- ✅ Nothing! The app works for testing without API keys

**For Full Functionality:**
- ⚠️ API key from Blockade Labs or Luma AI
- ⚠️ `.env.local` file with the key
- ⚠️ Optional: Update `MemoryUpload.tsx` to call world generation API

**Current Status:**
- ✅ All UI components ready
- ✅ 3D world viewer ready
- ✅ Bio-controller ready
- ✅ Memory storage ready
- ⚠️ World generation API integration (needs API key + code update)

