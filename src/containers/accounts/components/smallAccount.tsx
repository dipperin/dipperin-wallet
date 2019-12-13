import React from 'react'
import classNames from 'classnames'
import AccountModel from '@/models/account'
import { withStyles, WithStyles } from '@material-ui/core'

import { I18nCollectionAccount } from '@/i18n/i18n'
import styles from '../accountsStyle'

interface SmalllAccountPropss extends WithStyles<typeof styles> {
  account: AccountModel
  selectedId: string
  activeId: string
  changeAccount: (id: string) => void
  labels: I18nCollectionAccount['accounts']
}

export class SmallAccount extends React.Component<SmalllAccountPropss> {
  changeAccount = () => {
    const {
      account: { id }
    } = this.props
    this.props.changeAccount(id)
  }

  render() {
    const { classes, account, activeId, selectedId, labels } = this.props
    return (
      <li
        className={classNames(classes.item, account.id === selectedId ? classes.selected : '')}
        onClick={this.changeAccount}
      >
        <p className={classes.smallAccountName}>{account.name ? account.name : `${labels.account} ${account.id}`}</p>
        <div className={classes.smallId}>{account.id}</div>
        <p className={classes.smallBalance}>{account.balance}</p>
        <p className={classes.smallDip}>DIP</p>
        <p className={classes.smallAddress}>{account.address}</p>
        {account.id === activeId && <img className={classes.smallCurrent} src={labels.currentAccount} alt="current" />}
        {account.id !== selectedId && <div className={classes.smallShadow} />}
      </li>
    )
  }
}

export default withStyles(styles)(SmallAccount)
