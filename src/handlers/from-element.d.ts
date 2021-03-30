import IWaveOptions from '../core/types/IWaveOptions';
import IFromElementOptions from '../core/types/IFromElementOptions';
export default function fromElement(elementOrElementId: HTMLAudioElement | string, canvasOrCanvasId: HTMLCanvasElement | string, options?: IWaveOptions, fromElementOptions?: IFromElementOptions): {
    deactivate: () => void;
};
