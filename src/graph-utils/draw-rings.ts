import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';
import IFrequenciesSpectrum from '../core/types/IFrequenciesSpectrum';

export default (functionContext: IFunctionContext): void => {
  const { options, ctx, h, w, data: originalData } = functionContext;
  const minDimension = (h < w) ? h : w
  const helper = new Helper(ctx);
  const { colors } = options;

  const dataOrganized: IFrequenciesSpectrum = helper.mutateData(originalData, "organize") as IFrequenciesSpectrum;
  const data: Array<Array<number>> | Array<Uint8Array|Array<number>> = [dataOrganized.mids, dataOrganized.vocals] as Array<Uint8Array>;

  data[0] = helper.mutateData(data[0], "scale", minDimension / 4) as Array<number>;
  data[1] = helper.mutateData(data[1], "scale", minDimension / 8) as  Array<number>;

  data[0] = helper.mutateData(data[0], "shrink", 1 / 5) as  Array<number>;
  data[0] = (helper.mutateData(data[0], "split", 2) as Array<Array<number>>)[0];

  data[0] = helper.mutateData(data[0], "reverb") as Array<number>;
  data[1] = helper.mutateData(data[1], "reverb") as Array<number>;


  const outerCircle = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data[0].length, data[0])
  const innerCircle = helper.getPoints("circle", minDimension / 4, [w / 2, h / 2], data[1].length, data[1])

  helper.drawPolygon(outerCircle.end, { close: true, radius: 4, lineColor: colors[0], color: colors[1] })
  helper.drawPolygon(innerCircle.end, { close: true, radius: 4, lineColor: colors[2], color: colors[3] })

  const middle = ((minDimension / 4) + (minDimension / 2)) / 2
  const largerInner = data[1] = helper.mutateData(data[1], "scale", ((minDimension / 4) - (minDimension / 2))) as Array<number>;
  const innerBars = helper.getPoints("circle", middle, [w / 2, h / 2], data[1].length, largerInner);
  innerBars.start.forEach((start, i) => {
    helper.drawLine(start, innerBars.end[i], { lineColor: colors[4] || colors[2] });
  })
};
