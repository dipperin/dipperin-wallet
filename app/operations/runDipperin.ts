import { BrowserWindow } from 'electron'
import settings from 'electron-settings'
import { ChildProcess, spawn } from 'child_process'
import log from 'electron-log'
import fs from 'fs'
import fsExtra from 'fs-extra'
import os from 'os'
import path from 'path'
import util from 'util'
import lnet from 'net'

import dipperinPath from '../utils/dipperinPath'
import handleError from './handleError'
import { START_MINER_NODE_FAILURE, START_NODE_FAILURE, START_MINER_NODE_SUCCESS, START_SUCCESS } from '../ipc'
import { getOs } from '../utils/dipperinPath'

export const DEFAULT_NET = 'venus'
export const CHAIN_DATA_DIR = 'chainDataDir'

const fsChmod = util.promisify(fs.chmod)
const fsExists = util.promisify(fs.stat)
const noop = () => null

let dipperin: ChildProcess
let dipperinIpcPath: string

const MAX_LOG_SIZE = 100 * 1024 * 1024

interface DipperinOpt {
  chainDataDir: string
}

export const runDipperin = (net: string, mainWindow: BrowserWindow, opt?: DipperinOpt) => {
  let chainDataDir: string
  if (opt) {
    chainDataDir = path.join(opt.chainDataDir, `${getNodeEnv(net)}`, `wallet`)
  } else {
    const appDir = settings.get(CHAIN_DATA_DIR) as string|undefined || path.join(os.homedir(), `tmp`, `dipperin_apps`)
    chainDataDir =path.join(appDir, `${getNodeEnv(net)}`, `wallet`) 
  }
  log.info('running net:', getNodeEnv(net))
  // Create a logStream to save logs
  // chainDataDir = path.join(os.homedir(), `tmp`, `dipperin_apps`, `${getNodeEnv(net)}`, `wallet`)
  const chainLogPath = path.join(chainDataDir, `dipperin.log`)
  const chainIpcPath = path.join(chainDataDir, `dipperin.ipc`)

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
          '--node_name=dipperin-wallet',
          `--data_dir=${chainDataDir}`,
          `--ipc_path=${chainIpcPath}`,
          '--node_type=1',
          `--no_wallet_start=true`,
          `--is_start_mine=0`,
          '--p2p_listener=:60619',
          '--http_port=7783',
          '--ws_port=8893',
          '--log_level=info',
          '--debug_mode=0',
          '--is_scanner=0',
          '--is_upload_node_data=0',
          `--allow_hosts=${process.env.NODE_ENV === 'development' ? '*' : 'localhost'}`
        ],
        {
          env: {
            boots_env: getNodeEnv(net)
          }
        }
      )

      dipperin.on('error', err => {
        log.info('dipperin error', err)
        // comment the following code to avoid user quit mainWindow unexportedly
        handleError(err, 'An error occured while running Dipperin.')
      })

      dipperin.on('close', exitCode => {
        log.info('close', exitCode)
        // null || 0
        if (!exitCode) {
          return
        } else {
          // comment the following code to avoid user quit mainWindow unexportedly
          handleError({message: 'dipperin node closed'}, 'An error occured while running Dipperin.')
          // The following line is history code
          // mainWindow.close()
        }
      })

      dipperinIpcPath = chainIpcPath
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
      mainWindow.webContents.send(START_NODE_FAILURE)
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

// ! to delete
export const runDipperinMiner = (net: string, mainWindow: BrowserWindow) => {
  log.info('running net:', getNodeEnv(net))
  // Create a logStream to save logs
  const chainDataDir = path.join(os.homedir(), `tmp`, `dipperin_apps`, `${getNodeEnv(net)}`, `wallet`)
  const chainLogPath = path.join(`${chainDataDir}`, `dipperin.log`)
  // FIXME: maybe delete later
  const minerCSWallet = path.join(chainDataDir, `CSWallet`)

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
          '--node_name=dipperin-wallet',
          `--data_dir=${chainDataDir}`,
          '--node_type=1',
          '--p2p_listener=:60619',
          '--http_port=7783',
          '--ws_port=8893',
          '--log_level=info',
          '--debug_mode=0',
          '--is_scanner=0',
          '--is_upload_node_data=0',
          `--allow_hosts=${process.env.NODE_ENV === 'development' ? '*' : 'localhost'}`,
          `--no_wallet_start=false`,
          `--soft_wallet_pwd=123`,
          `--soft_wallet_path=${minerCSWallet}`
        ],
        {
          env: {
            boots_env: getNodeEnv(net)
          }
        }
      )

      dipperin.on('error', err => {
        log.info('dipperin error', err)
        // comment the following code to avoid user quit mainWindow unexportedly
        handleError(err, 'An error occured while running Dipperin.')
      })

      dipperin.on('close', exitCode => {
        log.info('close', exitCode)
        // null || 0
        if (!exitCode) {
          return
        } else {
          // comment the following code to avoid user quit mainWindow unexportedly
          handleError({message: 'dipperin node closed'}, 'An error occured while running Dipperin.')
          // The following line is history code
          // mainWindow.close()
        }
      })
    })
    .then(() => fsExtra.ensureDir(chainDataDir))
    .then(() => {
      // send start success ipc
      mainWindow.webContents.send(START_MINER_NODE_SUCCESS)
      // Write to Dipperin log file
      const logStream = fs.createWriteStream(chainLogPath, { flags: 'a+' })

      dipperin.stdout.pipe(logStream)
      dipperin.stderr.pipe(logStream)
    })
    .catch(err => {
      handleError(err, 'An error occured while running Dipperin Miner.')
      mainWindow.webContents.send(START_MINER_NODE_FAILURE)
    })
}

export const getChainIpcPath = () => {
  return dipperinIpcPath
}

export const dipperinIpcRequest = (rpcString: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      const dipperinIpcSocket = new lnet.Socket()
      const wrapPath = getOs() === 'windows' ? `\\\\.\\pipe\\` + dipperinIpcPath : dipperinIpcPath
      dipperinIpcSocket.connect({ path: wrapPath }, () => {
        dipperinIpcSocket.once('data', data => {
          const result = data.toString()
          dipperinIpcSocket.end()
          resolve(result)
        })
        dipperinIpcSocket.on('error', (err: Error) => {
          reject(err)
        })
        setTimeout(() => {
          dipperinIpcSocket.end()
          reject(new Error('ipcRequest timeout.'))
        }, 3000)
        dipperinIpcSocket.write(rpcString)
      })
    } catch (e) {
      reject(e)
    }
  })
}
