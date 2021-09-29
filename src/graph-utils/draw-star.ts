import IFunctionContext from '../core/types/IFunctionContext';
import IPoint from '../core/types/IPoint';

export default (functionContext: IFunctionContext): void => {
  const { data, options: { colors }, ctx, h, w } = functionContext;
  const r = h / 4;
  const offset = r / 4;
  const cx = w / 2;
  const cy = h / 2;
  const point_count = 120;
  const percent = (r - offset - 35) / (255);
  const increase = (360 / point_count) * Math.PI / 180;
  const top: Array<IPoint> = [];
  const bottom: Array<IPoint> = [];

  for (let point = 1; point <= point_count; point++) {
    const p = ((data[200 % point])) * percent;
    const a = point * increase;
    const sx = cx + ((r) - p + offset) * Math.cos(a);
    const sy = cy + ((r) - p + offset) * Math.sin(a);
    ctx.moveTo(sx, sy);
    bottom.push({
      x: sx,
      y: sy
    });
    const dx = cx + (r + p + offset) * Math.cos(a);
    const dy = cy + (r + p + offset) * Math.sin(a);
    ctx.lineTo(dx, dy);
    top.push({
      x: dx,
      y: dy
    });
  }

  ctx.moveTo(top[0].x, top[0].y)
  for (const t in top) {
    ctx.lineTo(top[t].x, top[t].y);
  }
  ctx.closePath();
  ctx.moveTo(bottom[0].x, bottom[0].y);

  for (let b = bottom.length - 1; b >= 0; b--) {
    ctx.lineTo(bottom[b].x, bottom[b].y);
  }
  ctx.closePath();

  if (colors[1]) {
    ctx.fillStyle = colors[1];
    ctx.fill();
  }
  ctx.stroke();

  //inner color
  ctx.beginPath();
  ctx.moveTo(bottom[0].x, bottom[0].y)
  for (const b in bottom) {
    ctx.lineTo(bottom[b].x, bottom[b].y);
  }
  ctx.closePath();

  if (colors[2]) {
    ctx.fillStyle = colors[2];
    ctx.fill();
  }
  ctx.stroke();
};
