import type { MusicGenerationRequest, OutputFormat } from '../types';

const API_BASE_URL = 'https://api.elevenlabs.io/v1';

class ElevenLabsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateMusic(request: MusicGenerationRequest): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/music`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        duration_ms: request.duration_ms,
        instrumental: request.instrumental ?? false,
        output_format: request.output_format ?? 'mp3_44100_128',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail?.message ||
        errorData.message ||
        `Failed to generate music: ${response.status}`
      );
    }

    return response.blob();
  }

  async getVoices(): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/voices`, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch voices');
    }

    return response.json();
  }

  async getUserInfo(): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/user`, {
      headers: {
        'xi-api-key': this.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    return response.json();
  }
}

let serviceInstance: ElevenLabsService | null = null;

export function getElevenLabsService(): ElevenLabsService {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_ELEVENLABS_API_KEY environment variable is not set');
  }

  if (!serviceInstance) {
    serviceInstance = new ElevenLabsService(apiKey);
  }

  return serviceInstance;
}

export function createElevenLabsService(apiKey: string): ElevenLabsService {
  return new ElevenLabsService(apiKey);
}

export type { OutputFormat };
