import type { SongHistoryItem } from '../../types';
import { formatDuration } from '../../utils/formatters';

interface SongHistoryProps {
  items: SongHistoryItem[];
  onSelect: (item: SongHistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onAddToPlaylist?: (item: SongHistoryItem) => void;
  playlistItemIds?: string[];
}

export function SongHistory({
  items,
  onSelect,
  onDelete,
  onClear,
  onAddToPlaylist,
  playlistItemIds = [],
}: SongHistoryProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
        </svg>
        <p>아직 생성된 노래가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          최근 생성 ({items.length})
        </h3>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-600 dark:text-red-400
                     dark:hover:text-red-300 transition-colors"
        >
          전체 삭제
        </button>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50
                       rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
          >
            <button
              onClick={() => onSelect(item)}
              className="flex-1 flex items-center gap-3 text-left min-h-[48px]"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full
                            bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white truncate">
                  {item.prompt}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <span>{formatDuration(item.duration_ms)}</span>
                  {item.instrumental && (
                    <>
                      <span>•</span>
                      <span>Instrumental</span>
                    </>
                  )}
                </div>
              </div>
            </button>
            <div className="flex items-center gap-2 flex-shrink-0">
              {onAddToPlaylist && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPlaylist(item);
                  }}
                  disabled={playlistItemIds.includes(item.id)}
                  className={`p-2.5 rounded-lg transition-all ${
                    playlistItemIds.includes(item.id)
                      ? 'text-purple-400 dark:text-purple-500 cursor-default bg-purple-50 dark:bg-purple-900/20'
                      : 'hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-400 hover:text-purple-500 md:opacity-60 md:group-hover:opacity-100'
                  }`}
                  title={playlistItemIds.includes(item.id) ? '재생목록에 있음' : '재생목록에 추가'}
                >
                  {playlistItemIds.includes(item.id) ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-2.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30
                           text-gray-400 hover:text-red-500 transition-all
                           md:opacity-60 md:group-hover:opacity-100"
                title="삭제"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
