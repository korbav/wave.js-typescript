import IWaveOptions from '../core/types/IWaveOptions';
import Generator from '../core/Generator';
import WaveJSStorage from './WaveJSStorage';

const defaultOptions: IWaveOptions = {
  stroke: 1,
  colors: ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"],
  type: Generator.BARS,
  getSharedAudioContext: (elementId: string): AudioContext => {
    return WaveJSStorage.get(`${elementId}-audioCtx`);
  },
  setSharedAudioContext: (elementId: string, ctx: AudioContext): AudioContext => {
    return WaveJSStorage.put(`${elementId}-audioCtx`, ctx);
  },
};

export default defaultOptions;
