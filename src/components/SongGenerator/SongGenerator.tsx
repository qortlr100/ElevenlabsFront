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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Generation Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-6">
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
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20
                              border border-red-200 dark:border-red-800 rounded-lg">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <p className="text-sm text-red-600 dark:text-red-400">{songGenerator.error}</p>
                <button
                  onClick={songGenerator.clearError}
                  className="ml-auto text-red-500 hover:text-red-600"
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
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600
                         hover:from-purple-700 hover:to-indigo-700 text-white font-semibold
                         transition-all transform hover:scale-[1.02] active:scale-[0.98]
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                  </svg>
                  노래 생성하기
                </>
              )}
            </button>
          </div>

          {/* History Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              히스토리
            </h3>
            <SongHistory
              items={songGenerator.history}
              onSelect={handleHistorySelect}
              onDelete={songGenerator.deleteFromHistory}
              onClear={songGenerator.clearHistory}
              onAddToPlaylist={handleAddToPlaylist}
              playlistItemIds={playlist.itemIds}
            />
          </div>
        </div>

        {/* Right Column - Integrated Player */}
        <div className="sticky top-4 h-fit">
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
        </div>
      </div>
    </div>
  );
}
