import IFunctionContext from '../core/types/IFunctionContext';

export default (functionContext: IFunctionContext): void => {
  const { data, options, ctx, h, w } = functionContext;
  const percent = h / 255;
  const increase = w / 128;
  const point_count = 128;
  const min = 5;
  const breakpoint = Math.floor(point_count / options.colors.length);

  for (let point = 1; point <= point_count; point++) {
    let p = data[point]; //get value
    p += min;
    p *= percent;

    const x = increase * point;
    const mid = (h / 2) + (p / 2);

    ctx.moveTo(x, mid);
    ctx.lineTo(x, mid - p);

    if (point % breakpoint === 0) {
      const i = (point / breakpoint) - 1;
      ctx.strokeStyle = options.colors[i];
      ctx.stroke();
      ctx.beginPath();
    }
  }
};
