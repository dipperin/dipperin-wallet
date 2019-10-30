import React from 'react'
import { RouteComponentProps } from 'react-router'

import { withStyles, WithStyles } from '@material-ui/core/styles'

import styles from './mineStyles'

export class Mine extends React.Component<RouteComponentProps<{}> & WithStyles<typeof styles>> {
  render() {
    const { classes } = this.props
    return <div className={classes.main}>11111111111111111</div>
  }
}

export default withStyles(styles)(Mine)
