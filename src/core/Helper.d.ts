import IVisualizerOptions from './types/IVisualizerOptions';
import IFrequenciesSpectrum from './types/IFrequenciesSpectrum';
import IStartEndPoints from './types/IStartEndPoints';
export default class Helper {
    ctx: any;
    constructor(ctx: CanvasRenderingContext2D);
    mutateData(data: Array<any> | Uint8Array, type: string, extra?: any): Array<any> | Uint8Array | IFrequenciesSpectrum;
    getPoints(shape: string, size: number, [originX, originY]: Array<number>, pointCount: number, endPoints: Array<number>, options?: IVisualizerOptions): IStartEndPoints;
    drawCircle([x, y]: Array<number>, diameter: number, options: IVisualizerOptions): void;
    drawSquare([x, y]: Array<number>, diameter: number, options: IVisualizerOptions): void;
    drawRectangle([x, y]: Array<number>, height: number, width: number, options: IVisualizerOptions): void;
    drawLine([fromX, fromY]: Array<number>, [toX, toY]: Array<number>, options?: IVisualizerOptions): void;
    drawPolygon(points: Array<Array<number>>, options: IVisualizerOptions): void;
}
