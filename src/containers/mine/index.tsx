import React from 'react'
import { RouteComponentProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import { observable, action, reaction } from 'mobx'
import { I18nCollectionMine } from '@/i18n/i18n'
import { withTranslation, WithTranslation } from 'react-i18next'

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
import WithdrawModal from './withdrawModal'

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

interface IProps extends WithStyles<typeof styles>, Props {
  labels: I18nCollectionMine['main']
}

@inject('root', 'wallet', 'account')
@observer
export class Mine extends React.Component<RouteComponentProps<{}> & IProps> {
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
  mineBalanceUnit: string = ''
  @observable
  updateMineBalanceTimer: NodeJS.Timeout | undefined
  @observable
  showTips: boolean = false
  @observable
  showWithdrawModal: boolean = false

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

  @action
  setShowWithdrawModal(flag: boolean) {
    this.showWithdrawModal = flag
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
  setMineBalanceUnit = (num: string) => {
    this.mineBalanceUnit = num
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
      console.log(e.message)
      switch (e.message) {
        case `Returned error: "miner is mining"`:
          console.log(`miner is mining`)
          this.props.wallet.setMineState('mining')
          break
        case `Returned error: "current node is not mine master"`:
        case `CONNECTION ERROR: Couldn't connect to node on WS.`:
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
          console.log(`could not connect node`)
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

  handleStartMineV2 = async () => {
    if (this.props.wallet.mineState === 'init') {
      await this.props.wallet.initMine()
    } else {
      await this.handleStartMine()
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

  private getBalanceAndUpdate = async (accountAddress: string) => {
    try {
      const response = (await this.props.wallet.queryBalance(accountAddress)) || '0'
      console.log(response)
      this.setMineBalance(Utils.fromUnit(response))
      this.setMineBalanceUnit(response)
    } catch (e) {
      console.log(`updateMineBalance error:`, e.message)
    }
  }

  updateMineBalance = () => {
    const minerAddress = this.props.wallet.getMinerAccount().address
    console.log(minerAddress)
    this.getBalanceAndUpdate(minerAddress)
    const timer: NodeJS.Timeout = setInterval(() => {
      console.log(`updateBalance`)
      this.getBalanceAndUpdate(minerAddress)
    }, LONG_TIMEOUT)
    this.setUpdateMineBalanceTimer(timer)
  }

  withdrawBalance = async (address: string, value: string) => {
    await this.props.wallet.withdrawAmount(address, value)
  }

  handleWithdraw = () => {
    this.setShowWithdrawModal(true)
  }

  // listWallet = async () => {
  //   try {
  //     const result = await this.props.wallet.listWallet()
  //     console.log(`list wallet: `, result)
  //   } catch (e) {
  //     console.log(`list wallet:`, e.message)
  //   }
  // }

  // handleTestRpc = () => {
  //   this.props.wallet.testRpc()
  // }

  handleCloseTips = () => {
    this.setShowTips(false)
  }

  render() {
    const { classes, wallet, account, labels } = this.props
    const currentAddress = account.activeAccount.address
    return (
      <div className={classes.main}>
        <div className={`${wallet.mineState === 'mining' ? classes.smallBackgroundMining : classes.smallBackground}`} />

        {wallet.mineState !== 'mining' && (
          <button className={`${classes.btn} ${classes.mineBtn}`} onClick={this.handleStartMineV2}>
            {['stop', 'init'].includes(wallet.mineState) && labels.easyMine}
            {wallet.mineState === 'loading' && labels.loading}
          </button>
        )}
        {wallet.mineState === 'mining' && (
          <button
            className={`${classes.btn} ${classes.mineBtn}`}
            style={{ background: '#BEC0C6' }}
            onClick={this.handleStopMine}
          >
            {labels.stopMining}
          </button>
        )}
        <span className={classes.mineTips} onClick={this.setShowTips.bind(this, true)} />

        <div className={classes.mineBalanceLabel}>
          <span>{labels.mineReward}</span>
        </div>
        <div className={`${classes.input} ${classes.balanceDisplay}`}>{this.mineBalance || '0'} DIP</div>
        <button className={`${classes.btn} ${classes.withdrawBalance}`} onClick={this.handleWithdraw}>
          {labels.withdrawBalance}
        </button>

        <div className={`${wallet.mineState === 'mining' ? classes.bigBackgroundMining : classes.bigBackground}`} />

        {this.showTips && <Something onClose={this.handleCloseTips} />}
        {this.showWithdrawModal && (
          <WithdrawModal
            onClose={this.setShowWithdrawModal.bind(this, false)}
            onConfirm={this.withdrawBalance}
            address={currentAddress}
            balance={this.mineBalanceUnit}
          />
        )}
      </div>
    )
  }
}

const MineWithStyle = withStyles(styles)(Mine)

const MineWrap = (props: Props & WithTranslation) => {
  const { t, ...other } = props
  console.log(t)
  return <MineWithStyle {...other} labels={t('mine:main')} />
}

export default withTranslation()(MineWrap)
