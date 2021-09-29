import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const { ctx, h, w, data: originalData } = functionContext;
  const helper = new Helper(ctx);
  const minDimension = (h < w) ? h : w;

  let data: Array<number> = helper.mutateData(originalData, "shrink", 200) as Array<number>;
  data = helper.mutateData(data, "split", 2)[0] as Array<number>;
  data = helper.mutateData(data, "scale", h / 2) as Array<number>;

  const points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data, { offset: 50 });

  helper.drawPolygon(points.end, { close: true });
  helper.drawPolygon(points.start, { close: true });

  for (let i = 0; i < points.start.length; i += 1) {
    const start = points.start[i];
    i++;
    const end = points.end[i] || points.end[0];
    helper.drawLine(start, end);
    helper.drawLine(end, points.start[i + 1] || points.start[0]);
  }
};
