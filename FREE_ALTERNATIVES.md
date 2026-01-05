# Free Alternatives for 3D World Generation

## 🎯 Recommended: Direct 360° Image Upload (100% FREE)

**Best option for hackathon/demo - No API needed!**

### How It Works
1. Users upload their own 360° panorama images
2. Images stored locally (or can be hosted on free CDN)
3. Three.js renders the panorama
4. **Completely free, no API keys needed**

### Where to Get Free 360° Panoramas

1. **360Cities.net** - https://www.360cities.net/
   - Thousands of free 360° panoramas
   - Download high-quality images
   - Free to use for personal/non-commercial projects

2. **Create Your Own:**
   - **Google Street View app** - Can create 360° photos
   - **Samsung Galaxy Camera** - Built-in 360° mode
   - **Theta cameras** - If available
   - **Various mobile apps** - Search "360 panorama" in app store

3. **Free Panorama Hosting:**
   - Upload to Imgur (free)
   - Upload to Cloudinary (free tier)
   - Use direct image URLs

### Implementation
✅ **Already implemented!** Just upload a 360° image in the memory upload step.

---

## Option 2: Replicate API (Free Tier Available)

**Cost:** ~$5 free credit (enough for testing/demo)

### Setup
1. Sign up at https://replicate.com/
2. Get API token from https://replicate.com/account/api-tokens
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_REPLICATE_API_TOKEN=your_token_here
   ```

### Usage
- Uses Stable Diffusion to generate panoramas from text
- Free tier: ~$5 credit (good for testing)
- Pay-as-you-go after free tier

---

## Option 3: Hugging Face Inference API (Free Tier)

**Cost:** FREE (with rate limits)

### Setup
1. Sign up at https://huggingface.co/
2. Get API token from https://huggingface.co/settings/tokens
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_HUGGINGFACE_API_KEY=your_key_here
   ```

### Usage
- Free tier available
- Rate limited (fine for demos)
- Uses Stable Diffusion models

---

## Option 4: Manual World URL (For Testing)

You can manually add a world URL to test:

```javascript
// In browser console (F12)
const mems = JSON.parse(localStorage.getItem('synapse_ai_memories') || '[]');
if (mems.length > 0) {
  // Use a free 360° panorama URL
  mems[0].worldUrl = 'https://cdn.360cities.net/images/2012_05/2012_05_18_12_00_00_360.jpg';
  localStorage.setItem('synapse_ai_memories', JSON.stringify(mems));
}
```

---

## 🏆 Recommended Setup for Hackathon

### Best Approach: Direct Upload (FREE)

1. **No API keys needed**
2. **No costs**
3. **Works immediately**
4. **Simple for users**

### Steps:
1. User uploads a 360° panorama image (or you provide sample images)
2. Image is stored locally
3. Three.js renders it
4. Done!

### For Demo:
- Pre-upload a few sample 360° panoramas
- Show users how to upload their own
- Mention 360Cities.net as a free resource

---

## Comparison

| Method | Cost | Setup Time | Quality | Best For |
|--------|------|------------|---------|----------|
| **Direct Upload** | FREE | 0 min | High | Hackathons, Demos |
| Replicate API | ~$5 free | 5 min | Good | AI generation |
| Hugging Face | FREE | 5 min | Good | Free AI generation |
| Manual URL | FREE | 1 min | High | Testing |

---

## Updated Code

The code has been updated to support:
- ✅ Direct 360° panorama upload (FREE, no API)
- ✅ Replicate API (free tier)
- ✅ Hugging Face API (free tier)

**You can use any of these options!**

---

## Quick Start (Recommended)

1. **Skip API setup entirely**
2. **Use direct 360° image upload**
3. **Get free panoramas from 360Cities.net**
4. **Upload during memory creation**
5. **Done!**

This is the fastest, cheapest, and easiest option for a hackathon demo!

