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
 * // Listen for changes
 * ableton.song.addListener("tempo", (bpm) => {
 *   console.log(`Tempo changed: ${bpm}`);
 * });
 * ```
 *
 * @packageDocumentation
 */

export { Ableton, createMultiple, type AbletonOptions } from "./ableton.js";
export { Song, type SongState } from "./song.js";
export {
  OSCClient,
  buildOSCMessage,
  parseOSCMessage,
  type OSCClientOptions,
  type OSCMessage,
} from "./osc.js";
