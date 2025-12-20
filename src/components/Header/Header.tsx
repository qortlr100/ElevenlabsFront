import { useState } from 'react';

interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  hasDefaultKey?: boolean;
}

export function Header({ apiKey, onApiKeyChange, hasDefaultKey = false }: HeaderProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <header className="bg-gradient-to-b from-[#1DB954]/20 to-[#121212] sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
              <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                ElevenLabs Music
              </h1>
              <p className="text-xs text-[#b3b3b3]">
                AI Song Generator
              </p>
            </div>
          </div>

          {/* API Key Input */}
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => onApiKeyChange(e.target.value)}
                placeholder={hasDefaultKey ? "커스텀 API Key (선택사항)" : "API Key 입력..."}
                className="w-full px-4 py-2.5 pr-20 rounded-full bg-[#282828] border border-transparent
                           text-white text-sm placeholder-[#727272]
                           focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]
                           transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {hasDefaultKey && !apiKey && (
                  <span className="px-2 py-0.5 rounded-full bg-[#1DB954]/20 text-[#1DB954] text-[10px] font-medium">
                    기본 키
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="p-1.5 text-[#b3b3b3] hover:text-white transition-colors rounded-full
                             hover:bg-[#404040]"
                  aria-label={showApiKey ? 'API 키 숨기기' : 'API 키 보기'}
                >
                  {showApiKey ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
