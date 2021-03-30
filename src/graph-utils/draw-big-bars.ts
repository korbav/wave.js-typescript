import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const { options, ctx, h, w } = functionContext;
  let { data } = functionContext;

  const { colors } = options;
  const helper = new Helper(ctx);

  data = helper.mutateData(data, "organize").vocals;
  data = helper.mutateData(data, "shrink", 10);
  data = helper.mutateData(data, "scale", h);
  data = helper.mutateData(data, "amp", 1);
  const points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });

  let colorIndex = 0;
  const colorStop = Math.ceil(data.length / colors.length);
  points.start.forEach((start, i) => {
    if ((i + 1) % colorStop == 0) colorIndex++;
    helper.drawRectangle(start, data[i], w / data.length, { color: colors[colorIndex] });
  });
};
