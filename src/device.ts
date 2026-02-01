/**
 * Device class - represents a device on a track
 */

import { OSCClient } from "./osc.js";

export interface DeviceParameter {
  id: number;
  name: string;
  value: number;
  min: number;
  max: number;
}

export class Device {
  private client: OSCClient;
  readonly trackId: number;
  readonly id: number;

  constructor(client: OSCClient, trackId: number, deviceId: number) {
    this.client = client;
    this.trackId = trackId;
    this.id = deviceId;
  }

  // ============ Getters ============

  async getName(): Promise<string> {
    const res = await this.client.query(
      "/live/device/get/name",
      this.trackId,
      this.id
    );
    return res.args[2] as string;
  }

  async getClassName(): Promise<string> {
    const res = await this.client.query(
      "/live/device/get/class_name",
      this.trackId,
      this.id
    );
    return res.args[2] as string;
  }

  async getIsActive(): Promise<boolean> {
    const res = await this.client.query(
      "/live/device/get/is_active",
      this.trackId,
      this.id
    );
    return res.args[2] as boolean;
  }

  async getNumParameters(): Promise<number> {
    const res = await this.client.query(
      "/live/device/get/num_parameters",
      this.trackId,
      this.id
    );
    return res.args[2] as number;
  }

  async getParameterNames(): Promise<string[]> {
    const res = await this.client.query(
      "/live/device/get/parameters/name",
      this.trackId,
      this.id
    );
    return res.args.slice(2) as string[];
  }

  async getParameterValues(): Promise<number[]> {
    const res = await this.client.query(
      "/live/device/get/parameters/value",
      this.trackId,
      this.id
    );
    return res.args.slice(2) as number[];
  }

  // ============ Parameter Control ============

  async getParameterValue(paramId: number): Promise<number> {
    const res = await this.client.query(
      "/live/device/get/parameter/value",
      this.trackId,
      this.id,
      paramId
    );
    return res.args[3] as number;
  }

  async setParameterValue(paramId: number, value: number): Promise<void> {
    this.client.send(
      "/live/device/set/parameter/value",
      this.trackId,
      this.id,
      paramId,
      value
    );
  }

  async getParameterMin(paramId: number): Promise<number> {
    const res = await this.client.query(
      "/live/device/get/parameter/min",
      this.trackId,
      this.id,
      paramId
    );
    return res.args[3] as number;
  }

  async getParameterMax(paramId: number): Promise<number> {
    const res = await this.client.query(
      "/live/device/get/parameter/max",
      this.trackId,
      this.id,
      paramId
    );
    return res.args[3] as number;
  }

  async getParameterName(paramId: number): Promise<string> {
    const res = await this.client.query(
      "/live/device/get/parameter/name",
      this.trackId,
      this.id,
      paramId
    );
    return res.args[3] as string;
  }

  // ============ Get full parameter info ============

  async getParameter(paramId: number): Promise<DeviceParameter> {
    const [name, value, min, max] = await Promise.all([
      this.getParameterName(paramId),
      this.getParameterValue(paramId),
      this.getParameterMin(paramId),
      this.getParameterMax(paramId),
    ]);

    return { id: paramId, name, value, min, max };
  }

  async getAllParameters(): Promise<DeviceParameter[]> {
    const numParams = await this.getNumParameters();
    const params: DeviceParameter[] = [];

    for (let i = 0; i < numParams; i++) {
      params.push(await this.getParameter(i));
    }

    return params;
  }
}
