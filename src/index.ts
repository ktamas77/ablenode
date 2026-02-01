/**
 * AbleNode - Control Ableton Live via AbletonOSC from Node.js
 *
 * @example
 * ```typescript
 * import { Ableton } from "ablenode";
 *
 * const ableton = new Ableton({ host: "192.168.1.72" });
 * await ableton.connect();
 *
 * // Get tempo
 * const tempo = await ableton.song.getTempo();
 * console.log(`Tempo: ${tempo} BPM`);
 *
 * // Control transport
 * ableton.song.play();
 * ableton.song.stop();
 *
 * // Work with tracks
 * const track = ableton.getTrack(0);
 * console.log(await track.getName());
 * await track.setMute(true);
 *
 * // Work with clips
 * const clip = track.getClip(0);
 * clip.fire();
 *
 * // Work with devices
 * const device = track.getDevice(0);
 * await device.setParameterValue(1, 0.5);
 *
 * // Listen for changes
 * ableton.song.addListener("tempo", (bpm) => {
 *   console.log(`Tempo changed: ${bpm}`);
 * });
 * ```
 *
 * @packageDocumentation
 */

// Main class
export {
  Ableton,
  createMultiple,
  type AbletonOptions,
  type Logger,
} from "./ableton.js";

// Song
export { Song, type SongState } from "./song.js";

// Track
export { Track, type TrackState } from "./track.js";

// Clip
export {
  Clip,
  LaunchMode,
  WarpMode,
  LaunchQuantization,
  type Note,
} from "./clip.js";

// Device
export { Device, type DeviceParameter } from "./device.js";

// Scene
export { Scene } from "./scene.js";

// OSC (for advanced usage)
export {
  OSCClient,
  buildOSCMessage,
  parseOSCMessage,
  type OSCClientOptions,
  type OSCMessage,
} from "./osc.js";
