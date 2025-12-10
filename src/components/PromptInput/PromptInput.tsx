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
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        노래 설명
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="만들고 싶은 노래를 설명해주세요... (예: A cheerful pop song about summer vacation with catchy melody)"
        className="w-full h-32 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                   resize-none disabled:opacity-50 disabled:cursor-not-allowed"
        maxLength={4100}
      />
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          {value.length} / 4100자
        </span>
      </div>

      <div className="space-y-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">예시:</span>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example.label}
              onClick={() => onChange(example.prompt)}
              disabled={disabled}
              className="px-3 py-1.5 text-sm rounded-full bg-purple-100 dark:bg-purple-900/30
                         text-purple-700 dark:text-purple-300 hover:bg-purple-200
                         dark:hover:bg-purple-900/50 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
