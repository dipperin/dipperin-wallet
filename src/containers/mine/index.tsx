import React from 'react'
import { RouteComponentProps } from 'react-router'
import { inject, observer } from 'mobx-react'
import { observable, action } from 'mobx'
import { I18nCollectionMine } from '@/i18n/i18n'
import { withTranslation, WithTranslation } from 'react-i18next'
import swal from 'sweetalert2'

import { withStyles, WithStyles } from '@material-ui/core/styles'
import WalletStore from '@/stores/wallet'
import RootStore from '@/stores/root'
import AccountStore from '@/stores/account'
import { Utils } from '@dipperin/dipperin.js'

import Something from './something'
import WithdrawModal from './withdrawModal'

import styles from './mineStyles'
import { getIsRemoteNode } from '@/utils/node'

const LONG_TIMEOUT = 15000

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
  setShowTips(flag: boolean) {
    this.showTips = flag
  }

  @action
  setShowWithdrawModal(flag: boolean) {
    this.showWithdrawModal = flag
  }

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
    this.updateMineBalance()
    // if (this.props.wallet.mineState === 'mining') {
    //   this.updateMineBalance()
    // } else {
    //   const minerAddress = this.props.wallet.getMinerAccount().address
    //   this.getBalanceAndUpdate(minerAddress)
    // }

    // reaction(
    //   () => this.props.wallet.mineState,
    //   mineState => {
    //     if (mineState === 'mining') {
    //       if (this.updateMineBalanceTimer) {
    //         clearInterval(this.updateMineBalanceTimer)
    //       }
    //       this.updateMineBalance()
    //     } else if (mineState === 'stop') {
    //       if (this.updateMineBalanceTimer) {
    //         clearInterval(this.updateMineBalanceTimer)
    //       }
    //     }
    //   }
    // )
  }

  componentWillUnmount() {
    if (this.updateMineBalanceTimer !== undefined) {
      clearInterval(this.updateMineBalanceTimer)
      this.updateMineBalanceTimer = undefined
    }
  }

  // ******************* handle the miner master *************************************

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
        default:
          console.log(e.message)
      }
    }
  }

  handleStartMineV2 = async () => {
    if (getIsRemoteNode()) {
      await swal.fire({
        type: 'error',
        text: this.props.labels.remoteNodeError,
        title: this.props.labels.startFailure,
        timer: 2000
      })
      return
    } else if (!this.props.root.isConnecting) {
      await swal.fire({
        type: 'error',
        text: this.props.labels.remoteNodeError,
        title: this.props.labels.unstartNodeError,
        timer: 2000
      })
      return
    }
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
      // console.log(response)
      this.setMineBalance(Utils.fromUnit(response))
      this.setMineBalanceUnit(response)
      console.log(accountAddress, response)
    } catch (e) {
      console.log(`updateMineBalance error:`, e.message)
    }
  }

  updateMineBalance = () => {
    const minerAddress = this.props.wallet.getMinerAccount().address
    // console.log(minerAddress)
    this.getBalanceAndUpdate(minerAddress)
    const timer: NodeJS.Timeout = setInterval(() => {
      // console.log(`updateBalance`)
      this.getBalanceAndUpdate(minerAddress)
    }, LONG_TIMEOUT)
    this.setUpdateMineBalanceTimer(timer)
  }

  withdrawBalance = async (address: string, value: string) => {
    const result = await this.props.wallet.withdrawAmount(address, value)
    return result
  }

  handleWithdraw = () => {
    this.setShowWithdrawModal(true)
  }

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
  return <MineWithStyle {...other} labels={t('mine:main')} />
}

export default withTranslation()(MineWrap)
