import Generator from '../Generator';
export default interface IWaveOptions {
    type?: Generator | Array<Generator>;
    colors?: Array<string>;
    stroke?: number;
    globalAccessKey?: string;
    getGlobal?: any;
    setGlobal?: any;
}
