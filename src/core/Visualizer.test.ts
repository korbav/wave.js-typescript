import visualize from './Visualizer';
import CanvasNotFoundError from './errors/CanvasNotFoundError';
import Generator from './Generator';
import { drawBars, drawRing } from '../graph-utils/index';

jest.mock('../graph-utils/index', () => ({
  drawBars: jest.fn(),
  drawRing: jest.fn(),
}));

describe('Visualizer', () => {
  it('should throw a CanvasNotFoundError if the canvas with given id is not found', () => {
    jest.spyOn(document, 'getElementById').mockImplementationOnce(() => undefined);
    expect(() => visualize(new Uint8Array(), 'canvas-id', {}, 1))
      .toThrow((CanvasNotFoundError as any).default);
  });

  it('should throw a CanvasNotFoundError if the canvas element passed is not defined', () => {
    expect(() => visualize(new Uint8Array(), undefined, {}, 1))
      .toThrow((CanvasNotFoundError as any).default);
  });

  it('should call each generator helper to draw on the canvas', () => {
    const mockContext = {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
    };
    const canvas = {
      id: 'mock-canvas',
      width: 123,
      height: 456,
      getContext: () => mockContext,
    };
    const expectedCallParameters = {
      data: new Uint8Array(),
      options: expect.objectContaining({
        type: [Generator.BARS, Generator.RING],
      }),
      ctx: mockContext,
      canvasId: 'mock-canvas',
      w: 123,
      h: 456,
    };

    visualize(new Uint8Array(), (canvas as any), {
      type: [Generator.BARS, Generator.RING]
    }, 1);

    expect(drawBars).toHaveBeenCalledTimes(1);
    expect(drawBars).toHaveBeenCalledWith(expectedCallParameters);
    expect(drawRing).toHaveBeenCalledTimes(1);
    expect(drawRing).toHaveBeenCalledWith(expectedCallParameters);
  });
});
