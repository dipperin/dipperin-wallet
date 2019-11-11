import { observable, action, runInAction } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { Utils } from '@dipperin/dipperin.js'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  onClose: () => void
  onConfirm: (address: string, value: string) => void
  address: string
  balance: string
}

@observer
export class WithdrawModal extends React.Component<Props> {
  @observable
  targetAddress: string = ''
  @observable
  value: string = ''
  @observable
  withdrawAmountUnit: string

  constructor(props) {
    super(props)
    runInAction(() => {
      this.targetAddress = this.props.address
      this.value = `${this.formatBalance(this.props.balance)} DIP`
      this.withdrawAmountUnit = this.props.balance
    })
  }

  formatBalance(num: string) {
    const amount = Utils.fromUnit(num)
    if (amount.match(/^([0-9]+(\.[0-9]{1,6})?)/)) {
      return amount.match(/^([0-9]+(\.[0-9]{1,6})?)/)![0]
    } else {
      return '0'
    }
  }

  @action
  handleChangeTargetAddress = (e: React.ChangeEvent<{ value: string }>) => {
    if (/^(0x)?[0-9a-f]{0,44}$/i.test(e.target.value.toLowerCase())) {
      this.targetAddress = e.target.value
    }
  }

  @action
  handleChangeValue = (e: React.ChangeEvent<{ value: string }>) => {
    if (/(^([1-9][0-9]*)?([0-9]\.[0-9]{0,6})?$)|^0$/i.test(e.target.value)) {
      this.value = e.target.value
    }
  }

  @action
  handleOnFocus = () => {
    this.value = this.value.replace(' DIP', '')
  }

  @action
  handleOnblur = () => {
    // get rid of 0.000000
    let fmtValue = this.value.replace(/\.?0*$/, '')
    fmtValue = fmtValue + ' DIP'
    runInAction(() => {
      this.value = fmtValue
      this.withdrawAmountUnit = Utils.toUnit(fmtValue)
    })
  }

  handleOnConfrim = async () => {
    await this.props.onConfirm(this.targetAddress, this.withdrawAmountUnit)
    this.props.onClose()
  }

  render() {
    const { classes, onClose } = this.props
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <div className={classes.dialogMain}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            <span className={classes.dialogTitle}>提现</span>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <p className={classes.inputLabel}>收款地址</p>
            <textarea
              className={classes.input}
              style={{ height: '54px', marginBottom: '10px' }}
              value={this.targetAddress}
              onChange={this.handleChangeTargetAddress}
            />
            <p className={classes.inputLabel}>提现金额</p>
            <textarea
              className={classes.input}
              style={{ height: '36px' }}
              value={this.value}
              onChange={this.handleChangeValue}
              onFocus={this.handleOnFocus}
              onBlur={this.handleOnblur}
            />
            <p className={classes.postInfo}>可提现金额：{`${this.formatBalance(this.props.balance)} DIP`}</p>
          </DialogContent>
          <DialogActions className={classes.dialogBtns}>
            <Button
              variant="contained"
              className={classes.dialogBtn}
              style={{ background: '#F2F3F7' }}
              color="primary"
              onClick={onClose}
            >
              <span style={{ color: '#838899' }}>Cancel</span>
            </Button>
            <Button variant="contained" className={classes.dialogBtn} color="primary" onClick={this.handleOnConfrim}>
              Withdraw
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(styles)(WithdrawModal)
