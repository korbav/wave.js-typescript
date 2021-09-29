export default class WaveJSStorage {
    private static _storage;
    static getStorage(): {
        [key: string]: any;
    };
    static has(key: string): boolean;
    static get<T>(key: string): T;
    static put<T>(key: string, value: T): T;
    static putIfUndefined<T>(key: string, value: T): T;
    static delete(key: string): void;
    static reset(): void;
}
