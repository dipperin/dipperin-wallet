// import BN from 'bignumber.js'
import { action, observable, reaction, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import swal from 'sweetalert2'
import _ from 'lodash'

import PasswordConfirm from '@/components/passwordConfirm'
import { I18nCollectionTransaction } from '@/i18n/i18n'
import AccountStore from '@/stores/account'
import TransactionStore from '@/stores/transaction'
import WalletStore from '@/stores/wallet'
import { isValidAmount } from '@/utils'
import { Button, FormControl, Input, InputLabel } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/styles'
import { Utils } from '@dipperin/dipperin.js'
import BN from 'bignumber.js'

import styles from './sendStyle'

interface WrapProps {
  wallet?: WalletStore
  account?: AccountStore
  transaction?: TransactionStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionTransaction['send']
}

@inject('wallet', 'account', 'transaction')
@observer
export class Send extends React.Component<IProps> {
  /**
   * send state
   */
  @observable
  address: string = ''
  @observable
  amount: string = ''
  @observable
  memo: string = ''
  @observable
  waitConfirm: boolean = false
  @observable
  gasPrice: string = '1'
  @observable
  estimateGas: string = '21000'
  @observable
  showDialog: boolean = false
  @computed
  get poundage() {
    return Number(this.gasPrice) * Number(this.estimateGas)
  }
  constructor(props: IProps) {
    super(props)

    reaction(() => props.account!.activeAccount, this.initState)
  }

  @action
  setEstimateGas = (newGas: string | undefined) => {
    // console.log('setEstimateGas', newGas)
    if (newGas && /^[0-9]*$/.test(newGas) && Number(newGas) >= 21000) {
      this.estimateGas = newGas
    }
  }

  @action
  setWaitConfirm = (flag: boolean) => {
    this.waitConfirm = flag
  }

  @action
  setShowDialog = (flag: boolean) => {
    this.showDialog = flag
  }

  // verifyGetTxFee = (amount: string, address: string, balance: string): string | void => {
  //   const { labels } = this.props
  //   const hexAddress = `0x${address.replace('0x', '')}`
  //   if (!Utils.isAddress(hexAddress)) {
  //     return labels.swal.invalidAddress
  //   }

  //   if (Utils.isContractAddress(hexAddress)) {
  //     return labels.swal.invalidAddress
  //   }

  //   const amountUnit = new BN(Utils.toUnit(amount))
  //   const bnUnit = new BN(balance)

  //   if (bnUnit.lt(amountUnit, 10)) {
  //     return labels.swal.insufficientFunds
  //   }
  // }

  handleGetEstimateGas = async () => {
    const hexAddress = `0x${this.address.replace('0x', '')}`
    const res2 = await this.props.transaction!.estimateGas(hexAddress, this.amount, this.memo)
    // console.log('estimateGas', res2)
    if (res2.success) {
      this.setEstimateGas(res2.info)
      this.setWaitConfirm(true)
    }
  }

  validateAddress = (address: string) => {
    if (!Utils.isAddress(address)) {
      const label = this.props.labels
      throw new Error(label.swal.invalidAddress)
    }
  }

  validateAmount = (amount: string) => {
    if (!isValidAmount(amount)) {
      const label = this.props.labels
      throw new Error(label.swal.invalidAmount)
    }
  }

  validateBalance = () => {
    const label = this.props.labels
    const balance = this.props.account!.activeAccount.balance
    // console.log(balance)
    const amountUnit = new BN(this.amount)
    const bnUnit = new BN(balance)

    if (bnUnit.lt(amountUnit, 10)) {
      throw new Error(label.swal.insufficientFunds)

    }
  }

  handleSend = async (e: React.FormEvent) => {
    // const { labels } = this.props
    e.preventDefault()
    try {
      this.validateAddress(this.address)
      this.validateAmount(this.amount)
      this.validateBalance()
      this.handleShowDialog()
    } catch (e) {
      swal.fire(e.message, '', 'error')
    }
    // if (!isValidAmount(this.amount)) {
    //   await swal.fire(labels.swal.invalidAmount, '', 'error')
    //   return
    // }
    // this.handleShowDialog()
  }

  handleCloseDialog = () => {
    this.setShowDialog(false)
  }

  send = async () => {
    const { labels } = this.props
    const hexAddress = `0x${this.address.replace('0x', '')}`
    let gas
    if (this.estimateGas && /^[0-9]*$/.test(this.estimateGas)) {
      gas = String(Number(this.estimateGas) * 2)
    } else {
      gas = '120000'
    }
    // const gas: string = String(Number(this.estimateGas)! * 2) | '120000'
    const res = await this.props.transaction!.confirmTransaction(hexAddress, this.amount, this.memo, gas, this.gasPrice)
    if (res.success) {
      this.handleCloseDialog()
      this.initState()
      await swal.fire({
        text: labels.swal.success,
        type: 'success',
        confirmButtonText: labels.swal.confirm,
        timer: 1000
      })
      this.props.transaction!.updateTransactionType()
    } else {
      this.handleCloseDialog()
      await swal.fire({
        title: labels.swal.fail,
        text: res.info,
        type: 'error',
        confirmButtonText: labels.swal.confirm
      })
    }
  }

  dialogConfirm = async (password: string) => {
    const { labels } = this.props
    const res = await this.props.wallet!.checkPassword(password)
    if (res) {
      this.send()
    } else {
      await swal.fire({
        type: 'error',
        title: labels.swal.incorrectPassword
      })
    }
  }

  handleDialogConfirm = _.debounce(this.dialogConfirm, 1000)

  @action
  initState = () => {
    this.waitConfirm = false
    this.gasPrice = '1'
    this.address = ''
    this.memo = ''
    this.amount = ''
    this.estimateGas = '21000'
  }

  @action
  addressChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.address = e.target.value
  }

  @action
  amountChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.amount = e.target.value.toString()
    // this.handleGetTxFee()
  }

  @action
  memoChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.memo = e.target.value
    // this.handleGetTxFee()
  }

  @action
  gasPriceChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.gasPrice = e.target.value
    // this.handleGetTxFee()
  }

  @action
  handleShowDialog = () => {
    this.showDialog = true
  }

  @action
  handleAddGasPrice = () => {
    this.gasPrice = String(Number(this.gasPrice) + 1)
    // console.log('gasPrice', this.gasPrice)
  }

  @action
  handleSubGasPrice = () => {
    if (Number(this.gasPrice) > 1) {
      this.gasPrice = String(Number(this.gasPrice) - 1)
    }
  }

  render() {
    const { labels, classes } = this.props
    return (
      <div>
        <form onSubmit={this.handleSend}>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.to}</InputLabel>
            <Input value={this.address} onChange={this.addressChange} onBlur={this.handleGetEstimateGas} />
          </FormControl>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.amount}</InputLabel>
            <Input type="number" value={this.amount} onChange={this.amountChange} onBlur={this.handleGetEstimateGas} />
          </FormControl>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.note}</InputLabel>
            <Input
              value={this.memo}
              onChange={this.memoChange}
              onBlur={this.handleGetEstimateGas}
              inputProps={{ maxLength: 200 }}
            />
          </FormControl>
          <FormControl fullWidth={true} margin="dense">
            <InputLabel>{labels.fee}</InputLabel>
            <Input type="text" value={`${Utils.fromUnit(String(this.poundage))} DIP`} disabled={true} />
            <div className={classes.poundageChange}>
              <span className={classes.poundageAdd} onClick={this.handleAddGasPrice} />
              <span className={classes.poundageSub} onClick={this.handleSubGasPrice} />
            </div>
          </FormControl>
          {/* <p className={classes.min}>{this.estimateGas && `${labels.estimateGas}: ${this.estimateGas}`}</p> */}
          <Button
            disabled={!this.address || !this.amount}
            variant="contained"
            color="primary"
            className={classes.confirmButton}
            type="submit"
          >
            {labels.transfer}
          </Button>
        </form>
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
      </div>
    )
  }
}

const SendWithStyle = withStyles(styles)(Send)

const SendWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <SendWithStyle {...other} labels={t('transaction:send')} />
}

export default withTranslation()(SendWrap)
