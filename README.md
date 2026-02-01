# AbleNode 🎹

Control Ableton Live via [AbletonOSC](https://github.com/ideoforms/AbletonOSC) from Node.js/TypeScript.

> A lightweight TypeScript wrapper for AbletonOSC - the best of both worlds: AbletonJS-style ergonomics with AbletonOSC's mature remote script.

## Features

- 🎯 **TypeScript native** - Full type safety and autocomplete
- 🔌 **Uses AbletonOSC** - No separate remote script needed if you already have AbletonOSC
- 📡 **Network-native** - Control Ableton over LAN, Tailscale, etc.
- 🎭 **Multi-instance** - Control multiple Live instances simultaneously
- 👂 **Event listeners** - Subscribe to property changes
- 🪶 **Zero dependencies** - Just Node.js built-ins

## Prerequisites

1. Install [AbletonOSC](https://github.com/ideoforms/AbletonOSC) remote script in Ableton Live
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

Control multiple Ableton instances at once:

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

## Event Listeners

Listen for property changes:

```typescript
// Subscribe to tempo changes
const unsubscribe = ableton.song.addListener("tempo", (bpm) => {
  console.log(`Tempo changed: ${bpm}`);
});

// Later: stop listening
unsubscribe();
```

## API Reference

### Ableton

Main class for controlling Ableton Live.

```typescript
const ableton = new Ableton({
  host: "127.0.0.1",    // IP address (default: localhost)
  sendPort: 11000,       // AbletonOSC send port
  receivePort: 11001,    // AbletonOSC receive port
  timeout: 5000,         // Query timeout in ms
  logger: console,       // Optional: enable logging
});
```

#### Methods

- `connect()` - Connect to Ableton
- `disconnect()` - Disconnect
- `ping()` - Test connection
- `getVersion()` - Get Ableton Live version
- `showMessage(msg)` - Show message in Live's status bar

### Song

Control transport, tempo, and song properties.

#### Getters

- `getTempo()` - Get current tempo
- `getIsPlaying()` - Get play state
- `getCurrentTime()` - Get current position (beats)
- `getSongLength()` - Get song length (beats)
- `getState()` - Get full state snapshot

#### Setters

- `setTempo(bpm)` - Set tempo

#### Transport

- `play()` - Start playback
- `stop()` - Stop playback
- `continuePlaying()` - Continue from current position
- `stopAllClips()` - Stop all clips

#### Navigation

- `jumpBy(beats)` - Jump forward/backward
- `jumpToNextCue()` - Jump to next cue point
- `jumpToPrevCue()` - Jump to previous cue point
- `jumpToCue(nameOrIndex)` - Jump to specific cue point

#### Other

- `undo()` - Undo last action
- `redo()` - Redo last undone action
- `tapTempo()` - Tap tempo

## Why AbleNode?

| | AbletonOSC | AbletonJS | AbleNode |
|--|------------|-----------|----------|
| Language | Any (OSC) | TypeScript | TypeScript |
| Remote Script | AbletonOSC | AbletonJS (separate) | AbletonOSC ✅ |
| Protocol | OSC/UDP | JSON/UDP | OSC/UDP |
| Multi-instance | Manual | ✅ | ✅ |
| Event listeners | Polling | Native | Polling |
| Dependencies | None | None | None |

AbleNode gives you the clean TypeScript API of AbletonJS while using the widely-deployed AbletonOSC remote script.

## License

MIT © [Squidcode](https://squidcode.com)
