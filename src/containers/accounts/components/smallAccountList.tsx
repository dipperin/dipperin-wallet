import React from 'react'
import { I18nCollectionAccount } from '@/i18n/i18n'
import { observer } from 'mobx-react'

import AccountModel from '@/models/account'
import SmallAccount from './smallAccount'

interface Props {
  accounts: AccountModel[]
  labels: I18nCollectionAccount['accounts']
  selectedId: string
  activeId: string
  changeAccount: (id: string) => void
}

@observer
export class SmallAccountList extends React.Component<Props> {
  render() {
    const { labels, changeAccount, selectedId, activeId, accounts } = this.props
    return (
      <React.Fragment>
        {accounts.map((account, index) => {
          return (
            <SmallAccount
              key={index}
              labels={labels}
              account={account}
              selectedId={selectedId}
              activeId={activeId}
              changeAccount={changeAccount}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

export default SmallAccountList
