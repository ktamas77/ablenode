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
- 🎚️ **Full API coverage** - Song, Tracks, Clips, ClipSlots, Devices, Scenes

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
await ableton.song.getMetronome();
await ableton.song.getState();  // Full snapshot

// Recording & Overdub
await ableton.song.getArrangementOverdub();
await ableton.song.getBackToArranger();
await ableton.song.getSessionRecord();
await ableton.song.getSessionRecordStatus();
await ableton.song.getRecordMode();

// Undo/Redo
await ableton.song.getCanUndo();
await ableton.song.getCanRedo();

// Loop
await ableton.song.getLoop();
await ableton.song.getLoopStart();
await ableton.song.getLoopLength();

// Quantization
await ableton.song.getClipTriggerQuantization();
await ableton.song.getMidiRecordingQuantization();
await ableton.song.getGrooveAmount();

// Nudge & Punch
await ableton.song.getNudgeDown();
await ableton.song.getNudgeUp();
await ableton.song.getPunchIn();
await ableton.song.getPunchOut();

// Scale
await ableton.song.getRootNote();
await ableton.song.getScaleName();

// Time Signature
await ableton.song.getSignatureNumerator();
await ableton.song.getSignatureDenominator();

// Setters
await ableton.song.setTempo(128);
await ableton.song.setMetronome(true);
await ableton.song.setArrangementOverdub(true);
await ableton.song.setBackToArranger(true);
await ableton.song.setLoop(true);
await ableton.song.setLoopStart(0);
await ableton.song.setLoopLength(16);
await ableton.song.setClipTriggerQuantization(ClipTriggerQuantization.OneBar);
await ableton.song.setMidiRecordingQuantization(MidiRecordingQuantization.Sixteenth);
await ableton.song.setGrooveAmount(0.5);
await ableton.song.setNudgeDown(true);
await ableton.song.setNudgeUp(true);
await ableton.song.setPunchIn(true);
await ableton.song.setPunchOut(true);
await ableton.song.setRecordMode(RecordMode.Session);
await ableton.song.setRootNote(0);  // C
await ableton.song.setScaleName("Major");
await ableton.song.setSessionRecord(true);
await ableton.song.setSignatureNumerator(4);
await ableton.song.setSignatureDenominator(4);

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
ableton.song.captureMidi();           // Capture recently played MIDI
ableton.song.triggerSessionRecord();  // Trigger session recording

// Cue Points
const cuePoints = await ableton.song.getCuePoints();
// [{ id: 0, name: "Intro", time: 0 }, { id: 1, name: "Chorus", time: 16 }]
ableton.song.addOrDeleteCuePoint(32);  // Add cue at beat 32
ableton.song.setCuePointName(0, "Verse 1");

// Beat Listener
ableton.song.startListenBeat();
// Handle /live/song/get/beat OSC messages from the client
ableton.song.stopListenBeat();

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

// Basic Getters
await track.getName();
await track.getColor();
await track.getColorIndex();
await track.getMute();
await track.getSolo();
await track.getArm();
await track.getVolume();         // Mixer volume (0.0-1.0, 0.85 = 0dB)
await track.getOutputMeterLevel(); // Meter level for visualization
await track.getPanning();

// Routing
await track.getInputRoutingChannel();
await track.getInputRoutingType();
await track.getOutputRoutingChannel();
await track.getOutputRoutingType();
await track.getAvailableInputRoutingChannels();
await track.getAvailableInputRoutingTypes();
await track.getAvailableOutputRoutingChannels();
await track.getAvailableOutputRoutingTypes();

// Track State
await track.getCurrentMonitoringState();  // MonitoringState.In/Auto/Off
await track.getFoldState();
await track.getHasAudioInput();
await track.getHasAudioOutput();
await track.getHasMidiInput();
await track.getHasMidiOutput();
await track.getIsFoldable();
await track.getIsGrouped();
await track.getIsVisible();

// Clip Slots
await track.getFiredSlotIndex();   // Index of fired slot (-1 if none)
await track.getPlayingSlotIndex(); // Index of playing slot

// Arrangement
const clips = await track.getArrangementClips();
// [{ startTime: 0, endTime: 16, name: "Intro", color: 0xFF0000 }]

// Setters
await track.setName("Bass");
await track.setColor(0x00FF00);
await track.setMute(true);
await track.setSolo(true);
await track.setArm(true);
await track.setVolume(0.85);      // Set mixer volume
await track.setPanning(-0.5);     // -1 to 1

// Routing Setters
await track.setInputRoutingChannel("1/2");
await track.setInputRoutingType("Ext. In");
await track.setOutputRoutingChannel("1/2");
await track.setOutputRoutingType("Master");

// State Setters
await track.setCurrentMonitoringState(MonitoringState.Auto);
await track.setFoldState(true);

// Actions
track.stop();  // Stop all clips on track

// Sends
await track.getSend(0);
await track.setSend(0, 0.5);

// Access clips, clip slots, and devices
const clip = track.getClip(0);
const clipSlot = track.getClipSlot(0);
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

// Basic Getters
await clip.getName();
await clip.getColor();
await clip.getColorIndex();
await clip.getLength();
await clip.getGain();
await clip.getIsPlaying();
await clip.getIsRecording();
await clip.getIsAudioClip();
await clip.getIsMidiClip();
await clip.getPlayingPosition();
await clip.getFilePath();

// Loop
await clip.getLoopStart();
await clip.getLoopEnd();
await clip.getLooping();

// Launch
await clip.getLaunchMode();
await clip.getLaunchQuantization();
await clip.getMuted();

// Audio Clip Properties
await clip.getWarpMode();
await clip.getWarping();
await clip.getSampleLength();
await clip.getRamMode();
await clip.getPitchCoarse();
await clip.getPitchFine();

// MIDI Clip Properties
await clip.getLegato();
await clip.getVelocityAmount();
await clip.getHasGroove();

// Recording
await clip.getIsOverdubbing();
await clip.getWillRecordOnStart();

// Markers & Position
await clip.getStartTime();
await clip.getPosition();
await clip.getStartMarker();
await clip.getEndMarker();

// Basic Setters
await clip.setName("Intro");
await clip.setColor(0xFF0000);
await clip.setGain(0.8);
await clip.setMuted(true);

// Loop Setters
await clip.setLoopStart(0);
await clip.setLoopEnd(16);
await clip.setLooping(true);

// Launch Setters
await clip.setLaunchMode(LaunchMode.Toggle);
await clip.setLaunchQuantization(LaunchQuantization.OneBar);

// Audio Clip Setters
await clip.setWarpMode(WarpMode.Complex);
await clip.setWarping(true);
await clip.setRamMode(true);
await clip.setPitchCoarse(2);   // Semitones
await clip.setPitchFine(-10);   // Cents

// MIDI Clip Setters
await clip.setLegato(true);
await clip.setVelocityAmount(0.8);

// Markers & Position Setters
await clip.setPosition(4.0);
await clip.setStartMarker(0);
await clip.setEndMarker(16);

// Playing Position Listener
clip.startListenPlayingPosition();
// Handle /live/clip/get/playing_position OSC messages
clip.stopListenPlayingPosition();

// MIDI Notes
const notes = await clip.getNotes();
await clip.addNotes([
  { pitch: 60, startTime: 0, duration: 0.5, velocity: 100, mute: false },
  { pitch: 64, startTime: 0.5, duration: 0.5, velocity: 90, mute: false },
]);
await clip.removeNotes();  // Remove all
await clip.removeNotes(60, 12, 0, 4);  // Remove range

// Loop & Quantize
clip.duplicateLoop();
clip.quantize(8, 1.0);  // Quantize to 8th notes, 100% strength
```

---

### ClipSlot

Control clip slots (cells) in the Session View.

```typescript
const clipSlot = ableton.getTrack(0).getClipSlot(0);

// Actions
clipSlot.fire();  // Fire the slot (play clip or stop)
clipSlot.createClip(4);  // Create empty 4-beat clip
clipSlot.deleteClip();
clipSlot.duplicateClipTo(1, 0);  // Duplicate to track 1, slot 0

// Getters
await clipSlot.getHasClip();
await clipSlot.getHasStopButton();
await clipSlot.getIsPlaying();
await clipSlot.getIsRecording();
await clipSlot.getIsTriggered();

// Setters
await clipSlot.setHasStopButton(true);
```

---

### Device

Control devices and their parameters.

```typescript
const device = ableton.getTrack(0).getDevice(0);

// Getters
await device.getName();
await device.getClassName();
await device.getType();  // DeviceType.AudioEffect/Instrument/MidiEffect
await device.getIsActive();
await device.getNumParameters();
await device.getParameterNames();
await device.getParameterValues();
await device.getParameterMins();
await device.getParameterMaxs();

// Parameter control
await device.getParameterValue(1);
await device.setParameterValue(1, 0.75);
await device.setAllParameterValues([0.5, 0.75, 1.0]);  // Set all at once
await device.getParameterMin(1);
await device.getParameterMax(1);
await device.getParameterName(1);
await device.getParameterIsQuantized(1);
await device.getParameterValueString(1);  // "440 Hz"

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
scene.fireAsSelected();  // Fire as if selected

// Getters
await scene.getName();
await scene.getColor();
await scene.getColorIndex();
await scene.getTempo();
await scene.getTimeSignatureNumerator();
await scene.getTimeSignatureDenominator();
await scene.getIsEmpty();
await scene.getIsTriggered();
await scene.getTempoEnabled();
await scene.getTimeSignatureEnabled();

// Setters
await scene.setName("Verse 1");
await scene.setColor(0xFF0000);
await scene.setColorIndex(5);
await scene.setTempo(120);
await scene.setTempoEnabled(true);
await scene.setTimeSignatureEnabled(true);
```

---

## Enums

```typescript
import {
  LaunchMode,
  WarpMode,
  LaunchQuantization,
  ClipTriggerQuantization,
  MidiRecordingQuantization,
  RecordMode,
  MonitoringState,
  DeviceType,
} from "ablenode";

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

// ClipTriggerQuantization
ClipTriggerQuantization.None       // 0
ClipTriggerQuantization.EightBars  // 1
ClipTriggerQuantization.OneBar     // 4
// ... and more

// MidiRecordingQuantization
MidiRecordingQuantization.None       // 0
MidiRecordingQuantization.Quarter    // 1
MidiRecordingQuantization.Eighth     // 2
MidiRecordingQuantization.Sixteenth  // 5
// ... and more

// RecordMode
RecordMode.Arrangement  // 0
RecordMode.Session      // 1

// MonitoringState
MonitoringState.In    // 0
MonitoringState.Auto  // 1
MonitoringState.Off   // 2

// DeviceType
DeviceType.Undefined    // 0
DeviceType.AudioEffect  // 1
DeviceType.Instrument   // 2
DeviceType.MidiEffect   // 3
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
