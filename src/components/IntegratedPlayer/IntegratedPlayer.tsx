import { useState } from 'react';
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
  const [showQueue, setShowQueue] = useState(false);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  const [isProgressHovered, setIsProgressHovered] = useState(false);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPlaylist = items.length > 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    onSeek(percentage * duration);
  };

  return (
    <>
      {/* Bottom Fixed Player Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-[#181818] border-t border-[#282828] px-4 z-50">
        <div className="h-full max-w-screen-2xl mx-auto grid grid-cols-3 items-center gap-4">
          {/* Left Section - Now Playing */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Album Art Placeholder */}
            <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center flex-shrink-0">
              {isPlaying ? (
                <div className="flex items-end gap-[2px] h-4">
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                  <div className="equalizer-bar" />
                </div>
              ) : (
                <svg className="w-6 h-6 text-[#b3b3b3]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                </svg>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
                {currentTitle || '재생할 곡을 선택하세요'}
              </p>
              <p className="text-xs text-[#b3b3b3] truncate">
                {isPlaylistMode && hasPlaylist ? `재생목록 ${currentIndex + 1}/${items.length}` : 'AI Generated Music'}
              </p>
            </div>
            {/* Like Button (placeholder) */}
            <button className="p-2 text-[#b3b3b3] hover:text-white transition-colors flex-shrink-0 hidden sm:block">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>

          {/* Center Section - Player Controls */}
          <div className="flex flex-col items-center gap-1 max-w-[722px] w-full">
            {/* Control Buttons */}
            <div className="flex items-center gap-2">
              {/* Shuffle (disabled placeholder) */}
              <button
                className="p-2 text-[#b3b3b3] hover:text-white transition-colors opacity-50 cursor-not-allowed hidden sm:block"
                disabled
                title="셔플 (준비 중)"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" />
                </svg>
              </button>

              {/* Previous */}
              <button
                onClick={onPrevious}
                disabled={!hasPlaylist}
                className="p-2 text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="이전 곡"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={onToggle}
                disabled={disabled}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                title={isPlaying ? '일시정지' : '재생'}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Next */}
              <button
                onClick={onNext}
                disabled={!hasPlaylist}
                className="p-2 text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="다음 곡"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>

              {/* Repeat */}
              <button
                onClick={onToggleLoop}
                className={`p-2 transition-colors hidden sm:block relative ${
                  isLooping ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
                }`}
                title={isLooping ? '한곡 반복 끄기' : '한곡 반복 켜기'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
                </svg>
                {isLooping && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1DB954]" />
                )}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center gap-2 w-full">
              <span className="text-[11px] text-[#b3b3b3] w-10 text-right tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-3 flex items-center spotify-progress-container group cursor-pointer"
                style={{ '--progress': `${progress}%` } as React.CSSProperties}
                onMouseEnter={() => setIsProgressHovered(true)}
                onMouseLeave={() => setIsProgressHovered(false)}
                onClick={handleProgressClick}
              >
                <div className="relative w-full h-1 bg-[#4d4d4d] rounded-full group-hover:h-1">
                  <div
                    className={`absolute h-full rounded-full transition-colors ${
                      isProgressHovered ? 'bg-[#1DB954]' : 'bg-white'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-opacity ${
                      isProgressHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ left: `calc(${progress}% - 6px)` }}
                  />
                </div>
              </div>
              <span className="text-[11px] text-[#b3b3b3] w-10 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Right Section - Volume & Other Controls */}
          <div className="flex items-center justify-end gap-2">
            {/* Queue Button */}
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={`p-2 transition-colors ${
                showQueue ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title="재생목록"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
              </svg>
            </button>

            {/* Playlist Loop */}
            <button
              onClick={onTogglePlaylistLoop}
              disabled={!hasPlaylist}
              className={`p-2 transition-colors disabled:opacity-30 ${
                isLoopEnabled ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'
              }`}
              title={isLoopEnabled ? '전체 반복 끄기' : '전체 반복 켜기'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Volume Control */}
            <div
              className="flex items-center gap-1 spotify-volume-container"
              style={{ '--progress': `${volume * 100}%` } as React.CSSProperties}
              onMouseEnter={() => setIsVolumeHovered(true)}
              onMouseLeave={() => setIsVolumeHovered(false)}
            >
              <button
                onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
                className="p-2 text-[#b3b3b3] hover:text-white transition-colors"
              >
                {volume === 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <div className="w-24 h-3 hidden sm:flex items-center group">
                <div className="relative w-full h-1 bg-[#4d4d4d] rounded-full">
                  <div
                    className={`absolute h-full rounded-full transition-colors ${
                      isVolumeHovered ? 'bg-[#1DB954]' : 'bg-white'
                    }`}
                    style={{ width: `${volume * 100}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={volume}
                    onChange={(e) => onVolumeChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md transition-opacity pointer-events-none ${
                      isVolumeHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ left: `calc(${volume * 100}% - 6px)` }}
                  />
                </div>
              </div>
            </div>

            {/* Download */}
            {onDownload && (
              <button
                onClick={onDownload}
                disabled={disabled}
                className="p-2 text-[#b3b3b3] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed hidden sm:block"
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

      {/* Queue Panel (Slide-up) */}
      {showQueue && (
        <div className="fixed bottom-[90px] right-4 w-80 max-h-[60vh] bg-[#282828] rounded-lg shadow-2xl overflow-hidden z-40">
          <div className="p-4 border-b border-[#404040] flex justify-between items-center">
            <h3 className="font-bold text-white">재생목록</h3>
            <div className="flex items-center gap-2">
              {hasPlaylist && (
                <button
                  onClick={onClear}
                  className="text-xs text-[#b3b3b3] hover:text-white transition-colors"
                >
                  전체 삭제
                </button>
              )}
              <button
                onClick={() => setShowQueue(false)}
                className="p-1 text-[#b3b3b3] hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {hasPlaylist ? (
            <div className="max-h-[50vh] overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 px-4 py-2 spotify-track-row cursor-pointer group ${
                    index === currentIndex && isPlaylistMode ? 'bg-[#ffffff1a]' : ''
                  }`}
                  onClick={() => onSelect(index)}
                >
                  <div className="w-6 text-center flex-shrink-0">
                    {index === currentIndex && isPlaylistMode && isPlaying ? (
                      <div className="flex items-end justify-center gap-[2px] h-4">
                        <div className="equalizer-bar" style={{ height: '8px' }} />
                        <div className="equalizer-bar" style={{ height: '12px' }} />
                        <div className="equalizer-bar" style={{ height: '6px' }} />
                      </div>
                    ) : (
                      <span className={`text-sm ${
                        index === currentIndex && isPlaylistMode ? 'text-[#1DB954]' : 'text-[#b3b3b3]'
                      } group-hover:hidden`}>
                        {index + 1}
                      </span>
                    )}
                    {!(index === currentIndex && isPlaylistMode && isPlaying) && (
                      <svg className="w-4 h-4 text-white hidden group-hover:block mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm truncate ${
                      index === currentIndex && isPlaylistMode ? 'text-[#1DB954]' : 'text-white'
                    }`}>
                      {item.prompt}
                    </p>
                    <p className="text-xs text-[#b3b3b3] truncate">
                      {formatDuration(item.duration_ms)} {item.instrumental && '• Instrumental'}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(item.id);
                    }}
                    className="p-1 text-[#b3b3b3] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="제거"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-[#b3b3b3]">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15 6H3v2h12V6zm0 4H3v2h12v-2zM3 16h8v-2H3v2zM17 6v8.18c-.31-.11-.65-.18-1-.18-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3V8h3V6h-5z" />
              </svg>
              <p className="text-sm">재생목록이 비어있습니다</p>
              <p className="text-xs mt-1">히스토리에서 곡을 추가하세요</p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
