import Pagination from 'rc-pagination'
import React, { Fragment } from 'react'
import { observable, computed, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { withTranslation, WithTranslation } from 'react-i18next'
import swal from 'sweetalert2'

import ContractStore from '@/stores/contract'

// components
import DialogConfirm from '@/components/dialogConfirm'
import ContractList from './contractList'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './favoriteContractStyle'

const PER_PAGE = 10

interface WrapProps extends RouteComponentProps<{}> {
  contract: ContractStore
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('contract', 'wallet')
@observer
export class FavoriteContract extends React.Component<IProps> {
  @observable
  page: number = 1
  @observable
  showAdd: boolean = false

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

  handleTransfer = (address: string) => {
    this.props.history.push(`/main/contract/transfer/${address}`)
  }

  /**
   * add contract
   */
  @action
  handleShowAdd = () => {
    this.showAdd = true
  }

  @action
  handleCloseAddDialog = () => {
    this.showAdd = false
  }

  handleConfirmAdd = async address => {
    const { labels } = this.props
    const res = await this.props.contract.addContract(address)
    if (res) {
      await swal.fire({
        text: labels.addDialog.addSuccess,
        type: 'success',
        confirmButtonText: labels.addDialog.swalConfirm,
        timer: 1000
      })
    } else {
      await swal.fire({
        text: labels.addDialog.addFailed,
        type: 'error',
        confirmButtonText: labels.addDialog.swalConfirm
      })
    }
    this.handleCloseAddDialog()
  }

  handleShowTransfer = address => {
    const {
      match: { path },
      history
    } = this.props
    history.push(`${path}/transfer/${address}`)
  }

  handleShowContractTx = address => {
    const {
      match: { path },
      history
    } = this.props
    history.push(`${path}/tx/${address}`)
  }

  render() {
    const { contract, classes, labels } = this.props
    const { favoriteContract } = contract
    const haveContract = favoriteContract && favoriteContract.length > 0
    return (
      <Fragment>
        <div className={haveContract ? classes.smallLink : classes.link} onClick={this.handleShowAdd}>
          {labels.add} {haveContract ? '' : labels.favoriteContract}
        </div>
        {haveContract && (
          <div className={classes.contractsList}>
            <div className={classes.contractsListHeader}>
              <p>{labels.name}</p>
              <p>{labels.address}</p>
              <p>{labels.type}</p>
              <p>{labels.balance}</p>
            </div>
            <div className={classes.contractsListBody}>
              <ContractList
                contracts={favoriteContract.filter((_, index) => {
                  return index >= this.minIndex && index <= this.maxIndex
                })}
                handleShowTransfer={this.handleShowTransfer}
                handleShowContractTx={this.handleShowContractTx}
              />
            </div>
          </div>
        )}

        {haveContract && (
          <div className={classes.pagination}>
            <Pagination
              current={this.page}
              total={favoriteContract.length}
              pageSize={PER_PAGE}
              onChange={this.pageChange}
              hideOnSinglePage={true}
            />
          </div>
        )}
        {this.showAdd && (
          <DialogConfirm
            onClose={this.handleCloseAddDialog}
            onConfirm={this.handleConfirmAdd}
            title={labels.addDialog.title}
            label={labels.addDialog.label}
            btnText={labels.addDialog.btnText}
          />
        )}
      </Fragment>
    )
  }
}

export const StyleFavoriteContract = withStyles(styles)(FavoriteContract)

const FavoriteContractWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleFavoriteContract {...other} labels={t('contract:contract')} />
}

export default withTranslation()(FavoriteContractWrap)

// export default withNamespaces('contract')(withStyles(styles)(FavoriteContract))
