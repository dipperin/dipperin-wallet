import BN from 'bignumber.js'
import { action, observable, reaction } from 'mobx'
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
  fee: string = ''
  @observable
  minFee: string = ''

  @observable
  showDialog: boolean = false

  constructor(props: IProps) {
    super(props)

    reaction(() => props.account!.activeAccount, this.initState)
  }

  verifyGetTxFee = (amount: string, address: string, balance: string): string | void => {
    const { labels } = this.props
    const hexAddress = `0x${address.replace('0x', '')}`
    if (!Utils.isAddress(hexAddress)) {
      return labels.swal.invalidAddress
    }

    if (Utils.isContractAddress(hexAddress)) {
      return labels.swal.invalidAddress
    }

    const amountUnit = new BN(Utils.toUnit(amount))
    const bnUnit = new BN(balance)

    if (bnUnit.lt(amountUnit, 10)) {
      return labels.swal.insufficientFunds
    }
  }

  @action
  handleGetTxFee = () => {
    const hexAddress = `0x${this.address.replace('0x', '')}`
    if (!this.amount || !this.address) {
      this.waitConfirm = false
      return
    }
    const err = this.verifyGetTxFee(this.amount, this.address, this.props.account!.activeAccount.balanceUnit)
    if (err) {
      swal.fire(err, '', 'error')
      this.waitConfirm = false
      return
    }
    const minTransactionFee = this.props.transaction!.getTransactionFee(hexAddress, this.amount, this.memo)

    if (minTransactionFee) {
      this.minFee = minTransactionFee
      if (!this.fee || this.fee < this.minFee) {
        this.fee = this.minFee
      }
      this.waitConfirm = true
    }
  }

  handleSend = async (e: React.FormEvent) => {
    const { labels } = this.props
    e.preventDefault()
    if (!isValidAmount(this.amount)) {
      await swal.fire(labels.swal.invalidAmount, '', 'error')
      return
    }
    if (!isValidAmount(this.fee) || this.fee < this.minFee) {
      await swal.fire(labels.swal.invalidFee, '', 'error')
      return
    }
    this.handleShowDialog()
  }

  @action
  handleCloseDialog = () => {
    this.showDialog = false
  }

  send = async () => {
    const { labels } = this.props
    const hexAddress = `0x${this.address.replace('0x', '')}`
    const res = await this.props.transaction!.confirmTransaction(hexAddress, this.amount, this.memo)
    const res2 = await this.props.transaction!.estimateGas(hexAddress, this.amount, this.memo)
    console.log('estimateGas', res2)
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
    this.fee = ''
    this.address = ''
    this.memo = ''
    this.amount = ''
    this.minFee = ''
  }

  @action
  addressChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.address = e.target.value
  }

  @action
  amountChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.amount = e.target.value.toString()
    this.handleGetTxFee()
  }

  @action
  memoChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.memo = e.target.value
    this.handleGetTxFee()
  }

  @action
  feeChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.fee = e.target.value
    this.handleGetTxFee()
  }

  @action
  handleShowDialog = () => {
    this.showDialog = true
  }

  render() {
    const { labels, classes } = this.props
    return (
      <div>
        <form onSubmit={this.handleSend}>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.to}</InputLabel>
            <Input value={this.address} onChange={this.addressChange} onBlur={this.handleGetTxFee} />
          </FormControl>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.amount}</InputLabel>
            <Input type="number" value={this.amount} onChange={this.amountChange} onBlur={this.handleGetTxFee} />
          </FormControl>
          <FormControl fullWidth={true} className={classes.item} margin="dense">
            <InputLabel>{labels.note}</InputLabel>
            <Input
              value={this.memo}
              onChange={this.memoChange}
              onBlur={this.handleGetTxFee}
              inputProps={{ maxLength: 200 }}
            />
          </FormControl>
          <FormControl fullWidth={true} margin="dense">
            <InputLabel>{labels.fee}</InputLabel>
            <Input
              type="number"
              value={this.fee}
              onChange={this.feeChange}
              inputProps={{
                min: this.minFee,
                step: 0.000000001
              }}
            />
          </FormControl>
          <p className={classes.min}>{this.minFee ? `${labels.moreThan} ${this.minFee}` : ''}</p>
          <Button
            disabled={!this.waitConfirm || !this.fee || this.fee < this.minFee}
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
