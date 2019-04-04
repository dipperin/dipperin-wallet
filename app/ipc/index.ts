import { BrowserWindow, Event, ipcMain } from 'electron'
import log from 'electron-log'
import settings from 'electron-settings'

import packageJSON from '../../package.json'
import doesDipperinExist from '../operations/doesDipperinExist'
import fetchDipperin from '../operations/fetchDipperin'
import handleError from '../operations/handleError'
import { openDipperin, openTmp } from '../operations/openFile'
import { killDipperin, runDipperin } from '../operations/runDipperin'
import updateDipperin from '../operations/updateDipperin'

const UPDATE_VERSION = 'updateVersion'
const UPDATE_NODE = 'updateNode'
const SET_NODE_NET = 'setNodeNet'
const NODE_RESTART_SUCCESS = 'nodeRestartSuccess'

const OPEN_TMP = 'openTmp'
const OPEN_DIPPERIN = 'openDipperin'

const UPDATED = 'updated'
const DOWNLOADING = 'downloading'
const RUNNING = 'running'
const SET_NET = 'setNet'

// start/stop node
const START_NODE = 'startNode'
const STOP_NODE = 'stopNode'
export const START_SUCCESS = 'startSucces'

const initIPC = (mainWindow: BrowserWindow) => {
  // Check dipperin version and update
  ipcMain.on(UPDATE_VERSION, async (event: Event) => {
    await handleUpdateVersion(event, mainWindow)
  })

  // Update dipperin version
  ipcMain.on(UPDATE_NODE, async (event: Event) => {
    await handleUpdateDepperin(event, mainWindow)
  })

  // Set node net
  ipcMain.on(SET_NODE_NET, async (event: Event, netEnv: string) => {
    log.info(`change type ${netEnv}`)
    await handleUpdateNodeType(event, netEnv, mainWindow)
  })

  // Open file
  ipcMain.on(OPEN_TMP, openTmp)
  ipcMain.on(OPEN_DIPPERIN, openDipperin)

  ipcMain.on(START_NODE, () => {
    log.info('start node')
    runDipperin(settings.get('netEnv') as string, mainWindow)
  })

  ipcMain.on(STOP_NODE, () => {
    log.info('stop node')
    killDipperin()
  })
}

// Update node version
const handleUpdateDepperin = async (event: Event, mainWindow: BrowserWindow) => {
  log.info('Update dipperin')
  await killDipperin()
  await updateDipperin(mainWindow)
  await runDipperin(settings.get('netEnv') as string, mainWindow)
  event.sender.send(NODE_RESTART_SUCCESS, UPDATED)
}

// Update version
const handleUpdateVersion = async (event: Event, mainWindow: BrowserWindow) => {
  try {
    const preDepperinVersion = settings.get('version')
    const isExist = await doesDipperinExist()

    if (!isExist) {
      event.sender.send(UPDATE_VERSION, DOWNLOADING)
      await fetchDipperin(mainWindow)
    } else {
      if (preDepperinVersion !== packageJSON.dipperin.version) {
        event.sender.send(UPDATE_VERSION, UPDATED)
        await updateDipperin(mainWindow)
      }
    }

    await runDipperin(settings.get('netEnv') as string, mainWindow)
    event.sender.send(UPDATE_VERSION, RUNNING)
  } catch (err) {
    handleError(err)
  }
}

// Set node net
const handleUpdateNodeType = async (event, netEnv, mainWindow) => {
  settings.set('netEnv', netEnv)
  await killDipperin()
  await runDipperin(netEnv, mainWindow)
  event.sender.send(NODE_RESTART_SUCCESS, SET_NET)
}

export default initIPC
