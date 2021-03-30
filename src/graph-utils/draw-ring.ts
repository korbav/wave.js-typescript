import IFunctionContext from '../core/types/IFunctionContext';

export default (functionContext: IFunctionContext): void => {
  const { data, options, ctx, h, w } = functionContext;
  const cx = w / 2;
  const cy = h / 2;
  const r = (h - 10) / 2;
  const offset = r / 5;
  const percent = (r - offset) / 255;
  const point_count = 150;
  const increase = (360 / point_count) * Math.PI / 180;

  ctx.arc(cx, cy, r, 0, 2 * Math.PI, true);

  const fa = 0;
  const fx = cx + (r - (data[0] * percent)) * Math.cos(fa);
  const fy = cy + (r - (data[0] * percent)) * Math.sin(fa);
  ctx.moveTo(fx, fy);

  let q = 0;
  for (let point = 0; point < point_count; point++) {
    q += 1
    if (point >= point_count / 2) {
      q -= 2;
    }

    let p = data[q]; //get value
    p *= percent;

    const a = point * increase;
    const x = cx + (r - p) * Math.cos(a);
    const y = cy + (r - p) * Math.sin(a);

    ctx.lineTo(x, y);
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
  }

  ctx.lineTo(fx, fy);
  ctx.stroke();
  ctx.fillStyle = options.colors[1] || "#fff000";
  ctx.fill();
};
