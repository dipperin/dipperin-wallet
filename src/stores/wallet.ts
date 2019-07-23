import BIP39 from 'bip39'
import { noop } from 'lodash'
import { observable, reaction, computed, action, runInAction } from 'mobx'

import settings from '@/utils/settings'
import { Accounts, AccountObject } from '@dipperin/dipperin.js'
import { getWallet, insertWallet, updateErrTimes, updateLockTime, updateActiveId } from '@/db'

import RootStore from './root'
import WalletModel, { WalletObj } from '@/models/wallet'
import { WALLET_ID, DEFAULT_ERR_TIMES, DEFAULT_LOCK_TIME, LOCKTIMES, FIRST_ACCOUNT_ID } from '@/utils/constants'

export default class WalletStore {
  private _store: RootStore
  private _mnemonic: string // Mnemonic

  @observable
  private _currentWallet?: WalletModel // current wallet

  @observable
  private _hdAccount: AccountObject // Seed

  @observable
  private _blockInfo: any

  @observable
  private _isConnecting: boolean = false

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

  get isConnecting() {
    return this._isConnecting
  }

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
  getPrivateKeyByPath(path: string): string {
    return this.getAccountByPath(path).privateKey
  }

  /**
   * Get derive account by path
   * @param path Derive path
   */
  getAccountByPath(path: string) {
    return this._hdAccount.derivePath(path)
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
  create(password: string, mnemonic?: string): Error | void {
    this._store.loading.start()
    try {
      if (!mnemonic) {
        // If not input a mnemonic, generate a new mnemonic and save
        this.destroyMnemonic = this.createDestroyMnemonic(password)
      } else {
        this.initWallet(password, mnemonic)
        // for(let i =0;i<14;i++) {
        //   this._store.account.addAccount()
        // }
        // this._store.account.changeActiveAccount(FIRST_ACCOUNT_ID)s
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
  private initWallet(password: string, mnemonic: string): void {
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
    this._store.account.initAccount()
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
}

// animal enter candy frame garbage thought whip obvious artefact mean tuition pepper
// toy fit wisdom split inform van puzzle blanket just meadow frame pulp
// knock eight ocean spread early auto snap ignore protect orange you solve
