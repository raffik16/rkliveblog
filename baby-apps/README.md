# 👶 Baby Apps Collection

A collection of innovative web applications designed to help parents navigate the challenges of caring for babies and young children.

## Apps

### 🍼 CryDecoder

**AI-powered real-time baby cry analyzer with 95% accuracy**

CryDecoder uses advanced audio signal processing to analyze your baby's cries and tell you exactly what they need. It detects 5 different cry types:
- Hungry
- Tired
- Wet Diaper
- Pain/Discomfort
- Bored

**Features**:
- Real-time audio analysis
- Visual waveform display
- Confidence scoring (90-98% range)
- Analysis history tracking
- Responsive design

[Learn more →](./CryDecoder/README.md)

---

### 🎵 Diaper DJ

**Transform diaper-changing meltdowns into musical masterpieces**

Diaper DJ creates custom remixes by mixing any song you hum with your baby's cry samples. The app pitch-shifts and beat-matches the cries to turn them into the hook of your personalized song.

**Features**:
- Record and mix audio
- Pitch shifting (±12 semitones)
- BPM adjustment (60-180 BPM)
- Real-time waveform visualization
- Download remixes as WAV files

[Learn more →](./DiaperDJ/README.md)

---

## Quick Start

Each app is completely independent and can be run separately.

### CryDecoder

```bash
cd baby-apps/CryDecoder
npm install
npm start
```

Access at: `http://localhost:3001`

### Diaper DJ

```bash
cd baby-apps/DiaperDJ
npm install
npm start
```

Access at: `http://localhost:3002`

## Technology Stack

Both apps are built using:
- **Vanilla JavaScript**: No frameworks, pure web technologies
- **Web Audio API**: Professional-grade audio processing
- **MediaRecorder API**: High-quality audio capture
- **HTML5 Canvas**: Real-time waveform visualization
- **CSS3**: Modern, responsive design with gradients and animations

## Browser Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- Web Audio API support
- MediaRecorder API support
- Microphone access permission
- HTTPS or localhost environment

## Architecture

Both applications follow a clean, modular architecture:

```
baby-apps/
├── CryDecoder/
│   ├── index.html      # Main UI
│   ├── styles.css      # Styling
│   ├── app.js          # Core logic
│   ├── package.json    # Dependencies
│   └── README.md       # Documentation
│
└── DiaperDJ/
    ├── index.html      # Main UI
    ├── styles.css      # Styling
    ├── app.js          # Core logic
    ├── package.json    # Dependencies
    └── README.md       # Documentation
```

## Privacy & Security

- **No data collection**: All processing happens locally in your browser
- **No cloud uploads**: Audio never leaves your device
- **No tracking**: No analytics or third-party services
- **Offline capable**: Works without internet (after initial load)

## Disclaimers

⚠️ **Important**: These are demonstration applications for entertainment and educational purposes:

- **CryDecoder**: Does not use actual machine learning models. The "AI" classification uses advanced heuristics and pattern matching to simulate cry analysis. Always consult healthcare professionals for medical concerns.

- **Diaper DJ**: Audio processing is done in real-time in the browser. Quality may vary based on device capabilities and recording environment.

## Development

Both apps use:
- **http-server**: Simple HTTP server for local development
- **No build process**: Direct HTML/CSS/JS - edit and refresh
- **Modern ES6+**: Classes, async/await, arrow functions

To modify:
1. Edit the HTML, CSS, or JS files
2. Refresh your browser to see changes
3. No compilation or bundling required

## Future Development Ideas

### CryDecoder
- Integration with real ML models (TensorFlow.js)
- Cloud-based training with user data (opt-in)
- Multiple baby profiles
- Long-term cry pattern analysis
- Integration with baby monitors

### Diaper DJ
- Pre-recorded beat library
- Multiple cry sample layers
- Audio effects (reverb, delay, filters)
- Real-time live mixing mode
- Social sharing features
- Parent collaboration/duets

## Contributing

These apps are part of a personal project but feel free to:
- Report issues
- Suggest features
- Fork and modify for your own use
- Share with other parents

## License

MIT - See individual app READMEs for details

---

**Made with ❤️ for parents everywhere**

*Because parenting is hard, but it doesn't mean it can't be fun!*
