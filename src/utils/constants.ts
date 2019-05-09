export const LOCALHOST = 'ws://localhost:8893'

/**
 * Settings
 */
export const WALLET_ID = 'walletId'
export const IS_REMOTE = 'isRemote'

/**
 * Wallet
 */

export const DEFAULT_ERR_TIMES = 0
export const DEFAULT_LOCK_TIME = ''
export const LOCKTIMES = 8 // wrong password times

/**
 * Account
 */

export const ACCOUNTS_PATH = `m/44'/709394'/0'/0`
export const FIRST_ACCOUNT_ID = '1'

/**
 * Transaction
 */

export const DEFAULT_HASH_LOCK = ''
export const DEFAULT_CHAIN_ID = '0x01'

export const TRANSACTION_STATUS_PENDING = 'pending'
export const TRANSACTION_STATUS_SUCCESS = 'success'
export const TRANSACTION_STATUS_FAIL = 'fail'

export const TRANSACTION_LIMIT_TIME = 600000

/**
 * Contract
 */

/**
 * DB
 */

export const ACCOUNT_DB = 'account'
export const TRANSACTION_DB = 'transaction'
export const WALLET_DB = 'wallet'
export const CONTRACT_DB = 'contract'
export const FAVORITE_CONTRACT = 'favoriteContract'
export const OWNER_DB = 'owner'

/**
 * Worker
 */

export const FILTER_TRANSACTIONS_REQ = 'FILTER_TRANSACTIONS_REQ'
export const FILTER_TRANSACTIONS_RESP = 'FILTER_TRANSACTIONS_RESP'

/**
 * IPC
 */

export const NODE_RESTART_SUCCESS = 'nodeRestartSuccess'
export const UPDATE_VERSION = 'updateVersion'
export const SET_NODE_NET = 'setNodeNet'
export const UPDATE_NODE = 'updateNode'
export const DOWNLOAD_PROGRESS = 'downloadProgress'

export const UPDATED = 'updated'
export const NET_ENV = 'netEnv'

export const OPEN_TMP = 'openTmp'
export const OPEN_DIPPERIN = 'openDipperin'

export const START_NODE = 'startNode'
export const STOP_NODE = 'stopNode'
export const START_SUCCESS = 'startSucces'
/**
 * node net
 */

export const DEFAULT_NET = 'mercury'

export const MERCURY = 'mercury'
export const TEST = 'test'
export const LOCAL = 'local'

export const REMOTE_TEST = 'remoteTest'
export const REMOTE_MECURY = 'remoteMecury'

/**
 * net/host obj
 */
export const NET_HOST_OBJ = {
  [REMOTE_TEST]: 'http://172.16.5.201:3035',
  [REMOTE_MECURY]: 'http://14.17.65.122:3035'
}
/**
 * timer event name
 */
export enum TIMET_NAME {
  CONNECTING = 'connecting'
}
