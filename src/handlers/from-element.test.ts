import Generator from '../core/Generator';
import * as utils from '../utils';
import fromElement from '../../src/handlers/from-element';
import Processor from '../core/Processor';
import ElementNotFoundError from '../core/errors/ElementNotFoundError';
import CanvasNotFoundError from '../core/errors/CanvasNotFoundError';

const audioElement = {};
const canvasElement = {id: 'canvas-id'};
jest.mock('../core/Visualizer');
jest.mock('../utils');
jest.mock('../core/Processor');

describe('from element', () => {
  beforeEach(() => {
    jest.spyOn(document, 'getElementById')
      .mockReturnValueOnce(audioElement as any)
      .mockReturnValueOnce(canvasElement as any);
  });

  it('should check the type of the generator', () => {
    jest.spyOn(utils, 'checkGenerator').mockReturnValue();
    fromElement('element-id', 'canvas-id', {type: Generator.BARS});

    expect(utils.checkGenerator).toHaveBeenCalledTimes(1);
    expect(utils.checkGenerator).toHaveBeenCalledWith('bars');
  });

  it('should deactivate the handler', () => {
    jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(() => null);
    jest.spyOn(Processor.prototype, 'deactivate');
    const {deactivate} = fromElement(
      'element-id',
      'canvas-id',
    );

    deactivate();

    expect(Processor.prototype.deactivate).toHaveBeenCalledTimes(1);
  });

  it('should connect to the destination by default', () => {
    fromElement('element-id', 'canvas-id');

    expect(Processor).toHaveBeenCalledTimes(1);
    expect(Processor).toHaveBeenCalledWith(audioElement, 'canvas-id', {
      colors: ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"],
      getGlobal: expect.any(Function),
      globalAccessKey: '$wave',
      setGlobal: expect.any(Function),
      stroke: 1,
      type: 'bars',
    }, {
      connectDestination: true,
      skipUserEventsWatcher: false,
      existingMediaStreamSource: null,
    });
  });


  it('should call initialize and not initializeAfterUserGesture if skipUserEventsWatcher is true', () => {
    fromElement('element-id', 'canvas-id', {}, {skipUserEventsWatcher: true});

    expect(Processor.prototype.initialize).toHaveBeenCalledTimes(1);
    expect(Processor.prototype.initializeAfterUserGesture).toHaveBeenCalledTimes(0);
  });


  it('should call initialize and not initializeAfterUserGesture if activated is true', () => {
    jest.spyOn(Processor.prototype, 'isActivated').mockReturnValue(true);
    fromElement('element-id', 'canvas-id', {}, {
      skipUserEventsWatcher: false,
    });

    expect(Processor.prototype.initialize).toHaveBeenCalledTimes(1);
    expect(Processor.prototype.initializeAfterUserGesture).toHaveBeenCalledTimes(0);
  });


  it('should call initializeAfterUserGesture and not initialize if skipUserEventsWatcher is false', () => {
    fromElement('element-id', 'canvas-id', {}, {skipUserEventsWatcher: false});

    expect(Processor.prototype.initializeAfterUserGesture).toHaveBeenCalledTimes(1);
    expect(Processor.prototype.initialize).toHaveBeenCalledTimes(0);
  });


  it('should throw an ElementNotFoundError if the element is not found', () => {
    jest.spyOn(document, 'getElementById').mockReset().mockReturnValueOnce(undefined);
    expect(() => fromElement('unexisting-element-id', 'canvas-id')).toThrow((ElementNotFoundError as any).default)
  });

  it('should throw an CanvasNotFoundError if the element is not found', () => {
    jest.spyOn(document, 'getElementById')
      .mockReset()
      .mockReturnValueOnce(audioElement as any)
      .mockReturnValueOnce(undefined as any);

    expect(() => fromElement('element-id', 'unexisting-canvas-id')).toThrow((CanvasNotFoundError as any).default)
  });
});
