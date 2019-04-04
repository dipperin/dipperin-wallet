import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Backup from './backup'
import BackupConfirm from './backupConfirm'
import Create from './create'

export class CreateLayout extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/create" exact={true} component={Create} />
        <Route path="/create/backup" exact={true} component={Backup} />
        <Route path="/create/backup_confirm" exact={true} component={BackupConfirm} />
      </Switch>
    )
  }
}

export default CreateLayout
