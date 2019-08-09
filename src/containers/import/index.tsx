import BIP39 from 'bip39'
import i18next from 'i18next'
import classNames from 'classnames'
import { observable, reaction, action, runInAction } from 'mobx'
import { inject, observer } from 'mobx-react'
import React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next'
import { RouteComponentProps } from 'react-router'
import Tour from 'reactour'
import swal from 'sweetalert2'

import AccountStore from '@/stores/account'
import LoadingStore from '@/stores/loading'
import WalletStore from '@/stores/wallet'
import { isValidPassword } from '@/utils'
import settings from '@/utils/settings'
import { Button, Fab, FormControl, Input, InputLabel } from '@material-ui/core'
import { withStyles, WithStyles } from '@material-ui/core/styles'

import Add from '../../images/add-icon.png'
import styles from './importStyle'
import { I18nCollectionWallet } from '@/i18n/i18n'

interface WrapProps extends RouteComponentProps<{}> {
  wallet: WalletStore
  loading: LoadingStore
  account: AccountStore
}

interface IImportProps extends WithStyles<typeof styles>, WrapProps {
  labels: I18nCollectionWallet['import']
  language: string
  changeLanguage: (lng: string, callback?: i18next.Callback | undefined) => void
}

@inject('wallet', 'loading', 'account')
@observer
export class Import extends React.Component<IImportProps> {
  @observable
  password = ''
  @observable
  repeatPassword = ''
  @observable
  mnemonic = ''
  @observable
  showTour: boolean = false

  @action
  componentDidMount() {
    if (this.props.wallet.isHaveWallet) {
      if (this.props.wallet.isUnlock) {
        this.props.history.push('/main/wallet')
      } else {
        this.props.history.push('/login')
      }
    }
    reaction(
      () => this.props.wallet.isHaveWallet,
      async () => {
        const { labels } = this.props
        if (this.props.wallet.isHaveWallet) {
          if (this.props.wallet.isUnlock) {
            await swal.fire({
              type: 'success',
              title: labels.swal.success,
              confirmButtonText: labels.swal.confirm,
              timer: 1000
            })
            this.props.history.push('/main/wallet')
          } else {
            this.props.history.push('/login')
          }
        }
      }
    )

    this.showGuide()

    reaction(
      () => this.props.loading.downloading,
      () => {
        this.showGuide()
      }
    )
  }

  @action
  passwordInput = e => {
    this.password = e.target.value
  }

  @action
  repeatPasswordInput = e => {
    this.repeatPassword = e.target.value
  }

  @action
  mnemonicInput = e => {
    this.mnemonic = e.target.value
  }

  @action
  showGuide = async () => {
    if (!this.props.loading.downloading) {
      if (!settings.get('showImportGuide')) {
        this.showTour = true
      }
    } else {
      this.showTour = false
    }
  }

  verifyInputs = (
    mnemonic: string,
    password: string,
    repeatPassword: string,
    labels: I18nCollectionWallet['import']
  ): string | void => {
    if (mnemonic.trim().split(' ').length < 12) {
      return labels.swal.mnemonicLength
    }
    if (!BIP39.validateMnemonic(mnemonic)) {
      return labels.swal.invalidMnemonic
    }
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

  handleConfirm = async e => {
    e.preventDefault()
    const { labels } = this.props
    const errInfo = this.verifyInputs(this.mnemonic, this.password, this.repeatPassword, labels)
    if (errInfo) {
      swal.fire({
        type: 'error',
        title: errInfo,
        confirmButtonText: labels.swal.confirm
      })
      return
    }
    const { wallet } = this.props
    const err = await wallet.create(this.password, this.mnemonic)

    // this.props.account.changeActiveAccount("1")
    if (err) {
      swal.fire({
        type: 'error',
        title: err.message
      })
      return
    }
    runInAction(() => {
      this.mnemonic = ''
    })
    wallet.save()

    for (let i = 0; i < 14; i++) {
      await this.props.account.addAccount()
    }
    this.props.account.changeActiveAccount('1')
    for (const act of this.props.account.accounts) {
      if (act.balance && Number(act.balance) > 0) {
        this.props.account.changeActiveAccount(String(act.id))
        break
      }
    }
    for (let i = 15; i > 1; i--) {
      if (
        this.props.account.accountMap.get(String(i)) &&
        this.props.account.accountMap.get(String(i))!.balance === '0'
      ) {
        await this.props.account.removeAccountAsync(String(i))
      } else {
        break
      }
    }
    // this.props.account.addAccount()
    this.props.account.showDbAccounts()
    // next operate in reaction
  }

  ToCreate = () => {
    this.props.history.push('/create')
  }

  @action
  closeTour = () => {
    this.showTour = false
    settings.set('showImportGuide', true)
  }
  // change language
  handleChangeLang = () => {
    const lang = this.props.language
    this.props.changeLanguage(lang === 'zh-CN' ? 'en-US' : 'zh-CN')
  }

  render() {
    const { labels, classes } = this.props
    const disable = !this.mnemonic || !this.password || !this.repeatPassword || this.password !== this.repeatPassword
    const isChinese = this.props.language === 'zh-CN'
    const steps = [
      {
        selector: `[data-tour='second']`,
        content: labels.tour.create,
        style: tourStyles
      },
      {
        selector: `[data-tour='first']`,
        content: labels.tour.import,
        style: tourStyles
      }
    ]
    return (
      <div className={classes.import}>
        <div className={classes.globalWrap}>
          <Fab className={classes.global} onClick={this.handleChangeLang}>
            <span>{labels.langAb}</span>
          </Fab>
          <p>{labels.lang}</p>
        </div>
        <form className={classes.form} onSubmit={this.handleConfirm}>
          <p className={classes.title}>{labels.title}</p>
          <div data-tour={'first'}>
            <FormControl fullWidth={true} className={classes.item}>
              <InputLabel>{labels.mnemonic}</InputLabel>
              <Input value={this.mnemonic} onChange={this.mnemonicInput} />
            </FormControl>
            <FormControl fullWidth={true} className={classes.item}>
              <InputLabel>{labels.setPassword}</InputLabel>
              <Input type="password" value={this.password} onChange={this.passwordInput} />
            </FormControl>
            <FormControl fullWidth={true} className={classes.item}>
              <InputLabel>{labels.repeatPassword}</InputLabel>
              <Input type="password" value={this.repeatPassword} onChange={this.repeatPasswordInput} />
            </FormControl>
            <Button disabled={disable} variant="contained" color="primary" className={classes.button} type="submit">
              {labels.recovery}
            </Button>
          </div>
        </form>
        <div className={classes.create}>
          <Button className={classes.addBtn} onClick={this.ToCreate}>
            <img src={Add} alt="" data-tour={'second'} />
          </Button>
          <p className={classNames({ ['cn']: isChinese })}>{labels.create}</p>
          {/* <p className={classNames({ ['cn']: isChinese })}>{labels.howToCreate}</p> */}
        </div>
        <Tour
          steps={steps}
          isOpen={this.showTour}
          onRequestClose={this.closeTour}
          closeWithMask={false}
          disableInteraction={true}
          lastStepNextButton={'ok'}
        />
      </div>
    )
  }
}

export const StyleImport = withStyles(styles)(Import)
const ImportWrap = (props: WrapProps & WithTranslation) => {
  const { t, i18n, ...other } = props
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }
  return <StyleImport {...other} labels={t('wallet:import')} language={i18n.language} changeLanguage={changeLanguage} />
}

export default withTranslation()(ImportWrap)

// export default withStyles(styles)(withNamespaces('import')(Import))

const tourStyles = {
  borderRadius: '4px'
}
