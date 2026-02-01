/**
 * Track class - represents a track in the Live Set
 */

import { OSCClient } from "./osc.js";
import { Clip } from "./clip.js";
import { ClipSlot } from "./clip-slot.js";
import { Device } from "./device.js";

export interface TrackState {
  name: string;
  color: number;
  colorIndex: number;
  mute: boolean;
  solo: boolean;
  arm: boolean;
  volume: number;
  panning: number;
  isFoldable: boolean;
  isFolded: boolean;
  isGroupTrack: boolean;
}

export enum MonitoringState {
  In = 0,
  Auto = 1,
  Off = 2,
}

export interface ArrangementClip {
  startTime: number;
  endTime: number;
  name: string;
  color: number;
}

export class Track {
  private client: OSCClient;
  readonly id: number;

  constructor(client: OSCClient, trackId: number) {
    this.client = client;
    this.id = trackId;
  }

  // ============ Getters ============

  async getName(): Promise<string> {
    const res = await this.client.query("/live/track/get/name", this.id);
    return res.args[1] as string;
  }

  async getColor(): Promise<number> {
    const res = await this.client.query("/live/track/get/color", this.id);
    return res.args[1] as number;
  }

  async getColorIndex(): Promise<number> {
    const res = await this.client.query("/live/track/get/color_index", this.id);
    return res.args[1] as number;
  }

  async getMute(): Promise<boolean> {
    const res = await this.client.query("/live/track/get/mute", this.id);
    return res.args[1] as boolean;
  }

  async getSolo(): Promise<boolean> {
    const res = await this.client.query("/live/track/get/solo", this.id);
    return res.args[1] as boolean;
  }

  async getArm(): Promise<boolean> {
    const res = await this.client.query("/live/track/get/arm", this.id);
    return res.args[1] as boolean;
  }

  /**
   * Get the output meter level (for visualization)
   */
  async getOutputMeterLevel(): Promise<number> {
    const res = await this.client.query(
      "/live/track/get/output_meter_level",
      this.id
    );
    return res.args[1] as number;
  }

  /**
   * Get the mixer volume (0.0 to 1.0, 0.85 = 0dB)
   */
  async getVolume(): Promise<number> {
    const res = await this.client.query("/live/track/get/volume", this.id);
    return res.args[1] as number;
  }

  async getPanning(): Promise<number> {
    const res = await this.client.query("/live/track/get/panning", this.id);
    return res.args[1] as number;
  }

  // ============ New Getters - Routing ============

  async getInputRoutingChannel(): Promise<string> {
    const res = await this.client.query(
      "/live/track/get/input_routing_channel",
      this.id
    );
    return res.args[1] as string;
  }

  async getInputRoutingType(): Promise<string> {
    const res = await this.client.query(
      "/live/track/get/input_routing_type",
      this.id
    );
    return res.args[1] as string;
  }

  async getOutputRoutingChannel(): Promise<string> {
    const res = await this.client.query(
      "/live/track/get/output_routing_channel",
      this.id
    );
    return res.args[1] as string;
  }

  async getOutputRoutingType(): Promise<string> {
    const res = await this.client.query(
      "/live/track/get/output_routing_type",
      this.id
    );
    return res.args[1] as string;
  }

  async getAvailableInputRoutingChannels(): Promise<string[]> {
    const res = await this.client.query(
      "/live/track/get/available_input_routing_channels",
      this.id
    );
    return res.args.slice(1) as string[];
  }

  async getAvailableInputRoutingTypes(): Promise<string[]> {
    const res = await this.client.query(
      "/live/track/get/available_input_routing_types",
      this.id
    );
    return res.args.slice(1) as string[];
  }

  async getAvailableOutputRoutingChannels(): Promise<string[]> {
    const res = await this.client.query(
      "/live/track/get/available_output_routing_channels",
      this.id
    );
    return res.args.slice(1) as string[];
  }

  async getAvailableOutputRoutingTypes(): Promise<string[]> {
    const res = await this.client.query(
      "/live/track/get/available_output_routing_types",
      this.id
    );
    return res.args.slice(1) as string[];
  }

  // ============ New Getters - State ============

  async getCurrentMonitoringState(): Promise<MonitoringState> {
    const res = await this.client.query(
      "/live/track/get/current_monitoring_state",
      this.id
    );
    return res.args[1] as MonitoringState;
  }

  async getFoldState(): Promise<boolean> {
    const res = await this.client.query("/live/track/get/fold_state", this.id);
    return res.args[1] as boolean;
  }

  async getHasAudioInput(): Promise<boolean> {
    const res = await this.client.query(
      "/live/track/get/has_audio_input",
      this.id
    );
    return res.args[1] as boolean;
  }

  async getHasAudioOutput(): Promise<boolean> {
    const res = await this.client.query(
      "/live/track/get/has_audio_output",
      this.id
    );
    return res.args[1] as boolean;
  }

  async getHasMidiInput(): Promise<boolean> {
    const res = await this.client.query(
      "/live/track/get/has_midi_input",
      this.id
    );
    return res.args[1] as boolean;
  }

  async getHasMidiOutput(): Promise<boolean> {
    const res = await this.client.query(
      "/live/track/get/has_midi_output",
      this.id
    );
    return res.args[1] as boolean;
  }

  async getIsFoldable(): Promise<boolean> {
    const res = await this.client.query("/live/track/get/is_foldable", this.id);
    return res.args[1] as boolean;
  }

  async getIsGrouped(): Promise<boolean> {
    const res = await this.client.query("/live/track/get/is_grouped", this.id);
    return res.args[1] as boolean;
  }

  async getIsVisible(): Promise<boolean> {
    const res = await this.client.query("/live/track/get/is_visible", this.id);
    return res.args[1] as boolean;
  }

  // ============ New Getters - Clip Slots ============

  async getFiredSlotIndex(): Promise<number> {
    const res = await this.client.query(
      "/live/track/get/fired_slot_index",
      this.id
    );
    return res.args[1] as number;
  }

  async getPlayingSlotIndex(): Promise<number> {
    const res = await this.client.query(
      "/live/track/get/playing_slot_index",
      this.id
    );
    return res.args[1] as number;
  }

  // ============ Setters ============

  async setName(name: string): Promise<void> {
    this.client.send("/live/track/set/name", this.id, name);
  }

  async setColor(color: number): Promise<void> {
    this.client.send("/live/track/set/color", this.id, color);
  }

  async setColorIndex(colorIndex: number): Promise<void> {
    this.client.send("/live/track/set/color_index", this.id, colorIndex);
  }

  async setMute(mute: boolean): Promise<void> {
    this.client.send("/live/track/set/mute", this.id, mute ? 1 : 0);
  }

  async setSolo(solo: boolean): Promise<void> {
    this.client.send("/live/track/set/solo", this.id, solo ? 1 : 0);
  }

  async setArm(arm: boolean): Promise<void> {
    this.client.send("/live/track/set/arm", this.id, arm ? 1 : 0);
  }

  async setPanning(panning: number): Promise<void> {
    this.client.send("/live/track/set/panning", this.id, panning);
  }

  /**
   * Set the mixer volume (0.0 to 1.0, 0.85 = 0dB)
   */
  async setVolume(volume: number): Promise<void> {
    this.client.send("/live/track/set/volume", this.id, volume);
  }

  // ============ New Setters - Routing ============

  async setInputRoutingChannel(channel: string): Promise<void> {
    this.client.send("/live/track/set/input_routing_channel", this.id, channel);
  }

  async setInputRoutingType(type: string): Promise<void> {
    this.client.send("/live/track/set/input_routing_type", this.id, type);
  }

  async setOutputRoutingChannel(channel: string): Promise<void> {
    this.client.send(
      "/live/track/set/output_routing_channel",
      this.id,
      channel
    );
  }

  async setOutputRoutingType(type: string): Promise<void> {
    this.client.send("/live/track/set/output_routing_type", this.id, type);
  }

  // ============ New Setters - State ============

  async setCurrentMonitoringState(state: MonitoringState): Promise<void> {
    this.client.send(
      "/live/track/set/current_monitoring_state",
      this.id,
      state
    );
  }

  async setFoldState(folded: boolean): Promise<void> {
    this.client.send("/live/track/set/fold_state", this.id, folded ? 1 : 0);
  }

  // ============ Actions ============

  stop(): void {
    this.client.send("/live/track/stop_all_clips", this.id);
  }

  // ============ Clips ============

  getClip(clipId: number): Clip {
    return new Clip(this.client, this.id, clipId);
  }

  async getClipNames(): Promise<string[]> {
    const res = await this.client.query("/live/track/get/clips/name", this.id);
    return res.args.slice(1) as string[];
  }

  // ============ Clip Slots ============

  getClipSlot(slotId: number): ClipSlot {
    return new ClipSlot(this.client, this.id, slotId);
  }

  // ============ Arrangement Clips ============

  /**
   * Get all clips in the arrangement view for this track
   */
  async getArrangementClips(): Promise<ArrangementClip[]> {
    const res = await this.client.query(
      "/live/track/get/arrangement_clips",
      this.id
    );
    const clips: ArrangementClip[] = [];
    // Response format: track_id, then groups of: start_time, end_time, name, color
    const data = res.args.slice(1);
    for (let i = 0; i < data.length; i += 4) {
      clips.push({
        startTime: data[i] as number,
        endTime: data[i + 1] as number,
        name: data[i + 2] as string,
        color: data[i + 3] as number,
      });
    }
    return clips;
  }

  // ============ Devices ============

  getDevice(deviceId: number): Device {
    return new Device(this.client, this.id, deviceId);
  }

  async getDeviceNames(): Promise<string[]> {
    const res = await this.client.query(
      "/live/track/get/devices/name",
      this.id
    );
    return res.args.slice(1) as string[];
  }

  async getNumDevices(): Promise<number> {
    const res = await this.client.query("/live/track/get/num_devices", this.id);
    return res.args[1] as number;
  }

  // ============ Send ============

  async getSend(sendIndex: number): Promise<number> {
    const res = await this.client.query(
      "/live/track/get/send",
      this.id,
      sendIndex
    );
    return res.args[2] as number;
  }

  async setSend(sendIndex: number, value: number): Promise<void> {
    this.client.send("/live/track/set/send", this.id, sendIndex, value);
  }
}
