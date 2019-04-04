export const injectConsole = () => {
  if (process.env.REACT_APP_ENV === 'production') {
    const log = require('electron-log')
    console.log = (...args: any[]) => {
      log.info('env:renderer', ...args)
    }
    console.debug = (...args: any[]) => {
      log.debug('env:renderer', ...args)
    }
    console.error = (...args: any[]) => {
      log.error('env:renderer', ...args)
    }
  }
}
