import AccountStore from './account'
import mockRoot from '@/tests/mocks/store'
import { Utils } from '@dipperin/dipperin.js'

describe('stores/account', () => {
  let account: AccountStore
  const root = mockRoot()
  // account = new AccountStore(root)
  // account.load()
  it('constructor', () => {
    expect(() => {
      account = new AccountStore(root)
    }).not.toThrow()
  })

  it('load', async () => {
    await account.load()
    expect(account.accounts.length).toBe(6)
    expect(account.accountMap.size).toBe(6)
  })

  // it("addAccount, throw when wallet doesn't unlock", () => {
  //   expect(() => {
  //     account.addAccount()
  //   }).toThrow()
  // })

  it('addAccount, No error is thrown when the wallet has been loaded and unlocked.', async () => {
    expect.assertions(2)
    await root.initWallet()
    account.addAccount()
    expect(account.accounts.length).toBe(7)
    expect(account.accountMap.size).toBe(7)
  })

  it('changeActiveAccount', () => {
    account.changeActiveAccount(account.accounts[1].id)
    expect(account.activeAccount).toEqual(account.accounts[1])
  })

  it('updateAccountsBalance', async () => {
    await account.updateAccountsBalance(account.accounts[0].id)
    expect(account.accounts[0].balanceUnit).toBe(Utils.toUnit('10000'))
    await account.updateAccountsBalance()
    account.accounts.forEach(acc => {
      expect(acc.balanceUnit).toEqual(Utils.toUnit('10000'))
    })
  })

  it('updateAccountsNonce', async () => {
    await account.updateAccountsNonce(account.accounts[0].id)
    expect(account.accounts[0].nonce).toEqual('12')

    await account.updateAccountsNonce()
    account.accounts.forEach(acc => {
      expect(acc.nonce).toEqual('12')
    })
  })
})
