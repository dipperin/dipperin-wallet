import mockRoot from '@/tests/mocks/store'
import ContractStore from './contract'
import { contractTx } from '@/tests/testData/transactions'
import { insertOwnerAddress } from '@/tests/mocks/db'

describe('contractStore', () => {
  let contract: ContractStore
  const root = mockRoot(true)

  it('constructor', () => {
    expect(() => {
      contract = new ContractStore(root)
    }).not.toThrow()
  })

  contract = new ContractStore(root)

  it('load', async () => {
    await contract.load()
    expect(contract.contract.size).toBe(2)
    expect(contract.favoriteContract.length).toBe(2)
    expect(contract.createdContract.length).toBe(2)
    expect(contract.contractTx.length).toBe(0)
  })

  it('getContractTx', async () => {
    await contract.getContractTx('0x0010f083e9334Dcf865fa99Fbb2965b6C6BEfb94635c')
    expect(contract.contractTx.length).toBe(2)
  })

  it('startUpdate', () => {
    const mockTimer = jest.spyOn(root.timer, 'on')
    contract.startUpdate()
    expect(mockTimer).toBeCalledTimes(2)
  })

  it('transferToken success', async () => {
    root.dipperin.dr.sendSignedTransaction = jest.fn(
      async () => '0x7b40ffe1582f3675205d46bef852d7776569490a53b1efdc3fdb26bfab126515'
    )
    const res = await contract.transferToken(
      '0x0010f083e9334Dcf865fa99Fbb2965b6C6BEfb94635c',
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '100'
    )
    expect(res).toEqual({ success: true })
  })

  it('transferToken failure', async () => {
    root.dipperin.dr.sendSignedTransaction = jest.fn(async () => ({ error: { message: 'error' } }))
    const res = await contract.transferToken(
      '0x0010f083e9334Dcf865fa99Fbb2965b6C6BEfb94635c',
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '100'
    )
    expect(res).toEqual({ success: false, info: 'error' })
  })

  it('approveToken, success', async () => {
    root.dipperin.dr.sendSignedTransaction = jest.fn(
      async () => '0xc1ac4095e13915358d49d2663946a7f4a7da49cd75a5fa656c102571b5147954'
    )
    const res = await contract.approveToken(
      '0x0010f083e9334Dcf865fa99Fbb2965b6C6BEfb94635c',
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '100'
    )
    expect(res).toEqual({ success: true })
  })

  it('approveToken, failure', async () => {
    root.dipperin.dr.sendSignedTransaction = jest.fn(async () => ({ error: { message: 'error' } }))
    const res = await contract.approveToken(
      '0x0010f083e9334Dcf865fa99Fbb2965b6C6BEfb94635c',
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '100'
    )
    expect(res).toEqual({ success: false, info: 'error' })
  })

  it('transferFromToken success', async () => {
    root.dipperin.dr.sendSignedTransaction = jest.fn(
      async () => '0x36248eec4c88ddf98b6433d54b6170184f28ac6a6b1b8da441047ca0cae499f3'
    )
    const res = await contract.transferFromToken(
      '0x0010f083e9334Dcf865fa99Fbb2965b6C6BEfb94635c',
      '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28',
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '100'
    )
    expect(res).toEqual({ success: true })
  })

  it('transferFromToken failure', async () => {
    root.dipperin.dr.sendSignedTransaction = jest.fn(async () => ({ error: { message: 'error' } }))
    const res = await contract.transferFromToken(
      '0x0010f083e9334Dcf865fa99Fbb2965b6C6BEfb94635c',
      '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28',
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '100'
    )
    expect(res).toEqual({ success: false, info: 'error' })
  })

  it('getCreateContractFee', () => {
    const res = contract.getCreateContractFee('test', 't', '1000', 2)
    expect(res).toBe('0.0000465')
  })

  it('confirmCreateContract, success', async () => {
    jest.mock('@/utils', () => {
      return {
        getNowTimestamp: jest.fn(() => 1550732498416)
      }
    })

    // root.dipperin.dr.sendSignedTransaction = jest.fn(
    //   async () => '0xd3c012a4f219bc4e786e399e666a9beb557a99598e7bc9a6d6e3bdaf3584fcc6'
    // )

    // const res = await contract.confirmCreateContract('test', 't', '1000', 2, '0.00001')
    // expect(res).toBe({ success: true })
  })

  it('confirmCreateContract, failure', async () => {
    root.dipperin.dr.sendSignedTransaction = jest.fn(async () => ({ error: { message: 'error' } }))
    const res = await contract.confirmCreateContract('test', 't', '1000', 2, '0.00001')
    expect(res).toEqual({ success: false, info: 'error' })
  })

  it('addContract', async () => {
    const res = await contract.addContract('0x0010ee7802E0fdF0ea4D58257D70527DFF7922eF1c65')
    expect(contract.contract.size).toBe(3)
    expect(contract.favoriteContract.length).toBe(3)
    expect(res).toBe(true)
  })

  it('updateStatusFromSubscribe', () => {
    contract.updateStatusFromSubscribe(contractTx)
    for (const con of contract.contract.values()) {
      expect(con.status).toBe('success')
    }
  })

  it('updateContractStatus', async () => {
    // reload contract
    await contract.load()
    await contract.updateContractStatus()
    expect(contract.contract.get('0x00100e99f3acc2864f153b4977FF2575d362209661AC')!.isSuccess).toEqual(false)
    expect(contract.contract.get('0x0010f083e9334Dcf865fa99Fbb2965b6C6BEfb94635c')!.isSuccess).toEqual(true)
  })

  it('updateContractBalance', async () => {
    root.dipperin.dr.contract.getContractBalanceByAddress = jest.fn().mockImplementation((arg1, arg2, cb) => {
      cb('', '1000')
    })
    await contract.updateContractBalance()
    contract.contract.forEach(con => {
      expect(con.balance).toBe('1000')
    })
  })

  it('addOwnerAddressToDb', () => {
    insertOwnerAddress.mockClear()
    contract.addOwnerAddressToDb(
      '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28',
      '0x00100e99f3acc2864f153b4977FF2575d362209661AC'
    )
    expect(insertOwnerAddress.mock.calls[0]).toEqual([
      '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28',
      '0x00100e99f3acc2864f153b4977FF2575d362209661AC',
      '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28',
      null
    ])
  })

  it('getOwnerAddress', async () => {
    const res = await contract.getOwnerAddress('0x00100e99f3acc2864f153b4977FF2575d362209661AC')
    expect(res).toEqual([
      {
        accountAddress: '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
        contractAddress: '0x00100e99f3acc2864f153b4977FF2575d362209661AC',
        ownerAddress: '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28'
      }
    ])
  })

  it('getAllowance', async () => {
    root.dipperin.dr.contract.getContractAllowance = jest.fn().mockImplementation(async (arg1, arg2, arg3, cb) => {
      cb('', '1000')
    })
    const res = await contract.getAllowance(
      '0x00005a9306610b1f2c89a7186B79905FfcB4D87fbC28',
      '0x00100e99f3acc2864f153b4977FF2575d362209661AC'
    )
    expect(res).toBe('1000')
  })
})
