import { useState, useCallback } from 'react';
import type { GeneratedSong, MusicGenerationRequest, SongHistoryItem } from '../types';
import { createElevenLabsService } from '../services/elevenlabs';
import { generateId, blobToBase64 } from '../utils/formatters';

const HISTORY_STORAGE_KEY = 'elevenlabs_song_history';
const MAX_HISTORY_ITEMS = 10;

interface UseSongGeneratorReturn {
  isGenerating: boolean;
  error: string | null;
  currentSong: GeneratedSong | null;
  history: SongHistoryItem[];
  generate: (request: MusicGenerationRequest, apiKey: string) => Promise<void>;
  clearError: () => void;
  loadFromHistory: (item: SongHistoryItem) => GeneratedSong;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
}

function loadHistory(): SongHistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: SongHistoryItem[]): void {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch {
    console.error('Failed to save history to localStorage');
  }
}

export function useSongGenerator(): UseSongGeneratorReturn {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSong, setCurrentSong] = useState<GeneratedSong | null>(null);
  const [history, setHistory] = useState<SongHistoryItem[]>(loadHistory);

  const generate = useCallback(async (request: MusicGenerationRequest, apiKey: string) => {
    if (!apiKey) {
      setError('API 키를 입력해주세요.');
      return;
    }

    if (!request.prompt.trim()) {
      setError('프롬프트를 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const service = createElevenLabsService(apiKey);
      const audioBlob = await service.generateMusic(request);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioData = await blobToBase64(audioBlob);

      const song: GeneratedSong = {
        id: generateId(),
        prompt: request.prompt,
        duration_ms: request.duration_ms,
        instrumental: request.instrumental ?? false,
        audioUrl,
        createdAt: new Date(),
      };

      setCurrentSong(song);

      const historyItem: SongHistoryItem = {
        id: song.id,
        prompt: song.prompt,
        duration_ms: song.duration_ms,
        instrumental: song.instrumental,
        audioData,
        createdAt: song.createdAt.toISOString(),
      };

      const newHistory = [historyItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      setHistory(newHistory);
      saveHistory(newHistory);
    } catch (err) {
      const message = err instanceof Error ? err.message : '노래 생성에 실패했습니다.';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  }, [history]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadFromHistory = useCallback((item: SongHistoryItem): GeneratedSong => {
    const blob = base64ToBlob(item.audioData);
    const audioUrl = URL.createObjectURL(blob);

    const song: GeneratedSong = {
      id: item.id,
      prompt: item.prompt,
      duration_ms: item.duration_ms,
      instrumental: item.instrumental,
      audioUrl,
      createdAt: new Date(item.createdAt),
    };

    setCurrentSong(song);
    return song;
  }, []);

  const deleteFromHistory = useCallback((id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    saveHistory(newHistory);
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return {
    isGenerating,
    error,
    currentSong,
    history,
    generate,
    clearError,
    loadFromHistory,
    deleteFromHistory,
    clearHistory,
  };
}

function base64ToBlob(base64: string, mimeType: string = 'audio/mpeg'): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
