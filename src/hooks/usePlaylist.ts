import { useState, useCallback } from 'react';
import type { PlaylistItem, PlaylistState, SongHistoryItem } from '../types';

const PLAYLIST_STORAGE_KEY = 'elevenlabs_playlist';

interface UsePlaylistReturn extends PlaylistState {
  addToPlaylist: (item: SongHistoryItem) => void;
  removeFromPlaylist: (id: string) => void;
  clearPlaylist: () => void;
  toggleLoop: () => void;
  setCurrentIndex: (index: number) => void;
  playNext: () => boolean;
  playPrevious: () => boolean;
  reorderPlaylist: (fromIndex: number, toIndex: number) => void;
  getCurrentItem: () => PlaylistItem | null;
}

function loadPlaylistFromStorage(): PlaylistState {
  try {
    const stored = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        items: parsed.items || [],
        currentIndex: parsed.currentIndex || 0,
        isLoopEnabled: parsed.isLoopEnabled || false,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return { items: [], currentIndex: 0, isLoopEnabled: false };
}

function savePlaylistToStorage(state: PlaylistState) {
  localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(state));
}

export function usePlaylist(): UsePlaylistReturn {
  const [state, setState] = useState<PlaylistState>(loadPlaylistFromStorage);

  const updateState = useCallback((newState: PlaylistState) => {
    setState(newState);
    savePlaylistToStorage(newState);
  }, []);

  const addToPlaylist = useCallback((item: SongHistoryItem) => {
    setState((prev) => {
      // Check if already in playlist
      if (prev.items.some((i) => i.id === item.id)) {
        return prev;
      }
      const newItem: PlaylistItem = {
        id: item.id,
        prompt: item.prompt,
        duration_ms: item.duration_ms,
        instrumental: item.instrumental,
        audioData: item.audioData,
      };
      const newState = {
        ...prev,
        items: [...prev.items, newItem],
      };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const removeFromPlaylist = useCallback((id: string) => {
    setState((prev) => {
      const index = prev.items.findIndex((i) => i.id === id);
      if (index === -1) return prev;

      const newItems = prev.items.filter((i) => i.id !== id);
      let newIndex = prev.currentIndex;

      // Adjust currentIndex if needed
      if (index < prev.currentIndex) {
        newIndex = Math.max(0, prev.currentIndex - 1);
      } else if (index === prev.currentIndex && newIndex >= newItems.length) {
        newIndex = Math.max(0, newItems.length - 1);
      }

      const newState = {
        ...prev,
        items: newItems,
        currentIndex: newIndex,
      };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const clearPlaylist = useCallback(() => {
    const newState = { items: [], currentIndex: 0, isLoopEnabled: state.isLoopEnabled };
    updateState(newState);
  }, [state.isLoopEnabled, updateState]);

  const toggleLoop = useCallback(() => {
    setState((prev) => {
      const newState = { ...prev, isLoopEnabled: !prev.isLoopEnabled };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const setCurrentIndex = useCallback((index: number) => {
    setState((prev) => {
      if (index < 0 || index >= prev.items.length) return prev;
      const newState = { ...prev, currentIndex: index };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const playNext = useCallback((): boolean => {
    let played = false;
    setState((prev) => {
      if (prev.items.length === 0) return prev;

      let nextIndex = prev.currentIndex + 1;

      if (nextIndex >= prev.items.length) {
        if (prev.isLoopEnabled) {
          nextIndex = 0;
          played = true;
        } else {
          return prev;
        }
      } else {
        played = true;
      }

      const newState = { ...prev, currentIndex: nextIndex };
      savePlaylistToStorage(newState);
      return newState;
    });
    return played;
  }, []);

  const playPrevious = useCallback((): boolean => {
    let played = false;
    setState((prev) => {
      if (prev.items.length === 0) return prev;

      let prevIndex = prev.currentIndex - 1;

      if (prevIndex < 0) {
        if (prev.isLoopEnabled) {
          prevIndex = prev.items.length - 1;
          played = true;
        } else {
          return prev;
        }
      } else {
        played = true;
      }

      const newState = { ...prev, currentIndex: prevIndex };
      savePlaylistToStorage(newState);
      return newState;
    });
    return played;
  }, []);

  const reorderPlaylist = useCallback((fromIndex: number, toIndex: number) => {
    setState((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.items.length ||
        toIndex < 0 ||
        toIndex >= prev.items.length
      ) {
        return prev;
      }

      const newItems = [...prev.items];
      const [movedItem] = newItems.splice(fromIndex, 1);
      newItems.splice(toIndex, 0, movedItem);

      // Adjust currentIndex
      let newIndex = prev.currentIndex;
      if (prev.currentIndex === fromIndex) {
        newIndex = toIndex;
      } else if (fromIndex < prev.currentIndex && toIndex >= prev.currentIndex) {
        newIndex = prev.currentIndex - 1;
      } else if (fromIndex > prev.currentIndex && toIndex <= prev.currentIndex) {
        newIndex = prev.currentIndex + 1;
      }

      const newState = { ...prev, items: newItems, currentIndex: newIndex };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const getCurrentItem = useCallback((): PlaylistItem | null => {
    if (state.items.length === 0 || state.currentIndex >= state.items.length) {
      return null;
    }
    return state.items[state.currentIndex];
  }, [state.items, state.currentIndex]);

  return {
    ...state,
    addToPlaylist,
    removeFromPlaylist,
    clearPlaylist,
    toggleLoop,
    setCurrentIndex,
    playNext,
    playPrevious,
    reorderPlaylist,
    getCurrentItem,
  };
}
