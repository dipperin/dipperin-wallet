import { computed, observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import Pagination from 'rc-pagination'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'

import TransactionModel from '@/models/transaction'
import TransactionStore from '@/stores/transaction'
import AccountStore from '@/stores/account'
import { withStyles, WithStyles } from '@material-ui/core'

import { I18nCollectionTransaction } from '@/i18n/i18n'

import TransactionTable from './transactionTable'

import NoRecords from '../../../images/norecord.png'
import styles from './transactionListStyle'

const PER_PAGE = 10

interface Props extends RouteComponentProps, WithStyles<typeof styles> {
  account?: AccountStore
  transaction?: TransactionStore
  labels: I18nCollectionTransaction['txList']
  language: string
}

@inject('account', 'transaction')
@observer
export class TransactionList extends React.Component<Props> {
  @observable
  page: number = 1

  @computed
  get minIndex() {
    return (this.page - 1) * PER_PAGE
  }

  @computed
  get maxIndex() {
    return this.page * PER_PAGE - 1
  }

  @action
  pageChange = (value: number) => {
    this.page = value
  }

  jumpToDetail = (hash: string) => {
    this.props.history.push(`/main/wallet/${hash}`)
  }

  render() {
    const { classes, labels, language, account, transaction } = this.props

    const activeaccount = account!.activeAccount
    if (!activeaccount) {
      return null
    }
    const transactions = transaction!.transactions || []
    const isChinese = language === 'zh-CN'
    const haveTransaction = transactions.length > 0
    return (
      <div>
        <p className={classes.title}>{labels.title}</p>
        <div className={classes.transactionsList}>
          {haveTransaction && (
            <div className={classes.transactionsListHeader}>
              <p className={classes.itemTime}>{labels.time}</p>
              <p className={classes.itemAddress}>{labels.from}</p>
              <p className={classes.itemAddress}>{labels.to}</p>
              <p className={classes.itemAmount}>{labels.amount}</p>
              <p className={classes.itemStatu}>{labels.state}</p>
              <p className={classes.itemOperation}>{labels.operation}</p>
            </div>
          )}
          <div className={classes.transactionsListBody}>
            <TransactionTable
              transactions={transactions
                .filter((_, index) => {
                  return index >= this.minIndex && index <= this.maxIndex
                })
                .map((tx: TransactionModel) => {
                  return {
                    transactionHash: tx.transactionHash,
                    from: tx.from,
                    to: tx.to,
                    status: tx.status,
                    value: tx.value,
                    timestamp: tx.timestamp,
                    statusLabel: labels[tx.status],
                    detail: labels.detail
                  }
                })}
              jumpToDetail={this.jumpToDetail}
            />
          </div>
          {!haveTransaction && (
            <div className={classes.noRecords}>
              <img src={NoRecords} alt="no records" draggable={false} />
              <p>{labels.noRecords}</p>
            </div>
          )}

          <div className={classes.pagination}>
            <Pagination
              current={this.page}
              total={transactions.length}
              pageSize={PER_PAGE}
              onChange={this.pageChange}
              hideOnSinglePage={true}
              locale={isChinese ? undefined : EN}
            />
          </div>
        </div>
      </div>
    )
  }
}

export const TransactionListWithStyle = withStyles(styles)(TransactionList)

const TransactionListWrapper = (props: RouteComponentProps & WithTranslation) => {
  const { t, i18n, ...others } = props
  return <TransactionListWithStyle {...others} labels={t('transaction:txList')} language={i18n.language} />
}

export default withTranslation()(TransactionListWrapper)

const EN = {
  // Options.jsx
  items_per_page: '/ page',
  jump_to: 'Goto',
  jump_to_confirm: 'confirm',
  page: '',

  // Pagination.jsx
  prev_page: 'Previous Page',
  next_page: 'Next Page',
  prev_5: 'Previous 5 Pages',
  next_5: 'Next 5 Pages',
  prev_3: 'Previous 3 Pages',
  next_3: 'Next 3 Pages'
}
