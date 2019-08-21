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

  it('getSignedTransactionData', async () => {
    root.wallet.getPrivateKeyByPath = () => '0x1b2309e66874ea6bd35b7c7c6613b9c43a003076e273ce0dc8e36961a6d2877a'
    root.account.activeAccount.updateBalance('100000000000000000000')
    const res = await transaction.getSignedTransactionData(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '0.00000000000000001',
      '',
      '21000',
      '1'
    )
    expect(res).toBe(
      '0xf867e080960000b4293d60F051936beDecfaE1B85d5A46d377aF3780800a0182520880f844a0fbc079ced7305fdb9e13c074ebfaa325ef6307654840ba1b1149fc433f88393ca05d0e94cc5f414985f506a3833cba34d76ef326b1280e43696566d3100b2594323880'
    )
  })

  it('confirmTransaction', async () => {
    root.wallet.getPrivateKeyByPath = () => '0x1b2309e66874ea6bd35b7c7c6613b9c43a003076e273ce0dc8e36961a6d2877a'
    root.account.activeAccount.updateBalance('100000000000000000000')
    root.dipperin.dr.sendSignedTransaction = async () =>
      '0x22ba8fd210afee8e957b32fb55fe4cd4eb0f59bc2a0f4787627fccd0122f4b04'
    const res = await transaction.confirmTransaction(
      '0x0000b4293d60F051936beDecfaE1B85d5A46d377aF37',
      '0.00000000000000001',
      '',
      '21000',
      '1'
    )
    expect(res).toEqual({
      success: true,
      hash: '0x22ba8fd210afee8e957b32fb55fe4cd4eb0f59bc2a0f4787627fccd0122f4b04'
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
