import { isFunction } from 'lodash'
import { observable } from 'mobx'
import { TIMET_NAME } from '@/utils/constants'

class TimerStore {
  @observable
  private _events: Map<string, any> = new Map()

  on(name: string, method: () => void, interval: number): void {
    if (!isFunction(method) || this._events.has(name)) {
      return
    }
    const timer = setInterval(method, interval)
    this._events.set(name, timer)
  }

  asyncOn(name: string, method: () => void, interval: number): void {
    if (!isFunction(method)) {
      return
    }
    let isRunning = false

    const run = async () => {
      if (isRunning) {
        return
      }
      isRunning = true
      await method()
      isRunning = false
    }
    const timer = setInterval(run, interval)
    this._events.set(name, timer)
  }

  off(name) {
    clearInterval(this._events.get(name)!)
    this._events.delete(name)
  }

  /**
   * stop update data
   */
  stopUpdate() {
    for (const timer of this._events.keys()) {
      if (timer !== TIMET_NAME.CONNECTING) {
        this.off(timer)
        this._events.delete(timer)
      }
    }
  }

  clear() {
    for (const timer of this._events.keys()) {
      this.off(timer)
    }
    this._events.clear()
  }
}

export default TimerStore
