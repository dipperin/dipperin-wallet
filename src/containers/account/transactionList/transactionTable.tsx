import classNames from 'classnames'
import format from 'date-fns/format'
import React from 'react'

import { Tooltip, withStyles, WithStyles } from '@material-ui/core'

import styles from './transactionListStyle'

interface Transaction {
  transactionHash: string
  status: string
  from: string
  to: string
  value: string
  statusLabel: string
  detail: string
  timestamp: number
}

interface Props extends WithStyles<typeof styles> {
  transactions: Transaction[]
  jumpToDetail: (hash: string) => void
}

export class TransactionTable extends React.PureComponent<Props> {
  jumpToDetail = (hash: string) => {
    this.props.jumpToDetail(hash)
  }
  render() {
    const { classes, transactions } = this.props
    return transactions.map((tx, key) => {
      return (
        <TransactionItem key={tx.transactionHash} transaction={tx} classes={classes} jumpToDetail={this.jumpToDetail} />
      )
    })
  }
}

export class TransactionItem extends React.PureComponent<
  {
    transaction: Transaction
    jumpToDetail: (hash: string) => void
  } & WithStyles<typeof styles>
> {
  jumpToDetail = () => {
    this.props.jumpToDetail(this.props.transaction.transactionHash)
  }

  render() {
    const { transaction, classes } = this.props
    return (
      <div className={classNames(classes.transactionsItem, transaction.status === 'success' ? classes.success : '')}>
        <p className={classes.itemTime}>{format(new Date(transaction.timestamp), 'YY/MM/DD HH:mm')}</p>
        <Tooltip title={transaction.from}>
          <p className={classes.itemAddress}>{transaction.from}</p>
        </Tooltip>
        <Tooltip title={transaction.to}>
          <p className={classes.itemAddress}>{transaction.to}</p>
        </Tooltip>
        <Tooltip title={transaction.value}>
          <p className={classes.itemAmount}>{transaction.value}</p>
        </Tooltip>
        <p className={classes.itemStatu}>{transaction.statusLabel}</p>
        <p className={classNames(classes.itemOperation, classes.detail)} onClick={this.jumpToDetail}>
          {transaction.detail}
        </p>
      </div>
    )
  }
}

export default withStyles(styles)(TransactionTable)
