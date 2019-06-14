import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'
import debounce from 'lodash/debounce'
import isFloat from 'validator/lib/isFloat'
import isInt from 'validator/lib/isInt'

import PasswordConfirm from '@/components/passwordConfirm'
import returnImg from '@/images/return.png'
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'
import AccountStore from '@/stores/account'
import { Button, FormControl, Input, InputLabel } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './styles'
import { helper } from '@dipperin/dipperin.js'

interface WrapProps extends RouteComponentProps<{}> {
  account: AccountStore
  wallet: WalletStore
  vmContract: VmContractStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}
@inject('wallet', 'vmContract', 'account')
@observer
export class CreateContract extends React.Component<IProps> {
  @observable
  code: string = ''
  @observable
  abi: string = ''
  @observable
  amount: string = ''
  @observable
  gas: string = ''
  @observable
  gasPrice: string = ''
  @observable
  params: string = ''
  @observable
  showDialog: boolean = false

  @action
  codeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      await reader.readAsArrayBuffer(e.target.files[0])
      reader.onloadend = () => {
        this.code = helper.Bytes.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer))
      }
    }
  }

  @action
  abiChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader()
      await reader.readAsArrayBuffer(e.target.files[0])
      reader.onloadend = () => {
        this.abi = helper.Bytes.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer))
      }
    }
  }

  @action
  amountChange = (e: React.ChangeEvent<{ value: string }>) => {
    if (isFloat(e.target.value) || e.target.value === '') {
      this.amount = e.target.value
    }
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

  @action
  paramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.params = e.target.value
  }

  handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    this.handleShowDialog()
  }

  dialogConfirm = async (password: string) => {
    const { labels } = this.props
    const res = this.props.wallet!.checkPassword(password)
    if (res) {
      const contractRes = await this.props.vmContract.confirmCreateContract(
        this.code,
        this.abi,
        this.gas,
        this.gasPrice,
        this.amount,
        this.params.split(',').map(param => param.trim())
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
    this.props.history.push('/main/vm_contract/list')
  }

  render() {
    const { classes, labels } = this.props
    return (
      <Fragment>
        <p className={classes.return} onClick={this.switchToList}>
          <img src={returnImg} alt="" />
          <span>{labels.return}</span>
        </p>
        <p className={classes.title}>{labels.createVmTitle}</p>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel shrink={true}>{labels.code}</InputLabel>
              <Input type="file" onChange={this.codeChange} required={true} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel shrink={true}>{labels.abi}</InputLabel>
              <Input type="file" required={true} onChange={this.abiChange} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.amount}</InputLabel>
              <Input type="text" value={this.amount} required={true} onChange={this.amountChange} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.gas}</InputLabel>
              <Input type="text" value={this.gas} required={true} onChange={this.gasChange} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.gasPrice}</InputLabel>
              <Input value={this.gasPrice} type="text" required={true} onChange={this.gasPriceChange} />
            </FormControl>
          </div>
          <div className={classes.inputItem}>
            <FormControl fullWidth={true}>
              <InputLabel>{labels.initParams}</InputLabel>
              <Input value={this.params} type="text" required={true} onChange={this.paramsChange} />
            </FormControl>
          </div>

          <Button variant="contained" color="primary" className={classes.button} type="submit">
            {labels.create}
          </Button>
        </form>
        {this.showDialog && <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />}
      </Fragment>
    )
  }
}

export const StyleCreateContract = withStyles(styles)(CreateContract)

const CreateContractWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleCreateContract {...other} labels={t('contract:contract')} />
}

export default withTranslation()(CreateContractWrap)
