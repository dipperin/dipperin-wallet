import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import Close from '@/images/close-question.png'
// images
import Next from '@/images/next.png'
import { withStyles, WithStyles } from '@material-ui/core'

// styles
import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  title: string
}

@observer
export class QuestionWrap extends React.Component<Props> {
  @observable
  isOpen: boolean = false

  @action
  handleToggleOpen = () => {
    this.isOpen = !this.isOpen
  }

  render() {
    const { classes, title } = this.props
    return (
      <div className={classes.question}>
        <p className={classes.title} onClick={this.handleToggleOpen}>
          {title}
        </p>
        {this.isOpen && <div className={classes.content}>{this.props.children}</div>}
        <img src={this.isOpen ? Close : Next} onClick={this.handleToggleOpen} />
      </div>
    )
  }
}

export default withStyles(styles)(QuestionWrap)
