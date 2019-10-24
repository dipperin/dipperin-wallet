import React, { Fragment } from 'react'
import { RouteComponentProps } from 'react-router'
import { observer, inject } from 'mobx-react'
import {
  // Redirect,
  Route,
  Switch
} from 'react-router-dom'

import { withStyles, WithStyles } from '@material-ui/core/styles'

import ContractList from './contractList'
import CreateContract from './createContract'
import styles from './vmContractStyle'
import Call from './call'
import Receipts from './receipts'
import { computed, reaction } from 'mobx'

import VmContractStore from '@/stores/vmContract'
import AccountStore from '@/stores/account'
import WalletStore from '@/stores/wallet'

interface Props {
  vmContract: VmContractStore
  account: AccountStore
  wallet: WalletStore
}

@inject('vmContract', 'account', 'wallet')
@observer
export class VmContractHome extends React.Component<RouteComponentProps & Props & WithStyles<typeof styles>> {
  constructor(props) {
    super(props)
    reaction(
      () => this.props.wallet!.activeAccountId,
      () => {
        if (this.props.vmContract.path.split(':')[0] !== this.props.account.activeAccount.address) {
          let dist = ''
          if (this.props.vmContract.contracts.length > 0) {
            dist = this.props.vmContract.contracts[0].contractAddress
          }
          this.props.vmContract.setPath(this.props.account.activeAccount.address, dist)
        }
      }
    )
  }

  @computed
  get renderLeft() {
    const [address, dist] = this.props.vmContract.path.split(':')
    const activeAccount = this.props.account.activeAccount.address
    if (address === activeAccount) {
      if (dist !== '' && this.props.vmContract.contract.has(dist)) {
        return (
          <Call
            history={this.props.history}
            match={this.props.match}
            location={this.props.location}
            vmContract={this.props.vmContract}
            wallet={this.props.wallet}
          />
        )
      }
    }

    return <CreateContract history={this.props.history} match={this.props.match} location={this.props.location} />
  }

  render() {
    const { classes, match, history, location } = this.props
    // const basePath = match.url
    return (
      <Fragment>
        <div className={classes.left}>
          <ContractList history={history} location={location} match={match} />
        </div>
        <div className={classes.right}>
          {this.renderLeft}
          {/* <Switch>
            <Route path={`${basePath}/call/:address`} component={Call} />
            <Route path={`${basePath}/create`} component={CreateContract} />
          </Switch> */}
        </div>
      </Fragment>
    )
  }
}

export const WithStylesVmContractHome = withStyles(styles)(VmContractHome)

export class VmContract extends React.Component<RouteComponentProps & WithStyles<typeof styles>> {
  render() {
    const { classes, match } = this.props
    const basePath = match.url
    return (
      <div className={classes.vmContract}>
        <Switch>
          <Route path={`${basePath}/receipts/:address`} component={Receipts} />
          <Route path={`${basePath}`} component={WithStylesVmContractHome} />
        </Switch>
      </div>
    )
  }
}

export default withStyles(styles)(VmContract)
