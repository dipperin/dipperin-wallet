import React from 'react'
import classNames from 'classnames'
import ContractModel from '@/models/contract'
import { observer } from 'mobx-react'
import { withStyles, WithStyles, Tooltip } from '@material-ui/core'

import MenuButton from '@/components/menuButton'
import { I18nCollectionContract } from '@/i18n/i18n'

import styles from './createdContractStyle'

import { TRANSACTION_STATUS_SUCCESS } from '@/utils/constants'

interface Props {
  labels: I18nCollectionContract['contract']
  contracts: ContractModel[]
  handleShowContractTx: (address: string) => void
  handleShowTransfer: (address: string) => void
}

class ContractTable extends React.Component<Props> {
  render() {
    const { labels, contracts, handleShowContractTx, handleShowTransfer } = this.props
    return (
      <React.Fragment>
        {contracts.map((contract, index) => {
          return (
            <StyleContractItem
              labels={labels}
              contract={contract}
              key={index}
              handleShowContractTx={handleShowContractTx}
              handleShowTransfer={handleShowTransfer}
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
  contract: ContractModel
  handleShowContractTx: (address: string) => void
  handleShowTransfer: (address: string) => void
}

@observer
export class ContractItem extends React.Component<ItemProps> {
  render() {
    const { contract, classes, handleShowContractTx, handleShowTransfer, labels } = this.props
    return (
      <div
        className={classNames(classes.row, {
          [classes.success]: contract.status === TRANSACTION_STATUS_SUCCESS
        })}
      >
        <div className={classes.item}>{labels[contract.status]}</div>
        <div className={classes.item}>{contract.contractAddress}</div>
        <div className={classes.item}>{contract.tokenName}</div>
        <div className={classes.item}>{contract.type}</div>
        <div className={classNames(classes.item)}>
          <Tooltip
            title={`${(Number(contract.tokenTotalSupply) / Math.pow(10, contract.tokenDecimals)).toFixed(
              contract.tokenDecimals
            )} ${contract.tokenSymbol}`}
          >
            <p className={classes.overflow}>
              {(Number(contract.tokenTotalSupply) / Math.pow(10, contract.tokenDecimals)).toFixed(
                contract.tokenDecimals
              )}
              &nbsp;
              {contract.tokenSymbol}
            </p>
          </Tooltip>
          {contract.status === TRANSACTION_STATUS_SUCCESS && (
            <MenuButton
              className={classes.btn}
              address={contract.contractAddress}
              showTransfer={handleShowTransfer}
              showContractTx={handleShowContractTx}
            />
          )}
        </div>
      </div>
    )
  }
}

const StyleContractItem = withStyles(styles)(ContractItem)
