import Generator from '../Generator';

export default interface IWaveOptions {
  type?: Generator | Array<Generator>,
  colors?: Array<string>,
  stroke?: number,
  getSharedAudioContext?: (elementId: string) => AudioContext,
  setSharedAudioContext?: (elementId: string, ctx: AudioContext) => AudioContext,
}
