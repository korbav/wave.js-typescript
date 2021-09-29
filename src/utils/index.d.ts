import IActiveElement from '../core/types/IActiveElement';
import IFrameRateMap from '../core/types/IFrameRateMap';
export declare const initGlobalObject: <T>(elementId: string, accessKey: string) => T;
export declare const setPropertyIfNotSet: <T>(object: IActiveElement | IFrameRateMap | typeof Object, property: string, value: T) => void;
export declare const checkGenerator: (generatorType: string | Array<string>) => void;
export declare const clearCanvas: (canvas: HTMLCanvasElement) => void;
