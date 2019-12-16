import React from 'react'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { ClickAwayListener } from '@material-ui/core'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import styles from './styles'
interface BtnConfig {
  label: string
  handleFunc: () => void
}

interface Props extends WithStyles<typeof styles> {
  btnArray: BtnConfig[]
}
@observer
class DropButtons extends React.Component<Props> {
  @observable isShowDrop: boolean = false
  @action hideDrop = () => {
    this.isShowDrop = false
  }
  @action showDrop = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.isShowDrop = true
  }

  handleClickAway = (e: React.MouseEvent) => {
    e.preventDefault()
    this.hideDrop()
  }
  wrapHandle = (func: () => void) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    this.hideDrop()
    func()
  }

  render() {
    console.log(this.props)
    const { classes, btnArray } = this.props

    return (
      <div className={classes.wrap}>
        <div className={classes.more} onClick={this.showDrop} />
        <ClickAwayListener onClickAway={this.handleClickAway}>
          {this.isShowDrop ? (
            <div className={classes.btnBox}>
              {btnArray.map(item => {
                return (
                  <div onClick={this.wrapHandle(item.handleFunc)} key={item.label} className={classes.item}>
                    {item.label}
                  </div>
                )
              })}
            </div>
          ) : (
            <div />
          )}
        </ClickAwayListener>
      </div>
    )
  }
}

export default withStyles(styles)(DropButtons)
