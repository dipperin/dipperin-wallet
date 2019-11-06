import React from 'react'
import { RouteComponentProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import { observable, action, runInAction, reaction } from 'mobx'

import { withStyles, WithStyles } from '@material-ui/core/styles'
import WalletStore from '@/stores/wallet'
import RootStore from '@/stores/root'
import AccountStore from '@/stores/account'
// import { Accounts, AccountObject } from '@dipperin/dipperin.js'
import {
  sendStartMineNode,
  sendStopNode,
  onceStartMinerNodeSuccess,
  onceStartMinerNodeFailure,
  removeOnceStartMinerNodeSuccess,
  removeOnceStartMinerNodeFailure
} from '@/ipc'
import { sleep } from '@/utils'
import { Utils } from '@dipperin/dipperin.js'

import Something from './something'

import styles from './mineStyles'
// import { csWallet } from '@/tests/testData/cswallet'
// import BN from 'bignumber.js'

const FAILURE_TIMES = 5
const LONG_TIMEOUT = 15000
const DEFAULT_WAIT_TIME = 1500
const DEFAULT_TIMEOUT = 5000

interface Props {
  wallet: WalletStore
  root: RootStore
  account: AccountStore
}

@inject('root', 'wallet', 'account')
@observer
export class Mine extends React.Component<RouteComponentProps<{}> & WithStyles<typeof styles> & Props> {
  @observable
  queryAddress: string = ''
  @observable
  nonce: string = ''
  // FIXME: move to store
  @observable
  mining: boolean | undefined = false
  @observable
  mineBalance: string = ''
  @observable
  updateMineBalanceTimer: NodeJS.Timeout | undefined
  @observable
  showTips: boolean = false

  @action
  handleChandeQueryAddress = (e: React.ChangeEvent<{ value: string }>) => {
    this.queryAddress = e.target.value
  }

  @action
  handleChandeNonce = (e: React.ChangeEvent<{ value: string }>) => {
    this.nonce = e.target.value
  }

  @action
  setShowTips(flag: boolean) {
    this.showTips = flag
  }

  // @action
  // setMining = (flag: boolean | undefined) => {
  //   this.mining = flag
  // }

  @action
  setMineBalance = (num: string) => {
    if (num.match(/^([0-9]+(\.[0-9]{1,6})?)/)) {
      this.mineBalance = num.match(/^([0-9]+(\.[0-9]{1,6})?)/)![0]
    }
  }

  @action
  setUpdateMineBalanceTimer = (timer: NodeJS.Timeout) => {
    this.updateMineBalanceTimer = timer
  }

  constructor(props) {
    super(props)

    if (this.props.wallet.mineState === 'mining') {
      this.updateMineBalance()
    }

    reaction(
      () => this.props.wallet.mineState,
      mineState => {
        if (mineState === 'mining') {
          if (this.updateMineBalanceTimer) {
            clearInterval(this.updateMineBalanceTimer)
          }
          this.updateMineBalance()
        } else if (mineState === 'stop') {
          if (this.updateMineBalanceTimer) {
            clearInterval(this.updateMineBalanceTimer)
          }
        }
      }
    )
  }

  componentWillUnmount() {
    if (this.updateMineBalanceTimer !== undefined) {
      clearInterval(this.updateMineBalanceTimer)
      this.updateMineBalanceTimer = undefined
    }
  }

  handleStartMinerNode = () => {
    if (this.mining === false) {
      this.props.wallet.setMineState('loading')
      if (this.props.root.isConnecting) {
        // stop node
        sendStopNode()
        this.props.root.stopConnectNode()
      }
      sendStartMineNode()
      // this.props.wallet.startMine()
      onceStartMinerNodeSuccess(() => {
        console.log('启动矿工节点成功')
        this.props.root.reconnect()
        this.props.wallet.setMineState('mining')
        this.props.root.dipperin.net.isConnecting().then((res: boolean) => {
          console.log('isConnecting', res)
        })
      })
      onceStartMinerNodeFailure(this.handleStartNodeFailure)
    }
  }

  // ******************* handle the miner master *************************************

  private stopNode = async () => {
    try {
      sendStopNode()
      this.props.root.stopConnectNode()
    } catch (e) {
      console.log(e.message)
    }
    await sleep(DEFAULT_WAIT_TIME)
  }

  /**
   * when the node stop, start mine master
   */
  private startMineMaster = (success: () => void, fail: () => void, timeout?: () => void) => {
    sendStartMineNode()
    // this.props.wallet.startMine()
    const timeoutTimer = setTimeout(() => {
      if (timeout) {
        timeout()
      } else {
        fail()
      }
      removeOnceStartMinerNodeSuccess()
      removeOnceStartMinerNodeFailure()
    }, LONG_TIMEOUT)
    onceStartMinerNodeSuccess(() => {
      clearTimeout(timeoutTimer)
      success()
    })
    onceStartMinerNodeFailure(() => {
      clearTimeout(timeoutTimer)
      fail()
    })
  }

  private handleStartNodeSuccess = async () => {
    console.log('启动矿工节点成功')
    this.props.root.reconnect()
    // try serveral times startMine
    await sleep(DEFAULT_WAIT_TIME)
    let failureTimes = 0
    while (failureTimes < FAILURE_TIMES) {
      const result = await this.sendStartMineCommand()
      if (result) {
        this.props.wallet.setMineState('mining')
        return
      } else {
        failureTimes += 1
      }
      await sleep(DEFAULT_TIMEOUT)
    }
    this.props.wallet.setMineState('stop')
    console.log('try times out, fail to start Mine')
  }

  private handleStartNodeFailure = () => {
    console.log('启动矿工节点失败')
    this.props.wallet.setMineState('stop')
  }

  private handleStartMinerNodeTimeout = () => {
    console.log('启动矿工节点超时')
    this.props.wallet.setMineState('stop')
  }

  handleStartMine = async () => {
    // start loading
    this.props.wallet.setMineState('loading')
    // 1. try to send startMine command
    try {
      await this.props.wallet.startMine()
      this.props.wallet.setMineState('mining')
    } catch (e) {
      switch (e.message) {
        case `Returned error: "miner is mining"`:
          console.log(`miner is mining`)
          this.props.wallet.setMineState('mining')
          break
        case `Returned error: "current node is not mine master"`:
          console.log(`current node is not mine master"`)
          // 1. try to set up the mine master
          await this.stopNode()
          this.startMineMaster(
            this.handleStartNodeSuccess,
            this.handleStartNodeFailure,
            this.handleStartMinerNodeTimeout
          )
          break
        case `CONNECTION ERROR: Couldn't connect to node ws://localhost:8893.`:
          console.log(`could not connect note`)
          this.startMineMaster(
            this.handleStartNodeSuccess,
            this.handleStartNodeFailure,
            this.handleStartMinerNodeTimeout
          )
          break
        default:
          console.log(e.message)
      }
    }
  }

  sendStartMineCommand = async () => {
    try {
      const isConnecting = await this.props.root.dipperin.net.isConnecting()
      if (isConnecting) {
        await this.props.wallet.startMine()
        // FIXME: debug
        console.log('start Mine success')
        return true
      } else {
        console.log('the net is unconnecting')
        return false
      }
    } catch (e) {
      console.log('sendStartMineCommand error:', e.message)
      return false
    }
  }

  handleStopMine = () => {
    try {
      this.props.wallet.stopMine()
      this.props.wallet.setMineState('stop')
    } catch (e) {
      switch (e.message) {
        case `Returned error: "mining had been stopped"`:
          console.log('mining had been stopped')
          this.props.wallet.setMineState('stop')
          break
        default:
          console.log(e.message)
      }
    }
  }

  // *************************************** handle miner account ***************************************************

  testAccount = '0x00008d3EEd5fb2dB537919AdCC04c6a22d2ECaa9E634'
  // testAccount = `0x0000fA5e0e6D1548CfAdB2A4AAC8d73ceF3A64C69be7`

  private getBalanceAndUpdate = async () => {
    try {
      const response = (await this.props.wallet.queryBalance(this.testAccount)) || '0'
      console.log(response)
      this.setMineBalance(Utils.fromUnit(response))
    } catch (e) {
      console.log(`updateMineBalance error:`, e.message)
    }
  }

  updateMineBalance = () => {
    this.getBalanceAndUpdate()
    const timer: NodeJS.Timeout = setInterval(() => {
      console.log(`updateBalance`)
      this.getBalanceAndUpdate()
    }, LONG_TIMEOUT)
    this.setUpdateMineBalanceTimer(timer)
  }

  handleQueryBalance = async () => {
    const response = await this.props.wallet.queryBalance(this.queryAddress)
    console.log(response)
  }

  handleWithdrawBalance = async () => {
    try {
      const curAddress = this.props.account.activeAccount.address
      console.log(curAddress)
      // const response = (await this.props.wallet.queryBalance(this.testAccount)) || '0'
      const value = 100000000000000000000
      const nonce = await this.props.wallet.getAccountNonce(this.testAccount)
      console.log(value)
      const result = await this.props.wallet.withdrawBalance(this.testAccount, curAddress, value, 1, Number(nonce))
      runInAction(() => {
        this.nonce = String(Number(nonce) + 1)
      })
      console.log(`handleWithdrawBalance`, result)
    } catch (e) {
      switch (e.message) {
        case `Returned error: "this transaction already in tx pool"`:
          console.log('this transaction already in tx pool')
          break
        default:
          console.log(`handleWithdrawBalance error:`, e.message)
      }
    }
  }

  render() {
    const { classes, wallet } = this.props
    return (
      <div className={classes.main}>
        <div className={`${wallet.mineState === 'mining' ? classes.smallBackgroundMining : classes.smallBackground}`} />

        {wallet.mineState !== 'mining' && (
          <button className={`${classes.btn} ${classes.mineBtn}`} onClick={this.handleStartMine}>
            {wallet.mineState === 'stop' && `一键挖矿`}
            {wallet.mineState === 'loading' && `启动中`}
          </button>
        )}
        {wallet.mineState === 'mining' && (
          <button
            className={`${classes.btn} ${classes.mineBtn}`}
            style={{ background: '#BEC0C6' }}
            onClick={this.handleStopMine}
          >
            {`停止挖矿`}
          </button>
        )}
        <span className={classes.mineTips} onClick={this.setShowTips.bind(this, true)} />

        <div className={classes.mineBalanceLabel}>
          <span>挖矿奖励</span>
        </div>
        <div className={`${classes.input} ${classes.balanceDisplay}`}>{this.mineBalance || '0'} DIP</div>
        <button className={`${classes.btn} ${classes.withdrawBalance}`} onClick={this.handleWithdrawBalance}>
          提取余额
        </button>

        <div className={`${wallet.mineState === 'mining' ? classes.bigBackgroundMining : classes.bigBackground}`} />

        {this.showTips && <Something onClose={this.setShowTips.bind(this, false)} />}
      </div>
    )
  }
}

export default withStyles(styles)(Mine)
