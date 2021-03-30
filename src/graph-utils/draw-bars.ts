import IFunctionContext from '../core/types/IFunctionContext';

export default (functionContext: IFunctionContext): void => {
  const { data, options, ctx, h, w } = functionContext;

  const pointCount = 64;
  const percent: number = h / 255;
  const increase: number = w / 64;
  const breakpoint: number = Math.floor(pointCount / options.colors.length);

  for (let point = 1; point <= pointCount; point++) {
    const p = data[point] * percent;
    const x = increase * point;

    ctx.moveTo(x, h);
    ctx.lineTo(x, h - p);

    if (point % breakpoint === 0) {
      ctx.strokeStyle = options.colors[(point / breakpoint) - 1];
      ctx.stroke();
      ctx.beginPath();
    }
  }
}
