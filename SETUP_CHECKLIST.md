# Setup Checklist - What You Need to Set

## ✅ Already Complete (No Action Needed)

- ✅ All code components implemented
- ✅ UI components ready
- ✅ 3D world viewer ready
- ✅ Bio-controller ready
- ✅ Memory storage ready
- ✅ Exercise screen integration ready

## ⚠️ What You Need to Set

### 1. Environment Variables (Required for World Generation)

**File to create:** `.env.local` in `synapse-ai-web/` folder

**Content:**
```env
NEXT_PUBLIC_BLOCKADE_API_KEY=your_api_key_here
```

**How to get API key:**
1. Visit https://www.blockadelabs.com/
2. Sign up (free tier available)
3. Go to API section
4. Copy your API key
5. Paste in `.env.local`

**Alternative:** Use Luma AI instead
```env
NEXT_PUBLIC_LUMA_API_KEY=your_luma_key_here
```

### 2. Install Dependencies (One-time)

```bash
cd synapse-ai-web
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

---

## 🎯 Quick Decision Tree

### Option A: Test Everything (No API Key Needed)
- ✅ Run `npm install && npm run dev`
- ✅ Test memory upload (photos stored locally)
- ✅ Test UI flow
- ✅ Test pose detection
- ⚠️ Manually add test world URL (see below)

### Option B: Full Functionality (API Key Needed)
- ✅ Create `.env.local` with API key
- ✅ Run `npm install && npm run dev`
- ✅ Everything works automatically!

---

## 📋 Setup Steps Summary

1. **Create `.env.local` file**
   - Location: `synapse-ai-web/.env.local`
   - Add: `NEXT_PUBLIC_BLOCKADE_API_KEY=your_key`

2. **Get API Key** (if you want automatic world generation)
   - Sign up at https://www.blockadelabs.com/
   - Get API key from dashboard

3. **Install & Run**
   ```bash
   npm install
   npm run dev
   ```

4. **Test**
   - Complete onboarding
   - Upload memory photos
   - Start exercise with memory

---

## 🔧 Manual Testing (Without API)

If you don't have an API key yet, you can still test:

1. **Upload photos** - Works without API ✅
2. **Add test world URL manually:**
   ```javascript
   // In browser console (F12)
   const mems = JSON.parse(localStorage.getItem('synapse_ai_memories') || '[]');
   if (mems.length > 0) {
     mems[0].worldUrl = 'https://cdn.360cities.net/images/2012_05/2012_05_18_12_00_00_360.jpg';
     localStorage.setItem('synapse_ai_memories', JSON.stringify(mems));
   }
   ```
3. **Test exercise** - Everything else works! ✅

---

## 📝 Files You Need to Create

1. **`.env.local`** (in `synapse-ai-web/` folder)
   - Copy from `.env.example` (if it exists)
   - Add your API key

That's it! Everything else is already set up.

---

## ✅ Verification

After setup, verify:

- [ ] `.env.local` file exists
- [ ] API key is in `.env.local`
- [ ] `npm install` completed successfully
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Memory upload works
- [ ] Exercise screen loads

---

## 🚨 Common Issues

**"API key not configured"**
- ✅ Check `.env.local` exists
- ✅ Restart dev server after creating file
- ✅ Verify key format is correct

**3D world doesn't load**
- ✅ Check browser console for errors
- ✅ Verify `worldUrl` exists in memory
- ✅ Test with a known 360° image URL

**Dependencies error**
- ✅ Run `npm install` again
- ✅ Delete `node_modules` and `package-lock.json`, then `npm install`

---

## 📚 Documentation Files

- `3D_SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_SETUP.md` - Fast setup guide
- `SYNAPSE_CHRONOS_PLAN.md` - Technical architecture

---

## Summary

**Minimum Setup:** Just run `npm install && npm run dev` - 95% works!

**Full Setup:** Add API key to `.env.local` for 100% functionality.

**Time Required:** 5 minutes (just API key setup)

