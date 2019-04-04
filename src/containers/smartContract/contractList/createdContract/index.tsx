import { computed, observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import Pagination from 'rc-pagination'
import React, { Fragment } from 'react'
import { WithTranslation, withTranslation } from 'react-i18next'
import { NavLink, RouteComponentProps } from 'react-router-dom'
import { withStyles, WithStyles } from '@material-ui/core/styles'

// components
import { I18nCollectionContract } from '@/i18n/i18n'
import ContractStore from '@/stores/contract'
import WalletStore from '@/stores/wallet'
import ContractList from './contractList'

import styles from './createdContractStyle'

const PER_PAGE = 10

interface WrapProps extends RouteComponentProps {
  contract: ContractStore
  wallet: WalletStore
}

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('contract', 'wallet')
@observer
export class CreatedContract extends React.Component<Props> {
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

  handleShowTransfer = (address: string) => {
    const {
      match: { path },
      history
    } = this.props
    history.push(`${path}/transfer/${address}`)
  }

  handleShowContractTx = (address: string) => {
    const {
      match: { path },
      history
    } = this.props
    history.push(`${path}/tx/${address}`)
  }

  render() {
    const { contract, classes, labels } = this.props
    const { createdContract } = contract
    const haveContract = createdContract && createdContract.length > 0
    return (
      <Fragment>
        <NavLink to="/main/contract/create" className={haveContract ? classes.smallLink : classes.link}>
          {labels.create} {haveContract ? '' : labels.contract}
        </NavLink>
        {haveContract && (
          <div className={classes.contractsList}>
            <div className={classes.contractsListHeader}>
              <p>{labels.status}</p>
              <p>{labels.address}</p>
              <p>{labels.name}</p>
              <p>{labels.type}</p>
              <p>{labels.amount}</p>
            </div>
            <div className={classes.contractsListBody}>
              <ContractList
                contracts={createdContract.filter((_, index) => {
                  return index >= this.minIndex && index <= this.maxIndex
                })}
                handleShowTransfer={this.handleShowTransfer}
                handleShowContractTx={this.handleShowContractTx}
                labels={labels}
              />
            </div>
          </div>
        )}

        {haveContract && (
          <div className={classes.pagination}>
            <Pagination
              current={this.page}
              total={createdContract.length}
              pageSize={PER_PAGE}
              onChange={this.pageChange}
              hideOnSinglePage={true}
            />
          </div>
        )}
      </Fragment>
    )
  }
}

export const StyleCreatedContract = withStyles(styles)(CreatedContract)

const CreatedContractWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleCreatedContract {...other} labels={t('contract:contract')} />
}

export default withTranslation()(CreatedContractWrap)
