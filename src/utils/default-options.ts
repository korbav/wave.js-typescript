import IWaveOptions from '../core/types/IWaveOptions';
import Generator from '../core/Generator';
import WaveJSStorage from './WaveJSStorage';

const defaultOptions: IWaveOptions = {
  colors: ["#d92027", "#ff9234", "#ffcd3c", "#35d0ba"],
  stroke: 1,
  type: Generator.BARS,
  getAudioContext: (eltId: string): AudioContext => WaveJSStorage.get(`${eltId}-audioCtx`),
  setAudioContext: (eltId: string, ctx: AudioContext): AudioContext => WaveJSStorage.put(`${eltId}-audioCtx`, ctx),
};

export default defaultOptions;
