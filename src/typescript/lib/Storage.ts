export enum StorageKey {
  notifiedIntro = 'notifiedIntro',
  notifiedWavePlay = 'notifiedWavePlay',
  notifiedSidebarOpen = 'notifiedSidebarOpen',
}

const LS_KEY = 'synthia-storage';

export const Storage = new class {

  private _data: {[key in StorageKey]: any};

  constructor() {
    const data = localStorage.getItem(LS_KEY);
    this._data = data ? JSON.parse(data) : {};
  }


  set(key: StorageKey, value: any) {
    this._data[key] = value;
    localStorage.setItem(LS_KEY, JSON.stringify(this._data));
  }

  get(key: StorageKey) {
    return this._data[key];
  }
}()
