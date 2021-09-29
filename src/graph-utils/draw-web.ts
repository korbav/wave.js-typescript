import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const {ctx, h, w, options: colors, data: originalData } = functionContext;
  const helper = new Helper(ctx);

  const minDimension = (h < w) ? h : w;

  let data: Array<number> = helper.mutateData(originalData, "shrink", 100) as Array<number>;
  data = helper.mutateData(data, "split", 2)[0] as Array<number>;
  data = helper.mutateData(data, "scale", h / 4) as Array<number>;

  let dataCopy = data;

  let points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
  helper.drawPolygon(points.end, {close: true});

  points.start.forEach((start, i) => {
    helper.drawLine(start, points.end[i]);
  })

  data = helper.mutateData(data, "scale", .7) as Array<number>;
  points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
  helper.drawPolygon(points.end, {close: true});

  data = helper.mutateData(data, "scale", .3) as Array<number>;
  points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], data.length, data);
  helper.drawPolygon(points.end, {close: true});

  helper.drawCircle([w / 2, h / 2], minDimension / 2, {color: colors[2]});

  dataCopy = helper.mutateData(dataCopy, "scale", 1.4) as Array<number>;
  points = helper.getPoints("circle", minDimension / 2, [w / 2, h / 2], dataCopy.length, dataCopy);
  points.end.forEach((end) => {
    helper.drawCircle(end, minDimension * .01, {color: colors[1], lineColor: colors[1] || colors[0]});
  });
};
