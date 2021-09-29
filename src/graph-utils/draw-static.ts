import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const { ctx, h, w, data: originalData } = functionContext;
  const helper = new Helper(ctx);

  let data: Array<number> | Array<Array<number>> = helper.mutateData(originalData, "shrink", 1 / 8) as Array<number>;
  data = helper.mutateData(data, "split", 2)[0] as Array<number>;
  data = helper.mutateData(data, "scale", h) as Array<number>;

  const points = helper.getPoints("line", w, [0, h / 2], data.length, data, { offset: 50 })

  let prevPoint = null
  points.start.forEach((start, i) => {
    if (prevPoint) {
      helper.drawLine(prevPoint, start)
    }
    helper.drawLine(start, points.end[i])
    prevPoint = points.end[i]
  });
};
