/**
 * OSC Protocol implementation for AbletonOSC
 * Send to port 11000, receive on port 11001
 */

import dgram from "node:dgram";
import { EventEmitter } from "node:events";

export interface OSCMessage {
  address: string;
  args: (string | number | boolean)[];
}

/**
 * Pad string to 4-byte boundary with null terminator
 */
function oscString(s: string): Buffer {
  const str = Buffer.from(s + "\0");
  const padding = (4 - (str.length % 4)) % 4;
  return Buffer.concat([str, Buffer.alloc(padding)]);
}

/**
 * Build an OSC message buffer
 */
export function buildOSCMessage(
  address: string,
  ...args: (string | number | boolean)[]
): Buffer {
  const parts: Buffer[] = [oscString(address)];

  let typeTag = ",";
  const argBuffers: Buffer[] = [];

  for (const arg of args) {
    if (typeof arg === "number") {
      if (Number.isInteger(arg)) {
        typeTag += "i";
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(arg);
        argBuffers.push(buf);
      } else {
        typeTag += "f";
        const buf = Buffer.alloc(4);
        buf.writeFloatBE(arg);
        argBuffers.push(buf);
      }
    } else if (typeof arg === "string") {
      typeTag += "s";
      argBuffers.push(oscString(arg));
    } else if (typeof arg === "boolean") {
      typeTag += arg ? "T" : "F";
    }
  }

  parts.push(oscString(typeTag));
  parts.push(...argBuffers);

  return Buffer.concat(parts);
}

/**
 * Parse an OSC message buffer
 */
export function parseOSCMessage(data: Buffer): OSCMessage {
  // Find address (null-terminated string)
  let nullIdx = data.indexOf(0);
  const address = data.subarray(0, nullIdx).toString();

  // Align to 4 bytes
  let pos = nullIdx + 1;
  pos += (4 - (pos % 4)) % 4;

  // Find type tag
  if (data[pos] !== 0x2c) {
    // ','
    return { address, args: [] };
  }

  nullIdx = data.indexOf(0, pos);
  const typeTag = data.subarray(pos, nullIdx).toString();
  pos = nullIdx + 1;
  pos += (4 - (pos % 4)) % 4;

  // Parse arguments
  const args: (string | number | boolean)[] = [];

  for (let i = 1; i < typeTag.length; i++) {
    const t = typeTag[i];

    if (t === "f") {
      args.push(data.readFloatBE(pos));
      pos += 4;
    } else if (t === "i") {
      args.push(data.readInt32BE(pos));
      pos += 4;
    } else if (t === "s") {
      nullIdx = data.indexOf(0, pos);
      args.push(data.subarray(pos, nullIdx).toString());
      pos = nullIdx + 1;
      pos += (4 - (pos % 4)) % 4;
    } else if (t === "T") {
      args.push(true);
    } else if (t === "F") {
      args.push(false);
    }
  }

  return { address, args };
}

export interface OSCClientOptions {
  host: string;
  sendPort?: number;
  receivePort?: number;
  timeout?: number;
}

/**
 * OSC Client for communicating with AbletonOSC
 */
export class OSCClient extends EventEmitter {
  private host: string;
  private sendPort: number;
  private receivePort: number;
  private timeout: number;
  private socket: dgram.Socket | null = null;
  private responseHandlers: Map<
    string,
    { resolve: (msg: OSCMessage) => void; timer: NodeJS.Timeout }
  > = new Map();

  constructor(options: OSCClientOptions) {
    super();
    this.host = options.host;
    this.sendPort = options.sendPort ?? 11000;
    this.receivePort = options.receivePort ?? 11001;
    this.timeout = options.timeout ?? 5000;
  }

  /**
   * Start listening for responses
   */
  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = dgram.createSocket("udp4");

      this.socket.on("error", (err) => {
        this.emit("error", err);
        reject(err);
      });

      this.socket.on("message", (data) => {
        try {
          const msg = parseOSCMessage(data);
          this.emit("message", msg);

          // Check for pending response handlers
          const handler = this.responseHandlers.get(msg.address);
          if (handler) {
            clearTimeout(handler.timer);
            this.responseHandlers.delete(msg.address);
            handler.resolve(msg);
          }
        } catch (err) {
          this.emit("error", err);
        }
      });

      this.socket.bind(this.receivePort, () => {
        this.emit("connect");
        resolve();
      });
    });
  }

  /**
   * Close the connection
   */
  close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  /**
   * Send an OSC message (fire and forget)
   */
  send(address: string, ...args: (string | number | boolean)[]): void {
    if (!this.socket) {
      throw new Error("Not connected");
    }

    const msg = buildOSCMessage(address, ...args);
    this.socket.send(msg, this.sendPort, this.host);
  }

  /**
   * Send an OSC message and wait for response
   */
  async query(
    address: string,
    ...args: (string | number | boolean)[]
  ): Promise<OSCMessage> {
    if (!this.socket) {
      throw new Error("Not connected");
    }

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.responseHandlers.delete(address);
        reject(new Error(`Timeout waiting for response to ${address}`));
      }, this.timeout);

      this.responseHandlers.set(address, { resolve, timer });
      this.send(address, ...args);
    });
  }

  /**
   * Test connection to Ableton
   */
  async ping(): Promise<boolean> {
    try {
      const response = await this.query("/live/test");
      return response.args[0] === "ok";
    } catch {
      return false;
    }
  }
}
