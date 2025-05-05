/**
 * Skill-Jack: Audio Transcription Strategies (Kick/Snare)
 * 
 * Provides guidance on different approaches and tools for transcribing kick and snare drum patterns from audio files.
 * 
 * @module brain-garden/skill-jack
 * @category concepts
 */

/**
 * Skill-Jack on Audio Transcription Strategies
 * 
 * This constant provides comprehensive guidance on understanding and applying
 * various techniques for automated kick and snare transcription in the context of the Djentronome project.
 */
export const audioTranscriptionStrategiesGuide = {
  topic: "Audio Transcription Strategies (Kick/Snare)",
  description: "Compares methods for detecting kick and snare hits in audio, including onset detection and more advanced source separation + transcription models, considering accuracy, complexity, and performance trade-offs.",
  corePrinciples: [
    {
      name: "Problem Domain: Kick/Snare Transcription",
      description: "The goal is to identify the precise timestamps of kick drum and snare drum hits within a given audio track (typically a music file) to generate rhythmic patterns for the game.",
    },
    {
      name: "Input Data: Audio Files",
      description: "Input is typically a standard audio file (e.g., .wav, .mp3, .ogg). Preprocessing like converting to a consistent format (e.g., WAV, 16-bit, specific sample rate) might be necessary for some tools.",
      examples: ["Using ffmpeg to convert input audio."],
    },
    {
      name: "Output Data: Timestamps or Note Sequences",
      description: "The desired output is a list of timestamps for each detected kick and snare event, or a structured sequence format (like MIDI or custom JSON) representing the rhythm.",
      examples: ["`[{ type: 'kick', time: 1.234 }, { type: 'snare', time: 1.734 }, ...]`"],
    },
    {
      name: "Trade-offs: Accuracy vs. Complexity vs. Speed",
      description: "Simpler methods (like basic onset detection) are faster but less accurate, especially in dense mixes. Advanced ML models offer higher accuracy but require more setup, computational resources, and potentially training data.",
    },
    {
      name: "Offline vs. Real-time",
      description: "For Djentronome's initial scope, transcription is assumed to be an offline process (analyzing the whole track beforehand). Real-time transcription is significantly more complex.",
    },
  ],
  applicationProcess: {
    description: "Steps for an agent to select and potentially implement an audio transcription method.",
    steps: [
      {
        name: "Analyze Requirements & Constraints",
        description: "Determine the required accuracy level, acceptable processing time, available compute resources, and development complexity tolerance.",
        agentActions: [
          {
            action: "Review project scope (initial focus on offline, kick/snare only).",
            explanation: "Understand the immediate needs vs. future goals.",
          },
          {
            action: "Assess development environment (available libraries, Python setup if needed).",
            explanation: "Determine feasibility of using external tools or Python-based libraries.",
          },
        ],
      },
      {
        name: "Option 1: Basic Onset Detection (Lower Accuracy/Complexity)",
        description: "Implement or use libraries for detecting sharp energy increases (onsets) and potentially filtering by frequency range to approximate kick/snare hits.",
        agentActions: [
          {
            action: "Research JavaScript audio analysis libraries with onset detection features.",
            explanation: "Look for libraries like `meyda`, `essentia.js` (WASM), or potentially simpler implementations.",
          },
          {
            action: "Implement onset detection on the audio data.",
            explanation: "Apply the chosen algorithm.",
          },
          {
            action: "Attempt frequency-based filtering (optional).",
            explanation: "Try to differentiate kick (low freq) vs. snare (mid/high freq) based on spectral characteristics around the onset time. This is often unreliable in mixed music.",
          },
          {
            action: "Evaluate accuracy on test tracks.",
            explanation: "Compare output timestamps against known ground truth patterns.",
          },
        ],
      },
      {
        name: "Option 2: Source Separation + Transcription (Higher Accuracy/Complexity)",
        description: "Use ML models to first separate the drum track from the mix, then apply a specialized drum transcription model to the isolated track.",
        agentActions: [
          {
            action: "Set up environment for ML models (likely Python).",
            explanation: "Requires Python installation, package management (pip/conda), and potentially GPU support (CUDA) for faster processing.",
          },
          {
            action: "Select and install a source separation tool (e.g., Demucs).",
            explanation: "Follow Demucs installation instructions. Requires PyTorch.",
          },
          {
            action: "Run source separation on the audio file.",
            explanation: "Use the Demucs CLI or library interface to extract the 'drums' stem (e.g., `demucs --two-stems=drums audio.mp3`).",
          },
          {
            action: "Select and install a drum transcription tool (e.g., madmom, onsets-and-frames).",
            explanation: "Follow installation instructions for the chosen library.",
          },
          {
            action: "Run transcription on the isolated drum stem.",
            explanation: "Use the library's API or CLI to process the drum stem and obtain kick/snare event timestamps.",
          },
          {
            action: "Parse the output into the desired game format (e.g., JSON).",
            explanation: "Convert the library's output format into the list of timestamped events needed by the game engine.",
          },
          {
            action: "Integrate the Python script execution into the workflow.",
            explanation: "Develop a way to call the Python script (e.g., via Node.js `child_process`) or pre-process tracks and store results.",
          },
        ],
      },
      {
        name: "Evaluation and Selection",
        description: "Compare the results, performance, and implementation effort of the chosen method(s).",
        agentActions: [
          {
            action: "Measure processing time for each method on sample tracks.",
            explanation: "Determine if the performance is acceptable for an offline process.",
          },
          {
            action: "Quantify accuracy (e.g., F1-score) against ground truth data.",
            explanation: "Requires manually annotated test tracks for reliable comparison.",
          },
          {
            action: "Assess implementation complexity and maintainability.",
            explanation: "Consider dependencies, setup effort, and required expertise.",
          },
          {
            action: "Make a recommendation based on project priorities.",
            explanation: "Prioritize accuracy (ML route) or simplicity/speed (onset detection) based on Phase 2/3 goals.",
          },
        ],
      },
    ],
  },
  examples: {
    description: "Scenarios related to audio transcription challenges.",
    useCases: [
      {
        scenario: "Transcribing a simple rock beat with clear kick and snare.",
        implementation: "Basic onset detection might suffice, potentially with simple frequency filtering, yielding reasonable accuracy.",
        outcome: "Acceptable transcription for gameplay with minimal setup.",
      },
      {
        scenario: "Transcribing a dense Djent track with complex polyrhythms and blast beats.",
        implementation: "Basic onset detection will likely perform poorly. Source separation (Demucs) followed by a dedicated transcription model (madmom) is needed for acceptable accuracy.",
        outcome: "Higher accuracy transcription suitable for complex rhythms, but requires Python setup and longer processing time.",
      },
      {
        scenario: "Handling audio files with varying quality or mastering.",
        implementation: "ML-based models are generally more robust to variations in audio quality than simpler onset detectors. Preprocessing (normalization) might still be beneficial.",
        outcome: "ML models provide more consistent results across different input audio characteristics.",
      },
    ],
  },
  codeExamples: [
    {
      language: "shell",
      description: "Example: Using Demucs CLI for drum separation",
      code: "# Ensure demucs is installed (pip install -U demucs)\npython -m demucs --two-stems=drums path/to/your/audio.mp3 -o output/dir/",
      explanation: "Runs the Demucs model to separate the input audio into a 'drums' stem and an 'other' stem, saving them in the specified output directory.",
    },
    {
      language: "python",
      description: "Example: Using madmom library (conceptual)",
      code: `# Ensure madmom is installed (pip install madmom)\nimport madmom\n\n# Load the isolated drum audio stem (e.g., using librosa or soundfile)\ndrum_audio_path = 'output/dir/htdemucs/audio/drums.wav'\n\n# Example using a processor (specific processor might vary)\n# Note: This is simplified; actual kick/snare transcription often requires specific models/processors\nproc = madmom.features.beats.DBNBeatTrackingProcessor(fps=100)\nact = madmom.features.beats.RNNBeatProcessor()(drum_audio_path)\n\nbeat_times = proc(act)\n\nprint(f"Detected beat times: {beat_times}")\n\n# Placeholder for more specific drum transcription:
# try:\n#   kick_proc = madmom.features.drums.KickDetectionProcessor()\n#   kick_times = kick_proc(drum_audio_path)\n#   snare_proc = madmom.features.drums.SnareDetectionProcessor()\n#   snare_times = snare_proc(drum_audio_path)\n#   print(f"Kick Times: {kick_times}")\n#   print(f"Snare Times: {snare_times}")\n# except Exception as e:\n#   print(f"Specific drum processors might not be available or configured: {e}")\n`,
      explanation: "Conceptual Python code showing loading audio and using a madmom beat processor. Includes commented-out placeholders for potential drum-specific processors, highlighting that kick/snare differentiation often needs dedicated models or further processing.",
    },
  ],
  commonPitfalls: [
    {
      name: "Overestimating Basic Onset Detection",
      description: "Assuming simple onset detection will accurately transcribe complex drum patterns in mixed music. It often struggles with distinguishing instruments and handling dense rhythms.",
      solution: "Use basic onset detection primarily for simple patterns or as a baseline. Set realistic accuracy expectations. Prefer ML models for complex music.",
      preventativeMeasures: ["Test onset detection thoroughly on target music genres early.", "Be prepared to switch to more advanced methods."],
    },
    {
      name: "Underestimating ML Model Setup Complexity",
      description: "Assuming ML models like Demucs or madmom can be easily integrated into a JS/TS project without significant Python environment setup, dependency management, and potential performance tuning.",
      solution: "Allocate sufficient time for setting up the Python environment, installing dependencies (PyTorch, etc.), and potentially building an interface (like a simple API or CLI wrapper) to call the Python scripts from Node.js.",
      preventativeMeasures: ["Prototype the Python script execution and integration early.", "Document the setup process clearly."],
    },
    {
      name: "Lack of Ground Truth Data",
      description: "Trying to evaluate transcription accuracy without reliable ground truth (manually verified timestamps of kick/snare hits) makes it difficult to compare methods objectively.",
      solution: "Manually annotate a small set of diverse test tracks with accurate kick/snare timestamps to serve as a benchmark for evaluation.",
      preventativeMeasures: ["Incorporate ground truth creation into the development process for the transcription feature."],
    },
    {
      name: "Ignoring Processing Time",
      description: "Choosing a highly accurate but extremely slow transcription method that makes the offline processing workflow impractically long for users.",
      solution: "Benchmark processing times during evaluation. Consider trade-offs between accuracy and speed. Explore possibilities like cloud processing or optimizing model parameters if needed.",
      preventativeMeasures: ["Define acceptable processing time limits early.", "Benchmark performance on representative hardware."],
    },
  ],
  resources: [
    {
      type: "tool",
      name: "Demucs (Source Separation)",
      description: "State-of-the-art music source separation model from Meta AI, effective at isolating drums.",
      link: "https://github.com/facebookresearch/demucs",
    },
    {
      type: "tool",
      name: "madmom (Audio Signal Processing)",
      description: "Python library for music information retrieval (MIR), including onset detection, beat tracking, and some transcription features.",
      link: "https://github.com/madmom-team/madmom",
    },
    {
      type: "tool",
      name: "onsets-and-frames (Drum Transcription)",
      description: "TensorFlow implementation of a high-resolution piano transcription model, often adapted or referenced for drum transcription techniques.",
      link: "https://github.com/magenta/magenta/tree/main/magenta/models/onsets_frames_transcription",
    },
    {
      type: "documentation",
      name: "Librosa (Python Audio Analysis)",
      description: "Popular Python library for general audio analysis and feature extraction, often used alongside transcription models.",
      link: "https://librosa.org/doc/latest/index.html",
    },
    {
      type: "reference",
      name: "Music Information Retrieval (MIR) Resources",
      description: "General resources and communities related to MIR tasks like transcription.",
      link: "https://ismir.net/",
    },
  ],
  conclusion: "Automated kick/snare transcription involves trade-offs. Basic onset detection is simpler but less accurate for complex music like Djent. ML-based source separation (Demucs) followed by dedicated transcription (madmom, etc.) offers higher accuracy but requires significant setup (Python environment) and computational resources. Choose the strategy based on accuracy needs, complexity tolerance, and performance constraints for the offline processing workflow.",
}; 