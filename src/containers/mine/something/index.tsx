import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  onClose: () => void
}

@observer
export class Sometings extends React.Component<Props> {
  @observable
  password: string = ''

  @action
  handleChangePassword = (e: React.ChangeEvent<{ value: string }>) => {
    this.password = e.target.value
  }

  render() {
    const { classes, onClose } = this.props
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <div className={classes.dialogMain}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            注意事项
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <p>当启动钱包挖矿功能时，钱包网络节点会切换至本地节点，等待本地节点同步至最新区块高度后即开始挖矿。</p>
          </DialogContent>
          <DialogActions className={classes.dialogBtns}>
            <Button variant="contained" className={classes.dialogBtn} color="primary" onClick={onClose}>
              Done
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  }
}

export default withStyles(styles)(Sometings)
