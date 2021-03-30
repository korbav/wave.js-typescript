import IVisualizerOptions from './types/IVisualizerOptions';

const toRadians = (degree) => {
  return (degree * Math.PI) / 180;
};

const rotatePoint = ([pointX, pointY], [originX, originY], degree): Array<number> => {
  const angle = toRadians(degree) //clockwise
  const rotatedX = Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX;
  const rotatedY = Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY;
  return [rotatedX, rotatedY]
};

const getRoundedPoint = (x1: number, y1: number, x2: number, y2: number, radius: number, first: boolean): Array<number> => {
  const total = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
  const idx = first ? radius / total : (total - radius) / total;

  return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
}

const getRoundedPoints = (pts: Array<Array<number>>, radius: number): Array<Array<number>> => {
  const len = pts.length
  const res = new Array(len);

  for (let i2 = 0; i2 < len; i2++) {
    let i1 = i2 - 1;
    let i3 = i2 + 1;

    if (i1 < 0) i1 = len - 1;
    if (i3 == len) i3 = 0;

    const p1 = pts[i1];
    const p2 = pts[i2];
    const p3 = pts[i3];

    const prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
    const nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
    res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
  }
  return res;
}

export default class Helper {
  ctx = null;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  mutateData(data: Array<number>, type: string, extra = null): any {
    if (type === "mirror") {
      let rtn = [];

      for (let i = 0; i < data.length; i += 2) {
        rtn.push(data[i]);
      }

      rtn = [...rtn, ...rtn.reverse()];
      return rtn;
    }

    if (type === "shrink") {
      //resize array by % of current array 
      if (extra < 1) {
        extra = data.length * extra;
      }

      const rtn = [];
      const splitAt = Math.floor(data.length / extra);

      for (let i = 1; i <= extra; i++) {
        const arraySection = data.slice(i * splitAt, (i * splitAt) + splitAt);
        const middle = arraySection[Math.floor(arraySection.length / 2)];
        rtn.push(middle);
      }

      return rtn;
    }

    if (type === "split") {
      const size = Math.floor(data.length / extra);
      const rtn = [];
      let temp = [];

      let track = 0
      for (let i = 0; i <= size * extra; i++) {
        if (track === size) {
          rtn.push(temp);
          temp = [];
          track = 0;
        }

        temp.push(data[i]);
        track++;
      }

      return rtn;
    }

    if (type === "scale") {
      let scalePercent = extra / 255;
      if (extra <= 3 && extra >= 0) scalePercent = extra;
      return data.map(value => value * scalePercent);
    }

    if (type === "organize") {
      return {
        base: data.slice(60, 120),
        vocals: data.slice(120, 255),
        mids: data.slice(255, 2000)
      };
    }

    if (type === "reverb") {
      const rtn = [];
      data.forEach((val, i) => {
        rtn.push(val - (data[i + 1] || 0))
      })
      return rtn;
    }

    if (type === "amp") {
      const rtn = [];
      data.forEach(val => {
        rtn.push(val * (extra + 1));
      })
      return rtn;
    }

    if (type === "min") {
      const rtn = []
      data.forEach(value => {
        if (value < extra) value = extra;
        rtn.push(value);
      })
      return rtn;
    }
  }

  getPoints(
    shape: string,
    size: number,
    [originX, originY]: Array<number>,
    pointCount: number,
    endPoints: Array<number>,
    options?: IVisualizerOptions,
  ): { start: Array<Array<number>>, end: Array<Array<number>> } {
    const {offset, rotate, customOrigin} = {
      offset: 0,
      rotate: 0,
      customOrigin: [],
      ...options,
    };
    const rtn = {
      start: [],
      end: []
    };

    if (shape === "circle") {
      const degreePerPoint = 360 / pointCount;
      const radianPerPoint = toRadians(degreePerPoint);
      const radius = size / 2;

      for (let i = 1; i <= pointCount; i++) {
        const currentRadian = radianPerPoint * i
        const currentEndPoint = endPoints[i - 1]
        const pointOffset = endPoints[i - 1] * (offset / 100)

        let x = originX + (radius - pointOffset) * Math.cos(currentRadian)
        let y = originY + (radius - pointOffset) * Math.sin(currentRadian)
        const point1 = rotatePoint([x, y], [originX, originY], rotate)

        rtn.start.push(point1)

        x = originX + ((radius - pointOffset) + currentEndPoint) * Math.cos(currentRadian)
        y = originY + ((radius - pointOffset) + currentEndPoint) * Math.sin(currentRadian)
        const point2 = rotatePoint([x, y], [originX, originY], rotate)

        rtn.end.push(point2)
      }

      return rtn;
    }

    if (shape === "line") {
      const increment = size / pointCount

      originX = customOrigin[0] || originX
      originY = customOrigin[1] || originY

      for (let i = 0; i <= pointCount; i++) {
        const degree = rotate
        const pointOffset = endPoints[i] * (offset / 100)

        const startingPoint = rotatePoint([originX + (i * increment), originY - pointOffset],
          [originX, originY], degree)
        rtn.start.push(startingPoint)

        const endingPoint = rotatePoint([originX + (i * increment), (originY + endPoints[i]) - pointOffset],
          [originX, originY], degree)
        rtn.end.push(endingPoint)
      }

      return rtn;
    }
  }

  drawCircle([x, y]: Array<number>, diameter: number, options: IVisualizerOptions): void {
    const {color, lineColor} = {
      lineColor: this.ctx.strokeStyle,
      ...options,
    }

    this.ctx.beginPath();
    this.ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI);
    this.ctx.strokeStyle = lineColor;
    this.ctx.stroke();
    this.ctx.fillStyle = color;
    if (color) {
      this.ctx.fill();
    }
  }

  // drawOval([x, y]: Array<number>, height: number, width: number, options: IVisualizerOptions): void {
  //   const {rotation, color, lineColor} = {
  //     rotation: toRadians(options.rotation || 0),
  //     lineColor: this.ctx.strokeStyle,
  //     ...options,
  //   };
  //
  //   this.ctx.beginPath();
  //   this.ctx.ellipse(x, y, width, height, rotation, 0, 2 * Math.PI);
  //   this.ctx.strokeStyle = lineColor
  //   this.ctx.stroke();
  //   this.ctx.fillStyle = color
  //   if (color) this.ctx.fill()
  // }

  drawSquare([x, y]: Array<number>, diameter: number, options: IVisualizerOptions): void {
    this.drawRectangle([x, y], diameter, diameter, options);
  }

  drawRectangle([x, y]: Array<number>, height: number, width: number, options: IVisualizerOptions): void {
    const {color, lineColor, radius, rotate} = {
      lineColor: this.ctx.strokeStyle,
      radius: 0,
      rotate: 0,
      ...options,
    }


    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    const p1 = rotatePoint([x + width, y], [x, y], rotate)
    const p2 = rotatePoint([x + width, y + height], [x, y], rotate)
    this.ctx.arcTo(p1[0], p1[1], p2[0], p2[1], radius);

    const p3 = rotatePoint([x + width, y + height], [x, y], rotate)
    const p4 = rotatePoint([x, y + height], [x, y], rotate)
    this.ctx.arcTo(p3[0], p3[1], p4[0], p4[1], radius);

    const p5 = rotatePoint([x, y + height], [x, y], rotate)
    const p6 = rotatePoint([x, y], [x, y], rotate)
    this.ctx.arcTo(p5[0], p5[1], p6[0], p6[1], radius);

    const p7 = rotatePoint([x, y], [x, y], rotate)
    const p8 = rotatePoint([x + width, y], [x, y], rotate)
    this.ctx.arcTo(p7[0], p7[1], p8[0], p8[1], radius);
    this.ctx.closePath();

    this.ctx.strokeStyle = lineColor;
    this.ctx.stroke()
    this.ctx.fillStyle = color
    if (color) this.ctx.fill()
  }

  drawLine([fromX, fromY]: Array<number>, [toX, toY]: Array<number>, options?: IVisualizerOptions): void {
    const {lineColor} = {
      lineColor: this.ctx.strokeStyle,
      ...options,
    }

    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.strokeStyle = lineColor
    this.ctx.stroke();
  }

  drawPolygon(points: Array<Array<number>>, options: IVisualizerOptions): void {
    const {color, lineColor, radius, close} = {
      lineColor: this.ctx.strokeStyle,
      radius: 0,
      close: false,
      ...options,
    };

    if (radius > 0) {
      points = getRoundedPoints(points, radius);
    }

    let i, pt;
    const len = points.length;
    for (i = 0; i < len; i++) {
      pt = points[i];
      if (i == 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(pt[0], pt[1]);
      } else {
        this.ctx.lineTo(pt[0], pt[1]);
      }
      if (radius > 0) {
        this.ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
      }
    }

    if (close) this.ctx.closePath();
    this.ctx.strokeStyle = lineColor
    this.ctx.stroke();

    this.ctx.fillStyle = color
    if (color) this.ctx.fill()
  }
}
