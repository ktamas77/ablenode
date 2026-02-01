/**
 * Scene class - represents a scene (row) in the Session View
 */

import { OSCClient } from "./osc.js";

export class Scene {
  private client: OSCClient;
  readonly id: number;

  constructor(client: OSCClient, sceneId: number) {
    this.client = client;
    this.id = sceneId;
  }

  // ============ Transport ============

  fire(): void {
    this.client.send("/live/scene/fire", this.id);
  }

  /**
   * Fire the scene as if it were selected (follows the selected scene behavior)
   */
  fireAsSelected(): void {
    this.client.send("/live/scene/fire_as_selected", this.id);
  }

  // ============ Getters ============

  async getName(): Promise<string> {
    const res = await this.client.query("/live/scene/get/name", this.id);
    return res.args[1] as string;
  }

  async getColor(): Promise<number> {
    const res = await this.client.query("/live/scene/get/color", this.id);
    return res.args[1] as number;
  }

  async getColorIndex(): Promise<number> {
    const res = await this.client.query("/live/scene/get/color_index", this.id);
    return res.args[1] as number;
  }

  async getTempo(): Promise<number> {
    const res = await this.client.query("/live/scene/get/tempo", this.id);
    return res.args[1] as number;
  }

  async getTimeSignatureNumerator(): Promise<number> {
    const res = await this.client.query(
      "/live/scene/get/time_signature_numerator",
      this.id
    );
    return res.args[1] as number;
  }

  async getTimeSignatureDenominator(): Promise<number> {
    const res = await this.client.query(
      "/live/scene/get/time_signature_denominator",
      this.id
    );
    return res.args[1] as number;
  }

  // ============ New Getters ============

  /**
   * Check if the scene has no clips
   */
  async getIsEmpty(): Promise<boolean> {
    const res = await this.client.query("/live/scene/get/is_empty", this.id);
    return res.args[1] as boolean;
  }

  /**
   * Check if the scene is triggered (about to play)
   */
  async getIsTriggered(): Promise<boolean> {
    const res = await this.client.query(
      "/live/scene/get/is_triggered",
      this.id
    );
    return res.args[1] as boolean;
  }

  /**
   * Check if tempo is enabled for this scene
   */
  async getTempoEnabled(): Promise<boolean> {
    const res = await this.client.query(
      "/live/scene/get/tempo_enabled",
      this.id
    );
    return res.args[1] as boolean;
  }

  /**
   * Check if time signature is enabled for this scene
   */
  async getTimeSignatureEnabled(): Promise<boolean> {
    const res = await this.client.query(
      "/live/scene/get/time_signature_enabled",
      this.id
    );
    return res.args[1] as boolean;
  }

  // ============ Setters ============

  async setName(name: string): Promise<void> {
    this.client.send("/live/scene/set/name", this.id, name);
  }

  async setColor(color: number): Promise<void> {
    this.client.send("/live/scene/set/color", this.id, color);
  }

  async setColorIndex(colorIndex: number): Promise<void> {
    this.client.send("/live/scene/set/color_index", this.id, colorIndex);
  }

  async setTempo(tempo: number): Promise<void> {
    this.client.send("/live/scene/set/tempo", this.id, tempo);
  }

  // ============ New Setters ============

  /**
   * Enable or disable tempo for this scene
   */
  async setTempoEnabled(enabled: boolean): Promise<void> {
    this.client.send("/live/scene/set/tempo_enabled", this.id, enabled ? 1 : 0);
  }

  /**
   * Enable or disable time signature for this scene
   */
  async setTimeSignatureEnabled(enabled: boolean): Promise<void> {
    this.client.send(
      "/live/scene/set/time_signature_enabled",
      this.id,
      enabled ? 1 : 0
    );
  }
}
