import IFunctionContext from './types/IFunctionContext';
import IWaveOptions from './types/IWaveOptions';
import Generator from './Generator';
import { setPropertyIfNotSet } from '../utils';
import * as graphUtils from '../graph-utils'
import defaultOptions from '../utils/default-options';
import CanvasNotFoundError from './errors/CanvasNotFoundError';
import IFrameRateMap from './types/IFrameRateMap';

const typeMap = {
  [Generator.BARS]: graphUtils.drawBars,
  [Generator.BARS_BLOCKS]: graphUtils.drawBarsBlocks,
  [Generator.BIG_BARS]: graphUtils.drawBigBars,
  [Generator.CUBES]: graphUtils.drawCubes,
  [Generator.DUAL_BARS]: graphUtils.drawDualBars,
  [Generator.DUAL_BARS_BLOCKS]: graphUtils.drawDualBarsBlocks,
  [Generator.FIREWOKS]: graphUtils.drawFireworks,
  [Generator.FLOWER]: graphUtils.drawFlower,
  [Generator.FLOWER_BLOCKS]: graphUtils.drawFlowerBlocks,
  [Generator.ORBS]: graphUtils.drawOrbs,
  [Generator.RING]: graphUtils.drawRing,
  [Generator.RINGS]: graphUtils.drawRings,
  [Generator.ROUND_WAVE]: graphUtils.drawRoundWave,
  [Generator.SHOCKWAVE]: graphUtils.drawShockWave,
  [Generator.SHINE]: graphUtils.drawShine,
  [Generator.SHINE_RINGS]: graphUtils.drawShineRings,
  [Generator.STAR]: graphUtils.drawStar,
  [Generator.STATIC]: graphUtils.drawStatic,
  [Generator.STITCHES]: graphUtils.drawStitches,
  [Generator.WAVE]: graphUtils.drawWave,
  [Generator.WEB]: graphUtils.drawWeb,
};

const frameRateMap: IFrameRateMap = {};

export default function visualize(data: Uint8Array, canvasEltOrId: string | HTMLCanvasElement, originalOptions: IWaveOptions, frame?: number): void {
  const options: IWaveOptions = {...defaultOptions, ...(originalOptions || {})}
  const canvas: HTMLCanvasElement = typeof canvasEltOrId === 'string' ?
    <HTMLCanvasElement>document.getElementById(canvasEltOrId.toString()) : canvasEltOrId;

  if (!canvas) {
    throw new CanvasNotFoundError(canvasEltOrId.toString());
  }

  const canvasId = canvas.id;
  const ctx = canvas.getContext('2d');
  const h: number = canvas.height;
  const w: number = canvas.width;

  ctx.strokeStyle = options.colors[0];
  ctx.lineWidth = Number(options.stroke.toString());

  const functionContext: IFunctionContext = {
    data, options, ctx, h, w, canvasId,
  };

  const generators = (Array.isArray(options.type) ? options.type : [options.type]);
  setPropertyIfNotSet(frameRateMap, generators[0].toString(), 1);
  if (frame % frameRateMap[generators[0].toString()] === 0) { //abide by the frame rate
    ctx.clearRect(0, 0, w, h);
    ctx.beginPath();
    generators.forEach(type => {
      typeMap[type.toString()](functionContext);
    });
  }
}
