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
    <div className="min-h-screen bg-[#121212] text-white flex flex-col">
      <Header apiKey={customApiKey} onApiKeyChange={setCustomApiKey} hasDefaultKey={!!DEFAULT_API_KEY} />
      <main className="flex-1 pb-24">
        <SongGenerator apiKey={effectiveApiKey} />
      </main>
    </div>
  );
}

export default App;
