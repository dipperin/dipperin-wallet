import settings from 'electron-settings'

export const get = (key: string) => {
  if (process.env.REACT_APP_ENV === 'test') {
    return localStorage.getItem(key)
  }
  return settings.get(key)
}

export const set = (key: string, value: any) => {
  if (process.env.REACT_APP_ENV === 'test') {
    localStorage.setItem(key, value)
    return
  }
  settings.set(key, value)
}

export default {
  get,
  set
}
