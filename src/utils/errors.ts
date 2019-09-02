export class InvalidWalletError extends Error {
  public name = 'InvalidWalletError'

  constructor() {
    super()
    Object.setPrototypeOf(this, InvalidWalletError.prototype)
    this.message = `The wallet is invalid!`
  }
}

export class NoEnoughBalanceError extends Error {
  public name = 'NoEnoughBalance'

  constructor() {
    super()
    Object.setPrototypeOf(this, NoEnoughBalanceError.prototype)
    this.message = 'insufficient balance'
  }
}

export enum TxResponseCode {
  unknownError
}

export const TxResponseInfo = {
  [TxResponseCode.unknownError]: 'Something wrong!'
}

export const generateTxResponse = (ifsuccess: boolean, errCode?: number) => {
  if (ifsuccess) {
    return { success: true }
  }
  if (errCode) {
    return { success: false, code: errCode, info: TxResponseInfo[errCode] }
  }
  return { success: false, code: TxResponseCode.unknownError, info: TxResponseInfo[TxResponseCode.unknownError] }
}

export default {
  InvalidWalletError,
  NoEnoughBalanceError
}
