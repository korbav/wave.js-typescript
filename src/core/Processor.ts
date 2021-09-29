import { clearCanvas, setPropertyIfNotSet } from '../utils';
import visualize from './Visualizer';
import IWaveOptions from './types/IWaveOptions';
import IFromElementOptions from './types/IFromElementOptions';
import ElementNotFoundError from './errors/ElementNotFoundError';
import CanvasNotFoundError from './errors/CanvasNotFoundError';
import IActiveCanvas from './types/IActiveCanvas';
import IActiveElement from './types/IActiveElement';
import IActiveElementObject from './types/IActiveElementObject';
import WaveJSStorage from '../utils/WaveJSStorage';


export default class Processor {
  activated = false;
  analyser: AnalyserNode = null;
  activeCanvas: IActiveCanvas = {};
  activeElements: IActiveElement = {};
  frameCount = 1;
  currentCount = 0;
  data: Uint8Array = null;
  bufferLength: number = null;
  audioCtx: AudioContext = null;

  constructor(
    private element: HTMLAudioElement,
    private canvasId: string,
    private options: IWaveOptions,
    private fromElementOptions: IFromElementOptions,
  ) {
    this.unbindUserInteractEventsListeners(true);
  }

  bindUserInteractEventsListeners(bindPlayEvent = false): void {
    ['touchend', 'mouseup', 'click'].forEach((event) => {
      document.body.addEventListener(event, this.initialize.bind(this), {once: true})
    });
    if (bindPlayEvent) {
      this.element.addEventListener('play', this.initialize.bind(this), {once: true});
    }
  }

  unbindUserInteractEventsListeners(unbindPlayEvent = false): void {
    ['touchend', 'mouseup', 'click'].forEach((event: string) => {
      document.body.removeEventListener(event, this.initialize);
    });
    if (unbindPlayEvent) {
      this.element.removeEventListener('play', this.initialize);
    }
  }

  isActivated(): boolean {
    return this.activated;
  }

  activate(): void {
    this.activated = true;
  }

  deactivate(): void {
    this.activated = false;
    clearCanvas(document.getElementById(this.canvasId) as HTMLCanvasElement);
    // Test
    this.unbindUserInteractEventsListeners();
    const elementId = this.element.id;
    const source: MediaElementAudioSourceNode = WaveJSStorage.get(`${elementId}-source`);
    const {connectDestination} = this.fromElementOptions;
    if (source && connectDestination) {
      source.disconnect(); // Prevents  "Connecting nodes after the context has been closed" in standardized-audio-context
    }
    if (!this.fromElementOptions.existingMediaStreamSource && this.audioCtx) {
      this.audioCtx.close().then();
    }
  }

  initializeAfterUserGesture(): void {
    this.bindUserInteractEventsListeners(true);
  }

  initialize(): void {
    if (this.activated) {
      return; // Ignore if already activated
    }
    this.activate();
    this.activeCanvas[this.canvasId] = JSON.stringify(this.options);

    //track elements used so multiple elements use the same data
    const elementId = this.element.id;
    setPropertyIfNotSet<IActiveElementObject>(this.activeElements, elementId, {});
    this.activeElements[elementId] = this.activeElements[elementId] || {}
    if (this.activeElements[elementId].count) {
      this.activeElements[elementId].count += 1
    } else {
      this.activeElements[elementId].count = 1;
    }

    const {setAudioContext, getAudioContext} = this.options;
    this.currentCount = this.activeElements[elementId].count;
    let source: MediaElementAudioSourceNode = WaveJSStorage.get(`${elementId}-source`);

    if (!source || source.mediaElement !== this.element || this.audioCtx?.state === "closed") {
      const existingContext = getAudioContext(elementId);
      if (existingContext) {
        this.audioCtx = existingContext;
      } else {
        const audioContext = new AudioContext();
        setAudioContext(elementId, audioContext);
        this.audioCtx = audioContext;
      }
      source = this.fromElementOptions.existingMediaStreamSource || this.audioCtx.createMediaElementSource(this.element);
    }

    this.analyser = WaveJSStorage.put<AnalyserNode>(`${elementId}-analyser`, source.context.createAnalyser());
    WaveJSStorage.put<MediaElementAudioSourceNode>(`${elementId}-source`, source);

    //beep test for ios
    const oscillator = source.context.createOscillator();
    oscillator.frequency.value = 1;
    oscillator.connect(source.context.destination);
    oscillator.start(0);
    oscillator.stop(0);

    if (this.fromElementOptions.connectDestination) {
      this.connectSource(source, source.context.destination);
    }
    this.connectSource(source, this.analyser);

    this.analyser.fftSize = 32768;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.data = new Uint8Array(this.bufferLength);

    this.renderFrame();
  }

  renderFrame(): void {
    if (!this.isActivated()) {
      return;
    }

    const elementId = this.element.id;

    //only run one wave visual per canvas
    if (JSON.stringify(this.options) !== this.activeCanvas[this.canvasId]) {
      return;
    }

    //if the element or canvas go out of scope, stop animation
    if (!document.getElementById(elementId)) {
      throw new ElementNotFoundError(elementId);
    }

    if (!document.getElementById(this.canvasId)) {
      throw new CanvasNotFoundError(this.canvasId);
    }

    requestAnimationFrame(this.renderFrame.bind(this));
    this.frameCount++;

    //check if this element is the last to be called
    if (!(this.currentCount < this.activeElements[elementId].count)) {
      this.analyser.getByteFrequencyData(this.data);
      this.activeElements[elementId].data = this.data
    }

    visualize(this.activeElements[elementId].data, this.canvasId, this.options, this.frameCount);
  }

  connectSource(source: MediaElementAudioSourceNode, destination: AudioNode): void {
    source.connect(destination);
  }
}
