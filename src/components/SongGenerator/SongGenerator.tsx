import { useState, useEffect } from 'react';
import { PromptInput } from '../PromptInput';
import { SettingsPanel } from '../SettingsPanel';
import { AudioPlayer } from '../AudioPlayer';
import { SongHistory } from '../SongHistory';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';
import { useSongGenerator } from '../../hooks/useSongGenerator';
import type { OutputFormat } from '../../types';

interface SongGeneratorProps {
  apiKey: string;
}

export function SongGenerator({ apiKey }: SongGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(60000); // 1 minute default
  const [instrumental, setInstrumental] = useState(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('mp3_44100_128');

  const audioPlayer = useAudioPlayer();
  const songGenerator = useSongGenerator();

  const handleGenerate = async () => {
    audioPlayer.reset();
    await songGenerator.generate(
      { prompt, duration_ms: duration, instrumental, output_format: outputFormat },
      apiKey
    );
  };

  // Load audio when a new song is generated
  useEffect(() => {
    if (songGenerator.currentSong) {
      audioPlayer.loadAudio(songGenerator.currentSong.audioUrl);
    }
  }, [songGenerator.currentSong?.id]);

  const handleDownload = () => {
    if (!songGenerator.currentSong) return;
    const link = document.createElement('a');
    link.href = songGenerator.currentSong.audioUrl;
    link.download = `song-${songGenerator.currentSong.id}.mp3`;
    link.click();
  };

  const handleHistorySelect = (item: Parameters<typeof songGenerator.loadFromHistory>[0]) => {
    songGenerator.loadFromHistory(item);
    // Sync UI state with selected song's metadata
    setPrompt(item.prompt);
    setDuration(item.duration_ms);
    setInstrumental(item.instrumental);
    // Audio loading is handled by the useEffect watching currentSong
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
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

          {songGenerator.currentSong && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full
                              bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    생성된 노래
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {songGenerator.currentSong.prompt}
                  </p>
                </div>
              </div>

              <AudioPlayer
                isPlaying={audioPlayer.isPlaying}
                isLooping={audioPlayer.isLooping}
                currentTime={audioPlayer.currentTime}
                duration={audioPlayer.duration}
                volume={audioPlayer.volume}
                onToggle={audioPlayer.toggle}
                onSeek={audioPlayer.seek}
                onVolumeChange={audioPlayer.setVolume}
                onToggleLoop={audioPlayer.toggleLoop}
                onDownload={handleDownload}
              />
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 sticky top-4">
            <SongHistory
              items={songGenerator.history}
              onSelect={handleHistorySelect}
              onDelete={songGenerator.deleteFromHistory}
              onClear={songGenerator.clearHistory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
