import { computed, observable, reaction, runInAction, action } from 'mobx'

import {
  getContract,
  getContractTx,
  getFavoriteContract,
  getOwnerAddress,
  insertContract,
  insertFavoriteContract,
  insertOwnerAddress,
  updateContractStatus,
  updateFavoriteContract
} from '@/db'
import { TRANSACTION_STATUS_FAIL, TRANSACTION_STATUS_SUCCESS } from '@/utils/constants'
import { Utils } from '@dipperin/dipperin.js'

import { RespTransaction } from '@/workers/block.worker'
import ContractModel, { ContractObj } from '../models/contract'
import TransactionModel from '../models/transaction'
import { getCurrentNet } from '../utils/node'
import { getNowTimestamp } from '@/utils'
import RootStore from './root'
import { TxResponse } from './transaction'

class ContractStore {
  private _store: RootStore

  @observable
  private _favoriteContract: Map<string, string> = new Map()
  // current contract (created & favorite)
  @observable
  private _contract: Map<string, ContractModel> = new Map()
  @observable
  private _contractTx: TransactionModel[] = []

  constructor(store: RootStore) {
    this._store = store
    reaction(
      () => this._store.account.activeAccount,
      () => {
        this.load()
      }
    )
  }

  // get transaction by contract address
  getContractTx = async (contractAddress: string) => {
    const txs = await getContractTx(this._store.account.activeAccount.address, contractAddress, getCurrentNet())
    const contractTx = txs
      .filter(tx => {
        try {
          const contract = JSON.parse(tx.extraData!)
          if (contract.action !== 'Transfer' && contract.action !== 'Approve' && contract.action !== 'TransferFrom') {
            return false
          }
          return true
        } catch (err) {
          return false
        }
      })
      .map(tx => {
        return new TransactionModel({
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
      })
    runInAction(() => {
      this._contractTx = contractTx
    })
  }

  @computed
  get createdContract(): ContractModel[] {
    const contracts: ContractModel[] = []
    if (!this._store.account.activeAccount) {
      return contracts
    }
    const accountAddress = this._store.account.activeAccount.address

    this._contract.forEach((contract: ContractModel) => {
      if (contract.owner.toLocaleLowerCase() === accountAddress.toLocaleLowerCase()) {
        contracts.push(contract)
      }
    })

    return contracts.sort((a, b) => a.timestamp - b.timestamp)
  }

  @computed
  get favoriteContract(): ContractModel[] {
    const contracts: ContractModel[] = []
    for (const address of this._favoriteContract.keys()) {
      const contract = this._contract.get(address)!
      const contractWithBalance = ContractModel.fromObj(contract.toJS())
      contractWithBalance.balance = this._favoriteContract.get(address)!
      contracts.push(contractWithBalance)
    }

    return contracts.sort((a, b) => a.timestamp - b.timestamp)
  }

  // current address contract
  get contract(): Map<string, ContractModel> {
    return this._contract
  }

  get contractTx() {
    return this._contractTx.slice().reverse()
  }

  startUpdate() {
    this._store.timer.on('update_contracts', this.updateContractStatus.bind(this), 5000)
    this._store.timer.on('update_contracts_balance', this.updateContractBalance.bind(this), 5000)
  }

  async transferToken(contractAddress: string, to: string, amount: string): Promise<TxResponse> {
    const toAddress = Utils.isHexStrict(to) ? to : `0x${to}`
    const transfer = this._store.dipperin.dr.contract.getTransferCall(contractAddress, toAddress, amount)
    try {
      const transactionFee = this._store.transaction.getTransactionFee(contractAddress, '0', transfer)
      const res = await this._store.transaction.confirmTransaction(contractAddress, '0', transfer, transactionFee)
      if (res.success) {
        return {
          success: true
        }
      } else {
        return {
          success: false,
          info: res.info
        }
      }
    } catch (err) {
      console.error(String(err))
      return {
        success: false,
        info: String(err)
      }
    }
  }

  async approveToken(contractAddress: string, to: string, amount: string): Promise<TxResponse> {
    const toAddress = Utils.isHexStrict(to) ? to : `0x${to}`
    const approve = this._store.dipperin.dr.contract.getApproveCall(contractAddress, toAddress, amount)
    try {
      const transactionFee = this._store.transaction.getTransactionFee(contractAddress, '0', approve)
      const res = await this._store.transaction.confirmTransaction(contractAddress, '0', approve, transactionFee)
      if (res.success) {
        return {
          success: true
        }
      } else {
        return {
          success: false,
          info: res.info
        }
      }
    } catch (err) {
      console.error(String(err))
      return {
        success: false,
        info: String(err)
      }
    }
  }

  async transferFromToken(contractAddress: string, from: string, to: string, amount: string): Promise<TxResponse> {
    const toAddress = Utils.isHexStrict(to) ? to : `0x${to}`
    const approve = this._store.dipperin.dr.contract.getTransferFromCall(contractAddress, from, toAddress, amount)
    try {
      const transactionFee = this._store.transaction.getTransactionFee(contractAddress, '0', approve)
      const res = await this._store.transaction.confirmTransaction(contractAddress, '0', approve, transactionFee)
      if (res.success) {
        return {
          success: true
        }
      } else {
        return {
          success: false,
          info: res.info
        }
      }
    } catch (err) {
      console.error(String(err))
      return {
        success: false,
        info: String(err)
      }
    }
  }

  getCreateContractFee(name: string, symbol: string, total: string, demical: number): string {
    const contract = new ContractModel(name, symbol, total, demical, '', this._store.account.activeAccount.address)
    return this._store.transaction.getTransactionFee(contract.contractAddress, '0', contract.contractData)
  }

  async confirmCreateContract(
    name: string,
    symbol: string,
    total: string,
    demical: number,
    fee: string
  ): Promise<TxResponse> {
    try {
      const contract = new ContractModel(name, symbol, total, demical, '', this._store.account.activeAccount.address)
      const res = await this._store.transaction.confirmTransaction(
        contract.contractAddress,
        '0',
        contract.contractData,
        fee
      )
      if (res.success) {
        contract.txHash = res.hash as string
        runInAction(() => {
          this._contract.set(contract.contractAddress, contract)
        })
        // insert to all contract
        insertContract(contract.toJS(), getCurrentNet())
        return {
          success: true
        }
      } else {
        return {
          success: false,
          info: res.info
        }
      }
    } catch (err) {
      console.error(String(err))
      return {
        success: false,
        info: String(err)
      }
    }
  }

  async addContract(contractAddress: string): Promise<boolean> {
    try {
      const address = Utils.isHexStrict(contractAddress) ? contractAddress : `0x${contractAddress}`

      if (this._favoriteContract.get(address)) {
        return true
      }

      const contract = await this._store.dipperin.dr.contract.getContractDetail(address)
      if (contract && contract.tokenName) {
        const contractInstance = new ContractModel(
          contract.tokenName,
          contract.tokenSymbol,
          contract.tokenTotalSupply,
          contract.tokenDecimals,
          '',
          contract.owner,
          '',
          address,
          new Date().valueOf()
        )
        contractInstance.setSuccess()

        const activeAddress = this._store.account.activeAccount.address

        // this._contractMap.set(address, contractInstance)
        runInAction(() => {
          this._favoriteContract.set(address, '0')
          if (!this._contract.get(address)) {
            this._contract.set(address, contractInstance)
            insertContract(contractInstance.toJS(), getCurrentNet())
          }
        })
        // insert to all contract (fix me: new contract will recover the them same contract address)
        insertFavoriteContract(activeAddress, address, '0', getCurrentNet())
        this.updateContractBalance()
        return true
      } else {
        return false
      }
    } catch (err) {
      console.error(err)
      return false
    }
  }

  @action
  async load() {
    const activeAddress = this._store.account.activeAccount.address
    const contractDb = await getContract(getCurrentNet())
    runInAction(() => {
      this.getContractsFromObj(contractDb).forEach(contract => this._contract.set(contract.contractAddress, contract))
    })
    const favoriteContract = await getFavoriteContract(activeAddress, getCurrentNet())
    runInAction(() => {
      this._favoriteContract = favoriteContract
    })
  }

  clear() {
    this._contract.clear()
    this._favoriteContract.clear()
    this._contractTx = []
  }

  reload() {
    this.clear()
    this.load()
  }

  @action
  updateStatusFromSubscribe(txs: RespTransaction[]) {
    for (const contract of this._contract.values()) {
      if (contract.isSuccess) {
        continue
      }
      for (const tx of txs) {
        if (contract.txHash === tx.transactionHash) {
          contract.setSuccess()
          updateContractStatus(contract.contractAddress, TRANSACTION_STATUS_SUCCESS, getCurrentNet())
        }
      }
    }
  }

  updateContractStatus() {
    this._contract.forEach(contract => {
      if (!contract.isSuccess && !contract.isOverLongTime(getNowTimestamp())) {
        this._store.dipperin.dr.contract
          .getContractDetail(contract.contractAddress)
          .then(res => {
            if (!res || !res.tokenName) {
              if (contract.isOverTime(getNowTimestamp())) {
                contract.setFail()
                // update contract in db
                updateContractStatus(contract.contractAddress, TRANSACTION_STATUS_FAIL, getCurrentNet())
              }
              return
            } else {
              if (res.tokenName) {
                contract.setSuccess()
                // update contract in db
                updateContractStatus(contract.contractAddress, TRANSACTION_STATUS_SUCCESS, getCurrentNet())
              }
            }
          })
          .catch(err => {
            if (contract.isOverTime(new Date().valueOf())) {
              contract.setFail()
              // update contract in db
              updateContractStatus(contract.contractAddress, TRANSACTION_STATUS_FAIL, getCurrentNet())
            }
          })
      }
    })
  }

  updateContractBalance() {
    if (!this._store.account.activeAccount) {
      return
    }
    const accountAddress = this._store.account.activeAccount.address
    for (const address of this._contract.keys()) {
      this._store.dipperin.dr.contract.getContractBalanceByAddress(address, accountAddress, (_, res) => {
        if (res) {
          this._contract.get(address)!.balance = res
          if (this._favoriteContract.get(address)) {
            runInAction(() => {
              this._favoriteContract.set(address, res)
            })
            updateFavoriteContract(accountAddress, address, res, getCurrentNet())
          }
        }
      })
    }
  }

  // add owner address to db
  addOwnerAddressToDb(ownerAddress: string, contractAddress: string) {
    const accountAddress = this._store.account.activeAccount.address
    insertOwnerAddress(accountAddress, contractAddress, ownerAddress, getCurrentNet())
  }

  async getOwnerAddress(contractAddress): Promise<OwnerAddressDb[]> {
    const accountAddress = this._store.account.activeAccount.address
    return getOwnerAddress(accountAddress, contractAddress, getCurrentNet()) || []
  }

  // get allowance by address
  async getAllowance(contractAddress, ownerAddress): Promise<string> {
    let balance = '0'
    const accountAddress = this._store.account.activeAccount.address
    await new Promise(resolve => {
      this._store.dipperin.dr.contract.getContractAllowance(contractAddress, ownerAddress, accountAddress, (_, res) => {
        if (res) {
          balance = res
          resolve()
        }
      })
    })

    return balance
  }

  private getContractsFromObj(contractObj: ContractObj[] = []) {
    return contractObj.map(item => {
      return ContractModel.fromObj(item)
    })
  }
}

export default ContractStore

export interface OwnerAddressDb {
  accountAddress: string
  contractAddress: string
  ownerAddress: string
}
