import { observable, computed, runInAction, action } from 'mobx'
import { Utils } from '@dipperin/dipperin.js'
import BigNumber from 'bignumber.js'

export default class AccountModel {
  private _address: string
  private _nonce: string
  private _id: string
  private _path: string

  @observable
  private _balance: BigNumber = new BigNumber(0)
  @observable
  private _lockMoney: BigNumber = new BigNumber(0)

  /**
   * Get Account model from an object
   * @param obj
   */
  static fromObj(obj: AccountObj) {
    return new AccountModel(obj.id.toString(), obj.path, obj.address, obj.nonce)
  }

  constructor(id: string, path: string, address: string, nonce?: string) {
    runInAction(() => {
      this._id = id
      this._path = path
      this._address = address
      this._nonce = nonce || '0'
    })
  }

  @computed
  get id() {
    return this._id
  }

  @computed
  get path() {
    return this._path
  }

  @computed
  get address() {
    return this._address
  }

  @computed
  get nonce() {
    return this._nonce
  }

  @computed
  get balance() {
    return Utils.fromUnit(this._balance.toString(10))
  }

  @computed
  get lockMoney() {
    return Utils.fromUnit(this._lockMoney.toString(10))
  }

  @computed
  get balanceUnit() {
    return this._balance.toString(10)
  }

  /**
   * Update balance
   * @param balance An new balance
   */
  @action
  updateBalance(balance: string) {
    if (balance) {
      this._balance = new BigNumber(balance)
    }
  }

  @action
  updatelockMoney(lockMoney: string) {
    if (lockMoney) {
      this._lockMoney = new BigNumber(lockMoney)
    }
  }

  /**
   * Update account transaction nonce
   * @param nonce Account transaction nonce
   */
  @action
  updateNonce(nonce: string) {
    if (nonce) {
      this._nonce = nonce
    }
  }

  /**
   * Add account transaction nonce
   */
  @action
  plusNonce() {
    this._nonce = new BigNumber(this._nonce).plus(1).toString(10)
  }

  /**
   * Transfer account model to Javascript object
   */
  toJS(): AccountObj {
    return {
      address: this.address,
      id: Number(this.id),
      nonce: this._nonce || '0',
      path: this.path
    }
  }
}

export interface AccountObj {
  address: string
  id: number
  nonce: string
  path: string
}
