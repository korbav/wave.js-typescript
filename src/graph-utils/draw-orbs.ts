import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';
import IFrequenciesSpectrum from '../core/types/IFrequenciesSpectrum';

export default (functionContext: IFunctionContext): void => {
  const { options, ctx, h, w, data: originalData } = functionContext;
  const { colors } = options;
  const helper = new Helper(ctx);

  let data: Uint8Array|Array<number> = (helper.mutateData(originalData, "organize") as IFrequenciesSpectrum).mids;
  data = helper.mutateData(data, "split", 2)[0] as Array<number>;
  data = helper.mutateData(data, "shrink", 100) as Array<number>;
  data = helper.mutateData(data, "mirror") as Array<number>;
  data = helper.mutateData(data, "scale", h) as Array<number>;
  data = helper.mutateData(data, "amp", .75) as Array<number>;

  const points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });
  points.start.forEach((start, i) => {
    helper.drawLine(start, points.end[i], { lineColor: colors[0] });
    helper.drawCircle(start, h * .01, { color: colors[1] || colors[0] });
    helper.drawCircle(points.end[i], h * .01, { color: colors[1] || colors[0] });
  });
};
