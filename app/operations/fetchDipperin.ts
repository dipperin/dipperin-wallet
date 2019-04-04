import { app, BrowserWindow } from 'electron'
import { download } from 'electron-dl'
import log from 'electron-log'
import settings from 'electron-settings'
import fs from 'fs'
import util from 'util'

import packageJSON from '../../package.json'
import dipperinPath from '../utils/dipperinPath'
import handleError from './handleError'
import { getOs } from '../utils/dipperinPath'

const DOWNLOAD_PROGRESS = 'downloadProgress'

let isDownloading = false
let downloadItem: any

const fsChmod = util.promisify(fs.chmod)

const { version, server } = packageJSON.dipperin

const fetchDipperin = (mainWindow: BrowserWindow) => {
  log.info('Fetch Dipperin')
  log.info(`http://${server}/dipperin/${getOs()}/${version}/dipperin${getOs() === 'windows' ? '.exe' : ''}`)
  return download(
    mainWindow,
    `http://${server}/dipperin/${getOs()}/${version}/dipperin${getOs() === 'windows' ? '.exe' : ''}`,
    {
      directory: app.getPath('userData'),
      onProgress: (progress: number) => {
        mainWindow.webContents.send(DOWNLOAD_PROGRESS, progress)
      }, // Notify the renderers
      onStarted: item => {
        isDownloading = true
        downloadItem = item
      }
    }
  )
    .then(() => {
      fsChmod(dipperinPath(), '755')
      settings.set('version', version)
      isDownloading = false
    })
    .catch(err => {
      handleError(err, 'An error occured while fetching parity.')
    })
}

export const cancelDipperinDownload = () => {
  if (isDownloading) {
    if (downloadItem) {
      downloadItem.cancel()
    }
  }
}

export default fetchDipperin
