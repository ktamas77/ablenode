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

export enum ClipTriggerQuantization {
  None = 0,
  EightBars = 1,
  FourBars = 2,
  TwoBars = 3,
  OneBar = 4,
  Half = 5,
  HalfTriplet = 6,
  Quarter = 7,
  QuarterTriplet = 8,
  Eighth = 9,
  EighthTriplet = 10,
  Sixteenth = 11,
  SixteenthTriplet = 12,
  ThirtySecond = 13,
}

export enum MidiRecordingQuantization {
  None = 0,
  Quarter = 1,
  Eighth = 2,
  EighthTriplet = 3,
  EighthEighthTriplet = 4,
  Sixteenth = 5,
  SixteenthTriplet = 6,
  SixteenthSixteenthTriplet = 7,
  ThirtySecond = 8,
}

export enum RecordMode {
  Arrangement = 0,
  Session = 1,
}

export interface CuePoint {
  id: number;
  name: string;
  time: number;
}

export class Song {
  private client: OSCClient;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Map<string, Set<(value: any) => void>> = new Map();
  private pollInterval: NodeJS.Timeout | null = null;
  private beatListeners: Set<(beat: number) => void> = new Set();
  private beatListening = false;

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

  async getMetronome(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/metronome");
    return res.args[0] as boolean;
  }

  // ============ New Getters ============

  async getArrangementOverdub(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/arrangement_overdub");
    return res.args[0] as boolean;
  }

  async getBackToArranger(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/back_to_arranger");
    return res.args[0] as boolean;
  }

  async getCanRedo(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/can_redo");
    return res.args[0] as boolean;
  }

  async getCanUndo(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/can_undo");
    return res.args[0] as boolean;
  }

  async getClipTriggerQuantization(): Promise<ClipTriggerQuantization> {
    const res = await this.client.query(
      "/live/song/get/clip_trigger_quantization"
    );
    return res.args[0] as ClipTriggerQuantization;
  }

  async getGrooveAmount(): Promise<number> {
    const res = await this.client.query("/live/song/get/groove_amount");
    return res.args[0] as number;
  }

  async getLoop(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/loop");
    return res.args[0] as boolean;
  }

  async getLoopLength(): Promise<number> {
    const res = await this.client.query("/live/song/get/loop_length");
    return res.args[0] as number;
  }

  async getLoopStart(): Promise<number> {
    const res = await this.client.query("/live/song/get/loop_start");
    return res.args[0] as number;
  }

  async getMidiRecordingQuantization(): Promise<MidiRecordingQuantization> {
    const res = await this.client.query(
      "/live/song/get/midi_recording_quantization"
    );
    return res.args[0] as MidiRecordingQuantization;
  }

  async getNudgeDown(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/nudge_down");
    return res.args[0] as boolean;
  }

  async getNudgeUp(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/nudge_up");
    return res.args[0] as boolean;
  }

  async getPunchIn(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/punch_in");
    return res.args[0] as boolean;
  }

  async getPunchOut(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/punch_out");
    return res.args[0] as boolean;
  }

  async getRecordMode(): Promise<RecordMode> {
    const res = await this.client.query("/live/song/get/record_mode");
    return res.args[0] as RecordMode;
  }

  async getRootNote(): Promise<number> {
    const res = await this.client.query("/live/song/get/root_note");
    return res.args[0] as number;
  }

  async getScaleName(): Promise<string> {
    const res = await this.client.query("/live/song/get/scale_name");
    return res.args[0] as string;
  }

  async getSessionRecord(): Promise<boolean> {
    const res = await this.client.query("/live/song/get/session_record");
    return res.args[0] as boolean;
  }

  async getSessionRecordStatus(): Promise<number> {
    const res = await this.client.query("/live/song/get/session_record_status");
    return res.args[0] as number;
  }

  async getSignatureNumerator(): Promise<number> {
    const res = await this.client.query("/live/song/get/signature_numerator");
    return res.args[0] as number;
  }

  async getSignatureDenominator(): Promise<number> {
    const res = await this.client.query("/live/song/get/signature_denominator");
    return res.args[0] as number;
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

  async setMetronome(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/metronome", enabled ? 1 : 0);
  }

  // ============ New Setters ============

  async setArrangementOverdub(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/arrangement_overdub", enabled ? 1 : 0);
  }

  async setBackToArranger(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/back_to_arranger", enabled ? 1 : 0);
  }

  async setClipTriggerQuantization(
    quantization: ClipTriggerQuantization
  ): Promise<void> {
    this.client.send("/live/song/set/clip_trigger_quantization", quantization);
  }

  async setGrooveAmount(amount: number): Promise<void> {
    this.client.send("/live/song/set/groove_amount", amount);
  }

  async setLoop(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/loop", enabled ? 1 : 0);
  }

  async setLoopLength(length: number): Promise<void> {
    this.client.send("/live/song/set/loop_length", length);
  }

  async setLoopStart(start: number): Promise<void> {
    this.client.send("/live/song/set/loop_start", start);
  }

  async setMidiRecordingQuantization(
    quantization: MidiRecordingQuantization
  ): Promise<void> {
    this.client.send(
      "/live/song/set/midi_recording_quantization",
      quantization
    );
  }

  async setNudgeDown(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/nudge_down", enabled ? 1 : 0);
  }

  async setNudgeUp(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/nudge_up", enabled ? 1 : 0);
  }

  async setPunchIn(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/punch_in", enabled ? 1 : 0);
  }

  async setPunchOut(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/punch_out", enabled ? 1 : 0);
  }

  async setRecordMode(mode: RecordMode): Promise<void> {
    this.client.send("/live/song/set/record_mode", mode);
  }

  async setRootNote(note: number): Promise<void> {
    this.client.send("/live/song/set/root_note", note);
  }

  async setScaleName(name: string): Promise<void> {
    this.client.send("/live/song/set/scale_name", name);
  }

  async setSessionRecord(enabled: boolean): Promise<void> {
    this.client.send("/live/song/set/session_record", enabled ? 1 : 0);
  }

  async setSignatureNumerator(numerator: number): Promise<void> {
    this.client.send("/live/song/set/signature_numerator", numerator);
  }

  async setSignatureDenominator(denominator: number): Promise<void> {
    this.client.send("/live/song/set/signature_denominator", denominator);
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

  // ============ New Actions ============

  /**
   * Capture MIDI that was played during the last few seconds
   */
  captureMidi(): void {
    this.client.send("/live/song/capture_midi");
  }

  /**
   * Trigger session recording
   */
  triggerSessionRecord(): void {
    this.client.send("/live/song/trigger_session_record");
  }

  // ============ Cue Points ============

  /**
   * Get all cue points in the song
   */
  async getCuePoints(): Promise<CuePoint[]> {
    const res = await this.client.query("/live/song/get/cue_points");
    const cuePoints: CuePoint[] = [];
    // Response format: id, name, time, id, name, time, ...
    for (let i = 0; i < res.args.length; i += 3) {
      cuePoints.push({
        id: res.args[i] as number,
        name: res.args[i + 1] as string,
        time: res.args[i + 2] as number,
      });
    }
    return cuePoints;
  }

  /**
   * Add or delete a cue point at the specified time
   * If a cue point exists at that time, it will be deleted
   */
  addOrDeleteCuePoint(time: number): void {
    this.client.send("/live/song/cue_point/add_or_delete", time);
  }

  /**
   * Set the name of a cue point
   */
  setCuePointName(cuePointId: number, name: string): void {
    this.client.send("/live/song/cue_point/set/name", cuePointId, name);
  }

  // ============ Beat Listener ============

  /**
   * Start listening for beat events from Ableton
   * Call this to enable beat notifications from AbletonOSC
   */
  startListenBeat(): void {
    if (!this.beatListening) {
      this.client.send("/live/song/start_listen/beat");
      this.beatListening = true;
    }
  }

  /**
   * Stop listening for beat events
   */
  stopListenBeat(): void {
    if (this.beatListening) {
      this.client.send("/live/song/stop_listen/beat");
      this.beatListening = false;
    }
  }

  /**
   * Add a callback for beat events
   * Note: You must call startListenBeat() first and handle /live/song/get/beat
   * messages from the OSC client
   */
  addBeatListener(callback: (beat: number) => void): () => void {
    this.beatListeners.add(callback);
    return () => {
      this.beatListeners.delete(callback);
    };
  }

  /**
   * Internal method to notify beat listeners
   * Call this when receiving /live/song/get/beat OSC messages
   */
  notifyBeat(beat: number): void {
    for (const cb of this.beatListeners) {
      cb(beat);
    }
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
    const [tempo, isPlaying, songLength, currentTime, metronome] =
      await Promise.all([
        this.get("tempo"),
        this.get("isPlaying"),
        this.get("songLength"),
        this.get("currentTime"),
        this.getMetronome(),
      ]);

    const [signatureNumerator, signatureDenominator] = await Promise.all([
      this.getSignatureNumerator(),
      this.getSignatureDenominator(),
    ]);

    return {
      tempo,
      isPlaying,
      songLength,
      currentTime,
      metronome,
      signature: [signatureNumerator, signatureDenominator],
    };
  }
}
