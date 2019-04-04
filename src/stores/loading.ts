import { observable, action, computed } from 'mobx'

class LoadingStore {
  @observable
  private _load: boolean = false
  // downloading node
  @observable
  private _downloading: boolean = false

  set downloading(flag: boolean) {
    this._downloading = flag
  }

  @computed
  get downloading(): boolean {
    return this._downloading
  }

  @computed
  get load(): boolean {
    return this._load
  }

  set load(flag: boolean) {
    this._load = flag
  }

  @action
  start() {
    this._load = true
  }

  @action
  stop() {
    this._load = false
  }
}

export default LoadingStore
