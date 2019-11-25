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
// import { helper } from '@dipperin/dipperin.js'

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

  // getLogs = () => {
  //   console.log('getLogs ...............')
  //   this.props.vmContract.getLogs(
  //     '',
  //     14613,
  //     14620,
  //     ['0x001487e42fbc7234714213a4dd3947cd1378cd28fa8c'],
  //     [[helper.Hash.keccak256('Transfer')]]
  //   )
  // }

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
    for (const r of vmContract.receipts.values()) {
      console.log(r)
    }
    console.log(address)

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
          </div>
          <div className={classes.contractsListBody}>
            <ContractList receipts={receipts} labels={labels} />
          </div>
        </div>
        {/* <button onClick={this.getLogs}>test</button> */}
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
