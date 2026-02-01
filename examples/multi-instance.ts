/**
 * Multi-instance example: Control multiple Ableton instances
 */

import { createMultiple } from "../src/index.js";

const STUDIO_IP = "192.168.1.72"; // Streaming rig
const LAPTOP_TAILSCALE = "100.80.245.114"; // Personal laptop

async function main() {
  console.log("🎹 AbleNode Multi-Instance Example\n");

  // Method 1: Create instances manually (commented out - using Method 2)
  // const studio = new Ableton({ host: STUDIO_IP });
  // const laptop = new Ableton({ host: LAPTOP_TAILSCALE });

  // Method 2: Use createMultiple helper
  const instances = createMultiple([
    { name: "Studio", host: STUDIO_IP },
    { name: "Laptop", host: LAPTOP_TAILSCALE },
  ]);

  // Connect to both
  const results = await Promise.allSettled([
    instances.Studio.connect().then(() => "Studio"),
    instances.Laptop.connect().then(() => "Laptop"),
  ]);

  // Check which ones connected
  for (const result of results) {
    if (result.status === "fulfilled") {
      console.log(`✅ ${result.value} connected`);
    } else {
      console.log(`❌ Failed: ${result.reason}`);
    }
  }

  // Get tempo from each connected instance
  console.log("\nTempos:");

  if (instances.Studio.connected) {
    try {
      const tempo = await instances.Studio.song.getTempo();
      console.log(`  Studio: ${tempo} BPM`);
    } catch {
      console.log(`  Studio: offline`);
    }
  }

  if (instances.Laptop.connected) {
    try {
      const tempo = await instances.Laptop.song.getTempo();
      console.log(`  Laptop: ${tempo} BPM`);
    } catch {
      console.log(`  Laptop: offline`);
    }
  }

  // Sync tempos (copy from Studio to Laptop)
  // if (instances.Studio.connected && instances.Laptop.connected) {
  //   const studioTempo = await instances.Studio.song.getTempo();
  //   await instances.Laptop.song.setTempo(studioTempo);
  //   console.log(`\n🔗 Synced: Laptop tempo set to ${studioTempo} BPM`);
  // }

  // Clean up
  instances.Studio.disconnect();
  instances.Laptop.disconnect();

  console.log("\n✅ Done!");
}

main();
