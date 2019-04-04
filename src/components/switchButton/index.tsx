import React from 'react'
import Switch from '@material-ui/core/Switch'

import styles from './styles'
import { WithStyles, withStyles } from '@material-ui/core'

interface Props extends WithStyles<typeof styles> {
  handleChange: () => void
  isChecked: boolean
}

export class SwitchButton extends React.Component<Props> {
  render() {
    const { isChecked, handleChange, classes } = this.props
    return (
      <Switch
        checked={isChecked}
        onChange={handleChange}
        color="primary"
        classes={{
          switchBase: classes.switchBase,
          bar: classes.switchBar
        }}
      />
    )
  }
}
export default withStyles(styles)(SwitchButton)
