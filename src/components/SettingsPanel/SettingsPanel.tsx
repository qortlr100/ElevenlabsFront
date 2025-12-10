import { formatDuration } from '../../utils/formatters';

interface SettingsPanelProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  instrumental: boolean;
  onInstrumentalChange: (instrumental: boolean) => void;
  disabled?: boolean;
}

const MIN_DURATION = 3000;   // 3 seconds (API minimum)
const MAX_DURATION = 300000; // 5 minutes (API maximum)

export function SettingsPanel({
  duration,
  onDurationChange,
  instrumental,
  onInstrumentalChange,
  disabled,
}: SettingsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            노래 길이
          </label>
          <span className="text-sm font-mono text-purple-600 dark:text-purple-400">
            {formatDuration(duration)}
          </span>
        </div>
        <input
          type="range"
          min={MIN_DURATION}
          max={MAX_DURATION}
          step={1000}
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none
                     cursor-pointer accent-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>3초</span>
          <span>5분</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            악기만 (Instrumental)
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            보컬 없이 악기만 포함된 음악을 생성합니다
          </p>
        </div>
        <button
          onClick={() => onInstrumentalChange(!instrumental)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                      focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                      disabled:opacity-50 disabled:cursor-not-allowed
                      ${instrumental ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                        ${instrumental ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
    </div>
  );
}
