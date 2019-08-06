import { filterTransactions, ReqTransaction, RespTransaction } from './block.worker'

describe('worker: block', () => {
  const reqTransactions: ReqTransaction[] = [
    {
      value: 100,
      nonce: 1,
      // fee: 1,
      from: '0x00009328d55ccb3fce531f199382339f0e576ee840b2',
      to: '0x00009328d55ccb3fce531f199382339f0e576ee840b1',
      tx_id: '1',
      input: ''
    },
    {
      value: 100,
      nonce: 1,
      // fee: 1,
      from: '0x00009328d55ccb3fce531f199382339f0e576ee840b4',
      to: '0x00009328d55ccb3fce531f199382339f0e576ee840b3',
      tx_id: '2',
      input: ''
    }
  ]

  const respTransactions: RespTransaction[] = [
    {
      value: '100',
      nonce: '1',
      // fee: '1',
      from: '0x00009328d55ccb3fce531f199382339f0e576ee840b2',
      to: '0x00009328d55ccb3fce531f199382339f0e576ee840b1',
      transactionHash: '1',
      extraData: '',
      timestamp: 1
    }
  ]
  it('filterTransactions, Req transactions is null', () => {
    expect(filterTransactions(1000000, '0x00009328d55ccb3fce531f199382339f0e576ee840b2', [])).toEqual([])
  })
  it('filterTransactions, The number of Req transactions is not empty, but the number of existing transactions is empty', () => {
    expect(filterTransactions(1000000, '0x00009328d55ccb3fce531f199382339f0e576ee840b2', [], reqTransactions)).toEqual(
      respTransactions
    )
  })

  it('filterTransactions, The number of Req transactions and the number of existing transactions are not empty', () => {
    expect(
      filterTransactions(1000000, '0x00009328d55ccb3fce531f199382339f0e576ee840b2', ['1'], reqTransactions)
    ).toEqual([])
  })
})
