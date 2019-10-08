import { observable, action, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import swal from 'sweetalert2'

import { Button, FormControl, Input, InputLabel } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import WalletStore from '../../../stores/wallet'
import { isValidPassword } from '../../../utils'
import ProcessBar from '../progressBar'
import styles from './createStyle'
import { I18nCollectionCreate } from '@/i18n/i18n'

interface WrapProps extends RouteComponentProps<{}> {
  wallet: WalletStore
}

export interface ICreateProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionCreate['create']
}
@inject('wallet')
@observer
export class Create extends React.Component<ICreateProps> {
  @observable
  password = ''
  @observable
  repeatPassword = ''
  @observable
  buttonState: string = ''

  @action
  passwordInput = e => {
    this.password = e.target.value
  }

  @action
  repeatPasswordInput = e => {
    this.repeatPassword = e.target.value
  }

  @computed
  get passwordStrength() {
    let result = 0
    if (/[a-z]/.test(this.password)) {
      result += 1
    }
    if (/[A-Z]/.test(this.password)) {
      result += 1
    }
    if (/[0-9]/.test(this.password)) {
      result += 1
    }
    if (/[`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]/.test(this.password)) {
      result += 1
    }
    return result
  }

  verifyPassword = (
    password: string,
    repeatPassword: string,
    labels: I18nCollectionCreate['create']
  ): string | void => {
    if (!password || password.length < 8) {
      return labels.swal.passwordLength
    }
    if (!isValidPassword(password)) {
      return labels.swal.invalidPassword
    }
    if (password !== repeatPassword) {
      return labels.swal.diffPassword
    }
  }

  handleConfirm = e => {
    e.preventDefault()
    const { labels } = this.props
    const errInfo = this.verifyPassword(this.password, this.repeatPassword, labels)
    if (errInfo) {
      swal.fire({
        type: 'error',
        title: errInfo,
        confirmButtonText: labels.swal.confirm
      })
      return
    }

    this.props.wallet.create(this.password)
    this.props.history.push('/create/backup')
  }

  goBack = () => {
    this.props.history.push('/')
  }

  render() {
    const {
      labels,
      classes,
      location: { pathname }
    } = this.props
    const disable = !this.password || !this.repeatPassword || this.password !== this.repeatPassword
    return (
      <div className={classes.create}>
        <div className={classes.back} onClick={this.goBack}>
          {labels.return}
        </div>
        <ProcessBar pathname={pathname} />
        <form onSubmit={this.handleConfirm}>
          <p className={classes.title}>{labels.title}</p>
          <FormControl fullWidth={true} className={classes.item}>
            <InputLabel>{labels.setPassword}</InputLabel>
            <Input type="password" required={true} value={this.password} onChange={this.passwordInput} />
          </FormControl>
          <FormControl fullWidth={true} className={classes.item}>
            <InputLabel>{labels.repeatPassword}</InputLabel>
            <Input type="password" required={true} value={this.repeatPassword} onChange={this.repeatPasswordInput} />
          </FormControl>
          <Button disabled={disable} variant="contained" color="primary" className={classes.button} type="submit">
            {labels.confirm}
          </Button>
        </form>
      </div>
    )
  }
}

export const StyleCreate = withStyles(styles)(Create)
const CreateWrap = (props: WrapProps & WithTranslation) => {
  const { t, ...other } = props
  return <StyleCreate {...other} labels={t('create:create')} />
}

export default withTranslation()(CreateWrap)

// export default withNamespaces('create')(StyleCreate)
