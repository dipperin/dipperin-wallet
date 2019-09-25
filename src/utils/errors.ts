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

interface TxResponse {
  success: boolean
  info?: string
  hash?: string
}

export const generateTxResponse = (ifsuccess: boolean, info?: { message: string } | string | undefined): TxResponse => {
  if (ifsuccess) {
    return { success: true, info: info as string }
  }
  if (info) {
    let errInfo: string
    if (typeof info === 'string') {
      errInfo = info
    } else if (typeof info.message === 'string') {
      errInfo = info.message
    } else {
      errInfo = String(info)
    }
    // const errInfo = typeof(info) === "string" ? info : info.message
    return { success: false, info: errInfo }
  }
  return { success: false, info: TxResponseInfo[TxResponseCode.unknownError] }
}

export default {
  InvalidWalletError,
  NoEnoughBalanceError
}
