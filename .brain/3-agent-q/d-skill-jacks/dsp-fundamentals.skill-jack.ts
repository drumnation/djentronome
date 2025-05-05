/**
 * Skill-Jack: Digital Signal Processing (DSP) Fundamentals
 * 
 * Provides foundational knowledge of key DSP concepts relevant to audio processing for transcription.
 * 
 * @module brain-garden/skill-jack
 * @category concepts
 */

/**
 * Skill-Jack on DSP Fundamentals
 * 
 * This constant provides comprehensive guidance on understanding core Digital Signal Processing (DSP)
 * concepts applicable to audio analysis tasks like onset detection and feature extraction in Djentronome.
 */
export const dspFundamentalsGuide = {
  topic: "Digital Signal Processing (DSP) Fundamentals",
  description: "Covers essential DSP concepts including Sampling Rate, Bit Depth, Amplitude, Frequency, FFT, Spectrograms, and basic Filtering, necessary for understanding audio data and transcription algorithms.",
  corePrinciples: [
    {
      name: "Digital Representation of Sound",
      description: "Sound is digitized by sampling its amplitude at regular intervals (Sampling Rate) and representing each sample with a certain number of bits (Bit Depth).",
      examples: ["CD Quality: 44100 Hz Sampling Rate, 16-bit Depth.", "Higher sampling rate captures higher frequencies.", "Higher bit depth provides greater dynamic range."],
    },
    {
      name: "Amplitude",
      description: "Represents the intensity or loudness of the sound wave at a given point in time. In digital audio, samples typically range from -1.0 to +1.0.",
    },
    {
      name: "Frequency and Pitch",
      description: "Frequency (measured in Hertz, Hz) represents the rate of vibration of the sound wave, perceived as pitch. Higher frequency means higher pitch.",
      examples: ["Kick drums have energy concentrated in low frequencies.", "Snares and cymbals have significant energy in mid and high frequencies."],
    },
    {
      name: "Time Domain vs. Frequency Domain",
      description: "Audio can be analyzed in the Time Domain (amplitude over time, like a waveform display) or the Frequency Domain (amplitude of different frequencies present at a point in time).",
    },
    {
      name: "Fast Fourier Transform (FFT)",
      description: "The FFT is an efficient algorithm to compute the Discrete Fourier Transform (DFT), converting a segment of time-domain audio data (a frame or window) into its frequency domain representation (spectrum). It shows which frequencies are present in that segment.",
      examples: ["Applying FFT to a short window of audio around a potential drum hit.", "Analyzing the resulting frequency bins to identify instrument characteristics."],
    },
    {
      name: "Spectrograms",
      description: "A visual representation of the spectrum of frequencies of a signal as they vary with time. Calculated by applying FFT to overlapping windows of the audio. Often used in audio analysis and transcription tasks.",
      examples: ["Visualizing a spectrogram to see energy bursts corresponding to drum hits across different frequency bands."],
    },
    {
      name: "Filtering",
      description: "Filters modify the frequency content of a signal. Common types include Low-pass (allows low frequencies, blocks high), High-pass (allows high, blocks low), and Band-pass (allows a specific range).",
      examples: ["Applying a low-pass filter to isolate bass frequencies (kick drum).", "Applying a high-pass filter to focus on snare/cymbal frequencies."],
    },
    {
      name: "Windowing",
      description: "When applying FFT to segments of audio, windowing functions (e.g., Hann, Hamming) are used to taper the edges of the segment, reducing spectral leakage artifacts.",
    },
  ],
  applicationProcess: {
    description: "How an agent might apply DSP concepts during transcription tasks.",
    steps: [
      {
        name: "Load and Preprocess Audio",
        description: "Load audio into a usable format (e.g., Float32Array) and potentially preprocess.",
        agentActions: [
          {
            action: "Decode audio data using Web Audio API (`decodeAudioData`) or a library.",
            explanation: "Obtain raw sample data.",
          },
          {
            action: "Convert to mono (if necessary).",
            explanation: "Simplifies analysis for many algorithms.",
          },
          {
            action: "Resample to a consistent sampling rate (if necessary).",
            explanation: "Ensure input matches expectations of analysis libraries/algorithms.",
          },
        ],
      },
      {
        name: "Frame Audio Data",
        description: "Divide the audio samples into short, often overlapping frames (windows).",
        agentActions: [
          {
            action: "Choose frame size (e.g., 1024, 2048, 4096 samples).",
            explanation: "Determines frequency resolution of FFT. Power of 2 is common for FFT efficiency.",
          },
          {
            action: "Choose hop size (amount samples overlap between frames).",
            explanation: "E.g., 50% overlap (hop size = frame size / 2). Determines time resolution.",
          },
          {
            action: "Apply a window function (e.g., Hann window) to each frame.",
            explanation: "Reduces spectral leakage before FFT.",
          },
        ],
      },
      {
        name: "Analyze Frames (Frequency Domain)",
        description: "Transform frames into the frequency domain using FFT.",
        agentActions: [
          {
            action: "Compute the FFT for each windowed frame.",
            explanation: "Use a library function (e.g., from `fft.js`, `ndarray-fft`, or potentially Web Audio `AnalyserNode`).",
          },
          {
            action: "Calculate magnitude spectrum from FFT result.",
            explanation: "Typically interested in the amplitude of each frequency bin, not the phase.",
          },
        ],
      },
      {
        name: "Feature Extraction",
        description: "Calculate relevant features from the time or frequency domain representation.",
        agentActions: [
          {
            action: "Calculate Spectral Flux or other onset detection functions.",
            explanation: "Measure changes in spectral energy between frames to detect onsets.",
          },
          {
            action: "Calculate Spectral Centroid, Kurtosis, Flatness etc. (if needed for classification).",
            explanation: "Features that might help distinguish kick vs. snare based on frequency distribution.",
          },
          {
            action: "Apply filtering (e.g., band-pass) before feature extraction to focus on relevant frequency ranges.",
            explanation: "Isolate kick or snare frequency bands.",
          },
        ],
      },
      {
        name: "Peak Picking / Event Detection",
        description: "Identify significant peaks in the calculated features (e.g., onset detection function) that correspond to drum hits.",
        agentActions: [
          {
            action: "Apply a peak-picking algorithm to the feature curve.",
            explanation: "Find local maxima that exceed a certain threshold (often adaptive).",
          },
          {
            action: "Convert peak indices back to timestamps.",
            explanation: "Map frame index back to seconds using frame size, hop size, and sample rate.",
          },
        ],
      },
      {
        name: "Classification (Optional)",
        description: "If detection method doesn't distinguish type, classify detected events as kick or snare.",
        agentActions: [
          {
            action: "Analyze spectral features (e.g., centroid) of the audio frame around the detected peak time.",
            explanation: "Compare features against expected characteristics of kick vs. snare.",
          },
          {
            action: "Use a simple classifier or rule-based system.",
            explanation: "E.g., 'If spectral centroid < threshold, classify as kick, else snare'. This is often inaccurate in mixes.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios applying DSP concepts.",
    useCases: [
      {
        scenario: "Implementing basic onset detection.",
        implementation: "Load audio, frame it, apply FFT to each frame. Calculate spectral flux (sum of positive changes in magnitude spectrum between frames). Find peaks in the spectral flux curve.",
        outcome: "A list of timestamps corresponding to potential note onsets (not necessarily kick/snare specific).",
      },
      {
        scenario: "Attempting to differentiate kick/snare using filtering.",
        implementation: "Apply a low-pass filter (< 150Hz) to the audio. Run onset detection on the filtered signal to find kick candidates. Apply a band-pass filter (e.g., 150Hz - 5kHz) and run onset detection for snare candidates.",
        outcome: "Two separate lists of timestamps, potentially enriched for kick and snare, but likely containing errors/bleed from other instruments.",
      },
      {
        scenario: "Visualizing audio for analysis using a spectrogram.",
        implementation: "Load audio, frame it with overlap, apply window function, compute FFT for each frame, calculate magnitude spectrum. Plot the magnitude spectra over time (time on x-axis, frequency on y-axis, magnitude as color/intensity).",
        outcome: "A visual representation showing energy distribution across frequency and time, useful for identifying patterns and verifying transcription algorithms.",
      },
    ],
  },
  codeExamples: [
    {
      language: "javascript", // Conceptual, might use libraries
      description: "Conceptual Onset Detection using Spectral Flux",
      code: `// Assume: audioSamples (Float32Array), FRAME_SIZE, HOP_SIZE, sampleRate
// Assume: applyWindow(frame), computeFFT(windowedFrame), computeMagnitudeSpectrum(fftResult)

let previousSpectrum: number[] | null = null;
const onsetDetectionFunction: number[] = [];

for (let i = 0; i < audioSamples.length - FRAME_SIZE; i += HOP_SIZE) {\n  const frame = audioSamples.slice(i, i + FRAME_SIZE);\n  const windowedFrame = applyWindow(frame);\n  const fftResult = computeFFT(windowedFrame);\n  const currentSpectrum = computeMagnitudeSpectrum(fftResult);\n\n  if (previousSpectrum) {\n    let spectralFlux = 0;\n    for (let j = 0; j < currentSpectrum.length; j++) {\n      const diff = currentSpectrum[j] - previousSpectrum[j];\n      if (diff > 0) { // Sum only positive changes\n        spectralFlux += diff;\n      }\n    }\n    onsetDetectionFunction.push(spectralFlux);\n  } else {\n    onsetDetectionFunction.push(0); // No flux for the first frame\n  }\n  previousSpectrum = currentSpectrum;\n}\n
// Next step: Find peaks in onsetDetectionFunction\n// const peakTimes = findPeaks(onsetDetectionFunction, HOP_SIZE, sampleRate);`, 
      explanation: "Conceptual code illustrating the calculation of spectral flux, a common technique for onset detection. It iterates through audio frames, calculates FFT/magnitude, and sums positive spectral differences between consecutive frames.",
    },
  ],
  commonPitfalls: [
    {
      name: "Choosing Incorrect Frame/Hop Size",
      description: "Frame size affects frequency resolution (larger frame = better freq res, worse time res). Hop size affects time resolution. Incorrect choices can make feature extraction less effective.",
      solution: "Start with common values (e.g., frame=2048, hop=1024 for 44.1kHz). Experiment and tune based on results and the specific algorithm's requirements.",
      preventativeMeasures: ["Understand the trade-offs between time and frequency resolution.", "Consult documentation of analysis libraries used."],
    },
    {
      name: "Ignoring Windowing Functions",
      description: "Applying FFT directly to rectangular frames causes spectral leakage, potentially smearing frequency information and degrading feature quality.",
      solution: "Apply a standard window function (e.g., Hann, Hamming) to each frame before computing the FFT.",
      preventativeMeasures: ["Always include a windowing step in FFT-based analysis pipelines."],
    },
    {
      name: "Naive Peak Picking",
      description: "Using simple thresholding for peak picking in feature curves (like onset detection) can lead to many false positives (detecting noise) or false negatives (missing quiet hits).",
      solution: "Use more robust peak picking algorithms that consider local maxima and adaptive thresholding based on the signal's characteristics.",
      preventativeMeasures: ["Research standard peak picking algorithms.", "Tune parameters carefully based on test data."],
    },
    {
      name: "Misinterpreting FFT Output",
      description: "Incorrectly calculating magnitude/phase, misunderstanding frequency bin resolution, or only using part of the FFT result.",
      solution: "Understand the output format of the specific FFT implementation used. Typically, calculate magnitude as `sqrt(real^2 + imag^2)`. Know the frequency corresponding to each bin: `freq = binIndex * sampleRate / fftSize`.",
      preventativeMeasures: ["Consult FFT library documentation.", "Validate calculations with known signals."],
    },
  ],
  resources: [
    {
      type: "documentation",
      name: "MDN: Web Audio API",
      description: "Includes AnalyserNode which can provide frequency/time-domain data.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API",
    },
     {
      type: "documentation",
      name: "MDN: AnalyserNode",
      description: "Provides methods like `getFloatFrequencyData` and `getByteTimeDomainData`.",
      link: "https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode",
    },
    {
      type: "tutorial",
      name: "The Scientist and Engineer's Guide to DSP",
      description: "A highly regarded free online book covering DSP fundamentals in depth.",
      link: "https://www.dspguide.com/",
    },
    {
      type: "reference",
      name: "Music Information Retrieval (MIR) Textbooks/Courses",
      description: "Academic resources often cover DSP techniques applied to music analysis.",
    },
     {
      type: "tool",
      name: "Librosa (Python)",
      description: "Popular library for audio analysis, includes functions for FFT, feature extraction, onset detection etc.",
      link: "https://librosa.org/",
    },
  ],
  conclusion: "A foundational understanding of DSP concepts like sampling, FFT, frequency analysis, and filtering is essential for developing or utilizing audio transcription algorithms. These concepts allow agents to process raw audio data into meaningful features for detecting rhythmic events like kick and snare hits.",
}; 