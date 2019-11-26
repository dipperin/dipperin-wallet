import BIP39 from 'bip39'
import { noop } from 'lodash'
import { observable, reaction, computed, action, runInAction } from 'mobx'
import BN from 'bignumber.js'
import path from 'path'
import { Accounts, AccountObject } from '@dipperin/dipperin.js'

// import { encrypt } from '@/utils'
import settings from '@/utils/settings'
import { getCurrentNet, getIsRemoteNode } from '@/utils/node'
import { stdResponse } from '@/utils/errors'
import {
  getWallet,
  insertWallet,
  updateErrTimes,
  updateLockTime,
  updateActiveId
  // insertMinerData,
  // removeMinerData
} from '@/db'

import RootStore from './root'
import WalletModel, { WalletObj } from '@/models/wallet'
import {
  WALLET_ID,
  DEFAULT_ERR_TIMES,
  DEFAULT_LOCK_TIME,
  LOCKTIMES,
  FIRST_ACCOUNT_ID,
  ACCOUNTS_PATH
} from '@/utils/constants'
import { sleep } from '@/utils'
import { deleteCsWallet, dipperinIpc, getChainDataDir } from '@/ipc'

export default class WalletStore {
  private _store: RootStore
  private _mnemonic: string // Mnemonic

  @observable
  private _currentWallet?: WalletModel // current wallet

  @observable
  private _hdAccount: AccountObject // Seed

  @observable
  private _blockInfo: any

  // @observable
  // private _isConnecting: boolean = false

  destroyMnemonic: () => void = noop

  constructor(store: RootStore) {
    this._store = store
    reaction(
      () => this.unlockErrTimes,
      errTimes => {
        if (this._currentWallet) {
          updateErrTimes(this._currentWallet.walletId, errTimes)
          this.checkUnlockErrTimes(errTimes)
        }
      }
    )

    reaction(
      () => this.lockTime,
      lockTime => {
        if (this._currentWallet) {
          updateLockTime(this._currentWallet.walletId, lockTime)
        }
      }
    )
  }

  @computed
  get isHaveWallet() {
    return !!this._currentWallet
  }

  @computed
  get mnemonic() {
    return this._mnemonic
  }

  @computed
  get walletId(): number {
    return this._currentWallet ? this._currentWallet.walletId : 0
  }

  @computed
  get isUnlock(): boolean {
    return !!this._hdAccount
  }

  @computed
  get lockTime(): string {
    return this._currentWallet ? this._currentWallet!.lockTime : DEFAULT_LOCK_TIME
  }

  @computed
  get unlockErrTimes(): number {
    return this._currentWallet ? this._currentWallet!.unlockErrTimes : DEFAULT_ERR_TIMES
  }

  @computed
  get showLock(): boolean {
    return this._currentWallet ? this._currentWallet.showLock : false
  }

  @computed
  get hdAccount() {
    return this._hdAccount
  }

  @computed
  get activeAccountId(): string {
    return this._currentWallet ? this._currentWallet.activeAccountId : '1'
  }

  set activeAccountId(id: string) {
    if (this._currentWallet) {
      this._currentWallet.activeAccountId = id
      updateActiveId(this.walletId, id)
    }
  }

  get blockInfo() {
    return this._blockInfo
  }

  // get isConnecting() {
  //   return this._isConnecting
  // }

  /**
   * Toggle wallet lock
   * @param isLock
   */
  toggleLock(isLock: boolean): void {
    this._currentWallet!.showLock = isLock
  }

  /**
   * Get private key by path from this seed
   *
   * @param path
   */
  getPrivateKeyByPath(cpath: string): string {
    return this.getAccountByPath(cpath).privateKey
  }

  /**
   * Get derive account by path
   * @param path Derive path
   */
  getAccountByPath(cpath: string) {
    return this._hdAccount.derivePath(cpath)
  }

  /**
   * Unlock wallet
   * @param password
   */
  @action
  unlockWallet(password: string): boolean {
    const account = this.getHdAccount(password)
    if (account) {
      this._hdAccount = account
      if (this._store.isConnecting) {
        this.startService()
      }
      return true
    }
    return false
  }

  /**
   * Check Password
   * @param password
   */
  checkPassword(password: string): boolean {
    const account = this.getHdAccount(password)
    return account ? true : false
  }

  /**
   * Set Miner, will remove in future
   *
   * @param address
   */
  async setMiner(address: string) {
    try {
      await this._store.dipperin.dr.setMineCoinbase(address)
    } catch (err) {
      console.error(err)
    }
  }

  /**
   * Get current block data
   */
  async getCurrentBlock() {
    const res = await this._store.dipperin.dr.getCurrentBlock()
    if (res) {
      const blockInfo = {
        ...res.header,
        transactions: res.body.transactions ? res.body.transactions.length : 0
      }
      runInAction(() => {
        this._blockInfo = blockInfo
      })
    } else {
      console.error(`can't get block info`)
    }
  }

  /**
   * Create a new Wallet
   *
   * @param password wallet decrypt password
   */
  create = async (password: string, mnemonic?: string): Promise<Error | void> => {
    this._store.loading.start()
    try {
      if (!mnemonic) {
        // If not input a mnemonic, generate a new mnemonic and save
        this.destroyMnemonic = this.createDestroyMnemonic(password)
      } else {
        await this.initWallet(password, mnemonic)
        // this._store.account.showDbAccounts()
      }
    } catch (err) {
      return err
    } finally {
      this._store.loading.stop()
    }
  }

  /**
   * Save wallet to db
   */
  save() {
    this.saveWallet()
  }

  /**
   * Load wallet from data store
   */

  async load(): Promise<boolean> {
    const walletId = settings.get(WALLET_ID) as number
    const walletObj = await getWallet(walletId)
    if (!walletObj) {
      // FIXME: When the wallet cannot be successfully loaded, an error message should pop up.
      return false
    }
    try {
      runInAction(() => {
        this._currentWallet = new WalletModel(walletObj)
      })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  @action
  resetBlockInfo() {
    this._blockInfo = undefined
  }

  /**
   * Clear all data
   */
  @action
  clear() {
    this._currentWallet = undefined
    this.resetBlockInfo()
  }

  /**
   * Start the loop update
   */
  startUpdate() {
    this.getCurrentBlock()

    this._store.timer.on('get-current-block', this.getCurrentBlock.bind(this), 10000)
  }

  /**
   * Save wallet to db and save wallet id to setting
   */
  private saveWallet(): void {
    // save current wallet id in settings
    settings.set(WALLET_ID, this._currentWallet!.walletId)
    insertWallet(this._currentWallet!.toJS())
  }

  /**
   * Create Destroy mnemonic
   * @param password
   */
  @action
  private createDestroyMnemonic(password: string): () => void {
    const mnemonic = BIP39.generateMnemonic()
    this._mnemonic = mnemonic
    return () => {
      // Destroy mnemonic and init the wallet
      this.initWallet(password, mnemonic)
      this._store.startUpdate()
      this._mnemonic = ''
    }
  }

  /**
   * Init the new wallet
   * @param password
   * @param mnemonic
   */
  @action
  private initWallet = async (password: string, mnemonic: string): Promise<void> => {
    // init wallet id
    const walletId = new Date().valueOf()
    // Try to parse mnemonic to seed, if fail, return error
    const seed = `0x${BIP39.mnemonicToSeedHex(mnemonic)}`
    const hdAccount = Accounts.create(seed)
    // save encrypt seed, an then clear password and mnemonic
    const encryptSeed = hdAccount.encrypt(password)
    const walletObj: WalletObj = {
      walletId,
      activeAccountId: FIRST_ACCOUNT_ID,
      encryptSeed,
      unlockErrTimes: DEFAULT_ERR_TIMES,
      lockTime: DEFAULT_LOCK_TIME
    }
    this._currentWallet = new WalletModel(walletObj)
    this._hdAccount = hdAccount
    // init account
    await this._store.account.initAccount()
  }

  /**
   * Check if the number of unlock errors exceeds the limit
   * @param errTimes
   */
  @action
  private checkUnlockErrTimes(errTimes: number): void {
    if (errTimes >= LOCKTIMES) {
      const nowDateString = String(new Date().valueOf())
      updateLockTime(this._currentWallet!.walletId, nowDateString)
      this._currentWallet!.lockTime = nowDateString
      this._currentWallet!.showLock = true
      this._currentWallet!.unlockErrTimes = 0
      updateErrTimes(this._currentWallet!.walletId, 0)
    }
  }

  /**
   * unlock wallet / check password
   * get hd account
   */
  @action
  private getHdAccount(password: string): undefined | AccountObject {
    if (!this._currentWallet || !this._currentWallet.encryptSeed) {
      return
    }

    try {
      // console.log(this._currentWallet.encryptSeed)
      const account = Accounts.decrypt(this._currentWallet.encryptSeed, password)
      this._currentWallet.unlockErrTimes = DEFAULT_ERR_TIMES
      return account
    } catch (_) {
      const preErrTimes = this._currentWallet.unlockErrTimes
      let errTimes = preErrTimes ? preErrTimes : DEFAULT_ERR_TIMES
      this._currentWallet.unlockErrTimes = ++errTimes
      return
    }
  }

  /**
   * miner relate
   */
  @observable
  mineState: string = 'init'
  @observable
  minerMnemonic: string = ''
  /**
   * init means the wallet hasn't mined before this time
   * stop means the wallet has mined this time
   */
  @action
  setMineState = (state: 'init' | 'stop' | 'loading' | 'mining') => {
    this.mineState = state
  }

  @action
  setMinerMnemonic = (mnemonic: string) => {
    this.minerMnemonic = mnemonic
  }

  restoreWallet = async (mnemonic: string) => {
    try {
      const chainDataDir = await getChainDataDir()
      const cswalletPath = path.join(chainDataDir, `CSWallet`)
      const walletIdentifier = {
        walletType: 0,
        path: cswalletPath,
        walletName: 'CSWallet'
      }
      // await this._store.dipperin.dr.restoreWallet('123', mnemonic, '', walletIdentifier)
      const password: string =
        Math.random()
          .toString(36)
          .slice(2) +
        Math.random()
          .toString(36)
          .slice(2)
      const wrappedRpc = {
        id: 1,
        jsonrpc: '2.0',
        method: 'dipperin_restoreWallet',
        params: [password, mnemonic, '', walletIdentifier]
      }
      await dipperinIpc(JSON.stringify(wrappedRpc))
    } catch (e) {
      console.log(`restoreWallet error`, e.message)
    }
  }

  startRemainingService = async () => {
    // await this._store.dipperin.dr.startRemainingService()
    try {
      const wrappedRpc = {
        id: 2,
        jsonrpc: '2.0',
        method: 'dipperin_startRemainingService',
        params: []
      }
      await dipperinIpc(JSON.stringify(wrappedRpc))
    } catch (e) {
      throw e
    }
  }

  private sendStartMineByIpc = async () => {
    try {
      const wrappedRpc = {
        id: 3,
        jsonrpc: '2.0',
        method: 'dipperin_startMine',
        params: []
      }
      await dipperinIpc(JSON.stringify(wrappedRpc))
      return [true, '']
    } catch (e) {
      console.log(`sendStartMineByIpc:`, e.message)
      return [false, 'sendStartMineByIpc error']
    }
  }

  private startMineFromInit = async (): Promise<stdResponse> => {
    try {
      this.setMineState('loading')
      const startServiceResult = await this.startService()
      if (!startServiceResult[0]) {
        throw new Error('startService failure')
      }
      await sleep(500)
      const startMineFromStopResult = await this.startMineFromStop()
      if (!startMineFromStopResult[0]) {
        throw new Error('startMineFromStop error')
      }
      return [true, '']
    } catch (e) {
      // * stop the node
      this._store.stopNode()
      console.log(`startMineFromInit error:`, e.message)
      return [false, e.message]
    }
  }

  private startMineFromStop = async (): Promise<stdResponse> => {
    try {
      this.setMineState('loading')
      const sendStartMineByIpcResult = await this.sendStartMineByIpc()
      if (!sendStartMineByIpcResult) {
        throw new Error('sendStartMineByIpc error')
      }
      this.setMineState('mining')
      return [true, '']
    } catch (e) {
      // * stop the node
      this._store.stopNode()
      return [false, e.message]
    }
  }

  startMine = async () => {
    try {
      if (getIsRemoteNode()) {
        return [false, 'remote node error']
      }
      if (!this._store.isConnecting) {
        return [false, 'stop node error']
      }
      switch (this.mineState) {
        case 'init': {
          const startMineFromInitResult = this.startMineFromInit()
          if (!startMineFromInitResult[0]) {
            // TODO: handle different error
            throw new Error('startMineFromInit error')
          }
          return [true, '']
        }
        case 'stop': {
          const startMineFromStopResult = await this.startMineFromStop()
          if (!startMineFromStopResult[0]) {
            // TODO: handle different error
            throw new Error('startMineFromStop error')
          }
          return [true, '']
        }
        default: {
          return [false, 'mining or loading']
        }
      }
    } catch (e) {
      console.log(`startMine error:`, e.message)
      return [false, 'startMine error']
    }
  }

  /**
   * @returns [true, ''] | [false, Error]
   */
  private sendStopMineByIpc = async (): Promise<stdResponse> => {
    try {
      const wrappedRpc = {
        id: 3,
        jsonrpc: '2.0',
        method: 'dipperin_stopMine',
        params: []
      }
      await dipperinIpc(JSON.stringify(wrappedRpc))
      return [true, '']
    } catch (e) {
      console.log(`sendStopMineFromIpc:`, e.message)
      return [false, 'sendStopMineFromIpc error']
    }
  }

  /**
   * stopMine
   */
  stopMine = async (): Promise<stdResponse> => {
    try {
      const sendStopMineFromIpcResult = await this.sendStopMineByIpc()
      if (!sendStopMineFromIpcResult[0]) {
        // * if node is still running, restart it
        this._store.stopNode()
        this.setMineState('init')
        throw new Error(sendStopMineFromIpcResult[1])
      }
      this.setMineState('stop')
      return [true, '']
    } catch (e) {
      console.log(`stopMine error:`, e.message)
      return [true, '']
    }
  }

  startService = async (): Promise<stdResponse> => {
    try {
      if (this.mineState === 'stop') {
        return [true, '']
      }
      const initMinerResult = this.initMiner()
      if (!initMinerResult[0]) {
        throw new Error(initMinerResult[1])
      }
      // this.genMinerAccount()
      await deleteCsWallet(getCurrentNet())
      await sleep(1000)
      await this.restoreWallet(this.minerMnemonic)
      await sleep(1000)
      await this.startRemainingService()
      this.setMineState('stop')
      console.log('startDipperinService success')
      return [true, '']
    } catch (e) {
      console.log(`startDipperinService error:`, e.message)
      return [false, e.message]
    }
  }

  /**
   * if the minerMnemonic is empty, generate minerMnemonic, else do nothing
   * the
   */
  initMiner = (): stdResponse => {
    try {
      if (this.minerMnemonic === '') {
        if (!this._hdAccount) {
          throw new Error("hdAccount doesn't exist")
        }
        const pub = this._hdAccount.derivePath(`${ACCOUNTS_PATH}/0`).publicKey.replace(/^0x/, '')
        const mnemonic = BIP39.entropyToMnemonic(pub.slice(0, 64))
        this.setMinerMnemonic(mnemonic)
        // const miner = await getMiner()
        // if (miner) {
        //   if (miner.mnemonic.split(' ').length === 12) {
        //     this.setMinerMnemonic(miner.mnemonic)
        //   } else {
        //     const pub = this._hdAccount.derivePath(`${ACCOUNTS_PATH}/1`).publicKey.replace(/^0x/, '')
        //     const key = pub.substring(0, 32)
        //     const iv = pub.substring(32, 48)
        //     const mnemonic = decrypt(key, iv, miner.mnemonic)
        //     this.setMinerMnemonic(mnemonic)
        //   }
        // } else {
        //   this.genMinerAccount()
        // }
      }
      return [true, '']
    } catch (e) {
      console.log(`initMiner error:`, e.message)
      return [false, 'initMiner failure']
    }
  }

  queryBalance = async (address: string) => {
    return await this._store.dipperin.dr.getBalance(address)
  }

  getAccountNonce = async (address: string): Promise<string> => {
    try {
      const res = await this._store.dipperin.dr.getNonce(address)
      return res || '0'
    } catch (err) {
      return ''
    }
  }

  // genMinerAccount = () => {
  //   const mnemonic = BIP39.generateMnemonic()
  //   this.setMinerMnemonic(mnemonic)
  //   const pub = this._hdAccount.derivePath(`${ACCOUNTS_PATH}/1`).publicKey.replace(/^0x/, '')
  //   const key = pub.substring(0, 32)
  //   const iv = pub.substring(32, 48)
  //   const encryptedMnemonic = encrypt(key, iv, mnemonic)
  //   insertMinerData(encryptedMnemonic)
  // }

  // changeMinerAccount = async () => {
  //   await removeMinerData()
  //   // this.genMinerAccount()
  // }

  getMinerAccount = () => {
    const seed = `0x${BIP39.mnemonicToSeedHex(this.minerMnemonic)}`
    const hdAccount = Accounts.create(seed)
    return hdAccount.derivePath(`${ACCOUNTS_PATH}/1`)
  }

  withdrawAll = async (to: string) => {
    try {
      const hdAccount = this.getMinerAccount()
      const minerAddress = hdAccount.address
      const balance = await this.queryBalance(minerAddress)
      const nonce = await this.getAccountNonce(minerAddress)
      const value = new BN(balance).minus(new BN(21000)).toString(10)
      console.log('send value', value)
      const tx = this._store.transaction.createTransaction(minerAddress, to, value, '', '21000', '1', nonce, '')
      const chainId = this._store.transaction.getChainId()
      tx.signTranaction(hdAccount.privateKey, chainId)
      const res = await this._store.dipperin.dr.sendSignedTransaction(tx.signedTransactionData)
      console.log(res)
    } catch (e) {
      switch (e.message) {
        case `Returned error: "this transaction already in tx pool"`:
          console.log('this transaction already in tx pool')
          break
        default:
          console.log(`handleWithdrawBalance error:`, e.message)
      }
    }
  }

  withdrawAmount = async (to: string, amount: string) => {
    try {
      const hdAccount = this.getMinerAccount()
      const minerAddress = hdAccount.address
      const nonce = await this.getAccountNonce(minerAddress)
      const value = new BN(amount).minus(new BN(21000)).toString(10)
      console.log('send value', value)
      const tx = this._store.transaction.createTransaction(minerAddress, to, value, '', '21000', '1', nonce, '')
      const chainId = this._store.transaction.getChainId()
      tx.signTranaction(hdAccount.privateKey, chainId)
      const res = await this._store.dipperin.dr.sendSignedTransaction(tx.signedTransactionData)
      console.log(res)
    } catch (e) {
      switch (e.message) {
        case `Returned error: "this transaction already in tx pool"`:
          console.log('this transaction already in tx pool')
          break
        default:
          console.log(`handleWithdrawBalance error:`, e.message)
      }
      return e.message
    }
  }

  /**
   * the following content is about setting chainDataDir
   */
}

// animal enter candy frame garbage thought whip obvious artefact mean tuition pepper
// toy fit wisdom split inform van puzzle blanket just meadow frame pulp
// knock eight ocean spread early auto snap ignore protect orange you solve
