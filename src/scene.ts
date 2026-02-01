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
}
