import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const { options, ctx, h, w, data: originalData } = functionContext;
  const { colors } = options;
  const helper = new Helper(ctx);

  let data: Array<number> | Array<Array<number>> = helper.mutateData(originalData, "shrink", 300) as Array<number>;
  data = helper.mutateData(data as Array<number>, "scale", h / 2) as Array<number>;
  data = (helper.mutateData(data, "split", 4) as Array<Array<number>>).slice(0, 3);

  let colorIndex = 0;
  data.forEach((points) => {
    const wavePoints = helper.getPoints("line", w, [0, h / 2], points.length, points);
    helper.drawPolygon(wavePoints.end, { lineColor: colors[colorIndex], radius: (h * .015) });
    const invertedPoints = helper.getPoints("line", w, [0, h / 2], points.length, points, { offset: 100 });
    helper.drawPolygon(invertedPoints.start, { lineColor: colors[colorIndex], radius: (h * .015) });
    colorIndex++;
  });
};
