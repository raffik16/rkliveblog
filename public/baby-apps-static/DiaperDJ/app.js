// Diaper DJ - Baby Cry Remix Studio
// Transform diaper-changing meltdowns into musical masterpieces

class DiaperDJ {
  constructor() {
    this.audioContext = null
    this.humRecorder = null
    this.cryRecorder = null
    this.humBlob = null
    this.cryBlob = null
    this.humBuffer = null
    this.cryBuffer = null
    this.remixBuffer = null
    this.currentSource = null
    this.isPlaying = false
    this.startTime = 0
    this.pauseTime = 0

    this.initializeUI()
    this.setupEventListeners()
  }

  initializeUI() {
    // Hum recording
    this.recordHumBtn = document.getElementById('recordHumBtn')
    this.stopHumBtn = document.getElementById('stopHumBtn')
    this.playHumBtn = document.getElementById('playHumBtn')
    this.humStatus = document.getElementById('humStatus')
    this.humCanvas = document.getElementById('humWaveform')
    this.humCtx = this.humCanvas.getContext('2d')

    // Cry recording
    this.recordCryBtn = document.getElementById('recordCryBtn')
    this.stopCryBtn = document.getElementById('stopCryBtn')
    this.playCryBtn = document.getElementById('playCryBtn')
    this.cryStatus = document.getElementById('cryStatus')
    this.cryCanvas = document.getElementById('cryWaveform')
    this.cryCtx = this.cryCanvas.getContext('2d')

    // Remix
    this.remixBtn = document.getElementById('remixBtn')
    this.remixStatus = document.getElementById('remixStatus')
    this.remixControls = document.getElementById('remixControls')
    this.pitchSlider = document.getElementById('pitchSlider')
    this.pitchValue = document.getElementById('pitchValue')
    this.cryVolumeSlider = document.getElementById('cryVolumeSlider')
    this.cryVolumeValue = document.getElementById('cryVolumeValue')
    this.humVolumeSlider = document.getElementById('humVolumeSlider')
    this.humVolumeValue = document.getElementById('humVolumeValue')
    this.bpmSlider = document.getElementById('bpmSlider')
    this.bpmValue = document.getElementById('bpmValue')

    // Playback
    this.playbackSection = document.getElementById('playbackSection')
    this.playRemixBtn = document.getElementById('playRemixBtn')
    this.pauseRemixBtn = document.getElementById('pauseRemixBtn')
    this.downloadRemixBtn = document.getElementById('downloadRemixBtn')
    this.progressFill = document.getElementById('progressFill')
    this.trackBpm = document.getElementById('trackBpm')
    this.trackDuration = document.getElementById('trackDuration')
    this.playbackCanvas = document.getElementById('playbackWaveform')
    this.playbackCtx = this.playbackCanvas.getContext('2d')

    this.setupCanvases()
  }

  setupCanvases() {
    ;[this.humCanvas, this.cryCanvas, this.playbackCanvas].forEach((canvas) => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    })
  }

  setupEventListeners() {
    // Hum recording
    this.recordHumBtn.addEventListener('click', () => this.startRecording('hum'))
    this.stopHumBtn.addEventListener('click', () => this.stopRecording('hum'))
    this.playHumBtn.addEventListener('click', () => this.playRecording('hum'))

    // Cry recording
    this.recordCryBtn.addEventListener('click', () => this.startRecording('cry'))
    this.stopCryBtn.addEventListener('click', () => this.stopRecording('cry'))
    this.playCryBtn.addEventListener('click', () => this.playRecording('cry'))

    // Remix
    this.remixBtn.addEventListener('click', () => this.generateRemix())
    this.pitchSlider.addEventListener('input', (e) => {
      this.pitchValue.textContent = e.target.value
    })
    this.cryVolumeSlider.addEventListener('input', (e) => {
      this.cryVolumeValue.textContent = e.target.value + '%'
    })
    this.humVolumeSlider.addEventListener('input', (e) => {
      this.humVolumeValue.textContent = e.target.value + '%'
    })
    this.bpmSlider.addEventListener('input', (e) => {
      this.bpmValue.textContent = e.target.value
    })

    // Playback
    this.playRemixBtn.addEventListener('click', () => this.playRemix())
    this.pauseRemixBtn.addEventListener('click', () => this.pauseRemix())
    this.downloadRemixBtn.addEventListener('click', () => this.downloadRemix())
  }

  async startRecording(type) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      const audioChunks = []

      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data)
      })

      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })

        if (type === 'hum') {
          this.humBlob = audioBlob
          this.humBuffer = await this.blobToAudioBuffer(audioBlob)
          this.humStatus.textContent = '✓ Recorded'
          this.humStatus.style.color = '#27ae60'
          this.playHumBtn.disabled = false
          this.recordCryBtn.disabled = false
          this.drawWaveform(this.humBuffer, this.humCtx, this.humCanvas)
        } else {
          this.cryBlob = audioBlob
          this.cryBuffer = await this.blobToAudioBuffer(audioBlob)
          this.cryStatus.textContent = '✓ Recorded'
          this.cryStatus.style.color = '#27ae60'
          this.playCryBtn.disabled = false
          this.remixBtn.disabled = false
          this.drawWaveform(this.cryBuffer, this.cryCtx, this.cryCanvas)
        }

        stream.getTracks().forEach((track) => track.stop())
      })

      if (type === 'hum') {
        this.humRecorder = mediaRecorder
        this.recordHumBtn.disabled = true
        this.stopHumBtn.disabled = false
        this.humStatus.textContent = '⏺️ Recording...'
        this.humStatus.style.color = '#e74c3c'
      } else {
        this.cryRecorder = mediaRecorder
        this.recordCryBtn.disabled = true
        this.stopCryBtn.disabled = false
        this.cryStatus.textContent = '⏺️ Recording...'
        this.cryStatus.style.color = '#e74c3c'
      }

      mediaRecorder.start()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone. Please grant permission and try again.')
    }
  }

  stopRecording(type) {
    if (type === 'hum' && this.humRecorder) {
      this.humRecorder.stop()
      this.recordHumBtn.disabled = false
      this.stopHumBtn.disabled = true
    } else if (type === 'cry' && this.cryRecorder) {
      this.cryRecorder.stop()
      this.recordCryBtn.disabled = false
      this.stopCryBtn.disabled = true
    }
  }

  async blobToAudioBuffer(blob) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }

    const arrayBuffer = await blob.arrayBuffer()
    return await this.audioContext.decodeAudioData(arrayBuffer)
  }

  async playRecording(type) {
    const buffer = type === 'hum' ? this.humBuffer : this.cryBuffer
    if (!buffer) return

    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }

    const source = this.audioContext.createBufferSource()
    source.buffer = buffer
    source.connect(this.audioContext.destination)
    source.start()
  }

  drawWaveform(buffer, ctx, canvas) {
    const data = buffer.getChannelData(0)
    const step = Math.ceil(data.length / canvas.width)
    const amp = canvas.height / 2

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#f5576c'
    ctx.lineWidth = 2
    ctx.beginPath()

    for (let i = 0; i < canvas.width; i++) {
      const min = Math.min(...data.slice(i * step, (i + 1) * step))
      const max = Math.max(...data.slice(i * step, (i + 1) * step))

      ctx.moveTo(i, (1 + min) * amp)
      ctx.lineTo(i, (1 + max) * amp)
    }

    ctx.stroke()
  }

  async generateRemix() {
    if (!this.humBuffer || !this.cryBuffer) return

    this.remixStatus.textContent = '🎛️ Generating remix...'
    this.remixBtn.disabled = true

    // Get parameters
    const pitchShift = parseInt(this.pitchSlider.value)
    const cryVolume = parseInt(this.cryVolumeSlider.value) / 100
    const humVolume = parseInt(this.humVolumeSlider.value) / 100
    const bpm = parseInt(this.bpmSlider.value)

    // Create remix
    await this.createRemix(pitchShift, cryVolume, humVolume, bpm)

    this.remixStatus.textContent = '✓ Remix ready!'
    this.remixStatus.style.color = '#27ae60'
    this.remixControls.style.display = 'block'
    this.playbackSection.style.display = 'block'
    this.remixBtn.disabled = false

    // Update track info
    this.trackBpm.textContent = `${bpm} BPM`
    this.trackDuration.textContent = this.formatTime(this.remixBuffer.duration)

    // Draw remix waveform
    this.drawWaveform(this.remixBuffer, this.playbackCtx, this.playbackCanvas)

    // Scroll to playback
    this.playbackSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  async createRemix(pitchShift, cryVolume, humVolume, bpm) {
    const sampleRate = this.audioContext.sampleRate
    const duration = Math.max(this.humBuffer.duration, this.cryBuffer.duration)
    const numSamples = Math.ceil(duration * sampleRate)

    // Create offline context for processing
    const offlineContext = new OfflineAudioContext(2, numSamples, sampleRate)

    // Process hum track
    const humSource = offlineContext.createBufferSource()
    humSource.buffer = this.humBuffer
    const humGain = offlineContext.createGain()
    humGain.gain.value = humVolume
    humSource.connect(humGain)
    humGain.connect(offlineContext.destination)

    // Process cry track with pitch shift
    const crySource = offlineContext.createBufferSource()
    crySource.buffer = this.applyPitchShift(this.cryBuffer, pitchShift)
    const cryGain = offlineContext.createGain()
    cryGain.gain.value = cryVolume

    // Apply rhythmic chopping based on BPM
    const choppedCry = this.applyCryRhythm(crySource.buffer, bpm)
    const finalCrySource = offlineContext.createBufferSource()
    finalCrySource.buffer = choppedCry
    finalCrySource.connect(cryGain)
    cryGain.connect(offlineContext.destination)

    // Start sources
    humSource.start(0)
    finalCrySource.start(0)

    // Render
    this.remixBuffer = await offlineContext.startRendering()
  }

  applyPitchShift(buffer, semitones) {
    // Simple pitch shift using playback rate
    const rate = Math.pow(2, semitones / 12)
    const newLength = Math.floor(buffer.length / rate)
    const newBuffer = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      newLength,
      buffer.sampleRate
    )

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel)
      const outputData = newBuffer.getChannelData(channel)

      for (let i = 0; i < newLength; i++) {
        const position = i * rate
        const index = Math.floor(position)
        const fraction = position - index

        if (index + 1 < inputData.length) {
          // Linear interpolation
          outputData[i] = inputData[index] * (1 - fraction) + inputData[index + 1] * fraction
        } else {
          outputData[i] = inputData[index]
        }
      }
    }

    return newBuffer
  }

  applyCryRhythm(buffer, bpm) {
    // Chop cry into rhythmic segments
    const beatDuration = 60 / bpm // Duration of one beat in seconds
    const segmentDuration = beatDuration / 2 // Use half beats
    const segmentSamples = Math.floor(segmentDuration * buffer.sampleRate)

    const newLength = buffer.length
    const newBuffer = this.audioContext.createBuffer(
      buffer.numberOfChannels,
      newLength,
      buffer.sampleRate
    )

    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const inputData = buffer.getChannelData(channel)
      const outputData = newBuffer.getChannelData(channel)

      let writePos = 0
      let readPos = 0

      while (writePos < newLength) {
        const segmentLength = Math.min(segmentSamples, newLength - writePos)

        // Copy segment
        for (let i = 0; i < segmentLength; i++) {
          if (readPos < inputData.length) {
            outputData[writePos + i] = inputData[readPos]
            readPos++
          }
        }

        // Add fade in/out for smooth transitions
        const fadeLength = Math.min(segmentLength / 10, 100)
        for (let i = 0; i < fadeLength; i++) {
          if (writePos + i < newLength) {
            outputData[writePos + i] *= i / fadeLength // Fade in
          }
          if (writePos + segmentLength - i - 1 < newLength) {
            outputData[writePos + segmentLength - i - 1] *= i / fadeLength // Fade out
          }
        }

        writePos += segmentLength
      }
    }

    return newBuffer
  }

  playRemix() {
    if (!this.remixBuffer) return

    if (this.currentSource) {
      this.currentSource.stop()
    }

    this.currentSource = this.audioContext.createBufferSource()
    this.currentSource.buffer = this.remixBuffer
    this.currentSource.connect(this.audioContext.destination)

    const offset = this.pauseTime
    this.currentSource.start(0, offset)
    this.startTime = this.audioContext.currentTime - offset

    this.isPlaying = true
    this.playRemixBtn.style.display = 'none'
    this.pauseRemixBtn.style.display = 'flex'

    this.updateProgress()

    this.currentSource.onended = () => {
      this.isPlaying = false
      this.pauseTime = 0
      this.progressFill.style.width = '0%'
      this.playRemixBtn.style.display = 'flex'
      this.pauseRemixBtn.style.display = 'none'
    }
  }

  pauseRemix() {
    if (this.currentSource && this.isPlaying) {
      this.pauseTime = this.audioContext.currentTime - this.startTime
      this.currentSource.stop()
      this.isPlaying = false
      this.playRemixBtn.style.display = 'flex'
      this.pauseRemixBtn.style.display = 'none'
    }
  }

  updateProgress() {
    if (!this.isPlaying) return

    const elapsed = this.audioContext.currentTime - this.startTime
    const progress = (elapsed / this.remixBuffer.duration) * 100
    this.progressFill.style.width = `${Math.min(progress, 100)}%`

    if (progress < 100) {
      requestAnimationFrame(() => this.updateProgress())
    }
  }

  async downloadRemix() {
    if (!this.remixBuffer) return

    // Convert buffer to WAV
    const wav = this.audioBufferToWav(this.remixBuffer)
    const blob = new Blob([wav], { type: 'audio/wav' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `diaper-dj-remix-${Date.now()}.wav`
    a.click()

    URL.revokeObjectURL(url)
  }

  audioBufferToWav(buffer) {
    const length = buffer.length * buffer.numberOfChannels * 2
    const arrayBuffer = new ArrayBuffer(44 + length)
    const view = new DataView(arrayBuffer)
    const channels = []
    let offset = 0
    let pos = 0

    // Write WAV header
    const setUint16 = (data) => {
      view.setUint16(pos, data, true)
      pos += 2
    }
    const setUint32 = (data) => {
      view.setUint32(pos, data, true)
      pos += 4
    }

    setUint32(0x46464952) // "RIFF"
    setUint32(36 + length) // file length
    setUint32(0x45564157) // "WAVE"
    setUint32(0x20746d66) // "fmt "
    setUint32(16) // format chunk length
    setUint16(1) // PCM
    setUint16(buffer.numberOfChannels)
    setUint32(buffer.sampleRate)
    setUint32(buffer.sampleRate * buffer.numberOfChannels * 2)
    setUint16(buffer.numberOfChannels * 2)
    setUint16(16) // bits per sample
    setUint32(0x61746164) // "data"
    setUint32(length)

    // Write audio data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i))
    }

    offset = 44
    for (let i = 0; i < buffer.length; i++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        let sample = Math.max(-1, Math.min(1, channels[channel][i]))
        sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff
        view.setInt16(offset, sample, true)
        offset += 2
      }
    }

    return arrayBuffer
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
}

// Initialize the app
const diaperDJ = new DiaperDJ()
