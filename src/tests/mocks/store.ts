import Account from '@/stores/account'
import Contract from '@/stores/contract'
import Loading from '@/stores/loading'
import Root from '@/stores/root'
import Timer from '@/stores/timer'
import Transaction from '@/stores/transaction'
import Wallet from '@/stores/wallet'

import mockDipperinBuilder from './dipperin'

interface MockRoot extends Root {
  initWallet: (autoInit?: boolean) => Promise<void>
}

const mockRootBuilder = (autoInit?: boolean): MockRoot => {
  const dipperin = mockDipperinBuilder()

  const mockRoot = new Root() as MockRoot

  const mockTime = new Timer()

  const mockWallet = new Wallet(mockRoot)

  const mockAccount = new Account(mockRoot)

  const mockTransaction = new Transaction(mockRoot)

  const mockLoading = new Loading()

  mockRoot.dipperin = dipperin
  mockRoot.timer = mockTime
  mockRoot.wallet = mockWallet
  mockRoot.loading = mockLoading
  mockRoot.account = mockAccount
  mockRoot.transaction = mockTransaction

  const initWallet = async () => {
    // Load Wallet
    await mockRoot.loadData()

    // Unlock Wallet
    mockWallet.unlockWallet('12345678')

    // Init Wallet and destroy mnemonic
    mockWallet.destroyMnemonic()

    // Update account balance
    await mockAccount.updateAccountsBalance()
  }

  mockRoot.initWallet = initWallet

  if (autoInit) {
    initWallet()
  }

  const mockContract = new Contract(mockRoot)
  mockRoot.contract = mockContract
  mockRoot.reconnect = jest.fn()
  return mockRoot
}

// initWallet()

export default mockRootBuilder
