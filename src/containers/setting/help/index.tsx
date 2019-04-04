import React from 'react'
import { RouteComponentProps } from 'react-router'
import { NavLink } from 'react-router-dom'

// images
import Next from '@/images/next.png'
import { withStyles, WithStyles } from '@material-ui/core'

// styles
import styles from './styles'

interface Props extends RouteComponentProps, WithStyles<typeof styles> {}

export class Help extends React.Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.help}>
        <div className={classes.nav}>
          <p>
            <NavLink to="/main/setting">Setting</NavLink>
          </p>
          <img src={Next} alt="next" />
          <p>Help</p>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Help)
