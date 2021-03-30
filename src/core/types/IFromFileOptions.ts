export default interface IFromFileOptions {
  callback(imagDataURL: string);
  width?: number,
  height?: number,
  format?: 'png'|'jpeg',
  drawRate?: number,
}
