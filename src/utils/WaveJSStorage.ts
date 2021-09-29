import * as has from 'lodash/has';
import * as get from 'lodash/get';
import * as set from 'lodash/set';
import * as unset from 'lodash/unset';

export default class WaveJSStorage {
  private static  _storage: { [key: string]: any };

  static getStorage(): { [key: string]: any } {
    if (!WaveJSStorage._storage) {
      WaveJSStorage._storage = {};
    }
    return WaveJSStorage._storage;
  }

  static has(key: string): boolean {
    return has(WaveJSStorage.getStorage(), key);
  }

  static get<T>(key: string): T {
    return get(WaveJSStorage.getStorage(), key, undefined);
  }

  static put<T>(key: string, value: T): T {
    set(WaveJSStorage.getStorage(), key, value);
    return WaveJSStorage.get(key);
  }

  static putIfUndefined<T>(key: string, value: T): T {
    !WaveJSStorage.has(key) && WaveJSStorage.put(key, value);
    return WaveJSStorage.get(key);
  }

  static delete(key: string): void {
    unset(WaveJSStorage.getStorage(), key);
  }

  static reset(): void {
    WaveJSStorage._storage = {};
  }
}
