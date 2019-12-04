import { action, computed, reaction } from 'mobx'
import { inject, observer } from 'mobx-react'
// import Pagination from 'rc-pagination'
import React, { Fragment } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import {
  // NavLink,
  RouteComponentProps
  // Route,
  // Switch
} from 'react-router-dom'
import { withStyles, WithStyles } from '@material-ui/core/styles'

// components
import { I18nCollectionContract } from '@/i18n/i18n'
import VmContractStore from '@/stores/vmContract'
import WalletStore from '@/stores/wallet'

import ContractIcon from '@/images/contract.png'

import { StyleContractItem } from './list'
// import Operate from '@/containers/vmContract/operate'

import styles from './styles'

// const PER_PAGE = 10

interface WrapProps extends RouteComponentProps {
  vmContract?: VmContractStore
  wallet?: WalletStore
}

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('vmContract', 'wallet')
@observer
export class VmContractList extends React.Component<Props> {
  // @observable
  // currentContract: string = ''

  @computed
  get currentContract() {
    return this.props.vmContract!.path.split(':')[1]
  }

  constructor(props) {
    super(props)
    this.redirect()
    reaction(
      () => this.props.wallet!.activeAccountId,
      () => {
        if (window.location.pathname.split('/')[2] === 'vm_contract') {
          this.redirect()
        }
      }
    )
    const path = this.props.vmContract!.path
    if (path.split(':')[1].length > 0) {
      // this.currentContract = path.split(':')[1]
    }
  }

  redirect = () => {
    if (this.props.vmContract!.contracts.length > 0 && this.props.vmContract!.path.split(':')[1] === '') {
      const contract = this.props.vmContract!.contracts[0].contractAddress
      this.jumpToCall(contract)
    }
  }

  @action
  jumpToCall = (contractAddress: string) => {
    // const { match, history } = this.props
    // this.currentContract = contractAddress
    // history.push(`${match.url}/call/${contractAddress}`)

    // this.currentContract = contractAddress
    const account = this.props.vmContract!.currentActiveAccount
    this.props.vmContract!.setPath(account, contractAddress)
  }

  @action
  jumpToCreate = () => {
    // const { match, history } = this.props
    // history.push(`${match.url}/create`)
    // this.currentContract = ''

    // this.currentContract = ''
    const account = this.props.vmContract!.currentActiveAccount
    this.props.vmContract!.setPath(account, '')
  }

  @action
  jumpToDetail = (contractAddress: string) => {
    const { match, history } = this.props
    history.push(`${match.url}/receipts/${contractAddress}`)
    // this.currentContract = ''
    const account = this.props.vmContract!.currentActiveAccount
    this.props.vmContract!.setPath(account, contractAddress)
  }

  @computed
  get contracts() {
    const { contracts, pendingContracts } = this.props.vmContract!
    return contracts.concat(pendingContracts).sort((a, b) => a.timestamp - b.timestamp)
  }

  render() {
    const { vmContract, classes, labels } = this.props
    const { contracts, pendingContracts } = vmContract!
    const haveContract = (contracts && contracts.length > 0) || (pendingContracts && pendingContracts.length > 0)

    return (
      <Fragment>
        <div className={classes.title}>
          <span>{labels.contract}</span>
          {haveContract && <div className={classes.addCircle} onClick={this.jumpToCreate} />}
        </div>
        {!haveContract && (
          <div className={classes.noContract}>
            <img src={ContractIcon} alt="" />
            <span>{labels.nocontract}</span>
          </div>
        )}
        {haveContract && (
          <div className={classes.contractsList}>
            {/* {pendingContracts.map((contract, index) => {
              return (
                <StyleContractItem
                  labels={labels}
                  contract={contract}
                  key={index}
                  ifCurrent={false}
                />
              )
            })} */}
            {this.contracts.map((contract, index) => {
              return (
                <StyleContractItem
                  jumpToCall={this.jumpToCall}
                  jumpToDetail={this.jumpToDetail}
                  labels={labels}
                  contract={contract}
                  key={index}
                  ifCurrent={this.currentContract !== '' && this.currentContract === contract.contractAddress}
                />
              )
            })}
          </div>
        )}
      </Fragment>
    )
  }
}

export const StyleCreatedContract = withStyles(styles)(VmContractList)

const CreatedContractWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleCreatedContract {...other} labels={t('contract:contract')} />
}

export default withTranslation()(CreatedContractWrap)
