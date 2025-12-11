import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SongGenerator } from './components/SongGenerator';

const CUSTOM_API_KEY_STORAGE_KEY = 'elevenlabs_custom_api_key';

// Default API key from environment variable (hidden from UI)
const DEFAULT_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

function App() {
  // Custom API key entered by user (shown in UI)
  const [customApiKey, setCustomApiKey] = useState(() => {
    return localStorage.getItem(CUSTOM_API_KEY_STORAGE_KEY) || '';
  });

  // Effective API key: use custom key if provided, otherwise use default
  const effectiveApiKey = customApiKey || DEFAULT_API_KEY;

  useEffect(() => {
    if (customApiKey) {
      localStorage.setItem(CUSTOM_API_KEY_STORAGE_KEY, customApiKey);
    } else {
      localStorage.removeItem(CUSTOM_API_KEY_STORAGE_KEY);
    }
  }, [customApiKey]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header apiKey={customApiKey} onApiKeyChange={setCustomApiKey} hasDefaultKey={!!DEFAULT_API_KEY} />
      <main>
        <SongGenerator apiKey={effectiveApiKey} />
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
