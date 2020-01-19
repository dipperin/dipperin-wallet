// import WalletModel, { WalletObj } from './wallet'
import BIP39 from 'bip39'
// import { Accounts } from '@dipperin/dipperin.js'

// describe('WalletModel', () => {
//   const obj: WalletObj = {
//     walletId: 1,
//     activeAccountId: '1',
//     encryptSeed: undefined,
//     unlockErrTimes: 1,
//     lockTime: '1'
//   }
//   const wallet = new WalletModel(obj)
//   it('construct', () => {
//     expect(wallet.toJS()).toEqual(obj)
//   })
//   it('clear', () => {
//     wallet.clear()
//     expect(wallet.encryptSeed).toBe(undefined)
//   })
// })

// describe('WalletModel', () => {
//   const password = '12345678'
//   const mnemonic = 'unusual drastic patrol mansion fuel more obey acquire disagree head trip chat'
//   const seed = `0x${BIP39.mnemonicToSeedHex(mnemonic)}`
//   const hdAccount = Accounts.create(seed)
//   // save encrypt seed, an then clear password and mnemonic
//   const encryptSeed = hdAccount.encrypt(password)
//   const obj: WalletObj = {
//     encryptSeed,
//     walletId: 1,
//     activeAccountId: '1',
//     unlockErrTimes: 1,
//     lockTime: '1'
//   }
//   const wallet = new WalletModel(obj)
//   it('construct', () => {
//     expect(wallet.toJS()).toEqual(obj)
//   })
//   it('clear', () => {
//     wallet.clear()
//     expect(wallet.encryptSeed).toBe(undefined)
//   })
// })

describe('aa', () => {
  it('seed', () => {
    const seed = BIP39.mnemonicToSeedHex(
      'unusual drastic patrol mansion fuel more obey acquire disagree head trip chat'
    )
    expect(seed).toBe(
      '2da41ba5e1627fa7f1f5c2d293c0ea427f5372f14884a52065751271b8861b6d392b376f6e00420dd0d25b058a1292752b9f915db7e486af2e350b60276c8921'
    )
  })
})
