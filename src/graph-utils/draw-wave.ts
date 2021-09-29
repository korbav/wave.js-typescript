import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const { ctx, h, w, options: colors, data: originalData } = functionContext;
  const helper = new Helper(ctx);

  let data: Array<number> = helper.mutateData(originalData, "split", 4)[0] as Array<number>;
  data = helper.mutateData(data, "scale", h) as Array<number>;

  const points = helper.getPoints("line", w, [0, h], data.length, data, { offset: 100 });

  points.start = points.start.slice(0, points.end.length - 1);
  points.start.push([w, h]);
  points.start.push([0, h]);

  helper.drawPolygon(points.start, { lineColor: colors[0], color: colors[1], radius: (h * .008) });
};
