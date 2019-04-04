import React from 'react'
import classNames from 'classnames'
import format from 'date-fns/format'
import TransactionModel from '@/models/transaction'
import { withStyles, WithStyles, Tooltip } from '@material-ui/core'

import { getContractAmount, getContractType, showContractFrom, showContractTo } from '@/utils'
import { I18nCollectionContract } from '@/i18n/i18n'

import styles from './styles'

interface Props {
  contractTx: TransactionModel[]
  decimal: number
  labels: I18nCollectionContract['transferTx']
}

export class ContractTxTable extends React.Component<Props> {
  render() {
    const { contractTx, decimal, labels } = this.props
    return (
      <React.Fragment>
        {contractTx.map((tx, index) => {
          return <StyleTxItem labels={labels} decimal={decimal} tx={tx} key={index} />
        })}
      </React.Fragment>
    )
  }
}

export default ContractTxTable

interface ItemProps extends WithStyles {
  labels: I18nCollectionContract['transferTx']
  tx: TransactionModel
  decimal: number
}

export class TxItem extends React.Component<ItemProps> {
  render() {
    const { tx, classes, decimal, labels } = this.props
    const to = showContractTo(tx)
    const from = showContractFrom(tx)
    const amount = (Number(getContractAmount(tx.extraData)) / Math.pow(10, decimal)).toFixed(decimal)
    return (
      <div className={classNames(classes.transactionsItem, tx.status === 'success' ? classes.success : '')}>
        <p className={classes.itemType}>{getContractType(tx.extraData)}</p>
        <p className={classes.itemTime}>{format(new Date(tx.timestamp), 'YY/MM/DD HH:mm')}</p>
        <Tooltip title={from}>
          <p className={classes.itemFrom}>{from}</p>
        </Tooltip>
        <Tooltip title={to}>
          <p className={classes.itemAddress}>{to}</p>
        </Tooltip>
        <Tooltip title={amount}>
          <p className={classes.itemAmount}>{amount}</p>
        </Tooltip>
        <p className={classes.itemStatu}>{labels[tx.status]}</p>
      </div>
    )
  }
}

const StyleTxItem = withStyles(styles)(TxItem)
