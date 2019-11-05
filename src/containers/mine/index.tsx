import React from 'react'
import { RouteComponentProps } from 'react-router'
import { inject, observer } from 'mobx-react'

import { withStyles, WithStyles } from '@material-ui/core/styles'
// import { Accounts, AccountObject } from '@dipperin/dipperin.js'
import WalletStore from '@/stores/wallet'
import RootStore from '@/stores/root'
import AccountStore from '@/stores/account'

import styles from './mineStyles'
import { observable, action, runInAction, reaction } from 'mobx'
// import { csWallet } from '@/tests/testData/cswallet'
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
import BN from 'bignumber.js'

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
  updateMineBalanceTimer: NodeJS.Timeout

  @action
  handleChandeQueryAddress = (e: React.ChangeEvent<{ value: string }>) => {
    this.queryAddress = e.target.value
  }

  @action
  handleChandeNonce = (e: React.ChangeEvent<{ value: string }>) => {
    this.nonce = e.target.value
  }

  @action
  setMining = (flag: boolean | undefined) => {
    this.mining = flag
  }

  @action
  setMineBalance = (num: string) => {
    this.mineBalance = num
  }

  @action
  setUpdateMineBalanceTimer = (timer: NodeJS.Timeout) => {
    this.updateMineBalanceTimer = timer
  }

  constructor(props) {
    super(props)

    reaction(
      () => this.mining,
      mining => {
        if (mining === true) {
          clearInterval(this.updateMineBalanceTimer)
          this.updateMineBalance()
        }
      }
    )
  }

  handleStartMinerNode = () => {
    if (this.mining === false) {
      this.setMining(undefined)
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
        this.setMining(true)
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
        this.setMining(true)
        return
      } else {
        failureTimes += 1
      }
      await sleep(DEFAULT_TIMEOUT)
    }
    this.setMining(false)
    console.log('try times out, fail to start Mine')
  }

  private handleStartNodeFailure = () => {
    console.log('启动矿工节点失败')
    this.setMining(false)
  }

  private handleStartMinerNodeTimeout = () => {
    console.log('启动矿工节点超时')
    this.setMining(false)
  }

  handleStartMine = async () => {
    // start loading
    this.setMining(undefined)
    // 1. try to send startMine command
    try {
      await this.props.wallet.startMine()
      this.setMining(true)
    } catch (e) {
      switch (e.message) {
        case `Returned error: "miner is mining"`:
          console.log(`miner is mining`)
          this.setMining(true)
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
    } catch (e) {
      switch (e.message) {
        case `Returned error: "mining had been stopped"`:
          console.log('mining had been stopped')
          break
        default:
          console.log(e.message)
      }
    }
  }

  // *************************************** handle miner account ***************************************************

  testAccount = '0x00008d3EEd5fb2dB537919AdCC04c6a22d2ECaa9E634'
  // testAccount = `0x0000fA5e0e6D1548CfAdB2A4AAC8d73ceF3A64C69be7`

  updateMineBalance = async () => {
    const timer: NodeJS.Timeout = setInterval(async () => {
      console.log(`updateBalance`)
      try {
        const response = (await this.props.wallet.queryBalance(this.testAccount)) || '0'
        console.log(response)
        this.setMineBalance(Utils.fromUnit(response))
      } catch (e) {
        console.log(`updateMineBalance error:`, e.message)
      }
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
      const response = (await this.props.wallet.queryBalance(this.testAccount)) || '0'
      const value = new BN(response).minus(new BN(21000))
      const nonce = await this.props.wallet.getAccountNonce(this.testAccount)
      console.log(value)
      const result = await this.props.wallet.withdrawBalance(
        this.testAccount,
        curAddress,
        value.toString(10),
        1,
        Number(nonce)
      )
      runInAction(() => {
        this.nonce = String(Number(this.nonce) + 1)
      })
      console.log(result)
    } catch (e) {
      console.log(`handleWithdrawBalance error:`, e.message)
    }
  }

  // parseCswallet = ()=> {
  //   Accounts.decrypt(csWallet,'123')
  // }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.main}>
        <button className={classes.btn} onClick={this.handleStartMinerNode}>
          开启矿工节点
        </button>
        <button className={classes.btn} onClick={this.sendStartMineCommand}>
          开始挖矿
        </button>
        <button className={classes.btn} onClick={this.handleStartMine}>
          一键挖矿
        </button>
        <button className={classes.btn} onClick={this.handleStopMine}>
          停止挖矿
        </button>
        <input className={classes.btn} type="text" value={this.queryAddress} onChange={this.handleChandeQueryAddress} />
        <button className={classes.btn} onClick={this.handleQueryBalance}>
          查询余额
        </button>
        <input className={classes.btn} type="text" value={this.mineBalance} readOnly={true} />
        <button className={classes.btn} onClick={this.handleWithdrawBalance}>
          提取余额
        </button>
        <button className={classes.btn} onClick={this.handleWithdrawBalance}>
          提取所有
        </button>
        <input className={classes.btn} type="text" value={this.nonce} onChange={this.handleChandeNonce} />
        <p>
          {this.mining === false && '未开始'}
          {this.mining === undefined && '正在启动矿工节点'}
          {this.mining === true && '挖矿中'}
        </p>
      </div>
    )
  }
}

export default withStyles(styles)(Mine)
