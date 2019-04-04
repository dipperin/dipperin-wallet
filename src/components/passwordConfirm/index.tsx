import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { I18nCollectionDialog } from '@/i18n/i18n'

import styles from './styles'

interface Props extends WithStyles<typeof styles>, WrapProps {
  onClose: () => void
  onConfirm: (password: string) => void
  labels: I18nCollectionDialog['passwordDialog']
}

@observer
export class PasswordConfirm extends React.Component<Props> {
  @observable
  password: string = ''

  @action
  handleChangePassword = (e: React.ChangeEvent<{ value: string }>) => {
    this.password = e.target.value
  }

  handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    this.props.onConfirm(this.password)
  }

  render() {
    const { classes, labels, onClose } = this.props
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <form onSubmit={this.handleConfirm}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            {labels.walletPassword}
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <TextField
              value={this.password}
              onChange={this.handleChangePassword}
              autoFocus={true}
              margin="dense"
              id="name"
              label={labels.password}
              type="password"
              fullWidth={true}
            />
          </DialogContent>
          <DialogActions className={classes.dialogBtns}>
            <Button variant="contained" className={classes.dialogBtn} onClick={onClose}>
              {labels.cancel}
            </Button>
            <Button variant="contained" className={classes.dialogBtn} type="submit" color="primary">
              {labels.confirm}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    )
  }
}

export const StylePasswordConfirm = withStyles(styles)(PasswordConfirm)

interface WrapProps {
  onClose: () => void
  onConfirm: (password: string) => void
}

const PasswordConfirmWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StylePasswordConfirm {...other} labels={t('dialog:passwordDialog')} />
}

export default withTranslation()(PasswordConfirmWrap)
