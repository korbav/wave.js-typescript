import IFunctionContext from '../core/types/IFunctionContext';

export default (functionContext: IFunctionContext): void => {
  const { data, options, ctx, h, w } = functionContext;
  const r = h / 4;
  const cx = w / 2;
  const cy = h / 2;
  const point_count = 56;
  const percent = r / 255;
  const increase = (360 / point_count) * Math.PI / 180;

  for (let point = 1; point <= point_count; point++) {
    const p = (data[point]) * percent;
    const a = point * increase;

    const ax = cx + (r - (p / 2)) * Math.cos(a);
    const ay = cy + (r - (p / 2)) * Math.sin(a);
    ctx.moveTo(ax, ay);

    const bx = cx + (r + p) * Math.cos(a);
    const by = cy + (r + p) * Math.sin(a);
    ctx.lineTo(bx, by);

    const dx = cx + (r + p) * Math.cos(a + increase);
    const dy = cy + (r + p) * Math.sin(a + increase);
    ctx.lineTo(dx, dy);

    const ex = cx + (r - (p / 2)) * Math.cos(a + increase);
    const ey = cy + (r - (p / 2)) * Math.sin(a + increase);

    ctx.lineTo(ex, ey);
    ctx.lineTo(ax, ay);
  }

  if (options.colors[1]) {
    ctx.fillStyle = options.colors[1];
    ctx.fill();
  }

  ctx.stroke();
};
