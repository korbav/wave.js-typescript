import { checkGenerator, setPropertyIfNotSet, clearCanvas } from './index';
import InvalidGeneratorError from '../core/errors/InvalidGeneratorError';

describe('utils', () => {
  describe('setPropertyIfNotSet', () => {
    it('should set the property to a default value, if not already set', () => {
      const someObject: any = {};
      setPropertyIfNotSet<any>(someObject, 'some-property', 'val');
      expect(someObject['some-property']).toEqual('val');
    });

    it('should not override the property if it\'s already set', () => {
      const someObject: any = {
        'some-property': 123,
      };

      setPropertyIfNotSet<any>(someObject, 'some-property', 456);

      expect(someObject['some-property']).toEqual(123);
    });
  });

  describe('checkGenerator', () => {
    it('should throw an error if the generator name is not expected', () => {
      expect(() => {
        checkGenerator('bad name');
      }).toThrow((InvalidGeneratorError as any).default);
    });

    it('should throw an error if any of the generators names passed in an array is not expected', () => {
      expect(() => {
        checkGenerator(['bars', 'bad name']);
      }).toThrow((InvalidGeneratorError as any).default);
    });

    it('should not throw an error if the generator name exists', () => {
      expect(() => checkGenerator('bars')).not.toThrow();
    });

    it('should not throw an error if all the generators names passed in an array exist', () => {
      expect(() => checkGenerator(['ring', 'flower'])).not.toThrow();
    });
  });

  describe('clearCanvas', () => {
    it('should clear the canvas', () => {
      const mockContext = {
        clearRect: jest.fn(),
      };
      const canvas = {
        getContext: jest.fn().mockImplementation(() => mockContext),
        width: 123,
        height: 456
      };

      clearCanvas(canvas as unknown as HTMLCanvasElement);

      expect(mockContext.clearRect).toHaveBeenCalledTimes(1);
      expect(mockContext.clearRect).toHaveBeenCalledWith(0, 0, 123, 456);
    });

    it('should ignore without throwing an error if the canvas is not defined', () => {
      expect(() => clearCanvas(null)).not.toThrow()
    });
  });
});
