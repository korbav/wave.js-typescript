import IFunctionContext from '../core/types/IFunctionContext';

export default (functionContext: IFunctionContext): void => {
  const { data, options, ctx, h, w } = functionContext;
  const percent = h / 255;
  const width = w / 50;

  for (let point = 0; point <= 50; point++) {
    let p = data[point]; //get value
    p *= percent;
    const x = width * point;

    ctx.rect(x, (h / 2) + (p / 2), width, -(p));
  }

  if (options.colors[1]) {
    ctx.fillStyle = options.colors[1];
    ctx.fill();
  }

  ctx.stroke();
};
