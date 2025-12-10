# ElevenLabs Song Generator

AI-powered song generator using ElevenLabs API. Built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Generate songs from text prompts using ElevenLabs AI
- Audio player with playback controls
- Song history management
- Customizable settings (voice, instrumental mode)

## Getting Started

### Prerequisites

- Node.js 20+
- npm
- ElevenLabs API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/qortlr100/ElevenlabsFront.git
cd ElevenlabsFront
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file from the example:
```bash
cp .env.example .env
```

4. Add your ElevenLabs API key to `.env`:
```env
VITE_ELEVENLABS_API_KEY=your_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

## GitHub Secrets Setup

To enable CI/CD with GitHub Actions, you need to configure GitHub Secrets:

### Setting up `ELEVENLABS_API_KEY` Secret

1. Go to your GitHub repository
2. Navigate to **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secret:
   - **Name**: `ELEVENLABS_API_KEY`
   - **Value**: Your ElevenLabs API key

### Workflows

This project includes the following GitHub Actions workflows:

#### CI Workflow (`.github/workflows/ci.yml`)
- Runs on push to `main` and `develop` branches
- Runs on pull requests to `main` and `develop` branches
- Performs linting and builds the application
- Uses `ELEVENLABS_API_KEY` secret for build

#### Deploy Workflow (`.github/workflows/deploy.yml`)
- Deploys to GitHub Pages on push to `main` branch
- Can be triggered manually via workflow dispatch
- Uses `ELEVENLABS_API_KEY` secret for production build

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ELEVENLABS_API_KEY` | ElevenLabs API key for TTS/music generation | Yes |

## Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **API**: ElevenLabs

## Project Structure

```
src/
├── components/       # React components
│   ├── AudioPlayer/  # Audio playback component
│   ├── Header/       # App header
│   ├── PromptInput/  # Text input for prompts
│   ├── SettingsPanel/# Settings configuration
│   ├── SongGenerator/# Main generator component
│   └── SongHistory/  # Generated songs history
├── services/         # API services
├── types/            # TypeScript type definitions
├── App.tsx           # Main app component
└── main.tsx          # Entry point
```

## License

MIT
