# Quick Setup Guide - 3D World Feature

## 🚀 Fastest Way to Get Started

### Step 1: Create Environment File

Create `.env.local` in `synapse-ai-web/` folder:

```bash
# Windows PowerShell
New-Item -Path .env.local -ItemType File

# Or manually create the file
```

### Step 2: Add API Key (Optional)

Open `.env.local` and add:

```env
NEXT_PUBLIC_BLOCKADE_API_KEY=your_key_here
```

**Get API Key:**
- Visit https://www.blockadelabs.com/
- Sign up (free tier available)
- Get API key from dashboard
- Paste in `.env.local`

### Step 3: Install & Run

```bash
cd synapse-ai-web
npm install
npm run dev
```

### Step 4: Test

1. Open http://localhost:3000
2. Complete onboarding (including memory upload)
3. Go to Dashboard → "Memory Worlds"
4. Start exercise with a memory

---

## ⚡ Testing Without API Key

The app works without API keys! You can:

1. **Upload photos** - Stored locally ✅
2. **Test UI flow** - All screens work ✅
3. **Test pose detection** - Bio-controller works ✅
4. **Add test world manually** - See below

### Add Test World URL Manually

1. Open browser DevTools (F12)
2. Go to Console tab
3. Run:

```javascript
// Get memories
const mems = JSON.parse(localStorage.getItem('synapse_ai_memories') || '[]');
if (mems.length > 0) {
  // Use a free 360° panorama
  mems[0].worldUrl = 'https://cdn.360cities.net/images/2012_05/2012_05_18_12_00_00_360.jpg';
  localStorage.setItem('synapse_ai_memories', JSON.stringify(mems));
  console.log('✅ Test world URL added!');
}
```

4. Refresh and start exercise with that memory

---

## ✅ What Works Right Now

- ✅ Memory upload & storage
- ✅ Memory gallery page
- ✅ 3D world viewer component
- ✅ Bio-controller (pose → movement)
- ✅ Exercise screen with 3D mode
- ✅ All UI components

## ⚠️ What Needs API Key

- ⚠️ Automatic world generation from photos
- ⚠️ AI-powered 360° panorama creation

**But:** You can manually add world URLs and everything else works!

---

## 📝 Summary

**Minimum Setup:** Just run `npm install && npm run dev` - everything works for testing!

**Full Setup:** Add API key to `.env.local` for automatic world generation.

**Current Status:** 95% complete - just needs API key for world generation feature.

