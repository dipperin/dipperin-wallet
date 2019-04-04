import accounts from '../testData/accounts'
import wallet from '../testData/wallet'
import transactions, { contractTx } from '../testData/transactions'
import contracts from '../testData/contracts'

export const getAccount = jest.fn(() => {
  return accounts
})

export const insertAccount = jest.fn()

export const getTx = jest.fn((address: string) => {
  return transactions[address] || []
})

export const getContractTx = jest.fn(() => contractTx)

export const insertTx = jest.fn()

export const updateTx = jest.fn()

export const insertWallet = jest.fn()

export const getWallet = jest.fn(() => {
  return wallet
})

export const getActiveId = jest.fn()

export const getErrTimes = jest.fn()

export const getLockTime = jest.fn()

export const updateLockTime = jest.fn()

export const updateActiveId = jest.fn()

export const updateErrTimes = jest.fn()

export const insertContract = jest.fn()

export const updateContractStatus = jest.fn()

export const getContract = jest.fn(() => contracts)

export const insertFavoriteContract = jest.fn()

export const updateFavoriteContract = jest.fn()

export const getFavoriteContract = jest.fn(() => {
  const res = new Map()
  contracts.forEach(contract => {
    res.set(contract.contractAddress, contract.balance)
  })
  return res
})

export const insertOwnerAddress = jest.fn()

export const getOwnerAddress = jest.fn(async => [
  {
    accountAddress: '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
    contractAddress: '0x00100e99f3acc2864f153b4977FF2575d362209661AC',
    ownerAddress: '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28'
  }
])

export const resetDB = jest.fn()
