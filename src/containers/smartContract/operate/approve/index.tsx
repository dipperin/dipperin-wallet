import { observable, action } from 'mobx'
import React, { Fragment, ChangeEvent } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { Utils } from '@dipperin/dipperin.js'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { Button, TextField } from '@material-ui/core'
import swal from 'sweetalert2'
import _ from 'lodash'

// store
import ContractStore from '@/stores/contract'
import WalletStore from '@/stores/wallet'

// components
import PasswordConfirm from '@/components/passwordConfirm'

import styles from './styles'
import { I18nCollectionContract } from '@/i18n/i18n'

interface WrapProps extends RouteComponentProps<{ address: string }> {
  contract: ContractStore
  wallet: WalletStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['approve']
}

@inject('contract', 'wallet')
@observer
export class Approve extends React.Component<IProps> {
  @observable
  to: string = ''
  @observable
  amount: string = ''
  @observable
  showDialog: boolean = false

  @action
  toChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.to = event.target.value
  }

  @action
  amountChange = e => {
    this.amount = e.target.value
  }

  verifyInputs = (
    balance: number,
    amount: string,
    to: string,
    labels: I18nCollectionContract['approve']
  ): string | void => {
    if (balance < Number(amount)) {
      return labels.swal.insufficientFunds
    }
    if (to && !Utils.isAddress(to)) {
      return labels.swal.invalidAddress
    }
  }

  handleConfirm = async e => {
    e.preventDefault()
    const {
      contract,
      labels,
      match: {
        params: { address }
      }
    } = this.props
    const approveContract = contract.contract.get(address)
    const balance = approveContract
      ? (Number(approveContract.balance) / Math.pow(10, approveContract.tokenDecimals)).toFixed(
          approveContract.tokenDecimals
        )
      : 0

    const errInfo = this.verifyInputs(Number(balance), this.amount, this.to, labels)
    if (errInfo) {
      swal.fire({
        title: errInfo,
        type: 'error',
        confirmButtonText: labels.swal.confirm
      })
      return
    }
    this.handleShowDialog()
  }

  dialogConfirm = async (password: string) => {
    const {
      match: {
        params: { address }
      },
      labels,
      contract
    } = this.props
    const res = this.props.wallet!.checkPassword(password)
    if (res) {
      const approveContract = contract.contract.get(address)
      const approveRes = await this.props.contract.approveToken(
        address,
        this.to,
        (Number(this.amount) * Math.pow(10, approveContract!.tokenDecimals)).toString()
      )
      if (approveRes.success) {
        await swal.fire({
          title: labels.swal.approveSuccess,
          type: 'success',
          timer: 1000
        })
        this.onClose()
      } else {
        this.handleCloseDialog()
        swal.fire({
          title: labels.swal.approveFail,
          text: approveRes.info,
          type: 'error'
        })
      }
    } else {
      swal.fire({
        type: 'error',
        title: labels.swal.incorrectPassword
      })
    }
  }

  handleDialogConfirm = _.debounce(this.dialogConfirm, 1000)

  @action
  handleCloseDialog = () => {
    this.showDialog = false
  }

  @action
  handleShowDialog = () => {
    this.showDialog = true
  }

  onClose = () => {
    const {
      history,
      history: {
        location: { pathname }
      }
    } = this.props
    history.push(pathname.split('/approve')[0])
  }

  render() {
    const {
      contract,
      classes,
      labels,
      match: {
        params: { address }
      }
    } = this.props
    const approveContract = contract.contract.get(address)
    if (!approveContract) {
      return null
    }
    const balance = (Number(approveContract.balance) / Math.pow(10, approveContract.tokenDecimals)).toFixed(
      approveContract.tokenDecimals
    )
    return (
      <Fragment>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <p className={classes.title}>{`${labels.title}:`}</p>
          <p className={classes.config}>
            <b>{labels.name}:</b> {approveContract.tokenName}
          </p>
          <p className={classes.config}>
            <b>{labels.balance}:</b> {balance}
            &nbsp;
            {approveContract.tokenSymbol}
          </p>
          <TextField
            value={this.to}
            onChange={this.toChange}
            autoFocus={true}
            margin="dense"
            label={labels.toAddress}
            type="text"
            fullWidth={true}
          />
          <TextField
            value={this.amount}
            onChange={this.amountChange}
            margin="dense"
            label={labels.amount}
            type="number"
            fullWidth={true}
            inputProps={{
              step: 1 / Math.pow(10, approveContract.tokenDecimals) || 1,
              min: 1 / Math.pow(10, approveContract.tokenDecimals)
            }}
          />
          <Button
            disabled={!(this.amount && this.to)}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            {labels.approve}
          </Button>
        </form>
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
      </Fragment>
    )
  }
}

export const StyleApprove = withStyles(styles)(Approve)

const ApproveWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleApprove {...other} labels={t('contract:approve')} />
}

export default withTranslation()(ApproveWrap)
