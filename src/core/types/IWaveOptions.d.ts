import Generator from '../Generator';
export default interface IWaveOptions {
    type?: Generator | Array<Generator>;
    colors?: Array<string>;
    stroke?: number;
    getAudioContext?: (elementId: string) => AudioContext;
    setAudioContext?: (elementId: string, ctx: AudioContext) => AudioContext;
}
