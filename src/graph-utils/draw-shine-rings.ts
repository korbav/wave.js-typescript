import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';
import IFrequenciesSpectrum from '../core/types/IFrequenciesSpectrum';
import IStartEndPoints from '../core/types/IStartEndPoints';


export default (functionContext: IFunctionContext): void => {
  const {options, ctx, h, w, data: originalData} = functionContext;
  const {colors} = options
  const helper = new Helper(ctx)
  const minDimension = (h < w) ? h : w

  const data = helper.mutateData(originalData, "organize") as IFrequenciesSpectrum;
  data.vocals = helper.mutateData(data.vocals, "scale", (minDimension / 2) / 2) as Uint8Array;
  data.base = helper.mutateData(data.base, "scale", (minDimension / 2) / 2) as Uint8Array;
  const outerBars: IStartEndPoints = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, Array.from(data.vocals));
  const innerWave: IStartEndPoints = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, Array.from(data.vocals), {offset: 100});
  const thinLine : IStartEndPoints = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.base.length,   Array.from(data.base), {offset: 100});

  outerBars.start.forEach((start, i) => {
    helper.drawLine(start, outerBars.end[i], {lineColor: colors[0]})
  })

  helper.drawPolygon(innerWave.start, {close: true, lineColor: colors[1], color: colors[3], radius: 5})
  helper.drawPolygon(thinLine.start, {close: true, lineColor: colors[2], color: colors[4], radius: 5})
}
