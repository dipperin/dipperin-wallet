import React from 'react'
import classNames from 'classnames'
import AccountModel from '@/models/account'
import { withStyles, WithStyles, Button } from '@material-ui/core'
import swal from 'sweetalert2'
import { I18nCollectionAccount } from '@/i18n/i18n'
import styles from '../accountsStyle'

import Copy from '@/images/copy.png'
import Edit from '@/images/edit.png'

interface BigAccountProps extends WithStyles<typeof styles> {
  account: AccountModel
  activeId: string
  handleChangeActiveAccount: (id: string) => void
  labels: I18nCollectionAccount['accounts']
  showDialogConfirm: (account: AccountModel) => void
}
export class BigAccount extends React.Component<BigAccountProps> {
  handleChangeActiveAccount = () => {
    this.props.handleChangeActiveAccount(this.props.account.id)
  }
  copyAddress = (address: string, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', address)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      swal.fire({
        showCloseButton: false,
        type: 'success',
        timer: 1500,
        title: this.props.labels.copySuccess
      })
    }
    document.body.removeChild(input)
  }
  editAccountName = (e: React.MouseEvent<HTMLButtonElement>): void => {
    const { showDialogConfirm, account } = this.props
    e.stopPropagation()
    showDialogConfirm(account)
  }

  formatNumber = (num: number, w: number) => {
    const m = 10 ** w
    const b = Math.floor(num * m) / m
    return b.toLocaleString('zh-Hans', {
      maximumFractionDigits: w
    })
  }

  render() {
    const { classes, account, activeId, labels } = this.props
    const defaultName = account.name ? account.name : `${labels.account}${account.id}`
    return (
      <div className={classNames(classes.bigItem, 'tour-account')} onClick={this.handleChangeActiveAccount}>
        <p className={classes.bigAccountName}>
          <span>{defaultName}</span>
          <Button className={classes.edit} onClick={this.editAccountName}>
            <img src={Edit} alt="edit" title="edit" />
          </Button>
        </p>
        <div className={classNames(classes.bigId, { ['small-font']: String(account.id).length > 2 })}>{account.id}</div>
        <p className={classes.bigBalance} title={account.balance}>
          {this.formatNumber(Number(account.balance), 6)}
        </p>
        <p className={classes.bigDip}>DIP</p>
        <p className={classes.bigAddress}>{account.address}</p>
        <Button className={classes.copy} onClick={this.copyAddress.bind(this, account.address)}>
          <img src={Copy} alt="" title="copy" />
        </Button>
        {account.id === activeId && <img className={classes.current} src={labels.currentAccount} alt="" />}
      </div>
    )
  }
}

export default withStyles(styles)(BigAccount)
