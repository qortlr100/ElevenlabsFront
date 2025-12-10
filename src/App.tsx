import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SongGenerator } from './components/SongGenerator';

const API_KEY_STORAGE_KEY = 'elevenlabs_api_key';

function App() {
  const [apiKey, setApiKey] = useState(() => {
    // First check localStorage, then fall back to environment variable
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey) {
      return storedKey;
    }
    // Use environment variable if available (set during build via GitHub Secrets)
    return import.meta.env.VITE_ELEVENLABS_API_KEY || '';
  });

  useEffect(() => {
    if (apiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  }, [apiKey]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header apiKey={apiKey} onApiKeyChange={setApiKey} />
      <main>
        <SongGenerator apiKey={apiKey} />
      </main>
      <footer className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
        Powered by{' '}
        <a
          href="https://elevenlabs.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
        >
          ElevenLabs
        </a>{' '}
        Music API
      </footer>
    </div>
  );
}

export default App;
