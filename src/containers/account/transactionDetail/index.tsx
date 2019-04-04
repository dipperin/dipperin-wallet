import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'

import DetailRight from '@/images/detail-right.png'
import TransactionStore from '@/stores/transaction'
import { formatUTCTime } from '@/utils'
import { WithStyles, withStyles } from '@material-ui/core'

import { I18nCollectionTransaction } from '@/i18n/i18n'

import styles from './transactionDetailStyle'

interface Props extends WithStyles<typeof styles>, RouteComponentProps<{ id: string }> {
  transaction?: TransactionStore
  labels: I18nCollectionTransaction['txDetail']
}

@inject('transaction')
@observer
export class TransactionDetail extends React.Component<Props> {
  switchToList = () => {
    this.props.history.push('/main/wallet')
  }

  render() {
    const { classes, labels, transaction, match } = this.props
    const tx = transaction!.transactions.find(itx => itx.transactionHash === match.params.id)
    if (!tx) {
      return null
    }
    return (
      <div>
        <p className={classes.title}>
          <span onClick={this.switchToList}>{labels.preTitle}</span>
          <img src={DetailRight} alt="" />
          <span>{labels.title}</span>
        </p>
        <div className={classes.transactionDetail}>
          <div className={classes.item}>
            <p className={classes.label}>{labels.value}:</p>
            <p className={classes.value}>{tx.value}DIP</p>
          </div>
          <div className={classes.item}>
            <p className={classes.label}>{labels.timeStamps}:</p>
            <p className={classes.value}>{formatUTCTime(String(tx.timestamp))}</p>
          </div>
          <div className={classes.item}>
            <p className={classes.label}>{labels.nonce}:</p>
            <p className={classes.value}>{tx.nonce}</p>
          </div>
          <div className={classes.item}>
            <p className={classes.label}>{labels.extraData}:</p>
            <p className={classes.value}>{tx.extraData}</p>
          </div>
          <div className={classes.item}>
            <p className={classes.label}>{labels.from}:</p>
            <p className={classes.value}>{tx.from}</p>
          </div>
          <div className={classes.item}>
            <p className={classes.label}>{labels.to}:</p>
            <p className={classes.value}>{tx.to}</p>
          </div>
          <div className={classes.item}>
            <p className={classes.label}>hash:</p>
            <p className={classes.value}>{tx.transactionHash}</p>
          </div>
        </div>
      </div>
    )
  }
}

export const TransactionDetailWithStyle = withStyles(styles)(TransactionDetail)

const TransactionDetailWrapper = (props: WithTranslation & RouteComponentProps<{ id: string }>) => {
  const { t, ...other } = props
  return <TransactionDetailWithStyle {...other} labels={t('transaction:txDetail')} />
}

export default withTranslation()(TransactionDetailWrapper)
