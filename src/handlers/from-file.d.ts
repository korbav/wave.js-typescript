import IWaveOptions from '../core/types/IWaveOptions';
import IFromFileOptions from '../core/types/IFromFileOptions';
export default function fromFile(file: string, options?: IWaveOptions, fromFileOptions?: IFromFileOptions): {
    deactivate: () => void;
};
