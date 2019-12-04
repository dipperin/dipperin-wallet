import { shell } from 'electron'
import settings from 'electron-settings'
import log from 'electron-log'
import os from 'os'
import path from 'path'
import fs from 'fs'
import fsExtra from 'fs-extra'
import util from 'util'

import dipperinPath from '../utils/dipperinPath'
import { getNodeEnv, CHAIN_DATA_DIR } from './runDipperin'

const fsExists = util.promisify(fs.stat)
const noop = () => null

export const openTmp = () => {
  const net: string = settings.get('netEnv') as string
  const appDir = settings.get(CHAIN_DATA_DIR) as string|undefined || path.join(os.homedir(), `tmp`, `dipperin_apps`)
  const chainDataDir =path.join(appDir, `${getNodeEnv(net)}`, `wallet`) 
  const chainLogPath = path.join(`${chainDataDir}`, `dipperin.log`)

  shell.showItemInFolder(chainLogPath)
}

export const openDipperin = () => {
  shell.showItemInFolder(dipperinPath())
}

export const deleteCSWallet = (net: string) => {
  const chainDataDir = path.join(os.homedir(), `tmp`, `dipperin_apps`, `${getNodeEnv(net)}`, `wallet`)
  const csWalletPath = path.join(`${chainDataDir}`, `CSWallet`)
  fsExists(csWalletPath)
    .then(() => {
      fsExtra.remove(csWalletPath)
    })
    .catch(noop)
}

export const getChainDataDir = () => {
  const net: string = settings.get('netEnv') as string
  const chainDataDir = path.join(os.homedir(), `tmp`, `dipperin_apps`, `${getNodeEnv(net)}`, `wallet`)
  return chainDataDir
}

/**
 * the function serves for the requirement that user need to change
 * @param oldPath
 * @param newPath
 */
export const moveFiles = (oldPath: string, newPath: string) => {
  fsExtra.move(oldPath, newPath, err => {
    if (err) {
      log.error(err)
    }
    log.info('move files success!')
  })
}


