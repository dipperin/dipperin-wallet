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

export const getVmContract = jest.fn(async => [
  {
    owner: '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28',
    contractAddress: '0x001487e42fbc7234714213a4dd3947cd1378cd28fa8c',
    contractAbi:
      '0x5b0a202020207b0a2020202020202020226e616d65223a2022696e6974222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a2022746f6b656e4e616d65222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a202273796d626f6c222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a2022737570706c79222c0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b5d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a20227472616e73666572222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a2022746f222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a202276616c7565222c0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b5d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a20227472616e7366657246726f6d222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a202266726f6d222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a2022746f222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a202276616c7565222c0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b5d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a2022617070726f7665222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a20227370656e646572222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a202276616c7565222c0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b5d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a20226275726e222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a20225f76616c7565222c0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b5d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a202267657442616c616e6365222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a20226f776e222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a2022222c0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a202020202020202022636f6e7374616e74223a202274727565222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a2022676574417070726f766542616c616e6365222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a202266726f6d222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a2022617070726f766564222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a2022222c0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a202267657442616c616e636541646472222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a20226f776e222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a2022222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d0a20202020202020205d2c0a202020202020202022636f6e7374616e74223a202274727565222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a202273746f70222c0a202020202020202022696e70757473223a205b5d2c0a2020202020202020226f757470757473223a205b5d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a20227374617274222c0a202020202020202022696e70757473223a205b5d2c0a2020202020202020226f757470757473223a205b5d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a20227365744e616d65222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a20202020202020202020202020202020226e616d65223a20225f6e616d65222c0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d0a20202020202020205d2c0a2020202020202020226f757470757473223a205b5d2c0a202020202020202022636f6e7374616e74223a202266616c7365222c0a20202020202020202274797065223a202266756e6374696f6e220a202020207d2c0a202020207b0a2020202020202020226e616d65223a20225472616e666572222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a20202020202020202274797065223a20226576656e74220a202020207d2c0a202020207b0a2020202020202020226e616d65223a2022417070726f76616c222c0a202020202020202022696e70757473223a205b0a2020202020202020202020207b0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a202020202020202020202020202020202274797065223a2022737472696e67220a2020202020202020202020207d2c0a2020202020202020202020207b0a202020202020202020202020202020202274797065223a202275696e743634220a2020202020202020202020207d0a20202020202020205d2c0a20202020202020202274797065223a20226576656e74220a202020207d0a5d',
    status: 'success',
    timestamp: 1565679230213,
    txHash: '0x43906f0ceeb5ad5ab9541967dca92550cb699cef4c5c591822b6ff3c02f6e6de'
  }
])
