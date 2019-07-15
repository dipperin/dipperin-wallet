import React from 'react'
import { observable, action } from 'mobx'
// import classNames from 'classnames'
import { VmcontractAbi } from '@/models/vmContract'
import { observer } from 'mobx-react'
import { withStyles, WithStyles, Button } from '@material-ui/core'

import { I18nCollectionContract } from '@/i18n/i18n'

import styles from './styles'

// import { TRANSACTION_STATUS_SUCCESS } from '@/utils/constants'

interface Props extends WithStyles {
  func: VmcontractAbi
  labels: I18nCollectionContract['contract']
  onCall: (funcName: string, params: string) => void
}

interface InputValue {
  [inputName: string]: string
}

@observer
class FunctionCaller extends React.Component<Props> {
  @observable
  inputValue: InputValue = {}
  @observable
  params: string = ''
  @observable
  ifshowDetailInput: boolean = false

  @action
  paramsChange = (e: React.ChangeEvent<{ value: string }>) => {
    this.params = e.target.value
  }

  @action
  toggleShowDetailInput = () => {
    this.ifshowDetailInput = !this.ifshowDetailInput
  }

  InputValueChange = (name: string) => (e: React.ChangeEvent<{ value: string }>) => {
    this.inputValue[name] = e.target.value
  }

  paramsCall = () => {
    const funcName = this.props.func.name
    this.props.onCall(funcName, this.params)
  }

  detailCall = () => {
    const funcName = this.props.func.name
    const params = Object.values(this.inputValue).join(',')
    this.props.onCall(funcName, params)
  }

  render() {
    const { labels, func, classes } = this.props
    if (func.type !== 'function') {
      return null
    }
    const placeholder = this.props.func.inputs.map(item => `${item.type} ${item.name}`).join(',')
    const color = `#${func.constant === 'true' ? '207FDE' : 'F48E0B'}`
    return (
      <div className={classes.callerBox} style={{ borderLeft: `4px solid ${color}` }}>
        <div className={classes.topbar}>
          <button disabled={this.ifshowDetailInput} className={classes.topBtn} onClick={this.paramsCall}>
            {func.name}
          </button>
          <input
            className={classes.topInput}
            disabled={this.ifshowDetailInput}
            value={this.params}
            placeholder={placeholder}
            onChange={this.paramsChange}
          />
          <span className={classes.arrow} onClick={this.toggleShowDetailInput}>
            {this.ifshowDetailInput ? '▲' : '▼'}
          </span>
        </div>
        {this.ifshowDetailInput && (
          <div className={classes.inputList}>
            {func.inputs.map(input => (
              <div key={input.name} className={classes.inputItem}>
                <span className={classes.inputName}>{input.name}:</span>
                <input
                  className={classes.inputText}
                  placeholder={input.type}
                  value={this.inputValue[input.name]}
                  onChange={this.InputValueChange(input.name)}
                />
              </div>
            ))}

            <Button
              disabled={false}
              variant="contained"
              style={{ background: '#0A174C' }}
              className={classes.button}
              onClick={this.detailCall}
            >
              {labels.confirm}
            </Button>
          </div>
        )}
        {/* <div className={classes.resultBox}>
          <div>Result:</div>
          <div>content</div>
        </div> */}
      </div>
    )
  }
}

export default withStyles(styles)(FunctionCaller)
