import { observable, reaction, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'
import debounce from 'lodash/debounce'
import isInt from 'validator/lib/isInt'
import isFloat from 'validator/lib/isFloat'

import PasswordConfirm from '@/components/passwordConfirm'
import returnImg from '@/images/return.png'
import ContractStore from '@/stores/contract'
import TransactionStore from '@/stores/transaction'
import WalletStore from '@/stores/wallet'
import AccountStore from '@/stores/account'
import { Button, FormControl, Input, InputLabel, MenuItem, Select } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './createContractStyle'

interface WrapProps extends RouteComponentProps<{}> {
  account: AccountStore
  wallet: WalletStore
  contract: ContractStore
  transaction: TransactionStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}
@inject('wallet', 'contract', 'transaction', 'account')
@observer
export class CreateContract extends React.Component<IProps> {
  @observable
  type: string = ''
  @observable
  name: string = ''
  @observable
  symbol: string = ''
  @observable
  amount: string = ''
  @observable
  decimal: string = ''
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
    // reaction(() => this.props.transaction.tempTransaction, transaction => (this.fee = transaction.transactionFee))

    reaction(() => this.props.account.activeAccount, () => this.setWaitConfirm(false)) // TODO
  }

  @action
  handleChangeType = (e: React.ChangeEvent<{ value: string }>) => {
    this.type = e.target.value
    this.handleGenContract()
  }

  @action
  nameChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.name = e.target.value
  }

  @action
  symbolChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.symbol = e.target.value
  }

  @action
  amountChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.amount = e.target.value
    }
  }

  @action
  decimalChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.decimal = e.target.value
    }
  }

  @action
  feeChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (isFloat(e.target.value) || e.target.value === '') {
      this.fee = e.target.value
    }
  }

  @action
  handleGenContract = () => {
    // e.preventDefault()
    if (!(this.type && this.name && this.symbol && this.amount && this.decimal)) {
      this.setWaitConfirm(false)
      return
    }
    const fee = this.props.contract.getCreateContractFee(
      this.name,
      this.symbol,
      (Number(this.amount) * Math.pow(10, parseInt(this.decimal, 10))).toFixed(0),
      parseInt(this.decimal, 10)
    )

    if (fee) {
      this.setWaitConfirm(true)
      this.minFee = fee
      if (!this.fee || this.fee < this.minFee) {
        this.fee = this.minFee
      }
    }
  }

  handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    const { labels } = this.props
    let err: string = ''
    if (Number(this.decimal) > 18) {
      err = labels.createSwal.decimalLength
    }
    if (this.fee < this.minFee) {
      err = labels.createSwal.feeMax
    }
    if (err) {
      await swal.fire({
        title: err,
        type: 'error',
        showConfirmButton: false,
        timer: 1000
      })
      return
    }
    this.handleShowDialog()
  }

  dialogConfirm = async (password: string) => {
    const { labels } = this.props
    const res = this.props.wallet!.checkPassword(password)
    if (res) {
      const contractRes = await this.props.contract.confirmCreateContract(
        this.name,
        this.symbol,
        (Number(this.amount) * Math.pow(10, parseInt(this.decimal, 10))).toFixed(0),
        parseInt(this.decimal, 10),
        this.fee
      )
      if (contractRes.success) {
        await swal.fire({
          title: labels.createSwal.createSuccess,
          type: 'success',
          timer: 1000
        })
        this.switchToList()
      } else {
        this.handleCloseDialog()
        swal.fire({
          title: labels.createSwal.createErr,
          text: contractRes.info,
          type: 'error'
        })
      }
    } else {
      await swal.fire({
        type: 'error',
        title: labels.createSwal.incorrectPassword
      })
    }
  }

  handleDialogConfirm = debounce(this.dialogConfirm, 1000)

  @action
  handleCloseDialog = () => (this.showDialog = false)

  @action
  handleShowDialog = () => (this.showDialog = true)

  switchToList = () => {
    this.props.history.push('/main/contract/list/created')
  }

  @action
  setWaitConfirm = (flag: boolean) => {
    this.waitConfirm = flag
  }

  render() {
    const { classes, labels } = this.props
    return (
      <Fragment>
        <p className={classes.return} onClick={this.switchToList}>
          <img src={returnImg} alt="" />
          <span>{labels.return}</span>
        </p>
        <p className={classes.title}>{labels.createTitle}</p>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel htmlFor="contract-type">{labels.contractType}</InputLabel>
              <Select
                value={this.type}
                onChange={this.handleChangeType}
                inputProps={{
                  id: 'contract-type'
                }}
              >
                <MenuItem value={'ERC20'}>ERC20</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.amount}</InputLabel>
              <Input type="text" value={this.amount} onChange={this.amountChange} onBlur={this.handleGenContract} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.name}</InputLabel>
              <Input value={this.name} onChange={this.nameChange} onBlur={this.handleGenContract} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.decimals}</InputLabel>
              <Input type="text" value={this.decimal} onChange={this.decimalChange} onBlur={this.handleGenContract} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.symbol}</InputLabel>
              <Input value={this.symbol} onChange={this.symbolChange} onBlur={this.handleGenContract} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.fee}</InputLabel>
              <Input value={this.fee} type="text" onChange={this.feeChange} onBlur={this.handleGenContract} />
            </FormControl>
            <p className={classes.min}>{this.minFee ? `${labels.moreThan} ${this.minFee}` : ''}</p>
          </div>

          <Button
            disabled={!this.waitConfirm}
            variant="contained"
            color="primary"
            className={classes.button}
            type="submit"
          >
            {labels.create}
          </Button>
        </form>
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
      </Fragment>
    )
  }
}
// export default withStyles(styles)(withNamespaces('contract')(CreateContract))

export const StyleCreateContract = withStyles(styles)(CreateContract)

const CreateContractWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleCreateContract {...other} labels={t('contract:contract')} />
}

export default withTranslation()(CreateContractWrap)
