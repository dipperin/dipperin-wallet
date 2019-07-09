import { FILTER_TRANSACTIONS_REQ, FILTER_TRANSACTIONS_RESP } from '@/utils/constants'

const ctx = self as any

export interface ReqTransaction {
  value: number
  nonce: number
  // fee: number
  from: string
  to: string
  tx_id: string
  input: string
}

export interface RespTransaction {
  value: string
  nonce: string
  to: string
  from: string
  // fee: string
  transactionHash: string
  timestamp: number
  extraData?: string
  status?: string
}

ctx.addEventListener('message', (event: MessageEvent) => {
  const { data } = event
  switch (data.type) {
    case FILTER_TRANSACTIONS_REQ:
      const txs = filterTransactions(data.timestamp, data.account.toLocaleLowerCase(), data.alreadyHaveTxs, data.txs)
      if (txs.length > 0) {
        // Because the update of the balance is polled,
        // in order to avoid the transaction jump faster than the balance,
        // the update is delayed.
        setTimeout(() => {
          ctx.postMessage({
            type: FILTER_TRANSACTIONS_RESP,
            txs,
            address: data.account
          })
        }, 3000)
      }
      return
  }
})

export const filterTransactions = (
  timestamp: number,
  account: string,
  alreadyHaveTxs: string[],
  txs?: ReqTransaction[]
): RespTransaction[] => {
  if (!txs) {
    return []
  }
  return txs
    .filter(tx => {
      if (tx.from !== account && tx.to !== account) {
        return false
      }

      return alreadyHaveTxs.every(aTx => aTx !== tx.tx_id)
    })
    .map(
      (tx): RespTransaction => {
        return {
          value: tx.value.toString(),
          nonce: tx.nonce.toString(),
          to: tx.to,
          from: tx.from,
          // fee: tx.fee.toString(),
          transactionHash: tx.tx_id,
          timestamp: parseInt((timestamp / 1000000).toFixed(0), 10),
          extraData: tx.input
        }
      }
    )
}
