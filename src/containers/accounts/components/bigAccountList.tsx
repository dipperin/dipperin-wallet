import React from 'react'
import { I18nCollectionAccount } from '@/i18n/i18n'
import { WithStyles, withStyles } from '@material-ui/core'

import AccountModel from '@/models/account'
import BigAccount from './bigAccount'

import styles from '../accountsStyle'

interface Props extends WithStyles {
  accounts: AccountModel[]
  labels: I18nCollectionAccount['accounts']
  activeId: string
  handleChangeActiveAccount: (id: string) => void
}

export class BigAccountList extends React.Component<Props> {
  render() {
    const { classes, labels, handleChangeActiveAccount, activeId, accounts } = this.props
    return (
      <div className={classes.bigList}>
        {accounts.map((account, index) => {
          return (
            <BigAccount
              key={index}
              labels={labels}
              account={account}
              activeId={activeId}
              handleChangeActiveAccount={handleChangeActiveAccount}
            />
          )
        })}
      </div>
    )
  }
}

export default withStyles(styles)(BigAccountList)
