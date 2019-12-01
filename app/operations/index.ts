import EventEmitter from 'eventemitter3'
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
import crypto from 'crypto'

import dipperinPath from '../utils/dipperinPath'
// import handleError from './handleError'
import { START_NODE_FAILURE, START_SUCCESS } from '../ipc'
import { getOs } from '../utils/dipperinPath'

export const DEFAULT_NET = 'venus'
export const CHAIN_DATA_DIR = 'chainDataDir'
export const DEFAULT_APP_DIR = path.join(os.homedir(), `tmp`, `dipperin_apps`)
const STATE_CHANGE = 'stateChange'
const FINISH_IPC_REQUEST = 'finishIpcRequest'

const fsChmod = util.promisify(fs.chmod)
const fsExists = util.promisify(fs.stat)
const noop = () => null

const MAX_LOG_SIZE = 100 * 1024 * 1024

interface DipperinOpt {
  appDataDir: string
}

enum DipperinState {
  NONE,
  STARTING,
  RUNNING
}

enum IPC_REQUEST_TYPE {
  RESTOREWALLET,
  STARTREMAININGSERVICE,
  STARTMINE,
  STOPMINE
}

export default class DipperinManager extends EventEmitter {
  dipperin: ChildProcess | undefined

  private _dipperinState: number = DipperinState.NONE

  private _currentNet: string = ''

  private _dipperinIpcPath = ''

  private _restoreWalleted: boolean = false

  private _startRemainingServiced: boolean = false

  private _startMined: boolean = false

  private _ipcRequestList: string[] = []

  private _ipcSending: boolean = false

  constructor() {
    super()
    this.on(FINISH_IPC_REQUEST, () => {
      const rpcString = this._ipcRequestList.shift()
      if (rpcString && !this._ipcSending) {
        this._ipcProcess(rpcString)
      }
    })
  }

  get restoreWalleted() {
    return this._restoreWalleted
  }

  get remainingServiced() {
    return this._startRemainingServiced
  }

  get startMined() {
    return this._startMined
  }

  get dipperinIpcPath() {
    return this._dipperinIpcPath
  }

  get dipperinState() {
    return this._dipperinState
  }

  get currentNet() {
    return this._currentNet
  }

  private _changeState = (newState: number) => {
    const preState = this.dipperinState
    this._dipperinState = newState
    this.emit(`${STATE_CHANGE}:${preState}:${newState}`)
  }

  init = () => {
    this._changeState(DipperinState.NONE)
    this._currentNet = ''
    this._dipperinIpcPath = ''
    this._restoreWalleted = false
    this._startRemainingServiced = false
    this._startMined = false
    this._ipcRequestList = []
  }

  runDipperin = (net: string, mainWindow: BrowserWindow, opt?: DipperinOpt) => {
    // when the dipperin is running, change net
    if (this.dipperinState === DipperinState.RUNNING && net !== this.currentNet) {
      this.killDipperin()
      this._runDipperin(net, mainWindow, opt)
    }
    // when the dipperin is stop, run dipprin
    if (this.dipperinState === DipperinState.NONE) {
      this._runDipperin(net, mainWindow, opt)
    }
    // when the dipperin is starting, run this function when running
    if (this.dipperinState === DipperinState.STARTING) {
      this.removeAllListeners(`${STATE_CHANGE}:${DipperinState.RUNNING}:${DipperinState.RUNNING}`)
      this.once(`${STATE_CHANGE}:${DipperinState.RUNNING}:${DipperinState.RUNNING}`, () => {
        this.runDipperin(net, mainWindow, opt)
      })
    }
  }

  /**
   * return [chainDataDir, chainLogPath, chainIpcPath]
   * @param net
   * @param opt
   */
  private _getLogAndIpcPath(net: string, opt?: DipperinOpt): [string, string, string] {
    let chainDataDir: string
    if (opt) {
      chainDataDir = path.join(opt.appDataDir, `${getNodeEnv(net)}`, `wallet`)
    } else {
      const appDir = (settings.get(CHAIN_DATA_DIR) as string | undefined) || DEFAULT_APP_DIR
      chainDataDir = path.join(appDir, `${getNodeEnv(net)}`, `wallet`)
    }
    log.info('running net:', getNodeEnv(net))
    const chainLogPath = path.join(chainDataDir, `dipperin.log`)
    const chainIpcPath = path.join(chainDataDir, `dipperin.ipc`)
    return [chainDataDir, chainLogPath, chainIpcPath]
  }

  /**
   * only run when the state is none
   */
  private _runDipperin = (net: string, mainWindow: BrowserWindow, opt?: DipperinOpt) => {
    this._changeState(DipperinState.STARTING)
    const [chainDataDir, chainLogPath, chainIpcPath] = this._getLogAndIpcPath(net, opt)

    if (fs.existsSync(chainIpcPath)) {
      fs.unlinkSync(chainIpcPath)
    }

    fsExists(chainLogPath)
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
        this.dipperin = spawn(
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

        this.dipperin.on('error', err => {
          log.info('dipperin error', err.message)
          // * remove dipperin from memory
          this._removeDipperin()
        })

        this.dipperin.on('close', exitCode => {
          log.info('dipperin close exit code', exitCode)
          // * remove dipperin from memory
          this._removeDipperin()
        })

        this.dipperin.on('exit', (exitCode: number | null, signal: string | null) => {
          log.info('dipperin exit', exitCode, signal)
          // * remove dipperin from memory
          this._removeDipperin()
        })

        this.dipperin.on('disconnect', () => {
          log.info('dipperin disconnect')
          // * remove dipperin from memory
          this._removeDipperin()
        })

        this._dipperinIpcPath = chainIpcPath
      })
      .then(() => fsExtra.ensureDir(chainDataDir))
      .then(() => {
        // Write to Dipperin log file
        const logStream = fs.createWriteStream(chainLogPath, { flags: 'a+' })

        this.dipperin!.stdout.pipe(logStream)
        this.dipperin!.stderr.pipe(logStream)
        // send start success ipc
        mainWindow.webContents.send(START_SUCCESS)
        //
        this._changeState(DipperinState.RUNNING)
      })
      .catch(err => {
        // handleError(err, 'An error occured while running Dipperin.')
        log.info('dipperin start failure', err.message)
        mainWindow.webContents.send(START_NODE_FAILURE)
        this._changeState(DipperinState.NONE)
      })
  }

  private _removeDipperin = () => {
    try {
      delete this.dipperin
    } catch (e) {
      log.info('delete dipperin ChildProcess error', e.message)
    } finally {
      this.dipperin = undefined
      this.init()
    }
  }

  killDipperin = async () => {
    if (this.dipperinState === DipperinState.RUNNING) {
      log.info('Stopping Dipperin.')
      this.dipperin!.stdin.end()
      this.dipperin!.kill('SIGKILL')

      this._removeDipperin()
    }
  }

  private _resolverIpcRequest = (rpcString: string): number => {
    if (rpcString.includes('dipperin_restoreWallet')) {
      return IPC_REQUEST_TYPE.RESTOREWALLET
    }
    if (rpcString.includes('dipperin_startRemainingService')) {
      return IPC_REQUEST_TYPE.STARTREMAININGSERVICE
    }
    if (rpcString.includes('dipperin_startMine')) {
      return IPC_REQUEST_TYPE.STARTMINE
    }

    if (rpcString.includes('dipperin_stopMine')) {
      return IPC_REQUEST_TYPE.STOPMINE
    }

    return -1
  }

  /**
   * only dipperin_restoreWallet dipperin_startRemainingService dipperin_startMine dipperin_stopMine
   */
  ipcRequest = (rpcString: string): Promise<string> => {
    const ipcRequestType = this._resolverIpcRequest(rpcString)

    if (ipcRequestType === IPC_REQUEST_TYPE.RESTOREWALLET) {
      return this._handleRestoreWallet(rpcString)
    }

    if (ipcRequestType === IPC_REQUEST_TYPE.STARTREMAININGSERVICE) {
      return this._handleStartRemainingService(rpcString)
    }

    if (ipcRequestType === IPC_REQUEST_TYPE.STARTMINE) {
      return this._handleStartMine(rpcString)
    }

    if (ipcRequestType === IPC_REQUEST_TYPE.STOPMINE) {
      return this._handleStopMine(rpcString)
    }

    // add new handler here or use register

    return Promise.reject(new Error('the rpc request is out of design'))
  }

  private _addIpcTask = (rpcString: string, cb?:()=>void): Promise<string> => {
    if (this._ipcRequestList.includes(rpcString)) {
      return Promise.reject(new Error('the request is in waiting list'))
    }

    const hash = hashSha1(rpcString)
    this._ipcRequestList.push(rpcString)

    return new Promise((resolve, reject) => {
      this.once('ipc' + ':' + hash, (success: boolean, result: any) => {
        if (success) {
          if(cb) {
            cb()
          }
          resolve(result)
        } else {
          reject(reject)
        }
      })
      this.emit(FINISH_IPC_REQUEST)
    })
  }

  private _handleRestoreWallet = (rpcString: string): Promise<string> => {
    if (this.restoreWalleted) {
      return Promise.resolve('')
    }

    return this._addIpcTask(rpcString, ()=> {
      this._restoreWalleted = true
    })
  }

  private _handleStartRemainingService = (rpcString: string): Promise<string> => {
    if (!this.restoreWalleted) {
      return Promise.reject(new Error('have not restore wallet'))
    }
    if (this._startRemainingServiced) {
      return Promise.resolve('')
    }

    return this._addIpcTask(rpcString, ()=> {
      this._startRemainingServiced = true
    })
  }

  private _handleStartMine = (rpcString: string): Promise<string> => {
    if (!this._startRemainingServiced) {
      return Promise.reject(new Error('have not start remaining service'))
    }
    if (this._startMined) {
      return Promise.resolve('')
    }

    return this._addIpcTask(rpcString, () => {
      this._startMined = true
    })
  } 

  private _handleStopMine = (rpcString: string): Promise<string> => {
    if (!this._startMined) {
      return Promise.resolve('')
    }

    return this._addIpcTask(rpcString, () => {
      this._startMined = false
    })
  }

  private _ipcStart = () => {
    this._ipcSending = true
  }

  private _ipcEnd = (hash: string, success: boolean, result: any) => {
    this.emit('ipc' + ':' + hash, success, result)
    this._ipcSending = false
    this.emit(FINISH_IPC_REQUEST)
  }

  private _ipcProcess = (rpcString: string): void => {
    log.info('dipperinIpcRequest receive', rpcString)
    const hash = hashSha1(rpcString)

    if (this._ipcSending) {
      return
    }

    this._ipcStart()

    try {
      const dipperinIpcSocket = new lnet.Socket()

      dipperinIpcSocket.on('error', (err: Error) => {
        this._ipcEnd(hash, false, err)
      })
      dipperinIpcSocket.on('lookup', (err: Error) => {
        this._ipcEnd(hash, false, err)
      })
      dipperinIpcSocket.on('close', () => {
        this._ipcEnd(hash, false, new Error('socket close'))
      })

      const wrapPath = getOs() === 'windows' ? `\\\\.\\pipe\\` + this.dipperinIpcPath : this.dipperinIpcPath
      dipperinIpcSocket.connect({ path: wrapPath }, () => {
        dipperinIpcSocket.once('data', data => {
          const result = data.toString()
          log.info(result)
          dipperinIpcSocket.destroy()
          this._ipcEnd(hash, true, result)
        })
        setTimeout(() => {
          dipperinIpcSocket.destroy()
          this._ipcEnd(hash, false, new Error('ipcRequest timeout'))
        }, 3000)
        dipperinIpcSocket.write(rpcString)
      })
    } catch (e) {
      log.info('dipperinIpcRequest error', e.message)
      this._ipcEnd(hash, false, e)
    }
  }
}

export const hashSha1 = (input: string) => {
  const hash = crypto.createHash('sha1')
  hash.update(input)
  return hash.digest('hex')
}

export const getNodeEnv = (net: string): string => {
  return net || DEFAULT_NET
}
