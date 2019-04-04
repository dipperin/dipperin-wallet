import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'

import Send from '@/containers/send'
import { I18nCollectionAccount } from '@/i18n/i18n'
import AccountStore from '@/stores/account'
import { Omit } from '@/types/utils.d.ts'
import { Button } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import AddressQRCode from './addressQRCode'
import styles from './styles'

interface Props extends WithStyles<typeof styles>, WrapperProps {
  labels: I18nCollectionAccount['account']
  language: string
  account?: AccountStore
  // transaction?: TransactionStore
}

@inject('account')
@observer
export class Transfer extends React.Component<Props> {
  checkToCollenction = () => {
    this.props.history.push(this.props.location.pathname, { isSend: false })
  }

  checkToSend = () => {
    this.props.history.push(this.props.location.pathname, { isSend: true })
  }

  render() {
    const { classes, labels, language, account, isSend } = this.props
    const isChinese = language === 'zh-CN'

    const activeAccount = account!.activeAccount
    if (!activeAccount) {
      return null
    }
    return (
      <div data-tour="send-form">
        <p className={classes.title}>{labels.transfer}</p>
        <div className={classes.tab}>
          <div className={classes.tabLeft}>
            <Button
              onClick={this.checkToSend}
              variant="contained"
              className={classNames(classes.button, { [classes.active]: isSend })}
            >
              {labels.send}
            </Button>
          </div>
          <div className={classes.tabRight}>
            <Button
              onClick={this.checkToCollenction}
              variant="contained"
              className={classNames(classes.button, { [classes.active]: !isSend })}
            >
              {labels.receive}
            </Button>
          </div>
        </div>
        {isSend ? (
          <div>
            <Send />
          </div>
        ) : (
          <AddressQRCode isChinese={isChinese} address={activeAccount.address} account={account!} />
        )}
      </div>
    )
  }
}

export const TransferWithStyle = withStyles(styles)(Transfer)

interface WrapperProps extends Omit<RouteComponentProps, 'match'> {
  isSend: boolean
}

const TransferWrapper = (props: WrapperProps & WithTranslation) => {
  const { t, i18n, ...others } = props
  return <TransferWithStyle {...others} language={i18n.language} labels={t('account:account')} />
}

export default withTranslation()(TransferWrapper)
