import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const {options, ctx, h, w} = functionContext;
  let {data} = functionContext;
  const {colors} = options
  const helper = new Helper(ctx)
  const minDimension = (h < w) ? h : w

  data = helper.mutateData(data, "organize");
  data.vocals = helper.mutateData(data.vocals, "scale", (minDimension / 2) / 2)
  data.base = helper.mutateData(data.base, "scale", (minDimension / 2) / 2)
  const outerBars = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, data.vocals);
  const innerWave = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.vocals.length, data.vocals, {offset: 100});
  const thinLine = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.base.length, data.base, {offset: 100});

  outerBars.start.forEach((start, i) => {
    helper.drawLine(start, outerBars.end[i], {lineColor: colors[0]})
  })

  helper.drawPolygon(innerWave.start, {close: true, lineColor: colors[1], color: colors[3], radius: 5})
  helper.drawPolygon(thinLine.start, {close: true, lineColor: colors[2], color: colors[4], radius: 5})
}
