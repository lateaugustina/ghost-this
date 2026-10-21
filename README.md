# GHOST THINGS (Haunted Retro Terminal)

A retro-pixel interactive Halloween web experience and vintage archival poster generator.

Type down the things, worries, or habits you want to "ghost" this year. The CRT computer prints them onto an authentic physical fax/receipt, seals them with a playful **Little Devil Stamp**, and transforms your entries into a collectible 3:4 high-resolution printable archival poster.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Audio Engine**: Zero-dependency Web Audio API synthesizer (`src/utils/audio.ts`)
- **Export Engine**: [html-to-image](https://github.com/bubkoo/html-to-image) (2.5x high-res PNG export with mobile save sheet fallback)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### 3. Build for Production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

### 4. Preview Production Build Locally
```bash
npm run preview
```

---

## 🚢 Deploying to Vercel

The project includes an optimized `vercel.json` configuration for one-click deployment.

### Option A: Via GitHub (Recommended)
1. Push this repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework preset will automatically detect **Vite**.
5. Click **"Deploy"**.

### Option B: Via Vercel CLI
```bash
npm i -g vercel
vercel
```
Follow the interactive prompts to deploy.

---

## 📦 Project Structure

```text
├── index.html                  # HTML entry point with retro Google Fonts
├── vercel.json                 # Vercel SPA routing and build configuration
├── vite.config.ts              # Vite configuration
├── package.json                # Project dependencies and scripts
├── public/                     # Static public assets
│   ├── assets/images/          # Public fallback image assets
│   └── ghost-things-release.zip# Direct download project archive
└── src/
    ├── assets/images/          # Pixel art sprites, background base, and textures
    ├── components/
    │   ├── DevilStampSeal.tsx  # Vector Little Devil Stamp rubber imprint
    │   ├── DevilStampTool.tsx  # Physical wooden-handled stamp tool animation
    │   └── PosterModal.tsx     # 3:4 collectible poster & 2.5x PNG export modal
    ├── utils/
    │   └── audio.ts            # Web Audio API synthesizers (typing, fax feed, stamp)
    ├── App.tsx                 # Main stage, dialogue engine, input, and receipt
    ├── main.tsx                # React application entry
    └── index.css               # Tailwind CSS & pixel art clip-path utilities
```

---

## 📜 License

Apache-2.0
