import type { PlaylistItem } from '../../types';
import { formatDuration } from '../../utils/formatters';

interface PlaylistProps {
  items: PlaylistItem[];
  currentIndex: number;
  isLoopEnabled: boolean;
  isPlaying: boolean;
  onSelect: (index: number) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onToggleLoop: () => void;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function Playlist({
  items,
  currentIndex,
  isLoopEnabled,
  isPlaying,
  onSelect,
  onRemove,
  onClear,
  onToggleLoop,
  onPlayPause,
  onPrevious,
  onNext,
}: PlaylistProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        <p>재생목록이 비어있습니다</p>
        <p className="text-xs mt-1">노래 히스토리에서 + 버튼을 눌러 추가하세요</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          재생목록 ({items.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLoop}
            className={`p-1.5 rounded-lg transition-colors ${
              isLoopEnabled
                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
            title={isLoopEnabled ? '반복 끄기' : '반복 켜기'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400
                       dark:hover:text-red-300 transition-colors"
          >
            전체 삭제
          </button>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center justify-center gap-2 py-2">
        <button
          onClick={onPrevious}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="이전 곡"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>
        <button
          onClick={onPlayPause}
          className="w-10 h-10 flex items-center justify-center rounded-full
                     bg-purple-600 hover:bg-purple-700 text-white transition-colors"
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
        <button
          onClick={onNext}
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="다음 곡"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      {/* Loop indicator */}
      {isLoopEnabled && (
        <div className="text-center text-xs text-purple-600 dark:text-purple-400">
          반복 재생 켜짐
        </div>
      )}

      {/* Playlist items */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors group cursor-pointer ${
              index === currentIndex
                ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700'
                : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            onClick={() => onSelect(index)}
          >
            <div className="w-6 text-center text-sm text-gray-500 dark:text-gray-400">
              {index === currentIndex && isPlaying ? (
                <svg className="w-4 h-4 mx-auto text-purple-600 dark:text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3z" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${
                index === currentIndex
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
                    <span>Instrumental</span>
                  </>
                )}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(item.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg
                         hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-400
                         hover:text-red-500 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
