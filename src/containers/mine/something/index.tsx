import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'

import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'
import { I18nCollectionMine } from '@/i18n/i18n'

import styles from './styles'

interface WrapProps {
  onClose: () => void
}

interface IProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionMine['tips']
}
@observer
export class Sometings extends React.Component<IProps> {
  @observable
  password: string = ''

  @action
  handleChangePassword = (e: React.ChangeEvent<{ value: string }>) => {
    this.password = e.target.value
  }

  render() {
    const { classes, onClose, labels } = this.props
    return (
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <div className={classes.dialogMain}>
          <DialogTitle className={classes.dialogTitle} id="form-dialog-title">
            <span style={{ fontSize: '16px' }}>{labels.title}</span>
          </DialogTitle>
          <DialogContent className={classes.dialogContent}>
            <p>{labels.tipContent}</p>
          </DialogContent>
          <DialogActions className={classes.dialogBtns}>
            <Button variant="contained" className={classes.dialogBtn} color="primary" onClick={onClose}>
              {labels.done}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    )
  }
}

const SomethingWithStyle = withStyles(styles)(Sometings)

const SomethingWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <SomethingWithStyle {...other} labels={t('mine:tips')} />
}

export default withTranslation()(SomethingWrap)
