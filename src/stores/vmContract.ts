import { computed, observable, reaction, runInAction, action } from 'mobx'

import { insertVmContract, getVmContract, updateVmContractStatus } from '@/db'
import { TRANSACTION_STATUS_FAIL, TRANSACTION_STATUS_SUCCESS, VM_CONTRACT_ADDRESS } from '@/utils/constants'

import VmContractModel, { VmContractObj } from '../models/vmContract'
import { getCurrentNet } from '../utils/node'
import { getNowTimestamp } from '@/utils'
import RootStore from './root'
import { TxResponse } from './transaction'
import { VmContract } from '@dipperin/dipperin.js'
import Receipt from '@/models/receipt'

class VmContractStore {
  private _store: RootStore

  // current contract (created & favorite)
  @observable
  private _contract: Map<string, VmContractModel> = new Map()

  @observable
  private _contractTxsMap: Map<string, string[]> = new Map()

  @observable
  private _receipts: Map<string, Receipt[]> = new Map()

  constructor(store: RootStore) {
    this._store = store
    reaction(
      () => this._store.account.activeAccount,
      () => {
        this.load()
      }
    )
  }

  @computed
  get contracts(): VmContractModel[] {
    const contracts: VmContractModel[] = []
    if (!this._store.account.activeAccount) {
      return contracts
    }
    const accountAddress = this._store.account.activeAccount.address

    this._contract.forEach((contract: VmContractModel) => {
      if (contract.owner.toLocaleLowerCase() === accountAddress.toLocaleLowerCase()) {
        contracts.push(contract)
      }
    })

    return contracts.sort((a, b) => a.timestamp - b.timestamp)
  }

  // current address contract
  get contract() {
    return this._contract
  }

  get receipts() {
    return this._receipts
  }

  startUpdate() {
    this._store.timer.on('update_vmContracts', this.updateContractStatus.bind(this), 5000)
    this._store.timer.on('update_vmContracts_receipts', this.getContractReceipt.bind(this), 3000)
  }

  async confirmCreateContract(
    code: string,
    abi: string,
    gas: string,
    gasPrice: string,
    amount: string,
    params?: string[]
  ): Promise<TxResponse> {
    try {
      const contract = new VmContractModel({
        contractCode: code,
        contractAbi: abi,
        initParams: params,
        owner: this._store.account.activeAccount.address
      })

      const res = await this._store.transaction.confirmTransaction(
        VM_CONTRACT_ADDRESS,
        amount,
        contract.contractData,
        '0',
        gas,
        gasPrice
      )
      if (res.success) {
        contract.txHash = res.hash as string
        runInAction(() => {
          this._contract.set(contract.txHash, contract)
        })
        // insert to all contract
        insertVmContract(contract.toJS(), getCurrentNet())
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

  async confirmCallContractMethod(
    address: string,
    abi: string,
    methodName: string,
    gas: string,
    gasPrice: string,
    params: string[] = []
  ) {
    try {
      const callData = VmContract.createCallMethod(abi, methodName, ...params)

      const res = await this._store.transaction.confirmTransaction(address, '0', callData, '0', gas, gasPrice)
      if (res.success) {
        const txs = this._contractTxsMap.get(address) || []
        this._contractTxsMap.set(address, [...txs, res.hash as string])
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

  @action
  async load() {
    const contractDb = await getVmContract(getCurrentNet())
    runInAction(() => {
      this.getContractsFromObj(contractDb).forEach(contract => this._contract.set(contract.contractAddress, contract))
    })
  }

  clear() {
    this._contract.clear()
  }

  reload() {
    this.clear()
    this.load()
  }

  getContractReceipt() {
    this._contractTxsMap.forEach(async (txs, address) => {
      const removeTxs = await Promise.all(
        txs.map(async tx => {
          try {
            const res = await this._store.dipperin.dr.vmContract.getReceiptByTxHash(tx)
            if (res) {
              console.log(res)
              const preReceipts = this._receipts.get(address) || []
              preReceipts.push(res)
              this._receipts.set(address, preReceipts)
              return tx
            }
            return
          } catch (err) {
            return
          }
        })
      )
      const newTxs = txs.filter(tx => !removeTxs.find(t => tx === t))
      this._contractTxsMap.set(address, newTxs)
    })
  }

  updateContractStatus() {
    this._contract.forEach(contract => {
      if (!contract.isSuccess && !contract.isOverLongTime(getNowTimestamp())) {
        this._store.dipperin.dr.vmContract
          .getContractByHash(contract.txHash)
          .then(res => {
            if (!res) {
              if (contract.isOverTime(getNowTimestamp())) {
                contract.setFail()
                // update contract in db
                updateVmContractStatus(
                  contract.txHash,
                  TRANSACTION_STATUS_FAIL,
                  contract.contractAddress,
                  getCurrentNet()
                )
              }
              return
            } else {
              if (res) {
                contract.contractAddress = res
                contract.setSuccess()
                // update contract in db
                updateVmContractStatus(
                  contract.txHash,
                  TRANSACTION_STATUS_SUCCESS,
                  contract.contractAddress,
                  getCurrentNet()
                )
              }
            }
          })
          .catch(err => {
            if (contract.isOverTime(new Date().valueOf())) {
              contract.setFail()
              // update contract in db
              updateVmContractStatus(
                contract.txHash,
                TRANSACTION_STATUS_FAIL,
                contract.contractAddress,
                getCurrentNet()
              )
            }
          })
      }
    })
  }

  private getContractsFromObj(contractObj: VmContractObj[] = []) {
    return contractObj.map(item => {
      return VmContractModel.fromObj(item)
    })
  }
}

export default VmContractStore
