import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const { options, ctx, h, w } = functionContext;
  let { data } = functionContext;
  const minDimension = (h < w) ? h : w
  const helper = new Helper(ctx);
  const { colors } = options;

  data = helper.mutateData(data, "organize");
  data = [data.mids, data.vocals]

  data[0] = helper.mutateData(data[0], "scale", minDimension / 4)
  data[1] = helper.mutateData(data[1], "scale", minDimension / 8)

  data[0] = helper.mutateData(data[0], "shrink", 1 / 5)
  data[0] = helper.mutateData(data[0], "split", 2)[0]

  data[0] = helper.mutateData(data[0], "reverb")
  data[1] = helper.mutateData(data[1], "reverb")


  const outerCircle = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data[0].length, data[0])
  const innerCircle = helper.getPoints("circle", minDimension / 4, [w / 2, h / 2], data[1].length, data[1])

  helper.drawPolygon(outerCircle.end, { close: true, radius: 4, lineColor: colors[0], color: colors[1] })
  helper.drawPolygon(innerCircle.end, { close: true, radius: 4, lineColor: colors[2], color: colors[3] })

  const middle = ((minDimension / 4) + (minDimension / 2)) / 2
  const largerInner = data[1] = helper.mutateData(data[1], "scale", ((minDimension / 4) - (minDimension / 2)))
  const innerBars = helper.getPoints("circle", middle, [w / 2, h / 2], data[1].length, largerInner)
  innerBars.start.forEach((start, i) => {
    helper.drawLine(start, innerBars.end[i], { lineColor: colors[4] || colors[2] })
  })
};
