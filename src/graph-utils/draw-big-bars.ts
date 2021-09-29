import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';
import IFrequenciesSpectrum from '../core/types/IFrequenciesSpectrum';

export default (functionContext: IFunctionContext): void => {
  const { options, ctx, h, w, data: originalData } = functionContext;

  const { colors } = options;
  const helper = new Helper(ctx);

  let data: Uint8Array|Array<number> = (helper.mutateData(originalData, "organize") as IFrequenciesSpectrum).vocals;
  data = helper.mutateData(data, "shrink", 10) as Array<number>;
  data = helper.mutateData(data, "scale", h) as Array<number>;
  data = helper.mutateData(data, "amp", 1) as Array<number>;
  const points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 });

  let colorIndex = 0;
  const colorStop = Math.ceil(data.length / colors.length);
  points.start.forEach((start, i) => {
    if ((i + 1) % colorStop == 0) colorIndex++;
    helper.drawRectangle(start, data[i], w / data.length, { color: colors[colorIndex] });
  });
};
