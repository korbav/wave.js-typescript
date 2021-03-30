import IWaveOptions from './IWaveOptions';
export default interface IFunctionContext {
    data: any;
    options: IWaveOptions;
    ctx: CanvasRenderingContext2D;
    h: number;
    w: number;
    canvasId: string;
}
