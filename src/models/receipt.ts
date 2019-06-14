export default interface Receipt {
  transactionHash: string
  gasUsed: number
  logs: Log[]
}

interface Log {
  topicName: string
  blockNumber: number
  data: string
}
