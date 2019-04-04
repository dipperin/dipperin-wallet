import Pagination from 'rc-pagination'
import React, { Fragment } from 'react'
import { observable, computed, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import { RouteComponentProps } from 'react-router'
import { WithTranslation, withTranslation } from 'react-i18next'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { Dialog, DialogContent, DialogTitle } from '@material-ui/core'

import ContractStore from '@/stores/contract'
import { I18nCollectionContract } from '@/i18n/i18n'

import ContractTxTable from './contractTxTable'

import NoRecords from '@/images/norecord.png'

import styles from './styles'

interface WrapProps extends RouteComponentProps<{ address: string }> {
  address: string
  contract: ContractStore
}

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['transferTx']
}

const PER_PAGE = 10

@inject('contract')
@observer
export class ContractTx extends React.Component<Props> {
  @observable
  page: number = 1

  componentDidMount() {
    const {
      contract,
      match: {
        params: { address }
      }
    } = this.props
    contract.getContractTx(address)
  }

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

  onClose = () => {
    const {
      history: {
        location: { pathname }
      },
      history
    } = this.props
    history.push(pathname.split('/tx')[0])
  }

  render() {
    const {
      match: {
        params: { address }
      },
      contract: { contract, contractTx },
      classes,
      labels
    } = this.props
    const currentContract = contract.get(address)
    const decimal = currentContract ? currentContract.tokenDecimals : 0
    return (
      <Fragment>
        <Dialog open={true} onClose={this.onClose} aria-labelledby="form-dialog-title" maxWidth={false}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            {labels.title}
          </DialogTitle>

          <DialogContent className={classes.dialogContent}>
            <div className={classes.transactionsList}>
              {contractTx.length !== 0 && (
                <div className={classes.transactionsListHeader}>
                  <p className={classes.itemType}>{labels.type}</p>
                  <p className={classes.itemTime}>{labels.time}</p>
                  <p className={classes.itemFrom}>{labels.from}</p>
                  <p className={classes.itemAddress}>{labels.to}</p>
                  <p className={classes.itemAmount}>{labels.amount}</p>
                  <p className={classes.itemStatu}>{labels.status}</p>
                </div>
              )}
              <div className={classes.transactionsListBody}>
                {contractTx && (
                  <ContractTxTable
                    labels={labels}
                    contractTx={contractTx.slice().filter((_, index) => {
                      return index >= this.minIndex && index <= this.maxIndex
                    })}
                    decimal={decimal}
                  />
                )}
              </div>
              {contractTx.length === 0 && (
                <div className={classes.noRecords}>
                  <img src={NoRecords} alt="no records" draggable={false} />
                  <p>{labels.noRecords}</p>
                </div>
              )}

              {contractTx && (
                <div className={classes.pagination}>
                  <Pagination
                    current={this.page}
                    total={contractTx.length}
                    pageSize={PER_PAGE}
                    onChange={this.pageChange}
                    hideOnSinglePage={true}
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </Fragment>
    )
  }
}

export const StyleContractTx = withStyles(styles)(ContractTx)

const ContractTxWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleContractTx {...other} labels={t('contract:transferTx')} />
}

export default withTranslation()(ContractTxWrap)
