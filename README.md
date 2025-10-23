# Kaomoji Drop Vibes

An Electron showcase that fills the window with animated kaomoji whenever you click (or double-click) the stage. The vibe leans into dreamy gradients, glassmorphism, and playful motion while respecting reduced-motion preferences.

## Features

- Click anywhere to spawn a burst of floating kaomoji.
- Double-click for an extra-dense rain of characters.
- Keep the pointer moving to trigger a continuous, cursor-following kaomoji drizzle.
- Adaptive color palette that matches the OS light/dark mode.
- Respects `prefers-reduced-motion`, dialing back animation intensity automatically.
- Lightweight Node tests covering the kaomoji pool.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Launch the Electron app:
   ```bash
   npm start
   ```
3. (Optional) Run the test suite:
   ```bash
   npm test
   ```

## Packaging

### Windows (win32 ia32)

```powershell
npx electron-packager . KaomojiDrop --platform=win32 --arch=ia32 --out=dist --overwrite --prune=true
Compress-Archive -Path dist\KaomojiDrop-win32-ia32\* -DestinationPath dist\KaomojiDrop-win32-ia32.zip -Force
```

### macOS (arm64)

```bash
npm run package
```

## Project Structure

```
.
├── index.html          # Renderer entry point
├── main.js             # Main process: window creation
├── preload.js          # Context isolation setup
├── scripts
│   ├── kaomoji.js      # Shared kaomoji helpers & pool
│   └── renderer.js     # Front-end animation logic
├── styles.css          # Global styling & animations
├── tests
│   └── kaomoji.test.js # Node test suite
└── package.json
```

## Notes

- The renderer script is written as an ES module and loaded directly in the BrowserWindow, so no bundler is required.
- Animations are capped and cleaned up automatically to avoid runaway DOM growth, even with the new pointer rain.
- If you add new kaomoji, run `npm test` to ensure they remain unique and valid.
