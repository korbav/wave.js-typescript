import Processor from '../core/Processor';
import IWaveOptions from '../core/types/IWaveOptions';
import defaultOptions from '../utils/default-options';
import IFromElementOptions from '../core/types/IFromElementOptions';
import { checkGenerator } from '../utils';
import ElementNotFoundError from '../core/errors/ElementNotFoundError';
import CanvasNotFoundError from '../core/errors/CanvasNotFoundError';

export default function fromElement (
  elementOrElementId: HTMLAudioElement | string,
  canvasOrCanvasId: HTMLCanvasElement | string,
  options?: IWaveOptions,
  fromElementOptions?: IFromElementOptions
): { deactivate: () => void }  {
  const element: HTMLAudioElement = typeof elementOrElementId === 'string' ?
    <HTMLAudioElement>document.getElementById(elementOrElementId) : elementOrElementId;
  if (!element) {
    throw new ElementNotFoundError(typeof elementOrElementId === 'string' ? elementOrElementId : '');
  }

  const canvasElement: HTMLCanvasElement = typeof canvasOrCanvasId === 'string' ?
    <HTMLCanvasElement>document.getElementById(canvasOrCanvasId) : canvasOrCanvasId;
  if (!element) {
    throw new CanvasNotFoundError(typeof canvasOrCanvasId === 'string' ? canvasOrCanvasId : '');
  }
  element.crossOrigin = 'anonymous';

  const parsedOptions = {
    ...defaultOptions,
    ...(options || {}),
  };

  checkGenerator(parsedOptions.type);

  const parsedFromElementOptions = {
    connectDestination: true,
    skipUserEventsWatcher: false,
    existingMediaStreamSource: null,
    ...(fromElementOptions || {}),
  };

  const runner = new Processor(element, canvasElement.id, parsedOptions, parsedFromElementOptions);

  if (runner.isActivated() || parsedFromElementOptions.skipUserEventsWatcher) {
    runner.initialize();
  } else {
    runner.initializeAfterUserGesture();
  }

  return {
    deactivate: () => {
      runner.deactivate();
    }
  };
}
