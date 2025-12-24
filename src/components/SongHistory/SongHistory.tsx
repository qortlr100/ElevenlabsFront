import type { SongHistoryItem } from '../../types';
import { formatDuration } from '../../utils/formatters';

interface SongHistoryProps {
  items: SongHistoryItem[];
  onSelect: (item: SongHistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onAddToPlaylist?: (item: SongHistoryItem) => void;
  onDownload?: (item: SongHistoryItem) => void;
  playlistItemIds?: string[];
}

export function SongHistory({
  items,
  onSelect,
  onDelete,
  onClear,
  onAddToPlaylist,
  onDownload,
  playlistItemIds = [],
}: SongHistoryProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-[#b3b3b3]">
        <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
        </svg>
        <p className="text-base font-medium">아직 생성된 노래가 없습니다</p>
        <p className="text-sm mt-1 opacity-70">노래를 생성하면 여기에 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4 py-2 text-xs text-[#b3b3b3] border-b border-[#282828]">
        <div className="flex items-center gap-4">
          <span className="w-8 text-center">#</span>
          <span>제목</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block w-16 text-right">길이</span>
          <button
            onClick={onClear}
            className="text-[#b3b3b3] hover:text-white transition-colors text-xs"
          >
            전체 삭제
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1 max-h-[400px] overflow-y-auto">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group flex items-center gap-4 px-4 py-2 rounded-md spotify-track-row cursor-pointer"
            onClick={() => onSelect(item)}
          >
            {/* Track Number / Play Icon */}
            <div className="w-8 flex items-center justify-center text-[#b3b3b3]">
              <span className="group-hover:hidden text-sm">{index + 1}</span>
              <svg className="w-4 h-4 hidden group-hover:block text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate group-hover:text-white" title={item.prompt}>
                {item.prompt}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#b3b3b3]">
                {item.instrumental && (
                  <span className="px-1.5 py-0.5 rounded bg-[#282828] text-[10px] uppercase tracking-wider">
                    Instrumental
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Add to Playlist */}
              {onAddToPlaylist && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToPlaylist(item);
                  }}
                  disabled={playlistItemIds.includes(item.id)}
                  className={`p-2 rounded-full transition-all ${
                    playlistItemIds.includes(item.id)
                      ? 'text-[#1DB954] cursor-default'
                      : 'text-[#b3b3b3] hover:text-white opacity-0 group-hover:opacity-100'
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

              {/* Download */}
              {onDownload && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item);
                  }}
                  className="p-2 rounded-full text-[#b3b3b3] hover:text-white
                             opacity-0 group-hover:opacity-100 transition-all"
                  title="다운로드"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              )}

              {/* Duration */}
              <span className="hidden sm:block w-12 text-right text-sm text-[#b3b3b3]">
                {formatDuration(item.duration_ms)}
              </span>

              {/* Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-2 rounded-full text-[#b3b3b3] hover:text-white
                           opacity-0 group-hover:opacity-100 transition-all"
                title="삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
