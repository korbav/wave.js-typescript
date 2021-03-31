import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const { options, ctx, h, w } = functionContext;
  let { data } = functionContext;
  const { colors } = options;
  const helper = new Helper(ctx);

  data = helper.mutateData(data, "organize").mids
  data = helper.mutateData(data, "split", 2)[0]
  data = helper.mutateData(data, "shrink", 100)
  data = helper.mutateData(data, "mirror")
  data = helper.mutateData(data, "scale", h)
  data = helper.mutateData(data, "amp", .75)

  const points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });
  points.start.forEach((start, i) => {
    helper.drawLine(start, points.end[i], { lineColor: colors[0] });
    helper.drawCircle(start, h * .01, { color: colors[1] || colors[0] });
    helper.drawCircle(points.end[i], h * .01, { color: colors[1] || colors[0] });
  });
};
