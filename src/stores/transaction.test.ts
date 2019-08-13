import mockRoot from '@/tests/mocks/store'
import TransactionStore from './transaction'
import mockTransactions from '@/tests/testData/transactions'

describe('Transaction store', () => {
  let transaction: TransactionStore
  const root = mockRoot(true)

  it('constructor', () => {
    transaction = new TransactionStore(root)
  })

  it('load', async () => {
    await transaction.load()
    expect(transaction.transactionsMap.size).toBe(6)
  })

  it('updateTransactionType', async () => {
    expect(() => {
      transaction.startUpdate()
    }).not.toThrow()
  })

  it('appendTransaction', () => {
    transaction.appendTransaction(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      mockTransactions['0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37']
    )
    expect(transaction.transactionsMap.get('0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37')!.length).toBe(6)
  })

  it('getTransactionFee, no enough balance', () => {
    expect(transaction.getTransactionFee('0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37', '100000', '')).toBe('0')
  })

  it('getTransactionFee', () => {
    root.account.activeAccount.updateBalance('1000000000')
    expect(transaction.getTransactionFee('0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37', '0.000001', '')).toBe('0')
  })

  it('confirmTransaction', async () => {
    root.dipperin.dr.sendSignedTransaction = async () =>
      '0xac3d228d5ca7f38271e32ca5d73f8ee50d33570b3549803100b3c5f1a394bc32'
    const res = await transaction.confirmTransaction(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '0.0001',
      '',
      '0.00001'
    )
    expect(res).toEqual({
      success: true,
      hash: '0xac3d228d5ca7f38271e32ca5d73f8ee50d33570b3549803100b3c5f1a394bc32'
    })
  })

  it('confirmTransaction, error', async () => {
    root.dipperin.dr.sendSignedTransaction = async () => ({ error: { message: 'err' } })
    const res = await transaction.confirmTransaction(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '0.0001',
      '',
      '0.00001'
    )
    expect(res).toEqual({
      success: false,
      info: 'err'
    })
  })

  it('confirmTransaction, no enough balance', async () => {
    root.dipperin.dr.sendSignedTransaction = async () => ({ error: { message: 'err' } })
    const res = await transaction.confirmTransaction(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '100',
      '',
      '0.00001'
    )
    expect(res).toEqual({
      success: false,
      info: 'insufficient balance'
    })
  })
})
