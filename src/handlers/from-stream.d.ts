import IWaveOptions from '../core/types/IWaveOptions';
import IFromStreamOptions from '../core/types/IFromStreamOptions';
export default function fromStream(stream: MediaStream, canvasId: string, options?: IWaveOptions, fromStreamOptions?: IFromStreamOptions): {
    deactivate: () => void;
};
