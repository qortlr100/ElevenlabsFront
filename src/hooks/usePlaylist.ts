import { useState, useCallback } from 'react';
import type { PlaylistState } from '../types';

const PLAYLIST_STORAGE_KEY = 'elevenlabs_playlist';

interface UsePlaylistReturn extends PlaylistState {
  addToPlaylist: (id: string) => void;
  removeFromPlaylist: (id: string) => void;
  clearPlaylist: () => void;
  toggleLoop: () => void;
  setCurrentIndex: (index: number) => void;
  playNext: () => boolean;
  playPrevious: () => boolean;
  reorderPlaylist: (fromIndex: number, toIndex: number) => void;
  getCurrentId: () => string | null;
}

function loadPlaylistFromStorage(): PlaylistState {
  try {
    const stored = localStorage.getItem(PLAYLIST_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        itemIds: parsed.itemIds || [],
        currentIndex: parsed.currentIndex || 0,
        isLoopEnabled: parsed.isLoopEnabled || false,
      };
    }
  } catch {
    // Ignore parse errors
  }
  return { itemIds: [], currentIndex: 0, isLoopEnabled: false };
}

function savePlaylistToStorage(state: PlaylistState) {
  try {
    localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

export function usePlaylist(): UsePlaylistReturn {
  const [state, setState] = useState<PlaylistState>(loadPlaylistFromStorage);

  const updateState = useCallback((newState: PlaylistState) => {
    setState(newState);
    savePlaylistToStorage(newState);
  }, []);

  const addToPlaylist = useCallback((id: string) => {
    setState((prev) => {
      // Check if already in playlist
      if (prev.itemIds.includes(id)) {
        return prev;
      }
      const newState = {
        ...prev,
        itemIds: [...prev.itemIds, id],
      };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const removeFromPlaylist = useCallback((id: string) => {
    setState((prev) => {
      const index = prev.itemIds.indexOf(id);
      if (index === -1) return prev;

      const newItemIds = prev.itemIds.filter((itemId) => itemId !== id);
      let newIndex = prev.currentIndex;

      // Adjust currentIndex if needed
      if (index < prev.currentIndex) {
        newIndex = Math.max(0, prev.currentIndex - 1);
      } else if (index === prev.currentIndex && newIndex >= newItemIds.length) {
        newIndex = Math.max(0, newItemIds.length - 1);
      }

      const newState = {
        ...prev,
        itemIds: newItemIds,
        currentIndex: newIndex,
      };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const clearPlaylist = useCallback(() => {
    const newState = { itemIds: [], currentIndex: 0, isLoopEnabled: state.isLoopEnabled };
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
      if (index < 0 || index >= prev.itemIds.length) return prev;
      const newState = { ...prev, currentIndex: index };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const playNext = useCallback((): boolean => {
    let played = false;
    setState((prev) => {
      if (prev.itemIds.length === 0) return prev;

      let nextIndex = prev.currentIndex + 1;

      if (nextIndex >= prev.itemIds.length) {
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
      if (prev.itemIds.length === 0) return prev;

      let prevIndex = prev.currentIndex - 1;

      if (prevIndex < 0) {
        if (prev.isLoopEnabled) {
          prevIndex = prev.itemIds.length - 1;
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
        fromIndex >= prev.itemIds.length ||
        toIndex < 0 ||
        toIndex >= prev.itemIds.length
      ) {
        return prev;
      }

      const newItemIds = [...prev.itemIds];
      const [movedId] = newItemIds.splice(fromIndex, 1);
      newItemIds.splice(toIndex, 0, movedId);

      // Adjust currentIndex
      let newIndex = prev.currentIndex;
      if (prev.currentIndex === fromIndex) {
        newIndex = toIndex;
      } else if (fromIndex < prev.currentIndex && toIndex >= prev.currentIndex) {
        newIndex = prev.currentIndex - 1;
      } else if (fromIndex > prev.currentIndex && toIndex <= prev.currentIndex) {
        newIndex = prev.currentIndex + 1;
      }

      const newState = { ...prev, itemIds: newItemIds, currentIndex: newIndex };
      savePlaylistToStorage(newState);
      return newState;
    });
  }, []);

  const getCurrentId = useCallback((): string | null => {
    if (state.itemIds.length === 0 || state.currentIndex >= state.itemIds.length) {
      return null;
    }
    return state.itemIds[state.currentIndex];
  }, [state.itemIds, state.currentIndex]);

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
    getCurrentId,
  };
}
