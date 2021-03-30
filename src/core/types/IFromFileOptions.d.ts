export default interface IFromFileOptions {
    callback(imagDataURL: string): any;
    width?: number;
    height?: number;
    format?: 'png' | 'jpeg';
    drawRate?: number;
}
