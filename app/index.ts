// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.
import { app, BrowserWindow, globalShortcut, Menu } from 'electron'
import contextMenu from 'electron-context-menu'
import log from 'electron-log'
import path from 'path'

import setEnv from './helpers/setEnv'
import createWindow from './helpers/window'
import initIPC from './ipc'
import { macTemplate } from './menu/dev_menu_template'
import { cancelDipperinDownload } from './operations/fetchDipperin'
import handleError from './operations/handleError'
import { killDipperin } from './operations/runDipperin'
import getStartURL, { getSplashScreenURL } from './utils/getStartUrl'

const env = process.env.NODE_ENV

if (!['darwin', 'win32'].includes(process.platform)) {
  app.disableHardwareAcceleration()
}

// Set context menu
contextMenu()

// Get application lock
const gotTheLock = app.requestSingleInstanceLock()
let mainWindow: BrowserWindow

if (!gotTheLock) {
  // If the lock is not obtained, exit the program
  app.quit()
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
    }
  })

  app.on('ready', async () => {
    // Set application env
    setEnv(env!)

    if (process.platform === 'darwin') {
      Menu.setApplicationMenu(Menu.buildFromTemplate(macTemplate))
    } else {
      Menu.setApplicationMenu(null)
    }
    
    createMainWindow()
    // init IPC
    initIPC(mainWindow)
  })
}

const createMainWindow = () => {
  mainWindow = createWindow('main', {
    // frame: false,
    height: 608,
    resizable: false,
    show: false,
    // useContentSize: true,
    width: 1080,
    webPreferences: {webSecurity: false},
    icon: path.join(__dirname, 'icons/512.png')
    // transparent: true,
    // titleBarStyle: 'customButtonsOnHover'
  })

  let splashScreenWindow: BrowserWindow

  // Hack splash screen
  setTimeout(() => {
    splashScreenWindow = new BrowserWindow({
      height: 600,
      width: 800,
      resizable: false,
      show: true,
      center: true,
      transparent: true,
      frame: false,
      useContentSize: true,
      modal: true,
      webPreferences: {webSecurity: false},
      icon: path.join(__dirname, 'icons/512.png')
    })

    splashScreenWindow.loadURL(getSplashScreenURL(env, process.env.IS_MAIN))

    splashScreenWindow.webContents.on('did-finish-load', () => {
      mainWindow.loadURL(getStartURL(env, process.env.IS_MAIN))
    })
  }, 100)

  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined')
    }

    if (!splashScreenWindow.isDestroyed()) {
      splashScreenWindow.close()
    }

    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.webContents.on('crashed', err => {
    log.error(err)
    handleError(err)
  })

  mainWindow.on('unresponsive', err => {
    log.error(err)
    handleError(err)
  })

  mainWindow.on('closed', () => {
    log.info('main window are closed')
    ;(mainWindow as any) = null
  })

  globalShortcut.register('f12', () => {
    mainWindow.webContents.openDevTools()
  })
}

app.on('window-all-closed', () => {
  cancelDipperinDownload()
  log.info('window all closed')
  if (env !== 'test') {
    killDipperin()
  }
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (env === 'production') {
    if (mainWindow === null) {
      createMainWindow()
    }
  }
})
