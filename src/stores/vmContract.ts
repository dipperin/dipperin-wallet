import { computed, observable, reaction, runInAction, action } from 'mobx'
import { isString } from 'lodash'

import { insertVmContract, getVmContract, updateVmContractStatus } from '@/db'
import {
  DEFAULT_CHAIN_ID,
  TRANSACTION_STATUS_FAIL,
  TRANSACTION_STATUS_SUCCESS,
  VM_CONTRACT_ADDRESS
} from '@/utils/constants'

import VmContractModel, { VmContractObj } from '../models/vmContract'
import { getCurrentNet } from '../utils/node'
import { getNowTimestamp } from '@/utils'

import RootStore from './root'
import { TxResponse } from './transaction'
import Dipperin, {
  VmContract
  // helper
} from '@dipperin/dipperin.js'
import Receipt from '@/models/receipt'

import Errors from '../utils/errors'

// import ExtraData from './vmTestData'

const HTTPHOST = 'http://localhost:7783'
class VmContractStore {
  private _store: RootStore

  private _dipperin: Dipperin
  // current contract (created & favorite)
  @observable
  private _contract: Map<string, VmContractModel> = new Map()

  @observable
  private _contractTxsMap: Map<string, string[]> = new Map()

  @observable
  private _receipts: Map<string, Receipt[]> = new Map()

  constructor(store: RootStore) {
    this._store = store
    this._dipperin = new Dipperin(HTTPHOST)
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
      let owners: string[]
      if (contract.owner instanceof Array) {
        owners = contract.owner.map((item: string) => item.toLocaleLowerCase())
      } else {
        owners = [contract.owner.toLocaleLowerCase()]
      }
      if (owners.includes(accountAddress.toLocaleLowerCase())) {
        contracts.push(contract)
      }
    })
    console.log('contracts', contracts)

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

  async confirmTransaction(
    address: string,
    amount: string,
    memo: string,
    // fee?: string,
    gas?: string,
    gasPrice?: string
  ): Promise<TxResponse> {
    const privateKey = this._store.wallet.getPrivateKeyByPath(this._store.account.activeAccount.path)
    // console.log('confirmTransaction.............')
    try {
      // const transaction = this.createNewTransaction(address, amount, memo, fee, gas, gasPrice)
      const transaction = this._store.transaction.createNewTransaction(address, amount, memo, gas, gasPrice)
      transaction.signTranaction(privateKey, DEFAULT_CHAIN_ID)
      // console.debug(`tx${JSON.stringify(transaction.toJS())}`)
      // console.dir(transaction.toJS())
      const res = await this._dipperin.dr.sendSignedTransaction(transaction.signedTransactionData)
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
        this._store.transaction.appendTransaction(activeAccountAddress, [transaction.toJS()])
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

  async estimateGas(
    address: string,
    amount: string,
    memo: string,
    // fee?: string,
    gas?: string,
    gasPrice?: string
  ): Promise<TxResponse> {
    const privateKey = this._store.wallet.getPrivateKeyByPath(this._store.account.activeAccount.path)
    try {
      // const transaction = this.createNewTransaction(address, amount, memo, fee, gas, gasPrice)
      const transaction = this._store.transaction.createNewTransaction(address, amount, memo, gas, gasPrice)
      transaction.signTranaction(privateKey, DEFAULT_CHAIN_ID)
      let res
      if (this._store.isRemoteNode) {
        res = await this._store.dipperin.dr.estimateGas(transaction.signedTransactionData)
      } else {
        res = await this._dipperin.dr.estimateGas(transaction.signedTransactionData)
      }
      return {
        success: true,
        info: Number(res).toString()
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

  async createContractEstimateGas(
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

      const res2 = await this.estimateGas(VM_CONTRACT_ADDRESS, amount, contract.contractData, '1', '1')

      return res2
    } catch (err) {
      console.error(String(err))
      return {
        success: false,
        info: String(err)
      }
    }
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
      const callData = Array.prototype.slice.call(Buffer.from(contract.contractData.replace('0x', ''), 'hex'))
      console.log('contractData', callData)
      let res
      if (this._store.isRemoteNode) {
        res = await this._store.transaction.confirmTransaction(
          VM_CONTRACT_ADDRESS,
          amount,
          contract.contractData,
          gas,
          gasPrice
        )
      } else {
        res = await this.confirmTransaction(VM_CONTRACT_ADDRESS, amount, contract.contractData, gas, gasPrice)
      }

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

  addContract(abi: string, address: string): TxResponse {
    const contract = new VmContractModel({
      contractAbi: abi,
      contractAddress: address,
      owner: this._store.account.activeAccount.address,
      status: 'success'
    })
    // console.log('contractData', contract.contractData)
    if (
      this._contract.has(address) &&
      this._contract.get(contract.contractAddress)!.hasOwner(this._store.account.activeAccount.address)
    ) {
      return {
        success: false,
        info: 'The Contract has already existed!'
      }
    } else if (this._contract.has(contract.contractAddress)) {
      this._contract.get(address)!.addOwner(this._store.account.activeAccount.address)
      insertVmContract(this._contract.get(address)!.toJS(), getCurrentNet())
    } else {
      this._contract.set(contract.contractAddress, contract)
      insertVmContract(contract.toJS(), getCurrentNet())
    }
    // insert to all contract
    console.log('after addContract', this._contract.get(address))

    return {
      success: true
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

      const res = await this._store.transaction.confirmTransaction(address, '0', callData, gas, gasPrice)
      if (res.success) {
        const txs = this._contractTxsMap.get(address) || []
        this._contractTxsMap.set(address, [...txs, res.hash as string])
        return {
          success: true,
          info: res.hash
        }
      } else {
        return {
          success: false,
          info: res.info
        }
      }
    } catch (err) {
      return {
        success: false,
        info: String(err)
      }
    }
  }

  async confirmConstantCallContractMethod(
    address: string,
    abi: string,
    methodName: string,
    gas: string,
    gasPrice: string,
    params: string[] = []
  ) {
    try {
      const callData = VmContract.createCallMethod(abi, methodName, ...params)
      const hash = this._store.transaction.getSignedTransactionData(address, '0', callData, gas, gasPrice)
      const res = await this._store.dipperin.dr.callConstFunc(hash, 0)
      return {
        success: true,
        info: res
      }
    } catch (err) {
      return {
        success: false,
        info: String(err)
      }
    }
  }

  @action
  async load() {
    const contractDb = await getVmContract(getCurrentNet())
    console.log('vmContractStore load', contractDb)
    runInAction(() => {
      const removeList: string[] = []
      this.getContractsFromObj(contractDb).forEach(contract => {
        this._contract.set(contract.contractAddress, contract)
        if (this._contract.has(contract.txHash)) {
          removeList.push(contract.txHash)
        }
      })
      removeList.forEach(txHash => this._contract.delete(txHash))
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
    // const newContracts: VmContractModel[] = []
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
                console.log('update contract status.....................')
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
    // console.log('newContracts keys',newContracts.length)
    // newContracts.forEach(contract=>{
    //   console.log('new contract')
    //   if(contract.contractAddress) {
    //     console.log('new contract to _contract')
    //     this._contract.set(contract.contractAddress, contract)
    //     console.log('after casting', this._contract.get(contract.contractAddress))
    //   }
    // })
  }

  private getContractsFromObj(contractObj: VmContractObj[] = []) {
    return contractObj.map(item => {
      return VmContractModel.fromObj(item)
    })
  }
}

export default VmContractStore
