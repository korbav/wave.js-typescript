import { AudioContext } from 'standardized-audio-context';
import IWaveOptions from '../core/types/IWaveOptions';
import defaultOptions from '../utils/default-options';
import visualize from '../core/Visualizer';
import IFromFileOptions from '../core/types/IFromFileOptions';
import { checkGenerator, clearCanvas } from '../utils';

const createVirtualCanvas = (width, height) => {
  const canvas = document.createElement("canvas");
  canvas.height = height;
  canvas.width = width;
  return canvas;
}

export default function fromFile(file: string, options?: IWaveOptions, fromFileOptions?: IFromFileOptions): { deactivate: () => void } {
  const parsedOptions = {
    ...defaultOptions,
    ...(options || {}),
  };

  const { callback, width, height, format, drawRate } = {
    width: window.innerWidth,
    height: window.innerHeight,
    format: 'png',
    drawRate: 20, //ms
    callback: () => null,
    ...fromFileOptions,
  }

  checkGenerator(parsedOptions.type);

  const imageFormat = `image/${format}`;
  const canvas = createVirtualCanvas(width, height);
  const audio: HTMLAudioElement = new Audio(file);
  const audioCtx: AudioContext = new AudioContext();
  const analyser = audioCtx.createAnalyser();
  const source = audioCtx.createMediaElementSource(audio);
  analyser.fftSize = 2 ** 10;
  const bufferLength = analyser.frequencyBinCount;
  const tempData: Uint8Array = new Uint8Array(bufferLength);
  let getWave: ReturnType<typeof setTimeout> = null;

  source.connect(analyser);
  audio.addEventListener('loadedmetadata', () => audio.play().then());

  const playListener = () => {
    let frameCount = 1;
    getWave = setInterval(() => {
      analyser.getByteFrequencyData(tempData);
      visualize(tempData, canvas, parsedOptions, frameCount++);
      callback(canvas.toDataURL(imageFormat));
    }, drawRate);
  };

  const endedListener = () => {
    if (audio.currentTime === audio.duration && tempData !== undefined) {
      clearInterval(getWave);
    }
  };

  audio.addEventListener('play', playListener);
  audio.addEventListener('ended', endedListener);

  return {
    deactivate: () => {
      audio.removeEventListener('play', playListener);
      audio.removeEventListener('ended', endedListener);
      clearInterval(getWave);
      audioCtx.close().then();
      clearCanvas(canvas)
      callback(canvas.toDataURL(imageFormat));
    }
  };
}
