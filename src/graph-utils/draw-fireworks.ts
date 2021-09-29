import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const { options, ctx, h, w, data: originalData } = functionContext;
  const { colors } = options;
  const helper = new Helper(ctx);

  let data: Array<number> = (helper.mutateData(originalData, "shrink", 200) as Array<number>).slice(0, 120);
  data = helper.mutateData(data, "mirror") as Array<number>;
  data = helper.mutateData(data, "scale", (h / 4) + ((h / 4) * .35)) as Array<number>;

  const points = helper.getPoints("circle", h / 2, [w / 2, h / 2], data.length, data, { offset: 35, rotate: 270 });

  points.start.forEach((start, i) => {
    helper.drawLine(start, points.end[i]);
  })

  helper.drawPolygon(points.start, { close: true });

  points.end.forEach((end) => {
    helper.drawCircle(end, h * .01, { color: colors[0] });
  });
};
