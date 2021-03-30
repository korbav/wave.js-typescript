import { JSDOM } from 'jsdom';

const dom = new JSDOM('', {url: 'https://localhost'});
global['document'] = dom.window.document;
global['window'] = dom.window;
global['requestAnimationFrame'] = jest.fn().mockReturnValue(123);
global['cancelAnimationFrame'] = jest.fn();

