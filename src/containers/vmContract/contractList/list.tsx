import React from 'react'
import classNames from 'classnames'
import VmContractModel from '@/models/vmContract'
import { observer } from 'mobx-react'
import { withStyles, WithStyles, Button } from '@material-ui/core'

import { I18nCollectionContract } from '@/i18n/i18n'

import styles from './styles'

import { TRANSACTION_STATUS_SUCCESS } from '@/utils/constants'
import format from 'date-fns/format'

interface Props {
  labels: I18nCollectionContract['contract']
  contracts: VmContractModel[]
  jumpToCall: (contractAddress: string, contractTxHash: string) => void
  jumpToDetail: (contractAddress: string) => void
}

class ContractTable extends React.Component<Props> {
  render() {
    const { labels, contracts, jumpToCall, jumpToDetail } = this.props
    return (
      <React.Fragment>
        {contracts.map((contract, index) => {
          return (
            <StyleContractItem
              jumpToCall={jumpToCall}
              jumpToDetail={jumpToDetail}
              labels={labels}
              contract={contract}
              key={index}
            />
          )
        })}
      </React.Fragment>
    )
  }
}

export default ContractTable

interface ItemProps extends WithStyles {
  labels: I18nCollectionContract['contract']
  contract: VmContractModel
  jumpToCall: (contractAddress: string, contractTxHash: string) => void
  jumpToDetail: (contractAddress: string) => void
}

@observer
export class ContractItem extends React.Component<ItemProps> {
  jumpToCall = () => {
    this.props.jumpToCall(this.props.contract.contractAddress, this.props.contract.txHash)
  }
  jumpToDetail = () => {
    this.props.jumpToDetail(this.props.contract.contractAddress)
  }
  render() {
    const { contract, classes, labels } = this.props
    return (
      <div
        className={classNames(classes.row, {
          [classes.success]: contract.status === TRANSACTION_STATUS_SUCCESS
        })}
      >
        {!(contract.status === TRANSACTION_STATUS_SUCCESS) && (
          <div className={classes.item}>{labels[contract.status]}</div>
        )}
        <div className={classes.item} style={{ cursor: 'pointer' }} onClick={this.jumpToCall}>
          {contract.contractAddress}
        </div>
        <div className={classes.item}>{format(new Date(contract.timestamp), 'YY/MM/DD HH:mm')}</div>
        <div className={classes.item}>
          {/* <Button style={{ marginRight: '20px' }} variant="contained" color="primary" onClick={this.jumpToCall}>
            {labels.call}
          </Button> */}
          <Button variant="contained" color="primary" onClick={this.jumpToDetail}>
            {labels.detail}
          </Button>
        </div>
      </div>
    )
  }
}

const StyleContractItem = withStyles(styles)(ContractItem)
