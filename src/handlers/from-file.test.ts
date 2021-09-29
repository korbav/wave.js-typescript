import fromFile from '../../src/handlers/from-file';
import Generator from '../core/Generator';
import { checkGenerator } from '../utils';
import visualize from '../core/Visualizer';
import * as utils from '../utils/index';

jest.mock('../core/Visualizer');
jest.mock('../../src/core/Processor');
jest.mock('../utils');

const closeMock = jest.fn().mockImplementation(() => null);


const originalGlobalAudio = global.Audio;
const audioEventListenerMock = jest.fn().mockImplementation(() => null);
const audioPlayListenerMock = jest.fn();

describe('from file', () => {
  beforeEach(() => {
    global.AudioContext = jest.fn().mockImplementation(() => ({
      close: jest.fn().mockReturnValue({
        then: closeMock
      }),
      connect: jest.fn(),
      createAnalyser: jest.fn().mockReturnValue({
        getByteFrequencyData: jest.fn().mockReturnValue(new Uint8Array())
      }),
      createMediaElementSource: jest.fn().mockReturnValue({connect: jest.fn()}),
    }as any));

    global.Audio = jest.fn().mockImplementation(() => ({
      addEventListener: audioEventListenerMock,
      play: audioPlayListenerMock,
      currentTime: 200,
      duration: 200,
    }));
    jest.useFakeTimers();
  });

  afterEach(() => {
    global.Audio = originalGlobalAudio;
    jest.useRealTimers();
  });

  it('should check the type of the generator', () => {
    fromFile('mock-file.mp3', {type: Generator.BARS}, {callback: () => null});

    expect(checkGenerator).toHaveBeenCalledTimes(1);
    expect(checkGenerator).toHaveBeenCalledWith('bars');
  });

  it('should create an audio element and register the right listeners to it', () => {
    fromFile('mock-file.mp3', {type: Generator.BARS}, {callback: () => null});

    expect(Audio).toHaveBeenCalledTimes(1);
    expect(Audio).toHaveBeenCalledWith('mock-file.mp3');
    expect(audioEventListenerMock).toHaveBeenCalledTimes(3);
    expect(audioEventListenerMock.mock.calls).toEqual([
      ['loadedmetadata', expect.any(Function)],
      ['play', expect.any(Function)],
      ['ended', expect.any(Function)],
    ]);
  });

  it('should deactivate the handler', () => {
    const audioElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    jest.spyOn(global, 'Audio').mockImplementationOnce(() => audioElement as any);
    jest.spyOn(global, 'clearInterval');
    jest.spyOn(document, 'createElement').mockImplementationOnce((): any => ({
      toDataURL: jest.fn(),
    }));
    jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(() => null);

    const {deactivate} = fromFile('mock-file.mp3', {type: Generator.BARS}, {callback: () => null});
    deactivate();

    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(audioElement.removeEventListener).toHaveBeenCalledTimes(2);
    expect(audioElement.removeEventListener.mock.calls).toEqual([
      ['play', expect.any(Function)],
      ['ended', expect.any(Function)],
    ]);
    expect(closeMock).toHaveBeenCalledTimes(1);
    expect(utils.clearCanvas).toHaveBeenCalledTimes(1);
  });

  it('should automatically trigger the play method of the audio object when the meta data has been loaded', () => {
    const onPlay = jest.fn().mockResolvedValue(null);
    const triggers = {};
    global.Audio = jest.fn().mockImplementation(() => ({
      play: onPlay,
      addEventListener: (event, callback) => {
        triggers[event] = callback;
      }
    }));

    fromFile('mock-file.mp3', {type: Generator.BARS}, {callback: () => null});
    triggers['loadedmetadata']();

    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it('should call visualize and the user callback regularly in accordance with the drawRate option', () => {
    const drawRate = 50;
    const images = [
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
    ];
    let imageIndex = 0;
    const fakeCanvas = <HTMLElement><unknown>{
      toDataURL: () => images[imageIndex++],
    };
    jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
    const callback = jest.fn();
    const onPlay = jest.fn().mockResolvedValue(null);
    const triggers = {};
    global.Audio = jest.fn().mockImplementation(() => ({
      play: onPlay,
      addEventListener: (event, callback) => {
        triggers[event] = callback;
      }
    }));

    fromFile('mock-file.mp3', {
      type: Generator.BARS,
      colors: ['red', 'green', 'blue'],
    }, {
      callback,
      drawRate,
      height: 100,
      width: 100,
    });
    triggers['play']();
    jest.advanceTimersByTime(drawRate * 2);
    triggers['ended']();

    expect(visualize).toHaveBeenCalledTimes(2);
    expect((visualize as jest.Mock).mock.calls).toEqual(
      [
        [expect.any(Uint8Array), fakeCanvas, {
          type: 'bars',
          stroke: 1,
          colors: ['red', 'green', 'blue'],
          getAudioContext: expect.any(Function),
          setAudioContext: expect.any(Function),
        }, 1],
        [expect.any(Uint8Array), fakeCanvas, {
          type: 'bars',
          stroke: 1,
          colors: ['red', 'green', 'blue'],
          getAudioContext: expect.any(Function),
          setAudioContext: expect.any(Function),
        }, 2],
      ]
    );
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback.mock.calls).toEqual([
      ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='],
      ['data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg=='],
    ]);
  });

  it('should use window\'s dimensions by default', () => {
    const drawRate = 50;
    const widthSetter = jest.fn();
    const heightSetter = jest.fn();
    const fakeCanvas = <HTMLElement><unknown>{
      toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      set width(val) {
        widthSetter(val);
      },
      set height(val) {
        heightSetter(val);
      }
    };
    jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
    Object.defineProperty(window, 'innerWidth', {writable: true, configurable: true, value: 123})
    Object.defineProperty(window, 'innerHeight', {writable: true, configurable: true, value: 456})
    const callback = jest.fn();
    const onPlay = jest.fn().mockResolvedValue(null);
    const triggers = {};
    global.Audio = jest.fn().mockImplementation(() => ({
      play: onPlay,
      addEventListener: (event, callback) => {
        triggers[event] = callback;
      }
    }));

    fromFile('mock-file.mp3', {}, {callback, drawRate});
    triggers['play']();
    jest.advanceTimersByTime(drawRate);
    triggers['ended']();

    expect(widthSetter).toHaveBeenCalledTimes(1);
    expect(widthSetter).toHaveBeenCalledWith(123);
    expect(heightSetter).toHaveBeenCalledTimes(1);
    expect(heightSetter).toHaveBeenCalledWith(456);
  });

  it('should use specified size if any', () => {
    const drawRate = 50;
    const widthSetter = jest.fn();
    const heightSetter = jest.fn();
    const fakeCanvas = <HTMLElement><unknown>{
      toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
      set width(val) {
        widthSetter(val);
      },
      set height(val) {
        heightSetter(val);
      }
    };
    jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
    const callback = jest.fn();
    const triggers = {};
    global.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockResolvedValue(null),
      addEventListener: (event, callback) => {
        triggers[event] = callback;
      }
    }));

    fromFile('mock-file.mp3', {}, {callback, drawRate, width: 400, height: 200});
    triggers['play']();
    jest.advanceTimersByTime(drawRate);
    triggers['ended']();

    expect(widthSetter).toHaveBeenCalledTimes(1);
    expect(widthSetter).toHaveBeenCalledWith(400);
    expect(heightSetter).toHaveBeenCalledTimes(1);
    expect(heightSetter).toHaveBeenCalledWith(200);
  });

  it('should stop the drawing timer when the played file is ending', () => {
    const drawRate = 100;
    const fakeCanvas = <HTMLElement><unknown>{
      toDataURL: () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==',
    };
    jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
    const callback = jest.fn();
    const triggers = {};
    global.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockResolvedValue(null),
      addEventListener: (event, callback) => {
        triggers[event] = callback;
      }
    }));
    expect(visualize).toHaveBeenCalledTimes(0);

    fromFile('mock-file.mp3', {}, {drawRate, callback});
    triggers['play']();
    jest.advanceTimersByTime(drawRate);
    triggers['ended']();
    jest.advanceTimersByTime(drawRate * 50);

    expect(visualize).toHaveBeenCalledTimes(1);
  });

  it('should use the image/png format by default', () => {
    const drawRate = 100;
    const toDataURL = jest.fn().mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
    const fakeCanvas = <HTMLElement><unknown>{
      toDataURL
    };
    jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
    const callback = jest.fn();
    const triggers = {};
    global.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockResolvedValue(null),
      addEventListener: (event, callback) => {
        triggers[event] = callback;
      }
    }));
    expect(visualize).toHaveBeenCalledTimes(0);

    fromFile('mock-file.mp3', {}, {drawRate, callback});
    triggers['play']();
    jest.advanceTimersByTime(drawRate);
    triggers['ended']();

    expect(toDataURL).toHaveBeenCalledTimes(1);
    expect(toDataURL).toHaveBeenCalledWith('image/png');
  });

  it('should use the specified format if option is passed', () => {
    const drawRate = 100;
    const toDataURL = jest.fn().mockReturnValue('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==');
    const fakeCanvas = <HTMLElement><unknown>{
      toDataURL
    };
    jest.spyOn(document, 'createElement').mockReturnValue(fakeCanvas);
    const callback = jest.fn();
    const triggers = {};
    global.Audio = jest.fn().mockImplementation(() => ({
      play: jest.fn().mockResolvedValue(null),
      addEventListener: (event, callback) => {
        triggers[event] = callback;
      }
    }));
    expect(visualize).toHaveBeenCalledTimes(0);

    fromFile('mock-file.mp3', {}, {drawRate, callback, format: 'jpeg'});
    triggers['play']();
    jest.advanceTimersByTime(drawRate);
    triggers['ended']();

    expect(toDataURL).toHaveBeenCalledTimes(1);
    expect(toDataURL).toHaveBeenCalledWith('image/jpeg');
  });
});
