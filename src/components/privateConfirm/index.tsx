// import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'

import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import swal from 'sweetalert2'

import styles from './styles'

interface Props extends WithStyles<typeof styles> {
  onClose: () => void
  // onConfirm: (password?: string) => void
  title: string
  label: string
  btnText: string
  prk: string
  swal: string
  note?: string
  type?: string
}

@observer
export class DialogConfirm extends React.Component<Props> {
  // @observable
  // value: string = ''

  // @action
  // handleChangePassword = (e: React.ChangeEvent<{ value: string }>) => {
  //   this.value = e.target.value
  // }

  copyAddress = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.setAttribute('value', this.props.prk)
    input.select()
    if (document.execCommand('copy')) {
      document.execCommand('copy')
      swal.fire({
        showCloseButton: false,
        type: 'success',
        timer: 1500,
        title: this.props.swal
      })
    }
    document.body.removeChild(input)
  }

  // handleConfirm = e => {
  //   e.preventDefault()
  //   this.props.onConfirm(this.value)
  // }

  render() {
    const { classes, onClose, title, label, btnText, note, prk } = this.props
    console.log(this.props)
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <form onSubmit={onClose} className={classes.form}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            {title}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <p>
              <Button onClick={this.copyAddress} className={classes.label}>
                {label}
              </Button>
            </p>
            <textarea
              className={classes.private}
              value={prk}
              // tslint:disable-next-line:jsx-no-lambda
              onChange={() => {
                return
              }}
            />
            {note && <p className={classes.note}>{note}</p>}
          </DialogContent>
          <Button variant="contained" color="primary" className={classes.button} type="submit">
            {btnText}
          </Button>
        </form>
      </Dialog>
    )
  }
}

export default withStyles(styles)(DialogConfirm)
