interface HeaderProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function Header({ apiKey, onApiKeyChange }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              ElevenLabs Song Generator
            </h1>
            <p className="text-purple-200 text-sm mt-1">
              AI로 나만의 노래를 만들어보세요
            </p>
          </div>
          <div className="flex-1 max-w-md">
            <label className="block text-sm text-purple-200 mb-1">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => onApiKeyChange(e.target.value)}
              placeholder="xi-..."
              className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20
                         text-white placeholder-purple-300 focus:outline-none focus:ring-2
                         focus:ring-white/50 text-sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
