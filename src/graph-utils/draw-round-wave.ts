import IFunctionContext from '../core/types/IFunctionContext';

export default (functionContext: IFunctionContext): void => {
  const { data, options, ctx, h, w } = functionContext;
  const r = h / 4;
  const cx = w / 2;
  const cy = h / 2;
  const point_count = 100;
  const percent = r / 255;
  const increase = (360 / point_count) * Math.PI / 180;
  const p = 0;
  const sx = cx + (r + p) * Math.cos(0);
  const sy = cy + (r + p) * Math.sin(0);
  ctx.moveTo(sx, sy);

  for (let point = 1; point <= point_count; point++) {
    const p = (data[350 % point]) * percent;
    const a = point * increase;
    const dx = cx + (r + p) * Math.cos(a);
    const dy = cy + (r + p) * Math.sin(a);
    ctx.lineTo(dx, dy);
  }

  ctx.closePath();
  ctx.stroke();

  if (options.colors[1]) {
    ctx.fillStyle = options.colors[1];
    ctx.fill();
  }
};
