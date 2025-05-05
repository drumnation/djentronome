import youtubedl from 'youtube-dl-exec';
import { mkdirSync, existsSync } from 'fs';
import path from 'path';

const outputDir = path.resolve(__dirname, '../test-assets/sound');
if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

// Use the system-installed yt-dlp binary
const ytDlp = youtubedl.create('/opt/homebrew/bin/yt-dlp');

ytDlp('https://www.youtube.com/watch?v=AP9412LFP0o', {
  output: `${outputDir}/djent-track.%(ext)s`,
  extractAudio: true,
  audioFormat: 'mp3',
  noCheckCertificates: true,
  noWarnings: true,
  preferFreeFormats: true,
}).then(output => {
  console.log('✅ Download complete:\n', output);
}).catch(err => {
  console.error('❌ Download failed:\n', err);
}); 