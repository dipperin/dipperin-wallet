import React from 'react'
import classNames from 'classnames'
import swal from 'sweetalert2'
import VmContractModel from '@/models/vmContract'
import { observer } from 'mobx-react'
import { withStyles, WithStyles, Button } from '@material-ui/core'
import { I18nCollectionContract } from '@/i18n/i18n'

import styles from './styles'

import { TRANSACTION_STATUS_SUCCESS } from '@/utils/constants'
import format from 'date-fns/format'
import Copy from '@/images/copy.png'

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
  copyAddress = (address: string, e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', address)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      swal.fire({
        showCloseButton: false,
        type: 'success',
        timer: 1500,
        title: this.props.labels.copySuccess
      })
    }
    document.body.removeChild(input)
  }

  render() {
    const { contract, classes, labels } = this.props
    return (
      <div
        className={classNames(classes.row, {
          [classes.success]: contract.status === TRANSACTION_STATUS_SUCCESS
        })}
      >
        <div className={classes.rowLeft}>
          {!(contract.status === TRANSACTION_STATUS_SUCCESS) && (
            <div className={classes.item}>{labels[contract.status]}</div>
          )}
          <div className={classes.address} onClick={this.jumpToCall}>
            {contract.contractAddress}
            <Button className={classes.copy} onClick={this.copyAddress.bind(this, contract.contractAddress)}>
              <img src={Copy} alt="" title="copy" />
            </Button>
          </div>
          <div className={classes.date}>{format(new Date(contract.timestamp), 'YY/MM/DD HH:mm')}</div>
        </div>
        <div className={classes.rowRight}>
          {/* <Button style={{ marginRight: '20px' }} variant="contained" color="primary" onClick={this.jumpToCall}>
            {labels.call}
          </Button> */}
          <div className={classes.detail} onClick={this.jumpToDetail} />
          {/* <Button variant="contained" color="primary" onClick={this.jumpToDetail}>
            {labels.detail}
          </Button> */}
        </div>
      </div>
    )
  }
}

const StyleContractItem = withStyles(styles)(ContractItem)
