import { AudioContext } from 'standardized-audio-context';
import IWaveOptions from '../core/types/IWaveOptions';
import IFromStreamOptions from '../core/types/IFromStreamOptions';
import defaultOptions from '../utils/default-options';
import visualize from '../core/Visualizer';
import { checkGenerator, clearCanvas, initGlobalObject } from '../utils';

const renderFrame = (currentStream, analyser, sources, stream, frameCount) => {
  if (currentStream.activated) {
    analyser.getByteFrequencyData(currentStream.data);
    visualize(currentStream.data, currentStream.canvasId, currentStream.options, frameCount);
    sources[stream.toString()].animation = requestAnimationFrame(currentStream.loop);
  }
}

const events = ['touchstart', 'touchmove', 'touchend', 'mouseup', 'click'];

let interacted = false;
const registerProcessAfterUserEvent = (process) => {
  events.forEach((event) => {
    document.body.addEventListener(event, () => { interacted = true; process(); }, {once: true})
  });
}

export default function fromStream(
  stream: MediaStream,
  canvasId: string,
  options?: IWaveOptions,
  fromStreamOptions?: IFromStreamOptions
): { deactivate: () => void }  {
  const parsedOptions = {
    ...defaultOptions,
    ...(options || {}),
  };

  const parsedFromStreamOptions = {
    connectDestination: true,
    skipUserEventsWatcher: false,
    ...(fromStreamOptions || {}),
  };

  checkGenerator(parsedOptions.type);

  const {connectDestination, skipUserEventsWatcher} = parsedFromStreamOptions;
  const currentStream = {canvasId, options: parsedOptions, data: null, loop: null, animation: null, activated: true};
  const sources = initGlobalObject('stream-sources', parsedOptions.globalAccessKey);

  let audioCtx;

  const process = () => {
    let analyser, source;
    if (!sources[stream.toString()]) {
      audioCtx = new AudioContext();
      analyser = audioCtx.createAnalyser();

      // Test Safari
      analyser.minDecibels = -90;
      analyser.maxDecibels = -10;
      analyser.smoothingTimeConstant = 0.85;
      // End test safari


      source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      if (connectDestination) {
        analyser.connect(source.destination);
      }
      sources[stream.toString()] = {
        audioCtx,
        analyser,
        source
      }
    } else {
      cancelAnimationFrame(sources[stream.toString()].animation);
      analyser = sources[stream.toString()].analyser;
    }

    analyser.fftsize = 32768;
    const bufferLength = analyser.frequencyBinCount;
    currentStream.data = new Uint8Array(bufferLength);
    this.frameCount = 1;
    currentStream.loop = () => renderFrame(currentStream, analyser, sources, stream, ++this.frameCount);
    renderFrame(currentStream, analyser, sources, stream, 1);
  };

  if (interacted || !skipUserEventsWatcher) {
    registerProcessAfterUserEvent(() => process());
  } else {
    process();
  }

  return {
    deactivate: () => {
      clearCanvas(document.getElementById(currentStream.canvasId) as HTMLCanvasElement);
      audioCtx && audioCtx.close().then();
      currentStream.activated = false;
    }
  };
}
