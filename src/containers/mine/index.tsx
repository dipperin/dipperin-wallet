import React from 'react'
import { RouteComponentProps } from 'react-router'
import { inject, observer } from 'mobx-react'

import { withStyles, WithStyles } from '@material-ui/core/styles'
// import { Accounts, AccountObject } from '@dipperin/dipperin.js'
import WalletStore from '@/stores/wallet'
import RootStore from '@/stores/root'
import AccountStore from '@/stores/account'

import styles from './mineStyles'
import { observable, action, runInAction } from 'mobx'
// import { csWallet } from '@/tests/testData/cswallet'
import { sendStartMineNode, sendStopNode, onceStartNodeSuccess, onStartNodeFailure } from '@/ipc'

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
  @observable
  mining: boolean | undefined = false

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

  handleStartMine = () => {
    if (this.mining === false) {
      this.setMining(undefined)
      if (this.props.root.isConnecting) {
        // stop node
        sendStopNode()
        this.props.root.stopConnectNode()
      }
      sendStartMineNode()
      this.props.wallet.startMine()
      onceStartNodeSuccess(this.sendStartMineCommand)
      onStartNodeFailure(this.handleStartNodeFailure)
    }
  }

  private sendStartMineCommand = async () => {
    console.log('start node success')
    const result = await this.props.wallet.startMine()
    console.log('startMine', result)
    if (result) {
      this.setMining(false)
    } else {
      this.setMining(true)
    }
  }

  private handleStartNodeFailure = () => {
    this.setMining(false)
  }

  handleStopMine = () => {
    this.props.wallet.stopMine()
  }

  handleQueryBalance = async () => {
    const response = await this.props.wallet.queryBalance(this.queryAddress)
    console.log(response)
  }

  handleWithdrawBalance = async () => {
    const curAddress = this.props.account.activeAccount.address
    console.log(curAddress)
    const value = 10000000000000000000
    const result = await this.props.wallet.withdrawBalance(this.queryAddress, curAddress, value, 1, Number(this.nonce))
    runInAction(() => {
      this.nonce = String(Number(this.nonce) + 1)
    })
    console.log(result)
  }

  handleToggleNode = () => {
    if (this.props.root.isConnecting) {
      // stop node
      sendStopNode()
      this.props.root!.stopConnectNode()
    }

    sendStartMineNode()
  }

  // parseCswallet = ()=> {
  //   Accounts.decrypt(csWallet,'123')
  // }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.main}>
        <button className={classes.btn} onClick={this.handleStartMine}>
          开始挖矿
        </button>
        <button className={classes.btn} onClick={this.handleStopMine}>
          停止挖矿
        </button>
        <input className={classes.btn} type="text" value={this.queryAddress} onChange={this.handleChandeQueryAddress} />
        <button className={classes.btn} onClick={this.handleQueryBalance}>
          查询余额
        </button>
        <button className={classes.btn} onClick={this.handleWithdrawBalance}>
          提取余额
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
