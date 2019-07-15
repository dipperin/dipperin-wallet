import React, { Fragment } from 'react'
import { RouteComponentProps } from 'react-router'
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

export class VmContractHome extends React.Component<RouteComponentProps & WithStyles<typeof styles>> {
  render() {
    const { classes, match, history, location } = this.props
    const basePath = match.url
    return (
      <Fragment>
        {/* <div className={classes.container}>
          <Switch>
            <Redirect from={`${basePath}`} exact={true} strict={true} to={`${basePath}/list`} />
            <Route path={`${basePath}/list`} component={ContractList} />
            <Route path={`${basePath}/create`} component={CreateContract} />
          </Switch>
        </div> */}
        <div className={classes.left}>
          <ContractList history={history} location={location} match={match} />
        </div>
        <div className={classes.right}>
          <Switch>
            {/* <Redirect from={`${basePath}`} exact={true} strict={true} to={`${basePath}/create`} /> */}
            <Route path={`${basePath}/call/:address`} component={Call} />
            <Route path={`${basePath}/create`} component={CreateContract} />
          </Switch>
          {/* <CreateContract history={history} location={location} match={match} /> */}
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
