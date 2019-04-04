import React from 'react'
import { observable, action } from 'mobx'
import classNames from 'classnames'
import { observer, inject } from 'mobx-react'
import { Button } from '@material-ui/core'
import { RouteComponentProps } from 'react-router'
import { withTranslation, WithTranslation } from 'react-i18next'
import { Switch, Redirect, Route } from 'react-router-dom'
import { withStyles, WithStyles } from '@material-ui/core/styles'

// store
import ContractStore from '@/stores/contract'
import WalletStore from '@/stores/wallet'

// components
import CreatedContract from './createdContract'
import FavoriteContract from './favoriteContract'
import TransferConfirm from '../operate'
import ContractTx from './contractTx'

import { I18nCollectionContract } from '@/i18n/i18n'
import styles from './contractListStyle'

interface WrapProps extends RouteComponentProps<{}> {
  contract: ContractStore
  wallet: WalletStore
}

interface Props extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionContract['contract']
}

@inject('contract', 'wallet')
@observer
export class ContractList extends React.Component<Props> {
  @observable
  showTransfer: boolean = false
  @observable
  showContractTx: boolean = false
  @observable
  currentAddress: string = ''

  @action
  jumpToCreated = () => {
    const basePath = this.props.match.path
    this.props.history.push(`${basePath}/created`)
  }

  @action
  jumpToFavorite = () => {
    const basePath = this.props.match.path
    this.props.history.push(`${basePath}/favorite`)
  }

  /**
   * transfer
   */
  @action
  handleShowTransfer = address => {
    this.currentAddress = address
    this.showTransfer = true
  }

  @action
  handleCloseTransfer = () => {
    this.showTransfer = false
  }

  /**
   * constract transaction
   */
  @action
  handleShowContractTx = address => {
    this.currentAddress = address
    this.showContractTx = true
  }

  @action
  handleCloseContractTx = () => {
    this.showContractTx = false
  }

  render() {
    const { classes, match, labels, location } = this.props
    const basePath = match.path
    const isCreated = location.pathname.match(`${basePath}/created`)
    return (
      <div className={classes.root}>
        <div className={classes.tab}>
          <div className={classes.tabLeft} data-tour="created-btn">
            <Button
              onClick={this.jumpToCreated}
              variant="contained"
              className={classNames(classes.button, { [classes.active]: isCreated })}
            >
              {labels.created}
            </Button>
          </div>
          <div className={classes.tabRight} data-tour="receive-btn">
            <Button
              onClick={this.jumpToFavorite}
              variant="contained"
              className={classNames(classes.button, { [classes.active]: !isCreated })}
            >
              {labels.favorite}
            </Button>
          </div>
        </div>
        <Switch>
          <Redirect from={basePath} exact={true} strict={true} to={`${basePath}/created`} />
          <Route path={`${basePath}/created`} component={CreatedContract} />
          <Route path={`${basePath}/favorite`} component={FavoriteContract} />
        </Switch>
        <Switch>
          <Route path={`${basePath}/*/tx/:address`} component={ContractTx} />
          <Route path={`${basePath}/*/:operate/:address`} component={TransferConfirm} />
        </Switch>
        {/* {this.showTransfer && (
          <TransferConfirm
            address={this.currentAddress}
            onClose={this.handleCloseTransfer}
            contract={contract}
            wallet={wallet}
          />
        )}
        {this.showContractTx && (
          <ContractTx address={this.currentAddress} onClose={this.handleCloseContractTx} contract={contract} />
        )} */}
      </div>
    )
  }
}

export const StyleContractList = withStyles(styles)(ContractList)

const ContractListWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleContractList {...other} labels={t('contract:contract')} />
}

export default withTranslation()(ContractListWrap)

// export default withStyles(styles)(withNamespaces('contract')(ContractList))
