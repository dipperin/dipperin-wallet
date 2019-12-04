import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'

import { Button } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import WalletStore from '../../../stores/wallet'
import ProcessBar from '../progressBar'
import styles from './backupStyle'
import { I18nCollectionCreate } from '@/i18n/i18n'

interface WrapProps extends RouteComponentProps<{}> {
  wallet: WalletStore
}

interface IBackupProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionCreate['backup']
}

@inject('wallet')
@observer
export class Backup extends React.Component<IBackupProps> {
  componentDidMount() {
    if (!this.props.wallet.mnemonic) {
      this.props.history.push('/')
    }
  }

  handleNext = () => {
    this.props.history.replace('/create/backup_confirm')
  }

  goBack = () => {
    this.props.history.push('/create')
  }

  render() {
    const {
      labels,
      wallet,
      classes,
      location: { pathname }
    } = this.props
    return (
      <div className={classes.backup}>
        <div className={classes.top}>
          <div className={classes.back} onClick={this.goBack}>
            {labels.return}
          </div>
          <ProcessBar pathname={pathname} turnFunc={[true, this.goBack, false, () => null]} />
          <p className={classes.title}>{labels.title}</p>
          <p className={classes.hint}>{labels.hint}</p>
        </div>
        <p className={classes.mnemonic}>{wallet.mnemonic}</p>
        <div className={classes.bottom}>
          <p className={classes.hintBot}>{labels.bottomHint}</p>
          <Button variant="contained" color="primary" className={classes.button} onClick={this.handleNext}>
            {labels.confirm}
          </Button>
        </div>
      </div>
    )
  }
}

export const StyleBackup = withStyles(styles)(Backup)

const BackupWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleBackup {...other} labels={t('create:backup')} />
}

export default withTranslation()(BackupWrap)

// export default withNamespaces('backup')(StyleBackup)
