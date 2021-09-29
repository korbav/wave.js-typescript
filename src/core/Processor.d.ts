import IWaveOptions from './types/IWaveOptions';
import IFromElementOptions from './types/IFromElementOptions';
import IActiveCanvas from './types/IActiveCanvas';
import IActiveElement from './types/IActiveElement';
export default class Processor {
    private element;
    private canvasId;
    private options;
    private fromElementOptions;
    activated: boolean;
    analyser: AnalyserNode;
    activeCanvas: IActiveCanvas;
    activeElements: IActiveElement;
    frameCount: number;
    currentCount: number;
    data: Uint8Array;
    bufferLength: number;
    audioCtx: AudioContext;
    constructor(element: HTMLAudioElement, canvasId: string, options: IWaveOptions, fromElementOptions: IFromElementOptions);
    bindUserInteractEventsListeners(bindPlayEvent?: boolean): void;
    unbindUserInteractEventsListeners(unbindPlayEvent?: boolean): void;
    isActivated(): boolean;
    activate(): void;
    deactivate(): void;
    initializeAfterUserGesture(): void;
    initialize(): void;
    renderFrame(): void;
    connectSource(source: MediaElementAudioSourceNode, destination: AudioNode): void;
}
