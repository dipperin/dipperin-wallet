import { observable, action } from 'mobx'
import React, { Fragment } from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
// import { TextField } from '@material-ui/core'
import swal from 'sweetalert2'
import _ from 'lodash'
import isInt from 'validator/lib/isInt'

// model
import { VmcontractAbi } from '@/models/vmContract'

// store
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'

// components
import PasswordConfirm from '@/components/passwordConfirm'
import FunctionCaller from './functionCaller'

import { I18nCollectionContract } from '@/i18n/i18n'
import { helper } from '@dipperin/dipperin.js'
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
  gas: string = '1000000'
  @observable
  gasPrice: string = '1'
  @observable
  abi: VmcontractAbi[] = []

  constructor(props) {
    super(props)
    const {
      match: {
        params: { address }
      },
      vmContract
    } = this.props
    const callContract = vmContract.contract.get(address)
    if (callContract) {
      this.abi = JSON.parse(helper.Bytes.toString(callContract.contractAbi)) as VmcontractAbi[]
      console.log(JSON.parse(helper.Bytes.toString(callContract.contractAbi)))
    }
  }

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

  handleCall = async (funcName: string, params: string) => {
    this.name = funcName
    this.params = params
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
      if (this.abi.find(abi => abi.name === this.name)!.constant === 'true') {
        const constCallRes = await vmContract.confirmConstantCallContractMethod(
          callContract.contractAddress,
          callContract.contractAbi,
          this.name,
          this.gas,
          this.gasPrice,
          this.params.split(',').map(param => param.trim())
        )
        console.log('constCall', constCallRes)
      }

      const callRes = await vmContract.confirmCallContractMethod(
        callContract.contractAddress,
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
        this.handleCloseDialog()
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
      // console.log('vmContract.contract.get(address)', address, callContract)
      return null
    }
    return (
      <Fragment>
        <div className={classes.title}>
          <span>{labels.contractCall}</span>
        </div>
        <div className={classes.inputRow}>
          <span>{labels.gas}</span>
          <input type="text" value={this.gas} required={true} onChange={this.gasChange} />
        </div>
        <div className={classes.inputRow}>
          <span>{labels.gasPrice}</span>
          <input type="text" value={this.gasPrice} required={true} onChange={this.gasPriceChange} />
        </div>

        {this.abi
          .filter(item => item.name !== 'init')
          .map(item => (
            <FunctionCaller labels={labels} func={item} onCall={this.handleCall} key={item.name} />
          ))}

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
