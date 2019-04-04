import React from 'react'
import ContractModel from '@/models/contract'
import { withStyles, WithStyles, Tooltip } from '@material-ui/core'

import MenuButton from '@/components/menuButton'

import styles from './favoriteContractStyle'

interface Props {
  contracts: ContractModel[]
  handleShowContractTx: (address: string) => void
  handleShowTransfer: (address: string) => void
}

export class ContractTable extends React.Component<Props> {
  render() {
    const { contracts, handleShowContractTx, handleShowTransfer } = this.props
    return (
      <React.Fragment>
        {contracts.map((contract, index) => {
          return (
            <StyleContractItem
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
  contract: ContractModel
  handleShowContractTx: (address: string) => void
  handleShowTransfer: (address: string) => void
}

export class ContractItem extends React.Component<ItemProps> {
  render() {
    const { contract, classes, handleShowContractTx, handleShowTransfer } = this.props
    return (
      <div className={classes.row}>
        <div className={classes.item}>{contract.tokenName}</div>
        <div className={classes.item}>{contract.contractAddress}</div>
        <div className={classes.item}>{contract.type}</div>
        <div className={classes.item}>
          <Tooltip
            title={`${(Number(contract.balance) / Math.pow(10, contract.tokenDecimals)).toFixed(
              contract.tokenDecimals
            )} ${contract.tokenSymbol}`}
          >
            <p className={classes.overflow}>
              {(Number(contract.balance) / Math.pow(10, contract.tokenDecimals)).toFixed(contract.tokenDecimals)}
              &nbsp;
              {contract.tokenSymbol}
            </p>
          </Tooltip>
          <MenuButton
            className={classes.btn}
            address={contract.contractAddress}
            showTransfer={handleShowTransfer}
            showContractTx={handleShowContractTx}
          />
        </div>
      </div>
    )
  }
}

const StyleContractItem = withStyles(styles)(ContractItem)
