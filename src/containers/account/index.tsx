import { observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Route, Switch } from 'react-router-dom'

import { withStyles, WithStyles } from '@material-ui/core/styles'

import styles from './accountStyle'
import TranSactionDetail from './transactionDetail'
import TranSactionList from './transactionList'
import Transfer from './transfer'

@observer
export class Account extends React.Component<RouteComponentProps<{}> & WithStyles<typeof styles>> {
  render() {
    const { classes, location, history } = this.props
    const isSend = location.state ? location.state.isSend : true
    return (
      <div>
        <div className={classes.left} data-tour="tx">
          <Switch location={location}>
            <Route path="/main/wallet" exact={true} component={TranSactionList} />
            <Route path="/main/wallet/:id" component={TranSactionDetail} />
          </Switch>
        </div>
        <div className={classes.right}>
          <Transfer isSend={isSend} history={history} location={location} />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Account)
