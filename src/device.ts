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

export enum DeviceType {
  Undefined = 0,
  AudioEffect = 1,
  Instrument = 2,
  MidiEffect = 3,
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

  // ============ New Getters ============

  /**
   * Get the device type (AudioEffect, Instrument, MidiEffect)
   */
  async getType(): Promise<DeviceType> {
    const res = await this.client.query(
      "/live/device/get/type",
      this.trackId,
      this.id
    );
    return res.args[2] as DeviceType;
  }

  /**
   * Get minimum values for all parameters
   */
  async getParameterMins(): Promise<number[]> {
    const res = await this.client.query(
      "/live/device/get/parameters/min",
      this.trackId,
      this.id
    );
    return res.args.slice(2) as number[];
  }

  /**
   * Get maximum values for all parameters
   */
  async getParameterMaxs(): Promise<number[]> {
    const res = await this.client.query(
      "/live/device/get/parameters/max",
      this.trackId,
      this.id
    );
    return res.args.slice(2) as number[];
  }

  /**
   * Check if a parameter is quantized (discrete values)
   */
  async getParameterIsQuantized(paramId: number): Promise<boolean> {
    const res = await this.client.query(
      "/live/device/get/parameter/is_quantized",
      this.trackId,
      this.id,
      paramId
    );
    return res.args[3] as boolean;
  }

  /**
   * Get the string representation of a parameter value
   */
  async getParameterValueString(paramId: number): Promise<string> {
    const res = await this.client.query(
      "/live/device/get/parameter/value_string",
      this.trackId,
      this.id,
      paramId
    );
    return res.args[3] as string;
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

  /**
   * Set all parameter values at once
   * @param values Array of parameter values (must match number of parameters)
   */
  async setAllParameterValues(values: number[]): Promise<void> {
    this.client.send(
      "/live/device/set/parameters/value",
      this.trackId,
      this.id,
      ...values
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
