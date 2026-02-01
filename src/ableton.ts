/**
 * AbleNode - Control Ableton Live via AbletonOSC
 *
 * Main entry point for the library
 */

import { EventEmitter } from "node:events";
import { OSCClient, type OSCClientOptions, type OSCMessage } from "./osc.js";
import { Song } from "./song.js";
import { Track } from "./track.js";
import { Scene } from "./scene.js";

export interface Logger {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  debug?: (...args: unknown[]) => void;
}

export interface AbletonOptions {
  /** Host IP address (default: localhost) */
  host?: string;
  /** OSC send port (default: 11000) */
  sendPort?: number;
  /** OSC receive port (default: 11001) */
  receivePort?: number;
  /** Query timeout in ms (default: 5000) */
  timeout?: number;
  /** Enable debug logging */
  logger?: Logger;
}

export interface AbletonEvents {
  connect: [];
  disconnect: [];
  error: [Error];
  message: [OSCMessage];
}

/**
 * Main class for controlling Ableton Live
 *
 * @example
 * ```typescript
 * const ableton = new Ableton({ host: "192.168.1.72" });
 * await ableton.connect();
 *
 * const tempo = await ableton.song.getTempo();
 * console.log(`Tempo: ${tempo} BPM`);
 *
 * ableton.song.play();
 * ```
 */
export class Ableton extends EventEmitter<AbletonEvents> {
  private client: OSCClient;
  private logger?: Logger;
  private _song: Song;
  private _connected = false;

  constructor(options: AbletonOptions = {}) {
    super();

    const oscOptions: OSCClientOptions = {
      host: options.host ?? "127.0.0.1",
      sendPort: options.sendPort ?? 11000,
      receivePort: options.receivePort ?? 11001,
      timeout: options.timeout ?? 5000,
    };

    this.logger = options.logger;
    this.client = new OSCClient(oscOptions);
    this._song = new Song(this.client);

    // Forward events
    this.client.on("connect", () => {
      this._connected = true;
      this.emit("connect");
    });

    this.client.on("error", (err: Error) => {
      this.logger?.error("[AbleNode] Error:", err);
      this.emit("error", err);
    });

    this.client.on("message", (msg: OSCMessage) => {
      this.logger?.debug?.("[AbleNode] Received:", msg);
      this.emit("message", msg);
    });
  }

  /**
   * The Song object for controlling transport, tempo, etc.
   */
  get song(): Song {
    return this._song;
  }

  /**
   * Whether we're connected to Ableton
   */
  get connected(): boolean {
    return this._connected;
  }

  /**
   * Underlying OSC client for advanced usage
   */
  get osc(): OSCClient {
    return this.client;
  }

  /**
   * Connect to Ableton Live
   */
  async connect(): Promise<void> {
    this.logger?.log("[AbleNode] Connecting...");
    await this.client.connect();
    this.logger?.log("[AbleNode] Connected");
  }

  /**
   * Disconnect from Ableton Live
   */
  disconnect(): void {
    this._connected = false;
    this.client.close();
    this.emit("disconnect");
  }

  /**
   * Test connection to Ableton
   */
  async ping(): Promise<boolean> {
    return this.client.ping();
  }

  /**
   * Get Ableton Live version
   */
  async getVersion(): Promise<{ major: number; minor: number }> {
    const response = await this.client.query("/live/application/get/version");
    return {
      major: response.args[0] as number,
      minor: response.args[1] as number,
    };
  }

  /**
   * Show a message in Live's status bar
   */
  showMessage(message: string): void {
    this.client.send("/live/api/show_message", message);
  }

  /**
   * Send a raw OSC message
   */
  send(address: string, ...args: (string | number | boolean)[]): void {
    this.client.send(address, ...args);
  }

  /**
   * Send a raw OSC query and wait for response
   */
  async query(
    address: string,
    ...args: (string | number | boolean)[]
  ): Promise<OSCMessage> {
    return this.client.query(address, ...args);
  }

  // ============ Tracks ============

  /**
   * Get a track by index
   */
  getTrack(trackId: number): Track {
    return new Track(this.client, trackId);
  }

  /**
   * Get all track names
   */
  async getTrackNames(): Promise<string[]> {
    const res = await this.client.query("/live/song/get/track_names");
    return res.args as string[];
  }

  /**
   * Get number of tracks
   */
  async getNumTracks(): Promise<number> {
    const res = await this.client.query("/live/song/get/num_tracks");
    return res.args[0] as number;
  }

  /**
   * Create a new MIDI track
   */
  createMidiTrack(index = -1): void {
    this.client.send("/live/song/create_midi_track", index);
  }

  /**
   * Create a new audio track
   */
  createAudioTrack(index = -1): void {
    this.client.send("/live/song/create_audio_track", index);
  }

  /**
   * Delete a track
   */
  deleteTrack(trackId: number): void {
    this.client.send("/live/song/delete_track", trackId);
  }

  /**
   * Duplicate a track
   */
  duplicateTrack(trackId: number): void {
    this.client.send("/live/song/duplicate_track", trackId);
  }

  // ============ Scenes ============

  /**
   * Get a scene by index
   */
  getScene(sceneId: number): Scene {
    return new Scene(this.client, sceneId);
  }

  /**
   * Get all scene names
   */
  async getSceneNames(): Promise<string[]> {
    const res = await this.client.query("/live/song/get/scene_names");
    return res.args as string[];
  }

  /**
   * Get number of scenes
   */
  async getNumScenes(): Promise<number> {
    const res = await this.client.query("/live/song/get/num_scenes");
    return res.args[0] as number;
  }

  /**
   * Create a new scene
   */
  createScene(index = -1): void {
    this.client.send("/live/song/create_scene", index);
  }

  /**
   * Delete a scene
   */
  deleteScene(sceneId: number): void {
    this.client.send("/live/song/delete_scene", sceneId);
  }

  /**
   * Duplicate a scene
   */
  duplicateScene(sceneId: number): void {
    this.client.send("/live/song/duplicate_scene", sceneId);
  }

  // ============ View ============

  /**
   * Get currently selected track index
   */
  async getSelectedTrack(): Promise<number> {
    const res = await this.client.query("/live/view/get/selected_track");
    return res.args[0] as number;
  }

  /**
   * Set selected track
   */
  setSelectedTrack(trackId: number): void {
    this.client.send("/live/view/set/selected_track", trackId);
  }

  /**
   * Get currently selected scene index
   */
  async getSelectedScene(): Promise<number> {
    const res = await this.client.query("/live/view/get/selected_scene");
    return res.args[0] as number;
  }

  /**
   * Set selected scene
   */
  setSelectedScene(sceneId: number): void {
    this.client.send("/live/view/set/selected_scene", sceneId);
  }
}

/**
 * Create multiple Ableton instances for controlling different machines
 *
 * @example
 * ```typescript
 * const instances = createMultiple([
 *   { host: "192.168.1.72", name: "Studio" },
 *   { host: "100.80.245.114", name: "Laptop" }
 * ]);
 *
 * await instances.Studio.connect();
 * await instances.Laptop.connect();
 * ```
 */
export function createMultiple<T extends string>(
  configs: Array<AbletonOptions & { name: T }>
): Record<T, Ableton> {
  const instances = {} as Record<T, Ableton>;

  for (const config of configs) {
    const { name, ...options } = config;
    instances[name] = new Ableton(options);
  }

  return instances;
}
