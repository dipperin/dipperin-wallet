import { observable, action, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React, { Fragment } from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'
import debounce from 'lodash/debounce'
// import isFloat from 'validator/lib/isFloat'
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

@inject('wallet', 'vmContract', 'account')
@observer
export class CreateContract extends React.Component<IProps> {
  // @observable
  // estimateGas: number
  inputABI: HTMLInputElement | null
  inputWasm: HTMLInputElement | null

  /**
   * if use register list? that's a question
   */

  // REGISTER_STRING_INPUT = ['code','abi','amount','gas','gasPrice','param']
  // * consider set the state into private
  @observable
  stringField: Map<string, string> = new Map()
  @observable
  flags: Map<string, boolean> = new Map()

  constructor(props) {
    super(props)
    this.initState()
  }

  @computed
  get jsonAbi() {
    const abiString = this.stringField.get('abi')
    if (abiString) {
      return JSON.parse(helper.Bytes.toString(abiString))
    } else {
      return []
    }
  }

  @action
  setStringField = (key: string, value: string) => {
    // pre validator or process
    this.stringField.set(key, value)
  }

  @action
  setFlags = (key: string, value: boolean) => {
    this.flags.set(key, value)
  }

  /**
   * call the function when start and leave
   */
  initState = () => {
    this.setStringField('code', '')
    this.setStringField('inputWasmPlaceholder', '')
    this.setStringField('abi', '')
    this.setStringField('inputABIPlaceholder', '')
    this.setStringField('gas', '')
    this.setStringField('gasPrice', '')
    this.setStringField('params', '')
    this.setStringField('estimateGas', '')
    this.setStringField('contractAddress', '')
    this.setFlags('showDialog', false)
    this.setFlags('isCreated', true)
    this.setFlags('showDetailParams', false)
  }

  handleJumpToCreated = () => {
    this.setFlags('isCreated', true)
  }

  handleJumpToFavorite = () => {
    this.setFlags('isCreated', false)
  }

  handleChangeCode = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0].name.split('.').reverse()[0] !== 'wasm') {
        await swal.fire({
          type: 'error',
          title: this.props.labels.errorWasmFile
        })
        return
      }
      this.setStringField('inputWasmPlaceholder', e.target.files[0].name)
      const reader = new FileReader()
      await reader.readAsArrayBuffer(e.target.files[0])
      reader.onloadend = () => {
        const code = helper.Bytes.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer))
        this.setStringField('code', code)
      }
    }
  }

  handleChangeAbi = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // console.log(e.target.files[0].name.split('.').reverse())
      if (e.target.files[0].name.split('.').reverse()[0] !== 'json') {
        await swal.fire({
          type: 'error',
          title: this.props.labels.errorAbiFile
        })
        return
      }
      this.setStringField('inputABIPlaceholder', e.target.files[0].name)
      const reader = new FileReader()
      await reader.readAsArrayBuffer(e.target.files[0])
      reader.onloadend = () => {
        const abi = helper.Bytes.fromUint8Array(new Uint8Array(reader.result as ArrayBuffer))
        this.setStringField('abi', abi)
      }
    }
  }

  handleChangeParams = (e: React.ChangeEvent<{ value: string }>) => {
    this.setStringField('params', e.target.value)
  }

  handleToggleDetailParam = () => {
    const newFlag = !this.flags.get('showDetailParams')
    this.setFlags('showDetailParams', newFlag)
  }

  handleChangeGas = (e: React.ChangeEvent<{ value: string }>) => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.setStringField('gas', e.target.value)
    }
  }

  handleChangeGasPrice = (e: React.ChangeEvent<{ value: string }>) => {
    if (isInt(e.target.value) || e.target.value === '') {
      this.setStringField('gasPrice', e.target.value)
    }
  }

  handleChangeContractAddress = (e: React.ChangeEvent<{ value: string }>) => {
    const address = e.target.value
    const pureAddress = `${address.replace('0x', '')}`
    if (/^[0-9a-fA-F]{0,44}$/.test(pureAddress)) {
      this.setStringField('contractAddress', address)
    }
  }

  getContractGas = async () => {
    // TODO: add validator for every input of createContractEstimateGas
    const code = this.stringField.get('code') || ''
    const abi = this.stringField.get('abi') || ''
    const amount = '0'
    const params = this.stringField
      .get('params')!
      .split(',')
      .map(param => param.trim())
    const estimateGasRes = await this.props.vmContract!.createContractEstimateGas(code, abi, amount, params)
    // console.log('createContractEstimateGas', estimateGasRes)
    if (!estimateGasRes.success) {
      return
    }
    try {
      // TODO: add validator for estimateGas
      const estimateGas = estimateGasRes.info || ''
      this.setStringField('estimateGas', estimateGas)
    } catch (e) {
      console.error('estimate gas error', e)
    }
  }

  handleChangeParam(param: string, e: React.ChangeEvent<{ value: string }>) {
    this.setStringField(param, e.target.value)
  }

  handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    this.handleShowDialog()
  }

  dialogConfirm = async (password: string) => {
    const { labels } = this.props
    const res = this.props.wallet!.checkPassword(password)
    if (res) {
      // TODO: add validator for every input of createContractEstimateGas
      const code = this.stringField.get('code') || ''
      const abi = this.stringField.get('abi') || ''
      const gas = this.stringField.get('gas') || ''
      const gasPrice = this.stringField.get('gasPrice') || ''
      const amount = '0'
      const params = this.stringField
        .get('params')!
        .split(',')
        .map(param => param.trim())
      const contractRes = await this.props.vmContract!.confirmCreateContract(code, abi, gas, gasPrice, amount, params)

      if (contractRes.success) {
        await swal.fire({
          title: labels.createSwal.createSuccess,
          type: 'success',
          timer: 1000
        })
        this.handleCloseDialog()
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

  handleAddContract = async (e: React.MouseEvent) => {
    e.preventDefault()
    const { labels } = this.props
    const abi = this.stringField.get('abi') || ''
    const contractAddress = this.stringField.get('contractAddress') || ''
    const contractRes = this.props.vmContract!.addContract(abi, contractAddress)
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

  handleCloseDialog = () => {
    this.setFlags('showDialog', false)
  }

  handleShowDialog = () => {
    this.setFlags('showDialog', true)
  }

  handleOnShowDetailParams = () => {
    this.setFlags('showDetailParams', false)
  }

  handleConfirmGenParams(initFunc: VmcontractAbi) {
    const params = initFunc.inputs.map(input => this.stringField.get(input.name)).join(',')
    this.setStringField('params', params)
    this.handleOnShowDetailParams()
    this.getContractGas()
  }

  addfile = () => {
    if (this.inputABI) {
      this.inputABI.click()
    }
  }

  addWasmFile = () => {
    if (this.inputWasm) {
      this.inputWasm.click()
    }
  }

  getAbi = async () => {
    const contractAddress = this.stringField.get('contractAddress') || ''
    if (Utils.isContractAddress(contractAddress)) {
      const res = await this.props.vmContract!.getABI(contractAddress)
      if ('abiArr' in res) {
        const abi = helper.Bytes.fromString(JSON.stringify(res!.abiArr))
        this.setStringField('abi', abi)
      }
    }
  }

  render() {
    const { classes, labels } = this.props
    let initFunc: VmcontractAbi | undefined
    let placeholder: string | '' = ''
    const abis = this.jsonAbi
    if (abis.length) {
      initFunc = (abis.find(abi => abi.name === 'init' && abi.type === 'function') as unknown) as VmcontractAbi
      // console.log(initFunc)
      if (initFunc.inputs) {
        placeholder = initFunc.inputs.map(input => `${input.type} ${input.name}`).join(',')
      }
    }

    return (
      <Fragment>
        <div className={classes.tab}>
          <div className={classes.tabLeft} data-tour="created-btn">
            <Button
              onClick={this.handleJumpToCreated}
              variant="contained"
              className={classNames(classes.tabButton, { [classes.active]: this.flags.get('isCreated') })}
            >
              {labels.created}
            </Button>
          </div>
          <div className={classes.tabRight} data-tour="receive-btn">
            <Button
              onClick={this.handleJumpToFavorite}
              variant="contained"
              className={classNames(classes.tabButton, { [classes.active]: !this.flags.get('isCreated') })}
            >
              {labels.favorite}
            </Button>
          </div>
        </div>
        <form onSubmit={this.handleConfirm} className={classes.form}>
          {this.flags.get('isCreated') && (
            <Fragment>
              <div className={classes.inputRow}>
                <span>{labels.abi}</span>
                <div
                  style={this.stringField.get('inputABIPlaceholder') ? { color: 'rgba(10,23,76,1)' } : {}}
                  className={classes.selectFile}
                  onClick={this.addfile}
                >
                  {this.stringField.get('inputABIPlaceholder')
                    ? this.stringField.get('inputABIPlaceholder')
                    : labels.selectFile}
                  <img src={this.stringField.get('inputABIPlaceholder') ? SelectedFile : SelctFile} />
                </div>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  required={false}
                  onChange={this.handleChangeAbi}
                  ref={input => {
                    this.inputABI = input
                  }}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.code}</span>
                <div
                  style={this.stringField.get('inputWasmPlaceholder') ? { color: 'rgba(10,23,76,1)' } : {}}
                  className={classes.selectFile}
                  onClick={this.addWasmFile}
                >
                  {this.stringField.get('inputWasmPlaceholder')
                    ? this.stringField.get('inputWasmPlaceholder')
                    : labels.selectFile}
                  <img src={this.stringField.get('inputWasmPlaceholder') ? SelectedFile : SelctFile} />
                </div>
                <input
                  style={{ display: 'none' }}
                  type="file"
                  required={true}
                  onChange={this.handleChangeCode}
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
                    disabled={this.flags.get('showDetailParams')}
                    value={this.stringField.get('params') || ''}
                    placeholder={placeholder}
                    required={initFunc && initFunc.inputs.length > 0}
                    onChange={this.handleChangeParams}
                    onBlur={this.getContractGas}
                  />
                  {initFunc && initFunc.inputs.length > 0 && (
                    <span className={classes.arrow} onClick={this.handleToggleDetailParam}>
                      {this.flags.get('showDetailParams') ? '▲' : '▼'}
                    </span>
                  )}
                  <Fragment>
                    {this.flags.get('showDetailParams') && initFunc && initFunc.inputs.length > 0 && (
                      <div className={classes.detailInputs}>
                        {initFunc.inputs.map((input, index) => (
                          <div key={index} className={classes.paramRow}>
                            <span>{input.name}:</span>
                            <input
                              type="text"
                              // className={classes.inputText}
                              placeholder={input.type}
                              value={this.stringField.get(input.name) || ''}
                              onChange={this.handleChangeParam.bind(this, input.name)}
                            />
                          </div>
                        ))}
                        <Button
                          disabled={false}
                          variant="contained"
                          color="primary"
                          // style={{ background: color }}
                          className={classes.paramBtn}
                          // type="submit"
                          onClick={this.handleConfirmGenParams.bind(this, initFunc)}
                        >
                          {labels.confirm}
                        </Button>
                      </div>
                    )}
                  </Fragment>
                </div>
              </div>
              <div className={classes.inputRow}>
                <span>{labels.gas}</span>
                <input
                  type="text"
                  value={this.stringField.get('gas') || ''}
                  required={true}
                  onChange={this.handleChangeGas}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.gasPrice}</span>
                <input
                  type="text"
                  value={this.stringField.get('gasPrice') || ''}
                  required={true}
                  onChange={this.handleChangeGasPrice}
                />
              </div>
              <div className={classes.inputRow}>
                <span>{labels.estimateGas}</span>
                <span>{this.stringField.get('estimateGas')}</span>
              </div>

              <Button variant="contained" color="primary" className={classes.button} type="submit">
                {labels.create}
              </Button>
            </Fragment>
          )}

          {!this.flags.get('isCreated') && (
            <Fragment>
              <div className={classes.inputRow}>
                <span>{labels.address}</span>
                <input
                  type="text"
                  value={this.stringField.get('contractAddress') || ''}
                  required={true}
                  onChange={this.handleChangeContractAddress}
                  onBlur={this.getAbi}
                />
              </div>
              <Button variant="contained" color="primary" className={classes.button} onClick={this.handleAddContract}>
                {labels.add}
              </Button>
            </Fragment>
          )}
        </form>

        {this.flags.get('showDialog') && (
          <PasswordConfirm onClose={this.handleCloseDialog} onConfirm={this.handleDialogConfirm} />
        )}
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
