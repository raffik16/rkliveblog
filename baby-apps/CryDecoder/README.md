# 🍼 CryDecoder

AI-powered real-time baby cry analyzer with 95% accuracy claim. CryDecoder listens to your baby's cry and tells you exactly what they need.

## Features

- **Real-time Audio Analysis**: Uses Web Audio API for instant cry detection
- **5 Cry Types Detection**:
  - 🍼 Hungry
  - 😴 Tired
  - 💧 Wet Diaper
  - 😣 Pain/Discomfort
  - 😐 Bored
- **Confidence Scoring**: Shows confidence level for each analysis (90-98% range)
- **Visual Waveform**: Real-time audio visualization
- **Analysis History**: Tracks recent cry analyses with timestamps
- **Responsive Design**: Works on desktop and mobile devices

## How It Works

CryDecoder uses advanced audio signal processing to analyze:
- **Volume**: Overall loudness of the cry
- **Intensity**: Frequency spectrum energy
- **Dominant Frequency**: Primary pitch of the cry
- **Variability**: Changes in the cry pattern

These features are then classified using pattern matching algorithms that simulate AI-based cry recognition.

## Installation

1. Navigate to the CryDecoder directory:
```bash
cd baby-apps/CryDecoder
```

2. Install dependencies:
```bash
npm install
```

3. Start the app:
```bash
npm start
```

The app will open in your browser at `http://localhost:3001`

## Usage

1. Click **"Start Listening"** to begin audio analysis
2. Allow microphone access when prompted
3. The app will continuously analyze audio and update results every 3 seconds
4. View the current analysis in the main result card
5. Check the history section for recent analyses
6. Click **"Stop"** when finished

## Browser Requirements

- Modern browser with Web Audio API support (Chrome, Firefox, Safari, Edge)
- Microphone access permission
- HTTPS or localhost (required for microphone access)

## Technical Details

- **Audio Sampling**: 2048 FFT size for frequency analysis
- **Analysis Interval**: 3 seconds between cry classifications
- **Minimum Volume Threshold**: 30 (to filter out background noise)
- **Confidence Range**: 90-98% for realistic results

## Disclaimer

⚠️ CryDecoder is a demonstration app for entertainment and educational purposes. It does not use actual machine learning models and should not replace professional medical advice. Always consult healthcare professionals for medical concerns about your baby.

## Future Enhancements

- Integration with actual ML models trained on baby cry datasets
- Cloud-based analysis for improved accuracy
- Multiple baby profiles
- Cry pattern trends over time
- Integration with smart home devices
- Multilingual support

## License

MIT
