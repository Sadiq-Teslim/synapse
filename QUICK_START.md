# Quick Start Guide - Synapse AI Web App

## Prerequisites

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Webcam/camera for exercise detection

## Installation (3 Steps)

### 1. Install Dependencies

```bash
cd synapse-ai-web
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- MediaPipe Pose
- Recharts
- Tailwind CSS
- TypeScript

### 2. Start Development Server

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 14.0.4
  - Local:        http://localhost:3000
  - Ready in 2.5s
```

### 3. Open in Browser

Open your browser and navigate to:
**http://localhost:3000**

## First Run

1. **Allow Camera Access** - When prompted, click "Allow" to grant camera permissions
2. **Welcome Screen** - Read the welcome message and click "Start Your Recovery Journey"
3. **Dashboard** - View your stats (empty initially)
4. **Start Exercise** - Click "Start New Exercise" button
5. **Exercise** - Stand in front of camera and perform shoulder raise exercises
6. **Summary** - View your session results

## Testing Tips

- **Lighting**: Ensure good lighting for pose detection
- **Distance**: Stand 6-8 feet from camera, chest height
- **Position**: Make sure full upper body is visible
- **Exercise**: Slowly raise your arms to shoulder level

## Troubleshooting

### Camera Not Working
- Check browser permissions (lock icon in address bar)
- Try refreshing the page
- Use Chrome/Edge for best compatibility

### Pose Detection Not Working
- Ensure good lighting
- Stand further from camera
- Make sure full body is visible

### Build Errors
```bash
# Clean install
rm -rf node_modules .next package-lock.json
npm install
npm run dev
```

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
```

## Project Structure

```
synapse-ai-web/
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx           # Home page
│   ├── exercise/          # Exercise screen
│   └── summary/           # Summary screen
├── components/            # React components
├── utils/                 # Business logic
├── types/                 # TypeScript types
└── package.json          # Dependencies
```

## Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Next Steps

- Complete an exercise session
- View your progress on the dashboard
- Track improvements over time

## Need Help?

- Check the main README.md for detailed documentation
- Review browser console for errors (F12)
- Ensure all dependencies installed correctly

---

**Ready to go? Run `npm install` then `npm run dev`!** 🚀

