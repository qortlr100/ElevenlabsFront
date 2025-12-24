import { useState, useEffect, useCallback, useMemo } from 'react';
import { PromptInput } from '../PromptInput';
import { SettingsPanel } from '../SettingsPanel';
import { IntegratedPlayer } from '../IntegratedPlayer';
import { SongHistory } from '../SongHistory';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useSongGenerator } from '../../hooks/useSongGenerator';
import { usePlaylist } from '../../hooks/usePlaylist';
import type { OutputFormat, SongHistoryItem } from '../../types';

interface SongGeneratorProps {
  apiKey: string;
}

export function SongGenerator({ apiKey }: SongGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(60000); // 1 minute default
  const [instrumental, setInstrumental] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp3_44100_128');
  const [isPlaylistMode, setIsPlaylistMode] = useState(false);

  const playlist = usePlaylist();
  const songGenerator = useSongGenerator();

  // Get playlist items from history by IDs
  const playlistItems = useMemo(() => {
    return playlist.itemIds
      .map((id) => songGenerator.history.find((item) => item.id === id))
      .filter((item): item is SongHistoryItem => item !== undefined);
  }, [playlist.itemIds, songGenerator.history]);

  // Get current playlist item
  const getCurrentPlaylistItem = useCallback((): SongHistoryItem | null => {
    const currentId = playlist.getCurrentId();
    if (!currentId) return null;
    return songGenerator.history.find((item) => item.id === currentId) || null;
  }, [playlist, songGenerator.history]);

  // Handle track ended - play next in playlist
  const handleTrackEnded = useCallback(() => {
    if (isPlaylistMode && playlistItems.length > 0) {
      const played = playlist.playNext();
      if (!played && !playlist.isLoopEnabled) {
        setIsPlaylistMode(false);
      }
    }
  }, [isPlaylistMode, playlistItems.length, playlist]);

  const audioPlayer = useAudioPlayer({ onEnded: handleTrackEnded });

  const handleGenerate = async () => {
    setIsPlaylistMode(false);
    audioPlayer.reset();
    await songGenerator.generate(
      { prompt, duration_ms: duration, instrumental, output_format: outputFormat },
      apiKey
    );
  };

  // Load audio when a new song is generated (not playlist mode)
  useEffect(() => {
    if (songGenerator.currentSong && !isPlaylistMode) {
      audioPlayer.loadAudio(songGenerator.currentSong.audioUrl);
    }
  }, [songGenerator.currentSong?.id, isPlaylistMode]);

  // Get current playlist item ID for useEffect dependency
  const currentPlaylistId = playlist.getCurrentId();

  // Load audio when playlist item changes
  useEffect(() => {
    if (isPlaylistMode && currentPlaylistId) {
      const currentItem = songGenerator.history.find((item) => item.id === currentPlaylistId);
      if (currentItem) {
        const audioUrl = `data:audio/mp3;base64,${currentItem.audioData}`;
        audioPlayer.loadAudio(audioUrl);
        // Auto-play when switching tracks in playlist mode
        // Use canplaythrough event to ensure audio is ready
        const audio = audioPlayer.audioRef.current;
        if (audio) {
          const handleCanPlay = () => {
            audioPlayer.play();
            audio.removeEventListener('canplaythrough', handleCanPlay);
          };
          audio.addEventListener('canplaythrough', handleCanPlay);
          return () => {
            audio.removeEventListener('canplaythrough', handleCanPlay);
          };
        }
      }
    }
  }, [isPlaylistMode, currentPlaylistId]);

  const handleDownload = () => {
    let audioUrl: string | undefined;
    let filename: string;

    if (isPlaylistMode) {
      const currentItem = getCurrentPlaylistItem();
      if (!currentItem) return;
      audioUrl = `data:audio/mp3;base64,${currentItem.audioData}`;
      filename = `song-${currentItem.id}.mp3`;
    } else {
      if (!songGenerator.currentSong) return;
      audioUrl = songGenerator.currentSong.audioUrl;
      filename = `song-${songGenerator.currentSong.id}.mp3`;
    }

    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = filename;
    link.click();
  };

  const handleHistorySelect = (item: SongHistoryItem) => {
    setIsPlaylistMode(false);
    songGenerator.loadFromHistory(item);
    // Sync UI state with selected song's metadata
    setPrompt(item.prompt);
    setDuration(item.duration_ms);
    setInstrumental(item.instrumental);
    // Audio loading is handled by the useEffect watching currentSong
  };

  const handleDownloadFromHistory = (item: SongHistoryItem) => {
    const audioUrl = `data:audio/mp3;base64,${item.audioData}`;
    const filename = `${item.prompt.slice(0, 30).replace(/[^a-zA-Z0-9가-힣\s]/g, '')}.mp3`;
    const link = document.createElement('a');
    link.href = audioUrl;
    link.download = filename;
    link.click();
  };

  const handleAddToPlaylist = (item: SongHistoryItem) => {
    playlist.addToPlaylist(item.id);
  };

  const handlePlaylistSelect = (index: number) => {
    setIsPlaylistMode(true);
    playlist.setCurrentIndex(index);
  };

  const handlePlaylistPlayPause = () => {
    if (playlistItems.length === 0) return;

    if (!isPlaylistMode) {
      setIsPlaylistMode(true);
      // Will trigger useEffect to load audio
    } else {
      audioPlayer.toggle();
    }
  };

  const handlePlaylistPrevious = () => {
    if (playlistItems.length === 0) return;
    if (!isPlaylistMode) {
      setIsPlaylistMode(true);
    }
    playlist.playPrevious();
  };

  const handlePlaylistNext = () => {
    if (playlistItems.length === 0) return;
    if (!isPlaylistMode) {
      setIsPlaylistMode(true);
    }
    playlist.playNext();
  };

  const getCurrentTitle = () => {
    if (isPlaylistMode) {
      const currentItem = getCurrentPlaylistItem();
      return currentItem?.prompt || '';
    }
    return songGenerator.currentSong?.prompt || '';
  };

  const hasAudioToPlay = isPlaylistMode
    ? playlistItems.length > 0
    : !!songGenerator.currentSong;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left Section - Create */}
          <div className="lg:col-span-2 space-y-4">
            {/* Generation Card */}
            <div className="bg-[#181818] rounded-lg p-5 space-y-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1DB954] to-[#1ed760] flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">노래 만들기</h2>
                  <p className="text-xs text-[#b3b3b3]">AI로 나만의 음악을 생성하세요</p>
                </div>
              </div>

              <PromptInput
                value={prompt}
                onChange={setPrompt}
                disabled={songGenerator.isGenerating}
              />

              <SettingsPanel
                duration={duration}
                onDurationChange={setDuration}
                instrumental={instrumental}
                onInstrumentalChange={setInstrumental}
                outputFormat={outputFormat}
                onOutputFormatChange={setOutputFormat}
                disabled={songGenerator.isGenerating}
              />

              {songGenerator.error && (
                <div className="flex items-center gap-2 p-3 bg-[#e91429]/10 border border-[#e91429]/20 rounded-lg">
                  <svg className="w-5 h-5 text-[#e91429] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  <p className="text-sm text-[#e91429] flex-1">{songGenerator.error}</p>
                  <button
                    onClick={songGenerator.clearError}
                    className="text-[#e91429] hover:text-[#ff4d6d] p-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={songGenerator.isGenerating || !apiKey || !prompt.trim()}
                className="w-full py-3 px-6 rounded-full bg-[#1DB954] hover:bg-[#1ed760] hover:scale-[1.02]
                           text-black font-bold text-sm tracking-wide transition-all
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                           flex items-center justify-center gap-2"
              >
                {songGenerator.isGenerating ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    생성 중... (1-2분 소요)
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    노래 생성하기
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Section - History */}
          <div className="lg:col-span-3">
            <div className="bg-[#181818] rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#535353] to-[#333333] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">최근 생성</h2>
                    <p className="text-xs text-[#b3b3b3]">생성한 음악을 다시 들어보세요</p>
                  </div>
                </div>
              </div>

              <SongHistory
                items={songGenerator.history}
                onSelect={handleHistorySelect}
                onDelete={songGenerator.deleteFromHistory}
                onClear={songGenerator.clearHistory}
                onAddToPlaylist={handleAddToPlaylist}
                onDownload={handleDownloadFromHistory}
                playlistItemIds={playlist.itemIds}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Player */}
      <IntegratedPlayer
        isPlaying={audioPlayer.isPlaying}
        isLooping={audioPlayer.isLooping}
        currentTime={audioPlayer.currentTime}
        duration={audioPlayer.duration}
        volume={audioPlayer.volume}
        onToggle={hasAudioToPlay ? audioPlayer.toggle : handlePlaylistPlayPause}
        onSeek={audioPlayer.seek}
        onVolumeChange={audioPlayer.setVolume}
        onToggleLoop={audioPlayer.toggleLoop}
        onDownload={hasAudioToPlay ? handleDownload : undefined}
        items={playlistItems}
        currentIndex={playlist.currentIndex}
        isLoopEnabled={playlist.isLoopEnabled}
        isPlaylistMode={isPlaylistMode}
        onSelect={handlePlaylistSelect}
        onRemove={playlist.removeFromPlaylist}
        onClear={playlist.clearPlaylist}
        onTogglePlaylistLoop={playlist.toggleLoop}
        onPrevious={handlePlaylistPrevious}
        onNext={handlePlaylistNext}
        currentTitle={getCurrentTitle()}
        disabled={!hasAudioToPlay}
      />
    </>
  );
}
