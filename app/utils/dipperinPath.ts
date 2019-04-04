import { app } from 'electron'

// Get dipperin path
const dipperinPath = () => `${app.getPath('userData')}/dipperin${getOs() === 'windows' ? '.exe' : ''}`

export const getOs = () => {
    switch (process.platform) {
      case 'darwin':
        return 'darwin'
      case 'win32':
        return 'windows'
      default:
        return 'linux'
    }
  }

export default dipperinPath
