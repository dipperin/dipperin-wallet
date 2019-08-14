import { observable, action, runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'
import debounce from 'lodash/debounce'
import isFloat from 'validator/lib/isFloat'
import isInt from 'validator/lib/isInt'
import classNames from 'classnames'

import PasswordConfirm from '@/components/passwordConfirm'
// import returnImg from '@/images/return.png'
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'
import AccountStore from '@/stores/account'
import { Button } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { VmcontractAbi } from '@/models/vmContract'

import SelctFile from '@/images/select-file.png'
import SelectedFile from '@/images/select-file-ed.png'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './styles'
import { helper, Utils } from '@dipperin/dipperin.js'

interface WrapProps extends RouteComponentProps<{}> {
  account?: AccountStore
  wallet?: WalletStore
  vmContract?: VmContractStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}
interface IParamsValue {
  [param: string]: string
}

@inject('wallet', 'vmContract', 'account')
@observer
export class CreateContract extends React.Component<IProps> {
  @observable
  code: string = ''
  @observable
  abi: string = ''
  @observable
  amount: string = '0'
  @observable
  gas: string = ''
  @observable
  gasPrice: string = ''
  @observable
  params: string = ''
  @observable
  showDialog: boolean = false
  @observable
  isCreated: boolean = true
  @observable
  contractAddress: string = ''
  @observable
  showDetailParams: boolean = false
  @observable
  paramsValue: IParamsValue = {}
  @observable
  estimateGas: number
  inputABI: HTMLInputElement | null
  @observable
  inputABIPlaceholder: string = ''
  inputWasm: HTMLInputElement | null
  @observable
  inputWasmPlaceholder: string = ''

  @action
  codeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].name.split('.').reverse()[0] !== 'wasm') {
        await swal.fire({
          type: 'error',
          title: this.props.labels.errorWasmFile
        })
        return
      }
      this.inputWasmPlaceholder = e.target.files[0].name
      const reader = new FileReader()
      await reader.readAsArrayBuffer(e.target.files[0])
      reader.onloadend = () => {
        runInAction(() => {
          this.code = helper.Bytes.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer))
        })
      }
    }
  }

  @action
  jumpToCreated = () => {
    this.isCreated = true
  }

  @action
  jumpToFavorite = () => {
    this.isCreated = false
  }

  @action
  abiChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log(e.target.files[0].name.split('.').reverse())
      if (e.target.files[0].name.split('.').reverse()[0] !== 'json') {
        await swal.fire({
          type: 'error',
          title: this.props.labels.errorAbiFile
        })
        return
      }
      this.inputABIPlaceholder = e.target.files[0].name
      const reader = new FileReader()
      await reader.readAsArrayBuffer(e.target.files[0])
      reader.onloadend = () => {
        runInAction(() => {
          this.abi = helper.Bytes.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer))
        })
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
  contractAddressChange = (e: React.ChangeEvent<{ value: string }>) => {
    const address = e.target.value
    const hexAddress = `0x${address.replace('0x', '')}`
    if (Utils.isAddress(hexAddress)) {
      this.contractAddress = address
    }
  }

  @action
  paramsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.params = e.target.value
  }

  @action
  toggleDetailParam = () => {
    this.showDetailParams = !this.showDetailParams
  }

  @action
  getContractGas = async () => {
    const estimateGasRes = await this.props.vmContract!.createContractEstimateGas(
      this.code,
      this.abi,
      this.gas,
      this.gasPrice,
      this.amount,
      this.params.split(',').map(param => param.trim())
    )
    // console.log('createContractEstimateGas', estimateGasRes)
    if (estimateGasRes.success) {
      try {
        const estimateGas = Number(estimateGasRes.info)
        runInAction(() => {
          this.estimateGas = estimateGas
        })
      } catch (e) {
        console.error('estimate gas error', e)
      }
    }
  }

  paramsValueChange = (param: string) => (e: React.ChangeEvent<{ value: string }>) => {
    runInAction(() => {
      this.paramsValue[param] = e.target.value
    })
  }

  handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    this.handleShowDialog()
  }

  dialogConfirm = async (password: string) => {
    const { labels } = this.props
    const res = this.props.wallet!.checkPassword(password)
    if (res) {
      const contractRes = await this.props.vmContract!.confirmCreateContract(
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
        runInAction(() => {
          this.showDialog = false
        })
        // this.switchToList()
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

  addContract = async (e: React.MouseEvent) => {
    e.preventDefault()
    const { labels } = this.props
    const contractRes = this.props.vmContract!.addContract(this.abi, this.contractAddress)
    if (contractRes.success) {
      await swal.fire({
        title: labels.createSwal.createSuccess,
        type: 'success',
        timer: 1000
      })
    } else {
      swal.fire({
        title: labels.createSwal.createErr,
        text: contractRes.info,
        type: 'error'
      })
    }
  }

  @action
  handleCloseDialog = () => (this.showDialog = false)

  @action
  handleShowDialog = () => (this.showDialog = true)

  switchToList = () => {
    this.props.history.push('/main/vm_contract/list')
  }

  @action
  genParams = () => {
    this.params = Object.values(this.paramsValue).join(',')
    this.showDetailParams = false
  }

  addfile = () => {
    this.inputABI!.click()
  }

  addWasmFile = () => {
    this.inputWasm!.click()
  }

  getAbi = async () => {
    const res = await this.props.vmContract!.getABI(this.contractAddress)
    runInAction(() => {
      if ('abiArr' in res) {
        this.abi = helper.Bytes.fromString(JSON.stringify(res!.abiArr))
      }
    })
    // console.log(res2)
    // const res3 = helper.Bytes.toString(res2)
    // console.log(res3)
  }

  render() {
    const { classes, labels } = this.props
    let abis
    let initFunc: VmcontractAbi | undefined
    let placeholder: string | '' = ''
    if (this.abi) {
      abis = JSON.parse(helper.Bytes.toString(this.abi))
      if (abis instanceof Array) {
        initFunc = (abis.find(abi => abi.name === 'init' && abi.type === 'function') as unknown) as VmcontractAbi
        // console.log(initFunc)
        if (initFunc.inputs) {
          placeholder = initFunc.inputs.map(input => `${input.type} ${input.name}`).join(',')
        }
      }
    }
    // console.log('placeholder', placeholder)

    // initFunc= JSON.parse(helper.Bytes.toString(this.abi)).filter(abi=>(abi.name==='init')&&(abi.type==='function'))
    return (
      <Fragment>
        <div className={classes.tab}>
          <div className={classes.tabLeft} data-tour="created-btn">
            <Button
              onClick={this.jumpToCreated}
              variant="contained"
              className={classNames(classes.tabButton, { [classes.active]: this.isCreated })}
            >
              {labels.created}
            </Button>
          </div>
          <div className={classes.tabRight} data-tour="receive-btn">
            <Button
              onClick={this.jumpToFavorite}
              variant="contained"
              className={classNames(classes.tabButton, { [classes.active]: !this.isCreated })}
            >
              {labels.favorite}
            </Button>
          </div>
        </div>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          {this.isCreated && (
            <Fragment>
              <div className={classes.inputRow}>
                <span>{labels.abi}</span>
                <div
                  style={this.inputABIPlaceholder ? { color: 'rgba(10,23,76,1)' } : {}}
                  className={classes.selectFile}
                  onClick={this.addfile}
                >
                  {this.inputABIPlaceholder ? this.inputABIPlaceholder : labels.selectFile}
                  <img src={this.inputABIPlaceholder ? SelectedFile : SelctFile} />
                </div>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  required={false}
                  onChange={this.abiChange}
                  ref={input => {
                    this.inputABI = input
                  }}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.code}</span>
                <div
                  style={this.inputWasmPlaceholder ? { color: 'rgba(10,23,76,1)' } : {}}
                  className={classes.selectFile}
                  onClick={this.addWasmFile}
                >
                  {this.inputWasmPlaceholder ? this.inputWasmPlaceholder : labels.selectFile}
                  <img src={this.inputWasmPlaceholder ? SelectedFile : SelctFile} />
                </div>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  required={true}
                  onChange={this.codeChange}
                  ref={input => {
                    this.inputWasm = input
                  }}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.initParams}</span>
                <div className={classes.paramsBox}>
                  <input
                    type="text"
                    className={classes.initParamsInput}
                    disabled={this.showDetailParams}
                    value={this.params}
                    placeholder={placeholder}
                    required={initFunc && initFunc.inputs.length > 0}
                    onChange={this.paramsChange}
                    onBlur={this.getContractGas}
                  />
                  {initFunc && initFunc.inputs.length > 0 && (
                    <span className={classes.arrow} onClick={this.toggleDetailParam}>
                      {this.showDetailParams ? '▲' : '▼'}
                    </span>
                  )}
                  {this.showDetailParams && initFunc && initFunc.inputs.length > 0 && (
                    <div className={classes.detailInputs}>
                      {initFunc.inputs.map(input => (
                        <div key={input.name} className={classes.paramRow}>
                          <span>{input.name}:</span>
                          <input
                            type="text"
                            // className={classes.inputText}
                            placeholder={input.type}
                            value={this.paramsValue[input.name]}
                            onChange={this.paramsValueChange(input.name)}
                          />
                        </div>
                      ))}
                      <Button
                        disabled={false}
                        variant="contained"
                        color="primary"
                        // style={{ background: color }}
                        className={classes.paramBtn}
                        onClick={this.genParams}
                      >
                        {labels.confirm}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className={classes.inputRow}>
                <span>{labels.gas}</span>
                <input type="text" value={this.gas} required={true} onChange={this.gasChange} />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.gasPrice}</span>
                <input type="text" value={this.gasPrice} required={true} onChange={this.gasPriceChange} />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.estimateGas}</span>
                <span>{this.estimateGas}</span>
              </div>

              <Button variant="contained" color="primary" className={classes.button} type="submit">
                {labels.create}
              </Button>
            </Fragment>
          )}

          {!this.isCreated && (
            <Fragment>
              <div className={classes.inputRow}>
                <span>{labels.address}</span>
                <input
                  type="text"
                  value={this.contractAddress}
                  required={true}
                  onChange={this.contractAddressChange}
                  onBlur={this.getAbi}
                />
              </div>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.addContract}>
                {labels.add}
              </Button>
            </Fragment>
          )}
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
