import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import swal from 'sweetalert2'

import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  onClose: () => void
  onConfirm: (password?: string) => void
  title: string
  label: string
  btnText: string
  cancelText?: string
  // prk: string
  swal: string
  note?: string
  type?: string
}

@observer
export class DialogConfirm extends React.Component<Props> {
  @observable
  value: string = ''

  @action
  handleChangePassword = (e: React.ChangeEvent<{ value: string }>) => {
    this.value = e.target.value
  }

  handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    await this.props.onConfirm(this.value)
    swal.fire({
      showCloseButton: false,
      type: 'success',
      timer: 1500,
      title: this.props.swal
    })
  }

  render() {
    const { classes, onClose, title, label, btnText, note } = this.props
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <form onSubmit={this.handleConfirm} className={classes.form}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            {title}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <p className={classes.label}>{label}</p>
            <textarea className={classes.private} value={this.value} onChange={this.handleChangePassword} />
            {note && <p className={classes.note}>{note}</p>}
          </DialogContent>
          <Button
            onClick={onClose}
            style={{ marginLeft: '24px' }}
            variant="contained"
            color="default"
            className={classes.button}
          >
            {btnText}
          </Button>
          <Button
            variant="contained"
            style={{ background: '#528DD0', float: 'right', marginRight: '24px' }}
            className={classes.button}
            type="submit"
          >
            {btnText}
          </Button>
        </form>
      </Dialog>
    )
  }
}

export default withStyles(styles)(DialogConfirm)
