import IWaveOptions from './IWaveOptions';
export default interface IFunctionContext {
    data: Uint8Array;
    options: IWaveOptions;
    ctx: CanvasRenderingContext2D;
    h: number;
    w: number;
    canvasId: string;
}
