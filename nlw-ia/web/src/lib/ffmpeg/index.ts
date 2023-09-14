import { FFmpeg } from '@ffmpeg/ffmpeg';

import coreURL from './lib/ffmpeg-core.js?url';
import wasmURL from './lib/ffmpeg-core.wasm?url';
import workerURL from './lib/ffmpeg-worker.js?url';

let ffmpeg: FFmpeg | null;

export async function loadFFmpeg() {
  if(ffmpeg) {
    return ffmpeg;
  }

  ffmpeg = new FFmpeg();

  if(!ffmpeg.loaded) {
    await ffmpeg.load({
      coreURL,
      wasmURL,
      workerURL
    });
  }

  return ffmpeg;
}
