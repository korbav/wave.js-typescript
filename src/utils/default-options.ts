import IWaveOptions from '../core/types/IWaveOptions';
import { initGlobalObject, setPropertyIfNotSet } from './index';
import Generator from '../core/Generator';

const defaultOptions: IWaveOptions = {
  stroke: 1,
  colors: ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"],
  type: Generator.BARS,
  globalAccessKey: '$wave',
  getGlobal: <T>(elementId: string, accessKey: string) => {
    const { globalAccessKey } = defaultOptions;
    initGlobalObject(elementId, globalAccessKey);
    return window[globalAccessKey][elementId][accessKey] as T;
  },
  setGlobal: <T>(elementId: string, accessKey: string, value: T) => {
    const globalAccessKey = defaultOptions.globalAccessKey;
    let returnValue: T = defaultOptions.getGlobal(elementId, accessKey);
    if (!returnValue) {
      setPropertyIfNotSet<any>(window[globalAccessKey][elementId], accessKey, value);
      returnValue = window[globalAccessKey][elementId][accessKey];
    }
    return returnValue as T;
  },
};

export default defaultOptions;
