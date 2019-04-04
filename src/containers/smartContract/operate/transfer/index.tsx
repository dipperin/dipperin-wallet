import { observable, action } from 'mobx'
import React, { Fragment } from 'react'
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

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './styles'

interface WrapProps extends RouteComponentProps<{ address: string }> {
  contract: ContractStore
  wallet: WalletStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['transfer']
}

@inject('contract', 'wallet')
@observer
export class TransferToken extends React.Component<IProps> {
  @observable
  to: string = ''
  @observable
  amount: string = ''
  @observable
  showDialog: boolean = false

  @action
  toChange = e => {
    this.to = e.target.value
  }

  @action
  amountChange = e => {
    this.amount = e.target.value
  }

  verifyInputs = (
    balance: number,
    amount: string,
    to: string,
    labels: I18nCollectionContract['transfer']
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
    const transferContract = contract.contract.get(address)
    const balance = transferContract
      ? (Number(transferContract.balance) / Math.pow(10, transferContract.tokenDecimals)).toFixed(
          transferContract.tokenDecimals
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
      const transferContract = contract.contract.get(address)
      const transferRes = await this.props.contract.transferToken(
        address,
        this.to,
        (Number(this.amount) * Math.pow(10, transferContract!.tokenDecimals)).toString()
      )
      if (transferRes.success) {
        await swal.fire({
          title: labels.swal.transferSuccess,
          type: 'success',
          timer: 1000
        })
        this.onClose()
      } else {
        this.handleCloseDialog()
        swal.fire({
          title: labels.swal.transferFail,
          text: transferRes.info,
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
    history.push(pathname.split('/transfer')[0])
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
    const transferContract = contract.contract.get(address)
    if (!transferContract) {
      return null
    }
    const balance = (Number(transferContract.balance) / Math.pow(10, transferContract.tokenDecimals)).toFixed(
      transferContract.tokenDecimals
    )
    return (
      <Fragment>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <p className={classes.title}>{`${labels.title}:`}</p>
          <p className={classes.config}>
            <b>{labels.name}:</b> {transferContract.tokenName}
          </p>
          <p className={classes.config}>
            <b>{labels.balance}:</b> {balance}
            &nbsp;
            {transferContract.tokenSymbol}
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
              step: 1 / Math.pow(10, transferContract.tokenDecimals) || 1,
              min: 1 / Math.pow(10, transferContract.tokenDecimals)
            }}
          />
          <Button
            disabled={!(this.amount && this.to)}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            {labels.transfer}
          </Button>
        </form>
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
      </Fragment>
    )
  }
}

export const StyleTransferToken = withStyles(styles)(TransferToken)

const TransferTokenWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleTransferToken {...other} labels={t('contract:transfer')} />
}

export default withTranslation()(TransferTokenWrap)
// export default withNamespaces('contract')(StyleTransferToken)
