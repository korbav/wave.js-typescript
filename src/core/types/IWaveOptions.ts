import Generator from '../Generator';

export default interface IWaveOptions {
  colors?: Array<string>,
  stroke?: number,
  type?: Generator | Array<Generator>,
  getAudioContext?: (elementId: string) => AudioContext, // To pick an external existing public shared context
  setAudioContext?: (elementId: string, ctx: AudioContext) => AudioContext, // To set an external public shared context
}
