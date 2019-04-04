import React from 'react'
import { Route, RouteComponentProps, Switch } from 'react-router'

import Help from './help'
import Settings from './settings'

export class Setting extends React.Component<RouteComponentProps> {
  render() {
    const {
      match: { path }
    } = this.props
    return (
      <Switch>
        <Route path={path} exact={true} component={Settings} />
        <Route path={`${path}/help`} component={Help} />
      </Switch>
    )
  }
}

export default Setting
