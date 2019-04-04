import format from 'date-fns/format'

export const stringMapToPlainObject = (map: Map<string, any>): object => {
  const plainObject = {}
  for (const key of map.keys()) {
    plainObject[key] = map.get(key)
  }
  return plainObject
}

export const plainObjectToStringMap = (obj: object): Map<string, any> => {
  const map = new Map<string, any>()
  for (const key in obj) {
    if (obj[key]) {
      map.set(key, obj[key])
    }
  }

  return map
}

export const thousandBitSeparator = (num: string | number): string => {
  if (!num && num !== '0' && num !== 0) {
    return ''
  }
  const arr = (num + '').split('.')
  arr[0] = arr[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,')
  return arr.join('.')
}

export const isValidPassword = (password: string): boolean => {
  if (/[\s]/.test(password) || !/[a-zA-Z0-9_]|(?=[\\x21-\\x7e]+)/.test(password) || /[\u4e00-\u9fa5]/.test(password)) {
    return false
  }
  return true
}

export const isValidAmount = (amount: string): boolean => {
  if (!/^\d+(\.\d+)?$/.test(amount)) {
    return false
  }
  return true
}

export const formatUTCTime = (time: string) => {
  if (!time) {
    return ''
  }
  const date = new Date(Number(time.substr(0, 13)))
  return format(date, 'YYYY-MM-DD HH:mm:ss A+UTC')
}

export const isAlpha = version => version.includes('alpha')

export const isURL = url => {
  return /^((ht|f)tps?)(ws?):\/\/(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(
    url
  )
}

export const getContractAmount = (extraData): string => {
  try {
    const extraObj = JSON.parse(extraData)
    const params = JSON.parse(extraObj.params)
    const index = extraObj.action === 'TransferFrom' ? 2 : 1
    return String(Number(params[index]))
  } catch (err) {
    return '0'
  }
}

export const getContractType = (extraData): string => {
  try {
    const extraObj = JSON.parse(extraData)
    return extraObj.action
  } catch (err) {
    return ''
  }
}

export const showContractFrom = (tx): string => {
  try {
    const extraObj = JSON.parse(tx.extraData)
    const params = JSON.parse(extraObj.params)
    if (extraObj.action === 'TransferFrom') {
      return params[0]
    }
    return tx.from
  } catch (_) {
    return tx.from
  }
}

export const showContractTo = (tx): string => {
  try {
    const extraObj = JSON.parse(tx.extraData)
    const params = JSON.parse(extraObj.params)
    const index = extraObj.action === 'TransferFrom' ? 1 : 0

    return params[index]
  } catch (_) {
    return tx.to
  }
}

export const getNowTimestamp = (): number => {
  return new Date().valueOf()
}
