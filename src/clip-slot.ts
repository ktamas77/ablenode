/**
 * ClipSlot class - represents a clip slot (cell) in the Session View
 */

import { OSCClient } from "./osc.js";

export class ClipSlot {
  private client: OSCClient;
  readonly trackId: number;
  readonly id: number;

  constructor(client: OSCClient, trackId: number, slotId: number) {
    this.client = client;
    this.trackId = trackId;
    this.id = slotId;
  }

  // ============ Actions ============

  /**
   * Fire the clip slot (launch the clip if present, or stop if empty)
   */
  fire(): void {
    this.client.send("/live/clip_slot/fire", this.trackId, this.id);
  }

  /**
   * Create a new empty clip with the specified length in beats
   */
  createClip(length: number): void {
    this.client.send(
      "/live/clip_slot/create_clip",
      this.trackId,
      this.id,
      length
    );
  }

  /**
   * Delete the clip in this slot
   */
  deleteClip(): void {
    this.client.send("/live/clip_slot/delete_clip", this.trackId, this.id);
  }

  /**
   * Duplicate the clip to another track and clip slot
   */
  duplicateClipTo(targetTrackId: number, targetSlotId: number): void {
    this.client.send(
      "/live/clip_slot/duplicate_clip_to",
      this.trackId,
      this.id,
      targetTrackId,
      targetSlotId
    );
  }

  // ============ Getters ============

  /**
   * Check if this slot contains a clip
   */
  async getHasClip(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip_slot/get/has_clip",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  /**
   * Check if this slot has a stop button
   */
  async getHasStopButton(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip_slot/get/has_stop_button",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  /**
   * Check if the clip in this slot is playing
   */
  async getIsPlaying(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip_slot/get/is_playing",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  /**
   * Check if the clip in this slot is recording
   */
  async getIsRecording(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip_slot/get/is_recording",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  /**
   * Check if the clip in this slot is triggered (about to play)
   */
  async getIsTriggered(): Promise<boolean> {
    const res = await this.client.query(
      "/live/clip_slot/get/is_triggered",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  // ============ Setters ============

  /**
   * Set whether this slot has a stop button
   */
  async setHasStopButton(hasStopButton: boolean): Promise<void> {
    this.client.send(
      "/live/clip_slot/set/has_stop_button",
      this.trackId,
      this.id,
      hasStopButton ? 1 : 0
    );
  }
}
