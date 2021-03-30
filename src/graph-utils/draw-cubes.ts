import IFunctionContext from '../core/types/IFunctionContext';
import Helper from '../core/Helper';

export default (functionContext: IFunctionContext): void => {
  const {options, ctx, h, w} = functionContext;
  let {data} = functionContext;

  const {colors} = options
  const helper = new Helper(ctx)

  data = helper.mutateData(data, "organize").base

  data = helper.mutateData(data, "shrink", 20).slice(0, 19)
  data = helper.mutateData(data, "scale", h)

  const points = helper.getPoints("line", w, [0, h], data.length, data)

  const spacing = 5;
  const squareSize = (w / 20) - spacing;
  let colorIndex = 0;

  points.start.forEach((start, i) => {
    const squareCount = Math.ceil(data[i] / squareSize);

    //find color stops from total possible squares in bar 
    const totalSquares = (h - (spacing * (h / squareSize))) / squareSize;
    const colorStop = Math.ceil(totalSquares / colors.length);

    for (let j = 1; j <= squareCount; j++) {
      const origin = [start[0], (start[1] - (squareSize * j) - (spacing * j))];
      helper.drawSquare(origin, squareSize, {color: colors[colorIndex], lineColor: "black"});
      if (j % colorStop == 0) {
        colorIndex++;
        if (colorIndex >= colors.length) colorIndex = colors.length - 1;
      }
    }
    colorIndex = 0;
  })
};
