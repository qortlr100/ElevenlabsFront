export type OutputFormat =
  | 'mp3_22050_32'
  | 'mp3_24000_48'
  | 'mp3_44100_32'
  | 'mp3_44100_64'
  | 'mp3_44100_96'
  | 'mp3_44100_128'
  | 'mp3_44100_192';

export interface MusicGenerationRequest {
  prompt: string;
  duration_ms: number;
  instrumental?: boolean;
  output_format?: OutputFormat;
}

export interface GeneratedSong {
  id: string;
  prompt: string;
  duration_ms: number;
  instrumental: boolean;
  audioUrl: string;
  createdAt: Date;
}

export interface SongHistoryItem {
  id: string;
  prompt: string;
  duration_ms: number;
  instrumental: boolean;
  audioData: string; // base64 encoded audio
  createdAt: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  currentSong: GeneratedSong | null;
}

export interface AudioPlayerState {
  isPlaying: boolean;
  isLooping: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export interface PlaylistItem {
  id: string;
  prompt: string;
  duration_ms: number;
  instrumental: boolean;
  audioData: string;
}

export interface PlaylistState {
  items: PlaylistItem[];
  currentIndex: number;
  isLoopEnabled: boolean;
}
