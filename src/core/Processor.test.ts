import Processor from './Processor';
import ElementNotFoundError from './errors/ElementNotFoundError';
import * as utils from '../utils/index';

jest.mock('./Visualizer');

const audioElement = {
  id: 'mock-audio',
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
};
const mockCanvas = {
  getContext: jest.fn().mockReturnValue({}),
  id: 'mock-canvas'
};
const mockElements = {
  'mock-audio': audioElement,
  'mock-canvas': mockCanvas,
}

const mockConnectOscillator = jest.fn();
const mockStartOscillator = jest.fn();
const mockStopOscillator = jest.fn();
const mockAudioCtxDestination = {};
const closeAudioContextMock = jest.fn().mockImplementation(() => null);

const createProcessor = (options = {existingMediaStreamSource: null}) => new Processor((audioElement as any), 'mock-canvas', {
  getSharedAudioContext: jest.fn(),
  setSharedAudioContext: jest.fn((elt, value) => value),
}, {
  existingMediaStreamSource: options.existingMediaStreamSource,
});


describe('Processor', () => {
  beforeEach(() => {
    const context = {
      close: jest.fn().mockReturnValue({
        then: closeAudioContextMock
      }),
      destination: mockAudioCtxDestination,
      connect: jest.fn(),
      createOscillator: () => ({
        connect: mockConnectOscillator,
        start: mockStartOscillator,
        stop: mockStopOscillator,
        frequency: {},
      }),
      createAnalyser: jest.fn().mockReturnValue({
        getByteFrequencyData: jest.fn().mockReturnValue(new Uint8Array())
      }),
    };
    context['createMediaElementSource'] = jest.fn().mockReturnValue({
      connect: jest.fn(),
      context
    });
    global.AudioContext = jest.fn().mockImplementation(() => {
      return context;
    });
  })


  const mockAudioElement = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  };

  it('should be deactivated by default', () => {
    const processor = new Processor((mockAudioElement as any), undefined, {}, {});
    expect(processor.isActivated()).toBe(false);
  });

  it('should set activated to true', () => {
    const processor = new Processor((mockAudioElement as any), undefined, {}, {});
    processor.activate();
    expect(processor.isActivated()).toBe(true);
  });

  it('should remove all event listeners during instantiation', () => {
    jest.spyOn(document.body, 'removeEventListener');

    const processor = new Processor((mockAudioElement as any), undefined, {}, {});

    expect(mockAudioElement.removeEventListener.mock.calls).toEqual([
      ['play', processor.initialize],
    ]);
    expect((document.body.removeEventListener as jest.Mock).mock.calls).toEqual([
      ['touchend', processor.initialize],
      ['mouseup', processor.initialize],
      ['click', processor.initialize],
    ]);
  });

  it('should connect a source to the given destination', () => {
    const mockSource = {connect: jest.fn()};
    const mockDestination = {};
    const processor = new Processor((mockAudioElement as any), undefined, {}, {});

    processor.connectSource(mockSource as any, mockDestination as any);

    expect(mockSource.connect).toHaveBeenCalledTimes(1);
    expect(mockSource.connect).toHaveBeenCalledWith(mockDestination);
  });

  describe('initialize', () => {
    beforeEach(() => {
      jest.spyOn(document, 'getElementById').mockImplementation((id) => mockElements[id]);
    })

    it('should activate the instance', () => {
      const processor = createProcessor();
      processor.initialize();
      expect(processor.isActivated()).toBe(true);
    });

    it('should process a beep test for iOS devices', () => {
      const processor = createProcessor();

      processor.initialize();

      expect(mockConnectOscillator).toHaveBeenCalledTimes(1);
      expect(mockConnectOscillator).toHaveBeenCalledWith(mockAudioCtxDestination);
      expect(mockStartOscillator).toHaveBeenCalledTimes(1);
      expect(mockStopOscillator).toHaveBeenCalledTimes(1);
    });

    it('should trigger connectSource with the right parameters', () => {
      jest.spyOn(Processor.prototype, 'connectSource').mockReturnValue(null);
      const processor = createProcessor();

      processor.initialize();

      expect(Processor.prototype.connectSource).toHaveBeenCalledTimes(1);
    });

    it('should trigger renderFrame', () => {
      jest.spyOn(Processor.prototype, 'renderFrame').mockReturnValue(null);
      const processor = createProcessor();

      processor.initialize();

      expect(Processor.prototype.renderFrame).toHaveBeenCalledTimes(1);
    });
  });

  describe('initializeAfterUserGesture', () => {
    it('should register the expected events listeners', () => {
      jest.spyOn(document.body, 'addEventListener');
      jest.spyOn(audioElement, 'addEventListener');
      const processor = createProcessor();
      const mockBind = {};
      jest.spyOn((processor.initialize as any), 'bind').mockReturnValue(mockBind);

      processor.initializeAfterUserGesture();

      expect((processor.initialize.bind as jest.Mock).mock.calls.filter(v => v.includes(processor)).length).toEqual(4);
      expect(processor.initialize.bind).toHaveBeenCalledTimes(4);
      expect(document.body.addEventListener).toHaveBeenCalledTimes(3);
      expect((document.body.addEventListener as jest.Mock).mock.calls).toEqual([
        ['touchend', mockBind, {once: true}],
        ['mouseup', mockBind, {once: true}],
        ['click', mockBind, {once: true}],
      ]);
      expect(audioElement.addEventListener).toHaveBeenCalledTimes(1);
      expect(audioElement.addEventListener).toHaveBeenCalledWith('play', mockBind, {once: true});
    });

    describe('renderFrame', () => {
      it('should trigger an ElementNotFoundError if the canvas element is not found', () => {
        const processor = Object.assign(createProcessor(), {activeCanvas: {['mock-canvas']: '{}'}});
        processor.activate();

        jest.spyOn(document, 'getElementById').mockImplementationOnce(() => undefined);

        expect(() => processor.renderFrame()).toThrow((ElementNotFoundError as any).default);
      });

      it('should use existingMediaStreamSource if passed in the options', () => {
        jest.spyOn(document, 'getElementById')
          .mockImplementationOnce(() => audioElement as any)
          .mockImplementationOnce(() => mockCanvas as any)
        const analyzer = {};
        const mockAnalyzer = jest.fn().mockImplementation(() => analyzer);
        const mockSourceConnect = jest.fn();
        const mockOscillatorConnect = jest.fn();
        const mockSource = {
          connect: mockSourceConnect,
          context: {
            createAnalyser: mockAnalyzer,
            createOscillator: jest.fn().mockReturnValue({
              connect: mockOscillatorConnect,
              start: () => null,
              stop: () => null,
              frequency: {},
            }),
            destination: {},
          }
        };
        const processor = createProcessor({existingMediaStreamSource: mockSource});
        jest.spyOn(processor, 'renderFrame').mockImplementation();
        jest.spyOn(processor, 'connectSource');
        processor.initialize();


        expect(mockOscillatorConnect).toHaveBeenCalledTimes(1);
        expect(mockSource.context.createAnalyser).toHaveBeenCalledTimes(1);
        expect(mockSource.context.createOscillator).toHaveBeenCalledTimes(1);
        expect(mockSourceConnect).toHaveBeenCalledTimes(1);
        expect(processor.connectSource).toHaveBeenCalledTimes(1);
        expect((processor.connectSource as jest.Mock).mock.calls).toEqual([
          [mockSource, analyzer]
        ]);
      });
    });
  });

  it('should close the audioContext when deactivating', () => {
    jest.spyOn(document, 'getElementById').mockImplementation((id) => mockElements[id]);
    jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(() => null);
    const processor = createProcessor();
    processor.initialize();
    processor.deactivate();

    expect(closeAudioContextMock).toHaveBeenCalledTimes(1);
    expect(utils.clearCanvas).toHaveBeenCalledTimes(1);
  });

  it('should not close the audioContext when it comes from an existing external source', () => {
    jest.spyOn(utils, 'clearCanvas').mockImplementationOnce(() => null);
    const mockSource = {
      connect: () => null,
      context: {
        close: closeAudioContextMock,
        createAnalyser: () => ({
          getByteFrequencyData: () => [],
        }),
        createOscillator: () => ({
          connect: () => null,
          start: () => null,
          stop: () => null,
          frequency: {},
        }),
        destination: {},
      }
    };
    jest.spyOn(document, 'getElementById').mockImplementation((id) => mockElements[id]);
    const processor = createProcessor({existingMediaStreamSource: mockSource});
    processor.initialize();
    processor.deactivate();

    expect(closeAudioContextMock).toHaveBeenCalledTimes(0);
  });
});
