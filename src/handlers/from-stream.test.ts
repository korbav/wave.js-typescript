import { ObjectReadableMock } from 'stream-mock';
import Generator from '../core/Generator';
import * as utils from '../utils';
import fromStream from './from-stream';
import visualize from '../core/Visualizer';

const streamSourceConnectMock = jest.fn();
const audioCtxDestinationMock = jest.fn();
const analyzerMock = {
  getByteFrequencyData: jest.fn().mockReturnValue(new Uint8Array())
};

const closeMock = jest.fn().mockImplementation(() => null);
jest.mock('../core/Visualizer');
jest.mock('standardized-audio-context', () => ({
  ['AudioContext']: () => ({
    close: jest.fn().mockReturnValue({
      then: closeMock
    }),
    connect: jest.fn(),
    createAnalyser: jest.fn().mockImplementation(() => analyzerMock),
    createMediaElementSource: jest.fn().mockReturnValue({connect: jest.fn()}),
    createMediaStreamSource: jest.fn().mockReturnValue({connect: streamSourceConnectMock}),
    destination: audioCtxDestinationMock,
  }),
}));

describe('from stream', () => {
  beforeEach(() => {
    jest.spyOn(global, 'requestAnimationFrame').mockImplementationOnce((callback: any) => {
      callback();
      return 123;
    }).mockImplementationOnce((callback: any) => {
      callback();
      return 456;
    }).mockImplementationOnce((callback: any) => {
      callback();
      return 789;
    });
    jest.spyOn(global, 'cancelAnimationFrame').mockReturnValueOnce(null);
  });

  it('should check the type of the generator', () => {
    jest.spyOn(utils, 'checkGenerator').mockReturnValueOnce();
    const stream = new ObjectReadableMock([], {});
    stream.toString = () => 'fake-stream1';

    fromStream(stream as unknown as MediaStream, 'canvas-id', {type: Generator.BARS});

    expect(utils.checkGenerator).toHaveBeenCalledTimes(1);
    expect(utils.checkGenerator).toHaveBeenCalledWith('bars');
  });

  it('should cancel the current animation if fromStream has been already called for the given stream', () => {
    const stream = new ObjectReadableMock([], {});
    stream.toString = () => 'fake-stream2';

    fromStream(stream as unknown as MediaStream, 'canvas-id', {type: Generator.BARS});
    fromStream(stream as unknown as MediaStream, 'canvas-id', {type: Generator.BARS});

    expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
    expect(cancelAnimationFrame).toHaveBeenCalledWith(123);
  });

  it('should loop call visualize depending on requestAnimationFrame handler', () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation(() => null);
    const stream = new ObjectReadableMock([], {});
    stream.toString = () => 'fake-stream3';

    fromStream(stream as unknown as MediaStream, 'canvas-id', {type: Generator.BARS});
    jest.runAllTimers();

    expect(requestAnimationFrame).toHaveBeenCalledTimes(4);
    expect(visualize).toHaveBeenCalledTimes(4);
    expect((visualize as jest.Mock).mock.calls).toEqual([
      [expect.any(Uint8Array), 'canvas-id', expect.any(Object), 1],
      [expect.any(Uint8Array), 'canvas-id', expect.any(Object), 2],
      [expect.any(Uint8Array), 'canvas-id', expect.any(Object), 3],
      [expect.any(Uint8Array), 'canvas-id', expect.any(Object), 4],
    ]);

    jest.useRealTimers();
  });

  it('should connect to the destination by default', () => {
    const stream = new ObjectReadableMock([], {});
    stream.toString = () => 'fake-stream4';

    fromStream(stream as unknown as MediaStream, 'canvas-id', {type: Generator.BARS});

    expect(streamSourceConnectMock).toHaveBeenCalledTimes(2);
    expect(streamSourceConnectMock.mock.calls).toEqual([
      [analyzerMock],
      [audioCtxDestinationMock],
    ]);
  });

  it('should not connect to the destination if the connectDestination option is set to false', () => {
    const stream = new ObjectReadableMock([], {});
    stream.toString = () => 'fake-stream5';

    fromStream(stream as unknown as MediaStream, 'canvas-id', {type: Generator.BARS}, {
      connectDestination: false,
    });

    expect(streamSourceConnectMock).toHaveBeenCalledTimes(1);
    expect(streamSourceConnectMock.mock.calls).toEqual([
      [analyzerMock],
    ]);
  });

  it('should deactivate the handler', () => {
    jest.useFakeTimers();
    jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(() => null);
    jest.spyOn(global, 'requestAnimationFrame').mockImplementationOnce((callback: any) => {
      setTimeout(callback, 1);
      return 123;
    }).mockImplementationOnce((callback: any) => {
      setTimeout(callback, 1);
      return 456;
    }).mockImplementationOnce((callback: any) => {
      setTimeout(callback, 1);
      return 789;
    });
    const stream = new ObjectReadableMock([], {});
    stream.toString = () => 'fake-stream6';
    const {deactivate} = fromStream(stream as unknown as MediaStream, 'canvas-id', {type: Generator.BARS});

    jest.advanceTimersToNextTimer();
    (requestAnimationFrame as jest.Mock).mockClear();
    (visualize as jest.Mock).mockClear();
    deactivate();
    jest.advanceTimersToNextTimer();

    expect(requestAnimationFrame).toHaveBeenCalledTimes(0);
    expect(visualize).toHaveBeenCalledTimes(0);
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(utils.clearCanvas).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
