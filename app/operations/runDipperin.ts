import { BrowserWindow } from 'electron'
import { ChildProcess, spawn } from 'child_process'
import log from 'electron-log'
import fs from 'fs'
import fsExtra from 'fs-extra'
import os from 'os'
import path from 'path'
import util from 'util'

import dipperinPath from '../utils/dipperinPath'
import handleError from './handleError'
import { START_SUCCESS } from '../ipc';

export const DEFAULT_NET = 'mercury'

const fsChmod = util.promisify(fs.chmod)
const fsExists = util.promisify(fs.stat)
const noop = () => null

let dipperin: ChildProcess

const MAX_LOG_SIZE = 100 * 1024 * 1024

export const runDipperin = (net: string, mainWindow: BrowserWindow) => {
  log.info('running net:', getNodeEnv(net))
  // Create a logStream to save logs
  const chainDataDir = path.join(os.homedir(), `tmp`,`dipperin_apps`,`${getNodeEnv(net)}`,`wallet`)
  const chainLogPath = path.join(`${chainDataDir}`,`dipperin.log`)

  if (dipperin) {
    return
  }
  return fsExists(chainLogPath)
    .then(() => {
      const logStats = fs.statSync(chainLogPath)
      log.info('Chain log size', logStats.size)
      if (logStats.size > MAX_LOG_SIZE) {
        return fsExtra.remove(chainLogPath)
      }
      return
    })
    .catch(noop)
    .then(() => fsChmod(dipperinPath(), '755')) // Should already be 755 after download, just to be sure
    .then(() => {
      log.info('dipperinPath:', dipperinPath())
      log.info('chainDataDir:', chainDataDir)
      dipperin = spawn(
        dipperinPath(),
        [
          '--node_name',
          'dipperin-wallet',
          '--data_dir',
          chainDataDir,
          '--node_type',
          '0',
          '--p2p_listener',
          ':60619',
          '--http_port',
          '7783',
          '--ws_port',
          '8893',
          '--log_level',
          'info',
          '--debug_mode',
          '0',
          '--is_scanner',
          '0',
          '--is_upload_node_data',
          '0',
          '--allow_hosts',
          process.env.NODE_ENV === 'development' ? '*' : 'localhost'
        ],
        {
          env: {
            boots_env: getNodeEnv(net)
          }
        }
      )

      dipperin.on('error', err => {
        handleError(err, 'An error occured while running Dipperin.')
      })

      dipperin.on('close', exitCode => {
        log.info('close', exitCode)
        // null || 0
        if (!exitCode) {
          return
        } else {
          handleError({message: 'dipperin node closed'}, 'An error occured while running Dipperin.')
          // mainWindow.close()
        }
      })
    })
    .then(() => fsExtra.ensureDir(chainDataDir))
    .then(() => {
      // send start success ipc
      mainWindow.webContents.send(START_SUCCESS) 
      // Write to Dipperin log file
      const logStream = fs.createWriteStream(chainLogPath, { flags: 'a+' })

      dipperin.stdout.pipe(logStream)
      dipperin.stderr.pipe(logStream)
    })
    .catch(err => {
      handleError(err, 'An error occured while running Dipperin.')
    })
}
export const killDipperin = async () => {
  if (dipperin) {
    log.info('Stopping Dipperin.')
    dipperin.stdin.end()
    dipperin.kill('SIGKILL')
    ;(dipperin as any) = null
  }
}

export const getNodeEnv = (net: string): string => {
  return net || DEFAULT_NET
}
