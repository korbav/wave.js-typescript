import { AudioContext } from 'standardized-audio-context';
import IWaveOptions from './types/IWaveOptions';
import IFromElementOptions from './types/IFromElementOptions';
export default class Processor {
    private element;
    private canvasId;
    private options;
    private fromElementOptions;
    activated: boolean;
    analyser: any;
    activeCanvas: any;
    activeElements: any;
    frameCount: number;
    currentCount: number;
    data: Uint8Array;
    bufferLength: number;
    audioCtx: AudioContext;
    constructor(element: HTMLAudioElement, canvasId: string, options: IWaveOptions, fromElementOptions: IFromElementOptions);
    isActivated(): boolean;
    activate(): void;
    deactivate(): void;
    initializeAfterUserGesture(): void;
    initialize(): void;
    renderFrame(): void;
    connectSource(source: MediaElementAudioSourceNode, destination: AnalyserNode): void;
}
