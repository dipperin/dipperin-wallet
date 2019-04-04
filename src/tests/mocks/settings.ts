import { WALLET_ID } from '@/utils/constants'

export const get = jest.fn((key: string) => {
  switch (key) {
    case WALLET_ID:
      return '1'
    default:
      return ''
  }
})

export const set = jest.fn()

export default {
  get,
  set
}
