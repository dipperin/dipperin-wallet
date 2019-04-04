import BN from 'bignumber.js'
import { isString } from 'lodash'
import { computed, observable, runInAction, action } from 'mobx'

import { getTx, insertTx, updateTx } from '@/db'
import {
  DEFAULT_CHAIN_ID,
  DEFAULT_HASH_LOCK,
  TRANSACTION_STATUS_FAIL,
  TRANSACTION_STATUS_SUCCESS
} from '@/utils/constants'
import { RespTransaction } from '@/workers/block.worker'
import { Utils } from '@dipperin/dipperin.js'

import TransactionModel from '../models/transaction'
import { getNowTimestamp } from '@/utils'
import Errors from '../utils/errors'
import { getCurrentNet } from '../utils/node'
import RootStore from './root'

class TransactionStore {
  private _store: RootStore

  @observable
  private _transactionsMap: Map<string, TransactionModel[]>

  constructor(store: RootStore) {
    this._store = store
    runInAction(() => {
      this._transactionsMap = new Map()
    })
  }

  @computed
  get transactions(): TransactionModel[] {
    return (this._transactionsMap.get(this._store.account.activeAccount.address) || []).slice().reverse()
  }

  @computed
  get transactionsMap() {
    return this._transactionsMap
  }

  startUpdate() {
    this._store.timer.on('update_transactions', this.updateTransactionType.bind(this), 5000)
  }

  updateTransactionType() {
    for (const transactions of this._transactionsMap.values()) {
      transactions
        .filter(tx => !tx.isSuccess && !tx.isOverLongTime(getNowTimestamp()))
        .forEach(tx => {
          const txs = transactions
          this._store.dipperin.dr
            .getTransaction(tx.transactionHash)
            .then(res => {
              if (!res.transaction) {
                if (tx.isOverTime(getNowTimestamp()) || this.haveSameNonceSuccessTx(tx, txs)) {
                  tx.setFail()

                  updateTx(tx.transactionHash, { status: TRANSACTION_STATUS_FAIL }, getCurrentNet())
                }
                return
              } else {
                tx.setSuccess()
                updateTx(tx.transactionHash, { status: TRANSACTION_STATUS_SUCCESS }, getCurrentNet())
              }
            })
            .catch(err => console.error(err))
        })
    }
  }

  @action
  appendTransaction(address: string, txs: RespTransaction[]) {
    const mTxs = txs.map(tx => {
      return new TransactionModel({
        ...tx,
        hashLock: '',
        status: tx.status ? tx.status : TRANSACTION_STATUS_SUCCESS
      })
    })

    const preTxs = this._transactionsMap.get(address) || []

    const newTxs = [...preTxs, ...mTxs].sort((tx1, tx2) => tx1.timestamp - tx2.timestamp)

    this.transactionsMap.set(address, newTxs)

    mTxs.forEach(tx => insertTx(tx.toJS(), getCurrentNet()))
  }

  getTransactionFee(address: string, amount: string, memo: string): string {
    try {
      const transaction = this.createNewTransaction(address, amount, memo)
      return transaction.fee
    } catch (err) {
      return '0'
    }
  }

  async confirmTransaction(address: string, amount: string, memo: string, fee: string): Promise<TxResponse> {
    const privateKey = this._store.wallet.getPrivateKeyByPath(this._store.account.activeAccount.path)
    try {
      const transaction = this.createNewTransaction(address, amount, memo, fee)
      transaction.signTranaction(privateKey, DEFAULT_CHAIN_ID)
      // console.debug(`tx${JSON.stringify(transaction.toJS())}`)
      // console.dir(transaction.toJS())
      const res = await this._store.dipperin.dr.sendSignedTransaction(transaction.signedTransactionData)
      if (!isString(res)) {
        const errRes = res
        return {
          success: false,
          info: errRes.error ? errRes.error.message : 'Something wrong!'
        }
      }
      if (res === transaction.transactionHash) {
        // Append Transaction
        const activeAccountAddress = this._store.account.activeAccount.address
        this.appendTransaction(activeAccountAddress, [transaction.toJS()])
        // Plus account nonce
        this._store.account.activeAccount.plusNonce()
        return {
          success: true,
          hash: transaction.transactionHash
        }
      } else {
        return {
          success: false,
          info: 'Something wrong!'
        }
      }
    } catch (err) {
      // console.error(String(err))
      if (err instanceof Errors.NoEnoughBalanceError) {
        return {
          success: false,
          info: err.message
        }
      }
      return {
        success: false,
        info: String(err)
      }
    }
  }

  async load() {
    await Promise.all(
      this._store.account.accounts.map(async account => {
        const txs = await getTx(account.address, getCurrentNet())
        try {
          runInAction(() => {
            this._transactionsMap.set(
              account.address,
              txs.map(
                tx =>
                  new TransactionModel({
                    extraData: tx.extraData,
                    fee: tx.fee,
                    from: tx.from,
                    hashLock: tx.hashLock,
                    nonce: tx.nonce,
                    status: tx.status,
                    timeLock: tx.timeLock,
                    timestamp: tx.timestamp,
                    to: tx.to,
                    transactionHash: tx.transactionHash,
                    value: tx.value
                  })
              )
            )
          })
        } catch (err) {
          console.error(err)
        }
      })
    )
  }

  clear() {
    this._transactionsMap.clear()
  }

  reload() {
    this.clear()
    this.load()
  }

  private createNewTransaction(address: string, amount: string, memo: string, fee?: string): TransactionModel {
    const fromAccount = this._store.account.activeAccount
    const amountUnit = Utils.toUnit(amount)

    const feeUnit = fee ? Utils.toUnit(fee) : '0'

    const accountAmount = Utils.toUnit(fromAccount.balance)
    if (new BN(accountAmount).lt(new BN(amountUnit).plus(new BN(feeUnit)))) {
      throw new Errors.NoEnoughBalanceError()
    }
    return new TransactionModel({
      nonce: fromAccount.nonce,
      extraData: memo,
      value: amountUnit,
      hashLock: DEFAULT_HASH_LOCK,
      from: fromAccount.address,
      to: address,
      fee: feeUnit
    })
  }

  private haveSameNonceSuccessTx(tx: TransactionModel, txs: TransactionModel[]): boolean {
    return txs
      .filter(t => t.isSuccess)
      .some(t => t.from === tx.from && t.nonce === tx.nonce && t.transactionHash !== tx.transactionHash)
  }
}

export default TransactionStore

export interface TxResponse {
  success: boolean
  info?: string
  hash?: string
}
