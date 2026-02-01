/**
 * Basic example: Connect to Ableton and get song info
 */

import { Ableton } from "../src/index.js";

const LAPTOP_TAILSCALE = "100.80.245.114";

async function main() {
  console.log("🎹 AbleNode Basic Example\n");

  // Create instance pointing to your Ableton
  const ableton = new Ableton({
    host: LAPTOP_TAILSCALE,
    logger: console,
  });

  try {
    // Connect
    await ableton.connect();
    console.log("✅ Connected!\n");

    // Test connection
    const ok = await ableton.ping();
    console.log(`Ping: ${ok ? "✅" : "❌"}\n`);

    // Get version
    const version = await ableton.getVersion();
    console.log(`Ableton Live ${version.major}.${version.minor}\n`);

    // Get song state
    const state = await ableton.song.getState();
    console.log("Song State:");
    console.log(`  Tempo: ${state.tempo} BPM`);
    console.log(`  Playing: ${state.isPlaying ? "▶️" : "⏹️"}`);
    console.log(`  Position: ${state.currentTime.toFixed(1)} beats`);
    console.log(`  Length: ${state.songLength.toFixed(1)} beats`);

    // Show message in Ableton
    ableton.showMessage("Hello from AbleNode! 👋");

    // Clean up
    ableton.disconnect();
    console.log("\n✅ Done!");
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

main();
