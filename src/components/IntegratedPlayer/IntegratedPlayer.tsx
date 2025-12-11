import type { SongHistoryItem } from '../../types';
import { formatTime, formatDuration } from '../../utils/formatters';

interface IntegratedPlayerProps {
  // Audio player state
  isPlaying: boolean;
  isLooping: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onToggle: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleLoop: () => void;
  onDownload?: () => void;

  // Playlist state
  items: SongHistoryItem[];
  currentIndex: number;
  isLoopEnabled: boolean;
  isPlaylistMode: boolean;
  onSelect: (index: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onTogglePlaylistLoop: () => void;
  onPrevious: () => void;
  onNext: () => void;

  // Current song info
  currentTitle: string;
  disabled?: boolean;
}

export function IntegratedPlayer({
  isPlaying,
  isLooping,
  currentTime,
  duration,
  volume,
  onToggle,
  onSeek,
  onVolumeChange,
  onToggleLoop,
  onDownload,
  items,
  currentIndex,
  isLoopEnabled,
  isPlaylistMode,
  onSelect,
  onRemove,
  onClear,
  onTogglePlaylistLoop,
  onPrevious,
  onNext,
  currentTitle,
  disabled,
}: IntegratedPlayerProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPlaylist = items.length > 0;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
      {/* Now Playing Section */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/20">
            {isPlaying ? (
              <svg className="w-6 h-6 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3z" />
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
              </svg>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">
                {isPlaylistMode ? '재생목록 재생 중' : '현재 재생 중'}
              </h3>
              {isPlaylistMode && hasPlaylist && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20">
                  {currentIndex + 1} / {items.length}
                </span>
              )}
            </div>
            <p className="text-sm text-white/80 truncate">
              {currentTitle || '재생할 곡을 선택하세요'}
            </p>
          </div>
        </div>
      </div>

      {/* Player Controls */}
      <div className="p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
        {/* Progress Bar */}
        <div className="space-y-1">
          <div
            className="relative h-2 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer"
            onClick={(e) => {
              if (disabled || duration === 0) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              onSeek(percentage * duration);
            }}
          >
            <div
              className="absolute h-full bg-purple-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {/* Previous */}
            <button
              onClick={onPrevious}
              disabled={!hasPlaylist}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700
                         transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="이전 곡"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={onToggle}
              disabled={disabled}
              className="w-12 h-12 flex items-center justify-center rounded-full
                         bg-purple-600 hover:bg-purple-700 text-white transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button
              onClick={onNext}
              disabled={!hasPlaylist}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700
                         transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="다음 곡"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Volume */}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="w-16 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none
                           cursor-pointer accent-purple-600"
              />
            </div>

            {/* Single Track Loop */}
            <button
              onClick={onToggleLoop}
              className={`p-2 rounded-lg transition-colors ${
                isLooping
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
              title={isLooping ? '한곡 반복 끄기' : '한곡 반복 켜기'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
              </svg>
            </button>

            {/* Download */}
            {onDownload && (
              <button
                onClick={onDownload}
                disabled={disabled}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300
                           dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="다운로드"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Section */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="p-3 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            재생목록 ({items.length})
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePlaylistLoop}
              disabled={!hasPlaylist}
              className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 ${
                isLoopEnabled
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
              title={isLoopEnabled ? '전체 반복 끄기' : '전체 반복 켜기'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            {hasPlaylist && (
              <button
                onClick={onClear}
                className="text-xs text-red-500 hover:text-red-600 dark:text-red-400
                           dark:hover:text-red-300 transition-colors px-2 py-1 rounded
                           hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                전체 삭제
              </button>
            )}
          </div>
        </div>

        {hasPlaylist ? (
          <div className="max-h-64 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer group ${
                  index === currentIndex && isPlaylistMode
                    ? 'bg-purple-50 dark:bg-purple-900/20 border-l-4 border-purple-600'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 border-l-4 border-transparent'
                }`}
                onClick={() => onSelect(index)}
              >
                <div className="w-6 text-center text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                  {index === currentIndex && isPlaylistMode && isPlaying ? (
                    <svg className="w-4 h-4 mx-auto text-purple-600 dark:text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3z" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm truncate ${
                    index === currentIndex && isPlaylistMode
                      ? 'text-purple-700 dark:text-purple-300 font-medium'
                      : 'text-gray-900 dark:text-white'
                  }`}>
                    {item.prompt}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>{formatDuration(item.duration_ms)}</span>
                    {item.instrumental && (
                      <>
                        <span>•</span>
                        <span>Inst</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.id);
                  }}
                  className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30
                             text-gray-400 hover:text-red-500 transition-all
                             opacity-0 group-hover:opacity-100 flex-shrink-0"
                  title="재생목록에서 제거"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <svg className="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <p className="text-sm">재생목록이 비어있습니다</p>
            <p className="text-xs mt-1">히스토리에서 곡을 추가하세요</p>
          </div>
        )}
      </div>
    </div>
  );
}
