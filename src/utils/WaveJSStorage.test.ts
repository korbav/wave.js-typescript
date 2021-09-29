import WaveJSStorage from './WaveJSStorage';

describe('WaveJSStorage', () => {
  describe('Cache initialization', () => {
    it('should initialize a cache object', () => {
      expect(WaveJSStorage.getStorage()).toEqual({});
    });
  });

  describe('has', () => {
    it('should returns true if a key does exist in the cache', () => {
      WaveJSStorage.getStorage().some_key = 123;
      expect(WaveJSStorage.has('some_key')).toBe(true);
    });

    it('should returns false if a key does not exist in the cache', () => {
      expect(WaveJSStorage.has('some_unknown_key')).toBe(false);
    });
  });

  describe('put', () => {
    it('should store the expected key,value in the cache and return it', () => {
      const value = 123;

      const result = WaveJSStorage.put('some', value);

      expect(WaveJSStorage.getStorage().some).toEqual(123);
      expect(result).toEqual(123);
    });
  });

  describe('putIfUndefined', () => {
    it('should set the value associated to the key in the cache when the key does not already exist', () => {
      WaveJSStorage.putIfUndefined('name', 'Doe');
      expect(WaveJSStorage.getStorage().name).toEqual('Doe');
    });

    it('should not set the value associated to the key in the cache when the key does already exist', () => {
      WaveJSStorage.putIfUndefined('name', 'X');
      expect(WaveJSStorage.getStorage().name).toEqual('Doe');
    });
  });

  describe('get', () => {
    it('should retrieve the value associated to the key', () => {
      WaveJSStorage.getStorage().some_key = 123;
      expect(WaveJSStorage.get('some_key')).toEqual(123);
    });

    it('should return undefined when trying to access to a key that does not exist in the cache', () => {
      expect(WaveJSStorage.get('some_other_key')).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should remove a cache entry', () => {
      WaveJSStorage.getStorage().some_key = 123;
      WaveJSStorage.delete('some_key');
      expect(WaveJSStorage.getStorage().some_key).toBe(undefined);
    });
  });

  describe('reset', () => {
    it('should reset all the cache', () => {
      WaveJSStorage.getStorage().some_key = 123;
      WaveJSStorage.getStorage().some_other_key = 123;

      WaveJSStorage.reset();

      expect(WaveJSStorage.getStorage()).toEqual({});
    });
  });
});
