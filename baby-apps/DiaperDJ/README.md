# 🎵 Diaper DJ

Transform diaper-changing meltdowns into musical masterpieces! Diaper DJ lets you create custom remixes featuring your baby's cry samples pitched and beat-matched with any song you hum.

## Features

- **🎤 Hum Recording**: Record any melody or nursery rhyme
- **👶 Cry Sampling**: Capture your baby's unique cries
- **🎚️ Advanced Mixing**:
  - Pitch shifting (±12 semitones)
  - Independent volume controls
  - BPM adjustment (60-180 BPM)
  - Rhythmic cry chopping
- **🎧 Real-time Playback**: Listen to your remixes instantly
- **💾 Export功能**: Download your masterpieces as WAV files
- **📊 Waveform Visualization**: See your audio in real-time

## How It Works

### Step 1: Record Your Melody
1. Click "Record Hum"
2. Hum, sing, or play any tune you like
3. Click "Stop" when done
4. Preview your recording with "Play Hum"

### Step 2: Capture Baby Cries
1. Click "Record Cry" (enabled after recording a hum)
2. Capture your baby's crying sounds
3. Click "Stop" when you have enough audio
4. Preview with "Play Cry"

### Step 3: Create Remix
1. Click "Generate Remix"
2. Adjust the parameters:
   - **Cry Pitch**: Make cries higher or lower (-12 to +12 semitones)
   - **Cry Volume**: Control cry sample loudness (0-100%)
   - **Hum Volume**: Control melody loudness (0-100%)
   - **BPM**: Set the tempo (60-180 beats per minute)
3. Click "Generate Remix" again to update with new settings

### Step 4: Play & Save
1. Click "Play Remix" to hear your creation
2. Use "Download" to save as a WAV file
3. Play during diaper changes to distract and entertain!

## Technical Details

### Audio Processing
- **Web Audio API**: Real-time audio processing
- **MediaRecorder API**: High-quality audio capture
- **Offline Audio Context**: Professional-grade mixing
- **Pitch Shifting**: Time-domain pitch modification with interpolation
- **Rhythmic Chopping**: BPM-synced cry segmentation with fade envelopes

### Audio Features
- Stereo (2-channel) output
- 44.1 kHz sample rate
- 16-bit PCM WAV export
- Linear interpolation for smooth pitch shifting
- Automatic fade-in/fade-out on cry segments

### Browser Compatibility
- Chrome/Edge 91+
- Firefox 88+
- Safari 14.1+
- Opera 77+

## Installation

1. Navigate to the DiaperDJ directory:
```bash
cd baby-apps/DiaperDJ
```

2. Install dependencies:
```bash
npm install
```

3. Start the app:
```bash
npm start
```

The app will open in your browser at `http://localhost:3002`

## Requirements

- Modern browser with:
  - Web Audio API support
  - MediaRecorder API support
  - getUserMedia support
- Microphone access permission
- HTTPS or localhost (required for microphone)
- Minimum 2GB RAM recommended for audio processing

## Pro Tips

💡 **Best Recording Practices**:
- Record in a quiet environment
- Keep microphone 6-12 inches away
- Record 5-10 seconds of each sound
- Try multiple takes for best results

💡 **Remix Tips**:
- Start with 120 BPM for a danceable groove
- Try pitch shifting cries up 3-5 semitones for melodic effect
- Balance cry volume at 60-70% for good mix
- Experiment with different BPMs for various moods

💡 **Creative Ideas**:
- Record lullabies as the base melody
- Mix multiple cry samples for variety
- Create a library of remixes for different occasions
- Share your best remixes with other parents!

## Use Cases

- **Diaper Changes**: Distract baby during uncomfortable moments
- **Tummy Time**: Entertainment during exercise
- **Car Rides**: Keep baby engaged during travel
- **Photo Shoots**: Capture smiles with familiar sounds
- **Bonding**: Create special musical moments together

## Architecture

The app consists of three main components:

1. **Recorder**: Handles microphone input and MediaRecorder API
2. **Processor**: Applies effects (pitch shift, rhythm, mixing)
3. **Player**: Manages playback and visualization

Audio pipeline:
```
Microphone → MediaRecorder → Blob → AudioBuffer
                                        ↓
Hum Buffer ──────┐
                 ├──→ Mixer → Offline Context → Remix Buffer → Playback
Cry Buffer ──────┘     ↑
                       └── Pitch Shift + Rhythm
```

## Future Enhancements

- Multiple cry sample support
- Built-in beat library
- Effects (reverb, delay, distortion)
- Cloud storage for remixes
- Social sharing features
- Real-time live mixing mode
- MIDI controller support
- Spectral effects
- Looping and layering
- Parent collaboration features

## Troubleshooting

**No audio recording**:
- Check microphone permissions
- Try a different browser
- Ensure microphone is connected

**Remix sounds distorted**:
- Lower cry volume setting
- Reduce pitch shift amount
- Try different BPM

**Can't download remix**:
- Check browser download permissions
- Ensure sufficient storage space
- Try a different browser

## License

MIT

---

Made with 💕 for parents who need creative solutions to parenting challenges!
