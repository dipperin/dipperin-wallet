import { computed, observable, action } from 'mobx'
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

import ContractList from './list'
// import Operate from '@/containers/vmContract/operate'

import styles from './styles'

const PER_PAGE = 10

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
  @observable
  page: number = 1

  @computed
  get minIndex() {
    return (this.page - 1) * PER_PAGE
  }

  @computed
  get maxIndex() {
    return this.page * PER_PAGE - 1
  }

  @action
  pageChange = value => {
    this.page = value
  }

  jumpToCall = (contractAddress: string, contractTxHash: string) => {
    const { vmContract, match, history } = this.props
    if (vmContract!.contract.has(contractAddress)) {
      history.push(`${match.url}/call/${contractAddress}`)
    } else {
      history.push(`${match.url}/call/${contractTxHash}`)
    }
  }

  jumpToCreate = () => {
    const { match, history } = this.props
    history.push(`${match.url}/create`)
  }

  jumpToDetail = (contractAddress: string) => {
    const { match, history } = this.props
    console.log(`${match.url}/receipts/${contractAddress}`)
    history.push(`${match.url}/receipts/${contractAddress}`)
  }

  render() {
    const { vmContract, classes, labels } = this.props
    const { contracts } = vmContract!
    const haveContract = contracts && contracts.length > 0
    // const basePath = match.url
    return (
      <div className={classes.root}>
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
              <ContractList
                contracts={contracts}
                labels={labels}
                jumpToCall={this.jumpToCall}
                jumpToDetail={this.jumpToDetail}
              />
            </div>
          )}
        </Fragment>
      </div>
    )
  }
}

export const StyleCreatedContract = withStyles(styles)(VmContractList)

const CreatedContractWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleCreatedContract {...other} labels={t('contract:contract')} />
}

export default withTranslation()(CreatedContractWrap)
