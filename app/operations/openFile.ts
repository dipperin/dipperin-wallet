import { shell } from 'electron'
import settings from 'electron-settings'
import os from 'os'
import path from 'path'

import dipperinPath from '../utils/dipperinPath'
import { getNodeEnv } from './runDipperin'

export const openTmp = () => {
  const net: string = settings.get('netEnv') as string
  const chainDataDir = path.join(os.homedir(), `tmp/dipperin_apps/${getNodeEnv(net)}/wallet`)
  const chainLogPath = `${chainDataDir}/dipperin.log`
  shell.showItemInFolder(chainLogPath)
}

export const openDipperin = () => {
  shell.showItemInFolder(dipperinPath())
}
