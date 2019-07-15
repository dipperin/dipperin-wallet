import React from 'react'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { withTranslation, WithTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
// import { Utils } from '@dipperin/dipperin.js'

import _ from 'lodash'

// store
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './styles'

// components
import ContractList from './contractList'

interface WrapProps extends RouteComponentProps<{ address: string }> {
  vmContract: VmContractStore
  wallet: WalletStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('vmContract')
@observer
export class Receipts extends React.Component<IProps> {
  switchToList = () => {
    this.props.history.push('/main/vm_contract')
  }

  render() {
    const {
      vmContract,
      classes,
      labels,
      match: {
        params: { address }
      }
    } = this.props
    const receipts = vmContract.receipts.get(address) || []

    return (
      <div className={classes.container}>
        <p className={classes.return}>
          <span onClick={this.switchToList}>{labels.contract}</span>
          <span> >> </span>
          <span>{labels.detail}</span>
        </p>
        <div className={classes.contractsList}>
          <div className={classes.contractsListHeader}>
            <p>{labels.txHash}</p>
            <p>{labels.method}</p>
            <p>{labels.data}</p>
            {/* <p>{labels.type}</p> */}
            {/* <p>{labels.amount}</p> */}
          </div>
          <div className={classes.contractsListBody}>
            <ContractList
              receipts={receipts}
              // handleShowTransfer={this.handleShowTransfer}
              // handleShowContractTx={this.handleShowContractTx}
              labels={labels}
            />
          </div>
        </div>
        {/* {receipts.map((receipt, index) => {
          return (
            <div key={index}>
              <h2>Receipt {index + 1}</h2>
              <p>id: {receipt.transactionHash}</p>
              <p>Gas Used: {receipt.gasUsed}</p>
              <div>
                <h3>Logs:</h3>
                {receipt.logs.map((log, index2) => {
                  return (
                    <div key={index2}>
                      <p>Topic: {log.topicName}</p>
                      <p>Block Number: {log.blockNumber}</p>
                      <p>data: {Utils.decodeBase64(log.data)}</p>
                    </div>
                  )
                })}
              </div>
              <p>-------------------------------------------</p>
            </div>
          )
        })} */}
      </div>
    )
  }
}

export const StyleTransferToken = withStyles(styles)(Receipts)

const TransferTokenWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleTransferToken {...other} labels={t('contract:contract')} />
}

export default withTranslation()(TransferTokenWrap)
// export default withNamespaces('contract')(StyleTransferToken)
