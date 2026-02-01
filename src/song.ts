/**
 * Song class - represents the top-level Live Set
 */

import { OSCClient } from "./osc.js";

export interface SongState {
  tempo: number;
  isPlaying: boolean;
  songLength: number;
  currentTime: number;
  metronome: boolean;
  signature: [number, number];
}

export class Song {
  private client: OSCClient;
  private listeners: Map<string, Set<(value: any) => void>> = new Map();
  private pollInterval: NodeJS.Timeout | null = null;

  constructor(client: OSCClient) {
    this.client = client;
  }

  // ============ Getters ============

  async get<K extends keyof SongState>(prop: K): Promise<SongState[K]> {
    const propMap: Record<string, string> = {
      tempo: "/live/song/get/tempo",
      isPlaying: "/live/song/get/is_playing",
      songLength: "/live/song/get/song_length",
      currentTime: "/live/song/get/current_song_time",
      metronome: "/live/song/get/metronome",
      signature: "/live/song/get/signature_numerator", // TODO: combine with denominator
    };

    const address = propMap[prop as string];
    if (!address) {
      throw new Error(`Unknown property: ${prop}`);
    }

    const response = await this.client.query(address);
    return response.args[0] as SongState[K];
  }

  async getTempo(): Promise<number> {
    return this.get("tempo");
  }

  async getIsPlaying(): Promise<boolean> {
    return this.get("isPlaying");
  }

  async getCurrentTime(): Promise<number> {
    return this.get("currentTime");
  }

  async getSongLength(): Promise<number> {
    return this.get("songLength");
  }

  // ============ Setters ============

  async set<K extends keyof SongState>(
    prop: K,
    value: SongState[K]
  ): Promise<void> {
    const propMap: Record<string, string> = {
      tempo: "/live/song/set/tempo",
      metronome: "/live/song/set/metronome",
    };

    const address = propMap[prop as string];
    if (!address) {
      throw new Error(`Cannot set property: ${prop}`);
    }

    this.client.send(address, value as number | boolean);
  }

  async setTempo(bpm: number): Promise<void> {
    return this.set("tempo", bpm);
  }

  // ============ Transport Controls ============

  play(): void {
    this.client.send("/live/song/start_playing");
  }

  stop(): void {
    this.client.send("/live/song/stop_playing");
  }

  continuePlaying(): void {
    this.client.send("/live/song/continue_playing");
  }

  stopAllClips(): void {
    this.client.send("/live/song/stop_all_clips");
  }

  // ============ Navigation ============

  jumpBy(beats: number): void {
    this.client.send("/live/song/jump_by", beats);
  }

  jumpToNextCue(): void {
    this.client.send("/live/song/jump_to_next_cue");
  }

  jumpToPrevCue(): void {
    this.client.send("/live/song/jump_to_prev_cue");
  }

  jumpToCue(nameOrIndex: string | number): void {
    this.client.send("/live/song/cue_point/jump", nameOrIndex);
  }

  // ============ Other Actions ============

  undo(): void {
    this.client.send("/live/song/undo");
  }

  redo(): void {
    this.client.send("/live/song/redo");
  }

  tapTempo(): void {
    this.client.send("/live/song/tap_tempo");
  }

  // ============ Event Listeners ============

  /**
   * Add a listener for property changes (polling-based)
   */
  addListener<K extends keyof SongState>(
    prop: K,
    callback: (value: SongState[K]) => void
  ): () => void {
    if (!this.listeners.has(prop)) {
      this.listeners.set(prop, new Set());
    }
    this.listeners.get(prop)!.add(callback);

    // Start polling if not already
    if (!this.pollInterval) {
      this.startPolling();
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(prop)?.delete(callback);
      if (this.listeners.get(prop)?.size === 0) {
        this.listeners.delete(prop);
      }
      if (this.listeners.size === 0) {
        this.stopPolling();
      }
    };
  }

  private lastValues: Map<string, unknown> = new Map();

  private startPolling(intervalMs = 100): void {
    this.pollInterval = setInterval(async () => {
      for (const [prop, callbacks] of this.listeners) {
        try {
          const value = await this.get(prop as keyof SongState);
          if (value !== this.lastValues.get(prop)) {
            this.lastValues.set(prop, value);
            for (const cb of callbacks) {
              cb(value);
            }
          }
        } catch {
          // Ignore errors during polling
        }
      }
    }, intervalMs);
  }

  private stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  /**
   * Get full song state snapshot
   */
  async getState(): Promise<SongState> {
    const [tempo, isPlaying, songLength, currentTime] = await Promise.all([
      this.get("tempo"),
      this.get("isPlaying"),
      this.get("songLength"),
      this.get("currentTime"),
    ]);

    return {
      tempo,
      isPlaying,
      songLength,
      currentTime,
      metronome: false, // TODO
      signature: [4, 4], // TODO
    };
  }
}
