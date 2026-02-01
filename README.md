# AbleNode 🎹

Control Ableton Live via [AbletonOSC](https://github.com/ideoforms/AbletonOSC) from Node.js/TypeScript.

> A TypeScript wrapper for AbletonOSC - combining AbletonJS-style ergonomics with the widely-deployed AbletonOSC remote script.

## Features

- 🎯 **TypeScript native** - Full type safety and autocomplete
- 🔌 **Uses AbletonOSC** - Works with the popular Python remote script
- 📡 **Network-native** - Control Ableton over LAN, Tailscale, etc.
- 🎭 **Multi-instance** - Control multiple Live instances simultaneously
- 👂 **Event listeners** - Subscribe to property changes
- 🪶 **Zero dependencies** - Just Node.js built-ins
- 🎚️ **Full API coverage** - Song, Tracks, Clips, Devices, Scenes

## Prerequisites

1. Install [AbletonOSC](https://github.com/ideoforms/AbletonOSC) remote script in Ableton Live 11+
2. Enable it in Live's Preferences → Link / Tempo / MIDI → Control Surface

## Installation

```bash
npm install ablenode
```

## Quick Start

```typescript
import { Ableton } from "ablenode";

const ableton = new Ableton({ host: "192.168.1.72" });
await ableton.connect();

// Get tempo
const tempo = await ableton.song.getTempo();
console.log(`Tempo: ${tempo} BPM`);

// Control transport
ableton.song.play();
ableton.song.stop();

// Set tempo
await ableton.song.setTempo(128);
```

## Multi-Instance Control

```typescript
import { createMultiple } from "ablenode";

const instances = createMultiple([
  { name: "Studio", host: "192.168.1.72" },
  { name: "Laptop", host: "100.80.245.114" },
]);

await instances.Studio.connect();
await instances.Laptop.connect();

// Sync tempos
const studioTempo = await instances.Studio.song.getTempo();
await instances.Laptop.song.setTempo(studioTempo);
```

## API Reference

### Ableton

Main class for controlling Ableton Live.

```typescript
const ableton = new Ableton({
  host: "127.0.0.1",     // IP address
  sendPort: 11000,       // AbletonOSC send port
  receivePort: 11001,    // AbletonOSC receive port
  timeout: 5000,         // Query timeout in ms
  logger: console,       // Optional logging
});

await ableton.connect();
```

#### Methods

| Method | Description |
|--------|-------------|
| `connect()` | Connect to Ableton |
| `disconnect()` | Disconnect |
| `ping()` | Test connection |
| `getVersion()` | Get Live version |
| `showMessage(msg)` | Show message in status bar |
| `getTrack(id)` | Get Track object |
| `getTrackNames()` | Get all track names |
| `getNumTracks()` | Get track count |
| `createMidiTrack(index?)` | Create MIDI track |
| `createAudioTrack(index?)` | Create audio track |
| `deleteTrack(id)` | Delete track |
| `duplicateTrack(id)` | Duplicate track |
| `getScene(id)` | Get Scene object |
| `getSceneNames()` | Get all scene names |
| `getNumScenes()` | Get scene count |
| `createScene(index?)` | Create scene |
| `deleteScene(id)` | Delete scene |
| `duplicateScene(id)` | Duplicate scene |
| `getSelectedTrack()` | Get selected track index |
| `setSelectedTrack(id)` | Set selected track |
| `getSelectedScene()` | Get selected scene index |
| `setSelectedScene(id)` | Set selected scene |

---

### Song

Control transport, tempo, and global properties.

```typescript
// Getters
await ableton.song.getTempo();
await ableton.song.getIsPlaying();
await ableton.song.getCurrentTime();
await ableton.song.getSongLength();
await ableton.song.getState();  // Full snapshot

// Setters
await ableton.song.setTempo(128);

// Transport
ableton.song.play();
ableton.song.stop();
ableton.song.continuePlaying();
ableton.song.stopAllClips();

// Navigation
ableton.song.jumpBy(4);         // Jump 4 beats
ableton.song.jumpToNextCue();
ableton.song.jumpToPrevCue();
ableton.song.jumpToCue("Chorus");

// Other
ableton.song.undo();
ableton.song.redo();
ableton.song.tapTempo();

// Event listeners
const unsub = ableton.song.addListener("tempo", (bpm) => {
  console.log(`Tempo: ${bpm}`);
});
unsub();  // Stop listening
```

---

### Track

Control individual tracks.

```typescript
const track = ableton.getTrack(0);

// Getters
await track.getName();
await track.getColor();
await track.getMute();
await track.getSolo();
await track.getArm();
await track.getVolume();
await track.getPanning();

// Setters
await track.setName("Bass");
await track.setMute(true);
await track.setSolo(true);
await track.setArm(true);
await track.setPanning(-0.5);  // -1 to 1

// Actions
track.stop();  // Stop all clips on track

// Sends
await track.getSend(0);
await track.setSend(0, 0.5);

// Access clips and devices
const clip = track.getClip(0);
const device = track.getDevice(0);
await track.getClipNames();
await track.getDeviceNames();
await track.getNumDevices();
```

---

### Clip

Control clips in tracks.

```typescript
const clip = ableton.getTrack(0).getClip(0);

// Transport
clip.fire();
clip.stop();

// Getters
await clip.getName();
await clip.getColor();
await clip.getLength();
await clip.getGain();
await clip.getIsPlaying();
await clip.getIsRecording();
await clip.getIsAudioClip();
await clip.getIsMidiClip();
await clip.getPlayingPosition();
await clip.getLoopStart();
await clip.getLoopEnd();
await clip.getLaunchMode();
await clip.getWarpMode();
await clip.getMuted();
await clip.getFilePath();

// Setters
await clip.setName("Intro");
await clip.setGain(0.8);
await clip.setLoopStart(0);
await clip.setLoopEnd(16);
await clip.setLaunchMode(LaunchMode.Toggle);
await clip.setWarpMode(WarpMode.Complex);
await clip.setMuted(true);
await clip.setPitchCoarse(2);   // Semitones
await clip.setPitchFine(-10);   // Cents

// MIDI Notes
const notes = await clip.getNotes();
await clip.addNotes([
  { pitch: 60, startTime: 0, duration: 0.5, velocity: 100, mute: false },
  { pitch: 64, startTime: 0.5, duration: 0.5, velocity: 90, mute: false },
]);
await clip.removeNotes();  // Remove all
await clip.removeNotes(60, 12, 0, 4);  // Remove range

// Loop
clip.duplicateLoop();
```

---

### Device

Control devices and their parameters.

```typescript
const device = ableton.getTrack(0).getDevice(0);

// Getters
await device.getName();
await device.getClassName();
await device.getIsActive();
await device.getNumParameters();
await device.getParameterNames();
await device.getParameterValues();

// Parameter control
await device.getParameterValue(1);
await device.setParameterValue(1, 0.75);
await device.getParameterMin(1);
await device.getParameterMax(1);
await device.getParameterName(1);

// Get full parameter info
const param = await device.getParameter(1);
// { id: 1, name: "Cutoff", value: 0.5, min: 0, max: 1 }

const allParams = await device.getAllParameters();
```

---

### Scene

Control scenes (rows in Session View).

```typescript
const scene = ableton.getScene(0);

// Transport
scene.fire();  // Launch scene

// Getters
await scene.getName();
await scene.getColor();
await scene.getTempo();
await scene.getTimeSignatureNumerator();
await scene.getTimeSignatureDenominator();

// Setters
await scene.setName("Verse 1");
await scene.setColor(0xFF0000);
await scene.setTempo(120);
```

---

## Enums

```typescript
import { LaunchMode, WarpMode, LaunchQuantization } from "ablenode";

// LaunchMode
LaunchMode.Trigger  // 0
LaunchMode.Gate     // 1
LaunchMode.Toggle   // 2
LaunchMode.Repeat   // 3

// WarpMode
WarpMode.Beats      // 0
WarpMode.Tones      // 1
WarpMode.Texture    // 2
WarpMode.RePitch    // 3
WarpMode.Complex    // 4
WarpMode.Pro        // 6

// LaunchQuantization
LaunchQuantization.Global       // 0
LaunchQuantization.None         // 1
LaunchQuantization.OneBar       // 5
LaunchQuantization.Quarter      // 8
// ... and more
```

---

## Why AbleNode?

| | AbletonOSC | AbletonJS | AbleNode |
|--|------------|-----------|----------|
| Language | Any (OSC) | TypeScript | TypeScript |
| Remote Script | AbletonOSC | AbletonJS (separate) | **AbletonOSC** ✅ |
| Protocol | OSC/UDP | JSON/UDP | OSC/UDP |
| Multi-instance | Manual | ✅ | ✅ |
| Event listeners | Polling | Native | Polling |
| Dependencies | None | None | **None** |

AbleNode combines the clean TypeScript API of AbletonJS with the widely-deployed AbletonOSC remote script. If you already use AbletonOSC, AbleNode works out of the box.

## Contributing

Contributions welcome! This project uses:
- TypeScript
- ESLint + Prettier
- Husky pre-commit hooks

```bash
npm install
npm run build
npm run lint
npm run test
```

## License

MIT © [ktamas77](https://github.com/ktamas77)

## Credits

- [AbletonOSC](https://github.com/ideoforms/AbletonOSC) by ideoforms - the excellent Python remote script
- [AbletonJS](https://github.com/leolabs/ableton-js) by leolabs - API design inspiration
