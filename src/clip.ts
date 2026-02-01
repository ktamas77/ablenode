/**
 * Clip class - represents a clip in a track
 */

import { OSCClient } from "./osc.js";

export enum LaunchMode {
  Trigger = 0,
  Gate = 1,
  Toggle = 2,
  Repeat = 3,
}

export enum WarpMode {
  Beats = 0,
  Tones = 1,
  Texture = 2,
  RePitch = 3,
  Complex = 4,
  Invalid = 5,
  Pro = 6,
}

export enum LaunchQuantization {
  Global = 0,
  None = 1,
  EightBars = 2,
  FourBars = 3,
  TwoBars = 4,
  OneBar = 5,
  Half = 6,
  HalfTriplet = 7,
  Quarter = 8,
  QuarterTriplet = 9,
  Eighth = 10,
  EighthTriplet = 11,
  Sixteenth = 12,
  SixteenthTriplet = 13,
  ThirtySecond = 14,
}

export interface Note {
  pitch: number;
  startTime: number;
  duration: number;
  velocity: number;
  mute: boolean;
}

export class Clip {
  private client: OSCClient;
  readonly trackId: number;
  readonly id: number;

  constructor(client: OSCClient, trackId: number, clipId: number) {
    this.client = client;
    this.trackId = trackId;
    this.id = clipId;
  }

  // ============ Transport ============

  fire(): void {
    this.client.send("/live/clip/fire", this.trackId, this.id);
  }

  stop(): void {
    this.client.send("/live/clip/stop", this.trackId, this.id);
  }

  // ============ Getters ============

  async getName(): Promise<string> {
    const res = await this.client.query(
      "/live/clip/get/name",
      this.trackId,
      this.id
    );
    return res.args[2] as string;
  }

  async getColor(): Promise<number> {
    const res = await this.client.query(
      "/live/clip/get/color",
      this.trackId,
      this.id
    );
    return res.args[2] as number;
  }

  async getColorIndex(): Promise<number> {
    const res = await this.client.query(
      "/live/clip/get/color_index",
      this.trackId,
      this.id
    );
    return res.args[2] as number;
  }

  async getLength(): Promise<number> {
    const res = await this.client.query(
      "/live/clip/get/length",
      this.trackId,
      this.id
    );
    return res.args[2] as number;
  }

  async getGain(): Promise<number> {
    const res = await this.client.query(
      "/live/clip/get/gain",
      this.trackId,
      this.id
    );
    return res.args[2] as number;
  }

  async getIsPlaying(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip/get/is_playing",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  async getIsRecording(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip/get/is_recording",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  async getIsAudioClip(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip/get/is_audio_clip",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  async getIsMidiClip(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip/get/is_midi_clip",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  async getPlayingPosition(): Promise<number> {
    const res = await this.client.query(
      "/live/clip/get/playing_position",
      this.trackId,
      this.id
    );
    return res.args[2] as number;
  }

  async getLoopStart(): Promise<number> {
    const res = await this.client.query(
      "/live/clip/get/loop_start",
      this.trackId,
      this.id
    );
    return res.args[2] as number;
  }

  async getLoopEnd(): Promise<number> {
    const res = await this.client.query(
      "/live/clip/get/loop_end",
      this.trackId,
      this.id
    );
    return res.args[2] as number;
  }

  async getLaunchMode(): Promise<LaunchMode> {
    const res = await this.client.query(
      "/live/clip/get/launch_mode",
      this.trackId,
      this.id
    );
    return res.args[2] as LaunchMode;
  }

  async getWarpMode(): Promise<WarpMode> {
    const res = await this.client.query(
      "/live/clip/get/warp_mode",
      this.trackId,
      this.id
    );
    return res.args[2] as WarpMode;
  }

  async getMuted(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip/get/muted",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  async getFilePath(): Promise<string> {
    const res = await this.client.query(
      "/live/clip/get/file_path",
      this.trackId,
      this.id
    );
    return res.args[2] as string;
  }

  // ============ Setters ============

  async setName(name: string): Promise<void> {
    this.client.send("/live/clip/set/name", this.trackId, this.id, name);
  }

  async setColor(color: number): Promise<void> {
    this.client.send("/live/clip/set/color", this.trackId, this.id, color);
  }

  async setColorIndex(colorIndex: number): Promise<void> {
    this.client.send(
      "/live/clip/set/color_index",
      this.trackId,
      this.id,
      colorIndex
    );
  }

  async setGain(gain: number): Promise<void> {
    this.client.send("/live/clip/set/gain", this.trackId, this.id, gain);
  }

  async setLoopStart(position: number): Promise<void> {
    this.client.send(
      "/live/clip/set/loop_start",
      this.trackId,
      this.id,
      position
    );
  }

  async setLoopEnd(position: number): Promise<void> {
    this.client.send(
      "/live/clip/set/loop_end",
      this.trackId,
      this.id,
      position
    );
  }

  async setLaunchMode(mode: LaunchMode): Promise<void> {
    this.client.send("/live/clip/set/launch_mode", this.trackId, this.id, mode);
  }

  async setWarpMode(mode: WarpMode): Promise<void> {
    this.client.send("/live/clip/set/warp_mode", this.trackId, this.id, mode);
  }

  async setMuted(muted: boolean): Promise<void> {
    this.client.send(
      "/live/clip/set/muted",
      this.trackId,
      this.id,
      muted ? 1 : 0
    );
  }

  async setPitchCoarse(semitones: number): Promise<void> {
    this.client.send(
      "/live/clip/set/pitch_coarse",
      this.trackId,
      this.id,
      semitones
    );
  }

  async setPitchFine(cents: number): Promise<void> {
    this.client.send("/live/clip/set/pitch_fine", this.trackId, this.id, cents);
  }

  // ============ MIDI Notes ============

  async getNotes(
    startPitch?: number,
    pitchSpan?: number,
    startTime?: number,
    timeSpan?: number
  ): Promise<Note[]> {
    const args: (string | number | boolean)[] = [this.trackId, this.id];
    if (
      startPitch !== undefined &&
      pitchSpan !== undefined &&
      startTime !== undefined &&
      timeSpan !== undefined
    ) {
      args.push(startPitch, pitchSpan, startTime, timeSpan);
    }

    const res = await this.client.query("/live/clip/get/notes", ...args);

    // Parse response: track_id, clip_id, then groups of 5 (pitch, start, dur, vel, mute)
    const notes: Note[] = [];
    const data = res.args.slice(2);
    for (let i = 0; i < data.length; i += 5) {
      notes.push({
        pitch: data[i] as number,
        startTime: data[i + 1] as number,
        duration: data[i + 2] as number,
        velocity: data[i + 3] as number,
        mute: data[i + 4] as boolean,
      });
    }
    return notes;
  }

  async addNotes(notes: Note[]): Promise<void> {
    const args: (string | number | boolean)[] = [this.trackId, this.id];
    for (const note of notes) {
      args.push(
        note.pitch,
        note.startTime,
        note.duration,
        note.velocity,
        note.mute
      );
    }
    this.client.send("/live/clip/add/notes", ...args);
  }

  async removeNotes(
    startPitch?: number,
    pitchSpan?: number,
    startTime?: number,
    timeSpan?: number
  ): Promise<void> {
    if (
      startPitch !== undefined &&
      pitchSpan !== undefined &&
      startTime !== undefined &&
      timeSpan !== undefined
    ) {
      this.client.send(
        "/live/clip/remove/notes",
        this.trackId,
        this.id,
        startPitch,
        pitchSpan,
        startTime,
        timeSpan
      );
    } else {
      this.client.send("/live/clip/remove/notes", this.trackId, this.id);
    }
  }

  // ============ Loop ============

  duplicateLoop(): void {
    this.client.send("/live/clip/duplicate_loop", this.trackId, this.id);
  }
}
