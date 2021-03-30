import IVisualizerOptions from './types/IVisualizerOptions';
export default class Helper {
    ctx: any;
    constructor(ctx: CanvasRenderingContext2D);
    mutateData(data: Array<number>, type: string, extra?: any): any;
    getPoints(shape: string, size: number, [originX, originY]: Array<number>, pointCount: number, endPoints: Array<number>, options?: IVisualizerOptions): {
        start: Array<Array<number>>;
        end: Array<Array<number>>;
    };
    drawCircle([x, y]: Array<number>, diameter: number, options: IVisualizerOptions): void;
    drawSquare([x, y]: Array<number>, diameter: number, options: IVisualizerOptions): void;
    drawRectangle([x, y]: Array<number>, height: number, width: number, options: IVisualizerOptions): void;
    drawLine([fromX, fromY]: Array<number>, [toX, toY]: Array<number>, options?: IVisualizerOptions): void;
    drawPolygon(points: Array<Array<number>>, options: IVisualizerOptions): void;
}
