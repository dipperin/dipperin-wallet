import { observable, action } from 'mobx'
import React, { Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { Button, TextField } from '@material-ui/core'
import swal from 'sweetalert2'
import _ from 'lodash'
import isInt from 'validator/lib/isInt'

// store
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'

// components
import PasswordConfirm from '@/components/passwordConfirm'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './styles'

interface WrapProps extends RouteComponentProps<{ address: string }> {
  vmContract: VmContractStore
  wallet: WalletStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('vmContract', 'wallet')
@observer
export class Call extends React.Component<IProps> {
  @observable
  name: string = ''
  @observable
  params: string = ''
  @observable
  showDialog: boolean = false
  @observable
  gas: string = ''
  @observable
  gasPrice: string = ''

  @action
  nameChange = e => {
    this.name = e.target.value
  }

  @action
  paramsChange = e => {
    this.params = e.target.value
  }

  @action
  gasChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.gas = e.target.value
    }
  }

  @action
  gasPriceChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.gasPrice = e.target.value
    }
  }

  handleConfirm = async e => {
    e.preventDefault()
    // TODO: Add validate
    this.handleShowDialog()
  }

  dialogConfirm = async (password: string) => {
    const {
      match: {
        params: { address }
      },
      labels,
      vmContract
    } = this.props
    const res = this.props.wallet!.checkPassword(password)
    if (res) {
      const callContract = vmContract.contract.get(address)!
      const callRes = await vmContract.confirmCallContractMethod(
        address,
        callContract.contractAbi,
        this.name,
        this.gas,
        this.gasPrice,
        this.params.split(',').map(param => param.trim())
      )
      if (callRes.success) {
        await swal.fire({
          title: labels.callDialog.callSuccess,
          type: 'success',
          timer: 1000
        })
        this.onClose()
      } else {
        this.handleCloseDialog()
        swal.fire({
          title: labels.callDialog.callFail,
          text: callRes.info,
          type: 'error'
        })
      }
    } else {
      swal.fire({
        type: 'error',
        title: labels.callDialog.incorrectPassword
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
    history.push(pathname.split('/call')[0])
  }

  render() {
    const {
      vmContract,
      classes,
      labels,
      match: {
        params: { address }
      }
    } = this.props
    const callContract = vmContract.contract.get(address)
    if (!callContract) {
      return null
    }
    return (
      <Fragment>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <p className={classes.title}>{`${labels.callDialog.title}:`}</p>
          <p className={classes.config}>
            <b>{labels.address}:</b> {callContract.contractAddress}
          </p>
          <TextField
            value={this.name}
            onChange={this.nameChange}
            autoFocus={true}
            margin="dense"
            label={labels.name}
            type="text"
            fullWidth={true}
          />
          <TextField
            value={this.params}
            onChange={this.paramsChange}
            margin="dense"
            label={labels.callDialog.params}
            type="text"
            fullWidth={true}
          />
          <TextField
            value={this.gas}
            onChange={this.gasChange}
            margin="dense"
            label={labels.gas}
            type="text"
            fullWidth={true}
          />
          <TextField
            value={this.gasPrice}
            onChange={this.gasPriceChange}
            margin="dense"
            label={labels.gasPrice}
            type="text"
            fullWidth={true}
          />
          <Button
            disabled={!(this.name && this.gas && this.gasPrice)}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            {labels.call}
          </Button>
        </form>
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
      </Fragment>
    )
  }
}

export const StyleTransferToken = withStyles(styles)(Call)

const TransferTokenWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleTransferToken {...other} labels={t('contract:contract')} />
}

export default withTranslation()(TransferTokenWrap)
// export default withNamespaces('contract')(StyleTransferToken)
