import 'audio-context-polyfill';
import fromElement from './handlers/from-element';
import fromFile from './handlers/from-file';
import fromStream from './handlers/from-stream';

export default {
  fromElement,
  fromFile,
  fromStream,
};

