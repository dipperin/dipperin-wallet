import React from 'react'
import classNames from 'classnames'
import swal from 'sweetalert2'
import VmContractModel from '@/models/vmContract'
import { observer } from 'mobx-react'
import { withStyles, WithStyles, Button } from '@material-ui/core'
import { I18nCollectionContract } from '@/i18n/i18n'
import DropButtons from '@/components/dropButtons'

import styles from './styles'

import { TRANSACTION_STATUS_SUCCESS } from '@/utils/constants'
import format from 'date-fns/format'
// import Copy from '@/images/copy.png'
import Edit from '@/images/edit.png'

interface ItemProps extends WithStyles {
  labels: I18nCollectionContract['contract']
  contract: VmContractModel
  ifCurrent?: boolean
  jumpToCall: (contractAddress: string, contractTxHash: string) => void
  jumpToDetail: (contractAddress: string) => void
  showChangeNamePop: (contract: VmContractModel) => void
  deleteContract: (address: string) => void
}

@observer
export class ContractItem extends React.Component<ItemProps> {
  jumpToCall = () => {
    if (this.props.contract.contractAddress) {
      this.props.jumpToCall(this.props.contract.contractAddress, this.props.contract.txHash)
    }
  }

  jumpToDetail = () => {
    if (this.props.contract.contractAddress) {
      this.props.jumpToDetail(this.props.contract.contractAddress)
    }
  }

  copyAddress = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    const address = this.props.contract.contractAddress
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', address)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      swal.fire({
        showCloseButton: false,
        icon: 'success',
        timer: 1500,
        title: this.props.labels.copySuccess
      })
    }
    document.body.removeChild(input)
  }
  openChangeNamePop = () => {
    const { showChangeNamePop, contract } = this.props
    showChangeNamePop(contract)
  }
  removeContract = () => {
    const {
      deleteContract,
      contract: { contractAddress }
    } = this.props
    deleteContract(contractAddress)
  }

  render() {
    const { contract, classes, labels } = this.props
    const btnArr = [
      {
        label: labels.ViewHistory,
        handleFunc: this.jumpToDetail
      },
      {
        label: labels.deleteContract,
        handleFunc: this.removeContract
      }
    ]
    return (
      <div
        className={classNames(classes.row, {
          [classes.success]: contract.status === TRANSACTION_STATUS_SUCCESS,
          [classes.current]: this.props.ifCurrent
        })}
      >
        <div className={classes.rowLeft}>
          {/* TODO: if no jumpToCall cursor is default */}
          <div className={classes.address} onClick={this.jumpToCall}>
            {!(contract.status === TRANSACTION_STATUS_SUCCESS) && <span>{labels[contract.status]}</span>}
            {contract.contractName ? contract.contractName : contract.contractAddress}
            {contract.status === TRANSACTION_STATUS_SUCCESS && (
              <Button className={classes.copy} onClick={this.openChangeNamePop}>
                <img src={Edit} alt="" title="edit" />
              </Button>
              // <Button className={classes.copy} onClick={this.copyAddress.bind(this, contract.contractAddress)}>
              //   <img src={Copy} alt="" title="copy" />
              // </Button>
            )}
          </div>
          <div className={classes.date}>{format(new Date(contract.timestamp), 'YYYY/MM/DD HH:mm')}</div>
        </div>

        <div className={classes.rowRight}>
          {/* TODO: if no jumpToDetail cursor is default */}
          {/* <div className={classes.detail} onClick={this.jumpToDetail} /> */}
          <DropButtons btnArray={btnArr} />
        </div>
      </div>
    )
  }
}

export const StyleContractItem = withStyles(styles)(ContractItem)
