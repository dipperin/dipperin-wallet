import { BrowserWindow } from 'electron'
import log from 'electron-log'

import dipperinPath from '../utils/dipperinPath'
import fetchDipperin from './fetchDipperin'

const updateDipperin = async (mainWindow: BrowserWindow) => {
  const fs = require('fs')
  await fs.unlink(dipperinPath(), () => {
    log.info('Removed dipperin')
  })
  await fetchDipperin(mainWindow)
}

export default updateDipperin
