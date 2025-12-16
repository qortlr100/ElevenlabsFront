import { formatDuration } from '../../utils/formatters';
import type { OutputFormat } from '../../types';

interface SettingsPanelProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  instrumental: boolean;
  onInstrumentalChange: (instrumental: boolean) => void;
  outputFormat: OutputFormat;
  onOutputFormatChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

const OUTPUT_FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: 'mp3_22050_32', label: '32kbps' },
  { value: 'mp3_24000_48', label: '48kbps' },
  { value: 'mp3_44100_64', label: '64kbps' },
  { value: 'mp3_44100_96', label: '96kbps' },
  { value: 'mp3_44100_128', label: '128kbps' },
  { value: 'mp3_44100_192', label: '192kbps' },
];

const MIN_DURATION = 3000;   // 3 seconds (API minimum)
const MAX_DURATION = 300000; // 5 minutes (API maximum)

export function SettingsPanel({
  duration,
  onDurationChange,
  instrumental,
  onInstrumentalChange,
  outputFormat,
  onOutputFormatChange,
  disabled,
}: SettingsPanelProps) {
  const progress = ((duration - MIN_DURATION) / (MAX_DURATION - MIN_DURATION)) * 100;

  return (
    <div className="space-y-5">
      {/* Duration Slider */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-white">
            노래 길이
          </label>
          <span className="text-sm font-medium text-[#1DB954] tabular-nums">
            {formatDuration(duration)}
          </span>
        </div>
        <div className="relative h-4 flex items-center">
          <div className="absolute w-full h-1 bg-[#4d4d4d] rounded-full">
            <div
              className="absolute h-full bg-[#1DB954] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <input
            type="range"
            min={MIN_DURATION}
            max={MAX_DURATION}
            step={1000}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            disabled={disabled}
            className="absolute w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div
            className="absolute w-3 h-3 bg-white rounded-full shadow-md pointer-events-none"
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-[#727272]">
          <span>3초</span>
          <span>5분</span>
        </div>
      </div>

      {/* Instrumental Toggle & Output Format */}
      <div className="flex items-center gap-4">
        {/* Instrumental Toggle */}
        <div className="flex-1">
          <button
            onClick={() => onInstrumentalChange(!instrumental)}
            disabled={disabled}
            className={`w-full py-2.5 px-4 rounded-full text-sm font-medium transition-all
                        disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                        ${instrumental
                          ? 'bg-[#1DB954] text-black'
                          : 'bg-[#282828] text-[#b3b3b3] hover:bg-[#3e3e3e] hover:text-white border border-[#535353]'
                        }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
            </svg>
            Instrumental
          </button>
        </div>

        {/* Output Format */}
        <div className="flex-1">
          <select
            value={outputFormat}
            onChange={(e) => onOutputFormatChange(e.target.value as OutputFormat)}
            disabled={disabled}
            className="w-full py-2.5 px-4 rounded-full bg-[#282828] border border-[#535353]
                       text-sm text-[#b3b3b3] cursor-pointer
                       focus:outline-none focus:border-[#1DB954] focus:ring-1 focus:ring-[#1DB954]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-all
                       appearance-none text-center"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23b3b3b3'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              backgroundSize: '16px',
              paddingRight: '36px',
            }}
          >
            {OUTPUT_FORMAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
