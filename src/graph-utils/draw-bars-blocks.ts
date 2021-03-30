import IFunctionContext from '../core/types/IFunctionContext';

export default (functionContext: IFunctionContext): void => {
  const { data, options, ctx, h, w } = functionContext;

  const percent = h / 255;
  const width = w / 64;

  for (let point = 0; point < 64; point++) {
    let p = data[point]; //get value
    p *= percent;
    const x = width * point;
    ctx.rect(x, h, width, -(p));
  }

  ctx.fillStyle = options.colors[1] || options.colors[0];
  ctx.stroke();
  ctx.fill();
};
