import React from 'react'

import { withStyles, WithStyles } from '@material-ui/core/styles'

import styles from './formTitleStyle'

interface IProps extends WithStyles<typeof styles> {
  title: string
  jump: () => void
}

class FormTitle extends React.PureComponent<IProps> {
  render() {
    const { title, jump, classes } = this.props
    return (
      <div className={classes.formTitle}>
        <span onClick={jump}>DIP</span>
        <p>{title}</p>
      </div>
    )
  }
}

export default withStyles(styles)(FormTitle)
