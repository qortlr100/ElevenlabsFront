interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const EXAMPLE_PROMPTS = [
  { label: 'K-Pop', prompt: 'A catchy K-pop song about falling in love, with energetic beats and Korean lyrics' },
  { label: 'Lo-Fi', prompt: 'A relaxing lo-fi hip hop beat with smooth piano melodies, perfect for studying' },
  { label: 'Rock', prompt: 'An energetic rock anthem with powerful guitar riffs and driving drums' },
  { label: 'Jazz', prompt: 'A smooth jazz piece with saxophone solo and soft piano accompaniment' },
  { label: 'EDM', prompt: 'An uplifting electronic dance music track with euphoric synths and heavy bass drops' },
  { label: 'Classical', prompt: 'A beautiful orchestral piece with strings and piano, evoking feelings of hope' },
];

export function PromptInput({ value, onChange, disabled }: PromptInputProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white">
        노래 설명
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="만들고 싶은 노래를 설명해주세요... (예: A cheerful pop song about summer vacation)"
        className="w-full h-28 px-4 py-3 rounded-lg bg-[#282828] border border-transparent
                   text-white text-sm placeholder-[#727272]
                   focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]
                   resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        maxLength={4100}
      />
      <div className="flex justify-between items-center text-xs">
        <span className="text-[#b3b3b3]">
          {value.length} / 4100
        </span>
      </div>

      <div className="space-y-2">
        <span className="text-xs text-[#b3b3b3]">빠른 선택:</span>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example.label}
              onClick={() => onChange(example.prompt)}
              disabled={disabled}
              className="px-3 py-1.5 text-xs rounded-full bg-[#282828] text-[#b3b3b3]
                         hover:bg-[#3e3e3e] hover:text-white transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed
                         border border-transparent hover:border-[#535353]"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
