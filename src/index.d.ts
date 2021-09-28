import 'audio-context-polyfill';
import fromElement from './handlers/from-element';
import fromFile from './handlers/from-file';
import fromStream from './handlers/from-stream';
declare const _default: {
    fromElement: typeof fromElement;
    fromFile: typeof fromFile;
    fromStream: typeof fromStream;
};
export default _default;
