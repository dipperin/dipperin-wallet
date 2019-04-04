import { observable, reaction, action } from 'mobx'
import React, { Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { Utils } from '@dipperin/dipperin.js'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { Button, TextField, FormControl, Select, MenuItem, InputLabel } from '@material-ui/core'
import swal from 'sweetalert2'
import _ from 'lodash'

// store
import ContractStore from '@/stores/contract'
import WalletStore from '@/stores/wallet'

// components
import PasswordConfirm from '@/components/passwordConfirm'
import DialogConfirm from '@/components/dialogConfirm'

import styles from './styles'
import { I18nCollectionContract } from '@/i18n/i18n'

interface WrapProps extends RouteComponentProps<{ address: string }> {
  contract: ContractStore
  wallet: WalletStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['transferFrom']
}

@inject('contract', 'wallet')
@observer
export class TransferFrom extends React.Component<IProps> {
  @observable
  to: string = ''
  @observable
  amount: string = ''
  @observable
  showDialog: boolean = false
  @observable
  allowance: string = '0'
  @observable
  ownerAddress: string[] = []
  @observable
  selectedOwner: string = ''
  @observable
  showAdd: boolean = false

  componentDidMount() {
    this.init()
    reaction(
      () => this.selectedOwner,
      address => {
        this.updateAllowance(address)
      }
    )
  }

  async init() {
    const {
      match: {
        params: { address }
      }
    } = this.props
    const ownerAddress = (await this.props.contract.getOwnerAddress(address)).map(item => item.ownerAddress)
    this.setOwnerAddress(ownerAddress)
  }

  @action
  toChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.to = e.target.value
  }

  @action
  amountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.amount = e.target.value
  }

  @action
  handleOwnerAddressChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    this.selectedOwner = e.target.value
  }

  verifyInputs = (
    allowance: number,
    amount: string,
    to: string,
    labels: I18nCollectionContract['transferFrom']
  ): string | void => {
    if (allowance < Number(amount)) {
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
    const allowance = transferContract
      ? (Number(this.allowance) / Math.pow(10, transferContract.tokenDecimals)).toFixed(transferContract.tokenDecimals)
      : 0

    const errInfo = this.verifyInputs(Number(allowance), this.amount, this.to, labels)
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
      const transferRes = await this.props.contract.transferFromToken(
        address,
        this.selectedOwner,
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
      await swal.fire({
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

  /**
   * update allowance
   */
  updateAllowance = async ownerAddress => {
    if (!ownerAddress) {
      return
    }
    const {
      match: {
        params: { address }
      }
    } = this.props
    const allowance = await this.props.contract.getAllowance(address, ownerAddress)
    this.setAllowance(allowance)
  }

  /**
   * add owner address dialog
   */
  @action
  handleShowAddConfirm = () => {
    this.showAdd = true
  }

  @action
  handleCloseAddDialog = () => {
    this.showAdd = false
  }

  @action
  handleConfirmAdd = address => {
    const { labels } = this.props
    if (!Utils.isAddress(address)) {
      swal.fire({
        title: labels.swal.insufficientFunds,
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    if (this.ownerAddress.indexOf(address) !== -1) {
      swal.fire({
        title: labels.swal.addressAleadyExist,
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    this.ownerAddress.push(address)
    this.props.contract.addOwnerAddressToDb(address, this.props.match.params.address)
    this.showAdd = false
  }

  @action
  setOwnerAddress = (address: string[]) => {
    this.ownerAddress = address
  }

  @action
  setAllowance = (allowance: string) => {
    this.allowance = allowance
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
    const allowance = (Number(this.allowance) / Math.pow(10, transferContract.tokenDecimals)).toFixed(
      transferContract.tokenDecimals
    )
    return (
      <Fragment>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <p className={classes.title}>{`${labels.title}:`}</p>
          <Button variant="contained" className={classes.add} onClick={this.handleShowAddConfirm}>
            {labels.add}
          </Button>
          <p className={classes.config}>
            <b>{labels.name}:</b> {transferContract.tokenName}
          </p>
          <p className={classes.config}>
            <b>{labels.allowance}:</b> {allowance}
            &nbsp;
            {transferContract.tokenSymbol}
          </p>
          <FormControl fullWidth={true}>
            <InputLabel htmlFor="owner-address">{labels.ownerAddress}</InputLabel>
            <Select
              value={this.selectedOwner}
              onChange={this.handleOwnerAddressChange}
              inputProps={{
                id: 'owner-address'
              }}
            >
              {this.ownerAddress.length === 0 && (
                <MenuItem value="">
                  <em>{labels.none}</em>
                </MenuItem>
              )}
              {this.ownerAddress.map((item, index) => {
                return (
                  <MenuItem value={item} key={index}>
                    {item}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>
          <TextField
            value={this.to}
            onChange={this.toChange}
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
            disabled={!(this.ownerAddress && this.amount && this.to)}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            {labels.transfer}
          </Button>
        </form>
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
        {this.showAdd && (
          <DialogConfirm
            onClose={this.handleCloseAddDialog}
            onConfirm={this.handleConfirmAdd}
            title={labels.addDialog.title}
            label={labels.addDialog.label}
            btnText={labels.addDialog.btnText}
          />
        )}
      </Fragment>
    )
  }
}

export const StyleTransferFrom = withStyles(styles)(TransferFrom)
const TransferFromWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleTransferFrom {...other} labels={t('contract:transferFrom')} />
}

export default withTranslation()(TransferFromWrap)
// export default withNamespaces('contract')(StyleTransferFrom)
