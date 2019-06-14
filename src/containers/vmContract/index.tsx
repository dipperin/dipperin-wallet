import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Redirect, Route, Switch } from 'react-router-dom'

import { withStyles, WithStyles } from '@material-ui/core/styles'

import ContractList from './contractList'
import CreateContract from './createContract'
import styles from './vmContractStyle'

export class VmContract extends React.Component<RouteComponentProps & WithStyles<typeof styles>> {
  render() {
    const { classes, match } = this.props
    const basePath = match.url
    return (
      <div className={classes.vmContract}>
        <div className={classes.container}>
          <Switch>
            <Redirect from={`${basePath}`} exact={true} strict={true} to={`${basePath}/list`} />
            <Route path={`${basePath}/list`} component={ContractList} />
            <Route path={`${basePath}/create`} component={CreateContract} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(VmContract)
